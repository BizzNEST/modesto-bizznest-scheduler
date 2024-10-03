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
            li.querySelector(".remove-button").addEventListener("click", () => removeFromPairings(internName, li));
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
            if (selectedInterns.has(internName)) {
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
                //THIS IS BROKEN
        // Select All  ( adds all the filtered interns to the pairing box. )
    document.getElementById("select-all").addEventListener("click", () => {
    filteredInterns.forEach(intern => {
        if (!selectedInterns.has(intern.name)) {
            selectedInterns.add(intern.name);
            addToPairings(intern.name);
        }
    });
    updateInternTableButtons();
});
                //THIS IS BROKEN
        // Deselect All  (this function removes all the filtered interns from the pairing box.)
    document.getElementById("deselect-all").addEventListener("click", () => {
    filteredInterns.forEach(intern => {
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

    function generatePairings() {
            // Shuffle the interns
        const shuffledInterns = selectedInterns.sort(() => 0.5 - Math.random());

            // Create the internPairs
        for (let i = 0; i < shuffledInterns.length; i += 2) {
            if (i + 1 < shuffledInterns.length) {
            internPairs.push([shuffledInterns[i], shuffledInterns[i + 1]]);
            } else {
            // Handle case with an odd number of interns
        internPairs.push([shuffledInterns[i]]);
      }
  }

            // Log the flattened data and internPairs
    console.log('internPairs:', internPairs.map(pair => pair.map(intern => ({ name: intern.name, location: intern.location, department: intern.department }))));
    sessionStorage.setItem('internPairs', JSON.stringify(internPairs));
    window.location.href = 'results.html';

}

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
    
