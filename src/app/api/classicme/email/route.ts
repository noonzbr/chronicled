import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    const { name, email, book } = await req.json();
    if (!email || !name) return NextResponse.json({ ok: true });

    const resend = new Resend(process.env.RESEND_API_KEY);

    await Promise.allSettled([
      resend.emails.send({
        from: "Chronicled <hello@getchronicled.art>",
        to: "natnunes12@yahoo.com",
        subject: `ClassicMe lead: ${name} — ${book}`,
        html: `<p style="font-family:Georgia,serif;color:#333;"><strong>${name}</strong> (<a href="mailto:${email}">${email}</a>) just used ClassicMe with <em>${book}</em>.</p><p>New warm lead for Chronicled.</p>`,
      }),
      resend.emails.send({
        from: "Chronicled <hello@getchronicled.art>",
        to: email,
        replyTo: "hello@getchronicled.art",
        subject: `Your ${book} passage — and what comes next`,
        html: `
<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=EB+Garamond:ital,wght@0,400;1,400&display=swap" rel="stylesheet"/>
</head><body style="margin:0;padding:0;background:#0D1117;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0D1117;padding:48px 20px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
<tr><td align="center" style="padding-bottom:32px;">
  <p style="font-family:'Cinzel',Georgia,serif;font-size:20px;letter-spacing:4px;color:#D4B86A;margin:0;text-transform:uppercase;">Chronicled</p>
  <p style="font-family:Georgia,serif;font-style:italic;font-size:12px;color:rgba(191,160,90,0.6);margin:6px 0 0;">ClassicMe</p>
</td></tr>
<tr><td style="background:#141B24;border:1px solid rgba(191,160,90,0.2);padding:44px;">
  <p style="font-family:'Cinzel',Georgia,serif;font-size:9px;letter-spacing:4px;color:#BFA05A;text-transform:uppercase;margin:0 0 20px;">Hello, ${name}</p>
  <h1 style="font-family:Georgia,serif;font-size:24px;font-weight:400;color:#F0DCA8;line-height:1.4;margin:0 0 20px;">Your ${book} roast was just the beginning.</h1>
  <div style="height:1px;background:linear-gradient(to right,transparent,#BFA05A,transparent);margin:0 0 24px;"></div>
  <p style="font-family:Georgia,serif;font-style:italic;font-size:16px;color:rgba(240,220,168,0.75);line-height:1.8;margin:0 0 28px;">
    ClassicMe gives you a taste. Chronicled gives you the whole story — your real life, 10,000 words, written in the voice of the classic you love most.
  </p>
  <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding-bottom:24px;">
    <a href="https://getchronicled.art/begin" style="display:inline-block;font-family:'Cinzel',Georgia,serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#0D1117;background:#D4B86A;text-decoration:none;padding:15px 36px;font-weight:600;">
      Begin Your Chronicle →
    </a>
  </td></tr></table>
  <p style="font-family:Georgia,serif;font-style:italic;font-size:13px;color:rgba(191,160,90,0.4);text-align:center;margin:0;">Your life. A legendary narrative.</p>
</td></tr>
<tr><td align="center" style="padding-top:24px;">
  <p style="font-family:Georgia,serif;font-size:11px;color:rgba(191,160,90,0.25);margin:0;">getchronicled.art &nbsp;·&nbsp; You're receiving this because you tried ClassicMe.</p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`,
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[ClassicMe] Email error:", err);
    return NextResponse.json({ ok: true });
  }
}
