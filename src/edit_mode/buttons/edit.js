import { get_all_add_buttons } from "./add.js";
import { get_all_remove_buttons } from "./remove.js";

let edit_mode_state = false;

//DOM Element Reference
let resultEditButton = document.getElementById("edit-button");
let resultSaveButton = document.getElementById("save-button");
let resultCSVButton = document.getElementById("download-csv-button");

export function edit_button_functionality_setup() {
  let edit_button = document.getElementById("edit-button");

  edit_button.addEventListener("click", edit_mode_toggle);
}

export function edit_mode_toggle() {
  if (edit_mode_state === false) {
    activate_edit_mode();

    resultSaveButton.style.display = "inline";
    resultEditButton.style.display = "none";
    resultCSVButton.style.display = "none";
  } else {
    deactivate_edit_mode();
    resultSaveButton.style.display = "none";
    resultEditButton.style.display = "inline";
    resultCSVButton.style.display = "inline";
  }
}

export function activate_edit_mode() {
  let add_button_elements = get_all_add_buttons();
  let remove_buttons_elements = get_all_remove_buttons();
  for (let element of add_button_elements) {
    element.style.visibility = "visible";
  }
  for (let element of remove_buttons_elements) {
    element.style.visibility = "visible";
  }
  edit_mode_state = true;
}

function deactivate_edit_mode() {
  let add_button_elements = get_all_add_buttons();
  let remove_buttons_elements = get_all_remove_buttons();
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
