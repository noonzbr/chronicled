import { Resend } from "resend";

// Lazy initialization — avoids build-time error when key is not yet set
function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

type BookEmailData = {
  toEmail: string;
  toName: string;
  bookTitle: string;
  bookArchetype: string;
  downloadToken: string;
  tier: "digital" | "softcover" | "hardcover";
  pdfUrl?: string | null;
};

export async function sendOrderEmail(data: BookEmailData) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://getchronicled.art";
  const downloadUrl = `${appUrl}/download?token=${data.downloadToken}`;

  const tierMessages = {
    digital:   { subject: "Your Chronicle is ready to download", subline: "Your digital PDF is ready." },
    softcover: { subject: "Your Chronicle is on its way", subline: "Your book has been sent to print. Allow 7–14 business days." },
    hardcover: { subject: "Your Chronicle & Royal Portrait are being crafted", subline: "Your hardcover and Royal Portrait are in production. Allow 7–14 business days." },
  };

  const msg = tierMessages[data.tier];

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=EB+Garamond:ital,wght@0,400;1,400&display=swap" rel="stylesheet"/>
  <title>${msg.subject}</title>
</head>
<body style="margin:0;padding:0;background:#0D1117;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0D1117;padding:48px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:40px;">
              <p style="font-family:'Cinzel',Georgia,serif;font-size:22px;letter-spacing:4px;color:#D4B86A;margin:0;text-transform:uppercase;">
                Chronicled
              </p>
              <p style="font-family:Georgia,serif;font-style:italic;font-size:12px;color:rgba(191,160,90,0.6);margin:6px 0 0;letter-spacing:1px;">
                Your life. A legendary narrative.
              </p>
            </td>
          </tr>

          <!-- Gold rule -->
          <tr>
            <td style="padding-bottom:40px;">
              <div style="height:1px;background:linear-gradient(to right,transparent,#BFA05A,transparent);"></div>
            </td>
          </tr>

          <!-- Main card -->
          <tr>
            <td style="background:#141B24;border:1px solid rgba(191,160,90,0.2);padding:48px 44px;">

              <!-- Icon -->
              <p style="text-align:center;font-size:40px;margin:0 0 24px;">✦</p>

              <!-- Heading -->
              <p style="font-family:'Cinzel',Georgia,serif;font-size:10px;letter-spacing:6px;color:#BFA05A;text-align:center;text-transform:uppercase;margin:0 0 16px;">
                ${data.tier === "digital" ? "Your Chronicle Is Ready" : "Order Confirmed"}
              </p>

              <h1 style="font-family:Georgia,serif;font-size:26px;font-weight:400;color:#F0DCA8;text-align:center;line-height:1.35;margin:0 0 24px;">
                ${data.bookTitle}
              </h1>

              <!-- Rule -->
              <div style="height:1px;background:linear-gradient(to right,transparent,#BFA05A,transparent);margin:0 auto 28px;max-width:160px;"></div>

              <!-- Subline -->
              <p style="font-family:Georgia,serif;font-style:italic;font-size:16px;color:rgba(240,220,168,0.75);text-align:center;line-height:1.8;margin:0 0 36px;">
                ${msg.subline}
              </p>

              ${data.tier === "digital" ? `
              <!-- Download button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:32px;">
                    <a href="${downloadUrl}"
                       style="display:inline-block;font-family:'Cinzel',Georgia,serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#0D1117;background:#D4B86A;text-decoration:none;padding:16px 40px;">
                      Download Your Chronicle →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-family:Georgia,serif;font-style:italic;font-size:13px;color:rgba(240,220,168,0.45);text-align:center;margin:0 0 8px;">
                Your link is private and unique to you.
              </p>
              <p style="font-family:Georgia,serif;font-style:italic;font-size:12px;color:rgba(191,160,90,0.4);text-align:center;margin:0;">
                If the button doesn't work, copy this link:<br/>
                <span style="color:rgba(191,160,90,0.6);word-break:break-all;">${downloadUrl}</span>
              </p>
              ` : `
              <!-- Physical order note -->
              <p style="font-family:Georgia,serif;font-style:italic;font-size:15px;color:rgba(240,220,168,0.65);text-align:center;line-height:1.9;margin:0 0 24px;">
                We will send you a shipping confirmation once your book leaves our printer.
                Your digital preview remains available at the link below.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${downloadUrl}"
                       style="display:inline-block;font-family:'Cinzel',Georgia,serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#BFA05A;border:1px solid rgba(191,160,90,0.4);text-decoration:none;padding:14px 32px;">
                      View Your Digital Preview
                    </a>
                  </td>
                </tr>
              </table>
              `}

            </td>
          </tr>

          <!-- Quote block -->
          <tr>
            <td style="padding:32px 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border:1px solid rgba(191,160,90,0.15);padding:24px 32px;background:rgba(191,160,90,0.03);">
                    <p style="font-family:Georgia,serif;font-style:italic;font-size:15px;color:rgba(240,220,168,0.6);text-align:center;line-height:1.8;margin:0 0 10px;">
                      "Your life. A legendary narrative."
                    </p>
                    <p style="font-family:Georgia,serif;font-size:10px;letter-spacing:3px;color:rgba(191,160,90,0.5);text-align:center;margin:0;text-transform:uppercase;">
                      — Chronicled
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:8px;">
              <p style="font-family:Georgia,serif;font-size:11px;color:rgba(191,160,90,0.3);margin:0 0 6px;letter-spacing:1px;">
                getchronicled.art
              </p>
              <p style="font-family:Georgia,serif;font-style:italic;font-size:11px;color:rgba(240,220,168,0.2);margin:0;">
                This email was sent because you purchased a Chronicled chronicle.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  // Attach the PDF for digital orders when we have a generated file URL.
  const safeName = (data.bookTitle || "Your Chronicle").replace(/[^\w\s-]/g, "").trim() || "Your Chronicle";
  const attachments =
    data.tier === "digital" && data.pdfUrl
      ? [{ filename: `${safeName}.pdf`, path: data.pdfUrl }]
      : undefined;

  const resend = getResend();
  const { data: result, error } = await resend.emails.send({
    from: "Chronicled <hello@getchronicled.art>",
    to: data.toEmail,
    subject: `${msg.subject} — ${data.bookTitle}`,
    html,
    ...(attachments ? { attachments } : {}),
  });

  if (error) {
    console.error("Resend error:", error);
    throw new Error(`Email failed: ${error.message}`);
  }

  return result;
}
