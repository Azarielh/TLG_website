import { VercelRequest, VercelResponse } from '@vercel/node';

// Endpoint server-side pour valider le mot de passe staff.
// Méthode: POST { password: string }
// Lecture du secret côté serveur depuis process.env.SECRET_STAFF_PASSWORD

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, message: 'Method not allowed' });
    return;
  }

  try {
    const body = req.body || {};
    const provided = typeof body === 'string' ? JSON.parse(body) : body;
    const password = provided.password;

    if (typeof password !== 'string') {
      res.status(400).json({ ok: false, message: 'Missing password' });
      return;
    }

    // Priorise une variable explicitement définie pour le server
    const secret = process.env.SECRET_STAFF_PASSWORD || process.env.VITE_SECRET_STAFF_PASSWORD || '';

    if (!secret) {
      // Pas de secret configuré côté serveur
      console.error('validate-staff: SECRET_STAFF_PASSWORD not configured on server');
      res.status(500).json({ ok: false, message: 'Server not configured' });
      return;
    }

    if (password === secret) {
      res.status(200).json({ ok: true });
    } else {
      res.status(401).json({ ok: false, message: 'Invalid password' });
    }
  } catch (err: any) {
    console.error('validate-staff error:', err);
    res.status(500).json({ ok: false, message: 'Internal error' });
  }
}
