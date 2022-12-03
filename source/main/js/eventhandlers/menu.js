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



function enableMenue(element) {
  // Called when hoovering the menu bar.
  setMenusDisplayStyle("")
}

function disableMenu() {
  // Called by the function that handles a menu selection.
  setMenusDisplayStyle("none")
}

function setMenusDisplayStyle(style) {
  for (const x of document.getElementsByClassName("menus")) {
    x.style.display = style;
  }
}

function menuHandler(menuName) {
  let dispatch = {
    'file-new-numeric': () => openNewTimelineDialog("num-timetype"),
    'file-new-gregorian': () => openNewTimelineDialog("gregorian-timetype"),
    'file-open': openTimelineDialog,
    'file-export-to-svg': openGetSvgFilenameDialog,
    'edit-edit-events': openEditEventsDialog,
    'edit-edit-categories': openEditCategoriesDialog,
    'edit-edit-eras': openEditErasDialog,
    'edit-edit-milestones':  openEditMilestonesDialog,
    'timeline-set-readonly': setReadOnly,
    'show-zoom-in': () => {if (repo) repo.zoomIn();},
    'show-zoom-out': () => {if (repo) repo.zoomOut();},
    'navigate-fit-all': () => {if (repo) repo.fitAllEvents();},
    'navigate-backward': () => {if (repo) repo.backward();},
    'navigate-forward': () => {if (repo) repo.forward();},
    'navigate-goto-zero': () => {if (repo) repo.gotoZero();},
    'navigate-goto-time': openGoToTimeDialog,
    'edit-settings': openEditSettingsDialog,
    'help-gregorian-sample-timeline': gregorianSampleTimeline,
    'help-about': () => showDialog("help-about"),
    'help-content': () => showDialog("help-content"),
  }
  disableMenu();
  dispatch[menuName]();
}

function setReadOnly() {
  repo.readOnly = true
  showDomElement("readonly");
}
