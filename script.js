import { json_array } from "./src/util/json_convert.js"; // Import the array

    let internData = [...json_array];
    let filteredInterns = [...internData];
    let selectedInterns = [];
    let selectedPairings = [];

    const internTableBody = document.getElementById("intern-tbody");
    const pairingsList = document.getElementById("pairings-list");
    const totalPairings = document.getElementById("total-pairings");

            // Populate intern table when the page loads, so it's not empty when starting 
    populateInternTable(filteredInterns);

    function populateInternTable(interns) {
        console.log(interns)
        internTableBody.innerHTML = interns.map((intern) => `
        <tr>
            <td>${intern.name}</td>
            <td>${intern.department}</td>
            <td>${intern.location}</td>
            <td><button class="toggle-button" data-name="${intern.name}"></button></td>
        </tr>`
    ).join('');

            // Reattach event listeners
    document.querySelectorAll('.toggle-button').forEach(button => {
        const internName = button.getAttribute('data-name');
            // Use .some() to check if the intern is selected
        if (selectedInterns.some(i => i.name === internName)) {
            button.classList.add("selected");
        }

        button.addEventListener('click', () => {

            toggleSelect(button, internName);

        });
    });
    }

    function toggleSelect(button, internName) {
        const intern = internData.find(i => i.name === internName);
        if (selectedInterns.some(i => i.name === internName)) {
            selectedInterns = selectedInterns.filter(i => i.name !== internName);
            removeFromPairings(internName);
        } else {
            selectedInterns.push(intern); // Add the entire intern object
            addToPairings(internName);
        }
    button.classList.toggle('selected');
}

    function addToPairings(internName) {
        const intern = selectedInterns.find(i => i.name === internName);
        if (!selectedPairings.some(i => i.name === internName)) {
            selectedPairings.push(intern); // Push the intern object
        
            const li = document.createElement("li");
            li.innerHTML = `${intern.name} <span class="department">${intern.department}</span>
                            <button class="remove-button">×</button>`;
            li.querySelector(".remove-button").addEventListener("click", () => {      
            removeFromPairings(internName, li)
            let all_toggle_butttons = document.querySelectorAll('.toggle-button');
            console.log(all_toggle_butttons)
            for(let button of all_toggle_butttons){
                   if(button.getAttribute("data-name") === internName){
                        toggleSelect(button,internName);
                        }
                }
            });
            pairingsList.appendChild(li);
            updateTotalPairings();

        }
    }

function removeFromPairings(internName, li = null) {
    selectedPairings = selectedPairings.filter(i => i.name !== internName);
    
    if (li) {
        pairingsList.removeChild(li);
    } else {
        const item = Array.from(pairingsList.children).find(item => item.textContent.includes(internName));
        if (item) {
            pairingsList.removeChild(item);
        }
    }

    updateTotalPairings();


}


        // Update toggle button state when interns are added/removed (visually changes the buttons)
    function updateInternTableButtons() {
        document.querySelectorAll('.toggle-button').forEach(button => {
            const internName = button.getAttribute('data-name');
            if (selectedInterns.some(i => i.name === internName)) {
                button.classList.add('selected');
            } else {
                button.classList.remove('selected');
            }
        });
    }

        // Function to update the Pairing Box count
    function updateTotalPairings() {
        totalPairings.textContent = `${selectedPairings.length} Total`;
}
      
    // Select All (adds all the filtered or displayed interns to the pairing box)
document.getElementById("select-all").addEventListener("click", () => {
    const visibleInterns = Array.from(document.querySelectorAll('#intern-tbody tr')).map(row => {
        const internName = row.querySelector('.toggle-button').getAttribute('data-name');
        return internData.find(intern => intern.name === internName);
    });

    visibleInterns.forEach(intern => {
        if (!selectedInterns.some(i => i.name === intern.name)) {
            selectedInterns.push(intern);
            addToPairings(intern.name);
        }
    });
    updateInternTableButtons();
});

     // Deselect All (removes all the filtered or displayed interns from the pairing box)
document.getElementById("deselect-all").addEventListener("click", () => {
    const visibleInterns = Array.from(document.querySelectorAll('#intern-tbody tr')).map(row => {
        const internName = row.querySelector('.toggle-button').getAttribute('data-name');
        return internData.find(intern => intern.name === internName);
    });

    visibleInterns.forEach(intern => {
        if (selectedInterns.some(i => i.name === intern.name)) {
            selectedInterns = selectedInterns.filter(i => i.name !== intern.name);
            removeFromPairings(intern.name); // Remove from pairings and update
        }
    });
    updateInternTableButtons();
});


        // clears all interns from the pairing box.
    document.getElementById("clear-all").addEventListener("click", () => {
        selectedInterns = [];
        selectedPairings = [];
        pairingsList.innerHTML = '';
        updateInternTableButtons();
        updateTotalPairings();
    });

        // **Filter Functionality** for location and department
    function applyFilters() {
        const activeLocations = Array.from(document.querySelectorAll('#location-filters .active')).map(btn => btn.getAttribute('data-location'));
        const activeDepartments = Array.from(document.querySelectorAll('#department-filters .active')).map(btn => btn.getAttribute('data-department'));

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
  .getElementById("green-button")
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



const generateButton = document.getElementById('generate-pairing');

let internPairs = [];
let isPairedByLocation = false;
let isPairedByDepartment = false;
let isPairedByDifferentLocation = false;
let isPairedByDifferentDepartment = false;

const locationButton = document.querySelector("#toggle-pairing-filter button:nth-child(1)");
const departmentButton = document.querySelector("#toggle-pairing-filter button:nth-child(2)");
const differentLocationButton = document.querySelector("#toggle-pairing-filter button:nth-child(3)");
const differentDepartmentButton = document.querySelector("#toggle-pairing-filter button:nth-child(4)");

// Toggle logic for the buttons
locationButton.addEventListener("click", function () {
    isPairedByLocation = !isPairedByLocation;
    console.log("Paired by Location:", isPairedByLocation);

    // Toggle the selected class to change color
    if (isPairedByLocation) {
        locationButton.classList.add("selected");
    } else {
        locationButton.classList.remove("selected");
    }
});
  
// Toggle logic for "By Department" button
departmentButton.addEventListener("click", function () {
    isPairedByDepartment = !isPairedByDepartment;
    console.log("Paired by Department:", isPairedByDepartment);

    // Toggle the selected class to change color
    if (isPairedByDepartment) {
        departmentButton.classList.add("selected");
    } else {
        departmentButton.classList.remove("selected");
    }
});

differentLocationButton.addEventListener("click", function () {
    isPairedByDifferentLocation = !isPairedByDifferentLocation;
    console.log("Paired by different Location:", isPairedByDifferentLocation);

    if (isPairedByDifferentLocation) {
        differentLocationButton.classList.add("selected");
    } else {
        differentLocationButton.classList.remove("selected");
    }
});

differentDepartmentButton.addEventListener("click", function () {
    isPairedByDifferentDepartment = !isPairedByDifferentDepartment;
    console.log("Paired by different Department:", isPairedByDifferentDepartment);

    if (isPairedByDifferentDepartment) {
        differentDepartmentButton.classList.add("selected");
    } else {
        differentDepartmentButton.classList.remove("selected");
    }
});

function pairInternsByCondition(internGroups, conditionFns, unpairedInterns) {
    let usedInterns = new Set();

    for (let i = 0; i < internGroups.length; i++) {
        // Skip if the current intern is already paired
        if (usedInterns.has(i)) continue;

        let paired = false;

        for (let j = i + 1; j < internGroups.length; j++) {
            // Skip if the second intern is already paired
            if (usedInterns.has(j)) continue;

            // Apply all condition functions in conditionFns array
            const allConditionsMet = conditionFns.every(fn => fn(internGroups[i], internGroups[j]));

            if (allConditionsMet) {
                // Pair them if all conditions are satisfied
                internPairs.push([internGroups[i], internGroups[j]]);
                usedInterns.add(i);
                usedInterns.add(j);
                paired = true;
                break;
            }
        }

        // If no valid pair found, add to unpaired interns
        if (!paired) {
            unpairedInterns.push(internGroups[i]);
        }
    }
}

function createConditionFn(key, condition) {
    return (intern1, intern2) => {
        if (condition === 'same') {
            return intern1[key] === intern2[key]; // For 'same' condition
        } else if (condition === 'different') {
            return intern1[key] !== intern2[key]; // For 'different' condition
        }
    };
}

// Function to handle either 'same' or 'different' conditions dynamically
function createConditionFns() {
    let conditionFns = [];

    // Add 'same location' condition if selected
    if (isPairedByLocation) {
        conditionFns.push(createConditionFn('location', 'same'));
    }

    // Add 'different location' condition if selected
    if (isPairedByDifferentLocation) {
        conditionFns.push(createConditionFn('location', 'different'));
    }

    // Add 'same department' condition if selected
    if (isPairedByDepartment) {
        conditionFns.push(createConditionFn('department', 'same'));
    }

    // Add 'different department' condition if selected
    if (isPairedByDifferentDepartment) {
        conditionFns.push(createConditionFn('department', 'different'));
    }

    return conditionFns;
}

function checkFilterConflicts() {
    if (isPairedByLocation && isPairedByDifferentLocation) {
        alert("Cannot select both 'Same Location' and 'Different Location' filters.");
        return true;
    }
    if (isPairedByDepartment && isPairedByDifferentDepartment) {
        alert("Cannot select both 'Same Department' and 'Different Department' filters.");
        return true;
    }
    return false; // No conflicts found
}

function generatePairings() {
    // Check for conflicts before proceeding
    if (checkFilterConflicts()) {
        return; // Stop if there are conflicts
    }

    // Shuffle the interns
    let shuffledInterns = selectedInterns.sort(() => 0.5 - Math.random());
    internPairs = [];
    let unpairedInterns = [];

    // Create the array of condition functions based on the active filters
    const conditionFns = createConditionFns();

    if (conditionFns.length > 0) {
        // Pair interns based on the selected filters
        pairInternsByCondition(shuffledInterns, conditionFns, unpairedInterns);
    } else {
        // Random pairing with no filter
        createPairs(shuffledInterns, unpairedInterns);
    }

        // Log the flattened data and internPairs
    console.log('internPairs:', internPairs.map(pair => pair.map(intern => ({ name: intern.name, location: intern.location, department: intern.department }))));
    console.log('unpairedInterns:', unpairedInterns.map(intern => ({ name: intern.name, location: intern.location, department: intern.department })));
    sessionStorage.setItem('internPairs', JSON.stringify(internPairs));
    sessionStorage.setItem('unpairedInterns', JSON.stringify(unpairedInterns));
    sessionStorage.setItem('internData',JSON.stringify(internData));
    sessionStorage.setItem('isPairedByLocation', JSON.stringify(isPairedByLocation));
    sessionStorage.setItem('isPairedByDepartment', JSON.stringify(isPairedByDepartment));
    sessionStorage.setItem('isPairedByDifferentLocation', JSON.stringify(isPairedByDifferentLocation));
    sessionStorage.setItem('isPairedByDifferentDepartment', JSON.stringify(isPairedByDifferentDepartment));
    window.location.href = 'results.html';
};

                    // Get modal element
        const modal = document.getElementById('tutorial-modal');

                    // Get open modal button
        const openModalBtn = document.getElementById('openModalBtn');

                    // Get close button
        const closeBtn = document.querySelector('.close');

                    // Listen for open click
        openModalBtn.addEventListener('click', () => {
            modal.style.display = 'block'; // Show the modal
        });

                    // Listen for close click
        closeBtn.addEventListener('click', () => {
            if (modal.style.display = 'block') {
                modal.style.display = 'none'; // Hide the modal
        }
    });
                    // Add the click event listener to the button
            generateButton.addEventListener('click', generatePairings);
function pairWithinGroups(groupedInterns, unpairedInterns) {
    Object.values(groupedInterns).forEach(group => {
        if (group.length >= 2) {
            createPairs(group, unpairedInterns);
        } else {
            // If the group has fewer than 2 interns, they are unpaired
            unpairedInterns.push(...group);
        }
    });
};

function createPairs(interns, unpairedInterns) {
    for (let i = 0; i < interns.length; i += 2) {
        if (i + 1 < interns.length) {
            internPairs.push([interns[i], interns[i + 1]]);
        } else {
            // Handle case with an odd number of interns
            unpairedInterns.push(interns[i]);
        }
    }
};

        // Add the click event listener to the button
generateButton.addEventListener('click', generatePairings);
    