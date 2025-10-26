import { json } from '@sveltejs/kit';
import { Resend } from 'resend';
import sgMail from '@sendgrid/mail';
import { RESEND_API_KEY, SENDER_EMAIL, SENDGRID_API_KEY } from '$env/static/private';

// Initialize Resend client here as its constructor is safe.
const resend = new Resend(RESEND_API_KEY);

export async function POST({ request }) {
  const { email } = await request.json();

  if (!email) {
    return json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    // Initialize SendGrid client inside the handler to catch potential startup errors.
    sgMail.setApiKey(SENDGRID_API_KEY);

    const resendPromise = resend.emails.send({
      from: SENDER_EMAIL,
      to: email,
      subject: 'Hello from Resend!',
      html: '<p>Hi there! This is a test email from the SvelteKit email tester app.</p>',
    });

    const sendgridPromise = sgMail.send({
      from: SENDER_EMAIL,
      to: email,
      subject: 'Hello from SendGrid!',
      html: '<p>Hi there! This is a test email from the SvelteKit email tester app.</p>',
    });

    const [resendResult, sendgridResult] = await Promise.allSettled([resendPromise, sendgridPromise]);

    const results = {
      resend: resendResult.status === 'fulfilled' ? 'success' : 'failed',
      sendgrid: sendgridResult.status === 'fulfilled' ? 'success' : 'failed',
    };

    if (resendResult.status === 'rejected') {
      console.error('Resend error:', resendResult.reason);
    }
    if (sendgridResult.status === 'rejected') {
      console.error('SendGrid error:', sendgridResult.reason);
    }

    return json(results);
  } catch (error) {
    console.error('Generic error in /api/send:', error);
    // Return a generic error response that the frontend can handle
    return json(
      {
        resend: 'failed',
        sendgrid: 'failed',
        error: 'An unexpected error occurred on the server.',
      },
      { status: 500 }
    );
  }
}
