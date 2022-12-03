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


// The repository object can be accessed from anywhere in the app
let repo = undefined;

// The repo construction occurs in another process then the function used to
// load the repo. To pass the path info to repo construction this global var is used.
let lastUsedPath = undefined;



// Function to load a repository from the web-server
function loadRepository(path) {
  _saveCurrentTimeline();
  _openSelectedTimeline(path);
}

function _saveCurrentTimeline() {
  if (repo) {
    Repository.saveTimeline(undefined);
  }
}

function _openSelectedTimeline(path) {
  if (Settings.webServerUrl != serverNotAvailable) {
    lastUsedPath = path;
    getText(`${Settings.webServerUrl}/${path}`, loadRepoFromText)
  }
}

function loadRepoFromText(text) {
  repo = new Repository(new DOMParser().parseFromString(text, "text/xml"));
  drawTimeline();
  setInnerHtml("timelinepath", `Path: ${repo.path}`);
}

//
// XML parser functions
//

function parseXmlDoc(repo, xmlDoc) {
  repo.version = parseVersion(xmlDoc);
  let tt = parseTimeType(xmlDoc);
  repo.timeType = tt.timeType
  repo.time = tt.time;
  repo.timeDelta = tt.timeDelta;
  repo.eras = parseEras(repo, xmlDoc);
  repo.categories = parseCategories(xmlDoc);
  repo.events = parseEvents(repo, xmlDoc);
  repo.period = parseDisplayedPeriod(repo, xmlDoc);
  parseHiddenCategories(repo, xmlDoc);
}

function parseVersion(xmlDoc) {
  /*
  <xs:simpleType name="version">
    <xs:restriction base="xs:string">
      <xs:pattern value="(\d+).(\d+).(\d+)(.*)( development)?"/>
    </xs:restriction>
  </xs:simpleType>
  */
  return xmlDoc.getElementsByTagName('version')[0].innerHTML;
}

function parseTimeType(xmlDoc) {
  /*
  <xs:simpleType name="timetype">
    <xs:restriction base="xs:string">
      <xs:enumeration value="gregoriantime"/>
      <xs:enumeration value="bosparaniantime"/>
      <xs:enumeration value="numtime"/>
      <xs:enumeration value="coptic"/>
      <xs:enumeration value="pharaonic"/>
    </xs:restriction>
  </xs:simpleType>
  */
  let timeType = xmlDoc.getElementsByTagName('timetype')[0].innerHTML;
  if (timeType == "numtime") {
    return { "timeType": NumTimeType, "time": NumTime, "timeDelta": NumTimeDelta };
  } else if (timeType == "gregoriantime") {
    return { "timeType": GregorianTimeType, "time": GregorianTime, "timeDelta": GregorianTimeDelta };
  } else {
    throw Error("Unrecognized time type: " + timeType);
  }
}

function parseEras(repo, xmlDoc) {
  /*
  <xs:complexType name="era">
    <xs:sequence>
      <xs:element name="name" type="xs:string"/>
      <xs:element name="start" type="xs:string"/>
      <xs:element name="end" type="xs:string"/>
      <xs:element name="color" type="xs:string"/>
      <xs:element name="ends_today" type="xs:string" minOccurs="0" maxOccurs="1"/>
    </xs:sequence>
  </xs:complexType>
  */
  let result = [];
  const erasList = xmlDoc.getElementsByTagName('eras')[0];
  if (erasList) {
    const eras = erasList.getElementsByTagName('era');
    for (const era of eras) {
      result.push(parseEra(repo, era));
    }
  }
  return result;
}

function parseEra(repo, era) {
  let name = era.getElementsByTagName('name')[0].innerHTML;
  let start = repo.timeType.strToTime(era.getElementsByTagName('start')[0].innerHTML);
  let end = repo.timeType.strToTime(era.getElementsByTagName('end')[0].innerHTML);
  let color = era.getElementsByTagName('color')[0].innerHTML;
  let endsToday = parseOptionalBoolean(era, 'ends_today');
  return new Era(name, start, end, color, endsToday);
}


function parseCategories(xmlDoc) {
  /*
  <xs:complexType name="category">
    <xs:sequence>
      <xs:element name="name" type="xs:string"/>
      <xs:element name="color" type="xs:string"/>
      <xs:element name="progress_color" minOccurs="0" maxOccurs="1" type="xs:string"/>
      <xs:element name="done_color" minOccurs="0" maxOccurs="1" type="xs:string"/>
      <xs:element name="font_color" minOccurs="0" maxOccurs="1" type="xs:string"/>
      <xs:element name="parent" minOccurs="0" maxOccurs="1" type="xs:string"/>
    </xs:sequence>
  </xs:complexType>
  */
  let result = []
  const categoriesList = xmlDoc.getElementsByTagName('categories')[0];
  const categories = categoriesList.getElementsByTagName('category');
  for (const cat of categories) {
    result.push(parseCategory(cat));
  }
  return result;
}

function parseCategory(cat) {
  const name = cat.getElementsByTagName('name')[0].innerHTML;
  const color = cat.getElementsByTagName('color')[0].innerHTML;
  const fontColor = parseOptionalColor(cat, 'font_color');
  const doneColor = parseOptionalColor(cat, 'done_color');
  const parent = parseOptionalString(cat, 'parent');
  return new Category(name, color, parent, doneColor, fontColor);
}

function parseEvents(repo, xmlDoc) {
  /*
  <xs:complexType name="event">
    <xs:sequence>
      <xs:element name="start" type="xs:string"/>
      <xs:element name="end" type="xs:string"/>
      <xs:element name="text" type="xs:string"/>
      <xs:element name="progress" type="xs:string" minOccurs="0" maxOccurs="1"/>
      <xs:element name="fuzzy" type="xs:string" minOccurs="0" maxOccurs="1"/>
      <xs:element name="locked" type="xs:string" minOccurs="0" maxOccurs="1"/>
      <xs:element name="ends_today" type="xs:string" minOccurs="0" maxOccurs="1"/>
      <xs:element name="category" type="xs:string" minOccurs="0" maxOccurs="1"/>
      <xs:element name="description" type="xs:string" minOccurs="0" maxOccurs="1"/>
      <xs:element name="hyperlink" type="xs:string" minOccurs="0" maxOccurs="1"/>
      <xs:element name="alert" type="xs:string" minOccurs="0" maxOccurs="1"/>
      <xs:element name="icon" type="xs:string" minOccurs="0" maxOccurs="1"/>
      <xs:element name="default_color" type="xs:string" minOccurs="0" maxOccurs="1"/>
      <xs:element name="milestone" type="xs:string" minOccurs="0" maxOccurs="1"/>
    </xs:sequence>
  </xs:complexType>
  */
 result = []
  const eventsList = xmlDoc.getElementsByTagName('events')[0];
  const events = eventsList.getElementsByTagName('event');
  for (const evt of events) {
    result.push(parseEvent(repo, evt));
  }
  return result;
}

function parseEvent(repo, evt) {
  var label = evt.getElementsByTagName('text')[0].innerHTML;
  var start = repo.timeType.strToTime(evt.getElementsByTagName('start')[0].innerHTML);
  var end = repo.timeType.strToTime(evt.getElementsByTagName('end')[0].innerHTML);
  var period = new Period(start, end);
  let progress = parseOptionalInt(evt, 'progress')
  let fuzzyStart = parseOptionalBoolean(evt, 'fuzzy_start');
  let fuzzyEnd = parseOptionalBoolean(evt, 'fuzzy_end');
  let locked = parseOptionalBoolean(evt, 'locked');
  let endsToday = parseOptionalBoolean(evt, 'ends_today');
  let defaultColor = parseOptionalColor(evt, 'default_color');
  let category = parseOptionalString(evt, 'category');
  let description = parseOptionalString(evt, 'description');
  let hyperlink = parseOptionalString(evt, 'hyperlink');
  let icon = parseOptionalString(evt, 'icon');
  let milestone = parseOptionalBoolean(evt, 'milestone');
  var color = `rgb(${defaultColor})`;
  if (category.length > 0) {
    for (const cat of repo.categories) {
      if (cat.name == category) {
        color = `rgb(${cat.color})`;
        break;
      }
    }
  }
  return new Event(label, period, description, hyperlink, color,
    defaultColor, category, fuzzyStart, fuzzyEnd, endsToday, locked, progress,
    icon, milestone);
}

function parseDisplayedPeriod(repo, xmlDoc) {
  /*
  <xs:complexType name="displayed_period">
    <xs:sequence>
      <xs:element name="start" type="xs:string"/>
      <xs:element name="end" type="xs:string"/>
    </xs:sequence>
  </xs:complexType>
  */
  const elem = xmlDoc.getElementsByTagName('displayed_period')[0];
  const start = elem.getElementsByTagName('start')[0].innerHTML;
  const end = elem.getElementsByTagName('end')[0].innerHTML;
  return new Period(repo.timeType.strToTime(start),  repo.timeType.strToTime(end));
}



function parseHiddenCategories(repo, xmlDoc) {
  /*
  <xs:complexType name="hidden_categories">
    <xs:sequence>
      <xs:element name="name"  minOccurs="0" maxOccurs="unbounded"/>
    </xs:sequence>
  </xs:complexType>
    */
  const categoriesList = xmlDoc.getElementsByTagName('hidden_categories')[0];
  const names = categoriesList.getElementsByTagName('name');
  for (const nme of names) {
    var name = nme.innerHTML;
    let inx = repo.categories.findIndex(cat => cat.name == name);
    if (inx != -1) {
      repo.categories[inx].hidden = true;
    }
  }
}

//
// Common
//
function parseOptionalInt(evt, tagName, defaultValue = 0) {
  let list = evt.getElementsByTagName(tagName);
  if (list.length > 0) {
    return parseInt(list[0].innerHTML);
  }
  else {
    return defaultValue;
  }
}

function parseOptionalBoolean(evt, tagName, defaultValue = false) {
  let list = evt.getElementsByTagName(tagName);
  if (list.length > 0) {
    return list[0].innerHTML.toLowerCase() == 'true';
  }
  else {
    return defaultValue;
  }
}

function parseOptionalString(evt, tagName, defaultValue = "") {
  return parseOptional(evt, tagName, defaultValue);
}

function parseOptionalColor(evt, tagName, defaultValue = "0,0,0") {
  return parseOptional(evt, tagName, defaultValue);
}

function parseOptional(evt, tagName, defaultValue) {
  let list = evt.getElementsByTagName(tagName);
  if (list.length > 0) {
    return list[0].innerHTML;
  }
  else {
    return defaultValue;
  }
}
