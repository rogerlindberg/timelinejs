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


class NumTimeStrip {

	_minor;

	constructor (size, minor=false) {
		this.size = size;
		this._minor = minor
	}

    start(period) {
		let start = period.start;
		while (start % this.size != 0 && start <= period.end) {
			start++;
		}
		return new NumTime(start);
	}

    next(time) {
		return new NumTime(time.tm + this.size);
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

    label(time) {
		return time.toString();
	}
}
