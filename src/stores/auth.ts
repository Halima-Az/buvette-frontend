// src/stores/auth.ts

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function getRole(): string | null {
  return localStorage.getItem("role");
}

export function getUserId():string | null {
  return localStorage.getItem("userId");
}

export function isAuthenticated(): boolean {
  const token = getToken();
  if (!token) return false;

  try {
    const payload = JSON.parse(atob( token.split(".")[1] ));
    return payload.exp > Date.now() / 1000;
  } catch {
    return false;
  }
}

export function login(token: string, role: string , userId : string) {
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
  localStorage.setItem("userId" , userId);
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("userId");
}
