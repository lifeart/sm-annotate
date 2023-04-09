"use strict";(()=>{var z="#F3CE32";function M(){let a=document.createElement("div");a.style.position="absolute",a.style.top="0",a.style.left="0",a.style.zIndex="2",this.canvas.parentNode?.insertBefore(a,this.canvas);let e=this.videoElement.tagName==="VIDEO"?this.videoElement:null;this.uiContainer=a;let t=(s,h)=>{let d=document.createElement("button");if(d.type="button",d.innerHTML=s,d.style.margin="5px",a.appendChild(d),this.buttons.push(d),typeof h=="function")this.addEvent(d,"click",h);else{d.dataset.tool=h;let m=()=>{this.currentTool===h?this.currentTool=null:this.currentTool=h};this.addEvent(d,"click",m)}return d},n=()=>{let s=document.createElement("div");return s.style.display="inline-flex",s.style.alignItems="center",s.style.margin="5px",a.appendChild(s),s};t('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>',"rectangle"),t('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>',"circle"),t('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.3 8.7 8.7 21.3c-1 1-2.5 1-3.4 0l-2.6-2.6c-1-1-1-2.5 0-3.4L15.3 2.7c1-1 2.5-1 3.4 0l2.6 2.6c1 1 1 2.5 0 3.4Z"></path><path d="m7.5 10.5 2 2"></path><path d="m10.5 7.5 2 2"></path><path d="m13.5 4.5 2 2"></path><path d="m4.5 13.5 2 2"></path></svg>',"line"),t('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"></path><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"></path></svg>',"curve"),t('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>',"arrow"),t('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>',"text"),t('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"></path><path d="M22 21H7"></path><path d="m5 11 9 9"></path></svg>',"eraser"),t('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 9 2 12 5 15"></polyline><polyline points="9 5 12 2 15 5"></polyline><polyline points="15 19 12 22 9 19"></polyline><polyline points="19 9 22 12 19 15"></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line></svg>',"move"),t('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"></path><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path></svg>',()=>{this.handleUndo()}),e&&(t('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>',()=>{this.prevFrame()}),t('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>',()=>{this.nextFrame()}),t('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>',()=>{e.play(),e.focus()}));let i=document.createElement("input");i.type="color",i.value=z,i.style.margin="5px",this.colorPicker=i,a.appendChild(i);let o=n(),r=document.createElement("input");r.type="number",r.step="1",r.min="1",r.max="10",r.value="5",r.style.margin="5px",o.appendChild(r);let l=s=>{this.ctx.lineWidth=s.target.valueAsNumber,this.focusOnMediaNode()};this.addEvent(r,"input",l);let c=s=>{this.ctx.strokeStyle=s.target.value,this.ctx.fillStyle=s.target.value,this.focusOnMediaNode()};this.addEvent(i,"input",c),this.colorPicker=i,this.strokeSizePicker=r,e&&(this.hide(),this.addEvent(e,"pause",()=>{this.show()}),this.addEvent(e,"seek",()=>{e.paused&&this.show()}),this.addEvent(e,"timeupdate",()=>{e.paused&&this.show()}),this.addEvent(e,"error",()=>{this.hide()}),this.addEvent(e,"stalled",()=>{this.hide()}),this.addEvent(e,"waiting",()=>{this.hide()}),this.addEvent(e,"ended",()=>{this.hide()}),this.addEvent(e,"play",()=>{this.hideControls(),this.playAnnotationsAsVideo()}),this.addEvent(document,"copy",s=>{s.preventDefault(),s.stopPropagation(),s.stopImmediatePropagation(),s.clipboardData?.setData("application/json",JSON.stringify(this.saveCurrentFrame()))}),this.addEvent(document,"cut",s=>{s.preventDefault(),s.stopPropagation(),s.stopImmediatePropagation();let h=this.saveCurrentFrame();this.replaceFrame(this.playbackFrame,[]),this.redrawFullCanvas(),s.clipboardData?.setData("application/json",JSON.stringify(h))}),this.addEvent(document,"paste",s=>{if((s.clipboardData?.types??[]).includes("application/json"))s.preventDefault(),s.stopPropagation(),s.stopImmediatePropagation();else return;let d=s.clipboardData?.getData("application/json");if(!d)return;let m=JSON.parse(d);m&&m.shapes&&m.version===1&&(this.addShapesToFrame(this.playbackFrame,m.shapes),this.redrawFullCanvas())}),this.addEvent(document,"click",s=>{this.uiContainer.contains(s.target)||e.paused||(this.currentTool=null,e.pause())}),this.addEvent(document,"keydown",s=>{s.key==="ArrowLeft"||s.key==="ArrowRight"?(s.preventDefault(),s.stopPropagation(),s.stopImmediatePropagation(),s.key==="ArrowLeft"?this.prevFrame():s.key==="ArrowRight"&&this.nextFrame()):s.code==="Space"&&(s.preventDefault(),s.stopPropagation(),s.stopImmediatePropagation(),e.paused?e.play():e.pause())}))}function D(){this.canvas=document.createElement("canvas"),this.ctx=this.canvas.getContext("2d"),this.videoElement.parentNode?.insertBefore(this.canvas,this.videoElement.nextSibling),this.canvas.style.position="absolute",this.canvas.style.top="0",this.canvas.style.left="0",this.canvas.style.zIndex="1",this.addEvent(this.canvas,"pointerdown",this.handleMouseDown),this.addEvent(this.canvas,"pointermove",this.handleMouseMove),this.addEvent(this.canvas,"pointerup",this.handleMouseUp),this.addEvent(this.canvas,"pointercancel",this.handleMouseUp),this.addEvent(window,"resize",this.setCanvasSize),this.addEvent(document,"keydown",this.onKeyDown)}var u=class{constructor(e){this.startX=0;this.startY=0;this.isDrawing=!1;this.annotationTool=e}get ctx(){return this.annotationTool.ctx}onDeactivate(){}onActivate(){}reset(){this.startX=0,this.startY=0,this.isDrawing=!1}save(e){this.annotationTool.addShape(e)}};var f=class extends u{constructor(){super(...arguments);this.name="rectangle"}normalize(t,n,i){return{...t,x:t.x/n,y:t.y/i,width:t.width/n,height:t.height/i}}onPointerDown(t){let{x:n,y:i}=this.annotationTool.getRelativeCoords(t);this.startX=n,this.startY=i,this.isDrawing=!0}onPointerMove(t){if(!this.isDrawing)return;let{x:n,y:i}=this.annotationTool.getRelativeCoords(t);this.drawRectangle(this.startX,this.startY,n-this.startX,i-this.startY)}onPointerUp(t){if(!this.isDrawing)return;let{x:n,y:i}=this.annotationTool.getRelativeCoords(t);this.save({type:"rectangle",x:this.startX,y:this.startY,width:n-this.startX,height:i-this.startY,strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth}),this.drawRectangle(this.startX,this.startY,n-this.startX,i-this.startY),this.isDrawing=!1}drawRectangle(t,n,i,o){this.ctx.beginPath(),this.ctx.rect(t,n,i,o),this.ctx.stroke()}draw(t){this.drawRectangle(t.x,t.y,t.width,t.height)}};var x=class extends u{constructor(){super(...arguments);this.name="circle"}normalize(t,n,i){return{...t,x:t.x/n,y:t.y/i,radius:t.radius/n}}onPointerDown(t){let{x:n,y:i}=this.annotationTool.getRelativeCoords(t);this.startX=n,this.startY=i,this.isDrawing=!0}onPointerMove(t){if(!this.isDrawing)return;let{x:n,y:i}=this.annotationTool.getRelativeCoords(t),o=Math.sqrt(Math.pow(n-this.startX,2)+Math.pow(i-this.startY,2));this.drawCircle(this.startX,this.startY,o)}onPointerUp(t){if(!this.isDrawing)return;let{x:n,y:i}=this.annotationTool.getRelativeCoords(t),o=Math.sqrt(Math.pow(n-this.startX,2)+Math.pow(i-this.startY,2));this.save({type:"circle",x:this.startX,y:this.startY,radius:o,strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth}),this.drawCircle(this.startX,this.startY,o),this.isDrawing=!1}drawCircle(t,n,i){this.ctx.beginPath(),this.ctx.arc(t,n,i,0,2*Math.PI),this.ctx.stroke()}draw(t){this.drawCircle(t.x,t.y,t.radius)}};var w=class{constructor(e,t){this.x=e;this.y=t}distanceToLine(e,t){let n=t.x-e.x,i=t.y-e.y,o=Math.abs(i*this.x-n*this.y+t.x*e.y-t.y*e.x),r=Math.sqrt(i*i+n*n);return o/r}};function T(a,e){if(a.length<=2)return a;let t=a[0],n=a[a.length-1],i=-1,o=0;for(let r=1;r<a.length-1;r++){let l=a[r].distanceToLine(t,n);l>o&&(i=r,o=l)}if(o>e){let r=T(a.slice(0,i+1),e),l=T(a.slice(i),e);return r.slice(0,r.length-1).concat(l)}else return[t,n]}var E=class extends u{constructor(){super(...arguments);this.name="curve";this.curvePoints=[]}normalize(t,n,i){return{...t,points:t.points.map(o=>({x:o.x/n,y:o.y/i}))}}draw(t){this.drawCurve(t)}reset(){super.reset(),this.curvePoints=[]}onPointerDown(t){if(this.isDrawing)return;let{x:n,y:i}=this.annotationTool.getRelativeCoords(t);this.curvePoints=[],this.startX=n,this.startY=i,this.isDrawing=!0,this.curvePoints.push({x:n,y:i})}onPointerMove(t){if(!this.isDrawing)return;let{x:n,y:i}=this.annotationTool.getRelativeCoords(t);this.curvePoints.push({x:n,y:i}),this.drawCurve({points:this.curvePoints,lineWidth:this.ctx.lineWidth})}onPointerUp(t){if(!this.isDrawing)return;let{x:n,y:i}=this.annotationTool.getRelativeCoords(t);this.curvePoints.push({x:n,y:i});let o=this.curvePoints.map(h=>new w(h.x,h.y)),s={type:"curve",points:T(o,2).map(h=>({x:h.x,y:h.y})),strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth};this.save(s),this.curvePoints=[],this.isDrawing=!1}drawCurve(t){if(t.points.length===2&&t.points[0].x===t.points[1].x&&t.points[0].y===t.points[1].y){let n=t.lineWidth/4,i=0,o=2*Math.PI;this.ctx.beginPath(),this.ctx.arc(t.points[0].x,t.points[0].y,n,i,o),this.ctx.stroke()}else{this.ctx.beginPath(),this.ctx.moveTo(t.points[0].x,t.points[0].y);for(let n=1;n<t.points.length-1;n++){let i=t.points[n],o=t.points[n+1];this.ctx.quadraticCurveTo(i.x,i.y,o.x,o.y)}this.ctx.stroke()}}};var S=class extends u{constructor(){super(...arguments);this.name="line"}normalize(t,n,i){return{...t,x1:t.x1/n,y1:t.y1/i,x2:t.x2/n,y2:t.y2/i}}onPointerDown(t){let{x:n,y:i}=this.annotationTool.getRelativeCoords(t);this.startX=n,this.startY=i,this.isDrawing=!0}onPointerMove(t){if(!this.isDrawing)return;let{x:n,y:i}=this.annotationTool.getRelativeCoords(t);this.drawLine(this.startX,this.startY,n,i)}onPointerUp(t){if(!this.isDrawing)return;let{x:n,y:i}=this.annotationTool.getRelativeCoords(t);this.save({type:"line",x1:this.startX,y1:this.startY,x2:n,y2:i,fillStyle:this.ctx.fillStyle,strokeStyle:this.ctx.strokeStyle,lineWidth:this.ctx.lineWidth}),this.drawLine(this.startX,this.startY,n,i),this.isDrawing=!1}drawLine(t,n,i,o){this.ctx.beginPath(),this.ctx.moveTo(t,n),this.ctx.lineTo(i,o),this.ctx.stroke()}draw(t){this.drawLine(t.x1,t.y1,t.x2,t.y2)}};var b=class extends u{constructor(){super(...arguments);this.name="arrow"}normalize(t,n,i){return{...t,x1:t.x1/n,y1:t.y1/i,x2:t.x2/n,y2:t.y2/i}}draw(t){this.drawArrow(t.x1,t.y1,t.x2,t.y2)}onPointerDown(t){let{x:n,y:i}=this.annotationTool.getRelativeCoords(t);this.startX=n,this.startY=i,this.isDrawing=!0}onPointerMove(t){if(!this.isDrawing)return;let{x:n,y:i}=this.annotationTool.getRelativeCoords(t);this.drawArrow(this.startX,this.startY,n,i)}onPointerUp(t){if(!this.isDrawing)return;this.isDrawing=!1;let{x:n,y:i}=this.annotationTool.getRelativeCoords(t);this.save({type:"arrow",x1:this.startX,y1:this.startY,x2:n,y2:i,strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth})}drawArrow(t,n,i,o){let r=10+2.5*this.ctx.lineWidth,l=Math.PI/6,c=Math.atan2(o-n,i-t);this.ctx.beginPath(),this.ctx.moveTo(t,n),this.ctx.lineTo(i,o),this.ctx.stroke(),this.ctx.beginPath(),this.ctx.moveTo(i,o),this.ctx.lineTo(i-r*Math.cos(c+l),o-r*Math.sin(c+l)),this.ctx.moveTo(i,o),this.ctx.lineTo(i-r*Math.cos(c-l),o-r*Math.sin(c-l)),this.ctx.stroke()}};var P=class extends u{constructor(){super(...arguments);this.name="text"}onActivate(){this.annotationTool.canvas.style.cursor="text",this.isDrawing=!0}onDeactivate(){this.annotationTool.canvas.style.cursor="default",this.isDrawing=!1}draw(t){this.drawText(t.x,t.y,t.text)}drawText(t,n,i){let o=16+this.ctx.lineWidth*.5;this.ctx.font=`${o}px Helvetica Neue, Arial`,this.ctx.fillText(i,t,n)}onPointerDown(t){let{x:n,y:i}=this.annotationTool.getRelativeCoords(t);this.startX=n,this.startY=i}onPointerMove(t){let{x:n,y:i}=this.annotationTool.getRelativeCoords(t);this.ctx.beginPath(),this.ctx.arc(n,i,5,0,2*Math.PI),this.ctx.fill()}normalize(t,n,i){return{...t,x:t.x/n,y:t.y/i}}onPointerUp(t){let{x:n,y:i}=this.annotationTool.getRelativeCoords(t),o=prompt("Enter the text to be drawn:");o!==null&&this.save({type:"text",x:n,y:i,text:o,strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth})}};var k=class extends u{constructor(){super(...arguments);this.name="eraser"}normalize(t,n,i){return{...t,x:t.x/n,y:t.y/i,width:t.width/n,height:t.height/i}}draw(t){this.drawEraser(t.x,t.y,t.width,t.height)}onPointerDown(t){let{x:n,y:i}=this.annotationTool.getRelativeCoords(t);this.startX=n,this.startY=i,this.isDrawing=!0}onPointerMove(t){if(!this.isDrawing)return;let{x:n,y:i}=this.annotationTool.getRelativeCoords(t);this.ctx.save(),this.ctx.strokeStyle="rgba(255, 255, 255, 0.5)",this.ctx.lineWidth=1,this.ctx.fillStyle="rgba(255, 255, 255, 0.3)",this.ctx.fillRect(this.startX,this.startY,n-this.startX,i-this.startY),this.ctx.strokeRect(this.startX,this.startY,n-this.startX,i-this.startY),this.ctx.restore()}onPointerUp(t){if(!this.isDrawing)return;this.isDrawing=!1;let{x:n,y:i}=this.annotationTool.getRelativeCoords(t);this.save({type:"eraser",x:this.startX,y:this.startY,width:n-this.startX,height:i-this.startY,strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth})}drawEraser(t,n,i,o){this.ctx.clearRect(t,n,i,o)}};var C=class extends u{constructor(){super(...arguments);this.name="move";this.shape=null;this.lastDrawnShape=null;this.shapeRemoved=!1}normalize(t){return{...t}}onPointerDown(t){let{x:n,y:i}=this.annotationTool.getRelativeCoords(t),o=this.annotationTool.saveCurrentFrame().shapes.pop();o&&(this.shape=o,this.shapeRemoved=!1,this.lastDrawnShape=null,this.startX=n,this.startY=i,this.isDrawing=!0)}onPointerMove(t){if(!this.isDrawing||!this.shape)return;this.shapeRemoved||(this.annotationTool.removeLastShape(),this.shapeRemoved=!0);let{x:n,y:i}=this.annotationTool.getRelativeCoords(t),o=n-this.startX,r=i-this.startY;this.startX=n-o,this.startY=i-r;let l=["line","circle","rectangle","text","arrow","curve","eraser"],c=this.annotationTool.deserialize([this.shape])[0],s=JSON.parse(JSON.stringify(c));s.type==="line"?(s.x1+=o,s.y1+=r,s.x2+=o,s.y2+=r):s.type==="circle"||s.type==="rectangle"||s.type==="text"?(s.x+=o,s.y+=r):s.type==="arrow"?(s.x1+=o,s.y1+=r,s.x2+=o,s.y2+=r):s.type==="curve"?s.points.forEach(h=>{h.x+=o,h.y+=r}):s.type==="eraser"&&(s.x+=o,s.y+=r),this.lastDrawnShape=s,l.includes(s.type)&&this.annotationTool.pluginForTool(s.type).draw(s)}onPointerUp(t){!this.isDrawing||!this.lastDrawnShape||(this.lastDrawnShape&&(this.lastDrawnShape.fillStyle=this.annotationTool.ctx.fillStyle,this.lastDrawnShape.strokeStyle=this.annotationTool.ctx.strokeStyle,this.lastDrawnShape.lineWidth=this.annotationTool.ctx.lineWidth,this.save(this.lastDrawnShape)),this.isDrawing=!1,this.shape=null,this.shapeRemoved=!1,this.lastDrawnShape=null)}draw(){throw new Error("Method not implemented.")}reset(){this.isDrawing=!1,this.shape=null,this.lastDrawnShape=null,this.shapeRemoved=!1}};var B=[f,x,S,b,P,k,E,C];function R(a,e){let t,n,i,o=[],r=!0;function l(h,d){let m=Math.abs(d.mediaTime-t),y=Math.abs(d.presentedFrames-n),v=m/y;v&&v<1&&r&&o.length<50&&a.playbackRate===1&&document.hasFocus()&&(o.push(v),i=Math.round(1/s()),e(i,o.length*2)),r=!0,t=d.mediaTime,n=d.presentedFrames,a.requestVideoFrameCallback(l)}a.requestVideoFrameCallback(l);let c=()=>{o.pop(),r=!1};a.addEventListener("seeked",c);function s(){return o.reduce((h,d)=>h+d)/o.length}return()=>{a.removeEventListener("seeked",c)}}var A=25,g=class{constructor(e){this.isMouseDown=!1;this.activeTimeFrame=1;this.buttons=[];this.destructors=[];this.plugins=[];this.isDestroyed=!1;this.timeStack=new Map;this.undoTimeStack=new Map;this.annotatedFrameCoordinates=[];this.fps=A;this.lastNavigatedFrame=0;this.isProgressBarNavigation=!1;this.plugins=B.map(t=>new t(this)),this.init(e)}prevFrame(){this.playbackFrame=Math.max(1,this.activeTimeFrame-1)}nextFrame(){this.playbackFrame=Math.min(this.videoElement.duration*this.fps,this.activeTimeFrame+1)}get selectedColor(){return this.colorPicker.value}get selectedStrokeSize(){return this.strokeSizePicker.valueAsNumber}get currentTool(){return this._currentTool}set currentTool(e){let t=this._currentTool;t&&(this.getButtonForTool(t).classList.remove("active"),this.pluginForTool(t).onDeactivate()),this._currentTool=e,this.canvas.style.cursor=e?"pointer":"default",e&&(this.getButtonForTool(e).classList.add("active"),this.pluginForTool(e).onActivate())}enableFrameRateDetection(){if(this.destructors.find(n=>n.name==="frameRateDetector"))return;let e=this.videoElement;if(e.tagName==="IMG")return;let t=R(e,n=>{this.fps=n});Object.defineProperty(t,"name",{value:"frameRateDetector"}),this.destructors.push(t)}get playbackFrame(){if(this.videoElement instanceof HTMLImageElement)return 1;let e=Math.round(this.videoElement.currentTime*this.fps);return Math.max(1,e)}set playbackFrame(e){this.videoElement instanceof HTMLImageElement||(this.videoElement.currentTime=e/this.fps)}get canvasWidth(){return this.canvas.width/this.pixelRatio}get canvasHeight(){return this.canvas.height/this.pixelRatio}get isMobile(){return window.innerWidth<960}get progressBarCoordinates(){let e=this.isMobile?30:10,t=5,n=55,i=this.canvasWidth-t-n,o=t,r=this.canvasHeight-e;return{x:o,y:r,width:i,height:e}}get videoClientRect(){return this.videoElement.getBoundingClientRect()}get shapes(){return this.timeStack.has(this.activeTimeFrame)||this.timeStack.set(this.activeTimeFrame,[]),this.timeStack.get(this.activeTimeFrame)}set shapes(e){this.timeStack.set(this.activeTimeFrame,e)}get undoStack(){return this.undoTimeStack.has(this.activeTimeFrame)||this.undoTimeStack.set(this.activeTimeFrame,[]),this.undoTimeStack.get(this.activeTimeFrame)}set undoStack(e){this.undoTimeStack.set(this.activeTimeFrame,e)}get pixelRatio(){return window.devicePixelRatio||1}hide(){this.stopAnnotationsAsVideo(),this.hideControls(),this.hideCanvas()}showControls(){this.uiContainer.style.display="block"}hideControls(){this.uiContainer.style.display="none"}showCanvas(){this.canvas.style.display="block"}hideCanvas(){this.canvas.style.display="none"}show(){this.stopAnnotationsAsVideo(),this.activeTimeFrame=this.playbackFrame,this.showCanvas(),this.showControls(),this.redrawFullCanvas()}setCanvasSettings(){this.ctx.strokeStyle=this.selectedColor,this.ctx.fillStyle=this.selectedColor,this.ctx.lineWidth=this.selectedStrokeSize}pluginForTool(e){if(this.isDestroyed)throw new Error("AnnotationTool is destroyed");let t=this.plugins.find(n=>n.name===e);if(!t)throw new Error(`No plugin found for tool ${e}`);return t}getButtonForTool(e){return this.buttons.find(t=>t.dataset.tool===e)}bindContext(){this.handleMouseDown=this.handleMouseDown.bind(this),this.handleMouseMove=this.handleMouseMove.bind(this),this.handleMouseUp=this.handleMouseUp.bind(this),this.setCanvasSize=this.setCanvasSize.bind(this),this.onKeyDown=this.onKeyDown.bind(this)}initProperties(){this.isDestroyed=!1,this.isProgressBarNavigation=!1,this.currentTool=null,this.shapes=[]}init(e){this.videoElement=e,this.bindContext(),this.initCanvas(),this.initUI(),this.initProperties(),this.setCanvasSize(),this.fillCanvas(),this.setCanvasSettings(),this.currentTool=this.isMobile?null:"curve"}addEvent(e,t,n){let i=o=>{this.isDestroyed||n(o)};e.addEventListener(t,i),this.destructors.push(()=>{e.removeEventListener(t,i)})}initCanvas(){throw new Error("Method not implemented.")}onKeyDown(e){(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="z"&&this.handleUndo()}removeLastShape(){this.shapes.pop(),this.redrawFullCanvas()}handleUndo(){this.undoStack.length>0&&(this.shapes=this.undoStack.pop(),this.redrawFullCanvas())}destroy(){if(this.isDestroyed)return;this.destructors.forEach(i=>i()),this.stopAnnotationsAsVideo(),this.destructors=[],this._currentTool=null,this.plugins.forEach(i=>i.reset()),this.annotatedFrameCoordinates=[],this.setFrameRate(A),this.cleanFrameStacks();let e=this.strokeSizePicker.parentElement;e?.parentNode?.removeChild(e);let t=this.colorPicker.parentElement;t?.parentNode?.removeChild(t),this.buttons.forEach(i=>{i.parentNode?.removeChild(i)}),this.buttons=[],this.uiContainer.parentNode?.removeChild(this.uiContainer),this.canvas.parentNode?.removeChild(this.canvas),["strokeSizePicker","colorPicker","uiContainer","canvas","ctx","videoElement"].forEach(i=>{delete this[i]}),this.activeTimeFrame=0}setCanvasSize(){let e=this.videoClientRect;this.canvas.width=e.width*this.pixelRatio,this.canvas.height=e.height*this.pixelRatio,this.canvas.style.width=`${e.width}px`,this.canvas.style.height=`${e.height}px`,this.ctx.scale(this.pixelRatio,this.pixelRatio),this.redrawFullCanvas(),this.setCanvasSettings()}isMultiTouch(e){return e.pointerType==="touch"&&e.isPrimary===!1}addShape(e){let t=this.serialize([e])[0];console.log("serializedShape",t),this.undoStack.push([...this.shapes]),this.shapes.push(t)}serialize(e=this.shapes){let t=this.canvasWidth,n=this.canvasHeight;return e.map(i=>this.pluginForTool(i.type).normalize(i,t,n))}deserialize(e){let t=1/this.canvasWidth,n=1/this.canvasHeight;return e.map(i=>this.pluginForTool(i.type).normalize(i,t,n))}getRelativeCoords(e){let t=this.canvas.getBoundingClientRect();return{x:this.getEventX(e)-t.left,y:this.getEventY(e)-t.top}}handleMouseDown(e){if(e.preventDefault(),this.isMouseDown=!0,this.isMultiTouch(e))return;let t=this.frameFromProgressBar(e,!0);if(t){this.isProgressBarNavigation=!0;let n=this.getAnnotationFrame(e);n!==null?this.playbackFrame=n:this.playbackFrame=t;return}this.currentTool&&this.pluginForTool(this.currentTool).onPointerDown(e)}get isDrawing(){return this.currentTool?this.pluginForTool(this.currentTool).isDrawing:!1}handleMouseMove(e){if(e.preventDefault(),!this.isMultiTouch(e)){if(this.isMouseDown){let t=this.isProgressBarNavigation?this.frameFromProgressBar(e,!1):null;if(t!==null&&!this.isDrawing){if(t===this.lastNavigatedFrame)return;this.lastNavigatedFrame=t,this.playbackFrame=t;return}else this.hideControls(),this.clearCanvas(),this.addVideoOverlay(),this.drawShapesOverlay()}else this.redrawFullCanvas();this.currentTool&&this.pluginForTool(this.currentTool).onPointerMove(e)}}getEventX(e){return e.clientX}getEventY(e){return e.clientY}handleMouseUp(e){this.isMouseDown=!1,this.isProgressBarNavigation=!1,this.showControls(),!this.isMultiTouch(e)&&(this.currentTool&&this.pluginForTool(this.currentTool).onPointerUp(e),this.redrawFullCanvas())}focusOnMediaNode(){this.videoElement.focus()}drawShapesOverlay(){let e={strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth};this.deserialize(this.shapes).forEach(t=>{this.ctx.strokeStyle=t.strokeStyle,this.ctx.fillStyle=t.fillStyle,this.ctx.lineWidth=t.lineWidth,this.pluginForTool(t.type).draw(t)}),this.ctx.strokeStyle=e.strokeStyle,this.ctx.fillStyle=e.fillStyle,this.ctx.lineWidth=e.lineWidth}clearCanvas(){this.ctx.clearRect(0,0,this.canvasWidth,this.canvasHeight)}frameToDataUrl(){try{this.clearCanvas(),this.addVideoOverlay(),this.addFrameSquareOverlay(),this.drawShapesOverlay();let e=this.canvas.toDataURL("image/png");return this.redrawFullCanvas(),e}catch(e){return console.error(e),null}}redrawFullCanvas(){this.clearCanvas(),this.addVideoOverlay(),this.drawShapesOverlay(),this.addFrameSquareOverlay(),this.addProgressBarOverlay()}replaceFrame(e,t){this.timeStack.set(e,JSON.parse(JSON.stringify(t)))}addShapesToFrame(e,t){let n=this.timeStack.get(e)||[];this.timeStack.set(e,[...n,...JSON.parse(JSON.stringify(t))])}setFrameRate(e){this.destructors.find(t=>t.name==="frameRateDetector")?.(),this.fps=e}saveCurrentFrame(){return{frame:this.playbackFrame,version:1,fps:this.fps,shapes:JSON.parse(JSON.stringify(this.shapes))}}addFrameSquareOverlay(e=this.activeTimeFrame){throw new Error("Method not implemented.")}addVideoOverlay(){throw new Error("Method not implemented.")}cleanFrameStacks(){this.timeStack.clear(),this.undoTimeStack.clear()}loadAllFrames(e){this.cleanFrameStacks(),e.forEach(t=>{this.timeStack.set(t.frame,t.shapes)})}appendFrames(e){e.forEach(t=>{this.addShapesToFrame(t.frame,t.shapes)})}saveAllFrames(){return Array.from(this.timeStack.keys()).filter(i=>this.timeStack.get(i)?.length).map(i=>({frame:i,fps:this.fps,version:1,shapes:this.timeStack.get(i)??[]}))}getAnnotationFrame(e){let t=e.offsetX,n=e.offsetY,i=this.isMobile?10:5;return this.annotatedFrameCoordinates.find(r=>t>=r.x-i&&t<=r.x+i&&n>=r.y-i&&n<=r.y+i)?.frame??null}frameFromProgressBar(e,t=!0){let n=this.videoElement;if(n.tagName!=="VIDEO")return null;let{x:i,width:o,height:r,y:l}=this.progressBarCoordinates,c=e.offsetX,s=e.offsetY;return t?c>=i&&c<=i+o&&s>=l&&s<=l+r?Math.ceil((c-i)/o*(n.duration*this.fps)):null:c>=i&&c<=i+o?Math.ceil((c-i)/o*(n.duration*this.fps)):null}addProgressBarOverlay(){throw new Error("Method not implemented.")}initUI(){throw new Error("Method not implemented.")}stopAnnotationsAsVideo(){clearTimeout(this.playTimeout)}hasAnnotationsForFrame(e){if(this.timeStack.has(e)){let t=this.timeStack.get(e);return t&&t.length>0}return!1}playAnnotationsAsVideo(){this.stopAnnotationsAsVideo();let e=this.playbackFrame;this.hasAnnotationsForFrame(e)?(this.showCanvas(),this.activeTimeFrame=e,this.clearCanvas(),this.drawShapesOverlay()):this.hideCanvas();let t=1e3/this.fps;this.playTimeout=window.setTimeout(()=>{this.playAnnotationsAsVideo()},t)}fillCanvas(){this.ctx.save(),this.ctx.fillStyle="rgba(0, 0, 0, 0.5)",this.ctx.fillRect(0,0,this.canvasWidth,this.canvasHeight),this.ctx.restore()}};function L(a=this.activeTimeFrame){this.ctx.save(),this.ctx.fillStyle="rgba(0, 0, 0, 0.5)";let e=50,t=30,n=20;this.ctx.fillRect(this.canvasWidth-e,this.canvasHeight-t,e,t),this.ctx.fillStyle="white",this.ctx.font=`${n}px sans-serif`,this.ctx.fillText(`${a}`.padStart(3,"0"),this.canvasWidth-40,this.canvasHeight-7),this.ctx.restore()}function N(){this.ctx.drawImage(this.videoElement,0,0,this.canvas.width/this.pixelRatio,this.canvas.height/this.pixelRatio)}function H(){let a=this.videoElement;if(a.tagName!=="VIDEO")return;this.annotatedFrameCoordinates=[];let t=Array.from(this.timeStack.keys()).filter(v=>this.timeStack.get(v)?.length),n=a.duration*this.fps,{x:i,width:o,height:r,y:l}=this.progressBarCoordinates,c=t.map(v=>Math.ceil(v/n*o));this.ctx.save(),this.ctx.fillStyle="rgba(0, 0, 0, 0.5)",this.ctx.fillRect(i,l,o,r),this.ctx.fillStyle="#F3CE32";let s=this.isMobile?16:8;c.forEach((v,V)=>{this.ctx.beginPath();let I=i+v,F=this.canvasHeight-r/2;this.ctx.fillRect(I-s/2,F-s/2,s,s),this.annotatedFrameCoordinates.push({x:I,y:F,frame:t[V]})});let h=this.playbackFrame,d=Math.ceil(h/n*o)+i;this.ctx.fillStyle="white",this.ctx.beginPath();let m=d,y=this.canvasHeight-r/2;this.ctx.beginPath(),this.ctx.fillRect(m-s/2,y-s/2,s,s),this.ctx.fill(),this.ctx.restore()}g.prototype.initUI=M;g.prototype.initCanvas=D;g.prototype.addFrameSquareOverlay=L;g.prototype.addVideoOverlay=N;g.prototype.addProgressBarOverlay=H;var O=g;new EventSource("/esbuild").addEventListener("change",()=>location.reload());var p=document.querySelector("video");async function W(){let a=await fetch(p.currentSrc).then(l=>l.blob()),e=new Promise(l=>{p.addEventListener("loadeddata",()=>{l(!0)},{once:!0})});p.paused||p.pause(),p.src=URL.createObjectURL(a),await e,await p.play();let t=new O(p);p.paused||p.pause(),setInterval(()=>{t.destroy(),t.init(p)},1e8),setInterval(()=>{console.log(t.saveAllFrames())},1e5);let n=document.getElementById("file"),i=document.getElementById("download"),o=document.getElementById("sample");document.getElementById("save-image").addEventListener("click",l=>{l.stopPropagation(),l.preventDefault();let c=t.frameToDataUrl();if(!c)return;let s=t.activeTimeFrame,h=document.createElement("a");h.href=c,h.download=`frame-${s}.png`,h.click()}),o.addEventListener("click",l=>{l.stopPropagation(),l.preventDefault(),fetch("./annotations-sample.json").then(c=>c.json()).then(c=>{t.loadAllFrames(c),t.redrawFullCanvas()})}),n.addEventListener("change",l=>{if(!n.files||n.files.length===0)return;let c=n.files[0],s=new FileReader;s.onload=h=>{if(!h.target)return;let d=h.target.result,m=JSON.parse(d);confirm("Append to existing annotations?")?t.appendFrames(m):t.loadAllFrames(m),t.redrawFullCanvas()},s.readAsText(c)}),i.addEventListener("click",l=>{l.stopPropagation(),l.preventDefault();let c=t.saveAllFrames(),s=document.createElement("a");s.href=URL.createObjectURL(new Blob([JSON.stringify(c)],{type:"application/json"}));let h=new Date().toISOString().replace(/:/g,"-");s.download=`annotations-${h}.json`,s.click()})}p.readyState===0?p.addEventListener("loadedmetadata",()=>{requestAnimationFrame(()=>{W()})},{once:!0}):W();})();
