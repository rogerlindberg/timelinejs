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

//
// Handle edit Milestomes dialog
//
const MILESTONE_DLGID = "edit-milestones";
const MILESTONE_LSTID = "milestone-ids";
const MILESTONE_LSTKEY = "id";

//
// Add an event listener
//
window.addEventListener("load", function () {
    addDialogEventListener(MILESTONE_DLGID, _handleEditMilestonesDialog)
});

//
// Dialog initialization
//
function openEditMilestonesDialog(milestone) {
    if (repo) {
        _populateEditMilestonesDialog(milestone);
        showDialog(MILESTONE_DLGID);
    }
}

function _populateEditMilestonesDialog(milestone) {
    _fillMilestonesListbox(milestone);
    selectListboxItem(MILESTONE_LSTID, MILESTONE_LSTKEY, milestone);
    _fillmilestonesCategoriesSelectionListbox(milestone);
    _fillMilestoneData(milestone);
}

function _fillMilestonesListbox() {
    fillListbox(MILESTONE_LSTID, repo.events.extract(e => e.milestone), MILESTONE_LSTKEY);
}

function _fillmilestonesCategoriesSelectionListbox() {
    fillListbox('milestones-category-names', repo.categories, 'name');
}

function _fillMilestoneData(milestone = undefined) {
    if (milestone) {
        setElementValue("milestone-text", milestone.label);
        setElementValue("milestone-start", milestone.start);
        setElementValue("milestone-description", milestone.description);
        setElementValue("milestone-default-color", rgbToHexString(milestone.defaultColor));
        selectListboxItem('milestones-category-names', 'category', milestone)
    } else {
        setElementValue("milestone-text", "");
        setElementValue("milestone-start", "");
        setElementValue("milestone-description", "");
        setElementValue("milestone-default-color", rgbToHexString("127,127,127"));
    }
}

//
// Event handler called on milestone listbox selection change
//
function fillMilestoneData() {
    let milestone = repo.eventFromId(getListboxValue(MILESTONE_LSTID));
    if (milestone) {
        _fillMilestoneData(milestone);
    }
}

//
// Process the values entered in the dialog
//
function _handleEditMilestonesDialog(e) {
    try {
        return {
            "New": _newMilestone,
            "Delete": _deleteMilestone,
            "OK": _updateMilestone,
        }[e.submitter.innerHTML](_getFieldsFromEditMilestonesDialog(e));
    }
    catch (error) {
        return error;
    }
}

function _getFieldsFromEditMilestonesDialog(e) {
    return {
        "selection": e.target[1].value,
        "text": e.target[2].value.trim(),
        "start": e.target[3].value,
        "description": e.target[4].value.trim(),
        "categoryName": e.target[5].value.trim(),
        "defaultColor": hexToRgbString(e.target[6].value),
        "milestone": repo.eventFromId(e.target[1].value),
    }
}

function _newMilestone(input) {
    _validateNewMilestone(input);
    disableDrawing();
    let color = input.defaultColor;
    let category = repo.categoryFromName(input.categoryName);
    if (category) {
        color = category.color;
    }
    let tm = repo.timeType.strToTime(input.start);
    let period = new Period(tm, tm);
    let evt = new Event(
        input.text, period, input.description, "", color,
        input.defaultColor, input.categoryName, false,
        false, false, input.locked, 0, "", true);
    repo.addEvent(evt);
    enableDrawing();
}

function _validateNewMilestone(input) {
    mandatoryField("Text", input.text);
    mandatoryTimeField("Start", input.start);
    let newId = `${input.text} [${input.start} - ${input.start}]`
    validateEventNonExistance(newId);
}

function _deleteMilestone(input) {
    _validateDeleteMilestone(input);
    repo.deleteEvent(input.milestone);
    drawTimeline();
}

function _validateDeleteMilestone(input) {
    validateEventExistance(input.selection);
}

function _updateMilestone(input) {
    _validateUpdateMilestone(input);
    let color = input.defaultColor;
    let category = repo.categoryFromName(input.categoryName);
    if (category) {
        color = category.color;
    }
    let tm = repo.timeType.strToTime(input.start);
    let period = new Period(tm, tm);
    input.milestone.label = input.text;
    input.milestone.period = period;
    input.milestone.description = input.description;
    input.milestone.color = color;
    input.milestone.defaultColor = input.defaultColor;
    input.milestone.category = input.categoryName;
    drawTimeline();
}

function _validateUpdateMilestone(input) {
    mandatoryField("Text", input.text);
    mandatoryTimeField("Start", input.start);
    validateEventExistance(input.selection);
}
