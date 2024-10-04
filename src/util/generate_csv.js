export function generateCSV(parsedInternArray){
    let csvRows = [];
    csvRows.push("Group Number, Name, Department, Location\n"); //Header

    //loop over content and push pairs to array intern content
    parsedInternArray.forEach((team, index) => {
        const groupNum = index + 1;
        team.forEach(intern => {
            const internName = intern.name;
            const department = intern.department;
            const location = intern.location;
            csvRows.push(`${groupNum},${internName},${department},${location}`);
            })
        })


    return csvRows.join('\n');
}

export function downloadCSV(csvString, filename) {
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    a.click();
}