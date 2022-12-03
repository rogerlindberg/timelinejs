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


// This class represents a point in an orthogonal coordinate system.
// The values array can be used when a function needs separate args for x and y:
// Example:
//        function foo(x, y) {...}
//    can be called with...
//        foo(...point.values) {...}

class Point {

    constructor(x, y) {
        this._x = x;
        this._y = y;
    }

    get x() {return this._x;}
    get y() {return this._y;}
    get values() {return [this._x, this.y]}

    set x(value) {this._x = value;}
    set y(value) {this._y = value;}

    xDiff(otherPoint) {
        return this.x - otherPoint.x;
    }

    yDiff(otherPoint) {
        return this.y - otherPoint.y;
    }

}
