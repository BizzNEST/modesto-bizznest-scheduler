
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
