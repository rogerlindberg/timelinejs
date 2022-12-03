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


class ColorTest extends TestCase {

    constructor () {
        super();
        this.name = "Test of Color utility Functions";
        this.testList = [
            this.colorArrayToRgbString,
            this.colorStringToRgbTuple,
            this.canDarkenColor,
            this.darkenColorFactorMustNotBeTooSmall,
            this.darkenColorFactorMustNotBeTooLarge,
            this.darkenColorHasMaximum,
            this.canLightenColor,
            this.lightenColorFactorMustNotBeTooSmall,
            this.lightenColorFactorMustNotBeTooLarge,
            this.lightenColorZeroResultReturnsOnes,
            this.lightenColorHasMaximum,
            this.canConvertColorRgbToHex,
            this.canConvertHexColorToRgb,
        ]
    }

    colorArrayToRgbString(self) {
        let expected = "rgb(127,128,129)"
        let result = tupleToRgb([127, 128, 129]);
        self.assertEquals(expected, result);
    }

    colorStringToRgbTuple(self) {
        self.assertEquals([127, 128, 129], rgbToTuple("rgb(127,128,129)"));
        self.assertEquals([127, 128, 129], rgbToTuple("127,128,129"));
    }

    canDarkenColor(self) {
        let expected = [89, 90, 90];
        let result = darkenColor([127, 128, 129]);
        self.assertEquals(expected, result);
    }

    darkenColorFactorMustNotBeTooSmall(self) {
        let expected = [127, 128, 129];
        let result = darkenColor([127, 128, 129], -1);
        self.assertEquals(expected, result);
    }

    darkenColorFactorMustNotBeTooLarge(self) {
        let expected = [127, 128, 129];
        let result = darkenColor([127, 128, 129], 2);
        self.assertEquals(expected, result);
    }

    darkenColorHasMaximum(self) {
        let expected = [255, 255, 255];
        let result = darkenColor([300,400, 500], 0.9);
        self.assertEquals(expected, result);
    }

    canLightenColor(self) {
        let expected = [191, 192, 194];
        let result = lightenColor([127, 128, 129]);
        self.assertEquals(expected, result);
    }

    lightenColorFactorMustNotBeTooSmall(self) {
        let expected = [127, 128, 129];
        let result = lightenColor([127, 128, 129], -1);
        self.assertEquals(expected, result);
    }

    lightenColorFactorMustNotBeTooLarge(self) {
        let expected = [127, 128, 129];
        let result = lightenColor([127, 128, 129], 256);
        self.assertEquals(expected, result);
    }

    lightenColorZeroResultReturnsOnes(self) {
        let expected = [1, 1, 1];
        let result = lightenColor([0, 0, 0]);
        self.assertEquals(expected, result);
    }

    lightenColorHasMaximum(self) {
        let expected = [255, 255, 255];
        let result = lightenColor([300,400, 500], 2);
        self.assertEquals(expected, result);
    }

    canConvertColorRgbToHex(self) {
        self.assertEquals("#010101", rgbToHexString("1,1,1"))
        self.assertEquals("#010101", rgbToHexString("rgb(1,1,1)"))
        self.assertEquals("#ffffff", rgbToHexString("255,255,255"))
        self.assertEquals("#ffffff", rgbToHexString("rgb(255,255,255)"))
    }

    canConvertHexColorToRgb(self) {
        self.assertEquals("1,1,1", hexToRgbString("#010101"))
        self.assertEquals("255,255,255", hexToRgbString("#ffffff"))
    }
}


new ColorTest().runTests();
