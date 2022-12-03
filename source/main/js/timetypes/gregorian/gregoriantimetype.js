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


class GregorianTimeType {

	static get name() {return "gregoriantime";}

	static getLabel(name) {
		return {
			'goto-zero': "Go to Today",
			'goto-time': "Go to Date",
			'time-label': "Date:",
			'time-input': "date",
		}[name];
	}

	static now() {
		var today = new Date();
		var strTime = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()} 00:00:00`;
		return repo.timeType.strToTime(strTime)
	}

	static strToTime(strTime) {
		try {
			let negativeYear = false
			let hms = "00:00:00"
			let ymdhmsparts = strTime.split(' ')
			let ymd = ymdhmsparts[0].trim();
			if (ymdhmsparts.length == 2) {
				hms = ymdhmsparts[1].trim();
				if (hms.length == 0) {
					hms = "00:00:00";
				}
			}
			if (strTime.startsWith('-')) {
				negativeYear = true
				ymd = ymd.substring(1);
			}
			const ymdParts = ymd.split("-")
			const hmsParts = hms.split(":")
			if (ymdParts.length != 3 || hmsParts.length != 3) {
				throw Error("");
			}
			if (isNotNumeric(ymdParts[0]) ||
				isNotNumeric(ymdParts[1]) ||
				isNotNumeric(ymdParts[2]) ||
				isNotNumeric(hmsParts[0]) ||
				isNotNumeric(hmsParts[1]) ||
				isNotNumeric(hmsParts[2]) ) {
				throw Error("");
			}
			let tm = gregorianDatetimeToJulianDayAndSeconds(
				{
					"year": negativeYear ? -parseInt(ymdParts[0]) : parseInt(ymdParts[0]),
					"month": parseInt(ymdParts[1]),
					"day": parseInt(ymdParts[2]),
					"hour": parseInt(hmsParts[0]),
					"minute": parseInt(hmsParts[1]),
					"second": parseInt(hmsParts[2])
				}
			);
			return new GregorianTime(tm.julianDay, tm.seconds)
		}
		catch (error) {
			console.log(error);
			throw Error(`String ${strTime} is not a Gregorian date`);
		}
	}

	static timeToStr(tm) {
		return new tm.time.toString();
	}

	static isValid(strTime) {
		try {
			GregorianTimeType.strToTime(strTime);
			return true;
		}
		catch {
			return false;
		}
	}

	static chooseStrips(period) {
		if (period.delta.days > 18000) {
			return {
				major: new GregorianCenturyStrip(),
				minor: new GregorianDecadeStrip(true)
			}
		}
		else if (period.delta.days > 2000) {
			return {
				major: new GregorianDecadeStrip(),
				minor: new GregorianYearStrip(true)
			}
		}
		else if (period.delta.days > 45) {
			return {
				major: new GregorianYearStrip(),
				minor: new GregorianMonthStrip(true)
			}
		}
		else if(period.delta.days > 21) {
			return {
				major: new GregorianMonthStrip(),
				minor: new GregorianDayStrip(true),
			}
		}
		else if (period.delta.days > 2) {
			return {
				major: new GregorianWeekStrip(),
				minor: new GregorianDayStrip(true)
			}
		} else {
			return {
				major: new GregorianDayStrip(),
				minor: new GregorianHourStrip(true)
			}
		}
	}
}
