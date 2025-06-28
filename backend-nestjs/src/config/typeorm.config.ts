import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm";
import { User } from "../modules/users/entities/user.entity";
import { Coach } from "../modules/coaches/entities/coach.entity";
import { Company } from "../modules/companies/entities/company.entity";
import { Session } from "../modules/sessions/entities/session.entity";
import { Review } from "../modules/reviews/entities/review.entity";
import { Payment } from "../modules/payments/entities/payment.entity";
import { MatchingRequest } from "../modules/matching/entities/matching-request.entity";
import { Match } from "../modules/matching/entities/match.entity";
import { ChatRoom } from "../modules/chat/entities/chat-room.entity";
import { ChatMessage } from "../modules/chat/entities/chat-message.entity";
import { Notification } from "../modules/notifications/entities/notification.entity";
import { AdminSettings } from "../modules/admin/entities/admin-settings.entity";
import { ServiceCharge } from "../modules/admin/entities/service-charge.entity";

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "peptok_dev",
  entities: [
    User,
    Coach,
    Company,
    Session,
    Review,
    Payment,
    MatchingRequest,
    Match,
    ChatRoom,
    ChatMessage,
    Notification,
    AdminSettings,
    ServiceCharge,
  ],
  migrations: ["src/database/migrations/*.ts"],
  synchronize: process.env.NODE_ENV === "development",
  logging: process.env.NODE_ENV === "development",
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
};

// For CLI operations
export default new DataSource({
  ...typeOrmConfig,
  migrations: ["src/database/migrations/*.ts"],
  entities: ["src/**/*.entity.ts"],
} as any);
