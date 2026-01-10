// auth.ts
export function getToken(): string | null {
    return localStorage.getItem("token");
}

export function isAuthenticated(): boolean {
    const token = getToken();
    if (!token) return false;

    try {
        const tk=token.split('.')[1]
        if(!tk) return false;
        const payload = JSON.parse(window.atob(tk));
        const now = Date.now() / 1000; // timestamp en secondes
        return payload.exp > now;
    } catch (error) {
        console.error("Token invalide", error);
        return false;
    }
}

export function login(token: string) {
    localStorage.setItem("token", token);
}

export function logout() {
    localStorage.removeItem("token");
}
