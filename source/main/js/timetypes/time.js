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


function calcX(time)
{
    // Return the x position in pixels as an integer for the given time.
    return Math.round(calcExactX(time));
}

function calcExactX(time) {
    return getCanvas().width * (time.sub(repo.period.start) / repo.period.delta);
}

class Time {

	_tm;

	constructor(tm) {
		this._tm = tm;
	}

	get tm() { return this._tm; }

	addDelta(delta) {
		throw Error('addDelta(delta) not implemented!');
	}

	add(other) {
		throw Error('add(other) not implemented!');
	}

	sub(other) {
		throw Error('sub(other) not implemented!');
	}

	eq(other) {
		throw Error('eq(other) not implemented!');
	}

	gt(other) {
		throw Error('gt(other) not implemented!');
	}

	gte(other) {
		throw Error('gte(other) not implemented!');
	}

	lt(other) {
		throw Error('lt(other) not implemented!');
	}

	lte(other) {
		throw Error('lte(other) not implemented!');
	}
}

class TimeDelta {
	_delta;

	constructor(delta) {
		this._delta = delta;
	}

	get delta() {return this._delta;}
	static get minDelta() {return 10;}
}
