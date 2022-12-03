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

const EVENTS_DLGID = "edit-events";
const EVENTS_LSTID = "event-ids";
const EVENTS_LSTKEY = "id";

//
// Edit Events Dialog
//

//
// Add an event listener
//
window.addEventListener("load", function () {
    addDialogEventListener(EVENTS_DLGID, _handleEditEventsDialog)
});

//
// Dialog initialization
//
function openEditEventsDialog(event) {
    if (repo) {
        _populateEditEventsDialog(event);
        showDialog(EVENTS_DLGID);
    }
}

function _populateEditEventsDialog(evt) {
    fillListbox('event-ids', repo.events, 'id');
    selectListboxItem('event-ids', 'id', evt);
    fillListbox('containers-list', repo.getContainers(), 'label');
    selectListboxItem('container-name', 'label', _getContainer(evt));
    fillListbox('event-category-names', repo.categories, 'name');
    selectListboxItem('event-category-names', 'category', evt);
    _fillEventData(evt);
}

function _getContainer(evt) {
    if (evt) {
        let container = repo.getContainer(evt.containerId);
        if (container) {
            return container;
        }
    }
    return { "label": "" };
}

function _fillEventData(evt = undefined) {
    if (evt) {
        setElementValue("text", evt.label);
        setElementValue("start", evt.start);
        setElementValue("end", evt.end);
        setElementValue("description", evt.description);
        setElementValue("default-color", rgbToHexString(evt.defaultColor));
        setElementChecked("fuzzy-start", evt.fuzzyStart)
        setElementChecked("fuzzy-end", evt.fuzzyEnd)
        setElementChecked("ends-today", evt.endsToday)
        setElementChecked("locked", evt.locked)
        selectListboxItem('event-category-names', 'category', evt);
        selectListboxItem('container-name', 'label', _getContainer(evt));
    } else {
        setElementValue("text", "");
        setElementValue("start", "");
        setElementValue("end", "");
        setElementValue("description", "");
        setElementValue("default-color", rgbToHexString("127,127,127"));
        setElementChecked("fuzzy-start", false)
        setElementChecked("fuzzy-end", false)
        setElementChecked("ends-today", false)
        setElementChecked("locked", false)
        selectListboxItem('event-category-names', 'category', { "category": "" });
        selectListboxItem('container-name', 'label', { "label": "" });
    }
}

//
// Event handler called on events listbox selection change
//
function fillEventData() {
    let evt = repo.eventFromId(getListboxValue(EVENTS_LSTID));
    if (evt) {
        _fillEventData(evt);
    }
}

//
// Process the values entered in the dialog
//
function _handleEditEventsDialog(e) {
    try {
        return {
            "New": _newEvent,
            "Delete": _deleteEvent,
            "OK": _updateEvent,
        }[e.submitter.innerHTML](getFieldsFromEditEventsDialog(e));
    }
    catch (error) {
        return error;
    }
}

function getFieldsFromEditEventsDialog(e) {
    return {
        "selection": e.target[1].value,
        "text": e.target[2].value.trim(),
        "start": e.target[3].value,
        "end": e.target[4].value,
        "description": e.target[5].value.trim(),
        "categoryName": e.target[6].value.trim(),
        "containerName": e.target[7].value.trim(),
        "defaultColor": hexToRgbString(e.target[8].value),
        "fuzzyStart": e.target[9].checked,
        "fuzzyEnd": e.target[10].checked,
        "locked": e.target[11].checked,
        "endsToday": e.target[12].checked,
        "event": repo.eventFromId(e.target[1].value),
    }
}

function _newEvent(input) {
    _validateNewEvent(input);
    disableDrawing();
    let color = input.defaultColor;
    let category = repo.categoryFromName(input.categoryName);
    if (category) {
        color = category.color;
    }
    let period = new Period(
        repo.timeType.strToTime(input.start),
        repo.timeType.strToTime(input.end));
    let evt = new Event(
        input.text, period, input.description, "", color,
        input.defaultColor, input.categoryName, input.fuzzyStart,
        input.fuzzyEnd, input.endsToday, input.locked, 0, "", false);
    repo.addEvent(evt);
    if (input.containerName.length > 0) {
        let container = repo.getContainerByName(input.containerName);
        if (container) {
            evt.containerId = container.containerId;
            updateContainerPeriod(evt.containerId)
        } else {
            repo.createContainerForEvent(evt, input.containerName);
        }
    }
    enableDrawing();
}

function _validateNewEvent(input) {
    mandatoryField("Text", input.text);
    mandatoryTimeField("Start", input.start);
    mandatoryTimeField("End", input.end);
    let newId = `${input.text} [${input.start} - ${input.end}]`
    validateEventNonExistance(newId);
}


function _deleteEvent(input) {
    _validateDeleteEvent(input);
    if (input.event.isContainer) {
        _deleteContainerEvent(input.event);
    } else if (input.event.isContainerMember) {
        _deleteContainerMember(input.event);
    } else {
        repo.deleteEvent(input.event);
    }
    drawTimeline();
}


function _validateDeleteEvent(input) {
    validateEventExistance(input.selection);
}

function _deleteContainerEvent(evt) {
    // Remove members from the container before deleting the container itself.
    repo.getContainerMembers(evt.containerId).forEach(e => e.containerId = -1);
    repo.deleteEvent(evt);
}

function _deleteContainerMember(evt) {
    // After deleting a container member we may have to adjust the container period.
    // If the member was the only member in the container, the container is deleted.
    let container = repo.getContainer(evt.containerId);
    repo.deleteEvent(evt);
    if (repo.containerHasMembers(evt.containerId)) {
        updateContainerPeriod(container.containerId);
    } else {
        repo.deleteEvent(container);
    }
}

function _updateEvent(input) {
    _validateUpdateEvent(input);
    let color = input.defaultColor;
    let category = repo.categoryFromName(input.categoryName);
    if (category) {
        color = category.color;
    }
    let period = new Period(repo.timeType.strToTime(input.start),
        repo.timeType.strToTime(input.end));
    if (input.event.containerId != -1) {
        if (input.event.isContainer) {
            input.event.label = `[${input.event.containerId}]${input.text}`
        } else {
            input.event.label = `(${input.event.containerId})${input.text}`
        }
    } else {
        input.event.label = input.text;
    }
    input.event.period = period;
    input.event.description = input.description;
    input.event.color = color;
    input.event.defaultColor = input.defaultColor;
    input.event.category = input.categoryName;
    input.event.fuzzyStart = input.fuzzyStart;
    input.event.fuzzyEnd = input.fuzzyEnd;
    input.event.endsToday = input.endsToday;
    input.event.locked = input.locked;
    _updateContainer(input)
    drawTimeline();
}

function _validateUpdateEvent(input) {
    mandatoryField("Text", input.text);
    mandatoryTimeField("Start", input.start);
    mandatoryTimeField("End", input.end);
    validateEventExistance(input.selection);
}

function _updateContainer(input) {
    if (input.event.isContainer) {
        return;
    }
    let oldContainerId = input.event.containerId;
    let containerName = input.containerName;
    if (containerName.length == 0) {
        // Container membership will be removed
        input.event.label = input.text
    } else {
        let container = repo.getContainerByName(containerName);
        if (container) {
            input.event.containerId = container.containerId;
            // Adjust container where event is moved to.
            updateContainerPeriod(input.event.containerId)
        } else {
            repo.createContainerForEvent(input.event, input.containerName.trim());
        }
    }
    if (oldContainerId != -1) {
        // Adjust container where event is moved from.
        if (repo.containerHasMembers(oldContainerId)) {
            updateContainerPeriod(oldContainerId);
        } else {
            // Delete the container
            let container = repo.getContainer(oldContainerId);
            repo.deleteEvent(container);
        }
    }
}
