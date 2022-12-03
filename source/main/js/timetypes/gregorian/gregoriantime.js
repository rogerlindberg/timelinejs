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


let SECONDS_IN_DAY = 24 * 60 * 60;

class GregorianTime extends Time {

  MIN_JULIAN_DAY = -1000000000000000000000000000000000000000000000000;
  _julianDay;
  _seconds;
  _deltaClass = GregorianTimeDelta;

  constructor(julianDay, seconds = 0) {
    let secondDays = Math.trunc(seconds / SECONDS_IN_DAY);
    julianDay += secondDays;
    seconds = seconds % SECONDS_IN_DAY;
    if (seconds < 0) {
      julianDay -= 1;
      seconds += SECONDS_IN_DAY;
    }
    super(julianDay * SECONDS_IN_DAY + seconds);
    if (seconds < 0 || seconds > SECONDS_IN_DAY) {
      throw Error(`seconds must be >= 0 and <= 24*60*60. It is ${seconds}`);
    }
    if (julianDay < this.MIN_JULIAN_DAY) {
      throw Error(`julian_day must be >= ${this.MIN_JULIAN_DAY}`);
    }
    this._julianDay = julianDay;
    this._seconds = seconds;
  }

  get julianDay() { return this._julianDay; }
  get seconds() { return this._seconds; }

  eq(other) {
    return this._julianDay == other.julianDay && this._seconds == other.seconds;
  }

  ne(other) {
    return !this.eq(other);
  }

  gt(other) {
    let a = this.julianDay > other.julianDay;
    let b = this.julianDay == other.julianDay;
    let c = this.seconds > other.seconds;
    return a || (b && c);
  }

  gte(other) {
    return (this._julianDay == other.julianDay && this._seconds == other.seconds) ||
      this.gt(other);
  }

  lt(other) {
    return !this.gte(other);
  }

  lte(other) {
    return !this.gt(other);
  }

  valueOf() {
    return this._tm;
  }

  toString() {
    let ymd = julianDayToGregorianYmd(this._julianDay);
    return formatDate(ymd, this._seconds);
  }


  add(other) {
    return new GregorianTime(this._julianDay + other.julianDay, this._seconds + other.seconds);
  }

  sub(other) {
    let daysDiff = this.julianDay - other.julianDay;
    let secondsDiff = this.seconds - other.seconds;
    return this._deltaClass.deltaFromDaysAndSeconds(daysDiff, secondsDiff)
  }

  addDelta(delta) {
    return new GregorianTime(this._julianDay, this._seconds + delta.delta);
  }

  subDelta(delta) {
    return new GregorianTime(this._julianDay, this._seconds - delta.delta);
  }

  timeOfDay() {
    let hours = Math.trunc(this._seconds / 3600);
    let minutes = Math.trunc((this._seconds % 3600) / 60);
    let seconds = this._seconds % 60;
    return { "hours": hours, "minutes": minutes, "seconds": seconds };
  }

  get dayOfWeek() {
    return this._julianDay % 7
  }

  daysInMonth() {
    let ymd = julianDayToGregorianYmd(this._julianDay);
    if ([4, 6, 9, 11].includes(ymd.month)) {
      return 30
    }
    if ([1, 3, 5, 7, 8, 10, 12].includes(ymd.month)) {
      return 31
    }
    if (this.yearIsLeapYear(ymd.year)) {
      return 29
    }
    return 28;
  }

  daysInYear() {
    let ymd = julianDayToGregorianYmd(this._julianDay);
    if (this.yearIsLeapYear(ymd.year)) {
      return 366;
    } else {
      return 365;
    }
  }

  yearIsLeapYear(year) {
    return year % 4 == 0 && (year % 400 == 0 || (year % 100 != 0));
  }

  get weekNumber() {
    let year = julianDayToGregorianYmd(this._julianDay).year;
    let julianDays = -1;
    while (julianDays < 0) {
      let jan4Julian = gregorianYmdToJulianDay(year, 1, 4);
      let mondayWeek1 = jan4Julian - jan4Julian % 7;
      julianDays = this.julianDay - mondayWeek1;
      year += 1;
    }
    return Math.trunc(julianDays / 7) + 1;
  }
}

function gregorianDatetimeToJulianDayAndSeconds(dt) {
  let julianDay = gregorianYmdToJulianDay(dt.year, dt.month, dt.day)
  let seconds = dt.hour * 60 * 60 + dt.minute * 60 + dt.second
  return { "julianDay": julianDay, "seconds": seconds }
}

function gregorianYmdToJulianDay(year, month, day) {
  /*
  This algorithm is described here:

    * http://www.tondering.dk/claus/cal/julperiod.php#formula
    * http://en.wikipedia.org/wiki/Julian_day#Converting_Julian_or_Gregorian_calendar_date_to_Julian_Day_Number

    Integer division works differently in C and in Python for negative numbers.
    C truncates towards 0 and Python truncates towards negative infinity:
    http://python-history.blogspot.se/2010/08/why-pythons-integer-division-floors.html

    The above sources don't state which to be used. If we can prove that
    division-expressions are always positive, we can be sure this algorithm
    works the same in C and in Python.

    We must prove that:

    1) y >= 0
    2) ((153 * m) + 2) >= 0

    Let's prove 1):

    y = year + 4800 - a
      = year + 4800 - ((14 - month) // 12)

    year >= -4713 (gives a julian day of 0)

    so

    year + 4800 >= -4713 + 4800 = 87

    The expression ((14 - month) // 12) varies between 0 and 1 when month
    varies between 1 and 12. Therefore y >= 87 - 1 = 86, and 1) is proved.

    Let's prove 2):

    m = month + (12 * a) - 3
      = month + (12 * ((14 - month) // 12)) - 3

    1 <= month <= 12

    m(1)  = 1  + (12 * ((14 - 1)  // 12)) - 3 = 1  + (12 * 1) - 3 = 10
    m(2)  = 2  + (12 * ((14 - 2)  // 12)) - 3 = 2  + (12 * 1) - 3 = 11
    m(3)  = 3  + (12 * ((14 - 3)  // 12)) - 3 = 3  + (12 * 0) - 3 = 0
    m(4)  = 4  + (12 * ((14 - 4)  // 12)) - 3 = 4  + (12 * 0) - 3 = 1
    m(5)  = 5  + (12 * ((14 - 5)  // 12)) - 3 = 5  + (12 * 0) - 3 = 2
    m(6)  = 6  + (12 * ((14 - 6)  // 12)) - 3 = 6  + (12 * 0) - 3 = 3
    m(7)  = 7  + (12 * ((14 - 7)  // 12)) - 3 = 7  + (12 * 0) - 3 = 4
    m(8)  = 8  + (12 * ((14 - 8)  // 12)) - 3 = 8  + (12 * 0) - 3 = 5
    m(9)  = 9  + (12 * ((14 - 9)  // 12)) - 3 = 9  + (12 * 0) - 3 = 6
    m(10) = 10 + (12 * ((14 - 10) // 12)) - 3 = 10 + (12 * 0) - 3 = 7
    m(11) = 11 + (12 * ((14 - 11) // 12)) - 3 = 11 + (12 * 0) - 3 = 8
    m(12) = 12 + (12 * ((14 - 12) // 12)) - 3 = 12 + (12 * 0) - 3 = 9

    So, m is always > 0. Which also makes the expression ((153 * m) + 2) > 0,
    and 2) is proved.
  */
  let a = Math.trunc((14 - month) / 12);
  let y = year + 4800 - a
  let m = month + (12 * a) - 3
  let julianDay = (day
    + Math.trunc(((153 * m) + 2) / 5)
    + (y * 365)
    + Math.trunc(y / 4)
    - Math.trunc(y / 100)
    + Math.trunc(y / 400)
    - 32045)
  if (julianDay < GregorianTime.MIN_JULIAN_DAY) {
    throw Error(`gregorian_ymd_to_julian_day only works for julian days >= ${GregorianTime.MIN_JULIAN_DAY}, but was ${julianDay}`);
  }
  return julianDay
}

function julianDayToGregorianYmd(julianDay) {
  /*     This algorithm is described here:

      * http://www.tondering.dk/claus/cal/julperiod.php#formula

      Integer division works differently in C and in Python for negative numbers.
      C truncates towards 0 and Python truncates towards negative infinity:
      http://python-history.blogspot.se/2010/08/why-pythons-integer-division-floors.html

      The above source don't state which to be used. If we can prove that
      division-expressions are always positive, we can be sure this algorithm
      works the same in C and in Python.

      We must prove that:

      1) m             >= 0
      2) ((5 * e) + 2) >= 0  =>  e >= 0
      3) (1461 * d)    >= 0  =>  d >= 0
      4) ((4 * c) + 3) >= 0  =>  c >= 0
      5) (b * 146097)  >= 0  =>  b >= 0
      6) ((4 * a) + 3) >= 0  =>  a >= 0

      Let's work from the top:

      julian_day >= 0                   =>

      a >= 0 + 32044
         = 32044                        =>

      This proves 6).

      b >= ((4 * 32044) + 3) // 146097
         = 0

      This proves 5).

      Let's look at c:

      c = a - ((b * 146097) // 4)
        = a - (((((4 * a) + 3) // 146097) * 146097) // 4)

      For c to be >= 0, then

      (((((4 * a) + 3) // 146097) * 146097) // 4) <= a

      Let's look at this component: ((((4 * a) + 3) // 146097) * 146097)

      This expression can never be larger than (4 * a) + 3. That gives this:

      ((4 * a) + 3) // 4 <= a, which holds.

      This proves 4).

      Now, let's look at d:

      d = ((4 * c) + 3) // 1461

      If c is >= 0, then d is also >= 0.

      This proves 3).

      Let's look at e:

      e = c - ((1461 * d) // 4)
        = c - ((1461 * (((4 * c) + 3) // 1461)) // 4)

      The same resoning as above can be used to conclude that e >= 0.

      This proves 2).

      Now, let's look at m:

      m = ((5 * e) + 2) // 153

      If e >= 0, then m is also >= 0.

      This proves 1).
   */
  if (julianDay < GregorianTime.MIN_JULIAN_DAY) {
    throw Error(`julianDayToGregorianYmd only works for julian days >= ${GregorianTime.MIN_JULIAN_DAY}, but was ${julianDay}`);
  }
  let a = julianDay + 32044
  let b = Math.trunc(((4 * a) + 3) / 146097)
  let c = a - Math.trunc((b * 146097) / 4)
  let d = Math.trunc(((4 * c) + 3) / 1461)
  let e = c - Math.trunc((1461 * d) / 4)
  let m = Math.trunc(((5 * e) + 2) / 153)
  let day = e - Math.trunc(((153 * m) + 2) / 5) + 1
  let month = m + 3 - (12 * Math.trunc(m / 10))
  let year = (b * 100) + d - 4800 + Math.trunc(m / 10)
  return { "year": year, "month": month, "day": day }
}
