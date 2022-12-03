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


class NumTimeType {

	static get name() {return "numtime";}

	static getLabel(name) {
		return {
			'goto-zero': "Go to Zero",
			'goto-time': "Go to Time",
			'time-label': "Time:",
			'time-input': "number",
		}[name];
	}
	static now() {
		return repo.timeType.strToTime("0")
	}

	static strToTime(strTime) {
		if (this.isValid(strTime)) {
			return new NumTime(parseInt(strTime.trim()));
		} else {
			throw Error(`String ${strTime} is not a number`);
		}
	}

	static timeToStr(tm) {
		return new tm.time.toString();
	}

	static isValid(strTime) {
		return isNumeric(strTime)
	}

	static chooseStrips(period) {
		let size = period.size;
		let strip = 1
		while (size > 60) {
			size = size / 60;
			strip = strip * 10;
		}
		return { major: new NumTimeStrip(strip * 10), minor: new NumTimeStrip(strip) }
	}

}
