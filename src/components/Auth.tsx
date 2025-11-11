import { createSignal, Show } from "solid-js";
import type { Component } from "solid-js";
import { usePocketBase } from "../app";

type Credentials = {
    email: string;
    password: string;
    remember?: boolean;
};

type AuthProps = {
    /**
     * Optional callback. If provided it's called with credentials and should return a Promise.
     * If omitted the component will POST to /api/login with JSON { email, password, remember }.
     */
    onLogin?: (creds: Credentials) => Promise<any>;
    initialEmail?: string;
    class?: string;
};

const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const defaultLogin = async (creds: Credentials) => {
    const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(creds),
    });

    if (!res.ok) {
        const json = await res.json().catch(() => null);
        const msg = json?.message || res.statusText || "Login failed";
        throw new Error(msg);
    }
    return res.json();
};

const Auth: Component<AuthProps> = (props) => {
    const pb = usePocketBase();
    const [email, setEmail] = createSignal(props.initialEmail ?? "");
    const [password, setPassword] = createSignal("");
    const [remember, setRemember] = createSignal(false);
    const [loading, setLoading] = createSignal(false);
    const [error, setError] = createSignal<string | null>(null);
    const [showPassword, setShowPassword] = createSignal(false);

    const validate = () => {
        if (!email().trim()) return "Email is required.";
        if (!emailRegex.test(email().trim())) return "Enter a valid email address.";
        if (!password()) return "Password is required.";
        if (password().length < 6) return "Password must be at least 6 characters.";
        return null;
    };

    const handleGoogleLogin = async () => {
        if (!pb) {
            setError("PocketBase not initialized");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Initier l'authentification OAuth2 avec Google
            // PocketBase ouvrira automatiquement une popup pour Google
            const authData = await pb.collection('users').authWithOAuth2({ 
                provider: 'google',
                // Options pour forcer l'ouverture d'une popup
                urlCallback: (url: string) => {
                    // Ouvrir la popup Google OAuth
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
            console.log('Google auth successful:', authData);
            // Fermer le modal auth après connexion réussie
            window.location.reload(); // Recharger pour mettre à jour l'état d'auth
        } catch (err: any) {
            console.error('Google auth error:', err);
            if (err?.message && !err.message.includes('autocancelled')) {
                setError(err.message || "Google authentication failed.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e?: Event) => {
        e?.preventDefault();
        setError(null);
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        try {
            const creds = { email: email().trim(), password: password(), remember: remember() };
            const result = props.onLogin ? await props.onLogin(creds) : await defaultLogin(creds);
            // result handling is left to caller (onLogin) or backend. Default returns parsed JSON.
            return result;
        } catch (err: any) {
            setError(err?.message || "An unknown error occurred.");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            class={props.class ?? "auth-form"}
            onSubmit={handleSubmit}
            aria-live="polite"
            style={{
                display: "flex",
                "flex-direction": "column",
                gap: "10px",
                width: "100%"
            }}
        >
            <div>
                <label for="email" style={{ display: "block", "font-weight": "600", "margin-bottom": "6px" }}>
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    value={email()}
                    onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
                    autocomplete="email"
                    required
                    style={{
                        width: "100%",
                        padding: "8px 10px",
                        "border-radius": "6px",
                        border: "1px solid #cbd5e1",
                    }}
                />
            </div>

            <div>
                <label for="password" style={{ display: "block", "font-weight": "600", "margin-bottom": "6px" }}>
                    Password
                </label>
                <div style={{ position: "relative" }}>
                    <input
                        id="password"
                        type={showPassword() ? "text" : "password"}
                        value={password()}
                        onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
                        autocomplete="current-password"
                        required
                        style={{
                            width: "100%",
                            padding: "8px 40px 8px 10px",
                            "border-radius": "6px",
                            border: "1px solid #cbd5e1",
                        }}
                    />
                    <button
                        type="button"
                        aria-label={showPassword() ? "Hide password" : "Show password"}
                        onClick={() => setShowPassword(!showPassword())}
                        style={{
                            position: "absolute",
                            right: "6px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            "background-color": "transparent",
                            border: "none",
                            cursor: "pointer",
                            padding: "6px",
                        }}
                    >
                        {showPassword() ? "🙈" : "👁️"}
                    </button>
                </div>
            </div>

            <div style={{ display: "flex", "align-items": "center", "justify-content": "space-between" }}>
                <label style={{ display: "flex", "align-items": "center", gap: "8px" }}>
                    <input
                        type="checkbox"
                        checked={remember()}
                        onChange={(e) => setRemember((e.target as HTMLInputElement).checked)}
                    />
                    <span style={{ "font-size": "14px" }}>Remember me</span>
                </label>
                <a href="/forgot-password" style={{ "font-size": "14px", color: "#2563eb", "text-decoration": "none" }}>
                    Forgot?
                </a>
            </div>

            <Show when={error()}>
                <div role="alert" style={{ color: "#ef4444", "font-size": "14px" }}>
                    {error()}
                </div>
            </Show>

            <button
                type="submit"
                disabled={loading()}
                style={{
                    padding: "10px",
                    "border-radius": "8px",
                    border: "none",
                    cursor: loading() ? "wait" : "pointer",
                    "background-color": loading() ? "#94a3b8" : "#2563eb",
                    color: "white",
                    "font-weight": "600",
                }}
            >
                <Show
                    when={loading()}
                    fallback={<span>Sign in</span>}
                >
                    <span style={{ display: "inline-flex", gap: "8px", "align-items": "center" }}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
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
                        Signing in…
                    </span>
                </Show>
            </button>

            {/* Séparateur */}
            <div style={{ 
                display: "flex", 
                "align-items": "center", 
                gap: "10px",
                margin: "10px 0"
            }}>
                <div style={{ flex: "1", height: "1px", "background-color": "#cbd5e1" }} />
                <span style={{ "font-size": "14px", color: "#64748b" }}>ou</span>
                <div style={{ flex: "1", height: "1px", "background-color": "#cbd5e1" }} />
            </div>

            {/* Bouton Google */}
            <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading()}
                style={{
                    padding: "10px",
                    "border-radius": "8px",
                    border: "1px solid #cbd5e1",
                    cursor: loading() ? "wait" : "pointer",
                    "background-color": "white",
                    color: "#1f2937",
                    "font-weight": "600",
                    display: "flex",
                    "align-items": "center",
                    "justify-content": "center",
                    gap: "8px",
                    transition: "background-color 0.2s",
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
                <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                    <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z" fill="#34A853"/>
                    <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                    <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.428 0 9.002 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
                </svg>
                <span>Se connecter avec Google</span>
            </button>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </form>
    );
};

export default Auth;