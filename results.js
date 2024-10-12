import * as generate_CSV from "./src/util/generate_csv.js"; 
import * as Accuracy from "./src/util/accuracy.js";

document.addEventListener("DOMContentLoaded", () => {
    let internPairs = []; 
    let unpairedInterns = [];
    let internData = undefined
    let resultSaveButton = document.getElementById('save-button');
    let resultEditButton = document.getElementById('edit-button');
    let resultCSVButton = document.getElementById('download-csv-button');
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
                <button class="remove-button" id="${intern.name}">Remove</button>
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
            <button class="remove-button" id="${intern.name}">Remove</button>
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
        remove_button_functionality_setup();
        Accuracy.calculatePairAccuracy(internPairs);
    };

    //event listener for download csv
    resultCSVButton.addEventListener('click', function () {
        generate_CSV.downloadCSV(generate_CSV.generateCSV(internPairs), 'intern_pairs.csv');
    });

    //Alan's Code
    //--Window Functions
    //Sets Up Window Functionality
    let card_hovering = false;
    let add_button_parent = undefined;
    let edit_mode_state = false;
    let removedInterns = [];
    let curr_open_tab = undefined;
    let remove_button_parent = undefined;
    
    
    function load_intern_data(){
        const storedinterData = JSON.parse(sessionStorage.getItem('internData')) || [];
        internData = storedinterData;
        const storedUnpaired = JSON.parse(sessionStorage.getItem('unpairedInterns')) || [];
        unpairedInterns = storedUnpaired;
        }

    function window_functionality_setup(){
        //Window Close Button
        let window_close_button = document.querySelector(".close-button");
            window_close_button.addEventListener('click',close_edit_window);
        
        //Seatchbar Setup
        let seach_bar = document.getElementById("edit-search-bar");
            seach_bar.addEventListener("input",on_type)
            seach_bar.addEventListener("blur",on_blur)
        
        let unpaired_tab = document.getElementById("unpaired-tab")
        unpaired_tab.addEventListener("click",on_unpaired_tab_click)
        
        let recently_removed_tab = document.getElementById("recently-removed-tab")
        recently_removed_tab.addEventListener("click",on_recently_removed_tab_click)

        let recently_removed = document.querySelector(".recent-results")
        recently_removed.style.visibility = "none";
    }

    function on_unpaired_tab_click(tab){
        let other_tab = document.getElementById("recently-removed-tab");
        other_tab.style.backgroundColor = "#3B6250";
        tab.target.style.backgroundColor = "#378762";
        let unpaired_results_container = document.querySelector(".unpaired-results");
        open_tab(unpaired_results_container)
        }
    
    function on_recently_removed_tab_click(tab){
        let other_tab = document.getElementById("unpaired-tab"); // Make dynamic if possible
        other_tab.style.backgroundColor = "#3B6250";
          tab.target.style.backgroundColor = "#378762";
        let recent_results_container = document.querySelector(".recent-results");
        open_tab(recent_results_container)
        }   

    function open_tab(tab_page) {
        if (curr_open_tab !== undefined) {
            close_tab(curr_open_tab);
        }

        let card_height = 50
        let calculated_height = card_height * tab_page.childElementCount;

    
        curr_open_tab = tab_page;
     
        tab_page.style.height = `${Math.min(calculated_height, 300)}px`; 

        tab_page.style.display = "block"; // Use block to show the tab
        tab_page.style.visibility = "visible"
        tab_page.style.borderBottom = "4px solid #3B6250";
        tab_page.style.borderTop = "4px solid #3B6250";
    }
    
    function close_tab(tab_page) {
        tab_page.style.display = "none"; // Use none to hide the tab
        tab_page.style.height = "none";
    }
        
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
            search_limit++;
            }
        //Asigns Event Listner
        search_result_container.innerHTML = html;
        for(let child of search_result_container.childNodes){
            let internName = child.firstChild.innerHTML;
            setup_card_event_listener(child);
            }     
    }

    function setup_card_event_listener(card){
        card.addEventListener("click",on_card_click,);
        card.addEventListener("mouseover",on_card_hover,);
        card.addEventListener("mouseout",on_card_leave,);
    }

    function remove_card_event_listener(card){
        card.removeEventListener("click",on_card_click,);
        card.removeEventListener("mouseover",on_card_hover,);
        card.removeEventListener("mouseout",on_card_leave,);
    }

    function on_card_click(card){
        //If Clicked On Text move refrence to div : Div contains id
        let clicked_card = card.target;
        if (clicked_card.tagName !== "DIV"){
            clicked_card = clicked_card.parentNode;
        }
        let added_intern_name = clicked_card.id;
        move_intern(added_intern_name,add_button_parent);
        close_edit_window();
        activate_edit_mode();
        add_button_functionality_setup();
        remove_button_functionality_setup();
    }

    function move_intern(intern_name,button_parent){
        //Remove if intern is existing
        if(intern_name===button_parent){
            return;
        }
        console.log(intern_name)
        let added_intern = undefined;
        function remove_intern(){
            //IF its in paired interns
            let removed_intern_info = get_intern_in_pair(internPairs,intern_name)
            if(removed_intern_info){
                added_intern = remove_intern_from_pair(removed_intern_info[1],removed_intern_info[2])
                console.log(added_intern)
                console.log("1")
                return added_intern;
                }   
            //If its in unpaired interns.         
            removed_intern_info = get_unpaired_intern(unpairedInterns,intern_name);
            if(removed_intern_info){
                added_intern = remove_unpaired_intern(unpairedInterns,removed_intern_info[1])
                console.log(added_intern)
                console.log("2")
                return added_intern;
                }
            //if its in removed interns
            removed_intern_info = get_unpaired_intern(removedInterns, intern_name);
            console.log(removed_intern_info);
            if(removed_intern_info){
                added_intern = remove_unpaired_intern(removedInterns,removed_intern_info[1]);
                console.log(added_intern)
                console.log("3")
                return added_intern;
            }
        return (undefined);
        }
        added_intern = remove_intern();

        //If not found in the pair page get it from intern data
        if (added_intern === undefined){
            added_intern = internData.find(intern => intern.name === intern_name);
            }
        if (added_intern === undefined){
            console.error("Intern Not Found: Cannot Pair Intern.");
            }

        //If desired location is a pair add added intern 
        let new_location_info = get_intern_in_pair(internPairs,button_parent)
        if (new_location_info !== undefined && new_location_info !== false){
            //Move To New location
            if(new_location_info[2] <= 0){
                let pair_location = new_location_info[1];
                internPairs[pair_location].splice(0,0,added_intern);
                displayInterns(internPairs,unpairedInterns);
                return;
                }

            let pair_location = new_location_info[1];
            internPairs[pair_location].splice((new_location_info[0]-1),0,added_intern);
            displayInterns(internPairs,unpairedInterns);
            return;
            
            }
        //If its a unpaired intern
        let unpaired_intern_info = get_unpaired_intern(unpairedInterns,button_parent)
        if (unpaired_intern_info !== undefined)
            {
                let intern1 = added_intern;
                let intern2 = remove_unpaired_intern(unpairedInterns,unpaired_intern_info[1]);
                if(intern2 === undefined)
                    {
                        unpairedInterns.push(intern1);
                    }
                else{internPairs.push([intern1,intern2])}
                console.log(intern1,intern2);
                //remove from unpaired interns create a pair and push to paired interns
                //Fix 
                //If intern is unpaired and is the same as being pushed prob return
                displayInterns(internPairs,unpairedInterns)
                return
                
            }
        return console.error("could not move intern");
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

    function remove_unpaired_intern(intern_array,intern_location){
        let removed_intern = intern_array.splice(intern_location,1)
        return removed_intern[0];
    }

    function on_card_hover(card){
        card_hovering = true;
    }

    function on_card_leave(card){
        card_hovering = false
    }

    function close_edit_window(){
        close_tab(curr_open_tab);
        let edit_window = document.querySelector(".edit-window")
        edit_window.style.visibility = "hidden";
        let search_result_container = document.querySelector(".search-results-container")
        search_result_container.style.visibility = "collapse"
        }

    function open_edit_window() {
        let edit_window = document.querySelector(".edit-window")
        edit_window.style.visibility = "visible";

        let unpaired_results_container = document.querySelector(".unpaired-results");
        populate_unpaired_interns()
        populate_recently_removed()
        setTimeout( () => open_tab(unpaired_results_container) , 1 );
        let tab1 = document.getElementById("unpaired-tab");
        let tab2 = document.getElementById("recently-removed-tab");
        tab1.style.backgroundColor = "#378762";
        tab2.style.backgroundColor = "#3B6250";
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
            resultSaveButton.style.display = 'inline';
            resultEditButton.style.display = 'none';
            resultCSVButton.style.display = 'none'
            }
        else{
            deactivate_edit_mode()
            resultSaveButton.style.display = 'none';
            resultEditButton.style.display = 'inline';
            resultCSVButton.style.display = 'inline';
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
    
    //remove Button Functionality
    function remove_button_functionality_setup(){
        let current_buttons = get_all_remove_buttons();
        if(current_buttons){
            for(let element of current_buttons){
                element.removeEventListener('click',remove_on_click);
                }
            }
        let add_button_elements = get_all_remove_buttons();
        for(let element of add_button_elements){
            element.addEventListener('click', remove_on_click);
        }
    }

    function remove_on_click(button){
        remove_button_parent = button.target.id;
        let intern_in_pair_info = get_intern_in_pair(internPairs, remove_button_parent);
        let unpaired_intern_info = get_unpaired_intern(unpairedInterns ,remove_button_parent)
        let added_intern = undefined;
        if(unpaired_intern_info){
            added_intern = remove_unpaired_intern(unpairedInterns, unpaired_intern_info[1]);
            //console.log(added_intern);
        }
        if(intern_in_pair_info){
            added_intern = remove_intern_from_pair(intern_in_pair_info[1], intern_in_pair_info[2]);
            let pair = internPairs[intern_in_pair_info[1]]  //we can loop through internPairs check the length of arrays and if 
            //if pair has only one person it will be moved to unpaired.
            if(pair.length <= 1){
                unpairedInterns.push(pair[0]);
                internPairs.splice(intern_in_pair_info[1], 1);
            }
        }
        displayInterns(internPairs, unpairedInterns);
        removedInterns.push(added_intern);
        activate_edit_mode();
        add_button_functionality_setup();
        remove_button_functionality_setup();

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


    //save button stuff save session storage and turn on edit button and csv
    resultSaveButton.addEventListener('click', save_button_functionality);

    function save_button_functionality(){
        sessionStorage.setItem('internPairs', JSON.stringify(internPairs));
        sessionStorage.setItem('unpairedInterns', JSON.stringify(unpairedInterns));
        edit_mode_toggle();
    }
});




