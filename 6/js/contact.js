"use strict";

// Validates the suggestion form and displays a local confirmation.
function handleSuggestion(event) {
    event.preventDefault();
    document.getElementById("form-status").textContent = "Your suggestion is ready. Online submission is not connected yet, so no information has been sent.";
}

document.getElementById("suggestion-form").addEventListener("submit", handleSuggestion);
