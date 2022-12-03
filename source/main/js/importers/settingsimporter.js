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



// Initial load of settings from the web-server
(function (path = "cfg/.thetimelineproj.cfg") {
    getText(`${Settings.webServerUrl}/${path}`, loadSettingsFromText);
})();

function loadSettingsFromText(text) {
    let settingsData = {};
    let segmentFound = false;
    for (const line of text.split('\n')) {
        if (line.startsWith("[")) {
            segmentFound = line.startsWith("[DEFAULT]");
        }
        if (segmentFound && line.length > 0) {
            let keyAndValue = line.split("=");
            if (keyAndValue.length == 2) {
                settingsData[keyAndValue[0].trim()] = keyAndValue[1].trim();
            }
        }
    }
    // The settings var is never used! and that's intended.
    let settings = new Settings(settingsData)
}
