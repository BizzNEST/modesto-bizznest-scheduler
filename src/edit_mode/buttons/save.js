//Data Dependencies
import { internPairs } from "../../data_presentation/InternManager.js";
import { unpairedInterns } from "../../data_presentation/InternManager.js";

//Toggle For Edit Mode
import { edit_mode_toggle } from "./edit.js";

export function save_button_functionality() {
  sessionStorage.setItem("internPairs", JSON.stringify(internPairs));
  sessionStorage.setItem("unpairedInterns", JSON.stringify(unpairedInterns));
  edit_mode_toggle();
}
