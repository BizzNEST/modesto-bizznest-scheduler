export const json_array = await generate_array('./src/documents/interns.json');

export async function generate_array(url) {
    const response = await fetch(url);
    const json = await response.json();
    return json[0].locations.flatMap(location => 
        location.departments.flatMap(department => 
            department.interns.map(intern => ({
                name: intern.name,
                department: department.departmentName,
                location: location.locationName
            }))
        )
    );
}