/* ==========================================================
   auth.js — Login / Signup / Logout
   Uses RS.API (which sits on RS.DB) for storage and
   RS.Security for validation + password hashing.
   ========================================================== */

window.RS = window.RS || {};

RS.Auth = (function () {
  const SESSION_KEY = "session";

  function currentUser() {
    return RS.DB.read(SESSION_KEY, null);
  }

  function isLoggedIn() {
    return !!currentUser();
  }

  async function signup({ name, email, password }) {
    if (!name || !RS.Security.isValidEmail(email) || (password || "").length < 6) {
      throw new Error("Please fill all fields with a valid email and a 6+ character password.");
    }
    const users = await RS.API.getUsers();
    if (users.some((u) => u.email === email)) {
      throw new Error("An account with this email already exists.");
    }
    const user = {
      id: "u" + Date.now(),
      name: RS.Security.sanitize(name),
      email: email.toLowerCase(),
      passwordHash: RS.Security.hash(password),
      createdAt: new Date().toISOString()
    };
    users.push(user);
    await RS.API.saveUsers(users);
    RS.DB.write(SESSION_KEY, { id: user.id, name: user.name, email: user.email });
    return user;
  }

  async function login({ email, password }) {
    const users = await RS.API.getUsers();
    const user = users.find((u) => u.email === (email || "").toLowerCase());
    if (!user || user.passwordHash !== RS.Security.hash(password)) {
      throw new Error("Incorrect email or password.");
    }
    RS.DB.write(SESSION_KEY, { id: user.id, name: user.name, email: user.email });
    return user;
  }

  function logout() {
    RS.DB.remove(SESSION_KEY);
  }

  function requireLogin(redirectTo) {
    if (!isLoggedIn()) {
      window.location.href = "login.html?next=" + encodeURIComponent(redirectTo || window.location.pathname);
      return false;
    }
    return true;
  }

  return { currentUser, isLoggedIn, signup, login, logout, requireLogin };
})();
