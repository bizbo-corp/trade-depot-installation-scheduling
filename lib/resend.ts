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
              <div style="margin-bottom: 30px; text-align: left;">
                <svg
                  width="124"
                  height="36"
                  viewBox="0 0 124 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style="display: inline-block;"
                >
                  <rect width="36" height="36" rx="18" fill="#1a1a1a" />
                  <rect
                    x="11.7273"
                    y="10.0909"
                    width="9.81818"
                    height="5.45455"
                    rx="2.72727"
                    fill="#ffffff"
                  />
                  <rect
                    x="11.7273"
                    y="16.9091"
                    width="12.2727"
                    height="8.72727"
                    rx="4.36364"
                    fill="#ffffff"
                  />
                </svg>
              </div>
              
              <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 20px;">Hi ${firstName},</h1>
              
              <p style="font-size: 16px; margin-bottom: 20px;">
                Great news! Your comprehensive website experience (UX) analysis is complete.
              </p>
              
              <p style="font-size: 16px; margin-bottom: 20px;">
                We've completed a detailed review of your website and identified actionable insights that could transform your user experience. Inside your report, you'll discover:
              </p>
              
              <ul style="font-size: 16px; margin-bottom: 20px; padding-left: 20px;">
                <li style="margin-bottom: 10px;">Top 5 quick wins to fix UX issues and improve conversions</li>
                <li style="margin-bottom: 10px;">Performance opportunities tailored to your site</li>
              </ul>
              
              <p style="font-size: 16px; margin-bottom: 20px;">
                This comprehensive analysis is our complimentary gift to help you succeed.
              </p>
              
              <p style="font-size: 16px; margin-bottom: 30px;">
                Click below to verify your email and unlock your full report:
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${reportLink}" 
                   style="display: inline-block; background-color: #bef264; color: #365314; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-size: 16px; font-weight: 600;">
                  View My Free Report →
                </a>
              </div>
              
              <p style="font-size: 14px; color: #666; margin-top: 30px;">
                Or copy and paste this link into your browser:<br>
                <a href="${reportLink}" style="color: #bef264; word-break: break-all;">${reportLink}</a>
              </p>
              
              <p style="font-size: 16px; margin-top: 30px; margin-bottom: 20px;">
                This quick win report highlights your top opportunities. Want a deeper analysis? We're offering a free comprehensive manual assessment — normally a premium offering.
              </p>
              
              <p style="font-size: 14px; color: #666; margin-top: 20px;">
                Your report will remain accessible for 7 days, so you can review it at your convenience.
              </p>
              
              <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
              
              <p style="font-size: 12px; color: #999; margin-top: 20px;">
                Best regards,<br>
                The Bizbo Team
              </p>
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

