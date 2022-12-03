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


class NumTime extends Time {

	constructor(tm) {
		super(tm);
	}

	valueOf() {
		return this._tm;
	}

	toString() {
		return this._tm.toString();
	}

	add(other) {
		return new NumTime(this._tm + other.tm);
	}

	sub(other) {
		return new NumTimeDelta(this._tm - other.tm);
	}

	addDelta(delta) {
		return new NumTime(this._tm + delta.delta);
	}

	subDelta(delta) {
		return new NumTime(this._tm - delta.delta);
	}

	eq(other) {
		return this._tm == other._tm;
	}
	gt(other) {
		return this._tm > other._tm;
	}
	gte(other) {
		return this._tm >= other._tm;
	}
	lt(other) {
		return this._tm < other._tm;
	}
	lte(other) {
		return this._tm <= other._tm;
	}
}
