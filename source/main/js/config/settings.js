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

let defaults = {
    "balloon_on_hover": false,
    "gradient_drawing": false,
    "save_intervall_in_milliseconds": "60000",
    "web_server_url": "http://localhost:8000",
}

// *************************************************
// This class represents application settings
// *************************************************
class Settings {

    // Default values used before the configuration file is read.
    static _settings = defaults;

    constructor(settingsData) {
        for (const setting in settingsData) {
            Settings._settings[setting] = settingsData[setting];
        }
        // If a Timeline configuration file is used, TimelineJs specific
        // settings will not be present.
        // let addedSettings = this.#addTimelineJsSpecificSettings();
        // This is a hack to make things work in both static and dynamic mode.
        // this._settings = Settings._settings;
        this.bubbleOnHoover = Settings.bubbleOnHoover;
        this.gradientDrawing = Settings.gradientDrawing;
        this.saveIntervallInMilliseconds = Settings.saveIntervallInMilliseconds;
        this.webServerUrl = Settings.webServerUrl;
        this.toText = Settings.toText;
        saveSettings();
    }

    static get bubbleOnHoover() {
        return booleanValue(Settings._settings.balloon_on_hover);
    }

    static get gradientDrawing() {
        return booleanValue(Settings._settings.gradient_drawing);
    }

    static get saveIntervallInMilliseconds() {
        return Settings._settings.save_intervall_in_milliseconds;
    }

    static get webServerUrl() {
        return Settings._settings.web_server_url;
    }

    static set bubbleOnHoover(value) {
        Settings._settings.balloon_on_hover = booleanText(value);
    }

    static set gradientDrawing(value) {
        Settings._settings.gradient_drawing = booleanText(value);
    }

    static set saveIntervallInMilliseconds(value) {
        Settings._settings.save_intervall_in_milliseconds = value;
        window.setInterval(Repository.saveTimeline, value);
    }

    static set webServerUrl(value) {
        Settings._settings.web_server_url = value;
    }

    static toText() {
        let text = "[DEFAULT]\n"
        for (var key in Settings._settings){
            text += `${key} = ${Settings._settings[key]}\n`;
        }
        return text;
    }

}

function booleanValue(text) {
    return text == "True";
}

function intValue(text) {
    return parseInt(text);
}

function booleanText(value) {
    return value ? "True" : "False";
}
