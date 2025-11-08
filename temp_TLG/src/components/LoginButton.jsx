import { createSignal, createEffect, onCleanup } from "solid-js";
import { pb } from '../pbClient';

export default function LoginButton() {
  const [open, setOpen] = createSignal(false);
  const [loading, setLoading] = createSignal(false);
  const [message, setMessage] = createSignal('');
  const [isAdmin, setIsAdmin] = createSignal(false);

  const toggle = () => {
    setMessage('');
    // if admin, toggle admin menu instead of login pop
    if (isAdmin()) {
      setAdminMenuOpen(!adminMenuOpen());
      // load menu component on demand
      if (adminMenuOpen() === false && !MenuComp()) {
        import('./LogoutMenu.jsx').then(mod => {
          setMenuComp(() => mod.default);
        }).catch(err => console.error('failed to load LogoutMenu', err));
      }
    } else {
      setOpen(!open());
    }
  };

  const [adminMenuOpen, setAdminMenuOpen] = createSignal(false);
  const [MenuComp, setMenuComp] = createSignal();

  const submit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = form.email?.value;
    const password = form.password?.value;

    if (!email || !password) {
      setMessage('Veuillez renseigner email et mot de passe.');
      return;
    }

    console.log('Login attempt:', email);
    setLoading(true);
    setMessage('Connexion en cours...');

    try {
      // Try to authenticate with PocketBase
      const auth = await pb.collection('users').authWithPassword(email, password);
      console.log('Login success:', auth);
      // mark admin if this account matches configured admin email
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || window.PB_CONFIG?.ADMIN_EMAIL || 'TLG_admin@gmail.com';
      if (auth?.record?.email && auth.record.email === adminEmail) setIsAdmin(true);
      setMessage('Connecté — bienvenue !');
      // keep the UI open a short moment to show success, then close
      setTimeout(() => {
        setOpen(false);
        setMessage('');
      }, 800);
    } catch (err) {
      console.error('Login failed:', err);
      // pocketbase returns a useful message in err.data?.message
      const errMsg = err?.data?.message || err?.message || 'Échec de la connexion';
      setMessage(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // on mount check existing auth state (in case user already logged)
  createEffect(() => {
    try {
      const model = pb.authStore.model;
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || window.PB_CONFIG?.ADMIN_EMAIL || 'TLG_admin@gmail.com';
      setIsAdmin(!!(pb.authStore.isValid && model?.email && model.email === adminEmail));
    } catch (e) {
      // ignore
    }
  });

  // subscribe to authStore changes so logout/login updates UI reactively
  const unsub = pb.authStore.onChange(() => {
    try {
      const model = pb.authStore.model;
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || window.PB_CONFIG?.ADMIN_EMAIL || 'TLG_admin@gmail.com';
      setIsAdmin(!!(pb.authStore.isValid && model?.email && model.email === adminEmail));
      if (!pb.authStore.isValid) {
        // ensure menus are closed when logged out
        setAdminMenuOpen(false);
        setOpen(false);
      }
    } catch (e) {
      console.error('authStore change handler error', e);
    }
  });
  onCleanup(() => { if (typeof unsub === 'function') unsub(); });

  return (
    // NOTE: do NOT set aria-hidden on an ancestor of a focusable control (accessibility issue).
    // The popover/login form is conditionally rendered when open(), so remove aria-hidden here.
    <div class="discrete-login" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)' }}>
      <button
        class="login-btn"
        onClick={toggle}
        aria-label="Connexion"
        title="Connexion"
        aria-haspopup={isAdmin() ? 'menu' : 'dialog'}
        aria-expanded={open() || adminMenuOpen()}
      >
        {isAdmin() ? (
          <span class="admin-circle">A</span>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        )}
      </button>

      {adminMenuOpen() && MenuComp() && (
        <MenuComp onLogout={async () => {
          try {
              // LogoutMenu already clears pb.authStore; just update UI state
              setIsAdmin(false);
              setAdminMenuOpen(false);
          } catch (e) {
            console.error('Logout failed', e);
          }
        }} />
      )}

      {open() && (
        <form class="login-pop" onSubmit={submit} aria-label="Login form">
          <input name="email" type="email" placeholder="Email" required />
          <input name="password" type="password" placeholder="Mot de passe" required />
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <button type="submit" class="login-submit" disabled={loading()}> {loading() ? 'Connexion...' : 'Se connecter'}</button>
            <button type="button" class="login-cancel" onClick={() => setOpen(false)}>Annuler</button>
          </div>
          {message() && <div class="login-message" style={{ marginTop: '8px', color: '#fff' }}>{message()}</div>}
        </form>
      )}
    </div>
  );
}
