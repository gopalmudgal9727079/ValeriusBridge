const SUPABASE_URL = "https://yopynpxrivvncqgfarcf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_kPzbQkY2kKr5yZ94L539GQ_4nPZbBQB";
const SESSION_KEY = "vb_session_token";

const loginPanel = document.getElementById("login-panel");
const workspace = document.getElementById("workspace");
const form = document.getElementById("login-form");
const message = document.getElementById("message");
const loginButton = document.getElementById("login-button");

function showWorkspace(role) {
  loginPanel.classList.add("hidden");
  workspace.classList.remove("hidden");
  document.getElementById("role-title").textContent =
    role.charAt(0).toUpperCase() + role.slice(1) + " workspace";
}

function showLogin() {
  workspace.classList.add("hidden");
  loginPanel.classList.remove("hidden");
}

async function apiCall(path, body, token) {
  const headers = {
    "Content-Type": "application/json",
    "apikey": SUPABASE_PUBLISHABLE_KEY
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${SUPABASE_URL}/functions/v1/${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body || {})
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Request failed. Please try again.");
  return data;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.textContent = "";
  const phone = document.getElementById("phone").value.replace(/\D/g, "");
  const pin = document.getElementById("pin").value;
  if (!/^\d{10}$/.test(phone) || !/^\d{4}$/.test(pin)) {
    message.textContent = "Enter a valid 10-digit mobile number and 4-digit PIN.";
    return;
  }
  loginButton.disabled = true;
  loginButton.textContent = "Signing in…";
  try {
    const result = await apiCall("pin-login", { phone, pin });
    if (!result.session_token || !result.account || !result.account.role) {
      throw new Error("Unexpected sign-in response.");
    }
    sessionStorage.setItem(SESSION_KEY, result.session_token);
    showWorkspace(result.account.role);
  } catch (error) {
    message.textContent = error.message;
  } finally {
    loginButton.disabled = false;
    loginButton.textContent = "Sign in securely";
  }
});

document.getElementById("logout-button").addEventListener("click", async () => {
  const token = sessionStorage.getItem(SESSION_KEY);
  try {
    if (token) await apiCall("session-control", { action: "logout" }, token);
  } catch (_) {
    // Clear the local session even if the network is unavailable.
  }
  sessionStorage.removeItem(SESSION_KEY);
  showLogin();
});

(async function restoreSession() {
  const token = sessionStorage.getItem(SESSION_KEY);
  if (!token) return;
  try {
    const result = await apiCall("session-control", {}, token);
    if (result.authenticated && result.account?.role) showWorkspace(result.account.role);
    else sessionStorage.removeItem(SESSION_KEY);
  } catch (_) {
    sessionStorage.removeItem(SESSION_KEY);
  }
})();
