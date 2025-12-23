import { createSignal, Show, onMount } from "solid-js";
import type { Component } from "solid-js";
import { usePocketBase } from "../app";

type AuthProps = {
    class?: string;
};

const Auth: Component<AuthProps> = (props) => {
    const pb = usePocketBase();
    const [loading, setLoading] = createSignal(false);
    const [error, setError] = createSignal<string | null>(null);
    const [accessPassword, setAccessPassword] = createSignal("");
    const [isAccessGranted, setIsAccessGranted] = createSignal(false);
    const [showPassword, setShowPassword] = createSignal(false);

    // Bypass en développement (preview/codespace)
    onMount(() => {
        try {
            const origin = window.location?.origin || "";
            // Bypass si l'URL contient 'github.dev' ou 'localhost'
            if (origin.includes('github.dev') || origin.includes('localhost')) {
                console.log('🔁 Dev environment detected — bypassing staff password');
                setIsAccessGranted(true);
            }
        } catch (e) {
            // ignore (SSR or restricted env)
        }
    });

    const handlePasswordSubmit = async (e: Event) => {
        e.preventDefault();

        setError(null);

        try {
            console.log('🔒 Envoi du mot de passe au endpoint serveur pour vérification...');
            const resp = await fetch('/api/validate-staff', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: accessPassword() }),
            });

            if (resp.ok) {
                const data = await resp.json();
                if (data.ok) {
                    setIsAccessGranted(true);
                    setError(null);
                    console.log('✅ Staff access granted (server validated)');
                } else {
                    setError('Mot de passe incorrect. Accès réservé au staff.');
                }
            } else if (resp.status === 401) {
                setError('Mot de passe incorrect. Accès réservé au staff.');
            } else if (resp.status === 500) {
                setError('Impossible de vérifier le mot de passe (erreur serveur).');
            } else {
                setError('Erreur inattendue lors de la vérification du mot de passe.');
            }
        } catch (err: any) {
            console.error('❌ Error calling validate-staff endpoint:', err);
            setError('Erreur réseau lors de la vérification du mot de passe.');
        }
    };

    const handleDiscordLogin = async () => {
        if (!pb) {
            console.error('❌ PocketBase not initialized');
            setError("PocketBase not initialized");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            console.log('📝 Calling authWithOAuth2 (discord)...');
            const authData = await pb.collection('users').authWithOAuth2({
                provider: 'discord',
                urlCallback: (url: string) => {
                    console.log('🌐 OAuth2 URL received (discord):', url);
                    const width = 500;
                    const height = 600;
                    const left = window.screenX + (window.outerWidth - width) / 2;
                    const top = window.screenY + (window.outerHeight - height) / 2;

                    window.open(
                        url,
                        'OAuth2 Login',
                        `width=${width},height=${height},left=${left},top=${top},toolbar=0,scrollbars=1,status=1,resizable=1,location=1,menuBar=0`
                    );
                }
            });
            console.log('✅ Discord auth successful!');
            console.log('👤 Auth data:', authData);
        } catch (err: any) {
            console.error('❌ Discord auth error:', err);
            if (err?.message && !err.message.includes('autocancelled')) {
                setError(err.message || "Échec de l'authentification Discord.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        if (!pb) {
            console.error('❌ PocketBase not initialized');
            setError("PocketBase not initialized");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Initier l'authentification OAuth2 avec Google
            console.log('📝 Calling authWithOAuth2...');
            const authData = await pb.collection('users').authWithOAuth2({ 
                provider: 'google',
                urlCallback: (url: string) => {
                    console.log('🌐 OAuth2 URL received:', url);
                    // Ouvrir la popup Google OAuth
                    const width = 500;
                    const height = 600;
                    const left = window.screenX + (window.outerWidth - width) / 2;
                    const top = window.screenY + (window.outerHeight - height) / 2;
                    
                    const popup = window.open(
                        url,
                        'OAuth2 Login',
                        `width=${width},height=${height},left=${left},top=${top},toolbar=0,scrollbars=1,status=1,resizable=1,location=1,menuBar=0`
                    );
                    console.log('🪟 Popup opened:', popup);
                }
            });
            console.log('✅ Google auth successful!');
            console.log('👤 Auth data:', authData);
            console.log('🎫 Token:', authData.token);
            console.log('👤 Record:', authData.record);
        } catch (err: any) {
            console.error('❌ Google auth error:', err);
            console.error('❌ Error message:', err?.message);
            console.error('❌ Error data:', err?.data);
            console.error('❌ Error status:', err?.status);
            
            if (err?.message && !err.message.includes('autocancelled')) {
                setError(err.message || "Échec de l'authentification Google.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            class={props.class ?? "auth-form"}
            style={{
                display: "flex",
                "flex-direction": "column",
                gap: "20px",
                width: "100%"
            }}
        >
            <Show when={!isAccessGranted()}>
                {/* Formulaire de mot de passe d'accès */}
                <form onSubmit={handlePasswordSubmit} style={{ display: "flex", "flex-direction": "column", gap: "20px" }}>
                    <div class="text-center mb-4">
                        <h2 style={{ color: "white", "font-size": "24px", "font-weight": "700", "margin-bottom": "8px", "font-family": "'Varsity', serif" }}>
                            Accès Staff
                        </h2>
                        <p style={{ color: "#9ca3af", "font-size": "14px", "margin-bottom": "10px" }}>
                            Entrez le mot de passe d'accès pour continuer
                        </p>
                        <p style={{ color: "#6b7280", "font-size": "13px" }}>
                            Pour les autres utilisateurs : aucun compte n'est nécessaire pour le moment.
                        </p>
                    </div>

                    <Show when={error()}>
                        <div role="alert" style={{ 
                            color: "#ef4444", 
                            "font-size": "14px",
                            padding: "12px",
                            "background-color": "rgba(239, 68, 68, 0.1)",
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                            "border-radius": "8px"
                        }}>
                            {error()}
                        </div>
                    </Show>

                    <div>
                        <label for="access-password" style={{ display: "block", color: "#9ca3af", "font-size": "14px", "margin-bottom": "8px" }}>
                            Mot de passe d'accès
                        </label>
                        <div style={{ position: "relative" }}>
                            <input
                                id="access-password"
                                type={showPassword() ? "text" : "password"}
                                value={accessPassword()}
                                onInput={(e) => setAccessPassword(e.currentTarget.value)}
                                required
                                style={{
                                    width: "100%",
                                    padding: "12px 40px 12px 12px",
                                    "border-radius": "8px",
                                    border: "1px solid #4b5563",
                                    "background-color": "#1f2937",
                                    color: "white",
                                    "font-size": "16px"
                                }}
                                placeholder="Entrez le mot de passe"
                            />
                            <button
                                type="button"
                                aria-label={showPassword() ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                                title={showPassword() ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                                onClick={() => setShowPassword(!showPassword())}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#eab308"; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#9ca3af"; }}
                                style={{
                                    position: "absolute",
                                    right: "12px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    background: "transparent",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "#9ca3af",
                                    padding: "0",
                                    display: "inline-flex",
                                    "align-items": "center",
                                    "justify-content": "center"
                                }}
                            >
                                <Show when={showPassword()} fallback={
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/>
                                        <circle cx="12" cy="12" r="3"/>
                                    </svg>
                                }>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.8 21.8 0 0 1 5.06-6.88"/>
                                        <path d="M9.41 4.22A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a21.8 21.8 0 0 1-3.17 4.13"/>
                                        <path d="M14.12 14.12A3 3 0 0 1 9.88 9.88"/>
                                        <line x1="1" y1="1" x2="23" y2="23"/>
                                    </svg>
                                </Show>
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        style={{
                            padding: "12px 16px",
                            "border-radius": "8px",
                            border: "none",
                            cursor: "pointer",
                            "background-color": "#d4af37",
                            color: "black",
                            "font-weight": "700",
                            "font-size": "16px",
                            transition: "all 0.2s"
                        }}
                        onMouseEnter={(e) => {
                            (e.target as HTMLElement).style.backgroundColor = "#c09f2f";
                        }}
                        onMouseLeave={(e) => {
                            (e.target as HTMLElement).style.backgroundColor = "#d4af37";
                        }}
                    >
                        Continuer
                    </button>
                </form>
            </Show>

            <Show when={isAccessGranted()}>
                {/* Connexion OAuth */}
                <div class="text-center mb-4">
                    <h2 style={{ color: "white", "font-size": "24px", "font-weight": "700", "margin-bottom": "8px", "font-family": "'Varsity', serif" }}>
                        Connexion
                    </h2>
                    <p style={{ color: "#9ca3af", "font-size": "14px" }}>
                        Connectez-vous avec votre compte Google ou Discord
                    </p>
                </div>

                <Show when={error()}>
                    <div role="alert" style={{ 
                        color: "#ef4444", 
                        "font-size": "14px",
                        padding: "12px",
                        "background-color": "rgba(239, 68, 68, 0.1)",
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                        "border-radius": "8px"
                    }}>
                        {error()}
                    </div>
                </Show>

                {/* Bouton Google */}
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading()}
                    style={{
                        padding: "12px 16px",
                        "border-radius": "8px",
                        border: "1px solid #cbd5e1",
                        cursor: loading() ? "wait" : "pointer",
                        "background-color": "white",
                        color: "#1f2937",
                        "font-weight": "600",
                        display: "flex",
                        "align-items": "center",
                        "justify-content": "center",
                        gap: "12px",
                        transition: "all 0.2s",
                        opacity: loading() ? "0.7" : "1",
                    }}
                    onMouseEnter={(e) => {
                        if (!loading()) {
                            (e.target as HTMLElement).style.backgroundColor = "#f3f4f6";
                        }
                    }}
                    onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.backgroundColor = "white";
                    }}
                >
                    <Show when={!loading()}>
                        <svg width="20" height="20" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                            <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z" fill="#34A853"/>
                            <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                            <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.428 0 9.002 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
                        </svg>
                    </Show>
                    <Show when={loading()}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            style={{ "animation": "spin 1s linear infinite" }}
                        >
                            <circle cx="12" cy="12" r="10" stroke-opacity="0.25" />
                            <path d="M22 12a10 10 0 0 0-10-10" />
                        </svg>
                    </Show>
                    <span>{loading() ? "Connexion en cours..." : "Continuer avec Google"}</span>
                </button>

                {/* Bouton Discord */}
                <button
                    type="button"
                    onClick={handleDiscordLogin}
                    disabled={loading()}
                    style={{
                        padding: "12px 16px",
                        "border-radius": "8px",
                        border: "1px solid #5865F2",
                        cursor: loading() ? "wait" : "pointer",
                        "background-color": "#5865F2",
                        color: "white",
                        "font-weight": "600",
                        display: "flex",
                        "align-items": "center",
                        "justify-content": "center",
                        gap: "12px",
                        opacity: loading() ? "0.7" : "1",
                        transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => {
                        if (!loading()) {
                            (e.target as HTMLElement).style.opacity = "0.9";
                        }
                    }}
                    onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.opacity = loading() ? "0.7" : "1";
                    }}
                >
                    <img 
                        src="/social_media/discordLogo.png" 
                        alt="Discord" 
                        width="20" 
                        height="20"
                        style={{ filter: "brightness(0) invert(1)" }}
                    />
                    <span>{loading() ? "Connexion en cours..." : "Continuer avec Discord"}</span>
                </button>
            </Show>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default Auth;