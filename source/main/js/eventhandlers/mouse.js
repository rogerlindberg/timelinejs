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


getCanvas().style.cursor = "default";
let offsetLeft = getCanvas().offsetLeft;
let offsetTop = getCanvas().offsetTop;
let move = false;
let left_resize = false;
let right_resize = false;
let _lastPos = 0;
let _lastDownPos = undefined;


window.addEventListener('wheel', onWheel);
window.addEventListener('click', onMouseClick);
window.addEventListener('dblclick', onMouseDblClick);
window.addEventListener('mousemove', onMouseMove);
window.addEventListener('mousedown', onMouseDown);

// *************************************************
// Mouse doubleclick handler
// *************************************************
function onMouseDblClick(evt) {
    if (repo) {
        if (repo.setEventHits(_toCanvasPoint(evt)) > 0) {
            repo.getFirstHitevent().edit();
        }
    }
}

// *************************************************
// Mouse click handler
// *************************************************
function onMouseClick(evt) {
    if (repo) {
        repo.setEventHits(_toCanvasPoint(evt), evt.ctrlKey, evt.altKey);
        drawTimeline();
    }
}

// *************************************************
// Mouse down handler
// *************************************************
function onMouseDown(evt) {
    _lastDownPos = _toCanvasPoint(evt);
    if (repo) {
        _lastDownPos.y -= repo.period.yOffset;
    }
}

// *************************************************
// Mouse move handler
// *************************************************
function onMouseMove(evt) {
    if (repo) {
        let pos = _toCanvasPoint(evt);
        repo.setMouseOver(pos)
        _leftButtonDown(evt) ?
            _onMouseMoveAndLeftButtonDown(pos) :
            _onMouseMoveAndNoButtonDown(evt);
        _lastPos = pos;
    }
}

function _onMouseMoveAndLeftButtonDown(pos) {
    if (!_resizeOrMoveEvent(pos)) {
        // No Event hit. Scroll timeline (If not a dialog is open)
        _scrollTimeline(pos)
    }
}

function _onMouseMoveAndNoButtonDown(evt) {
    _setCursor(_toCanvasPoint(evt));
    _resetActionFlags();
    // Needed to be able to draw Event Speach bubbles.
    drawTimeline();
}

function _resizeOrMoveEvent(pos) {
    let eventsResizedOrMoved = false;
    for (const event of repo.events.extract(e => e.hit && !e.locked)) {
        eventsResizedOrMoved = true;
        if (move || left_resize || right_resize) {
            let moved = _eventResizedOrMoved(event, pos);
            if (!moved) {
                // Only one Event can be resized!
                break;
            }
        }
        else {
            _setActionFlag(event, pos);
        }
    }
    if (eventsResizedOrMoved) {
        _setCursor(pos);
        _lastPos = pos;
        drawTimeline();
    }
    return eventsResizedOrMoved;
}

function _scrollTimeline(pos) {
    if (!repo.dialogOpen) {
        let delta = new repo.timeDelta(Math.round(_lastPos.xDiff(pos) / getPixelsPerTimeUnitFactor()));
        repo.period.yOffset = pos.yDiff(_lastDownPos);
        repo.period.update(repo.period.start, repo.period.end, delta, delta);
        drawTimeline();
    }
}

function _setCursor(pos) {
    setCursor("default");
    for (const event of repo.events.extract(e => e.getHitZone(...pos.values) > 0)) {
        setCursor({
            0: "default",
            1: "ew-resize",
            2: "move",
            3: "ew-resize",
        }[event.getHitZone(...pos.values)]);
    }
}

function _eventResizedOrMoved(event, pos) {

    var factor = getPixelsPerTimeUnitFactor();
    let delta = new repo.timeDelta(Math.round(pos.xDiff(_lastPos) / factor));
    let moved = false;
    if (move) {
        moved = true;
        event.period.moveDelta(delta);
        if (event.isContainer) {
            // Update container members period to follow the container.
            updateContainerMembersPeriod(event.containerId, delta)
        }
    }
    else if (left_resize) {
        // Container events are resized by moving there members
        if (!event.isContainer) {
            event.period.start = event.period.start.addDelta(delta);
        }
    }
    else if (right_resize) {
        // Container events are resized by moving there members
        if (!event.isContainer) {
            event.period.end = event.period.end.addDelta(delta);
        }
    }
    if (event.isContainerMember) {
        updateContainerPeriod(event.containerId)
    }
    return moved;
}

function updateContainerMembersPeriod(containerId, delta) {
    repo.getContainerMembers(containerId).forEach(evt => evt.period.moveDelta(delta))
}

function updateContainerPeriod(containerId) {
    let container = repo.getContainer(containerId);
    if (container && repo.containerHasMembers(containerId)) {
        period = repo.getContainerPeriod(containerId);
        container.period.update(period.start, period.end);
    }
}

function _resetActionFlags() {
    move = false;
    left_resize = false;
    right_resize = false;
 }

function _setActionFlag(event, pos) {
    if (event.isInCenter(...pos.values)) {
        move = true;
    }
    else if (event.isAtLeftEdge(...pos.values)) {
        left_resize = true;
    }
    else if (event.isAtRightEdge(...pos.values)) {
        right_resize = true;
    }
}

// *************************************************
// Mouse wheel handler
// *************************************************
function onWheel(evt) {
    if (repo) {
        evt.altKey ? _scroll(evt) : _zoom(evt);
    }
}

// *************************************************
// Helper functions
// *************************************************
function _toCanvasPoint(evt) {
    return new Point(evt.clientX - offsetLeft, evt.clientY - offsetTop);
}

function _leftButtonDown(evt) {
    evt = evt || window.event;
    if ("buttons" in evt) {
        return evt.buttons == 1;
    } else {
        return (evt.which || evt.button) == 1;
    }
}

function _zoom(evt) {
    evt.deltaY > 0 ? repo.zoomOut(evt) : repo.zoomIn(evt);
}

function _scroll(evt) {
    evt.deltaY > 0 ? repo.period.increment() : repo.period.decrement();
    drawTimeline();
}
