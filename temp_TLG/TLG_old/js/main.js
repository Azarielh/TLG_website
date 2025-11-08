document.addEventListener('DOMContentLoaded', () => {
  const yearSpan = document.getElementById('year');
  if (yearSpan) yearSpan.textContent = String(new Date().getFullYear());

  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
  }

  // Modal helpers
  const backdrop = document.querySelector('[data-modal-backdrop]');
  const closeButtons = document.querySelectorAll('[data-modal-close]');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');

  function openModal(title, desc) {
    if (!backdrop) return;
    if (modalTitle) modalTitle.textContent = title || 'Bientôt disponible';
    if (modalDesc) modalDesc.textContent = desc || 'Cette fonctionnalité arrive prochainement. Revenez vite !';
    backdrop.removeAttribute('hidden');
  }

  function closeModal() {
    if (!backdrop) return;
    backdrop.setAttribute('hidden', '');
  }

  closeButtons.forEach((btn) => btn.addEventListener('click', closeModal));
  backdrop?.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });

  // Discord/Twitch/YouTube
  const discordUrl = 'https://discord.gg/wfSyp6xBnF';
  const discordAnchor = document.getElementById('discordLink');
  if (discordAnchor && discordUrl) {
    discordAnchor.setAttribute('href', discordUrl);
    discordAnchor.setAttribute('target', '_blank');
    discordAnchor.setAttribute('rel', 'noopener');
  }
  document.querySelectorAll('[data-link]')?.forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const name = (e.currentTarget)?.getAttribute('data-link');
      if (name === 'twitch') {
        openModal('Twitch — bientôt', "Notre chaîne Twitch arrive très bientôt. Restez connectés !");
        return;
      }
      if (name === 'youtube') {
        openModal('YouTube — bientôt', "Notre chaîne YouTube arrive très bientôt. Abonnez-vous dès l'ouverture !");
        return;
      }
      if (name === 'discord') {
        if (discordUrl) {
          window.open(discordUrl, '_blank', 'noopener');
        } else {
          openModal('Discord', "Veuillez fournir le lien Discord pour l'activer sur le site.");
        }
      }
    });
  });
});


