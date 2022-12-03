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


class StringsTest extends TestCase {

    constructor () {
        super();
        this.name = "Test of String utility Functions";
        this.testList = [
            this.stringCanBeprefixedWithZeros,
            this.emptyStringCanBeprefixedWithZeros,
            this.canConvertDateAndSecondsToString,
            this.staticDynamicClassList,
            this.staticDynamicClassDict,
            this.staticDynamicClassDictGvar,
        ]
    }

    stringCanBeprefixedWithZeros(self) {
        let expected = "02"
        let result = zeroPrefixString("2", 2);
        self.assertEquals(expected, result);
    }

    emptyStringCanBeprefixedWithZeros(self) {
        let expected = "00"
        let result = zeroPrefixString("", 2);
        self.assertEquals(expected, result);
    }

    canConvertDateAndSecondsToString(self) {
        let ymd = {"year": 2021, "month": 10, "day": 11};
        let seconds = 12345;
        let expected = "2021-10-11 03:25:45";
        let result = formatDate(ymd, seconds);
        self.assertEquals(expected, result);
    }

    staticDynamicClassList(self) {
        class T {
            static _list = [1, 2];

            static get list() {
                return T._list;
            }

            constructor() {
                T._list = [6, 7];
                // This line is needed to define the list property on the object.
                this.list = T.list;
            }
        }

        self.assertEquals([1, 2], T.list);
        let t = new T();
        self.assertEquals([6, 7], t.list);
        // The static object has been changed!
        self.assertEquals([6, 7], T.list);
    }

    staticDynamicClassDict(self) {
        class T {
            static _dict = {One: "1", Two: "2"};

            static get dict() {
                return T._dict;
            }

            static get two() {
                return T._dict.Two;
            }

            constructor() {
                T._dict = {One: "6", Two: "7"};
                // These lines is needed to define the property on the object.
                this.dict = T.dict;
                this.two = T.two;
            }
        }

        self.assertEquals({One: "1", Two: "2"}, T.dict);
        self.assertEquals("2", T.two);
        let t = new T();
        self.assertEquals({One: "6", Two: "7"}, t.dict);
        self.assertEquals("7", t.two);
        // The static object has been changed!
        self.assertEquals("7", T.two);
    }


    staticDynamicClassDictGvar(self) {
        class T {
            static _dict = {One: "1", Two: "2"};

            static get dict() {
                return T._dict;
            }

            static get two() {
                return T._dict.Two;
            }

            static set two(value) {
                T._dict.Two = value;
            }

            constructor() {
                T._dict = {One: "6", Two: "7"};
                // These lines is needed to define the property on the object.
                this.dict = T.dict;
                this.two = T.two;
            }
        }

        let tt = T;

        self.assertEquals({One: "1", Two: "2"}, tt.dict);
        self.assertEquals("2", tt.two);
        tt.two = "9";
        self.assertEquals("9", tt.two);
        // The dynamic object changes the internal dict
        let t = new T();
        // Data retrieved with the global var assigned to the Static class
        // shows the data as set by the dynamic object.
        self.assertEquals({One: "6", Two: "7"}, tt.dict);
        self.assertEquals("7", tt.two);
        // The data can also be manipulated through the global var.
        tt.two = "9";
        self.assertEquals("9", tt.two);
    }

}


new StringsTest().runTests();
