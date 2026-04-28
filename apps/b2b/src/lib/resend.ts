import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface InviteEmailOptions {
  to: string;
  orgName: string;
  orgColor: string;
  inviteUrl: string;
  inviterName?: string;
}

export async function sendInviteEmail({ to, orgName, orgColor, inviteUrl, inviterName }: InviteEmailOptions) {
  const fromName = inviterName || orgName;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F4F7FB;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F7FB;padding:40px 20px">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #E2E8F0">
        <tr><td style="background:${orgColor};padding:24px 32px">
          <span style="color:#FFFFFF;font-size:16px;font-weight:700">${orgName}</span>
          <span style="color:rgba(255,255,255,0.6);font-size:12px;font-weight:500;margin-left:8px">via PayWatch</span>
        </td></tr>
        <tr><td style="padding:32px">
          <h1 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#0F172A">Je bent uitgenodigd</h1>
          <p style="margin:0 0 24px;font-size:14px;color:#64748B;line-height:1.6">
            ${orgName} nodigt je uit om PayWatch te gebruiken. Met PayWatch houd je overzicht over je rekeningen en betalingen.
          </p>
          <a href="${inviteUrl}" style="display:inline-block;padding:12px 24px;background:${orgColor};color:#FFFFFF;text-decoration:none;border-radius:4px;font-size:14px;font-weight:600">
            Account aanmaken
          </a>
          <p style="margin:24px 0 0;font-size:12px;color:#94A3B8;line-height:1.5">
            Of kopieer deze link:<br>
            <span style="color:#64748B;word-break:break-all">${inviteUrl}</span>
          </p>
          <p style="margin:16px 0 0;font-size:11px;color:#CBD5E1">
            Deze uitnodiging is 30 dagen geldig.
          </p>
        </td></tr>
        <tr><td style="padding:16px 32px;background:#F8FAFC;border-top:1px solid #E2E8F0">
          <span style="font-size:11px;color:#94A3B8">PayWatch — Rotterdam, Nederland</span>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    const { data, error } = await resend.emails.send({
      from: `${fromName} via PayWatch <noreply@paywatch.app>`,
      to,
      subject: `${orgName} nodigt je uit voor PayWatch`,
      html,
    });

    if (error) {
      console.error("[Resend] Send error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, emailId: data?.id };
  } catch (err: any) {
    console.error("[Resend] Exception:", err);
    return { success: false, error: err.message };
  }
}
