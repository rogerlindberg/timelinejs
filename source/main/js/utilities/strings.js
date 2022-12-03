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


function zeroPrefixString(str, len) {
    let result = `${str}`;
    while (result.length < len) {
        result = "0" + result;
    }
    return result;
}

function formatDate(ymd, secs) {
    let hours = Math.trunc(secs / 60 / 60);
    let minutes = Math.trunc((secs - hours * 60 * 60) / 60);
    let seconds = secs % 60;
    let month = zeroPrefixString(ymd.month, 2);
    let day = zeroPrefixString(ymd.day, 2);
    hours = zeroPrefixString(hours, 2);
    minutes = zeroPrefixString(minutes, 2);
    seconds = zeroPrefixString(seconds, 2);
	return `${ymd.year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

const LCARS_CHAR_SIZE_ARRAY = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 26, 46, 63, 42, 105, 45, 20, 25, 25, 47, 39, 21, 34, 26, 36, 36, 28, 36, 36, 36, 36, 36, 36, 36, 36, 27, 27, 36, 35, 36, 35, 65, 42, 43, 42, 44, 35, 34, 43, 46, 25, 39, 40, 31, 59, 47, 43, 41, 43, 44, 39, 28, 44, 43, 65, 37, 39, 34, 37, 42, 37, 50, 37, 32, 43, 43, 39, 43, 40, 30, 42, 45, 23, 25, 39, 23, 67, 45, 41, 43, 42, 30, 40, 28, 45, 33, 52, 33, 36, 31, 39, 26, 39, 55];


function getStringWidth(text, fontSize) {
    let width = 0;
    let scaleFactor = fontSize/100;
    for(let i=0; i<text.length; i++) {
        width = width + LCARS_CHAR_SIZE_ARRAY[text.charCodeAt(i)];
    }
    return width * scaleFactor;
}