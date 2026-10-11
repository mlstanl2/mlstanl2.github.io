async function loadSnowboardingData() {
    try {
        const response = await fetch("js/boardingData.json");
        const data = await response.json();

        changeContent(data);
    } catch (error) {
        console.log("Error loading JSON:", error);
    }
}

function changeContent(data) {
    document.title = data.title;
    document.getElementById("styleName").textContent = data.header;

    document.getElementById("heroTitle").textContent = data.hero.headline;
    document.getElementById("heroDesc").textContent = data.hero.description;

    document.getElementById("heroSection").style.setProperty(
        "--hero-img",
        'url("/5/img/alpineBoarding.jpg")'
    );

    document.getElementById("sec1Title").textContent = data.sections.overview.title;
    document.getElementById("sec1Subtitle").textContent = data.sections.overview.subtitle;

    const overviewCards = document.querySelectorAll("#sec1Grid .card");

    for (let i = 0; i < overviewCards.length; i++) {
        overviewCards[i].querySelector("h3").textContent = data.sections.overview.cards[i].title;
        overviewCards[i].querySelector("p").textContent = data.sections.overview.cards[i].description;
    }

    document.getElementById("sec2Title").textContent = data.sections.equipment.title;
    document.getElementById("sec2Subtitle").textContent = data.sections.equipment.subtitle;

    const equipmentCards = document.querySelectorAll("#sec2Grid .card");

    for (let i = 0; i < equipmentCards.length; i++) {
        equipmentCards[i].querySelector("h3").textContent = data.sections.equipment.cards[i].title;
        equipmentCards[i].querySelector("p").textContent = data.sections.equipment.cards[i].description;
    }
}

document.getElementById("changeThemeBtn").addEventListener("click", loadSnowboardingData);
