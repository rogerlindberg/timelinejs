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



// Function to save a repository to the web-server
function saveRepository(path) {
	if (Settings.webServerUrl != serverNotAvailable) {
		let url = `${Settings.webServerUrl}/${path}`
		lastUsedPath = path;
        postText(url, toXml());
	}
}

function toXml() {
  repo.sortEvents();
  return '<?xml version="1.0" encoding="utf-8"?>\n' +
    '<timeline>\n' +
    tag('version', repo.version, 1) +
    tag('timetype', repo.timeType.name, 1) +
    erasToXml(1) +
    categoriesToXml(1) +
    eventsToXml(1) +
    viewToXml(1) +
    '</timeline>'
}

//
// Eras to XML
//
function erasToXml(level) {
  const margin = ' '.repeat(level * 2)
  let eras = ""
  for (const era of repo.eras) {
    eras += eraToXml(era, level + 1)
  }
  return `${margin}<eras>\n` + eras + `${margin}</eras>\n`;
}

function eraToXml(era, level) {
  const margin = ' '.repeat(level * 2)
  return `${margin}<era>\n` +
    tag('name', era.name, level + 1) +
    tag('start', era.start.toString(), level + 1) +
    tag('end', era.end.toString(), level + 1) +
    tag('color', era.color, level + 1) +
    tag('ends_today', era.endsToday, level + 1, true) +
    `${margin}</era>\n`;
}

//
// Categories to XML
//
function categoriesToXml(level) {
  const margin = ' '.repeat(level * 2)
  let cats = ""
  for (const cat of repo.categories) {
    cats += categoryToXml(cat, level + 1)
  }
  return `${margin}<categories>\n` + cats + `${margin}</categories>\n`;
}

function categoryToXml(cat, level) {
  const margin = ' '.repeat(level * 2)
  return `${margin}<category>\n` +
    tag('name', cat.name, level + 1) +
    tag('color', cat.color, level + 1) +
    tag('done_color', cat.doneColor, level + 1) +
    tag('font_color', cat.fontColor, level + 1) +
    tag('parent', cat.parent, level + 1, true) +
    `${margin}</category>\n`;
}

//
// Events to XML
//
function eventsToXml(level) {
  const margin = ' '.repeat(level * 2)
  let evts = ""
  for (const evt of repo.events) {
    evts += eventToXml(evt, level + 1)
  }
  return `${margin}<events>\n` + evts + `${margin}</events>\n`;
}

function eventToXml(evt, level) {
  const margin = ' '.repeat(level * 2)
  return `${margin}<event>\n` +
    tag('start', evt.period.start, level + 1) +
    tag('end', evt.period.end, level + 1) +
    tag('text', evt.text, level + 1) +
    tag('fuzzy', false, level + 1) +
    tag('fuzzy_start', evt.fuzzyStart, level + 1) +
    tag('fuzzy_end', evt.fuzzyEnd, level + 1) +
    tag('locked', evt.locked, level + 1) +
    tag('ends_today', evt.endsToday, level + 1) +
    tag('category', evt.category, level + 1, true) +
    tag('description', evt.description, level + 1, true) +
    tag('hyperlink', evt.hyperlink, level + 1, true) +
    tag('icon', evt.icon, level + 1, true) +
    tag('default_color', evt.defaultColor, level + 1) +
    tag('milestone', evt.milestone, level + 1, true) +
    `${margin}</event>\n`;
}

//
// View to XML
//

function viewToXml(level) {
  const margin = ' '.repeat(level * 2)
  return `${margin}<view>\n` +
    displayedPeriodToXml(level + 1) +
    hiddenCategoriesToXml(level + 1) +
    `${margin}</view>\n`;
}

function displayedPeriodToXml(level) {
  const margin = ' '.repeat(level * 2)
  return `${margin}<displayed_period>\n` +
    tag("start", repo.period.start.toString(), level + 1) +
    tag("end", repo.period.end.toString(), level + 1) +
    `${margin}</displayed_period>\n`;
}

function hiddenCategoriesToXml(level) {
  const margin = ' '.repeat(level * 2)
  let hiddenCategories = repo.categories.extract(cat => cat.hidden);
  let cats = ""
  hiddenCategories.forEach(cat => cats += tag('name', cat.name, level + 1))
  return `${margin}<hidden_categories>\n` +
    cats +
    `${margin}</hidden_categories>\n`;
}

//
// Common
//
function tag(tagname, value, level, skipIfEmpty = false) {
	// For booleans, false is default, so if value is optional, no tag shall
	// be created if value is false.
	if (typeof value == "boolean" && skipIfEmpty && value == false) {
		return "";
	}
	// For strings, "" is default, so if value is optional, no tag shall
	// be created if trimmed value == "".
	if (typeof value == "string" && skipIfEmpty && value.trim().length == 0) {
		return "";
	}
	// Old Timeline app stores boolean values as True/False, with leading
	// char in uppercase. So to be compatible we do the same.
	if (typeof value == "boolean") {
		if (value) {
			value = "True";
		} else {
			value = "False";
		}
	}
	const margin = ' '.repeat(level * 2)
	return `${margin}<${tagname}>${value}</${tagname}>\n`;
}

//
//
//
window.setInterval(Repository.saveTimeline, Settings.saveIntervallInMilliseconds);
