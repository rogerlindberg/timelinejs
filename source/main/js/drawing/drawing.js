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
// Drawing functions
// *************************************************

// This flag is used to avoid recursive calls to the
// drawTimeline() function.
let _doDraw = true;

function disableDrawing() {
    _doDraw = false;
}

function enableDrawing() {
    _doDraw = true;
    drawTimeline();
}

function drawTimeline(exportToSvg=false) {
    if (repo && _doDraw) {
        let ctx = undefined;
        let yOffset = repo.period.yOffset;
        repo.inDrawing = true;
        if (exportToSvg) {
            ctx = new SvgContext();
        } else {
            ctx = getCanvasContext();
        }
        setCanvasSize(ctx.canvas);
        drawEras(ctx);
        drawCenterLine(ctx, yOffset);
        drawStrips(ctx, yOffset);
        drawZeroLine(ctx);
        drawEvents(ctx, yOffset);
        drawEventBubbles(ctx);
        if (exportToSvg) {
            ctx.endDrawing();
        }
    }
    if (repo) {
        repo.inDrawing = false;
    }
}

function setCanvasSize(canvas) {
    // Resize the canvas object so that it fills all of the client area.
    var browserZoomLevel = Math.round(window.devicePixelRatio * 100);
    let magicWidth = 30 * 100 / browserZoomLevel;
    let magicHeight = 60 * 100 / browserZoomLevel;
    canvas.width = Math.trunc(window.innerWidth - magicWidth);
    canvas.height = Math.trunc(window.innerHeight - magicHeight);
}

function drawEras(ctx) {
    repo.eras.forEach(era => this.drawEra(ctx, era));
}

function drawEra(ctx, era) {
    let factor = ctx.canvas.width / repo.period.delta;
    let x1 = factor * (era.start.sub(repo.period.start));
    let x2 = factor * (era.end.sub(repo.period.start));
    if (era.endsToday) {
        x2 = factor * (repo.timeType.now().sub(repo.period.start));
    }
    if (x1 > x2) {
        let x3 = x1;
        x1 = x2;
        x2 = x3;
    }
    let y1 = 0;
    let y2 = ctx.canvas.height;
    // TODO: Border ?
    //       ctx.rect(x1, y1, x2 - x1, y2 - y1);
    ctx.fillStyle = tupleToRgb(rgbToTuple(era.color));
    ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
    let textWidth = ctx.measureText(era.name).width;
    let textHeight = ctx.measureText("M").width;
    ctx.fillStyle = "#000";
    ctx.fillText(era.name, x1 + (x2 - x1 - textWidth) / 2, y2 - textHeight);
    ctx.stroke();
}

function drawCenterLine(ctx, yOffset) {
    ctx.beginPath();
    drawHorizontalLine(ctx, 0, ctx.canvas.width, ctx.canvas.height / 2, yOffset);
    ctx.stroke();
}

function drawStrips(ctx, yOffset) {
    let { major, minor } = repo.timeType.chooseStrips(repo.period);
    drawMinorStrips(ctx, minor, yOffset)
    drawMajorStrips(ctx, major, yOffset)
}

function drawMinorStrips(ctx, minor, yOffset) {
    ctx.font = "10px Verdana";
    ctx.strokeStyle = "rgb(192,192,192)";
    ctx.setLineDash([1, 2]);
    this.drawAllStrips(ctx, minor, ctx.canvas.height / 2 - 5 + yOffset);
}

function drawMajorStrips(ctx, major, yOffset) {
    ctx.font = "14px Verdana";
    ctx.strokeStyle = "rgb(0,0,0)";
    ctx.setLineDash([]);
    this.drawAllStrips(ctx, major, 10);
}

function drawAllStrips(ctx, strip, textLocationY) {
    let c = ctx.canvas;
    let factor = ctx.canvas.width / repo.period.delta;
    let striplinesLocationsX = strip.getStripLocations(repo.period);
    let xPoses = striplinesLocationsX.transform(item => factor * (item.sub(repo.period.start)));
    let stripWidth = xPoses[1] - xPoses[0];
    ctx.beginPath();
    for (let i = 0; i < xPoses.length; i++) {
        drawVerticalLine(ctx, xPoses[i], 0, c.height);
        drawStripText(
            ctx,
            strip.label(striplinesLocationsX[i]),
            xPoses[i],
            xPoses[i] + stripWidth,
            textLocationY);
    }
    ctx.stroke();
    ctx.closePath();
}

function drawStripText(ctx, label, x1, x2, textLocationY) {
    // The reason for this complicated logic is to always draw
    // strip texts in the visible part of a strip.
    if (!(x2 <= 0 || x1 > ctx.canvas.width)) {
        // Strip is visible
        let textWidth = ctx.measureText(label).width
        let xa = 0;
        let xb = 0;
        if (!x2) {
            // Only one point for strip
            xb = ctx.canvas.width;
        }
        else {
            if (x1 >= 0) {
                // Strip starts in visible area
                xa = x1;
            }
            if (x2 > ctx.canvas.width) {
                // Strip ends outside right edge
                // else: Strip starts outside left edge
                xb = ctx.canvas.width;
            } else {
                // Strip ends in visible area
                // else: Strip starts outside left edge and ends in visible area
                xb = x2;
            }
        }
        ctx.fillText(label, xa + (xb - xa - textWidth) / 2, textLocationY);
    }
}

function drawZeroLine(ctx) {
    ctx.beginPath();
    let factor = ctx.canvas.width / repo.period.delta;
    let x = factor * (repo.timeType.now().sub(repo.period.start));
    ctx.strokeStyle = "#ff0000";
    drawVerticalLine(ctx, x, 0, ctx.canvas.height);
    ctx.stroke();
}

function drawEvents(ctx, yOffset = 0) {
    ctx.beginPath();
    new Scene().layOut(yOffset);
    ctx.font = "12px Verdana";
    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "#000000";
    ctx.setLineDash([]);
    repo.visibleEvents.forEach(evt => drawEvent(ctx, evt, yOffset));
    ctx.stroke();
}

function drawEvent(ctx, evt, yOffset) {
    drawEventBox(ctx, evt);
    drawFuzzyEdges(ctx, evt);
    drawLockedEdges(ctx, evt);
    drawPointEventLine(ctx, evt, yOffset);
    drawCenteredEventLabel(ctx, evt);
    drawEventEndsTodayMark(ctx, evt);
    drawEventResizeMoveHandles(ctx, evt);
}

function drawEventBox(ctx, evt) {
    ctx.beginPath();
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 0.5;
    ctx.rect(evt.x1, evt.y1, evt.x2 - evt.x1, evt.y2 - evt.y1);
    ctx.stroke();
    ctx.beginPath();
    let color = rgbToTuple(evt.color);
    if (Settings.gradientDrawing) {
        let grd = ctx.createLinearGradient(evt.x1, 0, evt.x2, 0);
        grd.addColorStop(0, tupleToRgb(darkenColor(color, 0.8)));
        grd.addColorStop(1, tupleToRgb(lightenColor(color, 2)));
        ctx.fillStyle = grd;
    } else {
        ctx.fillStyle = tupleToRgb(color);
    }
    ctx.fillRect(evt.x1, evt.y1, evt.pixelWidth, evt.pixelHeight);
    ctx.fill();
}

function drawFuzzyEdges(ctx, evt) {
    let height = evt.pixelHeight;
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#f00';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    if (evt.fuzzyStart) {
        ctx.moveTo(evt.x1, evt.y1);
        ctx.lineTo(evt.x1 + height / 4, evt.y1 + height / 4);
        ctx.lineTo(evt.x1, evt.y1 + height / 2);
        ctx.lineTo(evt.x1 + height / 4, evt.y1 + 3 * height / 4);
        ctx.lineTo(evt.x1, evt.y2);
    }
    if (evt.fuzzyEnd) {
        ctx.moveTo(evt.x2, evt.y1);
        ctx.lineTo(evt.x2 - height / 4, evt.y1 + height / 4);
        ctx.lineTo(evt.x2, evt.y1 + height / 2);
        ctx.lineTo(evt.x2 - height / 4, evt.y1 + 3 * height / 4);
        ctx.lineTo(evt.x2, evt.y2);
    }
    ctx.stroke();
    ctx.fill();
}

function drawLockedEdges(ctx, evt) {
    if (evt.locked) {
        let height = evt.pixelHeight;
        ctx.fillStyle = '#ff0';
        ctx.strokeStyle = '#f00';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.fillRect(evt.x1, evt.y1, height / 4, height);
        ctx.fillRect(evt.x2 - height / 4, evt.y1, height / 4, height);
        ctx.rect(evt.x1, evt.y1, height / 4, height);
        ctx.rect(evt.x2, evt.y1, - height / 4, height);
        ctx.stroke();
        ctx.fill();
    }
}

function drawPointEventLine(ctx, evt, yOffset) {
    if (evt.displayAsPointEvent) {
        drawVerticalLine(
            ctx,
            evt.x1 + 1,
            evt.y2,
            evt.y2 + ctx.canvas.height / 2 - evt.y2 + yOffset);
    }
}

function drawCenteredEventLabel(ctx, evt) {
    var textHeight = getTextHeight();
    var textWidth = getTextWidth(evt.label);
    let x = Math.max(evt.x1, (evt.x2 + evt.x1 - textWidth) / 2);
    ctx.fillStyle = `rgb(${repo.getEventFontColor(evt)})`;
    ctx.fillText(evt.label, x, evt.y1 + (evt.height + textHeight) / 2, evt.x2 - evt.x1);
}

function drawEventEndsTodayMark(ctx, evt) {
    if (evt.endsToday) {
        ctx.fillStyle = 'rgb(255,0,0)';
        ctx.fillRect(evt.x2 - 5, evt.y1 + 1, 4, evt.y2 - evt.y1 - 2);
        drawVerticalLine(ctx, evt.x2 - 5, evt.y1, evt.y2);
    }
}

function drawEventResizeMoveHandles(ctx, evt) {
    if (evt.hit) {
        drawEventMoveHandle(ctx, evt);
        drawEventResizeHandles(ctx, evt);
    }
}

function drawEventMoveHandle(ctx, evt) {
    ctx.fillRect((evt.x1 + evt.x2) / 2, (evt.y1 + evt.y2) / 2 - 2, 4, 4);
}

function drawEventResizeHandles(ctx, evt) {
    // Containers are resized by resizing/mowing it's members
    if (!evt.isContainer && !evt.displayAsPointEvent) {
        ctx.fillRect(evt.x1 - 2, (evt.y1 + evt.y2) / 2 - 2, 4, 4);
        ctx.fillRect(evt.x2 - 2, (evt.y1 + evt.y2) / 2 - 2, 4, 4);
    }
}

function getLongestLine(lines) {
    return lines.reduce(
        (acc, shot) => acc.length > shot.length ? acc : shot,
        lines[0]);
}

function drawEventBubbles(ctx) {
    if (Settings.bubbleOnHoover) {
        repo.events.forEach(evt => drawEventBubble(ctx, evt));
    }
    repo.events.forEach(evt => evt.stickyBubble ? drawEventBubble(ctx, evt, true): 0);
}

function drawEventBubble(ctx, evt, sticky=false) {
    if ((evt.mouseOver || (evt.stickyBubble && sticky)) && evt.description.length > 0) {
        let lines = evt.description.split('\n');
        let width = Math.max(100, getTextWidth(getLongestLine(lines)));
        var height = getTextHeight() * lines.length;
        var radius = 20;
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.lineWidth = "1";
        // x0, y0 is the at the tip of the speach bubble pointer at
        // Center of Event minus a quarter of the event width.
        // The line segemnts are drawn clockwise.
        // xp, yp are the points to where a line segment ends
        // xc, yc are the control point of a Bezier curve.
        var x0 = (evt.x1 + evt.x2) / 2 - (evt.x2 - evt.x1) / 4;
        var y0 = evt.y1
        let xp = x0;
        let yp = y0;
        ctx.moveTo(xp, yp); // Tip of spech bubble pointer
        xp += radius / 2;
        yp -= radius;
        ctx.lineTo(xp, yp); // Up to bubble
        xp -= radius;
        ctx.lineTo(xp, yp); // Segment to the left corner
        let xc = xp - radius;
        let yc = yp;
        xp -= radius;
        yp -= radius;
        ctx.quadraticCurveTo(xc, yc, xp, yp); // The bottom left corner
        yp -= height;
        ctx.lineTo(xp, yp); // Segment to the top left corner
        xc = xp;
        yc = yp - radius;
        xp += radius;
        yp -= radius;
        ctx.quadraticCurveTo(xc, yc, xp, yp); // Top left corner
        xp += width;
        ctx.lineTo(xp, yp); // Upper horizontal segment
        xc = xp + radius;
        yc = yp;
        xp += radius;
        yp += radius;
        ctx.quadraticCurveTo(xc, yc, xp, yp); // Upper right corner
        yp += height;
        ctx.lineTo(xp, yp); // Right vertical segment to bottm right corner
        xc = xp;
        yc = yp + radius;
        xp -= radius;
        yp += radius;
        ctx.quadraticCurveTo(xc, yc, xp, yp); // Bottom right corner
        xp -= (width - 2 * radius);
        ctx.lineTo(xp, yp); // Horizontal segment to pointer
        xp = x0;
        yp = y0;
        ctx.lineTo(xp, yp); // Ponter segment back to x0, y0
        ctx.fillStyle = "rgb(242,240,186)";
        ctx.stroke();
        ctx.fill();
        ctx.fillStyle = `rgb(${repo.getEventFontColor(evt)})`;
        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(
                lines[i],
                x0 - radius,
                y0 - 2 * radius - height + (getTextHeight() + 4) * i);
        }
    }
}

function getPixelsPerTimeUnitFactor() {
    return getCanvas().width / repo.period.delta;
}

function drawLine(ctx, x1, y1, x2, y2) {
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function drawVerticalLine(ctx, x, y1, y2) {
    drawLine(ctx, x, y1, x, y2);
}

function drawHorizontalLine(ctx, x1, x2, y, yOffset = 0) {
    drawLine(ctx, x1, y + yOffset, x2, y + yOffset);
}
