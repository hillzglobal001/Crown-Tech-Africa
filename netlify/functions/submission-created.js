// This function runs automatically every time someone submits the
// "quote-request" form on the Crown Tech Africa site. Netlify calls
// any function named exactly "submission-created" right after a
// form submission — no extra wiring needed beyond deploying this file.

exports.handler = async (event) => {
  try {
    const { payload } = JSON.parse(event.body);
    const data = payload.data || {};

    const name = data.name || 'there';
    const email = data.email;
    const business = data.business || 'Not provided';
    const phone = data.phone || 'Not provided';
    const service = data.service || 'Not specified';
    const budget = data.budget || 'Not specified';
    const timeline = data.timeline || 'Not specified';
    const message = data.message || 'Not provided';

    if (!email) {
      console.error('No email found on submission — skipping send.');
      return { statusCode: 200, body: 'No email present, skipped.' };
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const FROM_EMAIL = process.env.FROM_EMAIL || 'Crown Tech Africa <hello@crowntechafrica.com>';
    const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || 'hello@crowntechafrica.com';

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set in environment variables.');
      return { statusCode: 500, body: 'Missing RESEND_API_KEY.' };
    }

    const submittedDate = new Date(payload.created_at || Date.now()).toLocaleString('en-US', {
      timeZone: 'Africa/Lagos',
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    async function sendEmail({ to, subject, html, replyTo }) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to,
          subject,
          html,
          ...(replyTo ? { reply_to: replyTo } : {})
        })
      });
      if (!res.ok) {
        const errText = await res.text();
        console.error('Resend API error:', res.status, errText);
      }
      return res;
    }

    // 1. Internal notification — full structured details, to you
    const internalSubject = `New Quote Request — ${service} — ${business}`;
    const internalHtml = `
      <h2 style="font-family:Georgia,serif;">New Quote Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Business Name:</strong> ${business}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Service Interested In:</strong> ${service}</p>
      <p><strong>Budget:</strong> ${budget}</p>
      <p><strong>Timeline:</strong> ${timeline}</p>
      <p><strong>Project Description:</strong><br>${message.replace(/\n/g, '<br>')}</p>
      <p><strong>Date Submitted:</strong> ${submittedDate}</p>
    `;

    // 2. Auto-reply — to the client who submitted the form
    const firstName = name.split(' ')[0];
    const autoReplySubject = "We've Received Your Quote Request";
    const autoReplyHtml = `
      <p>Hello ${firstName},</p>
      <p>Thank you for contacting Crown Tech Africa.</p>
      <p>We've successfully received your enquiry and are currently reviewing your requirements. Our team will prepare a tailored quotation and respond within 24–48 hours.</p>
      <p>If we require any additional information, we'll reach out using the contact details you provided.</p>
      <p>We appreciate your interest in working with us.</p>
      <p><em>Built on Strategy. Crowned by Results.</em></p>
      <p>Kind regards,<br>
      Nathan Ugwu<br>
      Founder<br>
      Crown Tech Africa</p>
    `;

    await Promise.all([
      sendEmail({ to: NOTIFY_EMAIL, subject: internalSubject, html: internalHtml, replyTo: email }),
      sendEmail({ to: email, subject: autoReplySubject, html: autoReplyHtml })
    ]);

    return { statusCode: 200, body: 'Emails sent successfully.' };
  } catch (err) {
    console.error('submission-created function error:', err);
    return { statusCode: 500, body: 'Error processing submission.' };
  }
};
