<script lang="ts">
  let email = '';
  let status = '';
  let message = '';

  async function sendEmail() {
    status = 'sending';
    message = '';

    const response = await fetch('/api/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (response.ok) {
      status = 'success';
      message = 'Email sent successfully!';
    } else {
      status = 'error';
      message = data.error || 'Failed to send email.';
    }
  }
</script>

<div class="container mx-auto p-8">
  <div class="card bg-primary text-primary-content shadow-xl">
    <div class="card-body">
      <h2 class="card-title">Email Tester</h2>
      <p>Enter an email address to send a test email to.</p>
      <div class="card-actions justify-center">
        <input type="email" bind:value={email} placeholder="email@example.com" class="input input-bordered w-full max-w-xs" />
        <button class="btn btn-secondary" on:click={sendEmail} disabled={status === 'sending'}>
          {#if status === 'sending'}
            Sending...
          {:else}
            Send Email
          {/if}
        </button>
      </div>
      {#if message}
        <div class="alert {status === 'success' ? 'alert-success' : 'alert-error'} mt-4">
          <div>
            <span>{message}</span>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>
