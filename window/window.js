//Data Dependencies
import { unpairedInterns } from "../data_presentation/InternManager.js";
import { removedInterns } from "../data_presentation/InternManager.js";
import { internData } from "../data_presentation/InternManager.js";
//Data Manipulation
import { move_intern } from "../data_presentation/InternManager.js";

//Add Button DOM Intern Refrence Point
import { add_button_parent } from "../edit_mode/buttons/add.js";

//Edit Mode Reference For Restore
import { activate_edit_mode } from "../edit_mode/buttons/edit.js";

//Add And Remove Functionality For Restore
import { add_button_functionality_setup } from "../edit_mode/buttons/add.js";
import { remove_button_functionality_setup } from "../edit_mode/buttons/remove.js";

//On Click Check Variables
let curr_open_tab = undefined;
let card_hovering = false;

export function window_functionality_setup(){
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

export function open_edit_window() {
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

//Close Window Button Functionality
function close_edit_window(){
    close_tab(curr_open_tab); //Close Tab First

    let edit_window = document.querySelector(".edit-window") //Grab Edit Window
    edit_window.style.visibility = "hidden"; 
    let search_result_container = document.querySelector(".search-results-container") //Grab Search results
    search_result_container.style.visibility = "collapse"
    }

//Window Search Bar Functionality

function on_blur() {
    //When You Click outside of searchbar
    if(card_hovering === true){return} 
    //If Hovering During Card Do Not Blur
    let search_result_container = document.querySelector(".search-results-container");
    search_result_container.style.visibility = "collapse";
}

function on_type() {
    //When you type within searchbar
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

//Tab/Page Functionality
function on_unpaired_tab_click(tab){
    //When Tab is clicked open tab and change color
    let other_tab = document.getElementById("recently-removed-tab");
    other_tab.style.backgroundColor = "#3B6250";
    tab.target.style.backgroundColor = "#378762";
    let unpaired_results_container = document.querySelector(".unpaired-results");
    open_tab(unpaired_results_container)
    //TO-DO Improve Tab Color Change Methodology
    }

function on_recently_removed_tab_click(tab){
    let other_tab = document.getElementById("unpaired-tab"); // Make dynamic if possible
    other_tab.style.backgroundColor = "#3B6250";
      tab.target.style.backgroundColor = "#378762";
    let recent_results_container = document.querySelector(".recent-results");
    open_tab(recent_results_container)
    }   


export function open_tab(tab_page) {
    //Check if another tab is currently open if so, close it
    if (curr_open_tab !== undefined) {
        close_tab(curr_open_tab);
    }

    //Calculate height of page based on pop count.
    let card_height = 50
    let calculated_height = card_height * tab_page.childElementCount;

    //change new tab to current tab 
    curr_open_tab = tab_page;
    tab_page.style.height = `${Math.min(calculated_height, 300)}px`; 
    tab_page.style.display = "block"; // Use block to show the tab
    tab_page.style.visibility = "visible"
    tab_page.style.borderBottom = "4px solid #3B6250";
    tab_page.style.borderTop = "4px solid #3B6250";
}
    
export function close_tab(tab_page) {
    tab_page.style.display = "none"; // Use none to hide the tab
    tab_page.style.height = "none";
}

//Intern Cards Functionality
//Window intern Card Event Listener Helper Functions
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
    //Restore Edit Mode
    //Restore Add buton and remove button functionality
    move_intern(added_intern_name,add_button_parent);
    close_edit_window();
    activate_edit_mode();
    add_button_functionality_setup();
    remove_button_functionality_setup();

}

function on_card_hover(card){
    card_hovering = true;
}

function on_card_leave(card){
    card_hovering = false
}

//Intern Card Container Population
//TODO : Functions do almost the same thing 
//Perhaps Refactor breaking down to modular helper function
//Things to consider: Removed Interns, Unpaired Interns, Search Results
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