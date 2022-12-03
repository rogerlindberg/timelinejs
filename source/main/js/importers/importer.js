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

// The web server to be used to access and stor timeline files.
let serverNotAvailable = undefined;


function getText(url, onLoadFunction, onErrorFunction=_onError) {
    var request = new XMLHttpRequest();
    request.onload = () => _onLoad(request, onLoadFunction);
    request.onerror = onErrorFunction;
    request.open("GET", url);
    request.send();
}

function _onError(err) {
    serverNotAvailable = Settings.webServerUrl;
    console.log(`Failed to load text from web-server, Err:${err}`);
}

function _onLoad(request, onLoadFunction) {
    if (request.status == 200) {
        onLoadFunction(request.responseText);
    } else {
        throw new Error("Failed to load data.");
    }
}
