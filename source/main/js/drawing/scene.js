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


const POINT_EVENT_THRESHOLD = 20;
const PADDING_X = 10;
const PADDING_Y = 10;
const DEFLATE_SIZE = 4;

class Scene {

    _events = undefined;

    fitAllEvents() {
        // Display all events within the visible screen.
        if (repo.visibleEvents.length > 0) {
            let min = this.#getMinX(repo.visibleEvents);
            let max = this.#getMaxX(repo.visibleEvents);
            repo.period.start = min;
            repo.period.end = max;
            drawTimeline();
        }
    }

    layOut(yOffset = 0) {
        // Only layout visible events
        this._events = repo.visibleEvents;
        // Calculate pixel positions without concidering overlaps
        this._events.forEach(evt => this.#calcIdealRect(evt, yOffset));
        this.#layoutContainers();
        this.#layoutOrdinaryPeriodEvents();
        this.#layoutOrdinaryPointEvents();
    }

    #calcIdealRect(evt, yOffset) {
        let middleY = getCanvas().height / 2;
        evt.x1 = calcX(evt.start);
        if (evt.endsToday) {
            evt.x2 = calcX(repo.timeType.now());
        } else {
            evt.x2 = calcX(evt.end);
        }
        if (evt.containerId == -1 && this.#displayEventAsPointEvent(evt)) {
            evt.displayAsPointEvent = true;
            evt.y1 = Math.round(middleY - PADDING_Y - evt.height);
            evt.y2 = Math.round(evt.y1 + evt.height);
            let width = getTextWidth(evt.label) + PADDING_X;
            evt.x1 = Math.round(evt.x1 - width / 2);
            evt.x2 = Math.round(evt.x2 + width / 2);
        } else {
            evt.displayAsPointEvent = false;
            evt.y1 = Math.round(middleY + PADDING_Y);
            evt.y2 = Math.round(evt.y1 + evt.height);
        }
        evt.moveVertically(yOffset);
    }

    #layoutContainers() {
        this.#containers.forEach(c => this.#layoutContainer(c));
        this.#fixContainerOverlaps();
    }

    #layoutOrdinaryPeriodEvents() {
        let events = this._events.extract(evt => evt.containerId == -1 && !evt.displayAsPointEvent);
        for (let i = 0; i < events.length; i++) {
            let event = events[i];
            // Move Event if it overlaps container
            for (const container of this.#containers) {
                if (container.overlaps(event)) {
                    event.moveVertically(container.y2 - event.y1 + PADDING_Y);
                }
            }
            // Move Event if it overlaps other event
            for (let j = 0; j < i; j ++) {
                if (event.overlaps(events[j])) {
                    event.moveVertically(events[j].y2 - event.y1 + PADDING_Y);
                }
            }
        }
    }

    #layoutOrdinaryPointEvents() {
        let events = this.#pointEvents;
        for (let i = 0; i < events.length; i++) {
            let event = events[i];
            // Move Event if it overlaps other events
            for (let j = 0; j < i; j ++) {
                if (event.overlaps(events[j])) {
                    event.moveVertically(-(event.y2 - events[j].y1 + PADDING_Y));
                }
            }
        }
    }

    #calcContainerHorizontalPos(container, members) {
        container.x1 = this.#getContainerStart(members);
        container.x2 = this.#getContainerEnd(members);
        container.deflateRect(DEFLATE_SIZE);
    }

    #layoutContainer(container) {
        let members = this.#containerMembers(container.containerId);
        if (members.length > 0) {
            container.displayAsPointEvent = false;
            this.#calcContainerHorizontalPos(container, members);
            this.#layoutContainerMembers(container, members)
        }
        this.#makeRoomForContainerText(container);
    }

    #makeRoomForContainerText(c) {
        let offset = getTextWidth("x") + PADDING_Y;
        c.y2 += offset;
        this.#containerMembers(c.containerId).forEach(m => {m.y1 += offset; m.y2 += offset;})
    }

    #layoutContainerMembers(container, members) {
        for (let i = 0; i < members.length; i ++) {
            members[i].displayAsPointEvent = false;
            for (let j = 0; j < i; j ++) {
                if (members[i].overlaps(members[j])) {
                    this.#moveEventDown(members[i], members[j]);
                    container.y2 = members[i].y2 + DEFLATE_SIZE;
                }
            }
        }
    }

    #fixContainerOverlaps() {
        let containers = this.#containers
        for (let i = 0; i < containers.length; i ++) {
            for (let j = 0; j < i; j ++) {
                if (containers[i].overlaps(containers[j])) {
                    let height = containers[i].y2 - containers[i].y1;
                    let y1Diff = containers[i].y1;
                    let y2Diff = containers[i].y2;
                    containers[i].y1 = containers[j].y2 + PADDING_Y;
                    containers[i].y2 = containers[i].y1 + height;
                    y1Diff = containers[i].y1 - y1Diff;
                    y2Diff = containers[i].y2 - y2Diff;
                    this.#containerMembers(containers[i].containerId).forEach(c => this.#moveContainerMemberDown(c, y1Diff));
                }
            }
        }
    }

    #moveContainerMemberDown(evt, dist) {
        let height = evt.y2 - evt.y1;
        evt.y1 += dist;
        evt.y2 = evt.y1 + height;
    }

    #displayEventAsPointEvent(evt) {
        return evt.pixelWidth < POINT_EVENT_THRESHOLD;
    }

    #moveEventDown(evt, other) {
        // Move the event down on the screen.
        // Used to avoid overlapping period events.
        evt.moveVertically(other.height + PADDING_Y);
    }

    #getMinX(lst = this._events) {
        return lst.reduce(
            (acc, shot) => acc.start.lt(shot.start) ? acc : shot,
            lst[0]).start;
    }

    #getMaxX(lst = this._events) {
        return lst.reduce(
            (acc, shot) => acc.end.gt(shot.end) ? acc : shot,
            lst[0]).end;
    }

    #getContainerStart(members) {
        return members.reduce((acc, shot) => shot.x1 < acc ? shot.x1 : acc, members[0].x1);
    }

    #getContainerEnd(members) {
        return members.reduce((acc, shot) => shot.x2 > acc ? shot.x2 : acc, members[0].x2);
    }

    get #containers() {
        return this._events.extract(evt => evt.isContainer);
    }

    get #periodEvents() {
        return this._events.extract(evt => evt.containerId == -1 && !evt.displayAsPointEvent);
    }

    get #pointEvents() {
        return this._events.extract(evt => evt.containerId == -1 && evt.displayAsPointEvent);
    }

    #containerMembers(containerId) {
        return this._events.extract(evt => !evt.isContainer && evt.containerId == containerId);
    }

}
