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


class ArraysTest extends TestCase {

    _numElements = undefined;

    constructor () {
        super();
        this.name = "Test of Arrays utility Functions";
        this.testList = [
            this.countAllElements,
            this.countSelectedElements,
            this.deleteElement,
            this.extractOneElement,
            this.extractEvenElements,
            this.transformElementsToSquares,
            this.hasElementTrue,
            this.hasElementFalse,
        ]
    }

    setUp() {
        this._numElements = [1, 2, 3, 4, 5, 6, 7];
    }

    countAllElements(self) {
        let result =self._numElements.count(e => true);
        self.assertEquals(7, result);
    }

    countSelectedElements(self) {
        let result = self._numElements.count(e => e % 2 == 0);
        self.assertEquals(3, result);
    }

    deleteElement(self) {
        let result = self._numElements.deleteItem(5);
        self.assertEquals(true, result);
        self.assertEquals([1, 2, 3, 4, 6, 7], self._numElements);
    }

    extractOneElement(self) {
        let result = self._numElements.extract(e => e == 5);
        self.assertEquals([5], result);
    }

    extractEvenElements(self) {
        let result = self._numElements.extract(e => e % 2 == 0);
        self.assertEquals([2, 4, 6], result);
    }

    transformElementsToSquares(self) {
        let result = self._numElements.transform(e => e * e);
        self.assertEquals([1, 4, 9, 16, 25, 36, 49], result);
    }

    hasElementTrue(self) {
        self.assertTrue(self._numElements.hasItem(5));
    }

    hasElementFalse(self) {
        self.assertFalse(self._numElements.hasItem(11));
    }
}


new ArraysTest().runTests();
