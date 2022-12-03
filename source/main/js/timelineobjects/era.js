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


// *************************************************
// This class represents an era on the timeline.
// *************************************************
class Era {
    _name;
    _start;
    _end;
    _color;
    _endsToday;

    constructor(name, start, end, color, endsToday=false) {
        this._name = name;
        this._start = start;
        this._end = end;
        this._color = color;
        this._endsToday = endsToday;
    }

    get name() {return this._name;}
    get color() {return this._color;}
    get start() {return this._start;}
    get end() {return this._end;}
    get endsToday() {return this._endsToday;}

    set name(value) {this._name = value;}
    set color(value) {this._color = value;}
    set start(value) {this._start = value;}
    set end(value) {this._end = value;}
    set endsToday(value) {this._endsToday = value;}
}

