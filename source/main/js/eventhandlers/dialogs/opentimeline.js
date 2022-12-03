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
// Handle open new Timeline dialog
//


//
// Dialog initialization
//
function openTimelineDialog() {
    // creating input on-the-fly
    var input = document.createElement("input");
    input.setAttribute("type", "file");
    // add onchange handler if you wish to get the file :)
    input.addEventListener("change", getFileValue)
    input.click(); // opening dialog
    return false; // avoiding navigation
};

//
// Process the values entered in the dialog
//
function getFileValue(evt) {
    if (evt.target.value != "") {
        loadRepository(`${evt.target.files[0].name}`)
    }
}
