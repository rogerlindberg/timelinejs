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


// *************************************************
// This class represents the period visible in the
// timeline application,
// *************************************************
class Period {

    constructor(start, end) {
        this.start = start;
        this.end = end;
        this.step = 10;
        this.minStep = 10;
        this.zoomStep = 4;
        this.scrollStep = 4;
        this._yOffset = 0;
    }

    get size() {
        return this.end.tm - this.start.tm;
    }

    get delta() {
        return this.end.sub(this.start);
    }

    get yOffset() { return this._yOffset; }
    set yOffset(value) { this._yOffset = value; }

    eq(other) {
        return this.start.eq(other.start) && this.end.eq(other.end);
    }

    increment() {
        // Move 10%
        this.move(this.delta.delta / 10);
    }

    decrement() {
        // Move 10%
        this.move(- this.delta.delta / 10);
    }

    move(step) {
        let delta = new repo.timeDelta(step);
        this.update(this.start, this.end, delta, delta)
    }

    moveDelta(delta) {
        this.update(this.start, this.end, delta, delta)
    }

    zoomIn() {
        // Reduce size of period with 20%.
        let minDelta = repo.timeDelta.minDelta;
        let change = Math.trunc(this.delta.delta / 10);
        if (this.delta.delta - 2 * change > minDelta) {
            let startDelta = new repo.timeDelta(change);
            let endDelta = new repo.timeDelta(-change);
            this.update(this.start, this.end, startDelta, endDelta)
            drawTimeline();
        }
    }

    zoomOut() {
        // Increase size of period with 20%.
        let change = Math.trunc(this.delta.delta / 10);
        let startDelta = new repo.timeDelta(-change);
        let endDelta = new repo.timeDelta(change);
        this.update(this.start, this.end, startDelta, endDelta)
        drawTimeline();
    }

    update(start, end, startDelta=undefined, endDelta=undefined) {
        this.start = start;
        this.end = end;
        if (startDelta) {
            this.start = this.start.addDelta(startDelta);
        }
        if (endDelta) {
            this.end = this.end.addDelta(endDelta);
        }
    }

    forward() {
        this.update(
			this.start.addDelta(this.delta),
			this.end.addDelta(this.delta));
    }

    backward() {
        this.update(
			this.start.subDelta(this.delta),
			this.end.subDelta(this.delta));
    }

}
