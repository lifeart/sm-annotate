"use strict";
(() => {
  // src/ui.ts
  var defaultColor = "#F3CE32";
  function initUI() {
    var _a;
    const uiContainer = document.createElement("div");
    uiContainer.style.position = "absolute";
    uiContainer.style.top = "0";
    uiContainer.style.left = "0";
    uiContainer.style.zIndex = "2";
    (_a = this.canvas.parentNode) == null ? void 0 : _a.insertBefore(uiContainer, this.canvas);
    const video2 = this.videoElement.tagName === "VIDEO" ? this.videoElement : null;
    this.uiContainer = uiContainer;
    const createButton = (icon, tool2) => {
      const button = document.createElement("button");
      button.type = "button";
      button.innerHTML = icon;
      button.style.margin = "5px";
      uiContainer.appendChild(button);
      this.buttons.push(button);
      if (typeof tool2 === "function") {
        this.addEvent(button, "click", tool2);
      } else {
        button.dataset.tool = tool2;
        const onClick = () => {
          this.currentTool = tool2;
        };
        this.addEvent(button, "click", onClick);
      }
      return button;
    };
    const createWrapper = () => {
      const wrapper = document.createElement("div");
      wrapper.style.display = "inline-flex";
      wrapper.style.alignItems = "center";
      wrapper.style.margin = "5px";
      uiContainer.appendChild(wrapper);
      return wrapper;
    };
    createButton(
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>',
      "rectangle"
    );
    createButton(
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>',
      "circle"
    );
    createButton(
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.3 8.7 8.7 21.3c-1 1-2.5 1-3.4 0l-2.6-2.6c-1-1-1-2.5 0-3.4L15.3 2.7c1-1 2.5-1 3.4 0l2.6 2.6c1 1 1 2.5 0 3.4Z"></path><path d="m7.5 10.5 2 2"></path><path d="m10.5 7.5 2 2"></path><path d="m13.5 4.5 2 2"></path><path d="m4.5 13.5 2 2"></path></svg>',
      "line"
    );
    createButton(
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"></path><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"></path></svg>',
      "curve"
    );
    createButton(
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>',
      "arrow"
    );
    createButton(
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>',
      "text"
    );
    createButton(
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"></path><path d="M22 21H7"></path><path d="m5 11 9 9"></path></svg>',
      "eraser"
    );
    createButton(
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"></path><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path></svg>',
      () => {
        this.handleUndo();
      }
    );
    if (video2) {
      createButton(
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>',
        () => {
          this.playbackFrame = Math.max(1, this.activeTimeFrame - 1);
        }
      );
      createButton(
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>',
        () => {
          this.playbackFrame = Math.min(
            video2.duration * this.fps,
            this.activeTimeFrame + 1
          );
        }
      );
      createButton(
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>',
        () => {
          video2.play();
        }
      );
    }
    const colorPicker = document.createElement("input");
    colorPicker.type = "color";
    colorPicker.value = defaultColor;
    colorPicker.style.margin = "5px";
    this.colorPicker = colorPicker;
    uiContainer.appendChild(colorPicker);
    const strokeControlWrapper = createWrapper();
    const strokeWidthSlider = document.createElement("input");
    strokeWidthSlider.type = "number";
    strokeWidthSlider.step = "1";
    strokeWidthSlider.min = "1";
    strokeWidthSlider.max = "10";
    strokeWidthSlider.value = "5";
    strokeWidthSlider.style.margin = "5px";
    strokeControlWrapper.appendChild(strokeWidthSlider);
    const onStrokeWidthChange = (event) => {
      this.ctx.lineWidth = event.target.valueAsNumber;
      this.focusOnMediaNode();
    };
    this.addEvent(strokeWidthSlider, "input", onStrokeWidthChange);
    const onColorChange = (event) => {
      this.ctx.strokeStyle = event.target.value;
      this.ctx.fillStyle = event.target.value;
      this.focusOnMediaNode();
    };
    this.addEvent(colorPicker, "input", onColorChange);
    this.addEvent(this.canvas, "pointerover", () => {
      this.focusOnMediaNode();
    });
    this.colorPicker = colorPicker;
    this.strokeSizePicker = strokeWidthSlider;
    if (video2) {
      this.hide();
      this.addEvent(video2, "pause", () => {
        this.show();
      });
      this.addEvent(video2, "seek", () => {
        if (video2.paused) {
          this.show();
        }
      });
      this.addEvent(video2, "timeupdate", () => {
        if (video2.paused) {
          this.show();
        }
      });
      this.addEvent(video2, "error", () => {
        this.hide();
      });
      this.addEvent(video2, "stalled", () => {
        this.hide();
      });
      this.addEvent(video2, "waiting", () => {
        this.hide();
      });
      this.addEvent(video2, "ended", () => {
        this.hide();
      });
      this.addEvent(video2, "play", () => {
        this.hideControls();
        this.playAnnotationsAsVideo();
      });
      this.addEvent(video2, "keydown", (event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          const videoElement = video2;
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
          if (event.key === "ArrowLeft") {
            this.playbackFrame = Math.max(1, this.activeTimeFrame - 1);
          } else if (event.key === "ArrowRight") {
            this.playbackFrame = Math.min(
              videoElement.duration * this.fps,
              this.activeTimeFrame + 1
            );
          }
        }
      });
    }
  }

  // src/canvas.ts
  function initCanvas() {
    var _a;
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    (_a = this.videoElement.parentNode) == null ? void 0 : _a.insertBefore(
      this.canvas,
      this.videoElement.nextSibling
    );
    this.canvas.style.position = "absolute";
    this.canvas.style.top = "0";
    this.canvas.style.left = "0";
    this.canvas.style.zIndex = "1";
    this.addEvent(this.canvas, "pointerdown", this.handleMouseDown);
    this.addEvent(this.canvas, "pointermove", this.handleMouseMove);
    this.addEvent(this.canvas, "pointerup", this.handleMouseUp);
    this.addEvent(this.canvas, "pointercancel", this.handleMouseUp);
    this.addEvent(window, "resize", this.setCanvasSize);
    this.addEvent(document, "keydown", this.onKeyDown);
  }

  // src/plugins/base.ts
  var BasePlugin = class {
    constructor(annotationTool) {
      this.startX = 0;
      this.startY = 0;
      this.isDrawing = false;
      this.annotationTool = annotationTool;
    }
    get ctx() {
      return this.annotationTool.ctx;
    }
    onDeactivate() {
    }
    onActivate() {
    }
    reset() {
      this.startX = 0;
      this.startY = 0;
      this.isDrawing = false;
    }
    save(shape) {
      this.annotationTool.addShape(shape);
    }
  };

  // src/plugins/rectangle.ts
  var RectangleToolPlugin = class extends BasePlugin {
    constructor() {
      super(...arguments);
      this.name = "rectangle";
    }
    normalize(shape, canvasWidth, canvasHeight) {
      return {
        ...shape,
        x: shape.x / canvasWidth,
        y: shape.y / canvasHeight,
        width: shape.width / canvasWidth,
        height: shape.height / canvasHeight
      };
    }
    onPointerDown(event) {
      const { x, y } = this.annotationTool.getRelativeCoords(event);
      this.startX = x;
      this.startY = y;
      this.isDrawing = true;
    }
    onPointerMove(event) {
      if (!this.isDrawing) {
        return;
      }
      const { x, y } = this.annotationTool.getRelativeCoords(event);
      this.drawRectangle(
        this.startX,
        this.startY,
        x - this.startX,
        y - this.startY
      );
    }
    onPointerUp(event) {
      if (!this.isDrawing) {
        return;
      }
      const { x, y } = this.annotationTool.getRelativeCoords(event);
      this.save({
        type: "rectangle",
        x: this.startX,
        y: this.startY,
        width: x - this.startX,
        height: y - this.startY,
        strokeStyle: this.ctx.strokeStyle,
        fillStyle: this.ctx.fillStyle,
        lineWidth: this.ctx.lineWidth
      });
      this.drawRectangle(
        this.startX,
        this.startY,
        x - this.startX,
        y - this.startY
      );
      this.isDrawing = false;
    }
    drawRectangle(x, y, width, height) {
      this.ctx.beginPath();
      this.ctx.rect(x, y, width, height);
      this.ctx.stroke();
    }
    draw(shape) {
      this.drawRectangle(shape.x, shape.y, shape.width, shape.height);
    }
  };

  // src/plugins/circle.ts
  var CircleToolPlugin = class extends BasePlugin {
    constructor() {
      super(...arguments);
      this.name = "circle";
    }
    normalize(shape, canvasWidth, canvasHeight) {
      return {
        ...shape,
        x: shape.x / canvasWidth,
        y: shape.y / canvasHeight,
        radius: shape.radius / canvasWidth
      };
    }
    onPointerDown(event) {
      const { x, y } = this.annotationTool.getRelativeCoords(event);
      this.startX = x;
      this.startY = y;
      this.isDrawing = true;
    }
    onPointerMove(event) {
      if (!this.isDrawing) {
        return;
      }
      const { x, y } = this.annotationTool.getRelativeCoords(event);
      const radius = Math.sqrt(
        Math.pow(x - this.startX, 2) + Math.pow(y - this.startY, 2)
      );
      this.drawCircle(this.startX, this.startY, radius);
    }
    onPointerUp(event) {
      if (!this.isDrawing) {
        return;
      }
      const { x, y } = this.annotationTool.getRelativeCoords(event);
      const radius = Math.sqrt(
        Math.pow(x - this.startX, 2) + Math.pow(y - this.startY, 2)
      );
      this.save({
        type: "circle",
        x: this.startX,
        y: this.startY,
        radius,
        strokeStyle: this.ctx.strokeStyle,
        fillStyle: this.ctx.fillStyle,
        lineWidth: this.ctx.lineWidth
      });
      this.drawCircle(this.startX, this.startY, radius);
      this.isDrawing = false;
    }
    drawCircle(x, y, radius) {
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
      this.ctx.stroke();
    }
    draw(shape) {
      this.drawCircle(shape.x, shape.y, shape.radius);
    }
  };

  // src/plugins/utils/douglas-peucker.ts
  var Point = class {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
    distanceToLine(p1, p2) {
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const numerator = Math.abs(
        dy * this.x - dx * this.y + p2.x * p1.y - p2.y * p1.x
      );
      const denominator = Math.sqrt(dy * dy + dx * dx);
      return numerator / denominator;
    }
  };
  function douglasPeucker(points, epsilon) {
    if (points.length <= 2)
      return points;
    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];
    let index = -1;
    let maxDistance = 0;
    for (let i = 1; i < points.length - 1; i++) {
      const distance = points[i].distanceToLine(firstPoint, lastPoint);
      if (distance > maxDistance) {
        index = i;
        maxDistance = distance;
      }
    }
    if (maxDistance > epsilon) {
      const left = douglasPeucker(points.slice(0, index + 1), epsilon);
      const right = douglasPeucker(points.slice(index), epsilon);
      return left.slice(0, left.length - 1).concat(right);
    } else {
      return [firstPoint, lastPoint];
    }
  }

  // src/plugins/curve.ts
  var CurveToolPlugin = class extends BasePlugin {
    constructor() {
      super(...arguments);
      this.name = "curve";
      this.curvePoints = [];
    }
    normalize(shape, canvasWidth, canvasHeight) {
      return {
        ...shape,
        points: shape.points.map((point) => ({
          x: point.x / canvasWidth,
          y: point.y / canvasHeight
        }))
      };
    }
    draw(shape) {
      this.drawCurve(shape);
    }
    reset() {
      super.reset();
      this.curvePoints = [];
    }
    onPointerDown(event) {
      if (this.isDrawing) {
        return;
      }
      const { x, y } = this.annotationTool.getRelativeCoords(event);
      this.curvePoints = [];
      this.startX = x;
      this.startY = y;
      this.isDrawing = true;
      this.curvePoints.push({ x, y });
    }
    onPointerMove(event) {
      if (!this.isDrawing) {
        return;
      }
      const { x, y } = this.annotationTool.getRelativeCoords(event);
      this.curvePoints.push({ x, y });
      this.drawCurve({
        points: this.curvePoints
      });
    }
    onPointerUp(event) {
      if (!this.isDrawing) {
        return;
      }
      const { x, y } = this.annotationTool.getRelativeCoords(event);
      this.curvePoints.push({ x, y });
      const curvePointsAsPoints = this.curvePoints.map(
        (pt) => new Point(pt.x, pt.y)
      );
      const epsilon = 2;
      const optimizedPoints = douglasPeucker(curvePointsAsPoints, epsilon);
      const optimizedCurvePoints = optimizedPoints.map((pt) => ({
        x: pt.x,
        y: pt.y
      }));
      const shape = {
        type: "curve",
        points: optimizedCurvePoints,
        strokeStyle: this.ctx.strokeStyle,
        fillStyle: this.ctx.fillStyle,
        lineWidth: this.ctx.lineWidth
      };
      this.save(shape);
      this.curvePoints = [];
      this.isDrawing = false;
    }
    drawCurve(shape) {
      this.ctx.beginPath();
      this.ctx.moveTo(shape.points[0].x, shape.points[0].y);
      for (let i = 1; i < shape.points.length - 1; i++) {
        const controlPoint = shape.points[i];
        const endPoint = shape.points[i + 1];
        this.ctx.quadraticCurveTo(
          controlPoint.x,
          controlPoint.y,
          endPoint.x,
          endPoint.y
        );
      }
      this.ctx.stroke();
    }
  };

  // src/plugins/line.ts
  var LineToolPlugin = class extends BasePlugin {
    constructor() {
      super(...arguments);
      this.name = "line";
    }
    normalize(shape, canvasWidth, canvasHeight) {
      return {
        ...shape,
        x1: shape.x1 / canvasWidth,
        y1: shape.y1 / canvasHeight,
        x2: shape.x2 / canvasWidth,
        y2: shape.y2 / canvasHeight
      };
    }
    onPointerDown(event) {
      const { x, y } = this.annotationTool.getRelativeCoords(event);
      this.startX = x;
      this.startY = y;
      this.isDrawing = true;
    }
    onPointerMove(event) {
      if (!this.isDrawing) {
        return;
      }
      const { x, y } = this.annotationTool.getRelativeCoords(event);
      this.drawLine(this.startX, this.startY, x, y);
    }
    onPointerUp(event) {
      if (!this.isDrawing) {
        return;
      }
      const { x, y } = this.annotationTool.getRelativeCoords(event);
      this.save({
        type: "line",
        x1: this.startX,
        y1: this.startY,
        x2: x,
        y2: y,
        fillStyle: this.ctx.fillStyle,
        strokeStyle: this.ctx.strokeStyle,
        lineWidth: this.ctx.lineWidth
      });
      this.drawLine(this.startX, this.startY, x, y);
      this.isDrawing = false;
    }
    drawLine(x1, y1, x2, y2) {
      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();
    }
    draw(shape) {
      this.drawLine(shape.x1, shape.y1, shape.x2, shape.y2);
    }
  };

  // src/plugins/arrow.ts
  var ArrowToolPlugin = class extends BasePlugin {
    constructor() {
      super(...arguments);
      this.name = "arrow";
    }
    normalize(shape, canvasWidth, canvasHeight) {
      return {
        ...shape,
        x1: shape.x1 / canvasWidth,
        y1: shape.y1 / canvasHeight,
        x2: shape.x2 / canvasWidth,
        y2: shape.y2 / canvasHeight
      };
    }
    draw(shape) {
      this.drawArrow(shape.x1, shape.y1, shape.x2, shape.y2);
    }
    onPointerDown(event) {
      const { x, y } = this.annotationTool.getRelativeCoords(event);
      this.startX = x;
      this.startY = y;
      this.isDrawing = true;
    }
    onPointerMove(event) {
      if (!this.isDrawing) {
        return;
      }
      const { x, y } = this.annotationTool.getRelativeCoords(event);
      this.drawArrow(this.startX, this.startY, x, y);
    }
    onPointerUp(event) {
      if (!this.isDrawing) {
        return;
      }
      this.isDrawing = false;
      const { x, y } = this.annotationTool.getRelativeCoords(event);
      this.save({
        type: "arrow",
        x1: this.startX,
        y1: this.startY,
        x2: x,
        y2: y,
        strokeStyle: this.ctx.strokeStyle,
        fillStyle: this.ctx.fillStyle,
        lineWidth: this.ctx.lineWidth
      });
    }
    drawArrow(x1, y1, x2, y2) {
      const headLength = 10 + 2.5 * this.ctx.lineWidth;
      const headAngle = Math.PI / 6;
      const angle = Math.atan2(y2 - y1, x2 - x1);
      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(x2, y2);
      this.ctx.lineTo(
        x2 - headLength * Math.cos(angle + headAngle),
        y2 - headLength * Math.sin(angle + headAngle)
      );
      this.ctx.moveTo(x2, y2);
      this.ctx.lineTo(
        x2 - headLength * Math.cos(angle - headAngle),
        y2 - headLength * Math.sin(angle - headAngle)
      );
      this.ctx.stroke();
    }
  };

  // src/plugins/text.ts
  var TextToolPlugin = class extends BasePlugin {
    constructor() {
      super(...arguments);
      this.name = "text";
    }
    onActivate() {
      this.annotationTool.canvas.style.cursor = "text";
      this.isDrawing = true;
    }
    onDeactivate() {
      this.annotationTool.canvas.style.cursor = "default";
      this.isDrawing = false;
    }
    draw(shape) {
      this.drawText(shape.x, shape.y, shape.text);
    }
    drawText(x, y, text) {
      const fontSize = 16 + this.ctx.lineWidth * 0.5;
      this.ctx.font = `${fontSize}px Helvetica Neue, Arial`;
      this.ctx.fillText(text, x, y);
    }
    onPointerDown(event) {
      const { x, y } = this.annotationTool.getRelativeCoords(event);
      this.startX = x;
      this.startY = y;
    }
    onPointerMove(event) {
      const { x, y } = this.annotationTool.getRelativeCoords(event);
      this.ctx.beginPath();
      this.ctx.arc(x, y, 5, 0, 2 * Math.PI);
      this.ctx.fill();
    }
    normalize(shape, canvasWidth, canvasHeight) {
      return {
        ...shape,
        x: shape.x / canvasWidth,
        y: shape.y / canvasHeight
      };
    }
    onPointerUp(event) {
      const { x, y } = this.annotationTool.getRelativeCoords(event);
      const inputText = prompt("Enter the text to be drawn:");
      if (inputText !== null) {
        this.save({
          type: "text",
          x,
          y,
          text: inputText,
          strokeStyle: this.ctx.strokeStyle,
          fillStyle: this.ctx.fillStyle,
          lineWidth: this.ctx.lineWidth
        });
      }
    }
  };

  // src/plugins/eraser.ts
  var EraserToolPlugin = class extends BasePlugin {
    constructor() {
      super(...arguments);
      this.name = "eraser";
    }
    normalize(shape, canvasWidth, canvasHeight) {
      return {
        ...shape,
        x: shape.x / canvasWidth,
        y: shape.y / canvasHeight,
        width: shape.width / canvasWidth,
        height: shape.height / canvasHeight
      };
    }
    draw(shape) {
      this.drawEraser(shape.x, shape.y, shape.width, shape.height);
    }
    onPointerDown(event) {
      const { x, y } = this.annotationTool.getRelativeCoords(event);
      this.startX = x;
      this.startY = y;
      this.isDrawing = true;
    }
    onPointerMove(event) {
      if (!this.isDrawing) {
        return;
      }
      const { x, y } = this.annotationTool.getRelativeCoords(event);
      this.ctx.save();
      this.ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
      this.ctx.lineWidth = 1;
      this.ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      this.ctx.fillRect(
        this.startX,
        this.startY,
        x - this.startX,
        y - this.startY
      );
      this.ctx.strokeRect(
        this.startX,
        this.startY,
        x - this.startX,
        y - this.startY
      );
      this.ctx.restore();
    }
    onPointerUp(event) {
      if (!this.isDrawing) {
        return;
      }
      this.isDrawing = false;
      const { x, y } = this.annotationTool.getRelativeCoords(event);
      this.save({
        type: "eraser",
        x: this.startX,
        y: this.startY,
        width: x - this.startX,
        height: y - this.startY,
        strokeStyle: this.ctx.strokeStyle,
        fillStyle: this.ctx.fillStyle,
        lineWidth: this.ctx.lineWidth
      });
    }
    drawEraser(x, y, width, height) {
      this.ctx.clearRect(x, y, width, height);
    }
  };

  // src/plugins/index.ts
  var plugins = [
    RectangleToolPlugin,
    CircleToolPlugin,
    LineToolPlugin,
    ArrowToolPlugin,
    TextToolPlugin,
    EraserToolPlugin,
    CurveToolPlugin
  ];

  // src/core.ts
  var AnnotationTool = class {
    constructor(videoElement) {
      this.isMouseDown = false;
      this.activeTimeFrame = 1;
      this.buttons = [];
      this.destructors = [];
      this.plugins = [];
      this.isDestroyed = false;
      this.timeStack = /* @__PURE__ */ new Map();
      // timeFrame -> shapes
      this.undoTimeStack = /* @__PURE__ */ new Map();
      this.annotatedFrameCoordinates = [];
      this.plugins = plugins.map((Plugin) => new Plugin(this));
      this.init(videoElement);
    }
    get selectedColor() {
      return this.colorPicker.value;
    }
    get selectedStrokeSize() {
      return this.strokeSizePicker.valueAsNumber;
    }
    get currentTool() {
      return this._currentTool;
    }
    set currentTool(tool2) {
      const prevTool = this._currentTool;
      if (prevTool) {
        this.getButtonForTool(prevTool).classList.remove("active");
        this.pluginForTool(prevTool).onDeactivate();
      }
      this._currentTool = tool2;
      this.canvas.style.cursor = tool2 ? "pointer" : "default";
      if (tool2) {
        this.getButtonForTool(tool2).classList.add("active");
        this.pluginForTool(tool2).onActivate();
      }
    }
    // https://stackoverflow.com/questions/72997777/how-do-i-get-the-frame-rate-of-an-html-video-with-javascript
    get fps() {
      return 25;
    }
    get playbackFrame() {
      if (this.videoElement instanceof HTMLImageElement)
        return 1;
      const result = Math.round(this.videoElement.currentTime * this.fps);
      return Math.max(1, result);
    }
    set playbackFrame(frame) {
      if (this.videoElement instanceof HTMLImageElement)
        return;
      this.videoElement.currentTime = frame / this.fps;
    }
    get canvasWidth() {
      return this.canvas.width / this.pixelRatio;
    }
    get canvasHeight() {
      return this.canvas.height / this.pixelRatio;
    }
    get progressBarCoordinates() {
      const progressBarOffset = 5;
      const frameOverlayOffset = 55;
      const progressBarWidth = this.canvasWidth - progressBarOffset - frameOverlayOffset;
      const x = progressBarOffset;
      const y = this.canvasHeight - 10;
      const width = progressBarWidth;
      const height = 10;
      return { x, y, width, height };
    }
    get videoClientRect() {
      return this.videoElement.getBoundingClientRect();
    }
    get shapes() {
      if (!this.timeStack.has(this.activeTimeFrame)) {
        this.timeStack.set(this.activeTimeFrame, []);
      }
      return this.timeStack.get(this.activeTimeFrame);
    }
    set shapes(shapes) {
      this.timeStack.set(this.activeTimeFrame, shapes);
    }
    get undoStack() {
      if (!this.undoTimeStack.has(this.activeTimeFrame)) {
        this.undoTimeStack.set(this.activeTimeFrame, []);
      }
      return this.undoTimeStack.get(this.activeTimeFrame);
    }
    set undoStack(shapes) {
      this.undoTimeStack.set(this.activeTimeFrame, shapes);
    }
    get pixelRatio() {
      return window.devicePixelRatio || 1;
    }
    hide() {
      this.stopAnnotationsAsVideo();
      this.hideControls();
      this.hideCanvas();
    }
    showControls() {
      this.uiContainer.style.display = "block";
    }
    hideControls() {
      this.uiContainer.style.display = "none";
    }
    showCanvas() {
      this.canvas.style.display = "block";
    }
    hideCanvas() {
      this.canvas.style.display = "none";
    }
    show() {
      this.stopAnnotationsAsVideo();
      this.activeTimeFrame = this.playbackFrame;
      this.showCanvas();
      this.showControls();
      this.redrawFullCanvas();
    }
    setCanvasSettings() {
      this.ctx.strokeStyle = this.selectedColor;
      this.ctx.fillStyle = this.selectedColor;
      this.ctx.lineWidth = this.selectedStrokeSize;
    }
    pluginForTool(tool2) {
      if (this.isDestroyed) {
        throw new Error("AnnotationTool is destroyed");
      }
      const maybePlugin = this.plugins.find((p) => p.name === tool2);
      if (!maybePlugin) {
        throw new Error(`No plugin found for tool ${tool2}`);
      }
      return maybePlugin;
    }
    getButtonForTool(tool2) {
      return this.buttons.find(
        (button) => button.dataset.tool === tool2
      );
    }
    bindContext() {
      this.handleMouseDown = this.handleMouseDown.bind(this);
      this.handleMouseMove = this.handleMouseMove.bind(this);
      this.handleMouseUp = this.handleMouseUp.bind(this);
      this.setCanvasSize = this.setCanvasSize.bind(this);
      this.onKeyDown = this.onKeyDown.bind(this);
    }
    initProperties() {
      this.isDestroyed = false;
      this.currentTool = null;
      this.shapes = [];
    }
    init(videoElement) {
      this.videoElement = videoElement;
      this.bindContext();
      this.initCanvas();
      this.initUI();
      this.initProperties();
      this.setCanvasSize();
      this.fillCanvas();
      this.setCanvasSettings();
      this.currentTool = "curve";
    }
    addEvent(node, event, callback) {
      const safeCallback = (e) => {
        if (this.isDestroyed)
          return;
        callback(e);
      };
      node.addEventListener(event, safeCallback);
      this.destructors.push(() => {
        node.removeEventListener(event, safeCallback);
      });
    }
    initCanvas() {
      throw new Error("Method not implemented.");
    }
    onKeyDown(event) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
        this.handleUndo();
      }
    }
    handleUndo() {
      if (this.undoStack.length > 0) {
        this.shapes = this.undoStack.pop();
        this.redrawFullCanvas();
      }
    }
    destroy() {
      var _a, _b, _c, _d;
      if (this.isDestroyed)
        return;
      this.destructors.forEach((destructor) => destructor());
      this.stopAnnotationsAsVideo();
      this.destructors = [];
      this.plugins.forEach((plugin) => plugin.reset());
      this.annotatedFrameCoordinates = [];
      this._currentTool = null;
      this.timeStack.clear();
      this.undoTimeStack.clear();
      const wrapper = this.strokeSizePicker.parentElement;
      (_a = wrapper == null ? void 0 : wrapper.parentNode) == null ? void 0 : _a.removeChild(wrapper);
      const colorPickerWrapper = this.colorPicker.parentElement;
      (_b = colorPickerWrapper == null ? void 0 : colorPickerWrapper.parentNode) == null ? void 0 : _b.removeChild(colorPickerWrapper);
      this.buttons.forEach((button) => {
        var _a2;
        (_a2 = button.parentNode) == null ? void 0 : _a2.removeChild(button);
      });
      this.buttons = [];
      (_c = this.uiContainer.parentNode) == null ? void 0 : _c.removeChild(this.uiContainer);
      (_d = this.canvas.parentNode) == null ? void 0 : _d.removeChild(this.canvas);
      const keysToDelete = [
        "strokeSizePicker",
        "colorPicker",
        "uiContainer",
        "canvas",
        "ctx",
        "videoElement"
      ];
      keysToDelete.forEach((key) => {
        delete this[key];
      });
      this.activeTimeFrame = 0;
    }
    setCanvasSize() {
      const videoOffset = this.videoClientRect;
      this.canvas.width = videoOffset.width * this.pixelRatio;
      this.canvas.height = videoOffset.height * this.pixelRatio;
      this.canvas.style.width = `${videoOffset.width}px`;
      this.canvas.style.height = `${videoOffset.height}px`;
      this.ctx.scale(this.pixelRatio, this.pixelRatio);
      this.redrawFullCanvas();
      this.setCanvasSettings();
    }
    isMultiTouch(event) {
      return event.pointerType === "touch" && event.isPrimary === false;
    }
    addShape(shape) {
      const serializedShape = this.serialize([shape])[0];
      console.log("serializedShape", serializedShape);
      this.undoStack.push([...this.shapes]);
      this.shapes.push(serializedShape);
    }
    serialize(shapes = this.shapes) {
      const canvasWidth = this.canvas.width;
      const canvasHeight = this.canvas.height;
      return shapes.map((shape) => {
        const pluginForShape = this.pluginForTool(shape.type);
        return pluginForShape.normalize(shape, canvasWidth, canvasHeight);
      });
    }
    deserialize(shapes) {
      const canvasWidth = 1 / this.canvas.width;
      const canvasHeight = 1 / this.canvas.height;
      return shapes.map((shape) => {
        const pluginForShape = this.pluginForTool(shape.type);
        return pluginForShape.normalize(shape, canvasWidth, canvasHeight);
      });
    }
    getRelativeCoords(event) {
      const rect = this.canvas.getBoundingClientRect();
      return {
        x: this.getEventX(event) - rect.left,
        y: this.getEventY(event) - rect.top
      };
    }
    handleMouseDown(event) {
      event.preventDefault();
      this.isMouseDown = true;
      if (this.isMultiTouch(event))
        return;
      const genericFrame = this.frameFromProgressBar(event);
      if (genericFrame) {
        const frame = this.getAnnotationFrame(event);
        if (frame !== null) {
          this.playbackFrame = frame;
        } else {
          this.playbackFrame = genericFrame;
        }
        return;
      }
      if (this.currentTool) {
        this.pluginForTool(this.currentTool).onPointerDown(event);
      }
    }
    get isDrawing() {
      if (!this.currentTool) {
        return false;
      }
      const activePlugin = this.pluginForTool(this.currentTool);
      return activePlugin.isDrawing;
    }
    handleMouseMove(event) {
      event.preventDefault();
      if (this.isMultiTouch(event))
        return;
      if (this.isMouseDown) {
        const maybeFrame = this.frameFromProgressBar(event);
        if (maybeFrame !== null && !this.isDrawing) {
          this.playbackFrame = maybeFrame;
          return;
        } else {
          this.hideControls();
          this.clearCanvas();
          this.addVideoOverlay();
          this.drawShapesOverlay();
        }
      } else {
        this.redrawFullCanvas();
      }
      if (this.currentTool) {
        this.pluginForTool(this.currentTool).onPointerMove(event);
      }
    }
    getEventX(event) {
      return event.clientX;
    }
    getEventY(event) {
      return event.clientY;
    }
    handleMouseUp(event) {
      this.isMouseDown = false;
      this.showControls();
      if (this.isMultiTouch(event))
        return;
      if (this.currentTool) {
        this.pluginForTool(this.currentTool).onPointerUp(event);
      }
      this.redrawFullCanvas();
    }
    focusOnMediaNode() {
      this.videoElement.focus();
    }
    drawShapesOverlay() {
      const prevSettings = {
        strokeStyle: this.ctx.strokeStyle,
        fillStyle: this.ctx.fillStyle,
        lineWidth: this.ctx.lineWidth
      };
      this.deserialize(this.shapes).forEach((shape) => {
        this.ctx.strokeStyle = shape.strokeStyle;
        this.ctx.fillStyle = shape.fillStyle;
        this.ctx.lineWidth = shape.lineWidth;
        this.pluginForTool(shape.type).draw(shape);
      });
      this.ctx.strokeStyle = prevSettings.strokeStyle;
      this.ctx.fillStyle = prevSettings.fillStyle;
      this.ctx.lineWidth = prevSettings.lineWidth;
    }
    clearCanvas() {
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    }
    imageForCapture() {
      try {
        this.clearCanvas();
        this.addVideoOverlay();
        this.addFrameSquareOverlay();
        this.drawShapesOverlay();
        const image = new Image();
        image.src = this.canvas.toDataURL("image/png");
        return image;
      } catch (e) {
        console.error(e);
        return null;
      }
    }
    redrawFullCanvas() {
      this.clearCanvas();
      this.addVideoOverlay();
      this.addFrameSquareOverlay();
      this.addProgressBarOverlay();
      this.drawShapesOverlay();
    }
    saveCurrentFrame() {
      return {
        frame: this.playbackFrame,
        version: 1,
        fps: this.fps,
        shapes: this.shapes
      };
    }
    addFrameSquareOverlay(_ = this.activeTimeFrame) {
      throw new Error("Method not implemented.");
    }
    addVideoOverlay() {
      throw new Error("Method not implemented.");
    }
    saveAllFrames() {
      const allFrames = Array.from(this.timeStack.keys());
      const annotatedFrames = allFrames.filter((frame) => {
        var _a;
        return (_a = this.timeStack.get(frame)) == null ? void 0 : _a.length;
      });
      const result = annotatedFrames.map((frame) => {
        return {
          frame,
          fps: this.fps,
          version: 1,
          shapes: this.timeStack.get(frame)
        };
      });
      return result;
    }
    getAnnotationFrame(event) {
      var _a, _b;
      const x = event.offsetX;
      const y = event.offsetY;
      const offset = 5;
      const frame = (_b = (_a = this.annotatedFrameCoordinates.find((coordinate) => {
        return x >= coordinate.x - offset && x <= coordinate.x + offset && y >= coordinate.y - offset && y <= coordinate.y + offset;
      })) == null ? void 0 : _a.frame) != null ? _b : null;
      return frame;
    }
    frameFromProgressBar(event) {
      const node = this.videoElement;
      if (node.tagName !== "VIDEO") {
        return null;
      }
      const { x, width, height, y } = this.progressBarCoordinates;
      const x1 = event.offsetX;
      const y1 = event.offsetY;
      if (x1 >= x && x1 <= x + width && y1 >= y && y1 <= y + height) {
        const frame = Math.ceil((x1 - x) / width * (node.duration * this.fps));
        return frame;
      }
      return null;
    }
    addProgressBarOverlay() {
      throw new Error("Method not implemented.");
    }
    initUI() {
      throw new Error("Method not implemented.");
    }
    stopAnnotationsAsVideo() {
      clearTimeout(this.playTimeout);
    }
    hasAnnotationsForFrame(frame) {
      if (this.timeStack.has(frame)) {
        const shapes = this.timeStack.get(frame);
        return shapes && shapes.length > 0;
      }
      return false;
    }
    playAnnotationsAsVideo() {
      this.stopAnnotationsAsVideo();
      const currentVideFrame = this.playbackFrame;
      if (this.hasAnnotationsForFrame(currentVideFrame)) {
        this.showCanvas();
        this.activeTimeFrame = currentVideFrame;
        this.clearCanvas();
        this.drawShapesOverlay();
      } else {
        this.hideCanvas();
      }
      const nextFrameDelay = 1e3 / this.fps;
      this.playTimeout = window.setTimeout(() => {
        this.playAnnotationsAsVideo();
      }, nextFrameDelay);
    }
    fillCanvas() {
      this.ctx.save();
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.ctx.restore();
    }
  };

  // src/overlays/frame-number.ts
  function addFrameSquareOverlay(frame = this.activeTimeFrame) {
    this.ctx.save();
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    const width = 50;
    const height = 30;
    const fontSize = 20;
    this.ctx.fillRect(
      this.canvasWidth - width,
      this.canvasHeight - height,
      width,
      height
    );
    this.ctx.fillStyle = "white";
    this.ctx.font = `${fontSize}px sans-serif`;
    this.ctx.fillText(
      `${frame}`.padStart(3, "0"),
      this.canvasWidth - 40,
      this.canvasHeight - 7
    );
    this.ctx.restore();
  }

  // src/overlays/video.ts
  function addVideoOverlay() {
    this.ctx.drawImage(
      this.videoElement,
      0,
      0,
      this.canvas.width / this.pixelRatio,
      this.canvas.height / this.pixelRatio
    );
  }

  // src/overlays/progress-bar.ts
  function addProgressBarOverlay() {
    const node = this.videoElement;
    if (node.tagName !== "VIDEO") {
      return;
    }
    this.annotatedFrameCoordinates = [];
    const allFrames = Array.from(this.timeStack.keys());
    const annotatedFrames = allFrames.filter((frame) => {
      var _a;
      return (_a = this.timeStack.get(frame)) == null ? void 0 : _a.length;
    });
    const totalFrames = node.duration * this.fps;
    const { x, width, height, y } = this.progressBarCoordinates;
    const coordinatesOnProgressBar = annotatedFrames.map((frame) => {
      return Math.ceil(frame / totalFrames * width);
    });
    this.ctx.save();
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    this.ctx.fillRect(x, y, width, height);
    this.ctx.fillStyle = "#F3CE32";
    const recSize = 8;
    coordinatesOnProgressBar.forEach((coordinate, index) => {
      this.ctx.beginPath();
      const rx = x + coordinate;
      const ry = this.canvasHeight - 5;
      this.ctx.fillRect(rx - recSize / 2, ry - recSize / 2, recSize, recSize);
      this.annotatedFrameCoordinates.push({
        x: rx,
        y: ry,
        frame: annotatedFrames[index]
      });
    });
    const currentFrame = this.playbackFrame;
    const currentFrameCoordinate = Math.ceil(currentFrame / totalFrames * width) + x;
    this.ctx.fillStyle = "white";
    this.ctx.beginPath();
    const ax = currentFrameCoordinate;
    const ay = this.canvasHeight - 5;
    this.ctx.beginPath();
    this.ctx.fillRect(ax - recSize / 2, ay - recSize / 2, recSize, recSize);
    this.ctx.fill();
    this.ctx.restore();
  }

  // src/index.ts
  AnnotationTool.prototype.initUI = initUI;
  AnnotationTool.prototype.initCanvas = initCanvas;
  AnnotationTool.prototype.addFrameSquareOverlay = addFrameSquareOverlay;
  AnnotationTool.prototype.addVideoOverlay = addVideoOverlay;
  AnnotationTool.prototype.addProgressBarOverlay = addProgressBarOverlay;
  var SmAnnotation = AnnotationTool;

  // demo/index.ts
  var video = document.querySelector("video");
  var tool = new SmAnnotation(video);
  setInterval(() => {
    tool.destroy();
    tool.init(video);
  }, 1e8);
  setInterval(() => {
    console.log(tool.saveAllFrames());
  }, 1e5);
})();
