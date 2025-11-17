import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends verification email to user with report access link
 */
export async function sendVerificationEmail(params: {
  email: string;
  firstName: string;
  token: string;
}): Promise<void> {
  const { email, firstName, token } = params;

  if (!process.env.NEXT_PUBLIC_SITE_URL) {
    throw new Error("NEXT_PUBLIC_SITE_URL environment variable is not set");
  }

  const reportLink = `${process.env.NEXT_PUBLIC_SITE_URL}/report/${token}`;

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "noreply@bizbo.co.nz",
      to: email,
      subject: "Verify your email to access your UX analysis report",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #ffffff; padding: 30px; border-radius: 8px;">
              <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 20px;">Hi ${firstName},</h1>
              
              <p style="font-size: 16px; margin-bottom: 20px;">
                Thank you for requesting a UX analysis! Your report is ready and waiting for you.
              </p>
              
              <p style="font-size: 16px; margin-bottom: 30px;">
                Click the button below to verify your email and access your comprehensive UX analysis report:
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${reportLink}" 
                   style="display: inline-block; background-color: #0070f3; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-size: 16px; font-weight: 600;">
                  View My Report
                </a>
              </div>
              
              <p style="font-size: 14px; color: #666; margin-top: 30px;">
                Or copy and paste this link into your browser:<br>
                <a href="${reportLink}" style="color: #4ce846; word-break: break-all;">${reportLink}</a>
              </p>
              
              <p style="font-size: 14px; color: #666; margin-top: 20px;">
                This link will expire in 24 hours for security reasons.
              </p>
              
              <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
              
              <p style="font-size: 12px; color: #999; margin-top: 20px;">
                If you didn't request this analysis, you can safely ignore this email.
              </p>
              
              <p style="font-size: 12px; color: #999; margin-top: 10px;">
                Best regards,<br>
                The Bizbo Team
              </p>
            </div>
          </body>
        </html>
      `,
      text: `
Hi ${firstName},

Thank you for requesting a UX analysis! Your report is ready and waiting for you.

Click the link below to verify your email and access your comprehensive UX analysis report:

${reportLink}

This link will expire in 24 hours for security reasons.

If you didn't request this analysis, you can safely ignore this email.

Best regards,
The Bizbo Team
      `,
    });
  } catch (error) {
    console.error("Resend email error:", error);
    throw new Error(
      `Failed to send verification email: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

