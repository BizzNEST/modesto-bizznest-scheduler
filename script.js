
    import { json_array } from './src/util/json_convert.js'; // Import the array

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

    filteredInterns = internData.filter(intern => 
        // If no location filters are active (length is 0), show all interns
        (activeLocations.length === 0 || activeLocations.includes(intern.location)) &&
        (activeDepartments.length === 0 || activeDepartments.includes(intern.department))
    );

    populateInternTable(filteredInterns); // Repopulate the intern table with the filtered results
}

    document.querySelectorAll('.filter-buttons button').forEach(button => {
        button.addEventListener('click', () => {
             // Toggle the "active" class on the button when clicked (visual)
        button.classList.toggle('active');
            // Apply the filters after toggling the active state of the button
        applyFilters();
        });
    });

        // Search Functionality 
    document.getElementById('search').addEventListener('input', function () {
        const query = this.value.toLowerCase();

        // Filter interns based on the search query (you can search names, departments, or city)
    const searchResults = internData.filter(intern => 
        intern.name.toLowerCase().includes(query) ||
        intern.department.toLowerCase().includes(query) ||
        intern.location.toLowerCase().includes(query)
    );
    populateInternTable(searchResults); 
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

            // Add the click event listener to the button
    generateButton.addEventListener('click', generatePairings);
    
