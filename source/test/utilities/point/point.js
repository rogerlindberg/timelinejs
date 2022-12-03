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


class PointTest extends TestCase {

    _pointA = undefined;
    _pointB = undefined;

    constructor () {
        super();
        this.name = "Test of Point class";
        this.testList = [
            this.hasXCoordinate,
            this.hasYCoordinate,
            this.hasValues,
            this.canSetXCoordinate,
            this.canSetYCoordinate,
            this.canMeasureHorizontalDistanceBetweenTwoPoints,
            this.canMeasureVerticalDistanceBetweenTwoPoints,
        ]
    }

    setUp() {
        this._pointA = new Point(2, 3);
        this._pointB = new Point(5, 10);
    }

    hasXCoordinate(self) {
        self.assertEquals(2, self._pointA.x);
    }

    hasYCoordinate(self) {
        self.assertEquals(3, self._pointA.y);
    }

    hasValues(self) {
        self.assertEquals([5, 10], self._pointB.values);
    }

    canSetXCoordinate(self) {
        self._pointA.x = 11;
        self.assertEquals(11, self._pointA.x);
    }

    canSetYCoordinate(self) {
        self._pointB.y = 11;
        self.assertEquals(11, self._pointB.y);
    }

    canMeasureHorizontalDistanceBetweenTwoPoints(self) {
        self.assertEquals(-3, self._pointA.xDiff(self._pointB));
    }

    canMeasureVerticalDistanceBetweenTwoPoints(self) {
        self.assertEquals(-7, self._pointA.yDiff(self._pointB));
    }
}


new PointTest().runTests();
