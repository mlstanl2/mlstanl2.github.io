
import { auth } from "./firebase-config.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

const emailInput = document.getElementById("auth-email");
const passwordInput = document.getElementById("auth-password");

const loginButton = document.getElementById("login-btn");
const signupButton = document.getElementById("signup-btn");
const logoutButton = document.getElementById("logout-btn");

const status = document.getElementById("auth-status");
const accountLinks = document.getElementById("account-links");

let busy = false;

async function authenticate(mode) {
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    status.textContent = "Enter your email and password.";
    return;
  }

  if (password.length < 6) {
    status.textContent =
      "Password must be at least 6 characters.";
    return;
  }

  busy = true;
  loginButton.disabled = true;
  signupButton.disabled = true;

  status.textContent =
    mode === "signup"
      ? "Creating your account..."
      : "Signing you in...";

  try {
    if (mode === "signup") {
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
    } else {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
    }

    passwordInput.value = "";

    status.textContent =
      "Signed in! You can now save parks and submit suggestions.";

  } catch (error) {
    status.textContent =
      "Could not sign in: " + error.message;

  } finally {
    busy = false;
    loginButton.disabled = false;
    signupButton.disabled = false;
  }
}

loginButton.addEventListener("click", () => {
  authenticate("login");
});

signupButton.addEventListener("click", () => {
  authenticate("signup");
});

logoutButton.addEventListener("click", async () => {
  logoutButton.disabled = true;
  status.textContent = "Logging out...";

  try {
    await signOut(auth);

    passwordInput.value = "";
    status.textContent = "You have logged out.";

  } catch (error) {
    status.textContent =
      "Unable to log out: " + error.message;

  } finally {
    logoutButton.disabled = false;
  }
});

onAuthStateChanged(auth, (user) => {

  if (user) {
    logoutButton.hidden = false;
    loginButton.hidden = true;
    signupButton.hidden = true;

    emailInput.disabled = true;
    passwordInput.disabled = true;

    if (accountLinks) {
      accountLinks.hidden = false;
    }

    if (!busy) {
      status.textContent =
        "Signed in as " + user.email +
        ". Your saved parks are available below.";
    }

  } else {
    logoutButton.hidden = true;
    loginButton.hidden = false;
    signupButton.hidden = false;

    emailInput.disabled = false;
    passwordInput.disabled = false;

    if (accountLinks) {
      accountLinks.hidden = true;
    }

    if (!busy) {
      status.textContent =
        "Log in or create an account to save parks and submit suggestions.";
    }
  }
}, (error) => {
  status.textContent =
    "Unable to check your login: " + error.message;
});
