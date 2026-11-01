
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

async function authenticate(action) {
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    status.textContent = "Enter your email and password.";
    return;
  }

  loginButton.disabled = true;
  signupButton.disabled = true;
  status.textContent = "Please wait...";

  try {
    if (action === "signup") {
      await createUserWithEmailAndPassword(auth, email, password);
    } else {
      await signInWithEmailAndPassword(auth, email, password);
    }

    status.textContent = "Successfully signed in!";
  } catch (error) {
    status.textContent = "Authentication failed: " + error.message;
  } finally {
    loginButton.disabled = false;
    signupButton.disabled = false;
  }
}

loginButton.addEventListener("click", () => authenticate("login"));
signupButton.addEventListener("click", () => authenticate("signup"));

logoutButton.addEventListener("click", async () => {
  try {
    await signOut(auth);
    status.textContent = "You have logged out.";
  } catch (error) {
    status.textContent = "Unable to log out: " + error.message;
  }
});

onAuthStateChanged(auth, (user) => {
  logoutButton.hidden = !user;

  if (user) {
    status.textContent = "Signed in as " + user.email;
  } else {
    status.textContent = "Log in or create an account to get started.";
  }
});
