var H="#F3CE32";function I(){let o=document.createElement("div");o.style.position="absolute",o.style.top="0",o.style.left="0",o.style.zIndex="2",this.canvas.parentNode?.insertBefore(o,this.canvas);let e=this.videoElement.tagName==="VIDEO"?this.videoElement:null;this.uiContainer=o;let t=(a,c)=>{let h=document.createElement("button");if(h.type="button",h.innerHTML=a,h.style.margin="5px",o.appendChild(h),this.buttons.push(h),typeof c=="function")this.addEvent(h,"click",c);else{h.dataset.tool=c;let p=()=>{this.currentTool=c};this.addEvent(h,"click",p)}return h},n=()=>{let a=document.createElement("div");return a.style.display="inline-flex",a.style.alignItems="center",a.style.margin="5px",o.appendChild(a),a};t('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>',"rectangle"),t('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>',"circle"),t('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.3 8.7 8.7 21.3c-1 1-2.5 1-3.4 0l-2.6-2.6c-1-1-1-2.5 0-3.4L15.3 2.7c1-1 2.5-1 3.4 0l2.6 2.6c1 1 1 2.5 0 3.4Z"></path><path d="m7.5 10.5 2 2"></path><path d="m10.5 7.5 2 2"></path><path d="m13.5 4.5 2 2"></path><path d="m4.5 13.5 2 2"></path></svg>',"line"),t('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"></path><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"></path></svg>',"curve"),t('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>',"arrow"),t('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>',"text"),t('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"></path><path d="M22 21H7"></path><path d="m5 11 9 9"></path></svg>',"eraser"),t('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"></path><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path></svg>',()=>{this.handleUndo()}),e&&(t('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>',()=>{this.prevFrame()}),t('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>',()=>{this.nextFrame()}),t('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>',()=>{e.play()}));let i=document.createElement("input");i.type="color",i.value=H,i.style.margin="5px",this.colorPicker=i,o.appendChild(i);let s=n(),r=document.createElement("input");r.type="number",r.step="1",r.min="1",r.max="10",r.value="5",r.style.margin="5px",s.appendChild(r);let l=a=>{this.ctx.lineWidth=a.target.valueAsNumber,this.focusOnMediaNode()};this.addEvent(r,"input",l);let u=a=>{this.ctx.strokeStyle=a.target.value,this.ctx.fillStyle=a.target.value,this.focusOnMediaNode()};this.addEvent(i,"input",u),this.addEvent(this.canvas,"pointerover",()=>{this.focusOnMediaNode()}),this.colorPicker=i,this.strokeSizePicker=r,e&&(this.hide(),this.addEvent(e,"pause",()=>{this.show()}),this.addEvent(e,"seek",()=>{e.paused&&this.show()}),this.addEvent(e,"timeupdate",()=>{e.paused&&this.show()}),this.addEvent(e,"error",()=>{this.hide()}),this.addEvent(e,"stalled",()=>{this.hide()}),this.addEvent(e,"waiting",()=>{this.hide()}),this.addEvent(e,"ended",()=>{this.hide()}),this.addEvent(e,"play",()=>{this.hideControls(),this.playAnnotationsAsVideo()}),this.addEvent(e,"keydown",a=>{if(a.key==="ArrowLeft"||a.key==="ArrowRight"){let c=e;a.preventDefault(),a.stopPropagation(),a.stopImmediatePropagation(),a.key==="ArrowLeft"?this.prevFrame():a.key==="ArrowRight"&&this.nextFrame()}}))}function F(){this.canvas=document.createElement("canvas"),this.ctx=this.canvas.getContext("2d"),this.videoElement.parentNode?.insertBefore(this.canvas,this.videoElement.nextSibling),this.canvas.style.position="absolute",this.canvas.style.top="0",this.canvas.style.left="0",this.canvas.style.zIndex="1",this.addEvent(this.canvas,"pointerdown",this.handleMouseDown),this.addEvent(this.canvas,"pointermove",this.handleMouseMove),this.addEvent(this.canvas,"pointerup",this.handleMouseUp),this.addEvent(this.canvas,"pointercancel",this.handleMouseUp),this.addEvent(window,"resize",this.setCanvasSize),this.addEvent(document,"keydown",this.onKeyDown)}var d=class{constructor(e){this.startX=0;this.startY=0;this.isDrawing=!1;this.annotationTool=e}get ctx(){return this.annotationTool.ctx}onDeactivate(){}onActivate(){}reset(){this.startX=0,this.startY=0,this.isDrawing=!1}save(e){this.annotationTool.addShape(e)}};var g=class extends d{constructor(){super(...arguments);this.name="rectangle"}normalize(t,n,i){return{...t,x:t.x/n,y:t.y/i,width:t.width/n,height:t.height/i}}onPointerDown(t){let{x:n,y:i}=this.annotationTool.getRelativeCoords(t);this.startX=n,this.startY=i,this.isDrawing=!0}onPointerMove(t){if(!this.isDrawing)return;let{x:n,y:i}=this.annotationTool.getRelativeCoords(t);this.drawRectangle(this.startX,this.startY,n-this.startX,i-this.startY)}onPointerUp(t){if(!this.isDrawing)return;let{x:n,y:i}=this.annotationTool.getRelativeCoords(t);this.save({type:"rectangle",x:this.startX,y:this.startY,width:n-this.startX,height:i-this.startY,strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth}),this.drawRectangle(this.startX,this.startY,n-this.startX,i-this.startY),this.isDrawing=!1}drawRectangle(t,n,i,s){this.ctx.beginPath(),this.ctx.rect(t,n,i,s),this.ctx.stroke()}draw(t){this.drawRectangle(t.x,t.y,t.width,t.height)}};var x=class extends d{constructor(){super(...arguments);this.name="circle"}normalize(t,n,i){return{...t,x:t.x/n,y:t.y/i,radius:t.radius/n}}onPointerDown(t){let{x:n,y:i}=this.annotationTool.getRelativeCoords(t);this.startX=n,this.startY=i,this.isDrawing=!0}onPointerMove(t){if(!this.isDrawing)return;let{x:n,y:i}=this.annotationTool.getRelativeCoords(t),s=Math.sqrt(Math.pow(n-this.startX,2)+Math.pow(i-this.startY,2));this.drawCircle(this.startX,this.startY,s)}onPointerUp(t){if(!this.isDrawing)return;let{x:n,y:i}=this.annotationTool.getRelativeCoords(t),s=Math.sqrt(Math.pow(n-this.startX,2)+Math.pow(i-this.startY,2));this.save({type:"circle",x:this.startX,y:this.startY,radius:s,strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth}),this.drawCircle(this.startX,this.startY,s),this.isDrawing=!1}drawCircle(t,n,i){this.ctx.beginPath(),this.ctx.arc(t,n,i,0,2*Math.PI),this.ctx.stroke()}draw(t){this.drawCircle(t.x,t.y,t.radius)}};var y=class{constructor(e,t){this.x=e;this.y=t}distanceToLine(e,t){let n=t.x-e.x,i=t.y-e.y,s=Math.abs(i*this.x-n*this.y+t.x*e.y-t.y*e.x),r=Math.sqrt(i*i+n*n);return s/r}};function f(o,e){if(o.length<=2)return o;let t=o[0],n=o[o.length-1],i=-1,s=0;for(let r=1;r<o.length-1;r++){let l=o[r].distanceToLine(t,n);l>s&&(i=r,s=l)}if(s>e){let r=f(o.slice(0,i+1),e),l=f(o.slice(i),e);return r.slice(0,r.length-1).concat(l)}else return[t,n]}var w=class extends d{constructor(){super(...arguments);this.name="curve";this.curvePoints=[]}normalize(t,n,i){return{...t,points:t.points.map(s=>({x:s.x/n,y:s.y/i}))}}draw(t){this.drawCurve(t)}reset(){super.reset(),this.curvePoints=[]}onPointerDown(t){if(this.isDrawing)return;let{x:n,y:i}=this.annotationTool.getRelativeCoords(t);this.curvePoints=[],this.startX=n,this.startY=i,this.isDrawing=!0,this.curvePoints.push({x:n,y:i})}onPointerMove(t){if(!this.isDrawing)return;let{x:n,y:i}=this.annotationTool.getRelativeCoords(t);this.curvePoints.push({x:n,y:i}),this.drawCurve({points:this.curvePoints})}onPointerUp(t){if(!this.isDrawing)return;let{x:n,y:i}=this.annotationTool.getRelativeCoords(t);this.curvePoints.push({x:n,y:i});let s=this.curvePoints.map(c=>new y(c.x,c.y)),a={type:"curve",points:f(s,2).map(c=>({x:c.x,y:c.y})),strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth};this.save(a),this.curvePoints=[],this.isDrawing=!1}drawCurve(t){this.ctx.beginPath(),this.ctx.moveTo(t.points[0].x,t.points[0].y);for(let n=1;n<t.points.length-1;n++){let i=t.points[n],s=t.points[n+1];this.ctx.quadraticCurveTo(i.x,i.y,s.x,s.y)}this.ctx.stroke()}};var T=class extends d{constructor(){super(...arguments);this.name="line"}normalize(t,n,i){return{...t,x1:t.x1/n,y1:t.y1/i,x2:t.x2/n,y2:t.y2/i}}onPointerDown(t){let{x:n,y:i}=this.annotationTool.getRelativeCoords(t);this.startX=n,this.startY=i,this.isDrawing=!0}onPointerMove(t){if(!this.isDrawing)return;let{x:n,y:i}=this.annotationTool.getRelativeCoords(t);this.drawLine(this.startX,this.startY,n,i)}onPointerUp(t){if(!this.isDrawing)return;let{x:n,y:i}=this.annotationTool.getRelativeCoords(t);this.save({type:"line",x1:this.startX,y1:this.startY,x2:n,y2:i,fillStyle:this.ctx.fillStyle,strokeStyle:this.ctx.strokeStyle,lineWidth:this.ctx.lineWidth}),this.drawLine(this.startX,this.startY,n,i),this.isDrawing=!1}drawLine(t,n,i,s){this.ctx.beginPath(),this.ctx.moveTo(t,n),this.ctx.lineTo(i,s),this.ctx.stroke()}draw(t){this.drawLine(t.x1,t.y1,t.x2,t.y2)}};var E=class extends d{constructor(){super(...arguments);this.name="arrow"}normalize(t,n,i){return{...t,x1:t.x1/n,y1:t.y1/i,x2:t.x2/n,y2:t.y2/i}}draw(t){this.drawArrow(t.x1,t.y1,t.x2,t.y2)}onPointerDown(t){let{x:n,y:i}=this.annotationTool.getRelativeCoords(t);this.startX=n,this.startY=i,this.isDrawing=!0}onPointerMove(t){if(!this.isDrawing)return;let{x:n,y:i}=this.annotationTool.getRelativeCoords(t);this.drawArrow(this.startX,this.startY,n,i)}onPointerUp(t){if(!this.isDrawing)return;this.isDrawing=!1;let{x:n,y:i}=this.annotationTool.getRelativeCoords(t);this.save({type:"arrow",x1:this.startX,y1:this.startY,x2:n,y2:i,strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth})}drawArrow(t,n,i,s){let r=10+2.5*this.ctx.lineWidth,l=Math.PI/6,u=Math.atan2(s-n,i-t);this.ctx.beginPath(),this.ctx.moveTo(t,n),this.ctx.lineTo(i,s),this.ctx.stroke(),this.ctx.beginPath(),this.ctx.moveTo(i,s),this.ctx.lineTo(i-r*Math.cos(u+l),s-r*Math.sin(u+l)),this.ctx.moveTo(i,s),this.ctx.lineTo(i-r*Math.cos(u-l),s-r*Math.sin(u-l)),this.ctx.stroke()}};var k=class extends d{constructor(){super(...arguments);this.name="text"}onActivate(){this.annotationTool.canvas.style.cursor="text",this.isDrawing=!0}onDeactivate(){this.annotationTool.canvas.style.cursor="default",this.isDrawing=!1}draw(t){this.drawText(t.x,t.y,t.text)}drawText(t,n,i){let s=16+this.ctx.lineWidth*.5;this.ctx.font=`${s}px Helvetica Neue, Arial`,this.ctx.fillText(i,t,n)}onPointerDown(t){let{x:n,y:i}=this.annotationTool.getRelativeCoords(t);this.startX=n,this.startY=i}onPointerMove(t){let{x:n,y:i}=this.annotationTool.getRelativeCoords(t);this.ctx.beginPath(),this.ctx.arc(n,i,5,0,2*Math.PI),this.ctx.fill()}normalize(t,n,i){return{...t,x:t.x/n,y:t.y/i}}onPointerUp(t){let{x:n,y:i}=this.annotationTool.getRelativeCoords(t),s=prompt("Enter the text to be drawn:");s!==null&&this.save({type:"text",x:n,y:i,text:s,strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth})}};var b=class extends d{constructor(){super(...arguments);this.name="eraser"}normalize(t,n,i){return{...t,x:t.x/n,y:t.y/i,width:t.width/n,height:t.height/i}}draw(t){this.drawEraser(t.x,t.y,t.width,t.height)}onPointerDown(t){let{x:n,y:i}=this.annotationTool.getRelativeCoords(t);this.startX=n,this.startY=i,this.isDrawing=!0}onPointerMove(t){if(!this.isDrawing)return;let{x:n,y:i}=this.annotationTool.getRelativeCoords(t);this.ctx.save(),this.ctx.strokeStyle="rgba(255, 255, 255, 0.5)",this.ctx.lineWidth=1,this.ctx.fillStyle="rgba(255, 255, 255, 0.3)",this.ctx.fillRect(this.startX,this.startY,n-this.startX,i-this.startY),this.ctx.strokeRect(this.startX,this.startY,n-this.startX,i-this.startY),this.ctx.restore()}onPointerUp(t){if(!this.isDrawing)return;this.isDrawing=!1;let{x:n,y:i}=this.annotationTool.getRelativeCoords(t);this.save({type:"eraser",x:this.startX,y:this.startY,width:n-this.startX,height:i-this.startY,strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth})}drawEraser(t,n,i,s){this.ctx.clearRect(t,n,i,s)}};var M=[g,x,T,E,k,b,w];function D(o,e){let t,n,i,s=[],r=!0;function l(c,h){let p=Math.abs(h.mediaTime-t),P=Math.abs(h.presentedFrames-n),m=p/P;m&&m<1&&r&&s.length<50&&o.playbackRate===1&&document.hasFocus()&&(s.push(m),i=Math.round(1/a()),e(i,s.length*2)),r=!0,t=h.mediaTime,n=h.presentedFrames,o.requestVideoFrameCallback(l)}o.requestVideoFrameCallback(l);let u=()=>{s.pop(),r=!1};o.addEventListener("seeked",u);function a(){return s.reduce((c,h)=>c+h)/s.length}return()=>{o.removeEventListener("seeked",u)}}var R=25,v=class{constructor(e){this.isMouseDown=!1;this.activeTimeFrame=1;this.buttons=[];this.destructors=[];this.plugins=[];this.isDestroyed=!1;this.timeStack=new Map;this.undoTimeStack=new Map;this.annotatedFrameCoordinates=[];this.fps=R;this.plugins=M.map(t=>new t(this)),this.init(e)}prevFrame(){this.playbackFrame=Math.max(1,this.activeTimeFrame-1)}nextFrame(){this.playbackFrame=Math.min(this.videoElement.duration*this.fps,this.activeTimeFrame+1)}get selectedColor(){return this.colorPicker.value}get selectedStrokeSize(){return this.strokeSizePicker.valueAsNumber}get currentTool(){return this._currentTool}set currentTool(e){let t=this._currentTool;t&&(this.getButtonForTool(t).classList.remove("active"),this.pluginForTool(t).onDeactivate()),this._currentTool=e,this.canvas.style.cursor=e?"pointer":"default",e&&(this.getButtonForTool(e).classList.add("active"),this.pluginForTool(e).onActivate())}enableFrameRateDetection(){if(this.destructors.find(n=>n.name==="frameRateDetector"))return;let e=this.videoElement;if(e.tagName==="IMG")return;let t=D(e,n=>{this.fps=n});Object.defineProperty(t,"name",{value:"frameRateDetector"}),this.destructors.push(t)}get playbackFrame(){if(this.videoElement instanceof HTMLImageElement)return 1;let e=Math.round(this.videoElement.currentTime*this.fps);return Math.max(1,e)}set playbackFrame(e){this.videoElement instanceof HTMLImageElement||(this.videoElement.currentTime=e/this.fps)}get canvasWidth(){return this.canvas.width/this.pixelRatio}get canvasHeight(){return this.canvas.height/this.pixelRatio}get progressBarCoordinates(){let n=this.canvasWidth-5-55,i=5,s=this.canvasHeight-10;return{x:i,y:s,width:n,height:10}}get videoClientRect(){return this.videoElement.getBoundingClientRect()}get shapes(){return this.timeStack.has(this.activeTimeFrame)||this.timeStack.set(this.activeTimeFrame,[]),this.timeStack.get(this.activeTimeFrame)}set shapes(e){this.timeStack.set(this.activeTimeFrame,e)}get undoStack(){return this.undoTimeStack.has(this.activeTimeFrame)||this.undoTimeStack.set(this.activeTimeFrame,[]),this.undoTimeStack.get(this.activeTimeFrame)}set undoStack(e){this.undoTimeStack.set(this.activeTimeFrame,e)}get pixelRatio(){return window.devicePixelRatio||1}hide(){this.stopAnnotationsAsVideo(),this.hideControls(),this.hideCanvas()}showControls(){this.uiContainer.style.display="block"}hideControls(){this.uiContainer.style.display="none"}showCanvas(){this.canvas.style.display="block"}hideCanvas(){this.canvas.style.display="none"}show(){this.stopAnnotationsAsVideo(),this.activeTimeFrame=this.playbackFrame,this.showCanvas(),this.showControls(),this.redrawFullCanvas()}setCanvasSettings(){this.ctx.strokeStyle=this.selectedColor,this.ctx.fillStyle=this.selectedColor,this.ctx.lineWidth=this.selectedStrokeSize}pluginForTool(e){if(this.isDestroyed)throw new Error("AnnotationTool is destroyed");let t=this.plugins.find(n=>n.name===e);if(!t)throw new Error(`No plugin found for tool ${e}`);return t}getButtonForTool(e){return this.buttons.find(t=>t.dataset.tool===e)}bindContext(){this.handleMouseDown=this.handleMouseDown.bind(this),this.handleMouseMove=this.handleMouseMove.bind(this),this.handleMouseUp=this.handleMouseUp.bind(this),this.setCanvasSize=this.setCanvasSize.bind(this),this.onKeyDown=this.onKeyDown.bind(this)}initProperties(){this.isDestroyed=!1,this.currentTool=null,this.shapes=[]}init(e){this.videoElement=e,this.bindContext(),this.initCanvas(),this.initUI(),this.initProperties(),this.setCanvasSize(),this.fillCanvas(),this.setCanvasSettings(),this.currentTool="curve"}addEvent(e,t,n){let i=s=>{this.isDestroyed||n(s)};e.addEventListener(t,i),this.destructors.push(()=>{e.removeEventListener(t,i)})}initCanvas(){throw new Error("Method not implemented.")}onKeyDown(e){(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="z"&&this.handleUndo()}handleUndo(){this.undoStack.length>0&&(this.shapes=this.undoStack.pop(),this.redrawFullCanvas())}destroy(){if(this.isDestroyed)return;this.destructors.forEach(i=>i()),this.stopAnnotationsAsVideo(),this.destructors=[],this._currentTool=null,this.plugins.forEach(i=>i.reset()),this.annotatedFrameCoordinates=[],this.setFrameRate(R),this.cleanFrameStacks();let e=this.strokeSizePicker.parentElement;e?.parentNode?.removeChild(e);let t=this.colorPicker.parentElement;t?.parentNode?.removeChild(t),this.buttons.forEach(i=>{i.parentNode?.removeChild(i)}),this.buttons=[],this.uiContainer.parentNode?.removeChild(this.uiContainer),this.canvas.parentNode?.removeChild(this.canvas),["strokeSizePicker","colorPicker","uiContainer","canvas","ctx","videoElement"].forEach(i=>{delete this[i]}),this.activeTimeFrame=0}setCanvasSize(){let e=this.videoClientRect;this.canvas.width=e.width*this.pixelRatio,this.canvas.height=e.height*this.pixelRatio,this.canvas.style.width=`${e.width}px`,this.canvas.style.height=`${e.height}px`,this.ctx.scale(this.pixelRatio,this.pixelRatio),this.redrawFullCanvas(),this.setCanvasSettings()}isMultiTouch(e){return e.pointerType==="touch"&&e.isPrimary===!1}addShape(e){let t=this.serialize([e])[0];console.log("serializedShape",t),this.undoStack.push([...this.shapes]),this.shapes.push(t)}serialize(e=this.shapes){let t=this.canvas.width,n=this.canvas.height;return e.map(i=>this.pluginForTool(i.type).normalize(i,t,n))}deserialize(e){let t=1/this.canvas.width,n=1/this.canvas.height;return e.map(i=>this.pluginForTool(i.type).normalize(i,t,n))}getRelativeCoords(e){let t=this.canvas.getBoundingClientRect();return{x:this.getEventX(e)-t.left,y:this.getEventY(e)-t.top}}handleMouseDown(e){if(e.preventDefault(),this.isMouseDown=!0,this.isMultiTouch(e))return;let t=this.frameFromProgressBar(e);if(t){let n=this.getAnnotationFrame(e);n!==null?this.playbackFrame=n:this.playbackFrame=t;return}this.currentTool&&this.pluginForTool(this.currentTool).onPointerDown(e)}get isDrawing(){return this.currentTool?this.pluginForTool(this.currentTool).isDrawing:!1}handleMouseMove(e){if(e.preventDefault(),!this.isMultiTouch(e)){if(this.isMouseDown){let t=this.frameFromProgressBar(e);if(t!==null&&!this.isDrawing){this.playbackFrame=t;return}else this.hideControls(),this.clearCanvas(),this.addVideoOverlay(),this.drawShapesOverlay()}else this.redrawFullCanvas();this.currentTool&&this.pluginForTool(this.currentTool).onPointerMove(e)}}getEventX(e){return e.clientX}getEventY(e){return e.clientY}handleMouseUp(e){this.isMouseDown=!1,this.showControls(),!this.isMultiTouch(e)&&(this.currentTool&&this.pluginForTool(this.currentTool).onPointerUp(e),this.redrawFullCanvas())}focusOnMediaNode(){this.videoElement.focus()}drawShapesOverlay(){let e={strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth};this.deserialize(this.shapes).forEach(t=>{this.ctx.strokeStyle=t.strokeStyle,this.ctx.fillStyle=t.fillStyle,this.ctx.lineWidth=t.lineWidth,this.pluginForTool(t.type).draw(t)}),this.ctx.strokeStyle=e.strokeStyle,this.ctx.fillStyle=e.fillStyle,this.ctx.lineWidth=e.lineWidth}clearCanvas(){this.ctx.clearRect(0,0,this.canvasWidth,this.canvasHeight)}imageForCapture(){try{this.clearCanvas(),this.addVideoOverlay(),this.addFrameSquareOverlay(),this.drawShapesOverlay();let e=new Image;return e.src=this.canvas.toDataURL("image/png"),e}catch(e){return console.error(e),null}}redrawFullCanvas(){this.clearCanvas(),this.addVideoOverlay(),this.addFrameSquareOverlay(),this.addProgressBarOverlay(),this.drawShapesOverlay()}replaceFrame(e,t){this.timeStack.set(e,t)}addShapesToFrame(e,t){let n=this.timeStack.get(e)||[];this.timeStack.set(e,[...n,...t])}setFrameRate(e){this.destructors.find(t=>t.name==="frameRateDetector")?.(),this.fps=e}saveCurrentFrame(){return{frame:this.playbackFrame,version:1,fps:this.fps,shapes:this.shapes}}addFrameSquareOverlay(e=this.activeTimeFrame){throw new Error("Method not implemented.")}addVideoOverlay(){throw new Error("Method not implemented.")}cleanFrameStacks(){this.timeStack.clear(),this.undoTimeStack.clear()}loadAllFrames(e){this.cleanFrameStacks(),e.forEach(t=>{this.timeStack.set(t.frame,t.shapes)})}saveAllFrames(){return Array.from(this.timeStack.keys()).filter(i=>this.timeStack.get(i)?.length).map(i=>({frame:i,fps:this.fps,version:1,shapes:this.timeStack.get(i)??[]}))}getAnnotationFrame(e){let t=e.offsetX,n=e.offsetY,i=5;return this.annotatedFrameCoordinates.find(r=>t>=r.x-i&&t<=r.x+i&&n>=r.y-i&&n<=r.y+i)?.frame??null}frameFromProgressBar(e){let t=this.videoElement;if(t.tagName!=="VIDEO")return null;let{x:n,width:i,height:s,y:r}=this.progressBarCoordinates,l=e.offsetX,u=e.offsetY;return l>=n&&l<=n+i&&u>=r&&u<=r+s?Math.ceil((l-n)/i*(t.duration*this.fps)):null}addProgressBarOverlay(){throw new Error("Method not implemented.")}initUI(){throw new Error("Method not implemented.")}stopAnnotationsAsVideo(){clearTimeout(this.playTimeout)}hasAnnotationsForFrame(e){if(this.timeStack.has(e)){let t=this.timeStack.get(e);return t&&t.length>0}return!1}playAnnotationsAsVideo(){this.stopAnnotationsAsVideo();let e=this.playbackFrame;this.hasAnnotationsForFrame(e)?(this.showCanvas(),this.activeTimeFrame=e,this.clearCanvas(),this.drawShapesOverlay()):this.hideCanvas();let t=1e3/this.fps;this.playTimeout=window.setTimeout(()=>{this.playAnnotationsAsVideo()},t)}fillCanvas(){this.ctx.save(),this.ctx.fillStyle="rgba(0, 0, 0, 0.5)",this.ctx.fillRect(0,0,this.canvasWidth,this.canvasHeight),this.ctx.restore()}};function A(o=this.activeTimeFrame){this.ctx.save(),this.ctx.fillStyle="rgba(0, 0, 0, 0.5)";let e=50,t=30,n=20;this.ctx.fillRect(this.canvasWidth-e,this.canvasHeight-t,e,t),this.ctx.fillStyle="white",this.ctx.font=`${n}px sans-serif`,this.ctx.fillText(`${o}`.padStart(3,"0"),this.canvasWidth-40,this.canvasHeight-7),this.ctx.restore()}function B(){this.ctx.drawImage(this.videoElement,0,0,this.canvas.width/this.pixelRatio,this.canvas.height/this.pixelRatio)}function L(){let o=this.videoElement;if(o.tagName!=="VIDEO")return;this.annotatedFrameCoordinates=[];let t=Array.from(this.timeStack.keys()).filter(m=>this.timeStack.get(m)?.length),n=o.duration*this.fps,{x:i,width:s,height:r,y:l}=this.progressBarCoordinates,u=t.map(m=>Math.ceil(m/n*s));this.ctx.save(),this.ctx.fillStyle="rgba(0, 0, 0, 0.5)",this.ctx.fillRect(i,l,s,r),this.ctx.fillStyle="#F3CE32";let a=8;u.forEach((m,V)=>{this.ctx.beginPath();let S=i+m,C=this.canvasHeight-5;this.ctx.fillRect(S-a/2,C-a/2,a,a),this.annotatedFrameCoordinates.push({x:S,y:C,frame:t[V]})});let c=this.playbackFrame,h=Math.ceil(c/n*s)+i;this.ctx.fillStyle="white",this.ctx.beginPath();let p=h,P=this.canvasHeight-5;this.ctx.beginPath(),this.ctx.fillRect(p-a/2,P-a/2,a,a),this.ctx.fill(),this.ctx.restore()}v.prototype.initUI=I;v.prototype.initCanvas=F;v.prototype.addFrameSquareOverlay=A;v.prototype.addVideoOverlay=B;v.prototype.addProgressBarOverlay=L;var $t=v;export{$t as SmAnnotate};
