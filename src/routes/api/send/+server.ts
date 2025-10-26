import { json } from '@sveltejs/kit';
import { Resend } from 'resend';
import { RESEND_API_KEY, SENDER_EMAIL } from '$env/static/private';

const resend = new Resend(RESEND_API_KEY);

export async function POST({ request }) {
  const { email } = await request.json();

  if (!email) {
    return json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    await resend.emails.send({
      from: SENDER_EMAIL,
      to: email,
      subject: 'Hello from Resend!',
      html: '<p>Hi there! This is a test email from the SvelteKit email tester app.</p>',
    });

    return json({ success: true });
  } catch (error) {
    console.error(error);
    return json({ error: 'Failed to send email' }, { status: 500 });
  }
}
