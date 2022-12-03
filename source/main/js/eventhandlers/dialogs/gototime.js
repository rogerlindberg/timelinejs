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

const GOTOTIME_DLGID = "date-input";

//
// Handle Go To Time Dialog
//

//
// Add an event listener
//
window.addEventListener("load", function () {
    addDialogEventListener(GOTOTIME_DLGID, _handleGoToTimeInputDialog)
});

//
// Dialog initialization
//
function openGoToTimeDialog() {
  if (repo) {
    showDialog(GOTOTIME_DLGID);
  }
}

//
// Process the values entered in the dialog
//
function _handleGoToTimeInputDialog(e) {
    repo.gotoTime(e.target[1].value);
}
