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

const SETTINGS_DLGID = "edit-settings";

//
// Handle Edit Settings Dialog
//

//
// Add an event listener
//
window.addEventListener("load", function () {
    addDialogEventListener(SETTINGS_DLGID, _handleEditSettingsDialog)
});

//
// Dialog initialization
//
function openEditSettingsDialog() {
    _populateEditSettingsDialog();
    showDialog(SETTINGS_DLGID);
}

function _populateEditSettingsDialog() {
    setElementChecked("bubble-on-hoover", Settings.bubbleOnHoover);
    setElementChecked("gradient-drawing", Settings.gradientDrawing);
    setElementValue("web-server-url", Settings.webServerUrl);
    setElementValue("save-timeout", parseInt(Settings.saveIntervallInMilliseconds) / 1000);
}

//
// Process the values entered in the dialog
//
function _handleEditSettingsDialog(e) {
    try {
        let input = getFiledsFromEditSettingsDialog(e);
        _validateEditSettingsDialog(input);
        Settings.bubbleOnHoover = input.bubbleOnHoover;
        Settings.gradientDrawing = input.gradientDrawing;
        Settings.webServerUrl = input.serverUrl;
        Settings.saveIntervallInMilliseconds = `${parseInt(input.saveTimeout) * 1000}`;
        saveSettings();
    }
    catch (error) {
        return error;
    }
}

function getFiledsFromEditSettingsDialog(e) {
    return {

        "bubbleOnHoover": e.target[1].checked,
        "gradientDrawing": e.target[2].checked,
        "serverUrl": e.target[3].value,
        "saveTimeout": e.target[4].value,
    }
}

function _validateEditSettingsDialog(input) {
    mandatoryField("Save Timeout", input.saveTimeout);
}
