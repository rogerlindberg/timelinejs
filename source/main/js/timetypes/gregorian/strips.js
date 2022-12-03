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


class GregorianStrip {

	_minor;

	constructor (minor=false) {
		this._minor = minor
	}

	get minor() {
		return this._minor;
	}

	start(period) {
		throw Error('start(period) not implemented!');
	}

	next(time) {
		throw Error('next(time) not implemented!');
	}

	label(time) {
		throw Error('label(time) not implemented!');
	}

	getStripLocations(period, exclude = []) {
		let locations = [];
		let t = this.start(period)
		while (t < period.end) {
			if (!exclude.includes(t)) {
				locations.push(t);
			}
			t = this.next(t);
		}
		return locations;
	}

}

class GregorianCenturyStrip extends GregorianStrip {

	constructor (minor=false) {
		super(minor);
	}

    start(period) {
		let julianDay = period.start.julianDay;
		let ymd = julianDayToGregorianYmd(julianDay);
		julianDay = gregorianYmdToJulianDay(this.#centuryStartYear(ymd.year), 1, 1);
		return new GregorianTime(julianDay);

	}

	next(time) {
		let julianDay = time.julianDay;
		let ymd = julianDayToGregorianYmd(julianDay);
		julianDay = gregorianYmdToJulianDay(this.#nextCenturyStartYear(ymd.year), 1, 1);
		return new GregorianTime(julianDay);
	}

	label(time) {
		if (this.minor) {
			return "";
		}
        else {
			let ymd = julianDayToGregorianYmd(time.julianDay);
			let centuryNumber = this.#centuryNumber(this.#centuryStartYear(ymd.year));
			return `${centuryNumber}`
		}
	}

	#nextCenturyStartYear(startYear) {
		return startYear + this.#centuryYearLen(startYear);
	}

	#centuryYearLen(startYear) {
		if (startYear >= -98 && startYear <= 1) {
			return 99;
		}
		else {
			return 100;
		}
	}

	#centuryStartYear(year) {
		if (year > 99) {
			return year - year % 100;
		}
		else if (year >= 1) {
			return 1;
		}
		else if (year >= -98) {
			return -98;
		}
		else{ // year < -98
			return -this.#centuryStartYear(-year + 1) - 98;
		}

	}

	#centuryNumber(centuryStartYear) {
		if (centuryStartYear > 99) {
			return centuryStartYear;
		}
		else if (centuryStartYear >= -98) {
			return 0;
		}
		else {	// century_start_year < -98:
			return this.#centuryNumber(-centuryStartYear - 98);
		}
	}

}

class GregorianDecadeStrip extends GregorianStrip {

	constructor (minor=false) {
		super(minor)
	}

    start(period) {
		let julianDay = period.start.julianDay;
		let ymd = julianDayToGregorianYmd(julianDay);
		julianDay = gregorianYmdToJulianDay(this.#decadeStartYear(ymd.year), 1, 1);
		return new GregorianTime(julianDay);
	}

	next(time) {
		let julianDay = time.julianDay;
		let ymd = julianDayToGregorianYmd(julianDay);
		let year = ymd.year + this.#decadeYearLen(ymd.year);
		julianDay = gregorianYmdToJulianDay(year, 1, 1);
		return new GregorianTime(julianDay);
	}

	label(time) {
		let ymd = julianDayToGregorianYmd(time.julianDay);
		let decadeNumber = this.#decadeNumber(this.#decadeStartYear(ymd.year));
		return `${decadeNumber}`
	}

	#decadeStartYear(year) {
		if (year > 9) {
			return year - year % 10;
		}
		else if (year >= 1) {
			return 1;
		}
		else if (year >= -8) {
			return -8;
		}
		else {  // year < -8
			return -this.#decadeStartYear(-year + 1) - 8;
		}
	}

	#decadeYearLen(startYear) {
		if (this.#decadeNumber(startYear) == 0) {
			return 9;
		}
		else  {
			return 10;
		}
	}

	#decadeNumber(startYear) {
		if (startYear > 9) {
			return startYear;
		}
		else if (startYear >= -8) {
			return 0;
		}
		else {  //start_year < -8
			return this.#decadeNumber(-startYear - 8);
		}
	}
}

class GregorianYearStrip extends GregorianStrip {

	constructor (minor=false) {
		super(minor);
	}

    start(period) {
		let julianDay = period.start.julianDay;
		let ymd = julianDayToGregorianYmd(julianDay);
		julianDay = gregorianYmdToJulianDay(ymd.year, 1, 1);
		return new GregorianTime(julianDay);
	}

	next(time) {
        return time.addDelta(GregorianTimeDelta.deltaFromDays(time.daysInYear()));
	}

	label(time) {
		let ymd = julianDayToGregorianYmd(time.julianDay);
		return `${ymd.year}`
	}
}

class GregorianMonthStrip extends GregorianStrip {

	constructor (minor=false) {
		super(minor)
	}

	start(period) {
		let julianDay = period.start.julianDay;
		let ymd = julianDayToGregorianYmd(julianDay);
		julianDay = gregorianYmdToJulianDay(ymd.year, ymd.month, 1);
		return new GregorianTime(julianDay);
	}

	next(time) {
        return time.addDelta(GregorianTimeDelta.deltaFromDays(time.daysInMonth()));
	}

	label(time) {
		let ymd = julianDayToGregorianYmd(time.julianDay);
		if (this.minor) {
			return `${monthToShortName(ymd.month)}`
		} else {
			return `${monthToName(ymd.month)} ${ymd.year}`
		}
	}
}

class GregorianWeekStrip extends GregorianStrip {

	constructor (minor=false) {
		super(minor);
	}

	start(period) {
		let daysToSubtract = period.start.dayOfWeek;
        return new repo.time(period.start.julianDay - daysToSubtract, 0);
	}

	next(time) {
        return time.addDelta(repo.timeDelta.deltaFromDays(7));
	}

	label(time) {
		return `Week ${time.weekNumber}`;
	}
}

class GregorianDayStrip extends GregorianStrip {

	constructor (minor=false) {
		super(minor);
	}

	start(period) {
		let julianDay = period.start.julianDay;
		let ymd = julianDayToGregorianYmd(julianDay);
		julianDay = gregorianYmdToJulianDay(ymd.year, ymd.month, ymd.day);
		return new GregorianTime(julianDay);
	}

	next(time) {
		return time.addDelta(GregorianTimeDelta.deltaFromDays(1));
	}

	label(time) {
		let ymd = julianDayToGregorianYmd(time.julianDay);
		if (this.minor) {
			return `${ymd.day}`;
		} else {
			return `${ymd.day} ${monthToName(ymd.month)} ${ymd.year}`
		}
	}
}

class GregorianHourStrip extends GregorianStrip {

	constructor (minor=false) {
		super(minor);
	}

	start(period) {
		let julianDay = period.start.julianDay;
		return new GregorianTime(julianDay);
	}

	next(time) {
		return time.addDelta(GregorianTimeDelta.deltaFromHours(1));
	}

	label(time) {
		let hms = time.timeOfDay();
		return `${hms.hours}`;
	}
}

function monthToName(month) {
	return {
		1: "January",
		2: "February",
		3: "Mars",
		4: "April",
		5: "May",
		6: "June",
		7: "July",
		8: "August",
		9: "September",
		10: "October",
		11: "November",
		12: "December",
	}[month];
}

function monthToShortName(month) {
	return {
		1: "Jan",
		2: "Feb",
		3: "Mar",
		4: "Apr",
		5: "May",
		6: "Jun",
		7: "Jul",
		8: "Aug",
		9: "Sep",
		10: "Oct",
		11: "Nov",
		12: "Dec",
	}[month];
}

