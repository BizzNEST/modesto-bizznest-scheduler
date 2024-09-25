
async function fetchData() {
    try {
        const response = await fetch('interns.json');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();

        // Log the fetched data to check its structure
        console.log('Fetched data:', data);

        // Ensure data is structured correctly
        if (data.length > 0 && data[0].locations) {
            displayLocationsAndDepartments(data[0]); // Pass the first object containing locations
        } else {
            console.error('Data does not contain locations or is not structured correctly:', data);
        }
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

function displayLocationsAndDepartments(data) {
    const container = document.getElementById('results-list');
    let html = '';
    let index = 0;

    data.locations.forEach(location => {
        location.departments.forEach(department => {
            department.interns.forEach(intern => {
                const internClass = index % 2 !== 0 ? 'every-other-background' : '';
                html += `
                    <div class="intern ${internClass}">
                        <div class="intern-name">${intern.name}</div>
                        <div class="intern-location">${location.locationName}</div>
                        <div class="intern-department">${department.departmentName}</div>
                    </div>
                `;

                index++;
            });
        });
    });

    container.innerHTML = html;
}

// Call the fetchData function to initiate the process
fetchData();
