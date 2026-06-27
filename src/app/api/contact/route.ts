import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
    }

    const safeMessage = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const subjectLine = subject
      ? `[Chronicled] ${subject}`
      : `[Chronicled] New message from ${name}`;

    const { error } = await resend.emails.send({
      from: "Chronicled Contact <hello@getchronicled.art>",
      to: "natnunes12@yahoo.com",
      replyTo: email,
      subject: subjectLine,
      html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#0D1117;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0D1117;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
        <tr><td align="center" style="padding-bottom:32px;">
          <p style="font-family:Georgia,serif;font-size:20px;letter-spacing:4px;color:#D4B86A;margin:0;text-transform:uppercase;">Chronicled</p>
          <p style="font-family:Georgia,serif;font-style:italic;font-size:12px;color:rgba(191,160,90,0.6);margin:6px 0 0;">Contact Form Submission</p>
        </td></tr>
        <tr><td style="background:#141B24;border:1px solid rgba(191,160,90,0.2);padding:40px;">
          <p style="font-family:Georgia,serif;font-size:10px;letter-spacing:4px;color:#BFA05A;text-transform:uppercase;margin:0 0 6px;">From</p>
          <p style="font-family:Georgia,serif;font-size:16px;color:#F0DCA8;margin:0;">${name}</p>
          <p style="font-family:Georgia,serif;font-size:14px;color:rgba(191,160,90,0.7);margin:4px 0 20px;">${email}</p>
          <div style="height:1px;background:linear-gradient(to right,transparent,#BFA05A,transparent);margin-bottom:20px;"></div>
          ${subject ? `<p style="font-family:Georgia,serif;font-size:10px;letter-spacing:4px;color:#BFA05A;text-transform:uppercase;margin:0 0 6px;">Subject</p>
          <p style="font-family:Georgia,serif;font-size:16px;color:#F0DCA8;margin:0 0 20px;">${subject}</p>
          <div style="height:1px;background:linear-gradient(to right,transparent,#BFA05A,transparent);margin-bottom:20px;"></div>` : ""}
          <p style="font-family:Georgia,serif;font-size:10px;letter-spacing:4px;color:#BFA05A;text-transform:uppercase;margin:0 0 12px;">Message</p>
          <p style="font-family:Georgia,serif;font-size:16px;color:#F0DCA8;line-height:1.8;margin:0;white-space:pre-wrap;">${safeMessage}</p>
        </td></tr>
        <tr><td align="center" style="padding-top:24px;">
          <p style="font-family:Georgia,serif;font-size:11px;color:rgba(191,160,90,0.3);margin:0;">Reply directly to this email to respond to ${name}.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
    });

    if (error) {
      console.error("[Contact] Resend error:", error);
      return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[Contact] Error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
