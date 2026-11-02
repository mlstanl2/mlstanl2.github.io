import { db } from "./firebase-config.js";
import { requireUser } from "./require-auth.js";
import { collection, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const status = document.getElementById("saved-status");
function fieldCard(title, lines) {
  const card = document.createElement("article"); card.className = "park-card";
  const heading = document.createElement("h3"); heading.textContent = title; card.append(heading);
  for (const line of lines) { const p = document.createElement("p"); p.textContent = line; card.append(p); }
  return card;
}
async function loadAccountData(user) {
  const parks = document.getElementById("saved-parks");
  const suggestions = document.getElementById("saved-suggestions");
  parks.replaceChildren(); suggestions.replaceChildren();
  status.textContent = "Loading your saved parks and suggestions...";
  try {
    const [parkResults, suggestionResults] = await Promise.all([
      getDocs(collection(db, "users", user.uid, "savedParks")),
      getDocs(collection(db, "users", user.uid, "suggestions"))
    ]);
    if (parkResults.empty) parks.append(fieldCard("No saved parks yet", ["Explore a destination and select Save to My Parks."]));
    parkResults.forEach(item => {
      const data = item.data();
      const card = fieldCard(data.name, [data.category, data.location]);
      const button = document.createElement("button"); button.type = "button"; button.textContent = "Remove Saved Park";
      const message = document.createElement("p"); message.setAttribute("role", "status");
      button.addEventListener("click", async () => {
        button.disabled = true; message.textContent = "Removing...";
        try { await deleteDoc(doc(db, "users", user.uid, "savedParks", item.id)); card.remove();
          if (!parks.children.length) parks.append(fieldCard("No saved parks yet", ["Explore a destination and select Save to My Parks."]));
        } catch (error) { message.textContent = "Could not remove park: " + error.message; button.disabled = false; }
      });
      card.append(button, message); parks.append(card);
    });
    if (suggestionResults.empty) suggestions.append(fieldCard("No suggestions yet", ["Use Contact Us to suggest a park."]));
    suggestionResults.forEach(item => {
      const data = item.data();
      suggestions.append(fieldCard(data.park, ["Type: " + data.type, "Submitted by: " + data.name, data.message]));
    });
    status.textContent = "Your saved information is up to date.";
  } catch (error) { status.textContent = "Could not load your account data: " + error.message; }
}
requireUser(loadAccountData);
