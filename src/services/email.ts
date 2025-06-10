export interface EmailTemplate {
  to: string;
  subject: string;
  htmlContent: string;
  textContent: string;
}

export interface TeamInvitationData {
  inviterName: string;
  companyName: string;
  role: "participant" | "observer";
  invitationLink: string;
  expiresAt: Date;
}

export class EmailService {
  private async sendEmail(template: EmailTemplate): Promise<boolean> {
    // In development/demo mode, we'll log the email and show a success message
    if (import.meta.env.DEV || import.meta.env.VITE_MOCK_EMAIL === "true") {
      console.log("📧 Email would be sent:", {
        to: template.to,
        subject: template.subject,
        content: template.textContent,
      });

      // Show what the email would look like in the console
      console.log("📧 Email Preview:");
      console.log("==========================================");
      console.log(`To: ${template.to}`);
      console.log(`Subject: ${template.subject}`);
      console.log("------------------------------------------");
      console.log(template.textContent);
      console.log("==========================================");

      // In a real implementation, you would use a service like:
      // - SendGrid: await sgMail.send(template)
      // - AWS SES: await ses.sendEmail(template)
      // - Nodemailer: await transporter.sendMail(template)
      // - EmailJS (for client-side): await emailjs.send(...)

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      return true;
    }

    // In production, integrate with your email service
    try {
      // Example integration with EmailJS for client-side email sending
      if (import.meta.env.VITE_EMAILJS_SERVICE_ID) {
        const emailjs = await import("emailjs-com");
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          {
            to_email: template.to,
            subject: template.subject,
            html_content: template.htmlContent,
            text_content: template.textContent,
          },
          import.meta.env.VITE_EMAILJS_USER_ID,
        );
        return true;
      }

      // If no email service is configured, fall back to logging
      console.warn(
        "No email service configured. Email would be sent:",
        template,
      );
      return true;
    } catch (error) {
      console.error("Failed to send email:", error);
      return false;
    }
  }

  async sendTeamInvitation(
    email: string,
    invitationData: TeamInvitationData,
  ): Promise<boolean> {
    const invitationLink = `${window.location.origin}/invitation/accept?token=${btoa(email + ":" + Date.now())}`;

    const template: EmailTemplate = {
      to: email,
      subject: `You're invited to join ${invitationData.companyName} on Peptok`,
      htmlContent: this.generateInvitationHTML(email, {
        ...invitationData,
        invitationLink,
      }),
      textContent: this.generateInvitationText(email, {
        ...invitationData,
        invitationLink,
      }),
    };

    return await this.sendEmail(template);
  }

  private generateInvitationHTML(
    email: string,
    data: TeamInvitationData,
  ): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Team Invitation - Peptok</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">You're Invited!</h1>
        <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">Join your team on Peptok</p>
    </div>

    <div style="background: white; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; margin-bottom: 20px;">Hi there!</p>

        <p style="font-size: 16px; margin-bottom: 20px;">
            <strong>${data.inviterName}</strong> has invited you to join <strong>${data.companyName}</strong>'s mentorship program on Peptok.
        </p>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #495057;">Your Role:</h3>
            <p style="margin: 0; font-size: 16px; color: #6c757d;">
                ${
                  data.role === "participant"
                    ? "🎯 <strong>Participant</strong> - Actively participate in mentorship sessions and track your progress"
                    : "👁️ <strong>Observer</strong> - Monitor progress and attend sessions as an observer"
                }
            </p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
            <a href="${data.invitationLink}"
               style="background: #007bff; color: white; text-decoration: none; padding: 15px 30px; border-radius: 6px; font-size: 16px; font-weight: bold; display: inline-block;">
                Accept Invitation
            </a>
        </div>

        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #856404;">
                ⏰ This invitation expires on ${data.expiresAt.toLocaleDateString()} at ${data.expiresAt.toLocaleTimeString()}
            </p>
        </div>

        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

        <p style="font-size: 14px; color: #6c757d; margin-bottom: 20px;">
            If you can't click the button above, copy and paste this link into your browser:
        </p>
        <p style="font-size: 12px; color: #adb5bd; word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 4px;">
            ${data.invitationLink}
        </p>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="font-size: 14px; color: #6c757d; margin: 0;">
                Questions? Contact your team admin or reply to this email.
            </p>
            <p style="font-size: 12px; color: #adb5bd; margin: 10px 0 0 0;">
                This email was sent by Peptok on behalf of ${data.companyName}
            </p>
        </div>
    </div>
</body>
</html>
    `;
  }

  private generateInvitationText(
    email: string,
    data: TeamInvitationData,
  ): string {
    return `
You're invited to join ${data.companyName} on Peptok!

Hi there!

${data.inviterName} has invited you to join ${data.companyName}'s mentorship program on Peptok.

Your Role: ${data.role === "participant" ? "Participant - Actively participate in mentorship sessions and track your progress" : "Observer - Monitor progress and attend sessions as an observer"}

To accept this invitation, visit: ${data.invitationLink}

This invitation expires on ${data.expiresAt.toLocaleDateString()} at ${data.expiresAt.toLocaleTimeString()}

If you have any questions, contact your team admin.

--
Peptok Team
    `;
  }

  async sendWelcomeEmail(email: string, companyName: string): Promise<boolean> {
    const template: EmailTemplate = {
      to: email,
      subject: `Welcome to ${companyName} on Peptok!`,
      htmlContent: `<h1>Welcome!</h1><p>You've successfully joined ${companyName} on Peptok.</p>`,
      textContent: `Welcome! You've successfully joined ${companyName} on Peptok.`,
    };

    return await this.sendEmail(template);
  }

  async sendPasswordResetEmail(
    email: string,
    resetToken: string,
  ): Promise<boolean> {
    const resetLink = `${window.location.origin}/reset-password?token=${resetToken}`;

    const template: EmailTemplate = {
      to: email,
      subject: "Reset your Peptok password",
      htmlContent: `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>This link expires in 1 hour.</p>
      `,
      textContent: `
        Password Reset Request

        Click the link below to reset your password:
        ${resetLink}

        This link expires in 1 hour.
      `,
    };

    return await this.sendEmail(template);
  }
}

export const emailService = new EmailService();
