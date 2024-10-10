//looks for a certain intern
export function look_for_intern(root_array,name) {
        for ( let object of root_array ) {
            for ( let location of object["locations"] ) {
                 for ( let department of location["departments"] ) {
                    for ( let intern of department["interns"] ) {
                        let current_name = intern["name"];
                        if ( current_name.toLowerCase() === name.toLowerCase() ) {
                            return true
                            }
                        }

                    }
                }
            }
            return false
    };

//gets all interns names
export function get_all_interns_names(root_array) {
    let interns = []
    for ( let object of root_array ) {
        for ( let location of object["locations"] ) {
             for ( let department of location["departments"] ) {
                for ( let intern of department["interns"] ) {
                    let current_name = intern["name"];
                    interns.push(current_name)
                    }

                }
            }
        }
        return interns;
    }

//Algorithims For Dynamic Use as long as structure is consistent 
export function get_all_departments(root_array) {
    let departments = []
    for (let object of root_array){
        for (let location of object["locations"]) {
            for (let department of location["departments"]) {
                let current_department = department["departmentName"];
                    if(departments.indexOf(current_department) === -1) {
                        departments.push(current_department)
                    }
                    
                }
            }
        return departments
        }
    }
//gets all locations
export function get_all_locations(root_array) {
    let locations = []
    for (let object of root_array){
        for (let location of object["locations"]) {
            let current_location = location["locationName"]
            locations.push(current_location);
            }
        return locations
        }
    }
//get the data of a specified intern name
export function get_intern_data(root_array,name){
        let intern_data = [];
        for ( let object of root_array ) {
            for ( let location of object["locations"] ) {
                let current_location = location["locationName"];
                for ( let department of location["departments"] ) {
                    let current_department = department["departmentName"];
                    for ( let intern of department["interns"] ) {
                        let current_name = intern["name"];
                        if ( current_name.toLowerCase() === name.toLowerCase() ) {
                            intern_data.push(current_name,current_location,current_department)
                            return intern_data;
                            }
                        }

                    }
                }
            }
        return console.error("could not find intern");
        
        }

//allows you to retrieve all interns in a specific department across all locations
export function get_all_interns_in_department(root_array,department) {
    let interns = [];
    let departments = get_all_departments(root_array);
    if(departments.indexOf(department) === -1) {
        return console.error(`${department} is not a department`);
        }

    let department_index = departments.indexOf(department);
    
    for(let object of root_array){
        for(let location of object["locations"]) {
            for(let intern of location["departments"][department_index]["interns"]){
                let intern_data = [intern["name"],location["locationName"],department]
                interns.push(intern_data)
                }
            }
        }
    return interns;
    }
    
//Gets all interns in a specific location
export function get_all_interns_in_location(root_array,location){
    let interns = [];
    let locations = get_all_locations(root_array);
    if(locations.indexOf(location) === -1) {
        return console.error(`${location} is not a location`)
        }
    
    let location_index = locations.indexOf(location);
    for(let object of root_array) {
        for(let department of object["locations"][location_index]["departments"])
            for(let intern of department["interns"]) {
            let intern_data = [intern["name"],location,department["departmentName"]]
            interns.push(intern_data);
            }
        }   
    return interns;
    }
//Gets all departments stores based on index of string array
//get interns by location(location_name)
//Gets all location stores index based on index of string array

export function move_intern_to(root_array,location,department,intern_name) { 
    //Case Sensitivity - HIGH 
    //Change Intern Data Accordingly
    //moves intern from one location to another in json structure
    let current_intern_data = get_intern_data(root_array,intern_name);

    let departments = get_all_departments(root_array)
    if (departments.indexOf(department) === -1){
        return console.error(`${department} Is Not A Department`);
        }  

    let locations = get_all_locations(root_array)
    if (locations.indexOf(location) === -1){
        return console.error(`${location} Is Not A location`)
        }  
    
    let new_department_object_index = departments.indexOf(department);
    let current_department_object_index = departments.indexOf(current_intern_data[2]);
    let new_location_object_index = locations.indexOf(location);
    let current_location_object_index = locations.indexOf(current_intern_data[1]);
    
    let current_intern_array = undefined;
    let new_intern_array = undefined;

    for(let object of root_array){
        current_intern_array = object["locations"][current_location_object_index]["departments"][current_department_object_index]["interns"];
        new_intern_array = object["locations"][new_location_object_index]["departments"][new_department_object_index]["interns"];
        }
    
    let intern_index = 0;
    for(let intern of current_intern_array){
        if (intern["name"].toLowerCase() === intern_name.toLowerCase()){
            new_intern_array.push(current_intern_array.splice(intern_index,1)[0]);
            return
            }
        intern_index++
        }
     
        return console.error("could not move intern to other location")
    } 
    
//add new location
export function add_new_location(root_array,location_name){
    for(let object of root_array){
        object["locations"].push(new Location(root_array,location_name));
        }
    }

//removes a location.
export function remove_location(root_array,location_name) {
    let locations = get_all_locations(root_array);
    if(locations.indexOf(location_name) === -1){
        return console.error(`could not find ${location_name} as a location`)
        }
    for(let object of root_array){
        for(let location of object["locations"])   {
            if(location["locationName"] === location_name) {
                //Remove location
                let location_index = object["locations"].indexOf(location);
                object["locations"].splice(location_index,1);
            }
        }
    }
    }

//adds a department in all locations
export function add_new_department(root_array,department_name) {
    for(let object of root_array){
        for(let location of object["locations"]) {
            location["departments"].push(new Department(root_array,department_name));
            }
        }
    }

    //removes a  department in all locations
export function remove_department(root_array,department_name) {
    let departments = get_all_departments(root_array);
    if(departments.indexOf(department_name) === -1) {
        return console.log(`${department_name} does not exist`)
    }
    for(let object of root_array){
        for(let location of object["locations"]) {
            for(let department of location["departments"]){
                if(department["departmentName"] === department_name) {
                    let department_index = location["departments"].indexOf(department);
                    location["departments"].splice(department_index,1);
                }
            };
            }
        }
    }

//add new department(location)
//remove department deletes all departments in all locations
//add new intern(location,department])

//adds a new intern object into a specified location and department
export function add_intern_to(root_array,location,department,intern_name){
    let interns = get_all_interns_names(root_array);
    if ( interns.indexOf(intern_name) !== -1 ) {
        return console.error(`${intern_name} exist already, use: move_intern_to()`);
    }
    let locations = get_all_locations(root_array);
    if ( locations.indexOf(location) === -1 ) {
        console.error(`${location} is not a location`)
        }
    let departments = get_all_departments(root_array);
    if ( departments.indexOf(department) === -1 ) {
        console.error(`${department} is not a department`)
        }   
    
    let location_index = locations.indexOf(location);
    let department_index = departments.indexOf(department);

    for(let object of root_array) {
        object["locations"][location_index]["departments"][department_index]["interns"].push(new Intern(root_array,intern_name))
        }
}

//Class Constructor Functions \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \/
export function Intern(root_array,name) {
    this["name"] = name;
    }
export function Department(root_array,departmentName) {
    this["departmentName"] = departmentName
    this["interns"] = [];
    }
export function Location(root_array,locationName) {
    this["locationName"] = locationName;
    this["departments"] = [];
    let deparment_list = get_all_departments(root_array);
    for(let department_name of deparment_list) {
        this["departments"].push(new Department(root_array,department_name));
        }   
    }