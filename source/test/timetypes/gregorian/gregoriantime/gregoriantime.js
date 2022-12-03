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


class GregorianTimeTest extends TestCase {

    constructor () {
        super();
        this.name = "Test of Gregorian Time Class";
        this.testList = [
            this.hasJuianDayProperty,
            this.hasJuianSecondsProperty,
            this.hasEqualsFunction,
            this.hasEqualsFunction_secondsCanBeMoreThanOneDay,
            this.hasNotEqualsFunction,
            this.hasGreaterThenFunction,
            this.hasGreaterOrEqualFunction,
            this.hasLessThenFunction,
            this.hasLessOrEqualFunction,
            this.hasValueOfFunction,
            this.hasToStringFunction,
            this.hasAddFunction,
            this.hasSubFunction,
            this.hasAddDeltaFunction,
            this.hasSubDeltaFunction,
            this.hasTimeOfDayFunction,
            this.hasDayOfWeekProperty,
            this.hasDaysInMonthFunction,
            this.hasDaysInYearFunction,
            this.hasYearIsLeapYearFunction,
            this.hasWeekNumerProperty,
            this.helperGregorianDatetimeToJulianDayAndSecondsFunction,
            this.helperGregorianYmdToJulianDay,
            this.helperJulianDayToGregorianYmd,
        ]
    }

    hasJuianDayProperty(self) {
        let tm = new GregorianTime(2459499, 17);
        self.assertEquals(2459499, tm.julianDay);
    }

    hasJuianSecondsProperty(self) {
        let tm = new GregorianTime(2459499, 17);
        self.assertEquals(17, tm.seconds);
    }

    hasEqualsFunction(self) {
        let tm1 = new GregorianTime(2459499, 17);
        let tm2 = new GregorianTime(2459499, 17);
        self.assertTrue(tm1.eq(tm2));
    }

    hasEqualsFunction_secondsCanBeMoreThanOneDay(self) {
        let tm1 = new GregorianTime(2459499, 17);
        let tm2 = new GregorianTime(2459498, 17 + SECONDS_IN_DAY);
        self.assertTrue(tm1.eq(tm2) && tm2.seconds == 17);
    }

    hasNotEqualsFunction(self) {
        let tm1 = new GregorianTime(2459499, 17);
        let tm2 = new GregorianTime(2459499, 18);
        self.assertTrue(tm1.ne(tm2));
    }

    hasGreaterThenFunction(self) {
        let tm1 = new GregorianTime(2459499, 18);
        let tm2 = new GregorianTime(2459499, 17);
        let tm3 = new GregorianTime(2459500, 0);
        self.assertTrue(tm1.gt(tm2) && tm3.gt(tm1));
    }

    hasGreaterOrEqualFunction(self) {
        let tm1 = new GregorianTime(2459499, 18);
        let tm2 = new GregorianTime(2459499, 17);
        let tm3 = new GregorianTime(2459599, 18);
        self.assertTrue(tm1.gte(tm2) && tm3.gte(tm1));
    }

    hasLessThenFunction(self) {
        let tm1 = new GregorianTime(2459499, 18);
        let tm2 = new GregorianTime(2459499, 17);
        let tm3 = new GregorianTime(2459500, 0);
        self.assertTrue(tm2.lt(tm1) && tm1.lt(tm3));
    }

    hasLessOrEqualFunction(self) {
        let tm1 = new GregorianTime(2459499, 18);
        let tm2 = new GregorianTime(2459499, 17);
        let tm3 = new GregorianTime(2459599, 18);
        self.assertTrue(tm2.lte(tm1) && tm1.lte(tm3));
    }

    hasValueOfFunction(self) {
        let tm = new GregorianTime(2459499, 18);
        self.assertEquals(SECONDS_IN_DAY * 2459499 + 18 + 1 ,  tm + 1);
    }

    hasToStringFunction(self) {
        let tm = new GregorianTime(2459499, 18);
        self.assertEquals("2021-10-11 00:00:18", tm.toString());
    }

    hasAddFunction(self) {
        let tm1 = new GregorianTime(100, 18);
        let tm2 = new GregorianTime(101, 18);
        self.assertEquals(new GregorianTime(201, 36), tm1.add(tm2));
    }

    hasSubFunction(self) {
        let tm1 = new GregorianTime(101, 18);
        let tm2 = new GregorianTime(100, 18);
        self.assertEquals(new GregorianTimeDelta(SECONDS_IN_DAY), tm1.sub(tm2));
    }

    hasAddDeltaFunction(self) {
        let tm = new GregorianTime(100, 18);
        let delta = new GregorianTimeDelta(18);
        self.assertEquals(new GregorianTime(100, 36), tm.addDelta(delta));
    }

    hasSubDeltaFunction(self) {
        let tm = new GregorianTime(100, 18);
        let delta = new GregorianTimeDelta(18);
        self.assertEquals(new GregorianTime(100, 0), tm.subDelta(delta));
    }

    hasTimeOfDayFunction(self) {
        let result = new GregorianTime(0, 6893).timeOfDay();
        self.assertTrue(result.hours == 1 && result.minutes == 54 && result.seconds == 53);
    }

    hasDayOfWeekProperty(self) {
        let tm = new GregorianTime(2459556, 0); // 2021-12-07 == Tuesday
        self.assertEquals(1, tm.dayOfWeek);
    }

    hasDaysInMonthFunction(self) {
        let tm = new GregorianTime(2459556, 0); // 2021-12-07
        self.assertEquals(31, tm.daysInMonth());
    }

    hasDaysInYearFunction(self) {
        let tm = new GregorianTime(2459556, 0); // 2021-12-07
        self.assertEquals(365, tm.daysInYear());
    }

    hasYearIsLeapYearFunction(self) {
        let tm = new GregorianTime(2459556, 0); // 2021-12-07
        self.assertFalse(tm.yearIsLeapYear());
    }

    hasWeekNumerProperty(self) {
        let tm = new GregorianTime(2459556, 0); // 2021-12-07
        self.assertEquals(49, tm.weekNumber);
    }

    helperGregorianDatetimeToJulianDayAndSecondsFunction(self) {
        let dt = {"year": 2021, "month": 12, "day": 7, "hour": 0, "minute": 0, "second": 0}
        let result = gregorianDatetimeToJulianDayAndSeconds(dt);
        self.assertEquals(2459556, result.julianDay);
    }

    helperGregorianYmdToJulianDay(self) {
        let result = gregorianYmdToJulianDay(2021, 12, 7);
        self.assertEquals(2459556, result);
    }

    helperJulianDayToGregorianYmd(self) {
        let result = julianDayToGregorianYmd(2459556);
        self.assertTrue(result.year == 2021 && result.month == 12 && result.day == 7);
    }
}


new GregorianTimeTest().runTests();
