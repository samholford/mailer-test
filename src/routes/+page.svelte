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

<style>
  @keyframes sparkle {
    0%, 100% { opacity: 0; transform: scale(0.5) rotate(0deg); }
    50% { opacity: 1; transform: scale(1.2) rotate(15deg); }
  }
  .sparkle {
    animation: sparkle 1.5s ease-in-out infinite;
  }
  .sparkle-1 { animation-delay: 0.2s; }
  .sparkle-2 { animation-delay: 0.5s; }
  .sparkle-3 { animation-delay: 0.9s; }
</style>

<div class="relative flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-primary to-secondary p-4">
  <div class="absolute top-1/4 left-1/4 w-4 h-4 bg-accent rounded-full sparkle sparkle-1"></div>
  <div class="absolute top-1/2 right-1/4 w-3 h-3 bg-accent-content rounded-full sparkle sparkle-2"></div>
  <div class="absolute bottom-1/4 left-1/3 w-5 h-5 bg-warning rounded-full sparkle sparkle-3"></div>

  <div class="card w-full max-w-md bg-base-100 shadow-2xl rounded-2xl transform transition-all duration-500 hover:scale-105">
    <div class="card-body items-center text-center p-8 md:p-12">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 11l-8-5" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 11l8-5" />
      </svg>

      <h2 class="card-title text-3xl font-bold mt-4">Send a Test Message!</h2>
      <p class="text-base-content/80 mt-2">Drop your email below and whoosh... it's gone!</p>

      <div class="form-control w-full mt-6">
        <label class="label" for="email-input">
          <span class="label-text text-lg">Your Email Portal</span>
        </label>
        <input
          id="email-input"
          type="email"
          bind:value={email}
          placeholder="wizard@magicmail.com"
          class="input input-bordered input-primary w-full rounded-lg text-lg transition-all duration-300 focus:shadow-lg focus:ring-2 focus:ring-primary"
          disabled={sending}
        />
      </div>

      <div class="card-actions w-full mt-6">
        <button class="btn btn-secondary btn-block btn-lg rounded-lg text-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:-translate-y-1" on:click={sendEmail} disabled={sending}>
          {#if sending}
            <span class="loading loading-spinner"></span>
            Sending...
          {:else}
            Send
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          {/if}
        </button>
      </div>

      {#if results}
        <div class="mt-6 space-y-4 w-full">
            <h3 class="text-xl font-bold">Results:</h3>
            <div class="flex justify-around p-4 bg-base-200 rounded-lg">
                <div class="text-center">
                    <p class="font-bold text-lg">Resend</p>
                    {#if results.resend === 'success'}
                        <div class="badge badge-success gap-2 mt-2">Success</div>
                    {:else}
                        <div class="badge badge-error gap-2 mt-2">Failed</div>
                    {/if}
                </div>
                <div class="text-center">
                    <p class="font-bold text-lg">SendGrid</p>
                    {#if results.sendgrid === 'success'}
                        <div class="badge badge-success gap-2 mt-2">Success</div>
                    {:else}
                        <div class="badge badge-error gap-2 mt-2">Failed</div>
                    {/if}
                </div>
            </div>
        </div>
      {/if}
    </div>
  </div>
</div>
