"use strict";

const DATA_FILE = "data/destinations.json";

// Creates a button that runs a function when selected.
function createButton(label, onClick) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.addEventListener("click", onClick);
    return button;
}

// Clears the current park choices and navigation buttons.
function clearPage() {
    document.getElementById("park-content").replaceChildren();
    document.getElementById("navigation-buttons").replaceChildren();
}

// Adds a heading and description to a park card.
function createCard(title, description) {
    const card = document.createElement("article");
    card.className = "park-card";
    const heading = document.createElement("h3");
    heading.textContent = title;
    const paragraph = document.createElement("p");
    paragraph.textContent = description;
    card.append(heading, paragraph);
    return card;
}

// Displays the full information for one destination.
function displayDetails(category, destination, categories) {
    clearPage();
    document.getElementById("explore-heading").textContent = destination.name;
    document.getElementById("explore-instructions").textContent = category.name;
    const content = document.getElementById("park-content");
    content.className = "destination";
    const sections = [
        ["About", destination.description],
        ["Location", destination.location],
        ["Best Time to Visit", destination.bestTime]
    ];
    for (const [title, value] of sections) {
        const heading = document.createElement("h3");
        heading.textContent = title;
        const paragraph = document.createElement("p");
        paragraph.textContent = value;
        content.append(heading, paragraph);
    }
    const heading = document.createElement("h3");
    heading.textContent = "Top Things to Do";
    const activities = document.createElement("ol");
    for (const activity of destination.activities) {
        const item = document.createElement("li");
        item.textContent = activity;
        activities.append(item);
    }
    content.append(heading, activities);
    const navigation = document.getElementById("navigation-buttons");
    navigation.append(createButton("Back to " + category.name, () => displayDestinations(category, categories)));
    navigation.append(createButton("Start Over", () => displayCategories(categories)));
}

// Displays the four destinations for the selected category.
function displayDestinations(category, categories) {
    clearPage();
    document.getElementById("explore-heading").textContent = "Step 2: Choose a " + category.name.slice(0, -1);
    document.getElementById("explore-instructions").textContent = "Select a destination to see its location, activities, and visiting tips.";
    const content = document.getElementById("park-content");
    content.className = "park-grid";
    for (const destination of category.destinations) {
        const card = createCard(destination.name, destination.location);
        card.append(createButton("View Park", () => displayDetails(category, destination, categories)));
        content.append(card);
    }
    document.getElementById("navigation-buttons").append(createButton("Back to Park Types", () => displayCategories(categories)));
}

// Displays the four categories loaded from the JSON file.
function displayCategories(categories) {
    clearPage();
    document.getElementById("explore-heading").textContent = "Step 1: Choose a Park Type";
    document.getElementById("explore-instructions").textContent = "Select one of the four park categories below.";
    const content = document.getElementById("park-content");
    content.className = "park-grid";
    for (const category of categories) {
        const card = createCard(category.name, category.description);
        card.append(createButton("View " + category.name, () => displayDestinations(category, categories)));
        content.append(card);
    }
}

// Fetches the external JSON and handles loading failures.
function loadDestinations() {
    const status = document.getElementById("load-status");
    fetch(DATA_FILE)
        .then(response => {
            if (!response.ok) {
                throw new Error("Unable to load destinations.");
            }
            return response.json();
        })
        .then(categories => {
            if (!Array.isArray(categories) || categories.length === 0) {
                throw new Error("The destination list is empty or invalid.");
            }
            status.textContent = "";
            displayCategories(categories);
        })
        .catch(() => {
            status.textContent = "Park information could not be loaded. Please try again.";
            document.getElementById("navigation-buttons").append(createButton("Retry", () => {
                clearPage();
                status.textContent = "Loading park information...";
                loadDestinations();
            }));
        });
}

loadDestinations();
