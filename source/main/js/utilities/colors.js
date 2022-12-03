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


function rgbToTuple(rgbText) {
    if (rgbText.startsWith("rgb(")) {
        values = rgbText.substring(4, rgbText.length - 1).split(',');
    } else {
        values = rgbText.split(',');
    }

    let tuple = [];
    for (var i = 0; i < 3; i++) {
        tuple.push(parseInt(values[i].trim()))
    }
    return tuple;
}

function tupleToRgb(colorTuple) {
    return "rgb(" + colorTuple[0] + "," + colorTuple[1] + "," + colorTuple[2] + ")";
}

function darkenColor(colorTuple, factor=0.7) {
    if (factor < 0.0 || factor > 1.0) {
        return colorTuple;
    }
    for (var i = 0; i < 3; i++) {
        colorTuple[i] = Math.min(255, Math.round(factor * colorTuple[i]));
    }
    return colorTuple;
}

function lightenColor(colorTuple, factor=1.5) {
    if (factor < 1.0 || factor > 255.0) {
        return colorTuple
    }
    if (colorTuple[0] == 0 && colorTuple[1] == 0 && colorTuple[2] == 0){
        return [1, 1, 1];    // avoid multiplying factor by zero
    }
    for (var i = 0; i < 3; i++) {
        colorTuple[i] = Math.min(255, Math.round(factor * colorTuple[i]));
    }
    return colorTuple;
}

function rgbToHexString(rgbString) {
    if (rgbString.startsWith("rgb")) {
        rgbString = rgbString.substring(4, rgbString.length - 1)
    }
    values = rgbString.split(',');
    let r =  parseInt(values[0]);
    let g =  parseInt(values[1]);
    let b =  parseInt(values[2]);
    let rHexString = leftPadString(r.toString(16), 2, "0")
    let gHexString = leftPadString(g.toString(16), 2, "0")
    let bHexString = leftPadString(b.toString(16), 2, "0")
    return `#${rHexString}${gHexString}${bHexString}`
}

function leftPadString(str, len, padding) {
    while (str.length < len) {
        str = padding + str;
    }
    return str;
}
function hexToRgbString(hexString) {
    hexString = hexString.substring(1);
    let rHex = hexString.substring(0,2);
    let gHex = hexString.substring(2,4);
    let bHex = hexString.substring(4,6);
    let r = parseInt(rHex, 16);
    let g = parseInt(gHex, 16);
    let b = parseInt(bHex, 16);
    return `${r},${g},${b}`
}
