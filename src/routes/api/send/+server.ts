import { json } from '@sveltejs/kit';
import { Resend } from 'resend';
import { RESEND_API_KEY, RESEND_SENDER_EMAIL, SENDGRID_API_KEY, SENDGRID_SENDER_EMAIL } from '$env/static/private';

// Initialize Resend client as its constructor is safe.
const resend = new Resend(RESEND_API_KEY);

export async function POST({ request }) {
  const { email } = await request.json();

  if (!email) {
    return json({ error: 'Email is required' }, { status: 400 });
  }

  const resendPromise = resend.emails.send({
    from: RESEND_SENDER_EMAIL,
    to: email,
    subject: 'Hello from Resend!',
    html: '<p>Hi there! This is a test email from the SvelteKit email tester app.</p>',
  });

  const sendgridPromise = fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email }] }],
      from: { email: SENDGRID_SENDER_EMAIL },
      subject: 'Hello from SendGrid!',
      content: [{ type: 'text/html', value: '<p>Hi there! This is a test email from the SvelteKit email tester app.</p>' }],
    }),
  });

  const [resendResult, sendgridResult] = await Promise.allSettled([resendPromise, sendgridPromise]);

  let sendgridStatus = 'failed';
  if (sendgridResult.status === 'fulfilled' && sendgridResult.value.ok) {
    sendgridStatus = 'success';
  } else if (sendgridResult.status === 'fulfilled') {
    // Log the error response from SendGrid for debugging on the server
    const errorBody = await sendgridResult.value.text();
    console.error('SendGrid API Error:', errorBody);
  } else {
    // Log fetch-related errors
    console.error('SendGrid fetch Error:', sendgridResult.reason);
  }

  const results = {
    resend: resendResult.status === 'fulfilled' ? 'success' : 'failed',
    sendgrid: sendgridStatus,
  };

  if (resendResult.status === 'rejected') {
    console.error('Resend error:', resendResult.reason);
  }

  return json(results);
}
