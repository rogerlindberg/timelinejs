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


class NumTimeDeltaTest extends TestCase {

    constructor () {
        super();
        this.name = "Test of NumTimeDelta Class";
        this.testList = [
            this.canDivide,
        ]
    }

    canDivide(self) {
        self.assertEquals(4, new NumTimeDelta(8).div(2).delta);
    }

}


new NumTimeDeltaTest().runTests();
