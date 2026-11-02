
import { db } from "./firebase-config.js";
import { requireUser } from "./require-auth.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const form = document.getElementById("suggestion-form");
const status = document.getElementById("form-status");

const submitButton = form.querySelector(
  'button[type="submit"]'
);

let currentUser = null;

// Check whether the visitor is logged in.
requireUser((user) => {
  currentUser = user;

  document.getElementById("contact-email").value =
    user.email || "";
});

// Save the suggestion when the form is submitted.
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!currentUser) {
    status.textContent = "Please log in first.";
    return;
  }

  if (!form.reportValidity()) {
    return;
  }

  const name = document.getElementById("name").value.trim();

  const email = document
    .getElementById("contact-email")
    .value.trim();

  const park = document.getElementById("park").value.trim();

  const type = document.getElementById("type").value;

  const message = document
    .getElementById("message")
    .value.trim();

  if (
    !name ||
    !park ||
    !message ||
    email !== currentUser.email
  ) {
    status.textContent =
      "Fill in all fields and use your signed-in email address.";
    return;
  }

  submitButton.disabled = true;
  status.textContent = "Submitting your suggestion...";

  try {
    await addDoc(
      collection(
        db,
        "users",
        currentUser.uid,
        "suggestions"
      ),
      {
        name: name,
        email: email,
        park: park,
        type: type,
        message: message,
        createdAt: serverTimestamp()
      }
    );

    form.reset();

    document.getElementById("contact-email").value =
      currentUser.email || "";

    status.textContent =
      "Suggestion saved successfully! " +
      "View it on My Saved Parks & Suggestions.";
  } catch (error) {
    status.textContent =
      "Your suggestion was not saved: " + error.message;
  } finally {
    submitButton.disabled = false;
  }
});
