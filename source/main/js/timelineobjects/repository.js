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


// TODO: This module is too large!!!


// *************************************************
// This class represents a repository where all
// timeline data is stored.
// *************************************************
class Repository {

	static _timeType;
	_dialogOpen = false;
	_readOnly = false;
	_inDrawing = false;

	constructor(xmlDoc) {
		this.version = '';
		this.timeType = Repository._timeType;
		this._dialogOpen = false;
		this._readOnly = false;
		this.time = undefined;
		this.delta = undefined;
		this.period = undefined;
		this.eras = [];
		this.categories = [];
		this.events = [];
		parseXmlDoc(this, xmlDoc);
		this.path = lastUsedPath;
		this.filename = this.#getFilename(lastUsedPath);
		lastUsedPath = undefined;
		this.#assureNoRepoParagraphIsHidden();
		this.setMenues();
		this.resetReadOnly();
		Repository.saveIntervallInMilliseconds = Settings.saveIntervallInMilliseconds;
	}

	#assureNoRepoParagraphIsHidden() {
		document.getElementById("norepo").setAttribute("style", "display:none");
	}

	#getFilename(path) {
		// For sample timelines there is no path!
		if (path && path.endsWith(".timeline")) {
			return path.substring(0, path.length - 9);
		}
	}

	resetReadOnly() {
		hideDomElement("readonly");
	}

	setMenues() {
		document.getElementById("goto-zero").innerHTML = this.timeType.getLabel("goto-zero");
		document.getElementById("goto-time").innerHTML = this.timeType.getLabel("goto-time");
		document.getElementById("time-label").innerHTML = this.timeType.getLabel("time-label");
		document.getElementById("time-input").setAttribute('type', this.timeType.getLabel("time-input"));
	}

	//
	// Plain getters
	//
	get dialogOpen() { return this._dialogOpen; }
	get readOnly() { return this._readOnly; }

	//
	// Plain setters
	//
	set dialogOpen(value) { this._dialogOpen = value; }
	set readOnly(value) { this._readOnly = value; }
	set inDrawing(value) { this._inDrawing = value; }

	//
	// static Plain setters
	//
	static set newTimeType(value) { Repository._timeType = value; }

	//
	// Getters with logic
	//
	getContainers() {
		return this.events.extract(evt => evt.isContainer)
	}

	getContainer(containerId) {
		return this.events.reduce(
			(acc, evt) => evt.isContainerWithId(containerId) ? evt : acc, undefined)
	}

	getContainerByName(containerName) {
		return this.events.reduce(
			(acc, evt) => evt.isContainer && evt.label == containerName ? evt : acc, undefined)
	}

	containerHasMembers(containerId) {
		return this.getContainerMembers(containerId).length > 0;
	}

	getAllContainerMembers() {
		return this.events.extract(evt => evt.isContainerMember);
	}

	getContainerMembers(containerId) {
		return this.events.extract(evt => evt.isContainerMemberWithId(containerId));
	}

	getOrdinaryEvents() {
		return this.events.extract(evt => evt.hasNoContainerRef)
	}

	getFirstHitevent() {
		return this.events.find(evt => evt.hit);
	}

	eventFromId(id) {
		return this.events.find(evt => evt.id == id);
	}

	categoryFromName(name) {
		return this.categories.find(cat => cat.name == name);
	}

	eraFromName(name) {
		return this.eras.find(era => era.name == name);
	}

	getContainerPeriod(containerId) {
		let members = this.getContainerMembers(containerId);
        let start = members.reduce((acc, evt) => evt.start.lt(acc) ? evt.start : acc, members[0].start);
        let end = members.reduce((acc, evt) => evt.end.gt(acc) ? evt.end : acc, members[0].end);
		return {start, end};
	}

	getEventFontColor(event) {
		for (const cat of this.categories) {
			if (event.category == cat.label) {
				return cat.fontColor;
			}
		}
		return "0,0,0";
	}

	get visibleEvents() {
		let visibleEvents = [];
		let hiddenCategories = this.categories.extract(cat => cat.hidden);
		let hiddenCatNames = hiddenCategories.transform(cat => cat.name);
		// Containers
		for (const container of this.getContainers()) {
			if (hiddenCatNames.hasItem(container.category)) {
				// Container is hidden.
				// All it's member should also be hidden
			} else {
				// Only members with categories not hidden
				visibleEvents.push(container);
				let visibleMemberFound = false;
				for (const member of this.getContainerMembers(container.containerId)) {
					if (!hiddenCatNames.hasItem(member.category)) {
						visibleEvents.push(member);
						visibleMemberFound = true;
					}
				}
				if (!visibleMemberFound) {
					visibleEvents.deleteItem(container);
				}
			}
		}
		let ordinaryEvents = this.getOrdinaryEvents().extract(evt => !hiddenCatNames.hasItem(evt.category));
		return visibleEvents.concat(ordinaryEvents);
	}

	//
	// Setters with logic
	//

	static set saveIntervallInMilliseconds(value) {
		window.setInterval(Repository.saveTimeline, value);
	}

	//
	//
	//

	// Create a new container containing the given event.
	createContainerForEvent(tlEvent, containerName) {
		let id = this.#getMaxContainerId() + 1;
		let container = new Event(`[${id}]${containerName}`, tlEvent.period,
			"", "", "100,100,100", "127,127,127", "",
			false, false, false, false, 0, "", false);
		// Put the container first in the list of events
		this.events.splice(0, 0, container);
		tlEvent.containerId = id;
		tlEvent.label = `(${id})${tlEvent.label}`
	}

	#getMaxContainerId() {
		return this.events.reduce((acc, evt) => evt.containerId > acc ? evt.containerId : acc, 0)
	}

	//
	// Delete functions
	//

	deleteEvent(tlEvent) {
		if (this.events.deleteItem(tlEvent)) {
			drawTimeline();
		}
	}

	deleteEra(era) {
		if (this.eras.deleteItem(era)) {
			drawTimeline();
		}
	}

	//
	// Add functions
	//

	addEvent(evt) {
		this.events.push(evt);
		drawTimeline();
	}

	addCategory(category) {
		this.categories.push(category);
		drawTimeline();
	}

	addEra(era) {
		this.eras.push(era);
		drawTimeline();
	}

	//
	// Save
	//

	static saveTimeline(e) {
		// This function is triggered by a timer event, so 'this' don't point to
		// this repository. So we have to use the global variable repo to do the tests
		if (repo && !repo.readOnly && repo.filename) {
			saveRepository(repo.filename);
		}
	}

	//
	// Mouse events
	//

	setMouseOver(pos) {
		this.events.forEach(e => !e.isContainer ? e.isOver(...pos.values) : 0);
	}

	setEventHits(pos, ctrlDown, altDown) {
		// If events in a container is hit, never hit the container.
		// The container should only be hit if no other events are hit.
		// Reset all hits
		if (altDown) {
			this.events.forEach(e => !e.isContainer ? e.toggleStickyBubble(...pos.values) : 0);
			return;
		}
		if (!ctrlDown) {
			this.events.forEach(e => e.hit = false);
		}
		// Check all non-container events
		this.events.forEach(e => !e.isContainer ? e.isHit(...pos.values, ctrlDown) : 0);
		let hitCount = this.events.count(evt => !evt.isContainer && evt.hit);
		// If nothing is hit, check the containers.
		if (hitCount == 0) {
			hitCount = this.events.count(evt => evt.isContainer && evt.hit);
			this.events.forEach(e => e.isContainer ? e.isHit(...pos.values, ctrlDown) : 0);
		}
		return hitCount;
	}

	//
	// To Xml functions
	//
	sortEvents() {
		// Make sure container-events comes first and container
		// members next and ordinary events last.
		let containers = this.events.extract(evt => evt.isContainer);
		containers.sort((a, b) => a.text.localeCompare(b.text));
		let members = this.events.extract(evt => !evt.isContainer && evt.containerId != -1);
		members.sort((a, b) => a.text.localeCompare(b.text));
		let events = this.events.extract(evt => !evt.isContainer && evt.containerId == -1);
		this.events = containers.concat(members).concat(events);
	}

	//
	// Period functions
	//

	backward() {
		this.period.backward();
		drawTimeline();
	}

	forward() {
		this.period.forward();
		drawTimeline();
	}

	gotoZero() {
		this.gotoTime(repo.timeType.now().toString())
	}

	gotoTime(strTime) {
		var delta1 = this.timeType.strToTime(strTime).sub(repo.period.start);
		var delta2 = repo.period.delta.div(2);
		repo.period.start = repo.period.start.addDelta(delta1);
		repo.period.start = repo.period.start.subDelta(delta2);
		repo.period.end = repo.period.end.addDelta(delta1);
		repo.period.end = repo.period.end.subDelta(delta2);
		drawTimeline();
	}

	fitAllEvents() {
		new Scene().fitAllEvents();
	}

	zoomIn() {
		this.period.zoomIn();
	}

	zoomOut() {
		this.period.zoomOut();
	}

	deleteSelectedEvents() {
		let deleted = true;
		while (deleted) {
			deleted = this._deleteSelectedEvents();
		}
	}

	_deleteSelectedEvents() {
		for (let i = 0; i < this.events.length; i++) {
			let evt = this.events[i];
			if (evt.hit) {
				this.events.splice(i, 1);
				return true;
			}
		}
		return false;
	}

}



function emptyField(field) {
	return field.trim().length == 0;
}

function isNotNumeric(field) {
	return !isNumeric(field);
}

function isNumeric(field) {
	return !isNaN(parseInt(field));
}

function newNumTimeRepo(values) {
	let xml = `<?xml version="1.0" encoding="utf-8"?>
	<timeline>
	  <version>2.5.0 (67ed963f67ff 2021-10-05)</version>
	  <timetype>numtime</timetype>
	  <categories>
	  </categories>
	  <events>
	  </events>
	  <view>
		<displayed_period>
		  <start>0</start>
		  <end>30</end>
		</displayed_period>
		<hidden_categories>
		</hidden_categories>
	  </view>
	</timeline>`
	lastUsedPath = values.filename;
	loadRepoFromText(xml);
	saveRepository(values.filename)
}

function newGregorianTimeRepo(values) {
	let xml = `<?xml version="1.0" encoding="utf-8"?>
	<timeline>
	  <version>2.5.0</version>
	  <timetype>gregoriantime</timetype>
	  <categories>
	  </categories>
	  <events>
	  </events>
	  <view>
		<displayed_period>
		  <start>2021-06-11 00:00:00</start>
		  <end>2021-07-11 00:00:00</end>
		</displayed_period>
		<hidden_categories>
		</hidden_categories>
	  </view>
	</timeline>`
	lastUsedPath = values.filename;
	loadRepoFromText(xml);
	saveRepository(values.filename)
}

// Save the timeline whenever a page is Refreshed or closed.
window.onbeforeunload = function () {
	if (repo) {
		repo.saveTimeline();
	}
}
