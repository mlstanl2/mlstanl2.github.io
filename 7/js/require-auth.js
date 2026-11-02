import { auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

export function requireUser(onReady) {
  onAuthStateChanged(auth, user => {
    const gate = document.getElementById("auth-gate");
    const protectedContent = document.getElementById("protected-content");
    if (!user) {
      if (gate) { gate.hidden = false; gate.textContent = "Please log in to use this feature. ";
        const link = document.createElement("a"); link.href = "index.html#login"; link.textContent = "Go to Log In"; gate.append(link); }
      if (protectedContent) protectedContent.hidden = true;
      return;
    }
    if (gate) gate.hidden = true;
    if (protectedContent) protectedContent.hidden = false;
    onReady(user);
  }, error => {
    const gate = document.getElementById("auth-gate");
    if (gate) gate.textContent = "Could not verify your login: " + error.message;
  });
}
