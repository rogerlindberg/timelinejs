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


class GregorianTimeDelta extends TimeDelta {

	static get minDelta() {return Math.trunc(SECONDS_IN_DAY / 60);}

	static deltaFromDays(days) {
		return new GregorianTimeDelta(days * SECONDS_IN_DAY);
	}

	static deltaFromDaysAndSeconds(days, seconds) {
		return new GregorianTimeDelta(days * SECONDS_IN_DAY + seconds);
	}

	static deltaFromHours(hours) {
		return new GregorianTimeDelta(hours * 60 * 60);
	}

	get days() {return Math.trunc(this._delta / SECONDS_IN_DAY);}
	get seconds() {return this._delta;}

	div(value) {
		return new GregorianTimeDelta(Math.trunc(this._delta / value));
	}

	valueOf() {
		return this._delta;
	}

}
