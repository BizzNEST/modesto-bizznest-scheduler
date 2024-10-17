import { open_edit_window } from "../../window/window.js";

//Add Button DOM Intern Refrence Point
export let add_button_parent = undefined;

export function add_button_functionality_setup() {
  let current_buttons = get_all_add_buttons();
  if (current_buttons) {
    for (let element of current_buttons) {
      element.removeEventListener("click", on_add_click);
    }
  }
  let add_button_elements = get_all_add_buttons();
  for (let element of add_button_elements) {
    element.addEventListener("click", on_add_click);
  }
}

//Helper function Gets all add buttons
export function get_all_add_buttons() {
  return document.querySelectorAll(".add-button");
}

function on_add_click(button) {
  add_button_parent = button.target.id;
  open_edit_window();
}
