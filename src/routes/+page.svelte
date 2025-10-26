<script lang="ts">
  let email = '';
  let sending = false;
  let results: { resend: string; sendgrid: string } | null = null;

  async function sendEmail() {
    sending = true;
    results = null;

    const response = await fetch('/api/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      results = await response.json();
    } else {
      results = {
        resend: 'error',
        sendgrid: 'error',
      };
    }

    sending = false;
  }
</script>

<div class="container mx-auto p-8 max-w-lg">
  <div class="card bg-primary text-primary-content shadow-xl">
    <div class="card-body">
      <h2 class="card-title">Email Service Tester</h2>
      <p>Enter an email to compare Resend and SendGrid delivery.</p>
      <div class="card-actions justify-center items-center mt-4">
        <input
          type="email"
          bind:value={email}
          placeholder="email@example.com"
          class="input input-bordered w-full max-w-xs"
          disabled={sending}
        />
        <button class="btn btn-secondary" on:click={sendEmail} disabled={sending}>
          {#if sending}
            <span class="loading loading-spinner"></span>
            Sending...
          {:else}
            Send Emails
          {/if}
        </button>
      </div>

      {#if results}
        <div class="mt-6 space-y-2 text-center">
            <h3 class="text-lg font-bold">Results:</h3>
            <div class="flex justify-around">
                <div class="text-center">
                    <p class="font-bold">Resend</p>
                    {#if results.resend === 'success'}
                        <div class="badge badge-success gap-2">Success</div>
                    {:else}
                        <div class="badge badge-error gap-2">Failed</div>
                    {/if}
                </div>
                <div class="text-center">
                    <p class="font-bold">SendGrid</p>
                    {#if results.sendgrid === 'success'}
                        <div class="badge badge-success gap-2">Success</div>
                    {:else}
                        <div class="badge badge-error gap-2">Failed</div>
                    {/if}
                </div>
            </div>
        </div>
      {/if}
    </div>
  </div>
</div>
