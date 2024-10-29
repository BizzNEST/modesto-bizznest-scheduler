export let internData = undefined;
export let internPairs = [];
export let unpairedInterns = [];
export let removedInterns = [];

//Dom Manipulation Function
import { displayInterns } from "../data_presentation/internDisplayer.js";

//Get the data from sessionStorage
//Get Generated Pairs
export function loadInternPairs() {
  const storedPairs = JSON.parse(sessionStorage.getItem("internPairs")) || [];
  const storedUnpaired =
    JSON.parse(sessionStorage.getItem("unpairedInterns")) || [];
  if (storedPairs.length) {
    internPairs = storedPairs;
    return [internPairs, storedUnpaired]; // Display interns directly without shuffling
  }
}

//Get Static intern data
export function load_intern_data() {
  const storedinterData =
    JSON.parse(sessionStorage.getItem("internData")) || [];
  internData = storedinterData;
  const storedUnpaired =
    JSON.parse(sessionStorage.getItem("unpairedInterns")) || [];
  unpairedInterns = storedUnpaired;
}

export function move_intern(intern_name, button_parent) {
  //Remove if intern is existing
  if (intern_name === button_parent) {
    return;
  }
  let added_intern = undefined;
  function remove_intern() {
    //IF its in paired interns
    let removed_intern_info = get_intern_in_pair(internPairs, intern_name);
    if (removed_intern_info) {
      added_intern = remove_intern_from_pair(
        removed_intern_info[1],
        removed_intern_info[2]
      );
    let pair = internPairs[removed_intern_info[1]]; //we can loop through internPairs check the length of arrays and if
    //if orignal pair of removed intern is left with
    //only one person it will be moved to unpaired.
    if (pair.length <= 1) {
      unpairedInterns.push(pair[0]);
      internPairs.splice(removed_intern_info[1], 1);
      }
      return added_intern;
    }
    //If its in unpaired interns.
    removed_intern_info = get_unpaired_intern(unpairedInterns, intern_name);
    if (removed_intern_info) {
      added_intern = remove_unpaired_intern(
        unpairedInterns,
        removed_intern_info[1]
      );
      console.log(added_intern);
      return added_intern;
    }
    //if its in removed interns
    removed_intern_info = get_unpaired_intern(removedInterns, intern_name);
    console.log(removed_intern_info);
    if (removed_intern_info) {
      added_intern = remove_unpaired_intern(
        removedInterns,
        removed_intern_info[1]
      );
      console.log(added_intern);
      return added_intern;
    }
    return undefined;
  }
  added_intern = remove_intern();

  //If not found in the pair page get it from intern data
  if (added_intern === undefined) {
    added_intern = internData.find((intern) => intern.name === intern_name);
  }
  if (added_intern === undefined) {
    console.error("Intern Not Found: Cannot Pair Intern.");
  }

  //If desired location is a pair add added intern
  let new_location_info = get_intern_in_pair(internPairs, button_parent);
  if (new_location_info !== undefined && new_location_info !== false) {
    //Move To New location
    if (new_location_info[2] <= 0) {
      let pair_location = new_location_info[1];
      internPairs[pair_location].splice(0, 0, added_intern);
      displayInterns(internPairs, unpairedInterns);
      return;
    }

    let pair_location = new_location_info[1];
    internPairs[pair_location].splice(
      new_location_info[0] - 1,
      0,
      added_intern
    );
    displayInterns(internPairs, unpairedInterns);
    return;
  }
  //If its a unpaired intern
  let unpaired_intern_info = get_unpaired_intern(
    unpairedInterns,
    button_parent
  );
  if (unpaired_intern_info !== undefined) {
    let intern1 = added_intern;
    let intern2 = remove_unpaired_intern(
      unpairedInterns,
      unpaired_intern_info[1]
    );
    if (intern2 === undefined) {
      unpairedInterns.push(intern1);
    } else {
      internPairs.push([intern1, intern2]);
    }
    console.log(intern1, intern2);
    //remove from unpaired interns create a pair and push to paired interns
    //Fix
    //If intern is unpaired and is the same as being pushed prob return
    displayInterns(internPairs, unpairedInterns);
    return;
  }
  return console.error("could not move intern");
}

export function get_intern_in_pair(pair_array, intern_name) {
  for (let pair of pair_array) {
    if (pair.find((intern) => intern.name === intern_name) != undefined) {
      let intern = pair.find((intern) => intern.name === intern_name);
      let pair_number = internPairs.indexOf(pair);
      let index_in_pair = pair.indexOf(intern);
      return [intern, pair_number, index_in_pair];
    }
  }
  return false;
}

export function get_unpaired_intern(intern_array, intern_name) {
  if (intern_array.find((intern) => intern.name === intern_name) != undefined) {
    let intern = intern_array.find((intern) => intern.name === intern_name);
    let index_in_array = intern_array.indexOf(intern);
    return [intern, index_in_array];
  }
  return false;
}

export function remove_intern_from_pair(pair_index, intern_location) {
  let removed_intern = internPairs[pair_index].splice(intern_location, 1);
  return removed_intern[0];
}

export function remove_unpaired_intern(intern_array, intern_location) {
  let removed_intern = intern_array.splice(intern_location, 1);
  return removed_intern[0];
}
