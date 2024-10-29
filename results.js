import * as generate_CSV from "./src/util/generate_csv.js";
import * as Accuracy from "./src/util/accuracy.js";
//Intern Data Manager
import { loadInternPairs } from "./src/data_presentation/InternManager.js";
import { load_intern_data } from "./src/data_presentation/InternManager.js";
//Modal/Window Dependencies
import { window_functionality_setup } from "./src/window/window.js";
//Add Buttons Dependencies
import { add_button_functionality_setup } from "./src/edit_mode/buttons/add.js";
//Remove Buttons Dependencies
import { remove_button_functionality_setup } from "./src/edit_mode/buttons/remove.js";
//Edit Button Dependencies
import { edit_button_functionality_setup } from "./src/edit_mode/buttons/edit.js";
//Save Button Dependencies
import { save_button_functionality } from "./src/edit_mode/buttons/save.js";
//Dom Manipulation
import { displayInterns } from "./src/data_presentation/internDisplayer.js";

document.addEventListener("DOMContentLoaded", () => {
  let resultSaveButton = document.getElementById("save-button");
  let resultCSVButton = document.getElementById("download-csv-button");

  // Add event listener to the back button on mobile
  const backButton = document.getElementById("back-button");
  backButton.addEventListener("click", function () {
    window.history.back();
  });

  //Load Intern Pairs //Array Index 0: pairedInterns, Index 1: unpaired Interns
  let internPairs = loadInternPairs();
  // If Not Undefined Display the pulled interns to the page
  if (internPairs) {
    displayInterns(internPairs[0], internPairs[1]);
  } else {
    return;
  }

  // Calls all the functions that need to be called when the page loads
  window.onload = function () {
    loadInternPairs();
    load_intern_data();
    window_functionality_setup();
    edit_button_functionality_setup();
    add_button_functionality_setup();
    remove_button_functionality_setup();
    Accuracy.calculatePairAccuracy(internPairs[0]);
  };

  //event listener for download csv button
  resultCSVButton.addEventListener("click", function () {
    console.log(internPairs)
    generate_CSV.downloadCSV(
      generate_CSV.generateCSV(internPairs[0]),
      "intern_pairs.csv"
    );
  });

  //save button stuff save session storage and turn on edit button and csv
  resultSaveButton.addEventListener("click", save_button_functionality);
});
