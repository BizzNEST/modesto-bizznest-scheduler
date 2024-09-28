import { json_array } from './src/util/json_convert.js'; // Import the array

let internData = [...json_array]; // Use the array fetched from json_convert.js
let filteredInterns = [...internData]; // Start with all interns
let selectedInterns = new Set(); // Store selected interns

const internTableBody = document.getElementById("intern-tbody");
const pairingsList = document.getElementById("pairings-list");
const totalPairings = document.getElementById("total-pairings");
let selectedPairings = [];

// Populate the intern table when the page loads
populateInternTable(filteredInterns);

// Function to populate the intern table dynamically
function populateInternTable(interns) {
    internTableBody.innerHTML = ''; // Clear existing table
    interns.forEach(intern => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${intern.name}</td>
            <td>${intern.department}</td>
            <td>${intern.location}</td>
            <td><button class="toggle-button"></button></td>
        `;

        const toggleButton = row.querySelector(".toggle-button");

        // Check if this intern has already been selected and update the button state
        if (selectedInterns.has(intern.name)) {
            toggleButton.classList.add("selected");
        }

        toggleButton.addEventListener("click", () => {
            toggleSelect(toggleButton, intern);
        });

        internTableBody.appendChild(row);
    });
}

// Function to add/remove an intern to/from the Pairing Box
function toggleSelect(button, intern) {
    if (!button.classList.contains("selected")) {
        button.classList.add("selected");
        selectedInterns.add(intern.name);
        addToPairings(intern);
    } else {
        button.classList.remove("selected");
        selectedInterns.delete(intern.name);
        removeFromPairings(intern);
    }
}

// Function to add an intern to the Pairing Box
function addToPairings(intern) {
    if (!selectedPairings.some(item => item.name === intern.name)) {
        selectedPairings.push(intern);

        const li = document.createElement("li");
        li.innerHTML = `
            ${intern.name} <span class="department">${intern.department}</span>
            <button class="remove-button">×</button>
        `;

        li.querySelector(".remove-button").addEventListener("click", () => {
            pairingsList.removeChild(li);
            selectedPairings = selectedPairings.filter(item => item.name !== intern.name);
            selectedInterns.delete(intern.name); // Remove from selected interns set
            updateTotalPairings();
            updateInternTableButtons();
        });

        pairingsList.appendChild(li);
        updateTotalPairings();
    }
}

// Function to remove an intern from the Pairing Box
function removeFromPairings(intern) {
    selectedPairings = selectedPairings.filter(item => item.name !== intern.name);
    const li = Array.from(pairingsList.children).find(item => item.textContent.includes(intern.name));
    if (li) {
        pairingsList.removeChild(li);
    }
    updateTotalPairings();
    updateInternTableButtons();
}

// Update toggle button state when interns are added/removed
function updateInternTableButtons() {
    document.querySelectorAll("#intern-tbody tr").forEach(row => {
        const internName = row.querySelector("td").textContent;
        const toggleButton = row.querySelector(".toggle-button");
        if (selectedInterns.has(internName)) {
            toggleButton.classList.add("selected");
        } else {
            toggleButton.classList.remove("selected");
        }
    });
}

// Function to update the Pairing Box count
function updateTotalPairings() {
    totalPairings.textContent = `${selectedPairings.length} Total`;
}

// **Select All Functionality**
document.getElementById("select-all").addEventListener("click", () => {
    filteredInterns.forEach(intern => {
        if (!selectedInterns.has(intern.name)) {
            selectedInterns.add(intern.name);
            addToPairings(intern);
        }
    });
    updateInternTableButtons();
});

// **Deselect All Functionality**
document.getElementById("deselect-all").addEventListener("click", () => {
    filteredInterns.forEach(intern => {
        if (selectedInterns.has(intern.name)) {
            selectedInterns.delete(intern.name);
            removeFromPairings(intern);
        }
    });
    updateInternTableButtons();
});

// Clear all pairings
document.getElementById("clear-all").addEventListener("click", () => {
    pairingsList.innerHTML = '';
    selectedPairings = [];
    selectedInterns.clear();
    updateInternTableButtons();
    updateTotalPairings();
});

// **Filter Functionality** for location and department
function applyFilters() {
    const activeLocations = Array.from(document.querySelectorAll('#location-filters .active')).map(btn => btn.getAttribute('data-location'));
    const activeDepartments = Array.from(document.querySelectorAll('#department-filters .active')).map(btn => btn.getAttribute('data-department'));

    filteredInterns = internData.filter(intern => {
        const locationMatch = activeLocations.length === 0 || activeLocations.includes(intern.location);
        const departmentMatch = activeDepartments.length === 0 || activeDepartments.includes(intern.department);
        return locationMatch && departmentMatch;
    });

    populateInternTable(filteredInterns);
    updateInternTableButtons();  // Ensure button states persist
}

// Toggle Filter Buttons (active state)
document.querySelectorAll('.filter-buttons button').forEach(button => {
    button.addEventListener('click', () => {
        button.classList.toggle('active');
        applyFilters();
    });
});

// **Search Functionality** for searching from JSON
document.getElementById('search').addEventListener('input', function () {
    const query = this.value.toLowerCase();
    const searchResults = internData.filter(intern => {
        return intern.name.toLowerCase().includes(query) || 
               intern.department.toLowerCase().includes(query) || 
               intern.location.toLowerCase().includes(query);
    });
    populateInternTable(searchResults);
    updateInternTableButtons();  // Ensure button states persist
});


/////////////////////////////////////////////////////////Leo's Code///////////////////////////////////////////////////////////////////////


            //This function flattens the intern json, and then shuffles the interns into pairs!
async function fetchData() {
    try {
            // Fetch the intern data
        const response = await fetch('interns.json');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();

        const interns = [];

            // Flatten the data
        data[0].locations.forEach(location => {
            const locationName = location.locationName;
            location.departments.forEach(department => {
                department.interns.forEach(intern => {
                    interns.push({
                        name: intern.name,
                        location: locationName,
                        department: department.departmentName
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
        console.log('Pairs:', pairs.map(pair => pair.map(intern => ({ name: intern.name, location: intern.location, department: intern.department }))));

    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

fetchData();
//
