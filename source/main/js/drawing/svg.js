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


class SvgContext {

    _xml = [];
    _level = 0;
    _canvas = {"width": 100, "height": 100};
    _fillStyle = '#ffff00';
    _strokeStyle = '#000';
    _strokeDasharray = "";
    _grd = undefined;
    _font = "12px Verdana";
    _fontSize = 12;
    _gradientId = undefined;
    _inPath = false;
    _lastPath = undefined;
    static _filename = "test.svg";

    constructor() {
        this._grd = new Gradient(this);
        setCanvasSize(this._canvas)
        this._xml.push(`<svg version="1.1" viewBox="0 0 ${this._canvas.width} ${this._canvas.height}" baseProfile="full" xmlns="http://www.w3.org/2000/svg">`);

    }

    static set filename(value) {
        SvgContext._filename = value;
        if (!value.endsWith(".svg")) {
            SvgContext._filename += ".svg";
        }
    }

    static get filename() {
        return SvgContext._filename;
    }

    get canvas() {
        return this._canvas;
    }

    set font(font) {
        this._font = font;
        this._fontSize = parseInt(font);
    }

    set fillStyle(value) {
        if (typeof value === 'string' || value instanceof String) {
            if (value.startsWith("rgb(")) {
                this._fillStyle = rgbToHexString(value);
            } else {
                this._fillStyle = value;
            }
        }
    }

    set strokeStyle(value) {
        if (typeof value === 'string' || value instanceof String) {
            if (value.startsWith("rgb(")) {
                this._strokeStyle = rgbToHexString(value);
            } else {
                this._strokeStyle = value;
            }
        }
    }

    fillRect(x, y, width, height) {
        let tag = `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${this._fillStyle}" stroke="${this._strokeStyle}" />`
        this._xml.push(tag);
    }

    rect(x, y, width, height) {
        // fillRect does the job!!
    }

    measureText(text) {
        return {"width": getStringWidth(text, this._fontSize), "height": 20};
    }

    fillText(text, x, y) {
        this._xml.push(`<!-- ${text} -->`);
        this._xml.push(`<text x="${x}" y="${y}" style="font: ${this._font}">${text}</text>`);
    }

    beginPath() {
        this._inPath = true;
        this._path = [];
    }

    closePath() {
        this._inPath = false;
    }

    stroke() {
        if (this._inPath) {
            let path = this._create_path();
            this._xml.push(path);
            this._lastPath = path;
        }
    }

    fill() {
        if (this._inPath) {
            let path = this._create_path();
            if (path != this._lastPath) {
                this._xml.push(path);
            }
            this._lastPath = path;
        }
        this.closePath();
    }

    _create_path() {
            // The following formatting is used to make it look nicer in th svg file!
            return  `<path
    stroke="${this._strokeStyle}"
    fill="${this._fillStyle}"
    stroke-dasharray="${this._strokeDasharray}"
    d="${this._path.join('\n')}" />`;
    }

    quadraticCurveTo(xc, yc, xp, yp) {
        if (this._inPath) {
            this._path.push(`Q${xc},${yc} ${xp},${yp}`)
        } else {
            let xml =  `<path d="M${this._lineStart.x},${this._lineStart.y} Q${xc},${yc} ${xp},${yp}" />`;
            this._xml.push(xml);
        }
        this._lineStart = {"x":xp, "y":yp};
    }

    moveTo(x, y) {
        this._lineStart = {x, y};
        if (this._inPath) {
            this._path.push(`M ${x},${y}`);
        }
    }

    lineTo(x, y) {
        if (this._inPath) {
            this._path.push(`L ${x},${y}`);
        } else {
            this._xml.push(`<line x1="${this._lineStart.x}" y1="${this._lineStart.y}" x2="${x}" y2="${y}" stroke="${this._strokeStyle}" stroke-dasharray="${this._strokeDasharray}"/>`);
        }
        this._lineStart = {x, y};
    }

    setLineDash(vector) {
        this._strokeDasharray = "";
        for (const val of vector) {
            this._strokeDasharray += `${val} `
        }
    }

    createLinearGradient(x1, y1, x2, y2) {
        return this._grd;
    }

    endDrawing() {
        this._xml.push("</svg>");
        saveSvg(SvgContext.filename, this._xml.join('\n'));
    }

    addGradient(id, xml) {
        this._gradientId = id;
        this._xml.push(xml);
        this._fillStyle = `url(#${id})`
    }
}

class Gradient {
    _color = [];
    _color2 = "ffff00";
    _svgContext = undefined;
    _idCount = 0;

    constructor (svgContext) {
        this._svgContext = svgContext;
    }

    addColorStop(n, color) {
        if (n == 0) {
            this._color = [rgbToHexString(color)];
        } else {
            this._color.push(rgbToHexString(color));
            this._idCount += 1;
            let id = `grad${this._idCount}`
            let xml = `
            <linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:${this._color[0]};stop-opacity:1" />
              <stop offset="100%" style="stop-color:${this._color[1]};stop-opacity:1" />
            </linearGradient>
            `
            this._svgContext.addGradient(id, xml);
        }
    }
}
