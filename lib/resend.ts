import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends verification email to user with report access link
 */
export async function sendVerificationEmail(params: {
  email: string;
  firstName: string;
  token: string;
  screenshotUrl?: string;
}): Promise<void> {
  const { email, firstName, token, screenshotUrl } = params;

  if (!process.env.NEXT_PUBLIC_SITE_URL) {
    throw new Error("NEXT_PUBLIC_SITE_URL environment variable is not set");
  }

  const reportLink = `${process.env.NEXT_PUBLIC_SITE_URL}/report/${token}`;
  const logoUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/BizboLogo.png`;

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
          <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f9f9f8;">
            <div style="background-color: #FFFFFF; padding: 40px 20px; text-align: center;">
              <img src="${logoUrl}" alt="Bizbo" style="max-width: 150px; height: auto; display: block; margin: 0 auto 30px;">
              
              <div style="background-color: #e1e3dbff; padding: 40px; border-radius: 12px; text-align: left; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 24px; font-weight: 700;">Hi ${firstName},</h1>
                
                <p style="font-size: 16px; margin-bottom: 24px; color: #4b5563;">
                  Great news! Your comprehensive website experience (UX) analysis is complete.
                </p>
                
                <p style="font-size: 16px; margin-bottom: 24px; color: #4b5563;">
                  We've completed a detailed review of your website and identified actionable insights that could transform your user experience. Inside your report, you'll discover:
                </p>
                
                <ul style="font-size: 16px; margin-bottom: 32px; padding-left: 20px; color: #4b5563;">
                  <li style="margin-bottom: 12px;">Top 5 quick wins to fix UX issues and improve conversions</li>
                  <li style="margin-bottom: 12px;">Performance opportunities tailored to your site</li>
                </ul>
                
                <p style="font-size: 16px; margin-bottom: 32px; color: #4b5563;">
                  This comprehensive analysis is our complimentary gift to help you succeed.
                </p>
                
                <div style="text-align: center; margin-bottom: 32px;">
                  <a href="${reportLink}" 
                     style="display: inline-block; background-color: #bef264; color: #365314; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: 600; transition: background-color 0.2s;">
                    View My Free Report →
                  </a>
                </div>

                ${screenshotUrl ? `
                  <div style="margin-bottom: 32px; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb;">
                    <img src="${screenshotUrl}" alt="Website Screenshot" style="width: 100%; height: auto; display: block;">
                  </div>
                ` : ''}
                
                <p style="font-size: 14px; color: #6b7280; margin-bottom: 32px; text-align: center;">
                  Or copy and paste this link into your browser:<br>
                  <a href="${reportLink}" style="color: #3d4b29; word-break: break-all; text-decoration: underline;">${reportLink}</a>
                </p>
                
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
                
                <p style="font-size: 16px; margin-bottom: 24px; color: #4b5563;">
                  This quick win report highlights your top opportunities. Want a deeper analysis? We're offering a free comprehensive manual assessment — normally a premium offering.
                </p>
                
                <p style="font-size: 14px; color: #6b7280; margin-bottom: 0;">
                  Your report will remain accessible for 7 days, so you can review it at your convenience.
                </p>
              </div>
              
              <div style="margin-top: 30px; text-align: center;">
                <p style="font-size: 12px; color: #4b5144;">
                  © ${new Date().getFullYear()} Bizbo. All rights reserved.
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
Hi ${firstName},

Great news! Your comprehensive website experience (UX) analysis is complete.

We've completed a detailed review of your website and identified actionable insights that could transform your user experience. Inside your report, you'll discover:

• Top 5 quick wins to fix UX issues and improve conversions
• Performance opportunities tailored to your site

This comprehensive analysis is our complimentary gift to help you succeed.

Click below to verify your email and unlock your full report:

${reportLink}

This quick win report highlights your top opportunities. Want a deeper analysis? We're offering a free comprehensive manual assessment — normally a premium offering.

Your report will remain accessible for 7 days, so you can review it at your convenience.

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

