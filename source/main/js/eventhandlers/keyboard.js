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



window.addEventListener("keydown", function (event) {

    if (event.defaultPrevented) {
        return; // Do nothing if the event was already processed
    }

    switch (event.key) {
        case "+":
            if (event.ctrlKey) {
                zoomOut();
            } else {
                return;
            }
            break;
        case "-":
            if (event.ctrlKey) {
                zoomIn();
            } else {
                return;
            }
            break;
        case "Delete":
            if (repo) {
                repo.deleteSelectedEvents();
                drawTimeline();
            }
            return;
        case "Escape":
            closeOpenDialog();
            break;
        case "F2":
            exportToSvg();
            break;
        default:
            return; // Quit when this doesn't handle the key event.
    }

    // Cancel the default action to avoid it being handled twice
    event.preventDefault();
}, true);
  // the last option dispatches the event to the listener first,
  // then dispatches event to window
