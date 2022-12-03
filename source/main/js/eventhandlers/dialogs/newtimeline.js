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
// Handle New Timeline Dialog
//

//
// Add an event listener
//
window.addEventListener("load", function () {
    addDialogEventListener("new-timeline", handleNewTimelineDialog)
});

//
// Dialog initialization
//
function openNewTimelineDialog(timetype) {
    if (timetype == "num-timetype") {
        Repository.newTimeType = NumTimeType.name;
    } else
        if (timetype == "gregorian-timetype") {
            Repository.newTimeType = GregorianTimeType.name;
        }
    showDialog("new-timeline");
}

//
// Process the values entered in the dialog
//
function handleNewTimelineDialog(e) {
    let input = getFiledsFromNewTimelineDialog(e);
    _validateNewTimelineDialog(input);
    try {
        if (Repository._timeType == NumTimeType.name) {
            newNumTimeRepo({ "filename": input.filename })
        }
        else if (Repository._timeType == GregorianTimeType.name) {
            newGregorianTimeRepo({ "filename": input.filename })
        }
    }
    catch (error) {
        return error
    }
}

function getFiledsFromNewTimelineDialog(e) {
    return {
        "filename": e.target[1].value,
    }
}

function _validateNewTimelineDialog(input) {
    mandatoryField("Filename", input.filename);
}
