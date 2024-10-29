// Display the pulled interns to the page
export function displayInterns(pairs, unpaired) {
    const container = document.getElementById('results-list');
    let html = '';
    let index = 0;

    // Add a lighter background to every other pair that is displayed
pairs.forEach(pair => {
    const pairClass = index % 2 !== 0 ? 'every-other-background' : '';
    html += `<div class="pair ${pairClass}">`;

    // For each intern display their name location and department
pair.forEach(intern => {
    // intern div added so each intern can be modified specifically
    html += `
        <div class="intern">
            <button class="add-button" id="${intern.name}">+</button>
                <div class="intern-name">${intern.name}</div>
                <div class="intern-location">${intern.location}</div>
                <div class="intern-department">${intern.department}</div>
            <button class="remove-button" id="${intern.name}">Remove</button>
        </div>
            `;
        });
        html += `</div>`;
        index++;
    });

    // Display the unpaired interns with the same background for consistency
unpaired.forEach(intern => {
    const pairClass = index % 2 !== 0 ? 'every-other-background' : '';
    html += `<div class="pair ${pairClass}">`;

    // intern is displayed similarly to a paired intern but alone
    html += `
        <div class="intern">
        <button class="add-button" id="${intern.name}">+</button>
            <div class="intern-name">${intern.name}</div>
            <div class="intern-location">${intern.location}</div>
            <div class="intern-department">${intern.department}</div>
        <button class="remove-button" id="${intern.name}">Remove</button>
    </div>
    `;

    html += `</div>`;
    index++;
});
container.innerHTML = html;
}