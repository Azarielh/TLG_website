/**
 * Envoie une string dans un champ d'une collection PocketBase via l'API REST.
 * @param {Object} opts
 * @param {string} opts.pbUrl - URL de la PocketBase (ex: https://pb.example.com)
 * @param {string} opts.collection - nom/ID de la collection (ex: 'Contacts')
 * @param {string} opts.field - nom du champ dans la collection (ex: 'email')
 * @param {string} opts.value - la string à envoyer
 * @param {string|null} [opts.apiKey] - optionnel: clé API si nécessaire (server-side)
 */
export async function sendStringToPocketBase({ pbUrl, collection, field, value, apiKey = null }) {
  if (!pbUrl || !collection || !field) {
    throw new Error('pbUrl, collection et field sont requis');
  }
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error('value doit être une string non vide');
  }

  const url = `${pbUrl.replace(/\/$/, '')}/api/collections/${encodeURIComponent(collection)}/records`;
  const body = { [field]: value.trim() };
  // debug: show the final URL and payload when running in a browser console
  if (typeof window !== 'undefined' && window.console) {
    console.log('PocketBase POST to:', url, 'payload:', body);
  }

  const headers = { 'Content-Type': 'application/json' };
  if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    credentials: 'omit' // n'envoyer pas de cookies par défaut
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`PocketBase error ${res.status}: ${text}`);
  }
  return res.json(); // retourne l'objet record créé
}

// PocketBase configuration (override via window.PB_CONFIG)
const PB_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_PB_URL)
  || window.PB_CONFIG?.PB_URL
  || 'https://your-pocketbase.example';
const PB_COLLECTION = window.PB_CONFIG?.PB_COLLECTION || 'Contacts';
const PB_FIELD = window.PB_CONFIG?.PB_FIELD || 'email';
const PB_API_KEY = window.PB_CONFIG?.PB_API_KEY || null;

// Email form submission — envoie le mail saisi dans la collection `Contacts`
const emailForm = document.getElementById('emailForm');
if (emailForm) {
  emailForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const emailInput = document.getElementById('emailInput');
    const email = emailInput ? (emailInput.value && emailInput.value.trim()) : '';

    if (!email) return;

    // Affiche notification optimiste
    showToast('Envoi en cours...', false);

    // Clear input
    if (emailInput) emailInput.value = '';

    try {
      const record = await sendStringToPocketBase({
        pbUrl: PB_URL,
        collection: PB_COLLECTION,
        field: PB_FIELD,
        value: email,
        apiKey: PB_API_KEY
      });
      console.log('PocketBase record created:', record);
      showToast('Email enregistré — merci !', true);
    } catch (err) {
      console.error('Erreur en envoyant à PocketBase:', err);
      showToast("Erreur lors de l'envoi. Réessaie.", false);
    }
  });
}

// showToast(message, success)
function showToast(message = 'Fait', success = true) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.toggle('success', !!success);
  toast.classList.add('show');

  // Hide toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Optional: Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});