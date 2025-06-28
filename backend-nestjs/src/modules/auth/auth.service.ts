import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcryptjs";
import { ConfigService } from "@nestjs/config";
import {
  User,
  UserRole,
  UserStatus,
  AuthProvider,
} from "../users/entities/user.entity";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { GoogleProfileDto } from "./dto/google-profile.dto";

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface AuthResult {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResult> {
    const { email, password, firstName, lastName, username } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });

    if (existingUser) {
      throw new ConflictException(
        "User with this email or username already exists",
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      username,
      role: UserRole.EMPLOYEE,
      status: UserStatus.PENDING,
      authProvider: AuthProvider.LOCAL,
    });

    const savedUser = await this.userRepository.save(user);

    // Generate access token
    const accessToken = this.generateAccessToken(savedUser);

    return {
      user: savedUser,
      accessToken,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResult> {
    const { email, password } = loginDto;

    // Find user by email or username
    const user = await this.userRepository.findOne({
      where: [{ email }, { username: email }],
      relations: ["company"],
    });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    // Check if user is active
    if (user.status === UserStatus.SUSPENDED) {
      throw new UnauthorizedException("Account is suspended");
    }

    // Update last login
    await this.userRepository.update(user.id, {
      lastLoginAt: new Date(),
    });

    // Generate access token
    const accessToken = this.generateAccessToken(user);

    return {
      user,
      accessToken,
    };
  }

  async googleLogin(profile: GoogleProfileDto): Promise<AuthResult> {
    let user = await this.userRepository.findOne({
      where: { googleId: profile.id },
      relations: ["company"],
    });

    if (!user) {
      // Check if user exists with same email
      user = await this.userRepository.findOne({
        where: { email: profile.email },
        relations: ["company"],
      });

      if (user) {
        // Link Google account to existing user
        user.googleId = profile.id;
        user.authProvider = AuthProvider.GOOGLE;
        await this.userRepository.save(user);
      } else {
        // Create new user
        user = this.userRepository.create({
          email: profile.email,
          firstName: profile.firstName,
          lastName: profile.lastName,
          avatar: profile.picture,
          googleId: profile.id,
          authProvider: AuthProvider.GOOGLE,
          emailVerified: true,
          role: UserRole.EMPLOYEE,
          status: UserStatus.ACTIVE,
        });
        user = await this.userRepository.save(user);
      }
    }

    // Update last login
    await this.userRepository.update(user.id, {
      lastLoginAt: new Date(),
    });

    // Generate access token
    const accessToken = this.generateAccessToken(user);

    return {
      user,
      accessToken,
    };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: [{ email }, { username: email }],
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    return null;
  }

  async validateJwtPayload(payload: JwtPayload): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
      relations: ["company"],
    });

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    if (user.status === UserStatus.SUSPENDED) {
      throw new UnauthorizedException("Account is suspended");
    }

    return user;
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ["id", "password"],
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      throw new BadRequestException("Current password is incorrect");
    }

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await this.userRepository.update(userId, {
      password: hashedNewPassword,
    });
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const { email } = forgotPasswordDto;

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      // Don't reveal if email exists
      return;
    }

    // Generate reset token
    const resetToken = this.generateResetToken();
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    await this.userRepository.update(user.id, {
      passwordResetToken: resetToken,
      passwordResetExpires: resetExpires,
    });

    // TODO: Send email with reset token
    // await this.emailService.sendPasswordReset(user.email, resetToken);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { token, newPassword } = resetPasswordDto;

    const user = await this.userRepository.findOne({
      where: {
        passwordResetToken: token,
      },
    });

    if (!user || user.passwordResetExpires < new Date()) {
      throw new BadRequestException("Invalid or expired reset token");
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password and clear reset token
    await this.userRepository.update(user.id, {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    });
  }

  private generateAccessToken(user: User): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }

  private generateResetToken(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  async refreshToken(userId: string): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    return this.generateAccessToken(user);
  }

  async logout(userId: string): Promise<void> {
    // In a production app, you might want to blacklist the token
    // or store refresh tokens and invalidate them
    await this.userRepository.update(userId, {
      lastLoginAt: new Date(),
    });
  }
}
