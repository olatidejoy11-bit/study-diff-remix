const missionForm = document.querySelector("#mission-form");
const missionNameInput = document.querySelector("#mission-name");
const subjectInput = document.querySelector("#subject");
const deadlineInput = document.querySelector("#deadline");
const missionList = document.querySelector("#mission-list");
const pendingCount = document.querySelector("#pending-count");
const completedCount = document.querySelector("#completed-count");
const missionTotal = document.querySelector("#mission-total");
const chooseButton = document.querySelector("#choose-button");
const suggestionMessage = document.querySelector("#suggestion-message");

let missions = [];

missionForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const missionName = missionNameInput.value.trim();
    const subject = subjectInput.value.trim();
    const deadline = deadlineInput.value;

    if (missionName === "" || subject === "" || deadline === "") {
        return;
    }

    const newMission = {
        id: Date.now(),
        name: missionName,
        subject: subject,
        deadline: deadline,
        completed: false
    };

    missions.push(newMission);
    missionForm.reset();
    suggestionMessage.textContent = "";
    renderMissions();
});

missionList.addEventListener("click", function (event) {
    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    const missionId = Number(button.dataset.id);

    if (button.dataset.action === "complete") {
        toggleMission(missionId);
    }

    if (button.dataset.action === "delete") {
        deleteMission(missionId);
    }
});

chooseButton.addEventListener("click", function () {
    const pendingMissions = missions.filter(function (mission) {
        return mission.completed === false;
    });

    if (pendingMissions.length === 0) {
        suggestionMessage.textContent = "Add a pending mission first.";
        return;
    }

    const randomIndex = Math.floor(Math.random() * pendingMissions.length);
    const selectedMission = pendingMissions[randomIndex];

    suggestionMessage.textContent =
        "Start with: " + selectedMission.name;
});

function toggleMission(missionId) {
    const selectedMission = missions.find(function (mission) {
        return mission.id === missionId;
    });

    if (selectedMission) {
        selectedMission.completed = !selectedMission.completed;
        suggestionMessage.textContent = "";
        renderMissions();
    }
}

function deleteMission(missionId) {
    missions = missions.filter(function (mission) {
        return mission.id !== missionId;
    });

    suggestionMessage.textContent = "";
    renderMissions();
}

function renderMissions() {
    missionList.innerHTML = "";

    if (missions.length === 0) {
        const emptyMessage = document.createElement("div");
        emptyMessage.className = "empty-message";

        const icon = document.createElement("span");
        icon.textContent = "📚";
        icon.setAttribute("aria-hidden", "true");

        const heading = document.createElement("h3");
        heading.textContent = "No study missions yet";

        const message = document.createElement("p");
        message.textContent = "Add your first mission using the form above.";

        emptyMessage.append(icon, heading, message);
        missionList.appendChild(emptyMessage);
    } else {
        missions.forEach(function (mission) {
            missionList.appendChild(createMissionCard(mission));
        });
    }

    updateSummary();
}

function createMissionCard(mission) {
    const card = document.createElement("article");
    card.className = "mission-card";

    if (mission.completed) {
        card.classList.add("completed");
    }

    const information = document.createElement("div");
    information.className = "mission-info";

    const title = document.createElement("h3");
    title.textContent = mission.name;

    const details = document.createElement("p");
    details.className = "mission-meta";
    details.textContent =
        mission.subject + " • Due " + formatDate(mission.deadline);

    information.append(title, details);

    const actions = document.createElement("div");
    actions.className = "mission-actions";

    const completeButton = document.createElement("button");
    completeButton.type = "button";
    completeButton.className = "complete-button";
    completeButton.dataset.action = "complete";
    completeButton.dataset.id = mission.id;
    completeButton.textContent = mission.completed ? "Undo" : "Complete";

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.dataset.action = "delete";
    deleteButton.dataset.id = mission.id;
    deleteButton.textContent = "Delete";

    actions.append(completeButton, deleteButton);
    card.append(information, actions);

    return card;
}

function updateSummary() {
    const completedMissions = missions.filter(function (mission) {
        return mission.completed === true;
    });

    const pendingMissions = missions.filter(function (mission) {
        return mission.completed === false;
    });

    pendingCount.textContent = pendingMissions.length;
    completedCount.textContent = completedMissions.length;

    const word = missions.length === 1 ? " mission" : " missions";
    missionTotal.textContent = missions.length + word;
}

function formatDate(date) {
    const chosenDate = new Date(date + "T00:00:00");

    return chosenDate.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

renderMissions();
