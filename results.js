
    let internPairs = []; 

        // Gets the data from sessionStorage   
    function loadInternPairs() {
        const storedPairs = JSON.parse(sessionStorage.getItem('internPairs')) || []; 
        if (storedPairs.length) { 
            internPairs = storedPairs;
            displayInterns(internPairs); // Display interns directly without shuffling
        }}

        // Call this function to display the pairs
    function displayInterns(pairs) {
        const container = document.getElementById('results-list');
        let html = '';
        let index = 0;

    pairs.forEach(pair => {
        const pairClass = index % 2 !== 0 ? 'every-other-background' : '';
        html += `<div class="pair ${pairClass}">`;

        // Assuming each pair contains multiple interns
    pair.forEach(intern => {
        html += `
            <div class="intern">
                <div class="intern-name">${intern.name}</div>
                <div class="intern-location">${intern.location}</div>
                <div class="intern-department">${intern.department}</div>
            </div>
                `;
        });

        html += `</div>`;
        index++;
    });
    container.innerHTML = html;
    }

        // Call loadInternPairs function when the page loads
    window.onload = function() {
        loadInternPairs();
    };
