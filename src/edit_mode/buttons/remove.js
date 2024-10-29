//Data Dependencies
import { unpairedInterns } from "../../data_presentation/InternManager.js";
import { internPairs } from "../../data_presentation/InternManager.js";
import { removedInterns } from "../../data_presentation/InternManager.js";
//Data Helper Dependecies
import { get_intern_in_pair } from "../../data_presentation/InternManager.js";
import { get_unpaired_intern } from "../../data_presentation/InternManager.js";
import { remove_intern_from_pair } from "../../data_presentation/InternManager.js";
import { remove_unpaired_intern } from "../../data_presentation/InternManager.js";
//Data Display Dependencies
import { displayInterns } from "../../data_presentation/internDisplayer.js";
//Edit Mode Activation
import { activate_edit_mode } from "./edit.js";
import { add_button_functionality_setup } from "./add.js";

//Add Button DOM Intern Refrence Point
export let remove_button_parent = undefined;

export function remove_button_functionality_setup() {
  let current_buttons = get_all_remove_buttons();
  if (current_buttons) {
    for (let element of current_buttons) {
      element.removeEventListener("click", remove_on_click);
    }
  }
  let add_button_elements = get_all_remove_buttons();
  for (let element of add_button_elements) {
    element.addEventListener("click", remove_on_click);
  }
}

export function get_all_remove_buttons() {
  return document.querySelectorAll(".remove-button");
}

function remove_on_click(button) {
  remove_button_parent = button.target.id;
  let intern_in_pair_info = get_intern_in_pair(
    internPairs,
    remove_button_parent
  );
  let unpaired_intern_info = get_unpaired_intern(
    unpairedInterns,
    remove_button_parent
  );
  let added_intern = undefined;
  if (unpaired_intern_info) {
    added_intern = remove_unpaired_intern(
      unpairedInterns,
      unpaired_intern_info[1]
    );
    //console.log(added_intern);
  }
  if (intern_in_pair_info) {
    added_intern = remove_intern_from_pair(
      intern_in_pair_info[1],
      intern_in_pair_info[2]
    );
    let pair = internPairs[intern_in_pair_info[1]]; //we can loop through internPairs check the length of arrays and if
    //if pair has only one person it will be moved to unpaired.
    if (pair.length <= 1) {
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
