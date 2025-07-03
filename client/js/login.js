async function getUserInfo() {
  try {
    const res = await fetch("/api/user");
    if (!res.ok) throw new Error("No autenticado");
    const user = await res.json();
    document.getElementById(
      "user-info"
    ).textContent = `Hola, ${user.displayName}`;
  } catch {
    window.location.href = "/login";
  }
}

function logout() {
  window.location.href = "/logout";
}

getUserInfo();
