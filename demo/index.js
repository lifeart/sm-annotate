"use strict";(()=>{var ct=Object.defineProperty,dt=Object.defineProperties;var ut=Object.getOwnPropertyDescriptors;var Y=Object.getOwnPropertySymbols;var mt=Object.prototype.hasOwnProperty,pt=Object.prototype.propertyIsEnumerable;var U=(s,e,t)=>e in s?ct(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t,y=(s,e)=>{for(var t in e||(e={}))mt.call(e,t)&&U(s,t,e[t]);if(Y)for(var t of Y(e))pt.call(e,t)&&U(s,t,e[t]);return s},f=(s,e)=>dt(s,ut(e));var V=(s,e,t)=>new Promise((i,n)=>{var o=a=>{try{h(t.next(a))}catch(d){n(d)}},l=a=>{try{h(t.throw(a))}catch(d){n(d)}},h=a=>a.done?i(a.value):Promise.resolve(a.value).then(o,l);h((t=t.apply(s,e)).next())});function j(s,e){let t=document.createElement("button");t.type="button",t.style.margin="5px",t.style.float="right",t.title="Download current frame",t.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>',e.addEvent(t,"click",()=>{let i=e.frameToDataUrl();if(!i)return;let n=document.createElement("a");n.download=`frame_${String(e.activeTimeFrame).padStart(3,"0")}.png`,n.href=i,n.click()}),e.buttons.push(t),e.playerControlsContainer.appendChild(t)}var q='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume-x"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="22" x2="16" y1="9" y2="15"></line><line x1="16" x2="22" y1="9" y2="15"></line></svg>',K='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume-2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>';function $(s,e){let t=document.createElement("button");t.type="button",t.style.margin="5px",s.muted||s.volume===0?t.innerHTML=K:t.innerHTML=q,e.addEvent(s,"volumechange",()=>{s.muted||s.volume===0?t.innerHTML=q:t.innerHTML=K}),e.addEvent(t,"click",()=>{s.muted&&(s.muted=!1),s.volume===0?s.volume=1:s.volume=0}),e.buttons.push(t),e.playerControlsContainer.appendChild(t)}var _='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>',vt='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pause"><rect width="4" height="16" x="6" y="4"></rect><rect width="4" height="16" x="14" y="4"></rect></svg>';function J(s,e){let t=document.createElement("button");t.type="button",t.innerHTML=_,t.style.margin="5px",e.addEvent(s,"play",()=>{t.innerHTML=vt}),e.addEvent(s,"pause",()=>{t.innerHTML=_}),e.addEvent(t,"click",()=>{s.paused?s.play():s.pause()}),e.buttons.push(t),e.playerControlsContainer.appendChild(t)}function G(s){let e={"0.25":"\xBC","0.5":"\xBD","0.75":"\xBE",1:"1\xD7"};return console.log(e[String(s)],e,s),`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-superscript">
        <style>
            .small {
                font-family: auto;
                font-size: ${s===1?"16":"24"}px;
            }
        </style>
        <text x="${s===1?3:2}" y="${s===1?17:20}" font-weight="normal" class="small">${e[String(s)]}</text>
        
    </svg>`}function Z(s,e){let t=[.25,.5,.75,1],i=document.createElement("button"),n=t[t.length-1];i.type="button",s.playbackRate=n,i.innerHTML=G(n),i.style.margin="5px",e.addEvent(i,"click",()=>{let o=t.indexOf(s.playbackRate),l=o+1>=t.length?0:o+1;s.playbackRate=t[l],i.innerHTML=G(t[l])}),e.buttons.push(i),e.playerControlsContainer.appendChild(i)}var gt="#F3CE32";function Q(){var v,w;let s=document.createElement("div");s.style.position="absolute",s.style.top="-40px",s.style.left="0",s.style.zIndex="2",(v=this.canvas.parentNode)==null||v.insertBefore(s,this.canvas);let e=document.createElement("div");e.style.position="relative",e.style.top="0",e.style.left="0",e.style.zIndex="2",(w=this.canvas.parentNode)==null||w.insertBefore(e,this.canvas.nextSibling),this.playerControlsContainer=e;let t=this.videoElement.tagName==="VIDEO"?this.videoElement:null;this.uiContainer=s;let i=(p,r,c=s)=>{let u=document.createElement("button");if(u.type="button",u.innerHTML=p,u.style.margin="5px",c.appendChild(u),this.buttons.push(u),typeof r=="function")this.addEvent(u,"click",r);else{u.dataset.tool=r;let m=()=>{this.currentTool===r?this.currentTool=null:this.currentTool=r};this.addEvent(u,"click",m)}return u},n=()=>{let p=document.createElement("div");return p.style.display="inline-flex",p.style.alignItems="center",p.style.margin="5px",s.appendChild(p),p};i('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>',"rectangle"),i('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>',"circle"),i('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.3 8.7 8.7 21.3c-1 1-2.5 1-3.4 0l-2.6-2.6c-1-1-1-2.5 0-3.4L15.3 2.7c1-1 2.5-1 3.4 0l2.6 2.6c1 1 1 2.5 0 3.4Z"></path><path d="m7.5 10.5 2 2"></path><path d="m10.5 7.5 2 2"></path><path d="m13.5 4.5 2 2"></path><path d="m4.5 13.5 2 2"></path></svg>',"line"),i('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"></path><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"></path></svg>',"curve"),i('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>',"arrow"),i('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>',"text"),i('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"></path><path d="M22 21H7"></path><path d="m5 11 9 9"></path></svg>',"eraser"),i('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 9 2 12 5 15"></polyline><polyline points="9 5 12 2 15 5"></polyline><polyline points="15 19 12 22 9 19"></polyline><polyline points="19 9 22 12 19 15"></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line></svg>',"move"),i('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"></path><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path></svg>',()=>{this.handleUndo()}),t&&(i('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>',()=>{this.prevFrame()},this.playerControlsContainer),J(t,this),i('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>',()=>{this.nextFrame()},this.playerControlsContainer),$(t,this),Z(t,this),j(t,this));let o=document.createElement("input");o.type="color",o.value=gt,o.style.margin="5px",this.colorPicker=o,s.appendChild(o);let l=n(),h=document.createElement("input");h.type="number",h.step="1",h.min="1",h.max="10",h.value="5",h.style.margin="5px",l.appendChild(h);let a=p=>{this.ctx.lineWidth=p.target.valueAsNumber,this.focusOnMediaNode()};this.addEvent(h,"input",a);let d=p=>{this.ctx.strokeStyle=p.target.value,this.ctx.fillStyle=p.target.value,this.focusOnMediaNode()};if(this.addEvent(o,"input",d),this.colorPicker=o,this.strokeSizePicker=h,t){this.hide(),this.addEvent(t,"pause",()=>{this.show()}),this.addEvent(t,"seek",()=>{t.paused&&this.show()}),this.addEvent(t,"error",()=>{this.hide()}),this.addEvent(t,"stalled",()=>{this.hide()}),this.addEvent(t,"waiting",()=>{this.hide()}),this.addEvent(t,"ended",()=>{this.hide()}),this.addEvent(t,"play",()=>{this.hideControls(),this.playAnnotationsAsVideo()});let p=r=>{let c=r.target===document.body,u=this.uiContainer.contains(r.target),m=this.playerControlsContainer.contains(r.target),T=this.videoElement.contains(r.target),E=this.canvas.contains(r.target);return u||m||T||E||c};this.addEvent(document,"copy",r=>{var c;p(r)&&(r.preventDefault(),r.stopPropagation(),r.stopImmediatePropagation(),(c=r.clipboardData)==null||c.setData("application/json",JSON.stringify(this.saveCurrentFrame())))}),this.addEvent(document,"cut",r=>{var u;if(!p(r))return;r.preventDefault(),r.stopPropagation(),r.stopImmediatePropagation();let c=this.saveCurrentFrame();this.replaceFrame(this.playbackFrame,[]),this.redrawFullCanvas(),(u=r.clipboardData)==null||u.setData("application/json",JSON.stringify(c))}),this.addEvent(document,"paste",r=>{var T,E,N,W,O;if(!p(r))return;let c=(E=(T=r.clipboardData)==null?void 0:T.types)!=null?E:[];if(console.log("dataTypes",JSON.stringify(c)),c.includes("application/json"))r.preventDefault(),r.stopPropagation(),r.stopImmediatePropagation();else if(c.includes("Files")){let S=(N=r.clipboardData)==null?void 0:N.files;if(S&&S.length>0){let z=S[0];if(z.type.startsWith("image/")){r.preventDefault(),r.stopPropagation(),r.stopImmediatePropagation();let C=new Image;C.addEventListener("load",()=>{let lt=C.naturalWidth/C.naturalHeight,X=.25,ht=X/lt*this.aspectRatio;this.addShapesToFrame(this.playbackFrame,[{type:"image",image:C,x:0,y:0,width:X,height:ht,strokeStyle:"red",fillStyle:"red",lineWidth:2}]),this.redrawFullCanvas(),requestAnimationFrame(()=>{this.show()}),this.currentTool="move"},{once:!0}),C.src=URL.createObjectURL(z),this.redrawFullCanvas()}}}else if(c.includes("text/plain")){let S=(W=r.clipboardData)==null?void 0:W.getData("text/plain");S&&(console.log("text",S),r.preventDefault(),r.stopPropagation(),r.stopImmediatePropagation(),this.addShapesToFrame(this.playbackFrame,[{type:"text",text:S,x:.4,y:.4,strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth}]),this.show(),this.currentTool="move",this.redrawFullCanvas())}else return;let u=(O=r.clipboardData)==null?void 0:O.getData("application/json");if(!u)return;let m=JSON.parse(u);m&&m.shapes&&m.version===1&&(this.addShapesToFrame(this.playbackFrame,m.shapes),this.redrawFullCanvas())}),this.addEvent(document,"click",r=>{if(!p(r))return;let c=this.uiContainer.contains(r.target),u=this.playerControlsContainer.contains(r.target);c||u||t.paused||(this.currentTool=null,t.pause())}),this.addEvent(document,"keydown",r=>{p(r)&&(r.key==="ArrowLeft"||r.key==="ArrowRight"?(r.preventDefault(),r.stopPropagation(),r.stopImmediatePropagation(),r.key==="ArrowLeft"?this.prevFrame():r.key==="ArrowRight"&&this.nextFrame()):r.code==="Space"&&(r.preventDefault(),r.stopPropagation(),r.stopImmediatePropagation(),t.paused?t.play():t.pause()))})}}function tt(){var s;this.canvas=document.createElement("canvas"),this.ctx=this.canvas.getContext("2d"),(s=this.videoElement.parentNode)==null||s.insertBefore(this.canvas,this.videoElement.nextSibling),this.canvas.style.position="absolute",this.canvas.style.top="0",this.canvas.style.left="0",this.canvas.style.zIndex="1",this.addEvent(this.canvas,"pointerdown",this.handleMouseDown),this.addEvent(this.canvas,"pointermove",this.handleMouseMove),this.addEvent(this.canvas,"pointerup",this.handleMouseUp),this.addEvent(this.canvas,"pointercancel",this.handleMouseUp),this.addEvent(window,"resize",this.setCanvasSize),this.addEvent(document,"keydown",this.onKeyDown)}var g=class{constructor(e){this.startX=0;this.startY=0;this.isDrawing=!1;this.annotationTool=e}get ctx(){return this.annotationTool.ctx}onDeactivate(){}onActivate(){}reset(){this.startX=0,this.startY=0,this.isDrawing=!1}save(e){this.annotationTool.addShape(e)}};var k=class extends g{constructor(){super(...arguments);this.name="rectangle"}move(t,i,n){return t.x+=i,t.y+=n,t}normalize(t,i,n){return f(y({},t),{x:t.x/i,y:t.y/n,width:t.width/i,height:t.height/n})}onPointerDown(t){let{x:i,y:n}=this.annotationTool.getRelativeCoords(t);this.startX=i,this.startY=n,this.isDrawing=!0}onPointerMove(t){if(!this.isDrawing)return;let{x:i,y:n}=this.annotationTool.getRelativeCoords(t);this.drawRectangle(this.startX,this.startY,i-this.startX,n-this.startY)}onPointerUp(t){if(!this.isDrawing)return;let{x:i,y:n}=this.annotationTool.getRelativeCoords(t);this.save({type:"rectangle",x:this.startX,y:this.startY,width:i-this.startX,height:n-this.startY,strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth}),this.drawRectangle(this.startX,this.startY,i-this.startX,n-this.startY),this.isDrawing=!1}drawRectangle(t,i,n,o){this.ctx.beginPath(),this.ctx.rect(t,i,n,o),this.ctx.stroke()}draw(t){this.drawRectangle(t.x,t.y,t.width,t.height)}};var P=class extends g{constructor(){super(...arguments);this.name="circle"}move(t,i,n){return t.x+=i,t.y+=n,t}normalize(t,i,n){return f(y({},t),{x:t.x/i,y:t.y/n,radius:t.radius/i})}onPointerDown(t){let{x:i,y:n}=this.annotationTool.getRelativeCoords(t);this.startX=i,this.startY=n,this.isDrawing=!0}onPointerMove(t){if(!this.isDrawing)return;let{x:i,y:n}=this.annotationTool.getRelativeCoords(t),o=Math.sqrt(Math.pow(i-this.startX,2)+Math.pow(n-this.startY,2));this.drawCircle(this.startX,this.startY,o)}onPointerUp(t){if(!this.isDrawing)return;let{x:i,y:n}=this.annotationTool.getRelativeCoords(t),o=Math.sqrt(Math.pow(i-this.startX,2)+Math.pow(n-this.startY,2));this.save({type:"circle",x:this.startX,y:this.startY,radius:o,strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth}),this.drawCircle(this.startX,this.startY,o),this.isDrawing=!1}drawCircle(t,i,n){this.ctx.beginPath(),this.ctx.arc(t,i,n,0,2*Math.PI),this.ctx.stroke()}draw(t){this.drawCircle(t.x,t.y,t.radius)}};var I=class{constructor(e,t){this.x=e;this.y=t}distanceToLine(e,t){let i=t.x-e.x,n=t.y-e.y,o=Math.abs(n*this.x-i*this.y+t.x*e.y-t.y*e.x),l=Math.sqrt(n*n+i*i);return o/l}};function F(s,e){if(s.length<=2)return s;let t=s[0],i=s[s.length-1],n=-1,o=0;for(let l=1;l<s.length-1;l++){let h=s[l].distanceToLine(t,i);h>o&&(n=l,o=h)}if(o>e){let l=F(s.slice(0,n+1),e),h=F(s.slice(n),e);return l.slice(0,l.length-1).concat(h)}else return[t,i]}var M=class extends g{constructor(){super(...arguments);this.name="curve";this.curvePoints=[]}move(t,i,n){return t.points=t.points.map(o=>({x:o.x+i,y:o.y+n})),t}normalize(t,i,n){return f(y({},t),{points:t.points.map(o=>({x:o.x/i,y:o.y/n}))})}draw(t){this.drawCurve(t)}reset(){super.reset(),this.curvePoints=[]}onPointerDown(t){if(this.isDrawing)return;let{x:i,y:n}=this.annotationTool.getRelativeCoords(t);this.curvePoints=[],this.startX=i,this.startY=n,this.isDrawing=!0,this.curvePoints.push({x:i,y:n})}onPointerMove(t){if(!this.isDrawing)return;let{x:i,y:n}=this.annotationTool.getRelativeCoords(t);this.curvePoints.push({x:i,y:n}),this.drawCurve({points:this.curvePoints,lineWidth:this.ctx.lineWidth})}onPointerUp(t){if(!this.isDrawing)return;let{x:i,y:n}=this.annotationTool.getRelativeCoords(t);this.curvePoints.push({x:i,y:n});let o=this.curvePoints.map(v=>new I(v.x,v.y)),d={type:"curve",points:F(o,2).map(v=>({x:v.x,y:v.y})),strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth};this.save(d),this.curvePoints=[],this.isDrawing=!1}drawCurve(t){if(t.points.length===2&&t.points[0].x===t.points[1].x&&t.points[0].y===t.points[1].y){let i=t.lineWidth/4,n=0,o=2*Math.PI;this.ctx.beginPath(),this.ctx.arc(t.points[0].x,t.points[0].y,i,n,o),this.ctx.stroke()}else{this.ctx.beginPath(),this.ctx.moveTo(t.points[0].x,t.points[0].y);for(let i=1;i<t.points.length-1;i++){let n=t.points[i],o=t.points[i+1];this.ctx.quadraticCurveTo(n.x,n.y,o.x,o.y)}this.ctx.stroke()}}};var D=class extends g{constructor(){super(...arguments);this.name="line"}move(t,i,n){return t.x1+=i,t.y1+=n,t.x2+=i,t.y2+=n,t}normalize(t,i,n){return f(y({},t),{x1:t.x1/i,y1:t.y1/n,x2:t.x2/i,y2:t.y2/n})}onPointerDown(t){let{x:i,y:n}=this.annotationTool.getRelativeCoords(t);this.startX=i,this.startY=n,this.isDrawing=!0}onPointerMove(t){if(!this.isDrawing)return;let{x:i,y:n}=this.annotationTool.getRelativeCoords(t);this.drawLine(this.startX,this.startY,i,n)}onPointerUp(t){if(!this.isDrawing)return;let{x:i,y:n}=this.annotationTool.getRelativeCoords(t);this.save({type:"line",x1:this.startX,y1:this.startY,x2:i,y2:n,fillStyle:this.ctx.fillStyle,strokeStyle:this.ctx.strokeStyle,lineWidth:this.ctx.lineWidth}),this.drawLine(this.startX,this.startY,i,n),this.isDrawing=!1}drawLine(t,i,n,o){this.ctx.beginPath(),this.ctx.moveTo(t,i),this.ctx.lineTo(n,o),this.ctx.stroke()}draw(t){this.drawLine(t.x1,t.y1,t.x2,t.y2)}};var L=class extends g{constructor(){super(...arguments);this.name="arrow"}normalize(t,i,n){return f(y({},t),{x1:t.x1/i,y1:t.y1/n,x2:t.x2/i,y2:t.y2/n})}move(t,i,n){return t.x1+=i,t.y1+=n,t.x2+=i,t.y2+=n,t}draw(t){this.drawArrow(t.x1,t.y1,t.x2,t.y2)}onPointerDown(t){let{x:i,y:n}=this.annotationTool.getRelativeCoords(t);this.startX=i,this.startY=n,this.isDrawing=!0}onPointerMove(t){if(!this.isDrawing)return;let{x:i,y:n}=this.annotationTool.getRelativeCoords(t);this.drawArrow(this.startX,this.startY,i,n)}onPointerUp(t){if(!this.isDrawing)return;this.isDrawing=!1;let{x:i,y:n}=this.annotationTool.getRelativeCoords(t);this.save({type:"arrow",x1:this.startX,y1:this.startY,x2:i,y2:n,strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth})}drawArrow(t,i,n,o){let l=10+2.5*this.ctx.lineWidth,h=Math.PI/6,a=Math.atan2(o-i,n-t);this.ctx.beginPath(),this.ctx.moveTo(t,i),this.ctx.lineTo(n,o),this.ctx.stroke(),this.ctx.beginPath(),this.ctx.moveTo(n,o),this.ctx.lineTo(n-l*Math.cos(a+h),o-l*Math.sin(a+h)),this.ctx.moveTo(n,o),this.ctx.lineTo(n-l*Math.cos(a-h),o-l*Math.sin(a-h)),this.ctx.stroke()}};var B=class extends g{constructor(){super(...arguments);this.name="text"}move(t,i,n){return t.x+=i,t.y+=n,t}onActivate(){this.annotationTool.canvas.style.cursor="text",this.isDrawing=!0}onDeactivate(){this.annotationTool.canvas.style.cursor="default",this.isDrawing=!1}draw(t){let i=t.text.split(`
`);for(let n=0;n<i.length;n++)this.drawText(t.x,t.y+n*20,i[n])}drawText(t,i,n){let o=16+this.ctx.lineWidth*.5;this.ctx.font=`${o}px Helvetica Neue, Arial`,this.ctx.fillText(n,t,i)}onPointerDown(t){let{x:i,y:n}=this.annotationTool.getRelativeCoords(t);this.startX=i,this.startY=n}onPointerMove(t){let{x:i,y:n}=this.annotationTool.getRelativeCoords(t);this.ctx.beginPath(),this.ctx.arc(i,n,5,0,2*Math.PI),this.ctx.fill()}normalize(t,i,n){return f(y({},t),{x:t.x/i,y:t.y/n})}onPointerUp(t){let{x:i,y:n}=this.annotationTool.getRelativeCoords(t),o=prompt("Enter the text to be drawn:");o!==null&&this.save({type:"text",x:i,y:n,text:o,strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth})}};var R=class extends g{constructor(){super(...arguments);this.name="eraser"}move(t,i,n){return t.x+=i,t.y+=n,t}normalize(t,i,n){return f(y({},t),{x:t.x/i,y:t.y/n,width:t.width/i,height:t.height/n})}draw(t){this.drawEraser(t.x,t.y,t.width,t.height)}onPointerDown(t){let{x:i,y:n}=this.annotationTool.getRelativeCoords(t);this.startX=i,this.startY=n,this.isDrawing=!0}onPointerMove(t){if(!this.isDrawing)return;let{x:i,y:n}=this.annotationTool.getRelativeCoords(t);this.ctx.save(),this.ctx.strokeStyle="rgba(255, 255, 255, 0.5)",this.ctx.lineWidth=1,this.ctx.fillStyle="rgba(255, 255, 255, 0.3)",this.ctx.fillRect(this.startX,this.startY,i-this.startX,n-this.startY),this.ctx.strokeRect(this.startX,this.startY,i-this.startX,n-this.startY),this.ctx.restore()}onPointerUp(t){if(!this.isDrawing)return;this.isDrawing=!1;let{x:i,y:n}=this.annotationTool.getRelativeCoords(t);this.save({type:"eraser",x:this.startX,y:this.startY,width:i-this.startX,height:n-this.startY,strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth})}drawEraser(t,i,n,o){this.ctx.clearRect(t,i,n,o)}};var A=class extends g{constructor(){super(...arguments);this.name="move";this.shape=null;this.lastDrawnShape=null;this.shapeRemoved=!1}move(t){return t}normalize(t){return y({},t)}onPointerDown(t){let{x:i,y:n}=this.annotationTool.getRelativeCoords(t),o=this.annotationTool.shapes.slice(0).pop();o&&(this.shape=o,this.shapeRemoved=!1,this.lastDrawnShape=null,this.startX=i,this.startY=n,this.isDrawing=!0)}onPointerMove(t){if(!this.isDrawing||!this.shape)return;this.shapeRemoved||(this.annotationTool.removeLastShape(),this.shapeRemoved=!0);let{x:i,y:n}=this.annotationTool.getRelativeCoords(t),o=i-this.startX,l=n-this.startY;this.startX=i-o,this.startY=n-l;let h=this.annotationTool.deserialize([this.shape])[0],a=h.type==="image"?h:JSON.parse(JSON.stringify(h)),d=this.annotationTool.pluginForTool(a.type).move(a,o,l);this.lastDrawnShape=d,this.annotationTool.pluginForTool(a.type).draw(d)}onPointerUp(t){!this.isDrawing||!this.lastDrawnShape||(this.lastDrawnShape&&(this.lastDrawnShape.fillStyle=this.annotationTool.ctx.fillStyle,this.lastDrawnShape.strokeStyle=this.annotationTool.ctx.strokeStyle,this.lastDrawnShape.lineWidth=this.annotationTool.ctx.lineWidth,this.save(this.lastDrawnShape)),this.isDrawing=!1,this.shape=null,this.shapeRemoved=!1,this.lastDrawnShape=null)}draw(){throw new Error("Method not implemented.")}reset(){this.isDrawing=!1,this.shape=null,this.lastDrawnShape=null,this.shapeRemoved=!1}};var H=class extends g{constructor(){super(...arguments);this.name="image"}move(t,i,n){return t.x+=i,t.y+=n,t}onPointerDown(t){}onPointerMove(t){}onPointerUp(t){}normalize(t,i,n){return f(y({},t),{x:t.x/i,y:t.y/n,width:t.width/i,height:t.height/n})}draw(t){if(!(t.image instanceof HTMLImageElement)){console.error("Image is not an instance of HTMLImageElement");return}this.ctx.drawImage(t.image,t.x,t.y,t.width,t.height)}};var et=[k,P,D,L,B,R,M,A,H];function it(s,e){let t,i,n,o=[],l=!0;function h(v,w){let p=Math.abs(w.mediaTime-t),r=Math.abs(w.presentedFrames-i),c=p/r;c&&c<1&&l&&o.length<50&&s.playbackRate===1&&document.hasFocus()&&(o.push(c),n=Math.round(1/d()),e(n,o.length*2)),l=!0,t=w.mediaTime,i=w.presentedFrames,s.requestVideoFrameCallback(h)}s.requestVideoFrameCallback(h);let a=()=>{o.pop(),l=!1};s.addEventListener("seeked",a);function d(){return o.reduce((v,w)=>v+w)/o.length}return()=>{s.removeEventListener("seeked",a)}}var nt=25,b=class{constructor(e){this.isMouseDown=!1;this.activeTimeFrame=1;this.buttons=[];this.destructors=[];this.plugins=[];this.isDestroyed=!1;this.timeStack=new Map;this.undoTimeStack=new Map;this.annotatedFrameCoordinates=[];this.fps=nt;this.lastNavigatedFrame=0;this.isProgressBarNavigation=!1;this.plugins=et.map(t=>new t(this)),this.init(e)}prevFrame(){let e=this.activeTimeFrame,t=Math.max(1,e-1);this.playbackFrame=t}nextFrame(){let e=this.activeTimeFrame,t=Math.min(this.videoElement.duration*this.fps,e+1);this.playbackFrame=t}get selectedColor(){return this.colorPicker.value}get selectedStrokeSize(){return this.strokeSizePicker.valueAsNumber}get currentTool(){return this._currentTool}set currentTool(e){let t=this._currentTool;t&&(this.getButtonForTool(t).classList.remove("active"),this.pluginForTool(t).onDeactivate()),this._currentTool=e,this.canvas.style.cursor=e?"pointer":"default",e&&(this.getButtonForTool(e).classList.add("active"),this.pluginForTool(e).onActivate())}enableFrameRateDetection(){if(this.destructors.find(i=>i.name==="frameRateDetector"))return;let e=this.videoElement;if(e.tagName==="IMG")return;let t=it(e,i=>{this.fps=i});Object.defineProperty(t,"name",{value:"frameRateDetector"}),this.destructors.push(t)}get playbackFrame(){if(this.videoElement instanceof HTMLImageElement)return 1;let e=Math.round(this.videoElement.currentTime*this.fps);return Math.max(1,e)}set playbackFrame(e){if(this.videoElement instanceof HTMLImageElement)return;let t=e/this.fps;this.videoElement.currentTime=t,this.show()}get canvasWidth(){return this.canvas.width/this.pixelRatio}get canvasHeight(){return this.canvas.height/this.pixelRatio}get aspectRatio(){return this.canvasWidth/this.canvasHeight}get isMobile(){return window.innerWidth<960}get progressBarCoordinates(){let e=this.isMobile?30:10,t=5,i=55,n=this.canvasWidth-t-i,o=t,l=this.canvasHeight-e;return{x:o,y:l,width:n,height:e}}get videoClientRect(){return this.videoElement.getBoundingClientRect()}get shapes(){return this.timeStack.has(this.activeTimeFrame)||this.timeStack.set(this.activeTimeFrame,[]),this.timeStack.get(this.activeTimeFrame)}set shapes(e){this.timeStack.set(this.activeTimeFrame,e)}get undoStack(){return this.undoTimeStack.has(this.activeTimeFrame)||this.undoTimeStack.set(this.activeTimeFrame,[]),this.undoTimeStack.get(this.activeTimeFrame)}set undoStack(e){this.undoTimeStack.set(this.activeTimeFrame,e)}get pixelRatio(){return window.devicePixelRatio||1}hide(){this.stopAnnotationsAsVideo(),this.hideControls(),this.hideCanvas()}showControls(){this.uiContainer.style.display="block"}hideControls(){this.uiContainer.style.display="none"}showCanvas(){this.canvas.style.display="block"}hideCanvas(){this.canvas.style.display="none"}show(){this.stopAnnotationsAsVideo(),this.activeTimeFrame=this.playbackFrame,this.showCanvas(),this.showControls(),this.redrawFullCanvas()}setCanvasSettings(){this.ctx.strokeStyle=this.selectedColor,this.ctx.fillStyle=this.selectedColor,this.ctx.lineWidth=this.selectedStrokeSize}pluginForTool(e){if(this.isDestroyed)throw new Error("AnnotationTool is destroyed");let t=this.plugins.find(i=>i.name===e);if(!t)throw new Error(`No plugin found for tool ${e}`);return t}getButtonForTool(e){return this.buttons.find(t=>t.dataset.tool===e)}bindContext(){this.handleMouseDown=this.handleMouseDown.bind(this),this.handleMouseMove=this.handleMouseMove.bind(this),this.handleMouseUp=this.handleMouseUp.bind(this),this.setCanvasSize=this.setCanvasSize.bind(this),this.onKeyDown=this.onKeyDown.bind(this)}initProperties(){this.isDestroyed=!1,this.isProgressBarNavigation=!1,this.currentTool=null,this.shapes=[]}init(e){this.videoElement=e,this.bindContext(),this.initCanvas(),this.initUI(),this.initProperties(),this.setCanvasSize(),this.fillCanvas(),this.setCanvasSettings(),this.currentTool=this.isMobile?null:"curve"}addEvent(e,t,i){let n=o=>{this.isDestroyed||i(o)};e.addEventListener(t,n),this.destructors.push(()=>{e.removeEventListener(t,n)})}initCanvas(){throw new Error("Method not implemented.")}onKeyDown(e){(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="z"&&this.handleUndo()}removeLastShape(){this.shapes.pop(),this.redrawFullCanvas()}handleUndo(){this.undoStack.length>0&&(this.shapes=this.undoStack.pop(),this.redrawFullCanvas())}destroy(){var n,o,l,h,a;if(this.isDestroyed)return;this.destructors.forEach(d=>d()),this.stopAnnotationsAsVideo(),this.destructors=[],this._currentTool=null,this.plugins.forEach(d=>d.reset()),this.annotatedFrameCoordinates=[],this.setFrameRate(nt),this.cleanFrameStacks();let e=this.strokeSizePicker.parentElement;(n=e==null?void 0:e.parentNode)==null||n.removeChild(e);let t=this.colorPicker.parentElement;(o=t==null?void 0:t.parentNode)==null||o.removeChild(t),this.buttons.forEach(d=>{var v;(v=d.parentNode)==null||v.removeChild(d)}),this.buttons=[],(l=this.uiContainer.parentNode)==null||l.removeChild(this.uiContainer),(h=this.canvas.parentNode)==null||h.removeChild(this.canvas),(a=this.playerControlsContainer.parentElement)==null||a.removeChild(this.playerControlsContainer),["strokeSizePicker","colorPicker","uiContainer","playerControlsContainer","canvas","ctx","videoElement"].forEach(d=>{delete this[d]}),this.activeTimeFrame=0}setCanvasSize(){let e=this.videoClientRect;this.canvas.width=e.width*this.pixelRatio,this.canvas.height=e.height*this.pixelRatio,this.canvas.style.width=`${e.width}px`,this.canvas.style.height=`${e.height}px`,this.ctx.scale(this.pixelRatio,this.pixelRatio),this.redrawFullCanvas(),this.setCanvasSettings()}isMultiTouch(e){return e.pointerType==="touch"&&e.isPrimary===!1}addShape(e){let t=this.serialize([e])[0];this.undoStack.push([...this.shapes]),this.shapes.push(t)}serialize(e=this.shapes){let t=this.canvasWidth,i=this.canvasHeight;return e.map(n=>this.pluginForTool(n.type).normalize(n,t,i))}deserialize(e){let t=1/this.canvasWidth,i=1/this.canvasHeight;return e.map(n=>this.pluginForTool(n.type).normalize(n,t,i))}getRelativeCoords(e){let t=this.canvas.getBoundingClientRect();return{x:this.getEventX(e)-t.left,y:this.getEventY(e)-t.top}}handleMouseDown(e){if(e.preventDefault(),this.isMouseDown=!0,this.isMultiTouch(e))return;let t=this.frameFromProgressBar(e,!0);if(t){this.isProgressBarNavigation=!0;let i=this.getAnnotationFrame(e);this.isVideoPaused&&(i!==null?this.playbackFrame=i:this.playbackFrame=t);return}this.currentTool&&this.pluginForTool(this.currentTool).onPointerDown(e)}get isDrawing(){return this.currentTool?this.pluginForTool(this.currentTool).isDrawing:!1}get isVideoPaused(){return this.videoElement.tagName==="VIDEO"?this.videoElement.paused:!0}handleMouseMove(e){if(e.preventDefault(),!this.isMultiTouch(e)){if(this.isMouseDown){let t=this.isProgressBarNavigation?this.frameFromProgressBar(e,!1):null;if(t!==null&&!this.isDrawing){if(t===this.lastNavigatedFrame)return;this.lastNavigatedFrame=t,this.isVideoPaused&&(this.playbackFrame=t);return}else this.hideControls(),this.clearCanvas(),this.addVideoOverlay(),this.drawShapesOverlay()}else this.redrawFullCanvas();this.currentTool&&this.pluginForTool(this.currentTool).onPointerMove(e)}}getEventX(e){return e.clientX}getEventY(e){return e.clientY}handleMouseUp(e){this.isMouseDown=!1,this.isProgressBarNavigation=!1,this.showControls(),!this.isMultiTouch(e)&&(this.currentTool&&this.pluginForTool(this.currentTool).onPointerUp(e),this.redrawFullCanvas())}focusOnMediaNode(){this.videoElement.focus()}drawShapesOverlay(){let e={strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth};this.deserialize(this.shapes).forEach(t=>{this.ctx.strokeStyle=t.strokeStyle,this.ctx.fillStyle=t.fillStyle,this.ctx.lineWidth=t.lineWidth;try{this.pluginForTool(t.type).draw(t)}catch(i){console.error(i)}}),this.ctx.strokeStyle=e.strokeStyle,this.ctx.fillStyle=e.fillStyle,this.ctx.lineWidth=e.lineWidth}clearCanvas(){this.ctx.clearRect(0,0,this.canvasWidth,this.canvasHeight)}frameToDataUrl(){try{this.clearCanvas(),this.addVideoOverlay(),this.addFrameSquareOverlay(),this.drawShapesOverlay();let e=this.canvas.toDataURL("image/png");return this.redrawFullCanvas(),e}catch(e){return console.error(e),null}}redrawFullCanvas(){this.clearCanvas(),this.addVideoOverlay(),this.drawShapesOverlay(),this.addFrameSquareOverlay(),this.addProgressBarOverlay()}replaceFrame(e,t){this.timeStack.set(e,this.parseShapes(this.stringifyShapes(t)))}addShapesToFrame(e,t){let i=this.timeStack.get(e)||[];this.timeStack.set(e,[...i,...this.parseShapes(this.stringifyShapes(t))])}setFrameRate(e){var t;(t=this.destructors.find(i=>i.name==="frameRateDetector"))==null||t(),this.fps=e}stringifyShapes(e){return JSON.stringify(e,(t,i)=>t==="image"?i.src:i)}parseShapes(e){return JSON.parse(e,(t,i)=>{if(t==="image"){let n=new Image;return n.src=i,n}return i})}filterNonSerializableShapes(e){return e.filter(t=>t.type!=="image")}saveCurrentFrame(){return{frame:this.playbackFrame,version:1,fps:this.fps,shapes:this.parseShapes(this.stringifyShapes(this.filterNonSerializableShapes(this.shapes)))}}addFrameSquareOverlay(e=this.activeTimeFrame){throw new Error("Method not implemented.")}addVideoOverlay(){throw new Error("Method not implemented.")}cleanFrameStacks(){this.timeStack.clear(),this.undoTimeStack.clear()}loadAllFrames(e){this.cleanFrameStacks(),e.forEach(t=>{this.timeStack.set(t.frame,t.shapes)})}appendFrames(e){e.forEach(t=>{this.addShapesToFrame(t.frame,t.shapes)})}saveAllFrames(){return Array.from(this.timeStack.keys()).filter(n=>{var o;return(o=this.timeStack.get(n))==null?void 0:o.length}).map(n=>{var o;return{frame:n,fps:this.fps,version:1,shapes:this.filterNonSerializableShapes((o=this.timeStack.get(n))!=null?o:[])}})}getAnnotationFrame(e){var l,h;let t=e.offsetX,i=e.offsetY,n=this.isMobile?10:5;return(h=(l=this.annotatedFrameCoordinates.find(a=>t>=a.x-n&&t<=a.x+n&&i>=a.y-n&&i<=a.y+n))==null?void 0:l.frame)!=null?h:null}frameFromProgressBar(e,t=!0){let i=this.videoElement;if(i.tagName!=="VIDEO")return null;let{x:n,width:o,height:l,y:h}=this.progressBarCoordinates,a=e.offsetX,d=e.offsetY;return t?a>=n&&a<=n+o&&d>=h&&d<=h+l?Math.ceil((a-n)/o*(i.duration*this.fps)):null:a>=n&&a<=n+o?Math.ceil((a-n)/o*(i.duration*this.fps)):null}addProgressBarOverlay(){throw new Error("Method not implemented.")}initUI(){throw new Error("Method not implemented.")}stopAnnotationsAsVideo(){clearTimeout(this.playTimeout)}hasAnnotationsForFrame(e){if(this.timeStack.has(e)){let t=this.timeStack.get(e);return t&&t.length>0}return!1}playAnnotationsAsVideo(){this.stopAnnotationsAsVideo();let e=this.playbackFrame;this.hasAnnotationsForFrame(e)?(this.showCanvas(),this.activeTimeFrame=e,this.clearCanvas(),this.drawShapesOverlay()):this.hideCanvas();let t=1e3/this.fps;this.playTimeout=window.setTimeout(()=>{this.playAnnotationsAsVideo()},t)}fillCanvas(){this.ctx.save(),this.ctx.fillStyle="rgba(0, 0, 0, 0.5)",this.ctx.fillRect(0,0,this.canvasWidth,this.canvasHeight),this.ctx.restore()}};function ot(s=this.activeTimeFrame){this.ctx.save(),this.ctx.fillStyle="rgba(0, 0, 0, 0.5)";let e=50,t=30,i=20;this.ctx.fillRect(this.canvasWidth-e,this.canvasHeight-t,e,t),this.ctx.fillStyle="white",this.ctx.font=`${i}px sans-serif`,this.ctx.fillText(`${s}`.padStart(3,"0"),this.canvasWidth-40,this.canvasHeight-7),this.ctx.restore()}function st(){this.ctx.drawImage(this.videoElement,0,0,this.canvas.width/this.pixelRatio,this.canvas.height/this.pixelRatio)}function rt(){let s=this.videoElement;if(s.tagName!=="VIDEO")return;this.annotatedFrameCoordinates=[];let t=Array.from(this.timeStack.keys()).filter(c=>{var u;return(u=this.timeStack.get(c))==null?void 0:u.length}),i=s.duration*this.fps,{x:n,width:o,height:l,y:h}=this.progressBarCoordinates,a=t.map(c=>Math.ceil(c/i*o));this.ctx.save(),this.ctx.fillStyle="rgba(0, 0, 0, 0.5)",this.ctx.fillRect(n,h,o,l),this.ctx.fillStyle="#F3CE32";let d=this.isMobile?16:8;a.forEach((c,u)=>{this.ctx.beginPath();let m=n+c,T=this.canvasHeight-l/2;this.ctx.fillRect(m-d/2,T-d/2,d,d),this.annotatedFrameCoordinates.push({x:m,y:T,frame:t[u]})});let v=this.playbackFrame,w=Math.ceil(v/i*o)+n;this.ctx.fillStyle="white",this.ctx.beginPath();let p=w,r=this.canvasHeight-l/2;this.ctx.beginPath(),this.ctx.fillRect(p-d/2,r-d/2,d,d),this.ctx.fill(),this.ctx.restore()}b.prototype.initUI=Q;b.prototype.initCanvas=tt;b.prototype.addFrameSquareOverlay=ot;b.prototype.addVideoOverlay=st;b.prototype.addProgressBarOverlay=rt;new EventSource("/esbuild").addEventListener("change",()=>location.reload());var x=document.querySelector("video");function at(){return V(this,null,function*(){let s=window.getComputedStyle(x),e=parseFloat(s.width),t=parseFloat(s.height),i=window.innerHeight-80;if(t>i){let r=e/t,c=i,u=c*r;x.style.width=`${u}px`,x.style.height=`${c}px`}let n=yield fetch(x.currentSrc).then(r=>r.blob()),o=new Promise(r=>{setTimeout(()=>{r(!0)},250),x.addEventListener("loadeddata",()=>{r(!0)},{once:!0})}),l=yield fetch("./frame_29.png").then(r=>V(this,null,function*(){let c=yield r.blob(),u=new Blob([c],{type:"image/png"}),m=new Image,T=new Promise(E=>{m.addEventListener("load",()=>{E(!0)},{once:!0})});return m.src=window.URL.createObjectURL(u),yield T,m}));x.paused||x.pause();let h=new Blob([n],{type:"video/mp4"});x.src=window.URL.createObjectURL(h),yield o;let a=new b(x);console.log({tool:a}),a.addShapesToFrame(29,[{type:"image",image:l,x:0,y:0,width:1,height:1,strokeStyle:"red",lineWidth:2,fillStyle:"red"}]),x.paused||x.pause(),setInterval(()=>{a.destroy(),a.init(x)},1e8),setInterval(()=>{console.log(a.saveAllFrames())},1e5);let d=document.getElementById("file"),v=document.getElementById("download"),w=document.getElementById("sample");document.getElementById("save-image").addEventListener("click",r=>{r.stopPropagation(),r.preventDefault();let c=a.frameToDataUrl();if(!c)return;let u=a.activeTimeFrame,m=document.createElement("a");m.href=c,m.download=`frame_${String(u).padStart(3,"0")}.png`,m.click()}),w.addEventListener("click",r=>{r.stopPropagation(),r.preventDefault(),fetch("./annotations-sample.json").then(c=>c.json()).then(c=>{a.loadAllFrames(c),a.redrawFullCanvas()})}),d.addEventListener("change",r=>{if(!d.files||d.files.length===0)return;let c=d.files[0],u=new FileReader;u.onload=m=>{if(!m.target)return;let T=m.target.result,E=JSON.parse(T);confirm("Append to existing annotations?")?a.appendFrames(E):a.loadAllFrames(E),a.redrawFullCanvas()},u.readAsText(c)}),v.addEventListener("click",r=>{r.stopPropagation(),r.preventDefault();let c=a.saveAllFrames(),u=document.createElement("a");u.href=URL.createObjectURL(new Blob([JSON.stringify(c)],{type:"application/json"}));let m=new Date().toISOString().replace(/:/g,"-");u.download=`annotations-${m}.json`,u.click()})})}x.readyState===0?x.addEventListener("loadedmetadata",()=>{requestAnimationFrame(()=>{at()})},{once:!0}):at();})();
