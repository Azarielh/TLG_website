import { createSignal, Show } from "solid-js";
import type { Component } from "solid-js";

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

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </form>
    );
};

export default Auth;