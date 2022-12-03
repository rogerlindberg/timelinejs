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
// This class represents a category of events
// *************************************************
class Category {
    _name;
    _color;
    _doneColor;
    _fontColor;
    _parent;

    constructor(name, color, parent="", doneColor="0,0,0", fontColor="0,0,0") {
        this._name = name;
        this._color = color;
        this._parent = parent;
        this._doneColor = doneColor;
        this._fontColor = fontColor;
        this._hidden = false;
    }

    get name() {return this._name;}
    set name(value) {this._name = value;}
    get color() {return this._color;}
    set color(value) {this._color = value;}
    get parent() {return this._parent;}
    get doneColor() {return this._doneColor;}
    get fontColor() {return this._fontColor;}
    get hidden() {return this._hidden;}
    set hidden(value) {this._hidden = value;}
}

