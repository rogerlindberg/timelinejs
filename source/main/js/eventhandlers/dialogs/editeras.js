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

const ERAS_DLGID = "edit-eras";
const ERA_LSTID = "era-names";
const ERA_LSTKEY = "name";

//
// Handle Edit Eras Dialog
//

// Add an event listener
window.addEventListener("load", function () {
    addDialogEventListener(ERAS_DLGID, _handleEditErasDialog);
});

//
// Dialog initialization
//
function openEditErasDialog() {
    if (repo) {
        _populateEditErasDialog();
        showDialog(ERAS_DLGID);
    }
}

function _populateEditErasDialog() {
    fillListbox(ERA_LSTID, repo.eras, ERA_LSTKEY);
    _fillEraData();
}

function _fillEraData(era = undefined) {
    if (era) {
        setElementValue("era-color", rgbToHexString(`${era.color}`));
        setElementValue("era-name", era.name);
        setElementValue("era-start", era.start);
        setElementValue("era-end", era.end);
        setElementChecked("era-ends-today", era.endsToday);
    } else {
        setElementValue("era-color", rgbToHexString("127, 127, 127"));
        setElementValue("era-name", "");
        setElementValue("era-start", "");
        setElementValue("era-end", "");
        setElementChecked("era-ends-today", false);
    }
}

//
// Event handler called on eras listbox selection change
//
function fillEraData() {
    let era = repo.eraFromName(getElementValue(ERA_LSTID));
    if (era) {
        _fillEraData(era);
    }
}

//
// Process the values entered in the dialog
//
function _handleEditErasDialog(e) {
    try {
        return {
            "New": _newEra,
            "Delete": _deleteEra,
            "OK": _updateEra,
        }[e.submitter.innerHTML](getFiledsFromEditEraDialog(e));
    }
    catch (error) {
        return error;
    }
}

function getFiledsFromEditEraDialog(e) {
    return {
        "text": e.target[1].value,
        "name": e.target[2].value,
        "start": e.target[3].value,
        "end": e.target[4].value,
        "color": hexToRgbString(e.target[5].value),
        "endsToday": e.target[6].checked,
        "era": repo.eraFromName(e.target[1].value),
    }
}

function _newEra(input) {
    _validateNewEra(input);
    let start = repo.timeType.strToTime(input.start);
    let end = repo.timeType.strToTime(input.end);
    let era = new Era(input.name, start, end, input.color, input.endsToday);
    repo.addEra(era);
}

function _validateNewEra(input) {
    mandatoryField("Name", input.name);
    mandatoryTimeField("Start", input.start);
    mandatoryTimeField("End", input.end);
    if (repo.eras.exists(e => e.name == input.name)) {
        throw Error("An Era with the given name already exists!");
    }
    for (const era of repo.eras) {
        if (!(input.end <= era.start.toString() || input.start >= era.end.toString())) {
            throw Error("The new Era overlaps existing Era!");
        }
    }
    // TODO: overlapping period...
}

function _deleteEra(input) {
    _validateDeleteEra(input)
    repo.deleteEra(input.era);
}

function _validateDeleteEra(input) {
    if (!repo.eras.hasItem(input.era)) {
        throw Error("Nothing to delete!");
    }
}

function _updateEra(input) {
    _validateUpdateEra(input);
    input.era.name = input.name
    input.era.start = repo.timeType.strToTime(input.start);
    input.era.end = repo.timeType.strToTime(input.end);
    input.era.color = input.color;
    input.era.endsToday = input.endsToday;
    drawTimeline();
}

function _validateUpdateEra(input) {
    mandatoryField("Name", input.name);
    mandatoryTimeField("Start", input.start);
    mandatoryTimeField("End", input.end);
    if (!repo.eras.hasItem(input.era)) {
        throw Error("Can't find the Era!");
    }
    // TODO: overlapping period...
}
