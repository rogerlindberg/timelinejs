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


function postText(url, text, replyCallback=postReplyCallback) {
    var request = new XMLHttpRequest();
    request.open("POST", url, true);
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.onreadystatechange = function () {
        replyCallback(request);
    };
    request.send(text);
}

// Callback from the web-server a file has been stored.
function postReplyCallback(request) {
    if (request.status != 200) {
        serverNotAvailable = Settings.webServerUrl;
        console.log("request.readyState", request.readyState);
        console.log("request.status", request.status);
        throw new Error("POST request failed.");
    }
}