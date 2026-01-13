var ve=Object.create;var ct=Object.defineProperty,ge=Object.defineProperties,ye=Object.getOwnPropertyDescriptor,xe=Object.getOwnPropertyDescriptors,be=Object.getOwnPropertyNames,Ct=Object.getOwnPropertySymbols,we=Object.getPrototypeOf,Et=Object.prototype.hasOwnProperty,Te=Object.prototype.propertyIsEnumerable;var B=Math.pow,kt=(a,o,t)=>o in a?ct(a,o,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[o]=t,w=(a,o)=>{for(var t in o||(o={}))Et.call(o,t)&&kt(a,t,o[t]);if(Ct)for(var t of Ct(o))Te.call(o,t)&&kt(a,t,o[t]);return a},S=(a,o)=>ge(a,xe(o));var Se=(a,o)=>()=>(o||a((o={exports:{}}).exports,o),o.exports);var Ce=(a,o,t,e)=>{if(o&&typeof o=="object"||typeof o=="function")for(let i of be(o))!Et.call(a,i)&&i!==t&&ct(a,i,{get:()=>o[i],enumerable:!(e=ye(o,i))||e.enumerable});return a};var ke=(a,o,t)=>(t=a!=null?ve(we(a)):{},Ce(o||!a||!a.__esModule?ct(t,"default",{value:a,enumerable:!0}):t,a));var F=(a,o,t)=>new Promise((e,i)=>{var n=l=>{try{h(t.next(l))}catch(s){i(s)}},r=l=>{try{h(t.throw(l))}catch(s){i(s)}},h=l=>l.done?e(l.value):Promise.resolve(l.value).then(n,r);h((t=t.apply(a,o)).next())});var ae=Se((On,oe)=>{"use strict";function ze(a){for(var o=1/0,t=-1/0,e=0,i=a.length,n;e<i;e++)n=a[e],o>n&&(o=n),t<n&&(t=n);return{min:o,max:t}}function ee(a,o){var t=Math.pow(2,o-1),e=a<0?a*t:a*(t-1);return Math.max(-t,Math.min(t-1,e))}function ie(a,o,t){var e,i=a.length,n=Math.ceil(i/o),r,h,l,s,c,d,u=ne(t,n*2);for(e=0;e<n;e++)r=e*o,h=(e+1)*o>i?i:(e+1)*o,l=a.subarray(r,h),d=ze(l),c=ee(d.min,t),s=ee(d.max,t),u[e*2]=c,u[e*2+1]=s;return u}function ne(a,o){return new(new Function(`return Int${a}Array`)())(o)}function We(a,o){var t=a.length,e=1/t,i=a[0].length/2,n=0,r=0,h,l,s=ne(o,i*2);for(r=0;r<i;r++){for(h=0,l=0,n=0;n<t;n++)h+=e*a[n][r*2],l+=e*a[n][r*2+1];s[r*2]=h,s[r*2+1]=l}return[s]}function rt(a,o){return typeof a=="number"?a:o}oe.exports=function(a,o,t,e,i,n){if(o=rt(o,1e3),n=rt(n,16),t==null&&(t=!0),[8,16,32].indexOf(n)<0)throw new Error("Invalid number of bits specified for peaks.");var r=a.numberOfChannels,h=[],l,s,c,d;if(e=rt(e,0),i=rt(i,a.length),typeof a.subarray=="undefined")for(l=0;l<r;l++)c=a.getChannelData(l),d=c.subarray(e,i),h.push(ie(d,o,n));else h.push(ie(a.subarray(e,i),o,n));return t&&h.length>1&&(h=We(h,n)),s=h[0].length/2,{length:s,data:h,bits:n}}});var Ee={bgPrimary:"rgba(28, 28, 32, 0.95)",bgSecondary:"rgba(42, 42, 48, 0.98)",bgTertiary:"#35353d",bgHover:"rgba(255, 255, 255, 0.08)",bgActive:"rgba(255, 255, 255, 0.12)",textPrimary:"#f0f0f2",textSecondary:"#a8a8b0",textMuted:"#68687a",border:"rgba(255, 255, 255, 0.1)",borderHover:"rgba(255, 255, 255, 0.2)",accent:"#5b9fff",accentHover:"#7db3ff",shadow:"rgba(0, 0, 0, 0.4)"},Ie={bgPrimary:"rgba(250, 250, 252, 0.95)",bgSecondary:"rgba(255, 255, 255, 0.98)",bgTertiary:"#f0f0f5",bgHover:"rgba(0, 0, 0, 0.04)",bgActive:"rgba(0, 0, 0, 0.08)",textPrimary:"#1a1a24",textSecondary:"#5a5a6e",textMuted:"#9090a0",border:"rgba(0, 0, 0, 0.1)",borderHover:"rgba(0, 0, 0, 0.2)",accent:"#2563eb",accentHover:"#3b82f6",shadow:"rgba(0, 0, 0, 0.15)"},Me={dark:Ee,light:Ie},m="sm-annotate";function Pe(a){return`
    --${m}-bg-primary: ${a.bgPrimary};
    --${m}-bg-secondary: ${a.bgSecondary};
    --${m}-bg-tertiary: ${a.bgTertiary};
    --${m}-bg-hover: ${a.bgHover};
    --${m}-bg-active: ${a.bgActive};
    --${m}-text-primary: ${a.textPrimary};
    --${m}-text-secondary: ${a.textSecondary};
    --${m}-text-muted: ${a.textMuted};
    --${m}-border: ${a.border};
    --${m}-border-hover: ${a.borderHover};
    --${m}-accent: ${a.accent};
    --${m}-accent-hover: ${a.accentHover};
    --${m}-shadow: ${a.shadow};
  `}function Fe(){return`
    .${m}-container {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      display: inline-flex;
      flex-direction: row;
      align-items: center;
      flex-wrap: nowrap;
      gap: 2px;
      padding: 4px;
      background: var(--${m}-bg-primary);
      border: 1px solid var(--${m}-border);
      border-radius: 8px;
      backdrop-filter: blur(12px);
      box-shadow: 0 4px 16px var(--${m}-shadow);
      z-index: 10;
      margin-top: 8px;
    }

    .${m}-player-controls {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      display: inline-flex;
      flex-direction: row;
      align-items: center;
      flex-wrap: nowrap;
      gap: 2px;
      padding: 4px;
      background: var(--${m}-bg-primary);
      border: 1px solid var(--${m}-border);
      border-radius: 8px;
      backdrop-filter: blur(12px);
      box-shadow: 0 4px 16px var(--${m}-shadow);
      z-index: 10;
      margin-bottom: 8px;
    }

    /* Fullscreen mode - toolbars inside the fullscreen container */
    :fullscreen .${m}-container,
    :-webkit-full-screen .${m}-container {
      position: fixed;
      top: 0;
      margin-top: 8px;
    }

    :fullscreen .${m}-player-controls,
    :-webkit-full-screen .${m}-player-controls {
      position: fixed;
      bottom: 0;
      margin-bottom: 8px;
    }

    .${m}-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      padding: 0;
      border: none;
      border-radius: 6px;
      background: transparent;
      color: var(--${m}-text-secondary);
      cursor: pointer;
      transition: background 0.15s ease, color 0.15s ease;
      outline: none;
    }

    .${m}-btn:hover {
      background: var(--${m}-bg-hover);
      color: var(--${m}-text-primary);
    }

    .${m}-btn:active {
      background: var(--${m}-bg-active);
    }

    .${m}-btn.active {
      background: var(--${m}-accent);
      color: #ffffff;
    }

    .${m}-btn.active:hover {
      background: var(--${m}-accent-hover);
    }

    .${m}-btn:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }

    .${m}-btn svg {
      width: 18px;
      height: 18px;
    }

    .${m}-divider {
      flex: 0 0 1px;
      width: 1px;
      height: 20px;
      margin: 0 4px;
      background: var(--${m}-border);
    }

    .${m}-color-picker {
      width: 32px;
      height: 32px;
      padding: 4px;
      border: none;
      border-radius: 6px;
      background: transparent;
      cursor: pointer;
      transition: background 0.15s ease;
    }

    .${m}-color-picker:hover {
      background: var(--${m}-bg-hover);
    }

    .${m}-color-picker::-webkit-color-swatch-wrapper {
      padding: 0;
    }

    .${m}-color-picker::-webkit-color-swatch {
      border: 2px solid var(--${m}-border);
      border-radius: 4px;
    }

    .${m}-color-picker:hover::-webkit-color-swatch {
      border-color: var(--${m}-border-hover);
    }

    .${m}-slider {
      width: 48px;
      height: 28px;
      padding: 0 8px;
      border: 1px solid var(--${m}-border);
      border-radius: 6px;
      background: var(--${m}-bg-secondary);
      color: var(--${m}-text-primary);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 12px;
      font-weight: 500;
      text-align: center;
      transition: border-color 0.15s ease;
    }

    .${m}-slider:hover {
      border-color: var(--${m}-border-hover);
    }

    .${m}-slider:focus {
      outline: none;
      border-color: var(--${m}-accent);
    }

    .${m}-group {
      display: inline-flex;
      align-items: center;
      gap: 2px;
    }

    .${m}-fullscreen-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      padding: 0;
      border: none;
      border-radius: 6px;
      background: transparent;
      color: var(--${m}-text-secondary);
      cursor: pointer;
      transition: background 0.15s ease, color 0.15s ease;
      outline: none;
    }

    .${m}-fullscreen-btn:hover {
      background: var(--${m}-bg-hover);
      color: var(--${m}-text-primary);
    }

    .${m}-fullscreen-btn svg {
      width: 18px;
      height: 18px;
    }

    /* Tooltip styles using modern CSS */
    [data-tooltip] {
      position: relative;
    }

    [data-tooltip]::before,
    [data-tooltip]::after {
      position: absolute;
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transition: opacity 0.2s ease, visibility 0.2s ease, translate 0.2s ease;
      z-index: 1000;
    }

    /* Tooltip text bubble */
    [data-tooltip]::after {
      content: attr(data-tooltip);
      inset-block-end: calc(100% + 8px);
      inset-inline-start: 50%;
      translate: -50% 4px;
      padding: 6px 10px;
      background: var(--${m}-bg-secondary);
      color: var(--${m}-text-primary);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 12px;
      font-weight: 500;
      line-height: 1.3;
      white-space: nowrap;
      border-radius: 6px;
      border: 1px solid var(--${m}-border);
      box-shadow: 0 4px 12px var(--${m}-shadow);
    }

    /* Tooltip arrow */
    [data-tooltip]::before {
      content: '';
      inset-block-end: calc(100% + 2px);
      inset-inline-start: 50%;
      translate: -50% 4px;
      border: 6px solid transparent;
      border-block-start-color: var(--${m}-bg-secondary);
    }

    /* Show tooltip on hover/focus */
    [data-tooltip]:hover::before,
    [data-tooltip]:hover::after,
    [data-tooltip]:focus-visible::before,
    [data-tooltip]:focus-visible::after {
      opacity: 1;
      visibility: visible;
      translate: -50% 0;
    }

    /* Bottom tooltip variant */
    [data-tooltip-position="bottom"]::after {
      inset-block-end: auto;
      inset-block-start: calc(100% + 8px);
      translate: -50% -4px;
    }

    [data-tooltip-position="bottom"]::before {
      inset-block-end: auto;
      inset-block-start: calc(100% + 2px);
      translate: -50% -4px;
      border-block-start-color: transparent;
      border-block-end-color: var(--${m}-bg-secondary);
    }

    [data-tooltip-position="bottom"]:hover::before,
    [data-tooltip-position="bottom"]:hover::after,
    [data-tooltip-position="bottom"]:focus-visible::before,
    [data-tooltip-position="bottom"]:focus-visible::after {
      translate: -50% 0;
    }

    /* Hide tooltip on disabled buttons */
    [data-tooltip]:disabled::before,
    [data-tooltip]:disabled::after {
      display: none;
    }

    /* Mobile styles - larger touch targets */
    @media (max-width: 960px) {
      .${m}-container {
        gap: 4px;
        padding: 6px;
        margin-top: 4px;
        border-radius: 10px;
      }

      .${m}-player-controls {
        gap: 4px;
        padding: 6px;
        margin-bottom: 4px;
        border-radius: 10px;
      }

      .${m}-btn {
        width: 44px;
        height: 44px;
        border-radius: 8px;
      }

      .${m}-btn svg {
        width: 22px;
        height: 22px;
      }

      .${m}-divider {
        height: 28px;
        margin: 0 6px;
      }

      .${m}-color-picker {
        width: 44px;
        height: 44px;
        padding: 6px;
        border-radius: 8px;
      }

      .${m}-slider {
        width: 56px;
        height: 36px;
        font-size: 14px;
        border-radius: 8px;
      }

      .${m}-fullscreen-btn {
        width: 44px;
        height: 44px;
        border-radius: 8px;
      }

      .${m}-fullscreen-btn svg {
        width: 22px;
        height: 22px;
      }
    }

    /* Touch devices - hide tooltips */
    @media (pointer: coarse) {
      [data-tooltip]::before,
      [data-tooltip]::after {
        display: none;
      }
    }

    /* Fullscreen mode with safe area support */
    :fullscreen .${m}-container,
    :-webkit-full-screen .${m}-container {
      margin-top: max(8px, env(safe-area-inset-top, 8px));
    }

    :fullscreen .${m}-player-controls,
    :-webkit-full-screen .${m}-player-controls {
      margin-bottom: max(8px, env(safe-area-inset-bottom, 8px));
    }

    /* Mobile fullscreen - extra adjustments */
    @media (max-width: 960px) {
      :fullscreen .${m}-container,
      :-webkit-full-screen .${m}-container {
        margin-top: max(4px, env(safe-area-inset-top, 4px));
        padding-left: max(6px, env(safe-area-inset-left, 6px));
        padding-right: max(6px, env(safe-area-inset-right, 6px));
      }

      :fullscreen .${m}-player-controls,
      :-webkit-full-screen .${m}-player-controls {
        margin-bottom: max(4px, env(safe-area-inset-bottom, 4px));
        padding-left: max(6px, env(safe-area-inset-left, 6px));
        padding-right: max(6px, env(safe-area-inset-right, 6px));
      }
    }

    /* Landscape orientation on mobile - compact mode */
    @media (max-width: 960px) and (orientation: landscape) and (max-height: 500px) {
      .${m}-container {
        padding: 4px;
        gap: 2px;
      }

      .${m}-btn {
        width: 36px;
        height: 36px;
      }

      .${m}-btn svg {
        width: 18px;
        height: 18px;
      }

      .${m}-divider {
        height: 24px;
        margin: 0 4px;
      }

      .${m}-color-picker {
        width: 36px;
        height: 36px;
        padding: 4px;
      }

      .${m}-slider {
        width: 48px;
        height: 32px;
        font-size: 12px;
      }

      .${m}-fullscreen-btn {
        width: 36px;
        height: 36px;
      }

      .${m}-fullscreen-btn svg {
        width: 18px;
        height: 18px;
      }

      .${m}-player-controls {
        padding: 4px;
        gap: 2px;
      }
    }
  `}var X=null;function dt(a="dark"){X||(X=document.createElement("style"),X.id=`${m}-theme-styles`,document.head.appendChild(X));let o=Me[a];X.textContent=`
    :root {
      ${Pe(o)}
    }
    ${Fe()}
  `}function P(a){a.classList.add(`${m}-btn`)}function It(a){a.classList.add(`${m}-container`)}function Mt(a){a.classList.add(`${m}-player-controls`)}function Pt(a){a.classList.add(`${m}-color-picker`)}function Ft(a){a.classList.add(`${m}-slider`)}function Ht(a){a.classList.add(`${m}-fullscreen-btn`)}function Y(){let a=document.createElement("div");return a.classList.add(`${m}-divider`),a}function At(a){let o=document.createElement("button");o.type="button",o.dataset.tooltip="Toggle theme",P(o);let t=()=>{let e=a.theme==="dark";o.innerHTML=e?`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>`:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>`};return t(),a.addEvent(o,"click",()=>{a.setTheme(a.theme==="dark"?"light":"dark"),t()}),o}function Dt(a,o){let t=document.createElement("button");t.type="button",P(t),t.style.float="right",t.dataset.tooltip="Download frame",t.dataset.tooltipPosition="bottom",t.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>',o.addEvent(t,"click",()=>{let e=o.frameToDataUrl();if(!e)return;let i=document.createElement("a");i.download=`frame_${String(o.activeTimeFrame).padStart(3,"0")}.png`,i.href=e,i.click()}),o.buttons.push(t),o.playerControlsContainer.appendChild(t)}var Lt='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume-x"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="22" x2="16" y1="9" y2="15"></line><line x1="16" x2="22" y1="9" y2="15"></line></svg>',Rt='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume-2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>';function Bt(a,o){let t=document.createElement("button");t.type="button",P(t),t.dataset.tooltip="Mute/Unmute",t.dataset.tooltipPosition="bottom",a.muted||a.volume===0?t.innerHTML=Lt:t.innerHTML=Rt,o.addEvent(a,"volumechange",()=>{a.muted||a.volume===0?t.innerHTML=Lt:t.innerHTML=Rt}),o.addEvent(t,"click",()=>{if(a.muted){a.muted=!1;return}a.volume===0?a.volume=1:a.volume=0}),o.buttons.push(t),o.playerControlsContainer.appendChild(t)}var W=[{value:0,label:"off"},{value:.25,label:"25%"},{value:.5,label:"50%"},{value:.7,label:"70%"},{value:1,label:"100%"}];function zt(a,o=!1){let t=o?'<circle cx="18" cy="6" r="4" fill="currentColor" opacity="0.7"/>':"";return`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <style>
      .label {
        font-family: sans-serif;
        font-size: 9px;
      }
    </style>
    <rect x="3" y="3" width="18" height="18" rx="2" opacity="${a.value===0?.3:a.value}"/>
    <text x="12" y="14" text-anchor="middle" class="label" fill="currentColor">${a.label}</text>
    ${t}
  </svg>`}function mt(a){let o=W.findIndex(t=>t.value===a);return o===-1?4:o}function Wt(a){let o=document.createElement("button");o.type="button",o.dataset.tooltip="Opacity";let t=mt(a.overlayOpacity),e=()=>{var h;let n=a.currentTool==="move"?a.pluginForTool("move"):null,r=n==null?void 0:n.getSelectedShape();if(r){let l=(h=r.opacity)!=null?h:1,s=mt(l);o.innerHTML=zt(W[s],!0),o.dataset.tooltip="Shape opacity"}else o.innerHTML=zt(W[t],!1),o.dataset.tooltip="Overlay opacity"};e(),P(o),a.addEvent(o,"click",()=>{var h;let n=a.currentTool==="move"?a.pluginForTool("move"):null,r=n==null?void 0:n.getSelectedShape();if(r&&n){let l=(h=r.opacity)!=null?h:1,s=mt(l);s=(s+1)%W.length;let c=W[s].value;n.setSelectedShapeOpacity(c)}else t=(t+1)%W.length,a.overlayOpacity=W[t].value,a.redrawFullCanvas();e()});let i=a.redrawFullCanvas.bind(a);return a.redrawFullCanvas=()=>{i(),e()},a.buttons.push(o),a.uiContainer.appendChild(o),o}var $t='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>',He='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pause"><rect width="4" height="16" x="6" y="4"></rect><rect width="4" height="16" x="14" y="4"></rect></svg>';function Vt(a,o){let t=document.createElement("button");t.type="button",t.innerHTML=$t,P(t),t.dataset.tooltip="Play/Pause",t.dataset.tooltipPosition="bottom",o.addEvent(a,"play",()=>{t.innerHTML=He}),o.addEvent(a,"pause",()=>{t.innerHTML=$t}),o.addEvent(t,"click",()=>{o.withRefVideo(e=>{e.paused&&e.play().then(()=>{o.showButton("compare")})}),a.paused?a.play().then(()=>{o.redrawFullCanvas()}):(a.pause(),o.raf(()=>{o.redrawFullCanvas()}))}),o.buttons.push(t),o.playerControlsContainer.appendChild(t)}function Ot(a){return`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-superscript">
        <style>
            .small {
                font-family: auto;
                font-size: ${a===1?"16":"24"}px;
            }
        </style>
        <text x="${a===1?3:2}" y="${a===1?17:20}" font-weight="normal" class="small">${{"0.25":"\xBC","0.5":"\xBD","0.75":"\xBE",1:"1\xD7"}[String(a)]}</text>
        
    </svg>`}function Nt(a,o){let t=[.25,.5,.75,1],e=document.createElement("button"),i=t[t.length-1];e.type="button",a.playbackRate=i,e.innerHTML=Ot(i),P(e),e.dataset.tooltip="Playback speed",e.dataset.tooltipPosition="bottom",o.addEvent(e,"click",()=>{let n=t.indexOf(a.playbackRate),r=n+1>=t.length?0:n+1;a.playbackRate=t[r],e.innerHTML=Ot(t[r])}),o.buttons.push(e),o.playerControlsContainer.appendChild(e)}var Ae=500;function Xt(a,o,t){let e=null,i=!1,n=()=>{i=!1,e=setTimeout(()=>{i=!0,t(),o.redrawFullCanvas()},Ae)},r=()=>{e&&(clearTimeout(e),e=null)},h=()=>{e&&(clearTimeout(e),e=null)},l=s=>{i&&(s.preventDefault(),s.stopImmediatePropagation(),i=!1)};o.addEvent(a,"click",l),a.addEventListener("pointerdown",n),a.addEventListener("pointerup",r),a.addEventListener("pointerleave",h),o.destructors.push(()=>{a.removeEventListener("pointerdown",n),a.removeEventListener("pointerup",r),a.removeEventListener("pointerleave",h),e&&clearTimeout(e)})}var U=class{constructor(o,t){this.create=(o,t,e=this.uiContainer,i,n="top")=>{let r=document.createElement("button");if(r.type="button",r.innerHTML=o,P(r),i&&(r.dataset.tooltip=i,n==="bottom"&&(r.dataset.tooltipPosition="bottom")),e.appendChild(r),this.buttons.push(r),typeof t=="function")this.addEvent(r,"click",t);else{r.dataset.tool=t;let h=()=>{this.currentTool===t?this.currentTool=null:this.currentTool=t};try{this.tool.pluginForTool(t),this.addEvent(r,"click",h)}catch(l){console.error(l),r.disabled=!0}}return r};this.tool=o,this.uiContainer=t}get buttons(){return this.tool.buttons}get addEvent(){return this.tool.addEvent.bind(this.tool)}get currentTool(){return this.tool.currentTool}set currentTool(o){this.tool.currentTool=o}};function Yt(a,o){let t=a.videoElement.tagName==="VIDEO"?a.videoElement:null;if(o.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>',"rectangle",o.uiContainer,"Rectangle"),o.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>',"circle",o.uiContainer,"Circle"),o.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.3 8.7 8.7 21.3c-1 1-2.5 1-3.4 0l-2.6-2.6c-1-1-1-2.5 0-3.4L15.3 2.7c1-1 2.5-1 3.4 0l2.6 2.6c1 1 1 2.5 0 3.4Z"></path><path d="m7.5 10.5 2 2"></path><path d="m10.5 7.5 2 2"></path><path d="m13.5 4.5 2 2"></path><path d="m4.5 13.5 2 2"></path></svg>',"line",o.uiContainer,"Line"),o.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"></path><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"></path></svg>',"curve",o.uiContainer,"Freehand"),o.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>',"arrow",o.uiContainer,"Arrow"),o.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>',"text",o.uiContainer,"Text"),o.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"></path><path d="M22 21H7"></path><path d="m5 11 9 9"></path></svg>',"eraser",o.uiContainer,"Eraser"),o.uiContainer.appendChild(Y()),o.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 9 2 12 5 15"></polyline><polyline points="9 5 12 2 15 5"></polyline><polyline points="15 19 12 22 9 19"></polyline><polyline points="19 9 22 12 19 15"></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line></svg>',"move",o.uiContainer,"Move shape"),o.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-flip-horizontal"><path d="M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3"></path><path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3"></path><path d="M12 20v2"></path><path d="M12 14v2"></path><path d="M12 8v2"></path><path d="M12 2v2"></path></svg>',"compare",o.uiContainer,"Compare videos"),Wt(a),o.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"></path><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path></svg>',()=>{a.handleUndo()},o.uiContainer,"Undo (Ctrl+Z)"),t){let e=o.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>',()=>{a.prevFrame()},a.playerControlsContainer,"Previous frame (hold for annotation)","bottom");Xt(e,a,()=>a.prevAnnotatedFrame()),Vt(t,a);let i=o.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>',()=>{a.nextFrame()},a.playerControlsContainer,"Next frame (hold for annotation)","bottom");Xt(i,a,()=>a.nextAnnotatedFrame()),Bt(t,a),Nt(t,a),Dt(t,a)}o.create(`<svg viewBox="0 0 24 24" width="24" height="24">
      <path fill="currentColor" d="M3 3h18v18H3V3m2 2v14h14V5H5z"/>
      <path fill="currentColor" d="M7 7h10v10H7V7m2 2v6h6V9H9z"/>
    </svg>`,"selection",o.uiContainer,"Select region")}var R=(a,o)=>{let t=a.target===document.body,e=o.uiContainer.contains(a.target),i=o.playerControlsContainer.contains(a.target),n=o.videoElement.contains(a.target),r=o.canvas.contains(a.target);return e||i||n||r||t};function K(a){return a.pointerType==="pen"?!1:a.pointerType==="touch"&&a.isPrimary===!1}function Ut(a,o){if(!R(a,o))return;let t=o.uiContainer.contains(a.target),e=o.playerControlsContainer.contains(a.target);if(t||e)return;let i=o.videoElement;i.tagName==="VIDEO"&&(i.paused||(o.currentTool=null,i.pause(),o.raf(()=>F(this,null,function*(){o.redrawFullCanvas()}))))}function Kt(a,o){var t;R(a,o)&&(a.preventDefault(),a.stopPropagation(),a.stopImmediatePropagation(),(t=a.clipboardData)==null||t.setData("application/json",JSON.stringify(o.saveCurrentFrame())))}function jt(a,o){var e;if(!R(a,o))return;a.preventDefault(),a.stopPropagation(),a.stopImmediatePropagation();let t=o.saveCurrentFrame();o.replaceFrame(o.playbackFrame,[]),o.redrawFullCanvas(),(e=a.clipboardData)==null||e.setData("application/json",JSON.stringify(t))}function qt(a,o){if(!R(a,o))return;let t=o.videoElement;t.tagName==="VIDEO"&&(a.key==="ArrowLeft"||a.key==="ArrowRight"?(a.preventDefault(),a.stopPropagation(),a.stopImmediatePropagation(),a.key==="ArrowLeft"?o.prevFrame():a.key==="ArrowRight"&&o.nextFrame()):a.code==="Space"&&(a.preventDefault(),a.stopPropagation(),a.stopImmediatePropagation(),t.paused?t.play().then(()=>{o.redrawFullCanvas()}):(t.pause(),o.raf(()=>{o.redrawFullCanvas()}))))}function _t(a,o){var n,r,h,l,s;if(!R(a,o))return;let t=(r=(n=a.clipboardData)==null?void 0:n.types)!=null?r:[];if(t.includes("application/json"))a.preventDefault(),a.stopPropagation(),a.stopImmediatePropagation();else if(t.includes("Files")){let c=(h=a.clipboardData)==null?void 0:h.files;if(c&&c.length>0){let d=c[0];if(d.type.startsWith("image/")){a.preventDefault(),a.stopPropagation(),a.stopImmediatePropagation();let u=new Image,p=URL.createObjectURL(d);u.addEventListener("load",()=>{URL.revokeObjectURL(p);let f=u.naturalWidth/u.naturalHeight,y=.25,x=y/f*o.aspectRatio;o.addShapesToFrame(o.playbackFrame,[{type:"image",image:u,x:0,y:0,width:y,height:x,strokeStyle:"red",fillStyle:"red",lineWidth:2}]),o.redrawFullCanvas(),o.raf(()=>{o.show()}),o.currentTool="move"},{once:!0}),u.addEventListener("error",()=>{URL.revokeObjectURL(p)},{once:!0}),u.src=p,o.redrawFullCanvas()}}}else if(t.includes("text/plain")){let c=(l=a.clipboardData)==null?void 0:l.getData("text/plain");c&&(a.preventDefault(),a.stopPropagation(),a.stopImmediatePropagation(),o.addShapesToFrame(o.playbackFrame,[{type:"text",text:c,x:.4,y:.4,strokeStyle:o.ctx.strokeStyle,fillStyle:o.ctx.fillStyle,lineWidth:o.ctx.lineWidth}]),o.show(),o.currentTool="move",o.redrawFullCanvas())}else return;let e=(s=a.clipboardData)==null?void 0:s.getData("application/json");if(!e)return;let i=JSON.parse(e);i&&i.shapes&&i.version===1&&(o.addShapesToFrame(o.playbackFrame,i.shapes),o.redrawFullCanvas())}var $={r:"#d31a3b",g:"#15d33b",b:"#0085CA",y:"#F3CE32",a:"#7fffd4",c:"#00ffff",d:"#696969",e:"#50c878",f:"#ff00ff",h:"#f0fff0",i:"#4b0082",j:"#00a86b",k:"#f0e68c",l:"#e6e6fa",m:"#98ff98",n:"#000080",o:"#ffa500",p:"#800080",q:"#e5acc8",s:"#0f52ba",t:"#008080",u:"#3f00ff",v:"#ee82ee",w:"#ffffff",x:"#738678",z:"#0014a8"};function Gt(a,o){let t=document.createElement("input");t.type="color",t.value=a,t.dataset.tooltip="Stroke color";let e=i=>{o.ctx.strokeStyle=i.target.value,o.ctx.fillStyle=i.target.value,o.focusOnMediaNode()};return o.addEvent(t,"input",e),t}function Jt(a){let o=document.createElement("input");o.type="number",o.step="1",o.min="1",o.max="10",o.value="5",o.style.margin="5px",o.dataset.tooltip="Stroke width";let t=e=>{a.ctx.lineWidth=e.target.valueAsNumber,a.focusOnMediaNode()};return a.addEvent(o,"input",t),o}var De=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
</svg>`;function Zt(a){let o=document.createElement("button");o.innerHTML=De,o.type="button",o.dataset.tooltip="Fullscreen",o.dataset.tooltipPosition="bottom",Ht(o);let t=()=>{if(document.fullscreenElement)document.exitFullscreen&&document.exitFullscreen();else{let i=a.videoElement.parentElement;i!=null&&i.requestFullscreen&&i.requestFullscreen()}};o.addEventListener("click",t);let e=()=>{a.setCanvasSize(),a.playbackFrame=a.playbackFrame,a.canvas.focus(),a.redrawFullCanvas(),o.blur()};return document.addEventListener("fullscreenchange",e),a.destructors.push(()=>{o.removeEventListener("click",t),document.removeEventListener("fullscreenchange",e)}),o}var Le=$.r,Re="",Be="";function Qt(){var h,l;let a=document.createElement("div");a.style.cssText=Be,It(a),(h=this.canvas.parentNode)==null||h.insertBefore(a,this.canvas);let o=document.createElement("div");o.style.cssText=Re,Mt(o),(l=this.canvas.parentNode)==null||l.insertBefore(o,this.canvas.nextSibling),this.playerControlsContainer=o;let t=this.videoElement.tagName==="VIDEO"?this.videoElement:null;this.uiContainer=a;let e=()=>{let s=document.createElement("div");return s.style.display="inline-flex",s.style.alignItems="center",s},i=new U(this,a);Yt(this,i),this.isMobile&&(this.hideButton("line"),this.hideButton("circle"),this.hideButton("rectangle"),this.hideButton("eraser")),this.hideButton("compare"),a.appendChild(Y()),this.colorPicker=Gt(Le,this),Pt(this.colorPicker),a.appendChild(this.colorPicker);let n=e();this.strokeSizePicker=Jt(this),Ft(this.strokeSizePicker),n.appendChild(this.strokeSizePicker),a.appendChild(n),a.appendChild(Y());let r=At(this);if(a.appendChild(r),t){this.hide(),this.addEvent(t,"pause",()=>{this.show()}),this.addEvent(t,"seek",()=>{t.paused&&this.show()}),this.addEvent(t,"timeupdate",()=>{t.currentTime<2e-4&&!t.paused&&this.startAnnotationsAsVideo()}),this.addEvent(t,"error",()=>{this.hide()}),this.addEvent(t,"stalled",()=>{this.hide()}),this.addEvent(t,"play",()=>{this.hideControls(),this.startAnnotationsAsVideo()}),this.addEvent(document,"copy",c=>{Kt(c,this)}),this.addEvent(document,"cut",c=>{jt(c,this)}),this.addEvent(document,"paste",c=>{_t(c,this)}),this.addEvent(document,"click",c=>{Ut(c,this)}),this.addEvent(document,"keydown",c=>{qt(c,this)}),this.addEvent(document.body.querySelector("div"),"drop",c=>{var d;(d=c.dataTransfer)!=null&&d.types});let s=Zt(this);o.appendChild(s)}}function te(){var a;this.canvas=document.createElement("canvas"),this.ctx=this.canvas.getContext("2d"),(a=this.videoElement.parentNode)==null||a.insertBefore(this.canvas,this.videoElement.nextSibling),this.canvas.style.position="absolute",this.canvas.style.backgroundColor="transparent",this.canvas.style.top="0",this.canvas.style.left="0",this.canvas.style.zIndex="1",this.addEvent(this.canvas,"pointerdown",this.handleMouseDown),this.addEvent(this.canvas,"pointermove",this.handleMouseMove),this.addEvent(this.canvas,"pointerup",this.handleMouseUp),this.addEvent(this.canvas,"pointercancel",this.handleMouseUp),this.addEvent(this.canvas,"pointerenter",()=>{this.isCursorOverCanvas=!0}),this.addEvent(this.canvas,"pointerleave",()=>{this.isCursorOverCanvas=!1}),this.addEvent(this.canvas,"touchmove",o=>{o.stopImmediatePropagation(),o.stopPropagation(),o.preventDefault()}),this.addEvent(window,"resize",this.setCanvasSize),this.addEvent(document,"keydown",this.onKeyDown)}var j=class{constructor(){this.destructors=[];this.isDestroyed=!1;this.activeTimeFrame=1;this.globalShapes=[];this.timeStack=new Map;this.undoTimeStack=new Map}cleanFrameStacks(){this.timeStack.clear(),this.undoTimeStack.clear()}destroy(){this.destructors.forEach(o=>o()),this.destructors=[],this.globalShapes=[],this.cleanFrameStacks()}raf(o){return requestAnimationFrame(o)}addEvent(o,t,e){let i=n=>{this.isDestroyed||e(n)};o.addEventListener(t,i),this.destructors.push(()=>{o.removeEventListener(t,i)})}addProgressBarOverlay(){throw new Error("Method not implemented.")}initUI(){throw new Error("Method not implemented.")}initCanvas(){throw new Error("Method not implemented.")}addFrameSquareOverlay(o=this.activeTimeFrame){throw new Error("Method not implemented.")}addVideoOverlay(){throw new Error("Method not implemented.")}withRefVideo(o){this.isDestroyed||this.referenceVideoElement&&o(this.referenceVideoElement)}withVideo(o){if(this.isDestroyed)return;let t=this.videoElement;!t||t.tagName!=="VIDEO"||o(t)}};var T=class{constructor(o){this.startX=0;this.startY=0;this.isDrawing=!1;this.annotationTool=o}isPointerAtShape(o,t,e){return!1}on(o,t){}get ctx(){return this.annotationTool.ctx}onDeactivate(){}onActivate(){}reset(){this.startX=0,this.startY=0,this.isDrawing=!1}save(o){this.annotationTool.addShape(o)}applyRotation(o,t,e){return o.rotation?(this.ctx.save(),this.ctx.translate(t,e),this.ctx.rotate(o.rotation),this.ctx.translate(-t,-e),!0):!1}restoreRotation(){this.ctx.restore()}getRotationCenter(o,t,e){return o.rotationCenterX!==void 0&&o.rotationCenterY!==void 0?{x:o.rotationCenterX*this.annotationTool.canvasWidth,y:o.rotationCenterY*this.annotationTool.canvasHeight}:{x:t,y:e}}};var q=class extends T{constructor(){super(...arguments);this.name="rectangle"}move(t,e,i){return t.x+=e,t.y+=i,t}normalize(t,e,i){return S(w({},t),{x:t.x/e,y:t.y/i,width:t.width/e,height:t.height/i})}onPointerDown(t){let{x:e,y:i}=this.annotationTool.getRelativeCoords(t);this.startX=e,this.startY=i,this.isDrawing=!0}onPointerMove(t){if(!this.isDrawing)return;let{x:e,y:i}=this.annotationTool.getRelativeCoords(t);this.drawRectangle(this.startX,this.startY,e-this.startX,i-this.startY)}onPointerUp(t){if(!this.isDrawing)return;let{x:e,y:i}=this.annotationTool.getRelativeCoords(t);this.save({type:"rectangle",x:this.startX,y:this.startY,width:e-this.startX,height:i-this.startY,strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth}),this.drawRectangle(this.startX,this.startY,e-this.startX,i-this.startY),this.isDrawing=!1}drawRectangle(t,e,i,n){this.ctx.beginPath(),this.ctx.rect(t,e,i,n),this.ctx.stroke()}draw(t){let e=t.x+t.width/2,i=t.y+t.height/2,n=this.getRotationCenter(t,e,i),r=this.applyRotation(t,n.x,n.y);this.drawRectangle(t.x,t.y,t.width,t.height),r&&this.restoreRotation()}isPointerAtShape(t,e,i){let r=Math.min(t.x,t.x+t.width),h=Math.max(t.x,t.x+t.width),l=Math.min(t.y,t.y+t.height),s=Math.max(t.y,t.y+t.height),c=Math.abs(e-r)<=5,d=Math.abs(e-h)<=5,u=Math.abs(i-l)<=5,p=Math.abs(i-s)<=5,f=i>=l-5&&i<=s+5,y=e>=r-5&&e<=h+5;return(c||d)&&f||(u||p)&&y}};var _=class extends T{constructor(){super(...arguments);this.name="circle"}move(t,e,i){return t.x+=e,t.y+=i,t}normalize(t,e,i){return S(w({},t),{x:t.x/e,y:t.y/i,radius:t.radius/e})}onPointerDown(t){let{x:e,y:i}=this.annotationTool.getRelativeCoords(t);this.startX=e,this.startY=i,this.isDrawing=!0}onPointerMove(t){if(!this.isDrawing)return;let{x:e,y:i}=this.annotationTool.getRelativeCoords(t),n=Math.sqrt(Math.pow(e-this.startX,2)+Math.pow(i-this.startY,2));this.drawCircle(this.startX,this.startY,n)}onPointerUp(t){if(!this.isDrawing)return;let{x:e,y:i}=this.annotationTool.getRelativeCoords(t),n=Math.sqrt(Math.pow(e-this.startX,2)+Math.pow(i-this.startY,2));this.save({type:"circle",x:this.startX,y:this.startY,radius:n,strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth}),this.drawCircle(this.startX,this.startY,n),this.isDrawing=!1}drawCircle(t,e,i){this.ctx.beginPath(),this.ctx.arc(t,e,i,0,2*Math.PI),this.ctx.stroke()}draw(t){if(t.radius===void 0||t.radius<0)return;let e=this.getRotationCenter(t,t.x,t.y),i=this.applyRotation(t,e.x,e.y);this.drawCircle(t.x,t.y,t.radius),i&&this.restoreRotation()}isPointerAtShape(t,e,i){var s;if(t.radius===void 0||t.radius<0)return!1;let n=e-t.x,r=i-t.y,h=Math.sqrt(n*n+r*r),l=Math.max(((s=t.lineWidth)!=null?s:1)/2,5);return h<=t.radius+l}};var G=class{constructor(o,t){this.x=o;this.y=t}distanceToLine(o,t){let e=t.x-o.x,i=t.y-o.y,n=Math.abs(i*this.x-e*this.y+t.x*o.y-t.y*o.x),r=Math.sqrt(i*i+e*e);return n/r}};function J(a,o){if(a.length<=2)return a;let t=a[0],e=a[a.length-1],i=-1,n=0;for(let r=1;r<a.length-1;r++){let h=a[r].distanceToLine(t,e);h>n&&(i=r,n=h)}if(n>o){let r=J(a.slice(0,i+1),o),h=J(a.slice(i),o);return r.slice(0,r.length-1).concat(h)}else return[t,e]}var Z=class extends T{constructor(){super(...arguments);this.name="curve";this.curvePoints=[];this.zoomScale=2;this.zoomRadius=100;this.zoomCtx=null;this.zoomCanvas=null;this.onKeyPress=t=>{let e=t.key;if(e===null||e===" "||t.isComposing)return;let i=Number(e);if(isNaN(i)||!i){e in $&&(this.annotationTool.colorPicker.value=$[e],this.annotationTool.setCanvasSettings());return}this.annotationTool.strokeSizePicker.value=e,this.annotationTool.setCanvasSettings()}}move(t,e,i){return t.points=t.points.map(n=>({x:n.x+e,y:n.y+i})),t}onActivate(){this.initZoomCanvas(),document.addEventListener("keypress",this.onKeyPress)}onDeactivate(){this.zoomCtx=null,this.zoomCanvas=null,document.removeEventListener("keypress",this.onKeyPress)}normalize(t,e,i){return S(w({},t),{points:t.points.map(n=>({x:n.x/e,y:n.y/i}))})}draw(t){if(!t.points||t.points.length===0)return;let e=0,i=0;for(let s of t.points)e+=s.x,i+=s.y;let n=e/t.points.length,r=i/t.points.length,h=this.getRotationCenter(t,n,r),l=this.applyRotation(t,h.x,h.y);this.drawCurve(t),l&&this.restoreRotation()}reset(){super.reset(),this.curvePoints=[]}onPointerDown(t){if(this.isDrawing)return;let{x:e,y:i}=this.annotationTool.getRelativeCoords(t);this.curvePoints=[],this.startX=e,this.startY=i,this.isDrawing=!0,this.curvePoints.push({x:e,y:i})}onPointerMove(t){let{x:e,y:i}=this.annotationTool.getRelativeCoords(t);if(!this.isDrawing){this.drawZoomCircle(e,i,t.shiftKey);return}this.curvePoints.push({x:e,y:i}),this.drawCurve({points:this.curvePoints,lineWidth:this.ctx.lineWidth}),this.drawZoomCircle(e,i,t.shiftKey)}onPointerUp(t){let{x:e,y:i}=this.annotationTool.getRelativeCoords(t);if(this.drawZoomCircle(e,i,t.shiftKey),!this.isDrawing)return;this.curvePoints.push({x:e,y:i});let n=this.curvePoints.map(c=>new G(c.x,c.y)),s={type:"curve",points:J(n,.5).map(c=>({x:c.x,y:c.y})),strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth};this.save(s),this.curvePoints=[],this.isDrawing=!1}drawCurve(t){if(t.points.length===2&&t.points[0].x===t.points[1].x&&t.points[0].y===t.points[1].y){let e=t.lineWidth/4,i=0,n=2*Math.PI;this.ctx.beginPath(),this.ctx.arc(t.points[0].x,t.points[0].y,e,i,n),this.ctx.stroke()}else{this.ctx.beginPath(),this.ctx.moveTo(t.points[0].x,t.points[0].y);for(let e=0;e<t.points.length-1;e++){let i=t.points[e],n=t.points[e+1];this.ctx.quadraticCurveTo(i.x,i.y,n.x,n.y)}this.ctx.stroke()}}initZoomCanvas(){let t=document.createElement("canvas"),e=2;t.width=this.zoomRadius*2*e,t.height=this.zoomRadius*2*e;let i=t.getContext("2d");i&&(i.imageSmoothingQuality="high",i.imageSmoothingEnabled=!0,this.zoomCtx=i,this.zoomCanvas=t)}isPointerAtShape(t,e,i){var r;if(!t.points||t.points.length===0)return!1;let n=Math.max(((r=t.lineWidth)!=null?r:this.ctx.lineWidth)/2,5);for(let h=0;h<t.points.length-1;h++){let l=t.points[h],s=t.points[h+1],c=e-l.x,d=i-l.y,u=s.x-l.x,p=s.y-l.y,f=c*u+d*p,y=u*u+p*p,x=-1;y!==0&&(x=f/y);let v,g;x<0?(v=l.x,g=l.y):x>1?(v=s.x,g=s.y):(v=l.x+x*u,g=l.y+x*p);let b=e-v,k=i-g;if(Math.sqrt(b*b+k*k)<n)return!0}return!1}drawZoomCircle(t,e,i=!1){if(!i)return;this.isDrawing||(this.annotationTool.clearCanvas(),this.annotationTool.addVideoOverlay(),this.annotationTool.drawShapesOverlay());let n=this.zoomCtx;if(!n)return;let r=this.annotationTool.pixelRatio,h=this.zoomRadius*2/this.zoomScale,l=t-h/2,s=e-h/2;n.clearRect(0,0,this.zoomCanvas.width,this.zoomCanvas.height),n.drawImage(this.ctx.canvas,l*r,s*r,h*r,h*r,0,0,this.zoomRadius*2,this.zoomRadius*2),this.ctx.save(),this.ctx.beginPath(),this.ctx.arc(t,e,this.zoomRadius,0,2*Math.PI),this.ctx.closePath(),this.ctx.clip(),this.ctx.drawImage(this.zoomCanvas,t-this.zoomRadius,e-this.zoomRadius),this.ctx.restore()}};var Q=class extends T{constructor(){super(...arguments);this.name="line"}move(t,e,i){return t.x1+=e,t.y1+=i,t.x2+=e,t.y2+=i,t}normalize(t,e,i){return S(w({},t),{x1:t.x1/e,y1:t.y1/i,x2:t.x2/e,y2:t.y2/i})}onPointerDown(t){let{x:e,y:i}=this.annotationTool.getRelativeCoords(t);this.startX=e,this.startY=i,this.isDrawing=!0}onPointerMove(t){if(!this.isDrawing)return;let{x:e,y:i}=this.annotationTool.getRelativeCoords(t);this.drawLine(this.startX,this.startY,e,i)}onPointerUp(t){if(!this.isDrawing)return;let{x:e,y:i}=this.annotationTool.getRelativeCoords(t);this.save({type:"line",x1:this.startX,y1:this.startY,x2:e,y2:i,fillStyle:this.ctx.fillStyle,strokeStyle:this.ctx.strokeStyle,lineWidth:this.ctx.lineWidth}),this.drawLine(this.startX,this.startY,e,i),this.isDrawing=!1}drawLine(t,e,i,n){this.ctx.beginPath(),this.ctx.moveTo(t,e),this.ctx.lineTo(i,n),this.ctx.stroke()}draw(t){let e=(t.x1+t.x2)/2,i=(t.y1+t.y2)/2,n=this.getRotationCenter(t,e,i),r=this.applyRotation(t,n.x,n.y);this.drawLine(t.x1,t.y1,t.x2,t.y2),r&&this.restoreRotation()}isPointerAtShape(t,e,i){var u;let{x1:n,y1:r,x2:h,y2:l}=t,s=Math.max(((u=t.lineWidth)!=null?u:1)/2,5),c=(h-n)*(r-i)-(n-e)*(l-r),d=B(h-n,2)+B(l-r,2);if(d===0){let p=e-n,f=i-r;return Math.sqrt(p*p+f*f)<=s}return Math.abs(c)/Math.sqrt(d)<=s&&e>=Math.min(n,h)-s&&e<=Math.max(n,h)+s&&i>=Math.min(r,l)-s&&i<=Math.max(r,l)+s}};var tt=class extends T{constructor(){super(...arguments);this.name="arrow"}normalize(t,e,i){return S(w({},t),{x1:t.x1/e,y1:t.y1/i,x2:t.x2/e,y2:t.y2/i})}move(t,e,i){return t.x1+=e,t.y1+=i,t.x2+=e,t.y2+=i,t}draw(t){let e=(t.x1+t.x2)/2,i=(t.y1+t.y2)/2,n=this.getRotationCenter(t,e,i),r=this.applyRotation(t,n.x,n.y);this.drawArrow(t.x1,t.y1,t.x2,t.y2,t.lineWidth),r&&this.restoreRotation()}onPointerDown(t){let{x:e,y:i}=this.annotationTool.getRelativeCoords(t);this.startX=e,this.startY=i,this.isDrawing=!0}onPointerMove(t){if(!this.isDrawing)return;let{x:e,y:i}=this.annotationTool.getRelativeCoords(t);this.drawArrow(this.startX,this.startY,e,i)}onPointerUp(t){if(!this.isDrawing)return;let{x:e,y:i}=this.annotationTool.getRelativeCoords(t);this.save({type:"arrow",x1:this.startX,y1:this.startY,x2:e,y2:i,strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth}),this.drawArrow(this.startX,this.startY,e,i),this.isDrawing=!1}drawArrow(t,e,i,n,r){let h=10+2.5*(r!=null?r:this.ctx.lineWidth),l=Math.PI/6,s=Math.atan2(n-e,i-t);this.ctx.beginPath(),this.ctx.moveTo(t,e),this.ctx.lineTo(i,n),this.ctx.stroke(),this.ctx.beginPath(),this.ctx.moveTo(i,n),this.ctx.lineTo(i-h*Math.cos(s+l),n-h*Math.sin(s+l)),this.ctx.moveTo(i,n),this.ctx.lineTo(i-h*Math.cos(s-l),n-h*Math.sin(s-l)),this.ctx.stroke()}isPointerAtShape(t,e,i){var u;let{x1:n,y1:r,x2:h,y2:l}=t,s=Math.max(((u=t.lineWidth)!=null?u:1)/2,5),c=(h-n)*(r-i)-(n-e)*(l-r),d=B(h-n,2)+B(l-r,2);if(d===0){let p=e-n,f=i-r;return Math.sqrt(p*p+f*f)<=s}return Math.abs(c)/Math.sqrt(d)<=s&&e>=Math.min(n,h)-s&&e<=Math.max(n,h)+s&&i>=Math.min(r,l)-s&&i<=Math.max(r,l)+s}};var et=class extends T{constructor(){super(...arguments);this.name="text";this.activePopup=null;this.handleKeyDown=t=>{}}move(t,e,i){return t.x+=e,t.y+=i,t}onActivate(){this.annotationTool.canvas.style.cursor="text",this.isDrawing=!0}onDeactivate(){this.destroyPopup(),this.annotationTool.canvas.style.cursor="default",this.isDrawing=!1}draw(t){var p;if(!t.text)return;let e=t.text.split(`
`),i=16+((p=t.lineWidth)!=null?p:this.ctx.lineWidth)*.5,n=i*1.25;this.ctx.font=`${i}px Helvetica Neue, Arial`;let r=e.map(f=>this.ctx.measureText(f).width),h=r.length>0?Math.max(...r):0,l=e.length*n,s=t.x+h/2,c=t.y-i/2+l/2,d=this.getRotationCenter(t,s,c),u=this.applyRotation(t,d.x,d.y);for(let f=0;f<e.length;f++)this.drawTextLine(t.x,t.y+f*n,e[f],i);u&&this.restoreRotation()}drawText(t,e,i){let n=16+this.ctx.lineWidth*.5;this.ctx.font=`${n}px Helvetica Neue, Arial`,this.ctx.fillText(i,t,e)}drawTextLine(t,e,i,n){this.ctx.font=`${n}px Helvetica Neue, Arial`,this.ctx.fillText(i,t,e)}onPointerDown(t){let{x:e,y:i}=this.annotationTool.getRelativeCoords(t);this.startX=e,this.startY=i}onPointerMove(t){let{x:e,y:i}=this.annotationTool.getRelativeCoords(t);this.ctx.beginPath(),this.ctx.arc(e,i,5,0,2*Math.PI),this.ctx.fill()}normalize(t,e,i){return S(w({},t),{x:t.x/e,y:t.y/i})}destroyPopup(){var t;this.activePopup&&((t=this.annotationTool.canvas.parentElement)==null||t.removeChild(this.activePopup),this.activePopup=null,document.removeEventListener("keydown",this.handleKeyDown))}createTextInputPopup(t,e){var p;this.destroyPopup();let i=document.createElement("div");this.activePopup=i,i.style.cssText=`
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      z-index: 1000;
      min-width: 280px;
    `;let n=document.createElement("input");n.type="text",n.placeholder="Enter text to draw",n.style.cssText=`
      display: block;
      width: 100%;
      padding: 8px 12px;
      margin-bottom: 16px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      line-height: 20px;
      box-sizing: border-box;
      outline: none;
      transition: border-color 0.2s;
    `,n.addEventListener("focus",()=>{n.style.borderColor="#007bff"}),n.addEventListener("blur",()=>{n.style.borderColor="#ddd"});let r=document.createElement("div");r.style.cssText=`
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    `;let h=`
      height: 36px;
      min-width: 80px;
      padding: 0 16px;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: opacity 0.2s;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    `,l=document.createElement("button");l.textContent="Cancel",l.style.cssText=`
      ${h}
      background: #f0f0f0;
      color: #333;
    `,l.addEventListener("mouseover",()=>{l.style.opacity="0.8"}),l.addEventListener("mouseout",()=>{l.style.opacity="1"});let s=document.createElement("button");s.textContent="OK",s.style.cssText=`
      ${h}
      background: #007bff;
      color: white;
    `,s.addEventListener("mouseover",()=>{s.style.opacity="0.8"}),s.addEventListener("mouseout",()=>{s.style.opacity="1"});let c=()=>{this.destroyPopup()},d=()=>{let f=n.value.trim();f&&(this.save({type:"text",x:t,y:e,text:f,strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth}),this.annotationTool.currentTool=null),c()},u=f=>{f.key==="Escape"?c():f.key==="Enter"&&d()};this.handleKeyDown=u,s.onclick=d,l.onclick=c,n.onkeyup=u,document.addEventListener("keydown",u),r.appendChild(l),r.appendChild(s),i.appendChild(n),i.appendChild(r),(p=this.annotationTool.canvas.parentElement)==null||p.appendChild(i),requestAnimationFrame(()=>{n.focus()})}onPointerUp(t){let{x:e,y:i}=this.annotationTool.getRelativeCoords(t);this.createTextInputPopup(e,i)}isPointerAtShape(t,e,i){var d;if(!t.text)return!1;let n=t.text.split(`
`);if(n.length===0)return!1;let r=16+((d=t.lineWidth)!=null?d:1)*.5,h=r*1.25,l=n.length*h;this.ctx.font=`${r}px Helvetica Neue, Arial`;let s=n.map(u=>this.ctx.measureText(u).width),c=s.length>0?Math.max(...s):0;return c===0?!1:e>=t.x&&e<=t.x+c&&i>=t.y-r&&i<=t.y+l-r}};var it=class extends T{constructor(){super(...arguments);this.name="eraser"}move(t,e,i){return t.x+=e,t.y+=i,t}normalize(t,e,i){return S(w({},t),{x:t.x/e,y:t.y/i,width:t.width/e,height:t.height/i})}draw(t){this.drawEraser(t.x,t.y,t.width,t.height)}onPointerDown(t){let{x:e,y:i}=this.annotationTool.getRelativeCoords(t);this.startX=e,this.startY=i,this.isDrawing=!0}onPointerMove(t){if(!this.isDrawing)return;let{x:e,y:i}=this.annotationTool.getRelativeCoords(t);this.ctx.save(),this.ctx.strokeStyle="rgba(255, 255, 255, 0.5)",this.ctx.lineWidth=1,this.ctx.fillStyle="rgba(255, 255, 255, 0.3)",this.ctx.fillRect(this.startX,this.startY,e-this.startX,i-this.startY),this.ctx.strokeRect(this.startX,this.startY,e-this.startX,i-this.startY),this.ctx.restore()}onPointerUp(t){if(!this.isDrawing)return;this.isDrawing=!1;let{x:e,y:i}=this.annotationTool.getRelativeCoords(t);this.save({type:"eraser",x:this.startX,y:this.startY,width:e-this.startX,height:i-this.startY,strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth})}drawEraser(t,e,i,n){this.ctx.clearRect(t,e,i,n)}isPointerAtShape(t,e,i){let n=Math.min(t.x,t.x+t.width),r=Math.max(t.x,t.x+t.width),h=Math.min(t.y,t.y+t.height),l=Math.max(t.y,t.y+t.height);return e>=n&&e<=r&&i>=h&&i<=l}};var nt=class extends T{constructor(){super(...arguments);this.name="move";this.shape=null;this.shapeIndex=-1;this.lastDrawnShape=null;this.isScale=!1;this.selectedShapeIndex=-1;this.boundHandleKeyDown=null;this.activeHandle=null;this.handleSize=8;this.resizeStartBounds=null;this.resizeOriginalShape=null;this.rotationActive=!1;this.rotationStartAngle=0;this.rotationShapeStartAngle=0;this.centerDragActive=!1;this.rotationHandleDistance=40}cloneShape(t){if(t.type==="image"){let e=t;return S(w({},JSON.parse(JSON.stringify(t))),{image:e.image})}return JSON.parse(JSON.stringify(t))}getSelectedShape(){return this.selectedShapeIndex<0||this.selectedShapeIndex>=this.annotationTool.shapes.length?null:this.annotationTool.shapes[this.selectedShapeIndex]}setSelectedShapeOpacity(t){return this.selectedShapeIndex<0||this.selectedShapeIndex>=this.annotationTool.shapes.length?!1:(this.annotationTool.undoStack.push([...this.annotationTool.shapes]),this.annotationTool.shapes[this.selectedShapeIndex].opacity=t,this.annotationTool.redrawFullCanvas(),!0)}move(t){return t}normalize(t){return w({},t)}onActivate(){this.boundHandleKeyDown=this.handleKeyDown.bind(this),document.addEventListener("keydown",this.boundHandleKeyDown)}onDeactivate(){this.boundHandleKeyDown&&(document.removeEventListener("keydown",this.boundHandleKeyDown),this.boundHandleKeyDown=null),this.selectedShapeIndex=-1}handleKeyDown(t){if((t.key==="Backspace"||t.key==="Delete")&&this.selectedShapeIndex>=0){t.preventDefault(),this.deleteSelectedShape();return}if((t.ctrlKey||t.metaKey)&&t.key.toLowerCase()==="d"&&this.selectedShapeIndex>=0){t.preventDefault(),this.duplicateSelectedShape();return}if((t.ctrlKey||t.metaKey)&&t.shiftKey&&t.key==="ArrowRight"){t.preventDefault(),this.copyAnnotationsToNextFrame();return}if((t.ctrlKey||t.metaKey)&&t.shiftKey&&t.key==="ArrowLeft"){t.preventDefault(),this.copyAnnotationsToPrevFrame();return}}duplicateSelectedShape(){let t=this.getSelectedShape();if(!t)return;let e=this.cloneShape(t),i=20;this.getShapeBounds(e)&&this.offsetShape(e,i,i),this.annotationTool.undoStack.push([...this.annotationTool.shapes]);let r=this.annotationTool.serialize([e])[0];this.annotationTool.shapes.push(r),this.selectedShapeIndex=this.annotationTool.shapes.length-1,this.annotationTool.redrawFullCanvas()}copyAnnotationsToNextFrame(){let e=this.annotationTool.activeTimeFrame+1;if(e>this.annotationTool.totalFrames||this.annotationTool.shapes.length===0)return;let i=this.annotationTool.timeStack.get(e)||[],n=this.annotationTool.shapes.map(h=>this.cloneShape(h)),r=[...i,...n];this.annotationTool.timeStack.set(e,r),this.annotationTool.playbackFrame=e,this.annotationTool.redrawFullCanvas()}copyAnnotationsToPrevFrame(){let e=this.annotationTool.activeTimeFrame-1;if(e<1||this.annotationTool.shapes.length===0)return;let i=this.annotationTool.timeStack.get(e)||[],n=this.annotationTool.shapes.map(h=>this.cloneShape(h)),r=[...i,...n];this.annotationTool.timeStack.set(e,r),this.annotationTool.playbackFrame=e,this.annotationTool.redrawFullCanvas()}offsetShape(t,e,i){let n=this.annotationTool.deserialize([t])[0],h=this.annotationTool.pluginForTool(n.type).move(n,e,i);Object.assign(t,this.annotationTool.serialize([h])[0])}getShapeBounds(t){var i;let e=this.annotationTool.deserialize([t])[0];switch(e.type){case"rectangle":{let n=e;return{x:Math.min(n.x,n.x+n.width),y:Math.min(n.y,n.y+n.height),width:Math.abs(n.width),height:Math.abs(n.height)}}case"image":{let n=e;return{x:Math.min(n.x,n.x+n.width),y:Math.min(n.y,n.y+n.height),width:Math.abs(n.width),height:Math.abs(n.height)}}case"selection":{let n=e;return{x:Math.min(n.x,n.x+n.width),y:Math.min(n.y,n.y+n.height),width:Math.abs(n.width),height:Math.abs(n.height)}}case"circle":{let n=e;return{x:n.x-n.radius,y:n.y-n.radius,width:n.radius*2,height:n.radius*2}}case"line":{let n=e,r=Math.min(n.x1,n.x2),h=Math.min(n.y1,n.y2),l=Math.max(n.x1,n.x2),s=Math.max(n.y1,n.y2);return{x:r,y:h,width:l-r||10,height:s-h||10}}case"arrow":{let n=e,r=Math.min(n.x1,n.x2),h=Math.min(n.y1,n.y2),l=Math.max(n.x1,n.x2),s=Math.max(n.y1,n.y2);return{x:r,y:h,width:l-r||10,height:s-h||10}}case"curve":{let n=e;if(!n.points||n.points.length===0)return null;let r=1/0,h=1/0,l=-1/0,s=-1/0;for(let c of n.points)r=Math.min(r,c.x),h=Math.min(h,c.y),l=Math.max(l,c.x),s=Math.max(s,c.y);return{x:r,y:h,width:l-r||10,height:s-h||10}}case"text":{let n=e;if(!n.text)return null;let h=16+((i=t.lineWidth)!=null?i:1)*.5,l=n.text.length*h*.6;return{x:n.x,y:n.y-h,width:l||50,height:h*1.2}}default:return null}}drawResizeHandles(){let t=this.getSelectedShape();if(!t)return;let e=this.getShapeBounds(t);if(!e)return;let i=this.annotationTool.ctx,n=this.handleSize,r=n/2,h=[{pos:"nw",x:e.x,y:e.y},{pos:"n",x:e.x+e.width/2,y:e.y},{pos:"ne",x:e.x+e.width,y:e.y},{pos:"e",x:e.x+e.width,y:e.y+e.height/2},{pos:"se",x:e.x+e.width,y:e.y+e.height},{pos:"s",x:e.x+e.width/2,y:e.y+e.height},{pos:"sw",x:e.x,y:e.y+e.height},{pos:"w",x:e.x,y:e.y+e.height/2}];i.save(),i.strokeStyle="#5b9fff",i.lineWidth=1,i.setLineDash([4,4]),i.strokeRect(e.x,e.y,e.width,e.height),i.setLineDash([]),i.fillStyle="#ffffff",i.strokeStyle="#5b9fff",i.lineWidth=1;for(let l of h)i.fillRect(l.x-r,l.y-r,n,n),i.strokeRect(l.x-r,l.y-r,n,n);i.restore(),this.drawRotationHandles(e)}getShapeRotationCenter(t,e){return t.rotationCenterX!==void 0&&t.rotationCenterY!==void 0?{x:t.rotationCenterX*this.annotationTool.canvasWidth,y:t.rotationCenterY*this.annotationTool.canvasHeight}:{x:e.x+e.width/2,y:e.y+e.height/2}}drawRotationHandles(t){var c;let e=this.getSelectedShape();if(!e)return;let i=this.annotationTool.ctx,n=this.getShapeRotationCenter(e,t),r=(c=e.rotation)!=null?c:0,h=n.x+Math.sin(r)*this.rotationHandleDistance,l=n.y-Math.cos(r)*this.rotationHandleDistance;i.save(),i.beginPath(),i.strokeStyle="#5b9fff",i.lineWidth=1,i.setLineDash([]),i.moveTo(n.x,n.y),i.lineTo(h,l),i.stroke();let s=6;i.beginPath(),i.strokeStyle="#5b9fff",i.lineWidth=1.5,i.moveTo(n.x-s,n.y),i.lineTo(n.x+s,n.y),i.moveTo(n.x,n.y-s),i.lineTo(n.x,n.y+s),i.stroke(),i.beginPath(),i.fillStyle="#ffffff",i.strokeStyle="#5b9fff",i.lineWidth=1.5,i.arc(n.x,n.y,4,0,Math.PI*2),i.fill(),i.stroke(),i.beginPath(),i.fillStyle="#ffffff",i.strokeStyle="#5b9fff",i.lineWidth=1.5,i.arc(h,l,6,0,Math.PI*2),i.fill(),i.stroke(),i.beginPath(),i.strokeStyle="#5b9fff",i.lineWidth=1,i.arc(h,l,3,-Math.PI*.7,Math.PI*.5),i.stroke(),i.restore()}isPointerAtRotationHandle(t,e){var p;let i=this.getSelectedShape();if(!i)return!1;let n=this.getShapeBounds(i);if(!n)return!1;let r=this.getShapeRotationCenter(i,n),h=(p=i.rotation)!=null?p:0,l=r.x+Math.sin(h)*this.rotationHandleDistance,s=r.y-Math.cos(h)*this.rotationHandleDistance,c=t-l,d=e-s;return Math.sqrt(c*c+d*d)<=12}isPointerAtRotationCenter(t,e){let i=this.getSelectedShape();if(!i)return!1;let n=this.getShapeBounds(i);if(!n)return!1;let r=this.getShapeRotationCenter(i,n),h=t-r.x,l=e-r.y;return Math.sqrt(h*h+l*l)<=10}calculateAngle(t,e,i,n){return Math.atan2(i-t,-(n-e))}getHandleAtPosition(t,e){let i=this.getSelectedShape();if(!i)return null;let n=this.getShapeBounds(i);if(!n)return null;let h=(this.handleSize+4)/2,l=[{pos:"nw",x:n.x,y:n.y},{pos:"n",x:n.x+n.width/2,y:n.y},{pos:"ne",x:n.x+n.width,y:n.y},{pos:"e",x:n.x+n.width,y:n.y+n.height/2},{pos:"se",x:n.x+n.width,y:n.y+n.height},{pos:"s",x:n.x+n.width/2,y:n.y+n.height},{pos:"sw",x:n.x,y:n.y+n.height},{pos:"w",x:n.x,y:n.y+n.height/2}];for(let s of l)if(t>=s.x-h&&t<=s.x+h&&e>=s.y-h&&e<=s.y+h)return s.pos;return null}getCursorForHandle(t){return{nw:"nw-resize",n:"n-resize",ne:"ne-resize",e:"e-resize",se:"se-resize",s:"s-resize",sw:"sw-resize",w:"w-resize"}[t]}resizeShape(t,e,i,n,r,h=!1){var x;if(!this.resizeOriginalShape)return;let l=this.annotationTool.deserialize([this.resizeOriginalShape])[0],s=r.x,c=r.y,d=r.width,u=r.height;switch(e){case"nw":s+=i,c+=n,d-=i,u-=n;break;case"n":c+=n,u-=n;break;case"ne":c+=n,d+=i,u-=n;break;case"e":d+=i;break;case"se":d+=i,u+=n;break;case"s":u+=n;break;case"sw":s+=i,d-=i,u+=n;break;case"w":s+=i,d-=i;break}if(h&&r.width>0&&r.height>0){let v=r.width/r.height;if(e==="n"||e==="s"){let g=u*v,b=g-d;d=g,s-=b/2}else if(e==="e"||e==="w"){let g=d/v,b=g-u;u=g,c-=b/2}else{let g=d/r.width,b=u/r.height,k=Math.max(Math.abs(g),Math.abs(b)),I=g>=0?1:-1,C=b>=0?1:-1,E=r.width*k*I,M=r.height*k*C;e==="nw"?(s=r.x+r.width-E,c=r.y+r.height-M):e==="ne"?c=r.y+r.height-M:e==="sw"&&(s=r.x+r.width-E),d=E,u=M}}let p=10;d<p&&(e.includes("w")&&(s=r.x+r.width-p),d=p),u<p&&(e.includes("n")&&(c=r.y+r.height-p),u=p);let f=r.width>0?d/r.width:1,y=r.height>0?u/r.height:1;switch(l.type){case"rectangle":{let v=t;v.x=s/this.annotationTool.canvasWidth,v.y=c/this.annotationTool.canvasHeight,v.width=d/this.annotationTool.canvasWidth,v.height=u/this.annotationTool.canvasHeight;break}case"selection":{let v=t;v.x=s/this.annotationTool.canvasWidth,v.y=c/this.annotationTool.canvasHeight,v.width=d/this.annotationTool.canvasWidth,v.height=u/this.annotationTool.canvasHeight;break}case"circle":{let v=t,g=Math.min(d,u)/2,b=s+d/2,k=c+u/2;v.x=b/this.annotationTool.canvasWidth,v.y=k/this.annotationTool.canvasHeight,v.radius=g/this.annotationTool.canvasWidth;break}case"line":{let v=t,g=l,b=(g.x1-r.x)*f+s,k=(g.y1-r.y)*y+c,I=(g.x2-r.x)*f+s,C=(g.y2-r.y)*y+c;v.x1=b/this.annotationTool.canvasWidth,v.y1=k/this.annotationTool.canvasHeight,v.x2=I/this.annotationTool.canvasWidth,v.y2=C/this.annotationTool.canvasHeight;break}case"arrow":{let v=t,g=l,b=(g.x1-r.x)*f+s,k=(g.y1-r.y)*y+c,I=(g.x2-r.x)*f+s,C=(g.y2-r.y)*y+c;v.x1=b/this.annotationTool.canvasWidth,v.y1=k/this.annotationTool.canvasHeight,v.x2=I/this.annotationTool.canvasWidth,v.y2=C/this.annotationTool.canvasHeight;break}case"curve":{let v=t,g=l;if(!g.points||g.points.length===0)break;v.points=g.points.map(b=>({x:((b.x-r.x)*f+s)/this.annotationTool.canvasWidth,y:((b.y-r.y)*y+c)/this.annotationTool.canvasHeight}));break}case"text":{let v=t,g=l,k=16+((x=this.resizeOriginalShape.lineWidth)!=null?x:1)*.5,I=(g.x-r.x)*f+s,C=(g.y-r.y)*y+c;v.x=I/this.annotationTool.canvasWidth,v.y=C/this.annotationTool.canvasHeight;let E=(f+y)/2,M=k*E;v.lineWidth=Math.max(1,(M-16)*2);break}case"image":{let v=t;v.x=s/this.annotationTool.canvasWidth,v.y=c/this.annotationTool.canvasHeight,v.width=d/this.annotationTool.canvasWidth,v.height=u/this.annotationTool.canvasHeight;break}}}deleteSelectedShape(){this.selectedShapeIndex<0||this.selectedShapeIndex>=this.annotationTool.shapes.length||(this.annotationTool.undoStack.push([...this.annotationTool.shapes]),this.annotationTool.shapes.splice(this.selectedShapeIndex,1),this.selectedShapeIndex=-1,this.shapeIndex=-1,this.annotationTool.redrawFullCanvas())}onPointerDown(t){var s;let{x:e,y:i}=this.annotationTool.getRelativeCoords(t);if(this.selectedShapeIndex>=0&&this.isPointerAtRotationHandle(e,i)){let c=this.getSelectedShape();if(c){let d=this.getShapeBounds(c);if(d){let u=this.getShapeRotationCenter(c,d);this.rotationActive=!0,this.rotationStartAngle=this.calculateAngle(u.x,u.y,e,i),this.rotationShapeStartAngle=(s=c.rotation)!=null?s:0,this.isDrawing=!0,this.annotationTool.undoStack.push([...this.annotationTool.shapes]),this.annotationTool.canvas.style.cursor="grabbing";return}}}if(this.selectedShapeIndex>=0&&this.isPointerAtRotationCenter(e,i)){this.centerDragActive=!0,this.startX=e,this.startY=i,this.isDrawing=!0,this.annotationTool.undoStack.push([...this.annotationTool.shapes]),this.annotationTool.canvas.style.cursor="move";return}let n=this.getHandleAtPosition(e,i);if(n&&this.selectedShapeIndex>=0){this.activeHandle=n,this.startX=e,this.startY=i,this.isDrawing=!0;let c=this.getSelectedShape();c&&(this.resizeStartBounds=this.getShapeBounds(c),this.resizeOriginalShape=this.cloneShape(c),this.annotationTool.undoStack.push([...this.annotationTool.shapes])),this.annotationTool.canvas.style.cursor=this.getCursorForHandle(n);return}let r=this.annotationTool.shapes,h=r.slice().reverse(),l=!1;for(let c of h)if(this.isPointerAtShape(c,e,i)){this.shape=this.cloneShape(c),this.shapeIndex=r.indexOf(c),this.selectedShapeIndex=this.shapeIndex,l=!0;break}l||(this.selectedShapeIndex=-1,this.annotationTool.redrawFullCanvas()),this.shape&&(this.lastDrawnShape=null,this.startX=e,this.startY=i,this.isDrawing=!0,this.isScale=this.shape.type==="image"?this.isPointerAtCorner(this.shape,e,i):!1,this.isScale?this.annotationTool.canvas.style.cursor="nw-resize":this.annotationTool.canvas.style.cursor="move")}isPointerAtShape(t,e,i){let n=this.annotationTool.deserialize([t])[0];if(n.rotation){let h=this.getShapeBounds(n);if(h){let l=this.getShapeRotationCenter(n,h),s=Math.cos(-n.rotation),c=Math.sin(-n.rotation),d=e-l.x,u=i-l.y;e=l.x+d*s-u*c,i=l.y+d*c+u*s}}return this.annotationTool.pluginForTool(n.type).isPointerAtShape(n,e,i)}isPointerAtCorner(t,e,i){if(!("type"in t))return!1;let n=this.annotationTool.deserialize([t])[0],r=15,h=Math.abs(n.y-i)<r,l=Math.abs(n.x-e)<r,s=Math.abs(n.x+n.width-e)<r,c=Math.abs(n.y+n.height-i)<r;return h&&l||h&&s||c&&l||c&&s}onPointerMove(t){let{x:e,y:i}=this.annotationTool.getRelativeCoords(t);if(this.isDrawing&&this.rotationActive){let s=this.annotationTool.shapes[this.selectedShapeIndex];if(s){let c=this.getShapeBounds(s);if(c){let d=this.getShapeRotationCenter(s,c),u=this.calculateAngle(d.x,d.y,e,i),p=this.rotationShapeStartAngle+(u-this.rotationStartAngle);if(t.shiftKey){let f=Math.PI/12;p=Math.round(p/f)*f}s.rotation=p,this.annotationTool.redrawFullCanvas()}}return}if(this.isDrawing&&this.centerDragActive){let s=this.annotationTool.shapes[this.selectedShapeIndex];s&&(s.rotationCenterX=e/this.annotationTool.canvasWidth,s.rotationCenterY=i/this.annotationTool.canvasHeight,this.annotationTool.redrawFullCanvas());return}if(this.isDrawing&&this.activeHandle&&this.resizeStartBounds){let s=e-this.startX,c=i-this.startY,d=this.annotationTool.shapes[this.selectedShapeIndex];d&&(this.resizeShape(d,this.activeHandle,s,c,this.resizeStartBounds,t.shiftKey),this.annotationTool.redrawFullCanvas());return}if(!this.isDrawing&&this.selectedShapeIndex>=0){if(this.isPointerAtRotationHandle(e,i)){this.annotationTool.canvas.style.cursor="grab";return}if(this.isPointerAtRotationCenter(e,i)){this.annotationTool.canvas.style.cursor="move";return}let s=this.getHandleAtPosition(e,i);if(s){this.annotationTool.canvas.style.cursor=this.getCursorForHandle(s);return}}if(!this.isDrawing||!this.shape){this.isDrawing||(this.annotationTool.canvas.style.cursor="default");return}let n=e-this.startX,r=i-this.startY;this.startX=e-n,this.startY=i-r;let h=this.annotationTool.deserialize([this.shape])[0],l=h.type==="image"?h:JSON.parse(JSON.stringify(h));if(l.type!=="audio-peaks")if(l.type==="image")if(this.isScale){let{width:s,height:c}=l,d=s/c,u=s+n,p=u/d;l.width=u,l.height=p,this.lastDrawnShape=l,this.annotationTool.pluginForTool(l.type).draw(l)}else{let s=this.annotationTool.pluginForTool(l.type).move(l,n,r);this.lastDrawnShape=s,this.annotationTool.pluginForTool(l.type).draw(s)}else{let s=this.annotationTool.pluginForTool(l.type).move(l,n,r);this.lastDrawnShape=s,this.annotationTool.pluginForTool(l.type).draw(s)}}onPointerUp(t){if(this.rotationActive){this.rotationActive=!1,this.isDrawing=!1,this.annotationTool.canvas.style.cursor="default",this.annotationTool.redrawFullCanvas();return}if(this.centerDragActive){this.centerDragActive=!1,this.isDrawing=!1,this.annotationTool.canvas.style.cursor="default",this.annotationTool.redrawFullCanvas();return}if(this.activeHandle){this.activeHandle=null,this.resizeStartBounds=null,this.resizeOriginalShape=null,this.isDrawing=!1,this.annotationTool.canvas.style.cursor="default",this.annotationTool.redrawFullCanvas();return}if(!this.isDrawing||!this.lastDrawnShape){this.isDrawing=!1,this.annotationTool.redrawFullCanvas();return}this.lastDrawnShape&&this.shape&&(this.lastDrawnShape.fillStyle=this.shape.fillStyle,this.lastDrawnShape.strokeStyle=this.shape.strokeStyle,this.lastDrawnShape.lineWidth=this.shape.lineWidth,this.shape.opacity!==void 0&&(this.lastDrawnShape.opacity=this.shape.opacity),this.save(this.lastDrawnShape)),this.isDrawing=!1,this.isScale=!1,this.shape=null,this.lastDrawnShape=null,this.annotationTool.canvas.style.cursor="default",this.annotationTool.redrawFullCanvas()}draw(){throw new Error("Method not implemented.")}reset(){this.isDrawing=!1,this.shape=null,this.isScale=!1,this.lastDrawnShape=null,this.shapeIndex=-1,this.selectedShapeIndex=-1,this.activeHandle=null,this.resizeStartBounds=null,this.resizeOriginalShape=null,this.rotationActive=!1,this.centerDragActive=!1,this.annotationTool.canvas.style.cursor="default"}save(t){this.annotationTool.replaceShape(t,this.shapeIndex)}};var ot=class extends T{constructor(){super(...arguments);this.name="image"}move(t,e,i){return t.x+=e,t.y+=i,t}onPointerDown(t){}onPointerMove(t){}onPointerUp(t){}normalize(t,e,i){return S(w({},t),{x:t.x/e,y:t.y/i,width:t.width/e,height:t.height/i})}draw(t){if(!(t.image instanceof HTMLImageElement)){console.error("Image is not an instance of HTMLImageElement");return}if(t.width===0||t.height===0)return;let e=t.x+t.width/2,i=t.y+t.height/2,n=this.getRotationCenter(t,e,i),r=this.applyRotation(t,n.x,n.y);this.ctx.drawImage(t.image,t.x,t.y,t.width,t.height),r&&this.restoreRotation()}isPointerAtShape(t,e,i){let n=Math.min(t.x,t.x+t.width),r=Math.max(t.x,t.x+t.width),h=Math.min(t.y,t.y+t.height),l=Math.max(t.y,t.y+t.height);return e>=n&&e<=r&&i>=h&&i<=l}};var at=class extends T{constructor(){super(...arguments);this.name="compare";this.comparisonLine=0;this.leftOpacity=1;this.isDrawing=!1}get rightOpacity(){return this.annotationTool.overlayOpacity}move(t,e,i){return t.x+=e,t}onActivate(){this.comparisonLine=this.annotationTool.canvasWidth/2,this.leftOpacity=1,this.annotationTool.canvas.style.cursor="col-resize"}onDeactivate(){this.annotationTool.canvas.style.cursor="default",this.comparisonLine=0,this.leftOpacity=1,this.isDrawing=!1}normalize(t,e,i){return S(w({},t),{x:t.x/e})}onPointerDown(t){let{x:e,y:i}=this.annotationTool.getRelativeCoords(t);this.startX=e,this.startY=i,this.isDrawing=!0,this.disablePreviousCompare(),this.onPointerMove(t)}onPointerMove(t){if(!this.isDrawing){if(this.annotationTool.globalShapes.length>0){let n=this.annotationTool.globalShapes[0];if(n.type==="compare"){let r=this.annotationTool.deserialize([n])[0];this.draw(r),this.annotationTool.addFrameSquareOverlay()}}return}let{x:e}=this.annotationTool.getRelativeCoords(t);this.comparisonLine=e;let i={type:"compare",strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth,x:e};this.draw(i),this.drawDelimiter(i)}onPointerUp(){this.isDrawing&&(this.save({type:"compare",strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth,disabled:!1,x:this.comparisonLine}),this.isDrawing=!1)}removePreviousCompare(){this.annotationTool.globalShapes=this.annotationTool.globalShapes.filter(t=>t.type!=="compare")}disablePreviousCompare(){this.annotationTool.globalShapes=this.annotationTool.globalShapes.map(t=>t.type==="compare"?S(w({},t),{disabled:!0}):t)}save(t){this.removePreviousCompare();let e=this.annotationTool.serialize([t])[0];e.x<.05||e.x>.95||this.annotationTool.addGlobalShape(e)}drawDelimiter(t){this.ctx.beginPath(),this.ctx.moveTo(t.x,0),this.ctx.lineTo(t.x,this.annotationTool.canvasWidth),this.ctx.stroke()}drawShape(t){var vt,gt,yt,xt,bt,wt,Tt,St;let e=this.annotationTool.videoElement,i=this.annotationTool.referenceVideoElement;if(!e||!i)return;let n=this.ctx.globalAlpha,r=this.annotationTool.canvasWidth,h=this.annotationTool.canvasHeight,l=t.x,s=i.videoHeight-e.videoHeight,c=i.videoWidth-e.videoWidth,d=this.annotationTool.isMobile;this.ctx.globalAlpha=this.leftOpacity;let u=(gt=(vt=this.annotationTool.referenceVideoFrameBuffer)==null?void 0:vt.frameNumberFromTime(e.currentTime))!=null?gt:1,p=u;if(c>e.videoWidth&&s>e.videoHeight&&!this.annotationTool.isMobile){let L=(wt=(bt=this.annotationTool.referenceVideoFrameBuffer)==null?void 0:bt.getFrameNumberBySignature((xt=(yt=this.annotationTool.videoFrameBuffer)==null?void 0:yt.getHistogram(u))!=null?xt:null,u))!=null?wt:u,O=Math.abs(u-L);O>=1&&O<=3&&(p=L)}let y=(Tt=this.annotationTool.referenceVideoFrameBuffer)==null?void 0:Tt.getFrame(p),x=(St=this.annotationTool.videoFrameBuffer)==null?void 0:St.getFrame(u);if(d){this.ctx.imageSmoothingQuality="low";let L=l/r,O=l;this.ctx.drawImage(x!=null?x:e,0,0,L*e.videoWidth,e.videoHeight,0,0,O,h)}else{let L=x?x.width:e.videoWidth,O=x?x.height:e.videoHeight;this.ctx.drawImage(x!=null?x:e,0,0,L,O,0,0,r,h)}this.ctx.globalAlpha=this.rightOpacity;let v=0,g=0,b=e.videoWidth/e.videoHeight,k=i.videoWidth/i.videoHeight,C=Math.abs(b-k)>.1,E=10,M=Math.abs(s)>E,H=e.videoWidth,A=e.videoHeight,D=0;if(c<-E)if(C){let L=e.videoWidth/r;D=Math.abs(c/2),D=D/L,D<=E&&(D=0)}else H=i.videoWidth;else c>E&&(H=i.videoWidth);if(s===0)v=0;else if(s>0)C?(v=s/2,v<=E&&(v=0)):A=M?i.videoHeight:e.videoHeight;else if(!C)A=M?i.videoHeight:e.videoHeight;else{g=Math.abs(s/2);let L=e.videoHeight/h;g=g/L,g<=E&&(g=0)}let ht=l-D,ft=r-ht,fe=ft/r*H;y&&this.rightOpacity>0&&(d&&(this.ctx.imageSmoothingQuality="low"),this.ctx.drawImage(y,ht/r*H,v,fe,A,ht+D,g,ft,h)),this.ctx.globalAlpha=n}draw(t){if(t.disabled)return;let e=this.annotationTool.videoElement,i=this.annotationTool.referenceVideoElement;!e||!i||this.drawShape(t)}};function $e(a){let o=a[0],t=a[0];for(let e=1;e<a.length;e++)a[e]<o&&(o=a[e]),a[e]>t&&(t=a[e]);return[o,t]}var st=class extends T{constructor(t){super(t);this.name="audio-peaks";this.canvas=document.createElement("canvas");this.props={peaks:new Int8Array,theme:{waveOutlineColor:"rgba(255,192,203,0.7)",waveFillColor:"grey",waveProgressColor:"orange"},waveHeight:40,bits:16};this.drawCtx=this.canvas.getContext("2d")}onVideoBlobSet(t){return F(this,null,function*(){let e=yield t.arrayBuffer();this.init(e)})}on(t,e){t==="videoBlobSet"&&this.onVideoBlobSet(e)}extractPeaks(t){return F(this,null,function*(){let{default:e}=yield Promise.resolve().then(()=>ke(ae(),1)),i=this.progressBarCoordinates.width,n=Math.ceil(t.length/i);return e(t,n,!0)})}setProps(t){let[e,i]=$e(t.data[0]),n=Math.pow(2,t.bits-1)-1,r=-Math.pow(2,t.bits-1);this.props.peaks=t.data[0].map(h=>h<0?Math.round(h/e*r):Math.round(h/i*n)),this.props.bits=t.bits}init(t){return F(this,null,function*(){try{let i=yield new AudioContext().decodeAudioData(t),n=yield this.extractPeaks(i);this.initCanvas(),this.setProps(n),this.annotationTool.removeGlobalShape("audio-peaks"),this.annotationTool.addGlobalShape({x:0,y:0,strokeStyle:"red",fillStyle:"red",lineWidth:1,type:"audio-peaks"}),this.clearLocalCanvas(),this.drawOnCanvas()}catch(e){this.initCanvas(),this.props.peaks=new Int8Array,this.annotationTool.removeGlobalShape("audio-peaks"),this.clearLocalCanvas(),console.error(e)}})}initCanvas(){this.canvas.width=this.progressBarCoordinates.width*this.pixelRatio,this.canvas.height=this.props.waveHeight*this.pixelRatio,this.drawCtx.scale(this.pixelRatio,this.pixelRatio)}move(t,e,i){return t.x+=e,t.y+=i,t}normalize(t,e,i){return S(w({},t),{x:t.x/e,y:t.y/i})}onPointerDown(t){}onPointerMove(t){}onPointerUp(t){}reset(){this.clearLocalCanvas(),this.props.peaks=new Int8Array,this.annotationTool.removeGlobalShape("audio-peaks")}draw(t){let e=this.annotationTool.videoElement;if(!e||e.tagName!=="VIDEO"||e.muted||e.volume===0)return;this.ctx.clearRect(0,0,this.annotationTool.canvasWidth,this.annotationTool.canvasHeight);let{waveHeight:n,theme:r}=this.props,h=this.ctx,l=n/2,s=this.progressBarCoordinates.y-20,{x:c,width:d}=this.progressBarCoordinates,u=this.annotationTool.playbackFrame,p=this.annotationTool.totalFrames,f=Math.ceil(u/p*d)+c;this.ctx.drawImage(this.canvas,c,s,d,n),h.fillStyle=r.waveProgressColor,h.fillRect(f,s+0,1,l*2)}get pixelRatio(){return this.annotationTool.pixelRatio}get progressBarCoordinates(){return this.annotationTool.progressBarCoordinates}clearLocalCanvas(){this.drawCtx.clearRect(0,0,this.canvas.width,this.canvas.height)}drawOnCanvas(){let{peaks:t,bits:e,waveHeight:i,theme:n}=this.props,r=this.drawCtx,h=0,l=0,s=i/2,c=B(2,e-1),d=0,u=t.length;r.fillStyle=n.waveOutlineColor;for(let p=0;p<u;p+=1){let f=t[(p+h)*2+1]/c,y=Math.abs(f*s);r.fillRect(p+l,d+0+s-y,1,y)}}};var lt=class extends T{constructor(){super(...arguments);this.name="selection";this.selectedArea=null}move(t,e,i){return t.x+=e,t.y+=i,t}normalize(t,e,i){return S(w({},t),{x:t.x/e,y:t.y/i,width:t.width/e,height:t.height/i})}onPointerDown(t){let{x:e,y:i}=this.annotationTool.getRelativeCoords(t);this.startX=e,this.startY=i,this.isDrawing=!0,this.selectedArea=null}onPointerMove(t){if(!this.isDrawing)return;let{x:e,y:i}=this.annotationTool.getRelativeCoords(t);this.annotationTool.clearCanvas(),this.annotationTool.globalShapes.length>0?this.annotationTool.drawShapesOverlay():this.annotationTool.addVideoOverlay(),this.drawSelectionRect(this.startX,this.startY,e-this.startX,i-this.startY)}onPointerUp(t){if(!this.isDrawing)return;let{x:e,y:i}=this.annotationTool.getRelativeCoords(t),n=Math.min(e,this.startX),r=Math.min(i,this.startY),h=Math.abs(e-this.startX),l=Math.abs(i-this.startY);if(h<1||l<1){this.isDrawing=!1,this.annotationTool.redrawFullCanvas();return}let s=document.createElement("canvas"),c=s.getContext("2d"),d=this.annotationTool.videoElement;if(!(d instanceof HTMLVideoElement))return;let u=d.videoWidth/d.videoHeight,p=this.annotationTool.canvasWidth/this.annotationTool.canvasHeight,f=this.annotationTool.canvasWidth,y=this.annotationTool.canvasHeight,x=0,v=0;u>p?(y=this.annotationTool.canvasWidth/u,v=(this.annotationTool.canvasHeight-y)/2):(f=this.annotationTool.canvasHeight*u,x=(this.annotationTool.canvasWidth-f)/2);let g=d.videoWidth/f,b=d.videoHeight/y,k=(n-x)*g,I=(r-v)*b,C=h*g,E=l*b;s.width=Math.max(1,C),s.height=Math.max(1,E);try{c.drawImage(this.annotationTool.videoElement,k,I,C,E,0,0,C,E);let M=c.getImageData(0,0,s.width,s.height);this.selectedArea=M;let H=document.createElement("canvas");H.width=C+4,H.height=E+4,H.style.width=`${h+4}px`,H.style.height=`${l+4}px`;let A=H.getContext("2d");A.strokeStyle="black",A.lineWidth=2,A.strokeRect(1,1,C+2,E+2),A.strokeStyle="black",A.lineWidth=2,A.strokeRect(2,2,C,E),A.putImageData(M,2,2);let D=new Image;D.onload=()=>{this.annotationTool.pluginForTool("image").save({type:"image",x:n-2,y:r-2,width:h+4,height:l+4,image:D,strokeStyle:"transparent",fillStyle:"transparent",lineWidth:0}),this.isDrawing=!1,this.selectedArea=null,this.annotationTool.redrawFullCanvas()},D.src=H.toDataURL(),this.annotationTool.currentTool="move"}catch(M){console.error("Error capturing selection:",M),this.isDrawing=!1,this.annotationTool.redrawFullCanvas();return}}drawSelectionRect(t,e,i,n){var p,f,y;let r=Math.min(t,t+i),h=Math.min(e,e+n),l=Math.abs(i),s=Math.abs(n),c=this.annotationTool.pixelRatio,d=null;if(l>0&&s>0)try{d=this.ctx.getImageData(r*c,h*c,l*c,s*c)}catch(x){d=null}if(this.ctx.fillStyle="rgba(0, 0, 0, 0.5)",this.ctx.fillRect(0,0,this.annotationTool.canvasWidth,this.annotationTool.canvasHeight),d&&l>0&&s>0)this.ctx.putImageData(d,r*c,h*c);else if(l>0&&s>0){let x=this.annotationTool.videoElement;if(x instanceof HTMLVideoElement){let v=(p=this.annotationTool.videoFrameBuffer)==null?void 0:p.frameNumberFromTime(x.currentTime),g=(y=(f=this.annotationTool.videoFrameBuffer)==null?void 0:f.getFrame(v||0))!=null?y:x,b=g?g.width:x.videoWidth,k=g?g.height:x.videoHeight,I=b/this.annotationTool.canvasWidth,C=k/this.annotationTool.canvasHeight;this.ctx.drawImage(g,r*I,h*C,l*I,s*C,r,h,l,s)}}this.ctx.beginPath();let u=this.ctx.strokeStyle;this.ctx.strokeStyle="#ffffff",this.ctx.lineWidth=2,this.ctx.setLineDash([5,5]),this.ctx.strokeRect(r,h,l,s),this.ctx.setLineDash([]),this.ctx.strokeStyle=u}draw(t){this.drawSelectionRect(t.x,t.y,t.width,t.height)}reset(){super.reset(),this.selectedArea=null}isPointerAtShape(t,e,i){let n=Math.min(t.x,t.x+t.width),r=Math.max(t.x,t.x+t.width),h=Math.min(t.y,t.y+t.height),l=Math.max(t.y,t.y+t.height);return e>=n&&e<=r&&i>=h&&i<=l}};var re=[q,_,Q,tt,et,it,Z,nt,ot,at,st,lt];function se(a,o){let t,e,i,n=[],r=!0,h=!1;function l(d,u){if(h)return;let p=Math.abs(u.mediaTime-t),f=Math.abs(u.presentedFrames-e),y=p/f;y&&y<1&&r&&n.length<50&&a.playbackRate===1&&document.hasFocus()&&(n.push(y),i=Math.round(1/c()),o(i,n.length*2)),r=!0,t=u.mediaTime,e=u.presentedFrames,h||a.requestVideoFrameCallback(l)}a.requestVideoFrameCallback(l);let s=()=>{n.pop(),r=!1};a.addEventListener("seeked",s);function c(){return n.reduce((d,u)=>d+u)/n.length}return()=>{h=!0,a.removeEventListener("seeked",s)}}function le(a,o,t){return .299*a+.587*o+.114*t}var Ve=0,pt=class extends Array{constructor(){super(...arguments),this.id=Ve++}};function he(a){let o=a.width,t=a.height,e=new Array(o*t),i=new pt,n=0;for(let r=0;r<a.data.length;r+=4)e[n]=le(a.data[r],a.data[r+1],a.data[r+2]),n++;for(let r=1;r<t-1;r++)for(let h=1;h<o-1;h++){let l=r*o+h,s=-e[l-o-1]+e[l-o+1]-2*e[l-1]+2*e[l+1]-e[l+o-1]+e[l+o+1],c=e[l-o-1]+2*e[l-o]+e[l-o+1]-e[l+o-1]-2*e[l+o]-e[l+o+1],d=Math.sqrt(s*s+c*c);i.push(d)}return i}var ut=new Map,Oe=(a,o)=>Math.max(a.id,o.id)+"-"+Math.min(a.id,o.id);function ce(a,o){let t=Oe(a,o);if(ut.has(t))return ut.get(t);let e=0;for(let n=0;n<a.length;n++)e+=(a[n]-o[n])*(a[n]-o[n]);let i=1/(1+Math.sqrt(e));return ut.set(t,i),i}var N=64,V=class{constructor(o,t,e=!0){this.isDestroyed=!1;this.autoHide=!0;this.isMobile=!1;this.seenFrames=0;this.isCanvasSizeSet=!1;this.frames=new Map;this.histograms=new Map;this.video=o,this.fps=t,this.autoHide=e,this.createCanvas(),this.createTransformCanvas()}createTransformCanvas(){this.transformCanvas=document.createElement("canvas"),this.transformCanvasCtx=this.canvas.getContext("2d",{willReadFrequently:!0,alpha:!1}),this.transformCanvas.width=N,this.transformCanvas.height=N}normalizeImage(o){return this.transformCanvasCtx.drawImage(o,0,0,o.width,o.height,0,0,N,N),this.transformCanvasCtx.getImageData(0,0,N,N)}toHistogram(o){return this.imageHistogram(this.normalizeImage(o))}imageHistogram(o){return he(o)}start(){this.addRequestFrameCallback()}destroy(){this.isDestroyed=!0,this.frames.forEach(o=>o.close()),this.frames.clear()}tick(o,t){if(this.setCanvasSize(),t.expectedDisplayTime-performance.now()>10,this.isDestroyed)return!1;if(this.seenFrames>=this.totalFrames){if(this.autoHide)try{this.video.paused||this.video.pause(),this.video.style.display="none"}catch(h){}return!1}if(this.video.videoWidth===0||this.video.videoHeight===0)return!0;let i=this.video,n=this.frameNumberFromTime(t.mediaTime);if(!Math.max(1,t.presentedFrames>this.totalFrames?t.presentedFrames%this.totalFrames:t.presentedFrames))throw new Error("expectedFrame is 0");if(this.hasFrame(n))this.seenFrames++;else{this.ctx.drawImage(i,0,0,this.width,this.height,0,0,this.width,this.height);let h=this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height);createImageBitmap(h,0,0,this.width,this.height).then(l=>F(this,null,function*(){this.setFrame(n,l),this.isMobile||this.setHistogram(n,this.toHistogram(l))}))}return!0}addRequestFrameCallback(){this.isDestroyed||this.video.requestVideoFrameCallback((o,t)=>{this.tick(o,t)&&this.addRequestFrameCallback()})}createCanvas(){this.canvas=document.createElement("canvas"),this.ctx=this.canvas.getContext("2d",{willReadFrequently:!0,alpha:!1})}setCanvasSize(){this.isCanvasSizeSet||(this.canvas.width=this.video.videoWidth,this.canvas.height=this.video.videoHeight,this.isCanvasSizeSet=!0)}get width(){return this.video.videoWidth}get height(){return this.video.videoHeight}hasFrame(o){return this.frames.has(o)}getFrame(o){return this.frames.has(o)?this.frames.get(o):null}getFrameNumberBySignature(o,t){if(!o)return t;let e=0,i=t;return[t-3,t-2,t-1,t,t+1,t+2,t+3].filter(r=>r>0&&r<=this.totalFrames).forEach(r=>{let h=this.getHistogram(r);if(h){let l=ce(o,h);l>e&&(e=l,i=r)}}),i}setFrame(o,t){this.frames.set(o,t)}setHistogram(o,t){this.histograms.set(o,t)}getHistogram(o){var t;return(t=this.histograms.get(o))!=null?t:null}get totalFrames(){return Math.round(this.video.duration*this.fps)}frameNumberFromTime(o){return Math.max(1,Math.round(o*this.fps))}};var Ne=window.devicePixelRatio||1,de=25,z=class extends j{constructor(t){super();this.referenceVideoFrameBuffer=null;this.videoFrameBuffer=null;this.isMouseDown=!1;this.buttons=[];this.plugins=[];this.annotatedFrameCoordinates=[];this.videoBlobUrl=null;this.referenceVideoBlobUrl=null;this.frameCounterTimeoutId=null;this._enforcedTotalFrames=null;this.isCursorOverCanvas=!1;this.overlayOpacity=.7;this._theme="dark";this.themeChangeListeners=[];this.fps=de;this.plannedFn=null;this.ct=0;this.isCanvasInitialized=!1;this.enforcedCanvasSize=null;this.lastNavigatedFrame=0;this.isProgressBarNavigation=!1;this.isAnnotationsAsVideoActive=!1;this.plugins=re.map(e=>new e(this)),this.init(t)}prevFrame(){let e=this.playbackFrame-1;e<1?this.playbackFrame=this.totalFrames:this.playbackFrame=e}nextFrame(){let e=this.playbackFrame+1;e>this.totalFrames?this.playbackFrame=1:this.playbackFrame=e}getAnnotatedFrames(){let t=[];return this.timeStack.forEach((e,i)=>{e&&e.length>0&&t.push(i)}),t.sort((e,i)=>e-i)}prevAnnotatedFrame(){let t=this.getAnnotatedFrames();if(t.length===0)return;let e=this.playbackFrame;for(let i=t.length-1;i>=0;i--)if(t[i]<e){this.playbackFrame=t[i];return}this.playbackFrame=t[t.length-1]}nextAnnotatedFrame(){let t=this.getAnnotatedFrames();if(t.length===0)return;let e=this.playbackFrame;for(let i of t)if(i>e){this.playbackFrame=i;return}this.playbackFrame=t[0]}get theme(){return this._theme}setTheme(t){this._theme=t,dt(t),this.themeChangeListeners.forEach(e=>e(t))}onThemeChange(t){return this.themeChangeListeners.push(t),()=>{let e=this.themeChangeListeners.indexOf(t);e!==-1&&this.themeChangeListeners.splice(e,1)}}removeGlobalShape(t){this.globalShapes=this.globalShapes.filter(e=>e.type!==t)}addGlobalShape(t){this.globalShapes.push(t)}get selectedColor(){return this.colorPicker.value}get selectedStrokeSize(){return this.strokeSizePicker.valueAsNumber}get currentTool(){return this._currentTool}set currentTool(t){let e=this._currentTool;e&&(this.getButtonForTool(e).classList.remove("active"),this.pluginForTool(e).onDeactivate()),this._currentTool=t,this.canvas.style.cursor=t?"pointer":"default",t&&(this.getButtonForTool(t).classList.add("active"),this.pluginForTool(t).onActivate())}enableFrameRateDetection(){if(this.destructors.find(i=>i.name==="frameRateDetector"))return;let t=this.videoElement;if(t.tagName==="IMG")return;let e=se(t,i=>{this.fps=i});Object.defineProperty(e,"name",{value:"frameRateDetector"}),this.destructors.push(e)}timeToFrame(t){return Math.max(1,Math.round(t*this.fps))}get playbackFrame(){return this.videoElement instanceof HTMLImageElement?1:this.timeToFrame(this.videoElement.currentTime)}set playbackFrame(t){if(this.videoElement instanceof HTMLImageElement)return;let e=t/this.fps;this.videoElement.currentTime=e,this.rvf(()=>{this.show()})}rvf(t){this.plannedFn=t}get canvasWidth(){var t,e;return(e=(t=this.enforcedCanvasSize)==null?void 0:t.width)!=null?e:0}get canvasHeight(){var t,e;return(e=(t=this.enforcedCanvasSize)==null?void 0:t.height)!=null?e:0}get aspectRatio(){return this.canvasHeight===0?0:this.canvasWidth/this.canvasHeight}get isMobile(){return window.innerWidth<960}get progressBarCoordinates(){let t=this.isMobile?30:10,e=5,n=this.canvasWidth-e-55,r=e,h=this.canvasHeight-t;return{x:r,y:h,width:n,height:t}}get shapes(){return this.timeStack.has(this.activeTimeFrame)||this.timeStack.set(this.activeTimeFrame,[]),this.timeStack.get(this.activeTimeFrame)}set shapes(t){this.timeStack.set(this.activeTimeFrame,t)}get undoStack(){return this.undoTimeStack.has(this.activeTimeFrame)||this.undoTimeStack.set(this.activeTimeFrame,[]),this.undoTimeStack.get(this.activeTimeFrame)}set undoStack(t){this.undoTimeStack.set(this.activeTimeFrame,t)}get pixelRatio(){return Ne}setVideoBlob(i){return F(this,arguments,function*(t,e=this.fps){this.videoBlobUrl&&URL.revokeObjectURL(this.videoBlobUrl);let n=URL.createObjectURL(t);this.videoBlobUrl=n,yield this.setVideoUrl(n,e),this.plugins.forEach(r=>{r.on("videoBlobSet",t)})})}setVideoUrl(i){return F(this,arguments,function*(t,e=this.fps){if(this.videoElement instanceof HTMLImageElement)return;let n=this.videoElement;n.src=t.toString(),yield this.videoElement.load(),this.setFrameRate(e),this.videoFrameBuffer&&(this.videoFrameBuffer.destroy(),this.videoFrameBuffer=new V(n,e,!1),this.videoFrameBuffer.isMobile=this.isMobile),this.setCanvasSize()})}enableVideoFrameBuffer(){this.videoElement instanceof HTMLImageElement||(this.videoFrameBuffer=new V(this.videoElement,this.fps,!1),this.videoFrameBuffer.isMobile=this.isMobile)}hide(){this.stopAnnotationsAsVideo(),this.hideControls(),this.hideCanvas()}showControls(){this.uiContainer.style.display=""}hideControls(){this.uiContainer.style.display="none"}showCanvas(){this.canvas.style.display="block"}hideCanvas(){this.canvas.style.display="none"}updateActiveTimeFrame(t=void 0){this.activeTimeFrame=t?this.timeToFrame(t):this.playbackFrame}show(){this.stopAnnotationsAsVideo(),this.updateActiveTimeFrame(),this.showCanvas(),this.showControls(),this.redrawFullCanvas()}setCanvasSettings(){this.ctx.strokeStyle=this.selectedColor,this.ctx.fillStyle=this.selectedColor,this.ctx.lineWidth=this.selectedStrokeSize}pluginForTool(t){if(this.isDestroyed)throw new Error("AnnotationTool is destroyed");let e=this.plugins.find(i=>i.name===t);if(!e)throw new Error(`No plugin found for tool ${t}`);return e}getButtonForTool(t){return this.buttons.find(e=>e.dataset.tool===t)}bindContext(){this.handleMouseDown=this.handleMouseDown.bind(this),this.handleMouseMove=this.handleMouseMove.bind(this),this.handleMouseUp=this.handleMouseUp.bind(this),this.setCanvasSize=this.setCanvasSize.bind(this),this.onKeyDown=this.onKeyDown.bind(this)}initProperties(){this.isDestroyed=!1,this.isProgressBarNavigation=!1,this.shapes=[],this.globalShapes=[],this.currentTool=this.isMobile?null:"curve",dt(this._theme)}setVideoStyles(){this.videoElement.style.objectFit="cover",this.videoElement.style.objectPosition="left top"}get frameCallbackSupported(){return"requestVideoFrameCallback"in HTMLVideoElement.prototype}initFrameCounter(){if(!this.frameCallbackSupported){this.frameCounterTimeoutId=setTimeout(()=>{var t;this.isDestroyed||((t=this.plannedFn)==null||t.call(this),this.plannedFn=null,this.initFrameCounter(),this.updateActiveTimeFrame(),this.playAnnotationsAsVideo())},1e3/this.fps);return}this.withVideo(t=>{t.requestVideoFrameCallback((e,i)=>{var n,r;this.isCanvasInitialized||this._setCanvasSize(),(n=this.videoFrameBuffer)==null||n.tick(e,i),(r=this.plannedFn)==null||r.call(this),this.plannedFn=null,this.raf(()=>{this.initFrameCounter(),this.updateActiveTimeFrame(i.mediaTime),this.playAnnotationsAsVideo()})})})}init(t){this.videoElement=t,this.setVideoStyles(),this.initFrameCounter(),this.bindContext(),this.initCanvas(),this.initUI(),this.initProperties(),this.setCanvasSize()}onKeyDown(t){(t.ctrlKey||t.metaKey)&&t.key.toLowerCase()==="z"&&this.handleUndo()}handleUndo(){this.undoStack.length>0&&(this.shapes=this.undoStack.pop(),this.redrawFullCanvas())}destroy(){var n,r,h,l,s,c,d,u;if(this.isDestroyed)return;super.destroy(),this.stopAnnotationsAsVideo(),this.frameCounterTimeoutId&&(clearTimeout(this.frameCounterTimeoutId),this.frameCounterTimeoutId=null),this.videoBlobUrl&&(URL.revokeObjectURL(this.videoBlobUrl),this.videoBlobUrl=null),this.referenceVideoBlobUrl&&(URL.revokeObjectURL(this.referenceVideoBlobUrl),this.referenceVideoBlobUrl=null),this.currentTool=null,this.plugins.forEach(p=>p.reset()),this.annotatedFrameCoordinates=[],this.setFrameRate(de);let t=this.strokeSizePicker.parentElement;if((n=t==null?void 0:t.parentNode)==null||n.removeChild(t),this.referenceVideoElement){let p=this.referenceVideoElement.parentElement;(r=p==null?void 0:p.parentNode)==null||r.removeChild(p),this.referenceVideoElement=null}let e=this.colorPicker.parentElement;(h=e==null?void 0:e.parentNode)==null||h.removeChild(e),this.buttons.forEach(p=>{var f;(f=p.parentNode)==null||f.removeChild(p)}),this.buttons=[],(l=this.uiContainer.parentNode)==null||l.removeChild(this.uiContainer),(s=this.canvas.parentNode)==null||s.removeChild(this.canvas),(c=this.playerControlsContainer.parentElement)==null||c.removeChild(this.playerControlsContainer),["strokeSizePicker","colorPicker","uiContainer","playerControlsContainer","canvas","ctx","videoElement"].forEach(p=>{delete this[p]}),this.activeTimeFrame=0,this.isDestroyed=!0,(d=this.referenceVideoFrameBuffer)==null||d.destroy(),this.referenceVideoFrameBuffer=null,(u=this.videoFrameBuffer)==null||u.destroy(),this.videoFrameBuffer=null}_setCanvasSize(){let t=getComputedStyle(this.videoElement),e=parseInt(t.width,10),i=this.videoElement,n=i.videoWidth/i.videoHeight;if(isNaN(e)||!i.videoWidth||!i.videoHeight)return this.isCanvasInitialized=!1,this.setCanvasSettings(),!1;let r=i.parentElement,h=!!document.fullscreenElement,l=Math.min(e,i.videoWidth),s=Math.floor(l/n);if(h&&r){let f=window.innerWidth,y=window.innerHeight-90;f/y>n?(s=y,l=s*n):(l=f,s=l/n),i.style.width=`${l}px`,i.style.height=`${s}px`,i.style.marginTop="40px",i.style.marginBottom="50px"}else i.style.width=`${l}px`,i.style.height=`${s}px`,i.style.marginTop="",i.style.marginBottom="";this.isCanvasInitialized=i.videoWidth>0&&i.videoHeight>0,this.canvas.width=l*this.pixelRatio,this.canvas.height=s*this.pixelRatio,this.canvas.style.width=`${l}px`,this.canvas.style.height=`${s}px`,this.canvas.style.position="absolute";let c=i.offsetTop,d=i.offsetLeft;return this.canvas.style.top=`${c}px`,this.canvas.style.left=`${d}px`,this.enforcedCanvasSize={width:l,height:s},this.ctx.scale(this.pixelRatio,this.pixelRatio),this.setCanvasSettings(),!0}setCanvasSize(){this._setCanvasSize()&&(this.syncVideoSizes(),this.redrawFullCanvas())}replaceShape(t,e){let i=this.serialize([t])[0];this.undoStack.push([...this.shapes]),this.shapes[e]=i}addShape(t){let e=this.serialize([t])[0];this.undoStack.push([...this.shapes]),this.shapes.push(e)}get msPerFrame(){return 1e3/this.fps}syncVideoSizes(){this.withRefVideo(t=>{let i=this.videoElement.getBoundingClientRect();t.style.position="fixed",t.style.top=`${i.top}px`,t.style.left=`${i.left}px`})}addReferenceVideoByURL(n){return F(this,arguments,function*(t,e=this.fps,i="video/mp4"){var s;let r=yield fetch(t).then(c=>c.blob()),h=new Blob([r],{type:i});this.referenceVideoBlobUrl&&URL.revokeObjectURL(this.referenceVideoBlobUrl);let l=window.URL.createObjectURL(h);this.referenceVideoBlobUrl=l,this.referenceVideoElement?((s=this.referenceVideoFrameBuffer)==null||s.destroy(),this.referenceVideoFrameBuffer=new V(this.referenceVideoElement,e),this.referenceVideoFrameBuffer.isMobile=this.isMobile,this.referenceVideoFrameBuffer.start()):(this.referenceVideoElement=document.createElement("video"),this.withRefVideo(c=>{this.isMobile?(c.style.zIndex="2",c.style.display="block",c.style.top="0",c.style.left="0",c.style.opacity="0.25",c.style.width="20px",c.style.height="15px"):(c.style.zIndex="-1",c.style.display="none",c.style.width="100px",c.style.height="70px"),c.style.objectFit="cover",c.style.objectPosition="left top",c.muted=!0,c.volume=0,c.playsInline=!0,c.autoplay=!1,c.controls=!1,c.loop=!0,this.videoElement.after(c),this.referenceVideoFrameBuffer=new V(c,e),this.referenceVideoFrameBuffer.isMobile=this.isMobile,this.referenceVideoFrameBuffer.start()}),this.syncVideoSizes()),this.referenceVideoElement.src=l,this.referenceVideoElement.play().then(()=>{this.showButton("compare")}).catch(()=>{this.hideButton("compare")})})}hideButton(t){let e=this.getButtonForTool(t);e.style.display="none"}showButton(t){let e=this.getButtonForTool(t);e.style.display=""}addSingletonShape(t){let e=this.serialize([t])[0],i=this.shapes.filter(n=>n.type!==t.type);this.replaceFrame(this.playbackFrame,[...i,e])}serialize(t=this.shapes){let e=this.canvasWidth,i=this.canvasHeight;return t.map(n=>this.pluginForTool(n.type).normalize(n,e,i))}deserialize(t){let e=1/this.canvasWidth,i=1/this.canvasHeight;return t.map(n=>this.pluginForTool(n.type).normalize(n,e,i))}getRelativeCoords(t){let e=this.canvas.getBoundingClientRect();return{x:this.getEventX(t)-e.left,y:this.getEventY(t)-e.top}}handleMouseDown(t){if(t.preventDefault(),this.isMouseDown=!0,K(t))return;let e=this.frameFromProgressBar(t,!0);if(e){this.isProgressBarNavigation=!0;let i=this.getAnnotationFrame(t);this.isVideoPaused&&(i!==null?this.playbackFrame=i:this.playbackFrame=e);return}this.currentTool&&this.pluginForTool(this.currentTool).onPointerDown(t)}get isDrawing(){return this.currentTool?this.pluginForTool(this.currentTool).isDrawing:!1}get isVideoPaused(){return this.videoElement.tagName==="VIDEO"?this.videoElement.paused:!0}get hasGlobalOverlays(){return this.globalShapes.length>0}handleMouseMove(t){if(t.preventDefault(),!K(t)){if(this.isMouseDown){let e=this.isProgressBarNavigation?this.frameFromProgressBar(t,!1):null;if(e!==null&&!this.isDrawing){if(e===this.lastNavigatedFrame)return;this.lastNavigatedFrame=e,this.isVideoPaused&&(this.playbackFrame=e);return}else this.hideControls(),this.clearCanvas(),this.hasGlobalOverlays||this.addVideoOverlay(),this.drawShapesOverlay()}else this.redrawFullCanvas();this.currentTool&&this.pluginForTool(this.currentTool).onPointerMove(t)}}getEventX(t){return t.clientX}getEventY(t){return t.clientY}handleMouseUp(t){this.isMouseDown=!1,this.isProgressBarNavigation=!1,this.showControls(),!K(t)&&(this.currentTool&&this.pluginForTool(this.currentTool).onPointerUp(t),this.redrawFullCanvas())}focusOnMediaNode(){this.videoElement.focus()}drawShapesOverlay(){var e,i;let t={strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth,globalAlpha:this.ctx.globalAlpha};for(let n of this.deserialize(this.globalShapes)){this.ctx.strokeStyle=n.strokeStyle,this.ctx.fillStyle=n.fillStyle,this.ctx.lineWidth=n.lineWidth,this.ctx.globalAlpha=(e=n.opacity)!=null?e:1;try{this.pluginForTool(n.type).draw(n)}catch(r){console.error(r)}}for(let n of this.deserialize(this.shapes)){this.ctx.strokeStyle=n.strokeStyle,this.ctx.fillStyle=n.fillStyle,this.ctx.lineWidth=n.lineWidth,this.ctx.globalAlpha=(i=n.opacity)!=null?i:1;try{this.pluginForTool(n.type).draw(n)}catch(r){console.error(r)}}this.ctx.strokeStyle=t.strokeStyle,this.ctx.fillStyle=t.fillStyle,this.ctx.lineWidth=t.lineWidth,this.ctx.globalAlpha=t.globalAlpha}clearCanvas(){this.ctx.clearRect(0,0,this.canvasWidth,this.canvasHeight)}frameToDataUrl(){try{this.clearCanvas(),this.addVideoOverlay(),this.addFrameSquareOverlay(),this.drawShapesOverlay();let t=this.canvas.toDataURL("image/png");return this.redrawFullCanvas(),t}catch(t){return console.error(t),null}}redrawFullCanvas(){this.hasGlobalOverlays||(this.clearCanvas(),this.addVideoOverlay()),this.drawShapesOverlay(),this.drawSelectionHandles(),this.addFrameSquareOverlay(),this.addProgressBarOverlay()}drawSelectionHandles(){if(this.currentTool==="move")try{this.pluginForTool("move").drawResizeHandles()}catch(t){}}replaceFrame(t,e){this.timeStack.set(t,this.parseShapes(this.stringifyShapes(e)))}addShapesToFrame(t,e){let i=this.timeStack.get(t)||[];this.timeStack.set(t,[...i,...this.parseShapes(this.stringifyShapes(e))])}setFrameRate(t){var e;(e=this.destructors.find(i=>i.name==="frameRateDetector"))==null||e(),this.fps=t}stringifyShapes(t){return JSON.stringify(t,(e,i)=>e==="image"?i.src:i)}parseShapes(t){return JSON.parse(t,(e,i)=>{if(e==="image"){let n=new Image;return n.src=i,n}return i})}filterNonSerializableShapes(t){return t.filter(e=>e.type!=="image")}saveCurrentFrame(){return{frame:this.playbackFrame,version:1,fps:this.fps,shapes:this.parseShapes(this.stringifyShapes(this.filterNonSerializableShapes(this.shapes)))}}loadAllFrames(t){this.cleanFrameStacks(),t.forEach(e=>{this.timeStack.set(e.frame,e.shapes)})}appendFrames(t){t.forEach(e=>{this.addShapesToFrame(e.frame,e.shapes)})}saveAllFrames(){return Array.from(this.timeStack.keys()).filter(n=>{var r;return(r=this.timeStack.get(n))==null?void 0:r.length}).map(n=>{var r;return{frame:n,fps:this.fps,version:1,shapes:this.filterNonSerializableShapes((r=this.timeStack.get(n))!=null?r:[])}})}getAnnotationFrame(t){var h,l;let e=t.offsetX,i=t.offsetY,n=this.isMobile?20:12;return(l=(h=this.annotatedFrameCoordinates.find(s=>e>=s.x-n&&e<=s.x+n&&i>=s.y-n&&i<=s.y+n))==null?void 0:h.frame)!=null?l:null}get totalFrames(){if(this._enforcedTotalFrames!==null)return this._enforcedTotalFrames;let t=this.videoElement;return t.tagName!=="VIDEO"?1:Math.round(t.duration*this.fps)}setTotalFrames(t){this._enforcedTotalFrames=t!==null?Math.max(1,Math.round(t)):null}getEnforcedTotalFrames(){return this._enforcedTotalFrames}frameFromProgressBar(t,e=!0){if(this.videoElement.tagName!=="VIDEO")return null;let{x:n,width:r,height:h,y:l}=this.progressBarCoordinates,s=t.offsetX,c=t.offsetY,d=()=>{let u=Math.round((s-n)/r*this.totalFrames);return Math.max(1,Math.min(u,this.totalFrames))};return e?s>=n&&s<=n+r&&c>=l&&c<=l+h?d():null:s>=n&&s<=n+r?d():null}hasAnnotationsForFrame(t){if(this.globalShapes.length>0)return!0;if(this.timeStack.has(t)){let e=this.timeStack.get(t);return e&&e.length>0}return!1}stopAnnotationsAsVideo(){this.isAnnotationsAsVideoActive=!1}startAnnotationsAsVideo(){this.isAnnotationsAsVideoActive=!0,this.playAnnotationsAsVideo()}playAnnotationsAsVideo(){this.isAnnotationsAsVideoActive&&(this.hasGlobalOverlays||this.clearCanvas(),this.isMobile?this.hasGlobalOverlays||this.addVideoOverlay():this.addVideoOverlay(),this.drawShapesOverlay(),(this.isCursorOverCanvas||this.isMobile)&&(this.addFrameSquareOverlay(),this.addProgressBarOverlay()))}};function me(a=this.activeTimeFrame){this.ctx.save(),this.ctx.fillStyle="rgba(0, 0, 0, 0.5)";let o=50,t=30,e=20;this.ctx.fillRect(this.canvasWidth-o,this.canvasHeight-t,o,t),this.ctx.fillStyle="white",this.ctx.font=`${e}px sans-serif`,this.ctx.fillText(`${a}`.padStart(3,"0"),this.canvasWidth-40,this.canvasHeight-7),this.ctx.restore()}function ue(){var s,c,d;let a=this.videoElement;if(a.tagName!=="VIDEO")return;let o=a.getBoundingClientRect(),t=this.canvas.getBoundingClientRect(),e=o.left-t.left,i=o.top-t.top,n=(s=this.videoFrameBuffer)==null?void 0:s.frameNumberFromTime(a.currentTime),r=(d=(c=this.videoFrameBuffer)==null?void 0:c.getFrame(n||0))!=null?d:a,h=r?r.width:a.videoWidth,l=r?r.height:a.videoHeight;this.ctx.drawImage(r,0,0,h,l,e,i,this.canvasWidth,this.canvasHeight)}function pe(){if(this.videoElement.tagName!=="VIDEO")return;this.annotatedFrameCoordinates=[];let t=Array.from(this.timeStack.keys()).filter(f=>{var y;return(y=this.timeStack.get(f))==null?void 0:y.length}),e=this.totalFrames,{x:i,width:n,height:r,y:h}=this.progressBarCoordinates,l=t.map(f=>Math.round(f/e*n));this.ctx.save(),this.ctx.fillStyle="rgba(0, 0, 0, 0.5)",this.ctx.fillRect(i,h,n,r),this.ctx.fillStyle=$.y;let s=this.isMobile?16:8;l.forEach((f,y)=>{this.ctx.beginPath();let x=i+f,v=this.canvasHeight-r/2;this.ctx.fillRect(x-s/2,v-s/2,s,s),this.annotatedFrameCoordinates.push({x,y:v,frame:t[y]})});let c=this.isProgressBarNavigation&&this.lastNavigatedFrame>0?this.lastNavigatedFrame:this.playbackFrame,d=Math.round(c/e*n)+i;this.ctx.fillStyle="white",this.ctx.beginPath();let u=d,p=this.canvasHeight-r/2;this.ctx.beginPath(),this.ctx.fillRect(u-s/2,p-s/2,s,s),this.ctx.fill(),this.ctx.restore()}z.prototype.initUI=Qt;z.prototype.initCanvas=te;z.prototype.addFrameSquareOverlay=me;z.prototype.addVideoOverlay=ue;z.prototype.addProgressBarOverlay=pe;export{z as SmAnnotate};
