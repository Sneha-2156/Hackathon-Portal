// HTML email templates. Sender is always Code-a-Nova; no personal names are used.
const eventName = () => process.env.EVENT_NAME || 'Code-a-Nova Hackathon';

// Escape user-provided text before placing it in HTML
const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const wrap = (body) => `
<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:24px;color:#12142b">
  <h2 style="margin:0 0 16px;color:#3b3bf5">Code-a-Nova</h2>
  ${body}
  <p style="margin-top:24px;color:#667;font-size:12px">This is an automated message from Code-a-Nova.</p>
</div>`;

exports.otpEmail = (otp) => ({
  subject: 'Your Code-a-Nova verification code',
  html: wrap(`
    <p>Use this code to verify your email address:</p>
    <p style="font-size:32px;letter-spacing:8px;font-weight:bold;margin:16px 0">${esc(otp)}</p>
    <p>It expires in 10 minutes and can be used once.</p>`),
});

exports.confirmationEmail = (r) => ({
  subject: `Registration confirmed: ${eventName()}`,
  html: wrap(`
    <p>Hi ${esc(r.fullName)}, your registration for <b>${esc(eventName())}</b> is confirmed.</p>
    <table style="border-collapse:collapse;width:100%;font-size:14px">
      <tr><td style="padding:6px 0;color:#667">Domain / track</td><td>${esc(r.track)}</td></tr>
      <tr><td style="padding:6px 0;color:#667">Project name</td><td>${esc(r.projectName)}</td></tr>
      <tr><td style="padding:6px 0;color:#667">College</td><td>${esc(r.college)}</td></tr>
      <tr><td style="padding:6px 0;color:#667">Team size</td><td>${esc(r.teamSize)}</td></tr>
    </table>
    ${
      r.members.length
        ? `<p style="margin-bottom:4px"><b>Team members</b></p><ul style="margin-top:0">${r.members
            .map((m) => `<li>${esc(m.name)} (${esc(m.email)})</li>`)
            .join('')}</ul>`
        : '<p>You are registered as a solo participant.</p>'
    }
    <p>You can view or withdraw your registration from your dashboard.</p>`),
});
