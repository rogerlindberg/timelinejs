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
// This class represents an event on the timeline.
// *************************************************
class Event {

    _period;
    _label;

    constructor(label, period, description, hyperlink, color, defaultColor, category = "",
        fuzzyStart, fuzzyEnd, endsToday, locked, progress, icon, milestone) {
        this.#setLabel(label)
        this._period = period
        this._color = color;
        this._defaultColor = defaultColor;
        this._category = category;
        this._fuzzyStart = fuzzyStart;
        this._fuzzyEnd = fuzzyEnd;
        this._endsToday = endsToday;
        this._locked = locked;
        this._progress = progress;
        this._description = description;
        this._hyperlink = hyperlink;
        this._icon = icon;
        this._milestone = milestone;
        this._x1 = this._x2 = this._y1 = this._y2 = 0;
        this._height = 19;
        this._hit = false;
        this._stickyBubble = false;
        this._displayAsPointEvent = false;
        this._mouseOver = false;
        this.#setEditFunction();
    }

    #setEditFunction() {
        this._editFunction = this._milestone ? () => openEditMilestonesDialog(this)
                                             : () => openEditEventsDialog(this);
    }

    #setLabel(label) {
        // When an event is created the label is prefixed with container information.
        // A container event starts with a number within brackets.
        // A container member event starts with a number within parenthesis.
        // This information is stripped of from the label and stored in the
        // class member _isContainer and _containerId
        if (label.startsWith("[")) {
            let parts = label.split("]");
            this._label = parts[1].trim();
            this._conatinerId = parseInt(parts[0].substring(1))
            this._isContainer = true;
        } else if (label.startsWith("(")) {
            let parts = label.split(")");
            this._label = parts[1].trim();
            this._conatinerId = parseInt(parts[0].substring(1))
            this._isContainer = false;
        } else {
            this._label = label.trim();
            this._conatinerId = -1;
            this._isContainer = false;
        }
    }

    get label() {
        // Returns the label without prefixed container information.
        // Also replaces special html-characters with it's image.
        return this._label.replace("&gt;", ">").replace("&lt;", "<");
    }

    set label(value) {
        // Sets a new label.
        // The value is supposed to contain prefixed container information.
        this.#setLabel(value);
    }

    set containerId(id) {
        // When changing the container id, the container information for
        // the event must also be changed.
        this._conatinerId = id;
        this.#setLabel(this.text);
    }

    get text() {
        // When the event information is to be saved on disk the original
        // label with prefixed container information must be recreated.
        // Thats what the text property is for.
        if (this._conatinerId != -1) {
            if (this._isContainer) {
                return `[${this._conatinerId}]${this._label}`
            } else {
                return `(${this._conatinerId})${this._label}`
            }
        } else {
            return this._label;
        }
    }

    //
    // Plain getters
    //
    get period() { return this._period; }
    get start() { return this._period.start; }
    get end() { return this._period.end; }
    get isContainer() {return this._isContainer;}
    get hasNoContainerRef() {return this._conatinerId == -1;}
    get containerId() {return this._conatinerId;}
    get mouseOver() {return this._mouseOver;}
    get hit() {return this._hit;}
    get stickyBubble() {return this._stickyBubble;}
    get displayAsPointEvent() {return this._displayAsPointEvent;}
    get height() {return this._height;}
    get color() {return this._color;}
    get defaultColor() {return this._defaultColor;}
    get category() {return this._category;}
    get fuzzyStart() {return this._fuzzyStart;}
    get fuzzyEnd() {return this._fuzzyEnd;}
    get endsToday() {return this._endsToday;}
    get locked() {return this._locked;}
    get progress() {return this._progress;}
    get description() {return this._description;}
    get hyperlink() {return this._hyperlink;}
    get icon() {return this._icon;}
    get milestone() {return this._milestone;}
    get x1() {return this._x1;}
    get x2() {return this._x2;}
    get y1() {return this._y1;}
    get y2() {return this._y2;}
    get edit() {return this._editFunction;}

    //
    // Calculating getters
    //
    get id() { return `${this.label} [${this._period.start} - ${this._period.end}]`}
    get isContainerMember() {return this._conatinerId != -1 && !this._isContainer;}
    get pixelWidth() {return this.x2 - this.x1;}
    get pixelHeight() {return this.y2 - this.y1;}

    //
    // Plain setters
    //
    set color(value) {this._color = value;}
    set defaultColor(value) {this._defaultColor = value;}
    set category(value) {this._category = value;}
    set fuzzyStart(value) {this._fuzzyStart = value;}
    set fuzzyEnd(value) {this._fuzzyEnd = value;}
    set endsToday(value) {this._endsToday = value;}
    set locked(value) {this._locked = value;}
    set progress(value) {this._progress = value;}
    set description(value) {this._description = value;}
    set hyperlink(value) {this._hyperlink = value;}
    set icon(value) {this._icon = value;}
    set milestone(value) {this._milestone = value;}
    set mouseOver(value) {this._mouseOver = value;}
    set hit(value) {this._hit = value;}
    set displayAsPointEvent(value) {this._displayAsPointEvent = value;}
    set x1(value) {this._x1 = value;}
    set x2(value) {this._x2 = value;}
    set y1(value) {this._y1 = value;}
    set y2(value) {this._y2 = value;}

    //
    // Getters with logic
    //
    isContainerWithId(id) {
        return this._isContainer && this._conatinerId == id;
    }

    isContainerMemberWithId(id) {
        return this.isContainerMember && this._conatinerId == id;
    }

    // Find out if this event overlaps other event.
    overlaps(other) {
        let p1 = !(this._y1 >= other.y2 || this._y2 <= other.y1);
        let p2 = !(this._x2 <= other.x1 || this._x1 >= other.x2)
        return p1 && p2;
    }

    // Pixel position (x, y) is within the rectangle of the event?
    // Setting the _hit flag.
    isHit(x, y, ctrlDown) {
        let hit = this.isOver(x, y);
        if (ctrlDown) {
            if (hit) {
                this._hit = hit;
            }
        } else {
            this._hit = hit;
        }
        return this._hit;
    }

    toggleStickyBubble(x, y) {
        if (this.isOver(x, y) ) {
            this._stickyBubble = !this._stickyBubble;
        }
    }

    // Pixel position (x, y) is within the rectangle of the event?
    // Setting the _mouseOver flag.
    isOver(x, y) {
        this._mouseOver =
            x >= this._x1 &&
            x <= this._x2 &&
            y >= this._y1 &&
            y <= this._y2;
        return this._mouseOver;
    }

    getHitZone(x, y) {
        if (this._hit && this.isOver(x, y)) {
            if (this.isAtLeftEdge(x, y)) {
                return 1;
            }
            if (this.isInCenter(x, y)) {
                return 2;
            }
            if (this.isAtRightEdge(x, y)) {
                return 3;
            }
        }
        return 0;
    }

    // Pixel position (x, y) is within the center of the event (move mark) rectangle.
    // The margin is 4 pixels on each side of the center.
    isInCenter(x, y) {
        return x >= ((this._x1 + this._x2) / 2 - 4) &&
            x <= ((this._x1 + this._x2) / 2 + 4) &&
            y >= this._y1 &&
            y <= this._y2;
    }

    // Pixel position (x, y) at the left edge of the event rectangle.
    // The margin is 4 pixels on each side of the edge.
    isAtLeftEdge(x, y) {
        if (this._isContainer) return false;
        if (this._displayAsPointEvent) return false;
        return x >= (this._x1 - 4) &&
            x <= (this._x1 + 4) &&
            y >= this._y1 &&
            y <= this._y2;
    }

    // Pixel position (x, y) at the right edge of the event rectangle.
    // The margin is 4 pixels on each side of the edge.
    isAtRightEdge(x, y) {
        if (this._isContainer) return false;
        if (this._displayAsPointEvent) return false;
        return x >= (this._x2 - 4) &&
            x <= (this._x2 + 4) &&
            y >= this._y1 &&
            y <= this._y2;
    }

    moveVertically(pixelDistance) {
        this._y1 += pixelDistance;
        this._y2 += pixelDistance;
    }

    deflateRect(value) {
        this._x1 -= value;
        this._x2 += value;
        this._y1 -= value;
        this._y2 += value;
    }
}

