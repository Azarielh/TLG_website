import { createSignal } from 'solid-js';
import { pb } from '../pbClient';

export default function LogoutMenu(props) {
  const [busy, setBusy] = createSignal(false);

  const handleLogout = async () => {
    if (busy()) return;
    setBusy(true);
    try {
      // Clear auth store on the shared PocketBase client
      pb.authStore.clear();
      // call optional callback (to update UI state)
      if (props?.onLogout) await props.onLogout();
    } catch (e) {
      console.error('Logout error', e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div class="logout-menu">
      <button class="logout-btn" onClick={handleLogout} disabled={busy()}>
        {busy() ? 'Déconnexion...' : 'Se déconnecter'}
      </button>
    </div>
  );
}
