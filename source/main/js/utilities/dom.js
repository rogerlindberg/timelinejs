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


const FONT = "12px Verdana";

function getCanvasContext(font=FONT) {
    let ctx = document.getElementById("mainCanvas").getContext("2d");
    ctx.font = font;
    return ctx;
}

function getCanvas() {
    return getCanvasContext().canvas;
}

function setCursor(cursor) {
    getCanvas().style.cursor = cursor;
}

function getTextWidth(text, font="12px Verdana") {
    let ctx = getCanvasContext();
    ctx.font = font;
    return ctx.measureText(text).width;
}

function getTextHeight() {
    return getCanvasContext().measureText("M").width;
}

function hideDomElement(elementId) {
    document.getElementById(elementId).style.display = "none";
}

function showDomElement(elementId) {
    document.getElementById(elementId).style.display = "block";
}

function setElementValue(elementId, value) {
    let element = document.getElementById(elementId);
    element.value = value;
}

function getElementValue(elementId) {
    return document.getElementById(elementId).value;
}

function setElementChecked(elementId, value) {
    let element = document.getElementById(elementId);
    element.checked = value;
}

function setInnerHtml(elementId, value) {
    document.getElementById(elementId).innerHTML = value;
}