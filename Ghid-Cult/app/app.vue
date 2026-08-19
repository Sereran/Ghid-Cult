<template>
  <div class="wip-wrapper">
    <NuxtRouteAnnouncer />

    <main class="card">
      <span class="badge">🚧 Under Construction</span>
      <h1>Ghid-Cult</h1>
      <p>We are currently building something special. The site will be live soon.</p>

      <div class="progress-bar" role="progressbar" aria-label="Build progress">
        <div class="progress-fill"></div>
      </div>

      <p class="status-note">Status: Active Development</p>
    </main>
  </div>
</template>

<style scoped>
.wip-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0b0f19;
  color: #f3f4f6;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  padding: 1.5rem;
  box-sizing: border-box;
}

.card {
  max-width: 480px;
  width: 100%;
  text-align: center;
  background: #111827;
  padding: 2.5rem 2rem;
  border-radius: 1rem;
  border: 1px solid #1f2937;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
}

.badge {
  display: inline-block;
  background: rgba(234, 179, 8, 0.15);
  color: #facc15;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
  border: 1px solid rgba(234, 179, 8, 0.3);
  margin-bottom: 1.5rem;
}

h1 {
  font-size: 2.25rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  margin: 0 0 0.75rem;
}

p {
  color: #9ca3af;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0 0 1.75rem;
}

.progress-bar {
  height: 6px;
  width: 100%;
  background: #1f2937;
  border-radius: 9999px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.progress-fill {
  height: 100%;
  width: 45%;
  background: linear-gradient(90deg, #38bdf8, #818cf8);
  border-radius: 9999px;
  animation: shimmer 2s infinite ease-in-out;
}

.status-note {
  font-size: 0.8rem;
  color: #6b7280;
  margin: 0;
}

@keyframes shimmer {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>