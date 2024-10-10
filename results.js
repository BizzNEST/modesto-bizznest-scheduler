import * as generate_CSV from "./src/util/generate_csv.js"; 
import * as Accuracy from "./src/util/accuracy.js";

document.addEventListener("DOMContentLoaded", () => {
    let internPairs = []; 
    let unpairedInterns = [];
    let internData = undefined
    // Gets the data from sessionStorage   
    function loadInternPairs() {
        const storedPairs = JSON.parse(sessionStorage.getItem('internPairs')) || [];
        const storedUnpaired = JSON.parse(sessionStorage.getItem('unpairedInterns')) || [];
        if (storedPairs.length) { 
            internPairs = storedPairs;
            displayInterns(internPairs, storedUnpaired); // Display interns directly without shuffling
        }}

        const backButton = document.getElementById('back-button');
            backButton.addEventListener('click', function() {
                window.history.back();
            });

        // Call this function to display the pairs
    function displayInterns(pairs, unpaired) {
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
                <button class="add-button" id="${intern.name}">+</button>
                    <div class="intern-name">${intern.name}</div>
                    <div class="intern-location">${intern.location}</div>
                    <div class="intern-department">${intern.department}</div>
                 <button class="remove-button" id="${intern.name} remove-button">Remove</button>
            </div>
                `;
        });

        html += `</div>`;
        index++;
    });

    // Display the unpaired interns
    unpaired.forEach(intern => {
        const pairClass = index % 2 !== 0 ? 'every-other-background' : '';
        html += `<div class="pair ${pairClass}">`;

        // Unpaired intern is displayed similarly to a paired intern but alone
        html += `
            <div class="intern">
            <button class="add-button" id="${intern.name}">+</button>
                <div class="intern-name">${intern.name}</div>
                <div class="intern-location">${intern.location}</div>
                <div class="intern-department">${intern.department}</div>
            <button class="remove-button" id="${intern.name} remove-button">Remove</button>
        </div>
        `;

        html += `</div>`;
        index++;
    });
    container.innerHTML = html;
    }

        // Call loadInternPairs function when the page loads
    window.onload = function() {
        loadInternPairs();
        load_intern_data();
        window_functionality_setup();
        edit_button_functionality_setup();
        add_button_functionality_setup();
        Accuracy.calculatePairAccuracy(internPairs);
    };

    //event listener for download csv
    document.getElementById('download-csv-button').addEventListener('click', function () {
        generate_CSV.downloadCSV(generate_CSV.generateCSV(internPairs), 'intern_pairs.csv');
    });

    //Alan's Code
    //--Window Functions
    //Sets Up Window Functionality
    let card_hovering = false;
    let add_button_parent = undefined;
    let edit_mode_state = false
    let removedInterns = []
    
    function load_intern_data(){
        const storedinterData = JSON.parse(sessionStorage.getItem('internData')) || [];
        internData = storedinterData;
        const storedUnpaired = JSON.parse(sessionStorage.getItem('unpairedInterns')) || [];
        unpairedInterns = storedUnpaired
        }

    function window_functionality_setup(){
        //Window Close Button
        let window_close_button = document.querySelector(".close-button");
            window_close_button.addEventListener('click',close_edit_window);
        
        //Seatchbar Setup
        let seach_bar = document.getElementById("edit-search-bar");
            seach_bar.addEventListener("input",on_type)
            seach_bar.addEventListener("blur",on_blur)
        };
    
    function on_type() {
        let search_result_container = document.querySelector(".search-results-container");
        search_result_container.style.visibility = "visible";

        let seach_bar = document.getElementById("edit-search-bar");
        let query = seach_bar.value.toLowerCase();
        const search_results = internData.filter(
            (intern) =>
              intern.name.toLowerCase().includes(query) ||
              intern.department.toLowerCase().includes(query) ||
              intern.location.toLowerCase().includes(query)
          );
        populate_search_results(search_results);
        }

    function on_blur() {
        if(card_hovering === true){return}
        //If Hovering During Card Do Not Blur
        let search_result_container = document.querySelector(".search-results-container");
        search_result_container.style.visibility = "collapse";
    }

    function populate_search_results(search_results){
        //Removes Event Listener From Previous Intern Cards
        let search_result_container = document.querySelector(".search-results-container")
        if (search_result_container.childElementCount){
            for(let child of search_result_container.childNodes)
                {
                    remove_card_event_listener(child);
                }
            }
    
        let search_limit = 0;
        let html = '';
        for (let intern of search_results){
            if(search_limit > 2){break}
            let interncard = `<div class="intern-card" id="${intern.name}">
                            <p>${intern.name}</p> 
                            <hr>
                            <p>${intern.department}</p>
                            <hr>
                            <p>${intern.location}</p>
                            </div>`
            html += interncard;
            search_limit++
            }
        //Asigns Event Listner
        search_result_container.innerHTML = html
        for(let child of search_result_container.childNodes){
            let internName = child.firstChild.innerHTML
            setup_card_event_listener(child)
            }     
    }

    function setup_card_event_listener(card){
        card.addEventListener("click",on_card_click,)
        card.addEventListener("mouseover",on_card_hover,)
        card.addEventListener("mouseout",on_card_leave,)
    }

    function remove_card_event_listener(card){
        card.removeEventListener("click",on_card_click,)
        card.removeEventListener("mouseover",on_card_hover,)
        card.removeEventListener("mouseout",on_card_leave,)
    }

    function on_card_click(card){
        //If Clicked On Text move refrence to div : Div contains id
        let clicked_card = card.target;
        if (clicked_card.tagName !== "DIV"){
            clicked_card = clicked_card.parentNode}
        let added_intern_name = clicked_card.id;
        move_intern(added_intern_name,add_button_parent);
        close_edit_window();
        activate_edit_mode();
        add_button_functionality_setup()
    }

    function move_intern(intern_name,button_parent){
        //Remove if intern is existing
        if(intern_name===button_parent){
            return
        }
        let added_intern = undefined;
        function remove_intern(){
            //IF its in paired interns
            let removed_intern_info = get_intern_in_pair(internPairs,intern_name)
            if(removed_intern_info){
                added_intern = remove_intern_from_pair(removed_intern_info[1],removed_intern_info[2])
                return added_intern;
                }   
            //If its in unpaired interns.         
            removed_intern_info = get_unpaired_intern(unpairedInterns,intern_name);
            if(removed_intern_info){
                added_intern = remove_unpaired_intern(removed_intern_info[1])
                return added_intern;
                }
        return (undefined);
        }
        added_intern = remove_intern()

        //If not found in the pair page get it from intern data
        if (added_intern === undefined){
            added_intern = internData.find(intern => intern.name === intern_name)
            }
        if (added_intern === undefined){
            console.error("Intern Not Found: Cannot Pair Intern.")
            }

        //If desired location is a pair add added intern 
        let new_location_info = get_intern_in_pair(internPairs,button_parent)
        if (new_location_info !== undefined && new_location_info !== false){
            //Move To New location
            if(new_location_info[2] <= 0){
                let pair_location = new_location_info[1]
                internPairs[pair_location].splice(0,0,added_intern)
                displayInterns(internPairs,unpairedInterns)
                return
                }

            let pair_location = new_location_info[1]
            internPairs[pair_location].splice((new_location_info[0]-1),0,added_intern)
            displayInterns(internPairs,unpairedInterns)
            return
            
            }
        //If its a unpaired intern
        let unpaired_intern_info = get_unpaired_intern(unpairedInterns,button_parent)
        if (unpaired_intern_info !== undefined)
            {
                let intern1 = added_intern;
                let intern2 = remove_unpaired_intern(unpaired_intern_info[1])
                if(intern2 === undefined)
                    {
                        unpairedInterns.push(intern1);
                    }
                else{internPairs.push([intern1,intern2])}
                console.log(intern1,intern2)
                //remove from unpaired interns create a pair and push to paired interns
                //Fix 
                //If intern is unpaired and is the same as being pushed prob return
                displayInterns(internPairs,unpairedInterns)
                return
                
            }
        return console.error("could not move intern")
    }

    function get_intern_in_pair(pair_array,intern_name){
        for(let pair of pair_array){
            if (pair.find(intern => intern.name === intern_name) != (undefined))
                {
                    let intern = pair.find(intern => intern.name === intern_name)
                    let pair_number = internPairs.indexOf(pair);
                    let index_in_pair = pair.indexOf(intern)
                    return [intern,pair_number,index_in_pair]
                }
         }
         return false;
    }

    function get_unpaired_intern(intern_array,intern_name){
            if (intern_array.find(intern => intern.name === intern_name) != (undefined))
                {
                    let intern = intern_array.find(intern => intern.name === intern_name)
                    let index_in_array = intern_array.indexOf(intern)
                    return [intern,index_in_array]
                }
         return false;
    }
    
    function remove_intern_from_pair(pair_index,intern_location){
        let removed_intern = internPairs[pair_index].splice(intern_location,1)
        return removed_intern[0]
    }

    function remove_unpaired_intern(intern_location){
        let removed_intern = unpairedInterns.splice(intern_location,1)
        return removed_intern[0];
    }

    function on_card_hover(card){
        card_hovering = true;
    }

    function on_card_leave(card){
        card_hovering = false
    }

    function close_edit_window(){
        let edit_window = document.querySelector(".edit-window")
        edit_window.style.visibility = "hidden";
        let search_result_container = document.querySelector(".search-results-container")
        search_result_container.style.visibility = "collapse"
        let edit_window_unpaired_container = document.querySelector(".unpaired-results")
        edit_window_unpaired_container.style.visibility = "collapse";
        }

    function open_edit_window() {
        let edit_window = document.querySelector(".edit-window")
        edit_window.style.visibility = "visible";
        let edit_window_unpaired_container = document.querySelector(".unpaired-results")
        edit_window_unpaired_container.style.visibility = "visible";
        populate_unpaired_interns()
        populate_recently_removed()
    }

    function populate_unpaired_interns(){
        let unpaired_intern_conatainer = document.querySelector(".unpaired-results")
        if (unpaired_intern_conatainer.childElementCount){
            for(let child of unpaired_intern_conatainer.childNodes)
                {
                    remove_card_event_listener(child);
                }
            }
    
        let html = '';
        for (let intern of unpairedInterns){
            let interncard = `<div class="intern-card" id="${intern.name}">
                            <p>${intern.name}</p> 
                            <hr>
                            <p>${intern.department}</p>
                            <hr>
                            <p>${intern.location}</p>
                            </div>`
            html += interncard;
            }
        //Asigns Event Listner
        unpaired_intern_conatainer.innerHTML = html
        for(let child of unpaired_intern_conatainer.childNodes){
            let internName = child.firstChild.innerHTML
            setup_card_event_listener(child)
            }     
        }
    function populate_recently_removed(){
        let recent_results_container = document.querySelector(".recent-results")
        if (recent_results_container.childElementCount){
            for(let child of recent_results_container.childNodes)
                {
                    remove_card_event_listener(child);
                }
            }
    
        let html = '';
        for (let intern of removedInterns){
            let interncard = `<div class="intern-card" id="${intern.name}">
                            <p>${intern.name}</p> 
                            <hr>
                            <p>${intern.department}</p>
                            <hr>
                            <p>${intern.location}</p>
                            </div>`
            html += interncard;
            }
        //Asigns Event Listner
        recent_results_container.innerHTML = html
        for(let child of recent_results_container.childNodes){
            let internName = child.firstChild.innerHTML
            setup_card_event_listener(child)
            }  
    }
    //Edit Button Functionality
    function edit_button_functionality_setup(){
        let edit_button = document.getElementById("edit-button");
        edit_button.addEventListener('click',edit_mode_toggle);
        }

    function edit_mode_toggle(){
        if (edit_mode_state === false) {
            activate_edit_mode()
            }
        else{
            deactivate_edit_mode()
            }
        }

    function activate_edit_mode(){
        let add_button_elements = get_all_add_buttons()
        let remove_buttons_elements = get_all_remove_buttons()
        for (let element of add_button_elements) {
            element.style.visibility = "visible";
            }
        for (let element of remove_buttons_elements) {
            element.style.visibility = "visible";
            }
        edit_mode_state = true;
        }

    function deactivate_edit_mode(){
        let add_button_elements = get_all_add_buttons()
        let remove_buttons_elements = get_all_remove_buttons()
        for (let element of add_button_elements) {
            element.style.visibility = "hidden";
            // element.style.position = "absolute";
            }
        for (let element of remove_buttons_elements) {
            element.style.visibility = "hidden";
            // element.style.position = "absolute" 
            }
        edit_mode_state = false;
        }

    //Add Button Functionality
    function add_button_functionality_setup(){
        let current_buttons = get_all_add_buttons();
        if(current_buttons){
            for(let element of current_buttons){
                element.removeEventListener('click',on_add_click)
                }
            }
        let add_button_elements = get_all_add_buttons();
        for(let element of add_button_elements){
            element.addEventListener('click',on_add_click)
            }
        }

    function on_add_click(button) {
        add_button_parent = button.target.id;
        open_edit_window()
        }

    function get_all_add_buttons(){
        return document.querySelectorAll(".add-button");
        }

    function get_all_remove_buttons(){
        return document.querySelectorAll(".remove-button");
        }

    //On Button Click
    //add a pop up seachbar
    //Add All Previously Remove.
    //Previously Remove

});




