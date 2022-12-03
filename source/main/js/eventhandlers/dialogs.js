/*
  Copyright (C) 2021  Roger Lindberg, Rickard Lindberg

  This file is part of TimelineJs.

  TimelineJs is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  TimelineJs is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with TimelineJs.  If not, see <http://www.gnu.org/licenses/>.
*/


let _lastShownDialog = undefined;


//
// General purpose function to add a Dialog Event Listener
//
function addDialogEventListener(dialogName, callbackFunction, validationFunction = undefined) {
    document.getElementById(dialogName).addEventListener("submit", function (e) {
        e.preventDefault(); // before the code
        /* do what you want with the form */
        let err = false;
        if (e.submitter.innerHTML == "OK" ||
            e.submitter.innerHTML == "New" ||
            e.submitter.innerHTML == "Delete") {
            if (validationFunction) {
                err = validationFunction(e);
            }
            if (err) {
                showErrorText(dialogName, err)
            } else { //Ok
                err = callbackFunction(e);
                if (err) {
                    showErrorText(dialogName, err);
                } else {
                    hideDialog(dialogName);
                }
            }
        } else {// Cancel
            hideDialog(dialogName);
        }
    })
}

//
// General purpose functions
//

function closeOpenDialog() {
    if (_lastShownDialog) {
        hideDialog(_lastShownDialog);
    }
}


function showDialog(name, populateFunction=undefined) {
    if (populateFunction) {
        populateFunction();
    }
    _lastShownDialog = name;
    document.getElementById(name).style.display = "block";
    if (repo) {
        repo.dialogOpen = true;
    }
}

function hideDialog(name) {
    _lastShownDialog = undefined;
    document.getElementById(name).style.display = "none";
    document.getElementById(name + "-error-text").style.display = "none";
    if (repo) {
        repo.dialogOpen = false;
    }
}

function showErrorText(name, errText) {
    document.getElementById(name + "-error-text").style.display = "inline";
    document.getElementById(name + "-error-text").innerHTML = errText;
}

function mandatoryField(name, value) {
    if (emptyField(value)) {
        throw Error(`${name}: is a mandatory field!`);
    }
}

function mandatoryTimeField(name, value) {
    mandatoryField(name, value)
    if (!repo.timeType.isValid(value)) {
        throw Error(`${name}: Invalid time format!`);
    }
}

function createOption(selectElement, value) {
    let opt = document.createElement('option');
    opt.value = opt.innerHTML = value;
    selectElement.appendChild(opt);
}

function fillListbox(listboxId, items, itemValue, firstItemEmpty = true) {
    let listbox = document.getElementById(listboxId);
    // Clear the list
    listbox.innerHTML = "";
    // Add empty alternative
    if (firstItemEmpty) {
        createOption(listbox, "")
    }
    // Registered milestones
    items.forEach(item => createOption(listbox, item[itemValue]))
}

function selectListboxItem(listboxId, itemValue, evt) {
    if (evt) {
        document.getElementById(listboxId).value = evt[itemValue] || "";
    }
}

function getListboxValue(listboxId) {
    return document.getElementById(listboxId).value;
}

function validateEventExistance(id) {
    let event = repo.eventFromId(id);
    if (!event) {
        throw Error("Can't find the event!");
    }
}

function validateEventNonExistance(id) {
    let event = repo.eventFromId(id);
    if (event) {
        throw Error("The event already exists!");
    }
}

