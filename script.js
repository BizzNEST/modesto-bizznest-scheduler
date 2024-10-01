import { json_array } from "./src/util/json_convert.js"; // Import the array

let internData = [...json_array];
let filteredInterns = [...internData];
let selectedInterns = new Set(); // Store selected interns
let selectedPairings = [];

const internTableBody = document.getElementById("intern-tbody");
const pairingsList = document.getElementById("pairings-list");
const totalPairings = document.getElementById("total-pairings");

// Populate intern table when the page loads, so it's not empty when starting
populateInternTable(filteredInterns);

//list for the intern pool box
function populateInternTable(interns) {
  internTableBody.innerHTML = interns
    .map(
      (intern) => `
        <tr>
            <td>${intern.name}</td>
            <td>${intern.department}</td>
            <td>${intern.location}</td>
            <td><button class="toggle-button" data-name="${intern.name}"></button></td>
        </tr>
    `
    )
    .join("");

  document.querySelectorAll(".toggle-button").forEach((button) => {
    const internName = button.getAttribute("data-name");
    if (selectedInterns.has(internName)) button.classList.add("selected");

    button.addEventListener("click", () => toggleSelect(button, internName));
  });
}

// This function is triggered when the "Select" button for an intern is clicked.
function toggleSelect(button, internName) {
  if (selectedInterns.has(internName)) {
    selectedInterns.delete(internName);
    removeFromPairings(internName);
  } else {
    selectedInterns.add(internName);
    addToPairings(internName);
  }
  button.classList.toggle("selected");
}

// checks if the intern is already in the pairing box: If not, it adds them to the pairing list and creates a list item (li) for the intern.
function addToPairings(internName) {
  if (!selectedPairings.includes(internName)) {
    selectedPairings.push(internName);
    const intern = internData.find((i) => i.name === internName);
    const li = document.createElement("li");
    li.innerHTML = `${intern.name} <span class="department">${intern.department}</span>
                        <button class="remove-button">×</button>`;
    li.querySelector(".remove-button").addEventListener("click", () =>
      removeFromPairings(internName, li)
    );
    pairingsList.appendChild(li);
    updateTotalPairings();
  }
}

// This function removes an intern from the pairing box and the list of selected interns.
function removeFromPairings(internName, li = null) {
  selectedPairings = selectedPairings.filter((name) => name !== internName);

  if (li) {
    pairingsList.removeChild(li); // If list item (li) is passed, remove from DOM
  } else {
    // If no list item is passed, remove from DOM by matching the intern's name
    const item = Array.from(pairingsList.children).find((item) =>
      item.textContent.includes(internName)
    );
    if (item) {
      pairingsList.removeChild(item);
    }
  }

  // updates the total number of interns that have been paired (selected).
  updateTotalPairings();
}

// Update toggle button state when interns are added/removed (visually changes the buttons)
function updateInternTableButtons() {
  document.querySelectorAll(".toggle-button").forEach((button) => {
    const internName = button.getAttribute("data-name");
    if (selectedInterns.has(internName)) {
      button.classList.add("selected");
    } else {
      button.classList.remove("selected");
    }
  });
}

// Function to update the Pairing Box count
function updateTotalPairings() {
  totalPairings.textContent = `${selectedPairings.length} Total`;
}

// Select All  ( adds all the filtered interns to the pairing box. )
document.getElementById("select-all").addEventListener("click", () => {
  filteredInterns.forEach((intern) => {
    if (!selectedInterns.has(intern.name)) {
      selectedInterns.add(intern.name);
      addToPairings(intern.name);
    }
  });
  updateInternTableButtons();
});

// Deselect All  (this function removes all the filtered interns from the pairing box.)
document.getElementById("deselect-all").addEventListener("click", () => {
  filteredInterns.forEach((intern) => {
    if (selectedInterns.has(intern.name)) {
      selectedInterns.delete(intern.name);
      removeFromPairings(intern.name); // Remove from pairings and update
    }
  });
  updateInternTableButtons();
});

// clears all interns from the pairing box.
document.getElementById("clear-all").addEventListener("click", () => {
  selectedInterns.clear();
  selectedPairings = [];
  pairingsList.innerHTML = "";
  updateInternTableButtons();
  updateTotalPairings();
});

// **Filter Functionality** for location and department
function applyFilters() {
  const activeLocations = Array.from(
    document.querySelectorAll("#location-filters .active")
  ).map((btn) => btn.getAttribute("data-location"));
  const activeDepartments = Array.from(
    document.querySelectorAll("#department-filters .active")
  ).map((btn) => btn.getAttribute("data-department"));

  filteredInterns = internData.filter(
    (intern) =>
      // If no location filters are active (length is 0), show all interns
      (activeLocations.length === 0 ||
        activeLocations.includes(intern.location)) &&
      (activeDepartments.length === 0 ||
        activeDepartments.includes(intern.department))
  );

  populateInternTable(filteredInterns); // Repopulate the intern table with the filtered results
}

document.querySelectorAll(".filter-buttons button").forEach((button) => {
  button.addEventListener("click", () => {
    // Toggle the "active" class on the button when clicked (visual)
    button.classList.toggle("active");
    // Apply the filters after toggling the active state of the button
    applyFilters();
  });
});

// Search Functionality
document.getElementById("search").addEventListener("input", function () {
  const query = this.value.toLowerCase();

  // Filter interns based on the search query (you can search names, departments, or city)
  const searchResults = internData.filter(
    (intern) =>
      intern.name.toLowerCase().includes(query) ||
      intern.department.toLowerCase().includes(query) ||
      intern.location.toLowerCase().includes(query)
  );
  populateInternTable(searchResults);
});

/////////////////////////////////////////////////////////Vics's Code///////////////////////////////////////////////////////////////////////

let isHoveringToggle = false; // To track if the pointer is hovering over the toggle filter

document
  .getElementById("generate-pairing")
  .addEventListener("click", function () {
    const toggleFilter = document.getElementById("toggle-pairing-filter");
    console.log("click");
    toggleFilter.style.display =
      toggleFilter.style.display === "block" ? "none" : "block";
  });

const toggleFilter = document.getElementById("toggle-pairing-filter");

toggleFilter.addEventListener("pointerover", function () {
  isHoveringToggle = true; // Set to true when hovering over the toggle filter
  console.log("pointerover button");
});

toggleFilter.addEventListener("pointerout", function () {
  isHoveringToggle = false; // Set to false when the pointer leaves the toggle filter
  console.log("pointerout button");
  checkClose(); // Call the function to check if we should close the filter
});

// Check if we should close the toggle filter
function checkClose() {
  setTimeout(() => {
    // Only close if we're not hovering over the toggle filter or any other buttons
    if (!isHoveringToggle) {
      const toggleFilter = document.getElementById("toggle-pairing-filter");
      toggleFilter.style.display = "none"; // Hide the toggle filter
      console.log("close");
    }
  }, 100); // Adjust the delay as needed
}

// Assuming you have other buttons that should not trigger closing the filter
const otherButtons = document.querySelectorAll(".other-button"); // Replace with your button class or selector
otherButtons.forEach((button) => {
  button.addEventListener("pointerover", function () {
    // If you hover over other buttons, don't close the toggle filter
    isHoveringToggle = false; // This could be set differently based on your logic
  });
});

/////////////////////////////////////////////////////////Leo's Code///////////////////////////////////////////////////////////////////////

//This function flattens the intern json, and then shuffles the interns into pairs!
async function fetchData() {
  try {
    // Fetch the intern data
    const response = await fetch("interns.json");
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    const data = await response.json();

    const interns = [];

    // Flatten the data
    data[0].locations.forEach((location) => {
      const locationName = location.locationName;
      location.departments.forEach((department) => {
        department.interns.forEach((intern) => {
          interns.push({
            name: intern.name,
            location: locationName,
            department: department.departmentName,
          });
        });
      });
    });

    // Shuffle the interns
    const shuffledInterns = interns.sort(() => 0.5 - Math.random());

    // Create the pairs
    const pairs = [];
    for (let i = 0; i < shuffledInterns.length; i += 2) {
      if (i + 1 < shuffledInterns.length) {
        pairs.push([shuffledInterns[i], shuffledInterns[i + 1]]);
      } else {
        // Handle case with an odd number of interns
        pairs.push([shuffledInterns[i]]);
      }
    }

    // Log the flattened data and pairs
    console.log(
      "Pairs:",
      pairs.map((pair) =>
        pair.map((intern) => ({
          name: intern.name,
          location: intern.location,
          department: intern.department,
        }))
      )
    );
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
}

fetchData();
//
