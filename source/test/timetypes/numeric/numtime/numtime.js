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


class NumTimeTest extends TestCase {

    constructor () {
        super();
        this.name = "Test of NumTime Class";
        this.testList = [
            this.hasToStringFunction,
            this.hasValueOfFunction,
            this.hasAddFunction,
            this.hasSubFunction,
            this.hasAddDeltaFunction,
            this.hasSubDeltaFunction,
            this.eqReturnsTrue,
            this.eqReturnsFalse,
            this.gtReturnsTrue,
            this.gtReturnsFalse,
            this.gteReturnsTrue1,
            this.gteReturnsTrue2,
            this.gteReturnsFalse,
            this.ltReturnsTrue,
            this.ltReturnsFalse,
            this.lteReturnsTrue1,
            this.lteReturnsTrue2,
            this.lteReturnsFalse,
        ]
    }

    hasToStringFunction(self) {
        let expected = "17";
        let obj = new NumTime(17);
        let result = obj.toString();
        self.assertEquals(expected, result);
    }

    hasValueOfFunction(self) {
        let expected = 17;
        let obj = new NumTime(17);
        let result = obj.valueOf();
        self.assertEquals(expected, result);
    }

    hasAddFunction(self) {
        let expected = 28;
        let obj1 = new NumTime(17);
        let obj2 = new NumTime(11);
        let obj3 = obj1.add(obj2)
        let result = obj3.valueOf();
        self.assertEquals(expected, result);
    }

    hasSubFunction(self) {
        let expected = -6;
        let obj1 = new NumTime(11);
        let obj2 = new NumTime(17);
        let obj3 = obj1.sub(obj2)
        let result = obj3.valueOf();
        self.assertEquals(expected, result);
    }

    hasAddDeltaFunction(self) {
        let expected = 13;
        let tm1 = new NumTime(11);
        let delta1 = new NumTimeDelta(2);
        let tm2 = tm1.addDelta(delta1);
        let result = tm2.valueOf();
        self.assertEquals(expected, result);
    }

    hasSubDeltaFunction(self) {
        let expected = 9;
        let tm1 = new NumTime(11);
        let delta1 = new NumTimeDelta(2);
        let tm2 = tm1.subDelta(delta1);
        let result = tm2.valueOf();
        self.assertEquals(expected, result);
    }

    eqReturnsTrue(self) {
        let tm1 = new NumTime(11);
        let tm2 = new NumTime(11);
        self.assertTrue(tm1.eq(tm2));
    }

    eqReturnsFalse(self) {
        let tm1 = new NumTime(11);
        let tm2 = new NumTime(17);
        self.assertFalse(tm1.eq(tm2));
    }

    gtReturnsTrue(self) {
        let tm1 = new NumTime(17);
        let tm2 = new NumTime(11);
        self.assertTrue(tm1.gt(tm2));
    }

    gtReturnsFalse(self) {
        let tm1 = new NumTime(11);
        let tm2 = new NumTime(17);
        self.assertFalse(tm1.gt(tm2));
    }

    gteReturnsTrue1(self) {
        let tm1 = new NumTime(17);
        let tm2 = new NumTime(11);
        self.assertTrue(tm1.gte(tm2));
    }

    gteReturnsTrue2(self) {
        let tm1 = new NumTime(17);
        let tm2 = new NumTime(17);
        self.assertTrue(tm1.gte(tm2));
    }

    gteReturnsFalse(self) {
        let tm1 = new NumTime(11);
        let tm2 = new NumTime(17);
        self.assertFalse(tm1.gte(tm2));
    }

    ltReturnsTrue(self) {
        let tm1 = new NumTime(11);
        let tm2 = new NumTime(17);
        self.assertTrue(tm1.lt(tm2));
    }

    ltReturnsFalse(self) {
        let tm1 = new NumTime(17);
        let tm2 = new NumTime(11);
        self.assertFalse(tm1.lt(tm2));
    }

    lteReturnsTrue1(self) {
        let tm1 = new NumTime(11);
        let tm2 = new NumTime(17);
        self.assertTrue(tm1.lte(tm2));
    }

    lteReturnsTrue2(self) {
        let tm1 = new NumTime(17);
        let tm2 = new NumTime(17);
        self.assertTrue(tm1.lte(tm2));
    }

    lteReturnsFalse(self) {
        let tm1 = new NumTime(17);
        let tm2 = new NumTime(11);
        self.assertFalse(tm1.lte(tm2));
    }
}


new NumTimeTest().runTests();
