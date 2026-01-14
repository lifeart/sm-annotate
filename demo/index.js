"use strict";(()=>{var Ve=Object.create;var Ct=Object.defineProperty,We=Object.defineProperties,Xe=Object.getOwnPropertyDescriptor,Ye=Object.getOwnPropertyDescriptors,Ne=Object.getOwnPropertyNames,Ut=Object.getOwnPropertySymbols,Ue=Object.getPrototypeOf,jt=Object.prototype.hasOwnProperty,Ge=Object.prototype.propertyIsEnumerable;var O=Math.pow,Gt=(a,o,t)=>o in a?Ct(a,o,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[o]=t,T=(a,o)=>{for(var t in o||(o={}))jt.call(o,t)&&Gt(a,t,o[t]);if(Ut)for(var t of Ut(o))Ge.call(o,t)&&Gt(a,t,o[t]);return a},M=(a,o)=>We(a,Ye(o));var je=(a,o)=>()=>(o||a((o={exports:{}}).exports,o),o.exports);var Ke=(a,o,t,e)=>{if(o&&typeof o=="object"||typeof o=="function")for(let n of Ne(o))!jt.call(a,n)&&n!==t&&Ct(a,n,{get:()=>o[n],enumerable:!(e=Xe(o,n))||e.enumerable});return a};var qe=(a,o,t)=>(t=a!=null?Ve(Ue(a)):{},Ke(o||!a||!a.__esModule?Ct(t,"default",{value:a,enumerable:!0}):t,a));var I=(a,o,t)=>new Promise((e,n)=>{var i=s=>{try{h(t.next(s))}catch(l){n(l)}},r=s=>{try{h(t.throw(s))}catch(l){n(l)}},h=s=>s.done?e(s.value):Promise.resolve(s.value).then(i,r);h((t=t.apply(a,o)).next())});var ke=je((Si,Ee)=>{"use strict";function ln(a){for(var o=1/0,t=-1/0,e=0,n=a.length,i;e<n;e++)i=a[e],o>i&&(o=i),t<i&&(t=i);return{min:o,max:t}}function Te(a,o){var t=Math.pow(2,o-1),e=a<0?a*t:a*(t-1);return Math.max(-t,Math.min(t-1,e))}function Se(a,o,t){var e,n=a.length,i=Math.ceil(n/o),r,h,s,l,c,u,p=Ce(t,i*2);for(e=0;e<i;e++)r=e*o,h=(e+1)*o>n?n:(e+1)*o,s=a.subarray(r,h),u=ln(s),c=Te(u.min,t),l=Te(u.max,t),p[e*2]=c,p[e*2+1]=l;return p}function Ce(a,o){return new(new Function(`return Int${a}Array`)())(o)}function hn(a,o){var t=a.length,e=1/t,n=a[0].length/2,i=0,r=0,h,s,l=Ce(o,n*2);for(r=0;r<n;r++){for(h=0,s=0,i=0;i<t;i++)h+=e*a[i][r*2],s+=e*a[i][r*2+1];l[r*2]=h,l[r*2+1]=s}return[l]}function mt(a,o){return typeof a=="number"?a:o}Ee.exports=function(a,o,t,e,n,i){if(o=mt(o,1e3),i=mt(i,16),t==null&&(t=!0),[8,16,32].indexOf(i)<0)throw new Error("Invalid number of bits specified for peaks.");var r=a.numberOfChannels,h=[],s,l,c,u;if(e=mt(e,0),n=mt(n,a.length),typeof a.subarray=="undefined")for(s=0;s<r;s++)c=a.getChannelData(s),u=c.subarray(e,n),h.push(Se(u,o,i));else h.push(Se(a.subarray(e,n),o,i));return t&&h.length>1&&(h=hn(h,i)),l=h[0].length/2,{length:l,data:h,bits:i}}});var _e={bgPrimary:"rgba(28, 28, 32, 0.95)",bgSecondary:"rgba(42, 42, 48, 0.98)",bgTertiary:"#35353d",bgHover:"rgba(255, 255, 255, 0.08)",bgActive:"rgba(255, 255, 255, 0.12)",textPrimary:"#f0f0f2",textSecondary:"#a8a8b0",textMuted:"#68687a",border:"rgba(255, 255, 255, 0.1)",borderHover:"rgba(255, 255, 255, 0.2)",accent:"#5b9fff",accentHover:"#7db3ff",shadow:"rgba(0, 0, 0, 0.4)"},Je={bgPrimary:"rgba(250, 250, 252, 0.95)",bgSecondary:"rgba(255, 255, 255, 0.98)",bgTertiary:"#f0f0f5",bgHover:"rgba(0, 0, 0, 0.04)",bgActive:"rgba(0, 0, 0, 0.08)",textPrimary:"#1a1a24",textSecondary:"#5a5a6e",textMuted:"#9090a0",border:"rgba(0, 0, 0, 0.1)",borderHover:"rgba(0, 0, 0, 0.2)",accent:"#2563eb",accentHover:"#3b82f6",shadow:"rgba(0, 0, 0, 0.15)"},Ze={dark:_e,light:Je},d="sm-annotate";function Qe(a){return`
    --${d}-bg-primary: ${a.bgPrimary};
    --${d}-bg-secondary: ${a.bgSecondary};
    --${d}-bg-tertiary: ${a.bgTertiary};
    --${d}-bg-hover: ${a.bgHover};
    --${d}-bg-active: ${a.bgActive};
    --${d}-text-primary: ${a.textPrimary};
    --${d}-text-secondary: ${a.textSecondary};
    --${d}-text-muted: ${a.textMuted};
    --${d}-border: ${a.border};
    --${d}-border-hover: ${a.borderHover};
    --${d}-accent: ${a.accent};
    --${d}-accent-hover: ${a.accentHover};
    --${d}-shadow: ${a.shadow};

    /* Customizable sizing and layout variables */
    --${d}-toolbar-radius: 8px;
    --${d}-toolbar-padding: 4px;
    --${d}-toolbar-gap: 2px;
    --${d}-btn-size: 32px;
    --${d}-btn-size-mobile: 44px;
    --${d}-btn-radius: 6px;
    --${d}-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
    --${d}-transition-duration: 0.15s;
    --${d}-z-index-toolbar: 10;
    --${d}-z-index-tooltip: 1000;
  `}function tn(){return`
    /* Root container for CSS isolation */
    .${d}-root {
      font-family: var(--${d}-font-family);
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .${d}-root *,
    .${d}-root *::before,
    .${d}-root *::after {
      box-sizing: border-box;
    }

    .${d}-container {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      display: inline-flex;
      flex-direction: row;
      align-items: center;
      flex-wrap: nowrap;
      gap: var(--${d}-toolbar-gap);
      padding: var(--${d}-toolbar-padding);
      background: var(--${d}-bg-primary);
      border: 1px solid var(--${d}-border);
      border-radius: var(--${d}-toolbar-radius);
      backdrop-filter: blur(12px);
      box-shadow: 0 4px 16px var(--${d}-shadow);
      z-index: var(--${d}-z-index-toolbar);
      margin-top: 8px;
      font-family: var(--${d}-font-family);
    }

    .${d}-player-controls {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      display: inline-flex;
      flex-direction: row;
      align-items: center;
      flex-wrap: nowrap;
      gap: var(--${d}-toolbar-gap);
      padding: var(--${d}-toolbar-padding);
      background: var(--${d}-bg-primary);
      border: 1px solid var(--${d}-border);
      border-radius: var(--${d}-toolbar-radius);
      backdrop-filter: blur(12px);
      box-shadow: 0 4px 16px var(--${d}-shadow);
      z-index: var(--${d}-z-index-toolbar);
      margin-bottom: 8px;
      font-family: var(--${d}-font-family);
    }

    /* ==================== LAYOUT MODES ==================== */

    /* Horizontal layout (default) - already styled above */
    .${d}-layout-horizontal .${d}-container {
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      flex-direction: row;
    }

    /* Vertical sidebar layout */
    .${d}-layout-vertical .${d}-container {
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      flex-direction: column;
      margin-top: 0;
      margin-left: 8px;
    }

    .${d}-layout-vertical.${d}-sidebar-right .${d}-container {
      left: auto;
      right: 0;
      margin-left: 0;
      margin-right: 8px;
    }

    .${d}-layout-vertical .${d}-divider {
      width: 20px;
      height: 1px;
      margin: 4px 0;
    }

    .${d}-layout-vertical .${d}-player-controls {
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      flex-direction: row;
    }

    /* Minimal/Floating layout */
    .${d}-layout-minimal .${d}-container {
      top: 8px;
      left: 8px;
      transform: none;
      flex-wrap: wrap;
      max-width: 200px;
      cursor: move;
      user-select: none;
    }

    .${d}-layout-minimal .${d}-container.${d}-dragging {
      opacity: 0.8;
    }

    .${d}-layout-minimal .${d}-player-controls {
      bottom: 8px;
      left: 50%;
      transform: translateX(-50%);
    }

    /* Bottom dock layout */
    .${d}-layout-bottom-dock .${d}-container {
      top: auto;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      margin-top: 0;
      margin-bottom: 8px;
      flex-direction: row;
    }

    .${d}-layout-bottom-dock .${d}-player-controls {
      display: none;
    }

    /* ==================== COLLAPSIBLE TOOLBARS ==================== */

    .${d}-collapsible {
      transition: transform var(--${d}-transition-duration) ease,
                  opacity var(--${d}-transition-duration) ease;
    }

    .${d}-collapsed {
      opacity: 0.3;
      pointer-events: none;
    }

    .${d}-collapsed:hover,
    .${d}-collapsed:focus-within {
      opacity: 1;
      pointer-events: auto;
    }

    /* Collapse direction based on layout */
    .${d}-layout-horizontal .${d}-container.${d}-collapsed {
      transform: translateX(-50%) translateY(-100%);
    }

    .${d}-layout-vertical .${d}-container.${d}-collapsed {
      transform: translateY(-50%) translateX(-100%);
    }

    .${d}-layout-vertical.${d}-sidebar-right .${d}-container.${d}-collapsed {
      transform: translateY(-50%) translateX(100%);
    }

    .${d}-layout-minimal .${d}-container.${d}-collapsed {
      transform: scale(0.8);
      opacity: 0.3;
    }

    .${d}-layout-bottom-dock .${d}-container.${d}-collapsed {
      transform: translateX(-50%) translateY(100%);
    }

    .${d}-collapse-btn {
      position: absolute;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--${d}-bg-secondary);
      border: 1px solid var(--${d}-border);
      border-radius: 50%;
      cursor: pointer;
      z-index: calc(var(--${d}-z-index-toolbar) + 1);
      transition: background var(--${d}-transition-duration) ease;
    }

    .${d}-collapse-btn:hover {
      background: var(--${d}-bg-hover);
    }

    .${d}-collapse-btn svg {
      width: 14px;
      height: 14px;
      color: var(--${d}-text-secondary);
      transition: transform var(--${d}-transition-duration) ease;
    }

    .${d}-collapsed + .${d}-collapse-btn svg {
      transform: rotate(180deg);
    }

    /* Collapse button position based on layout */
    .${d}-layout-horizontal .${d}-collapse-btn {
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-top: 4px;
    }

    .${d}-layout-vertical .${d}-collapse-btn {
      top: 50%;
      left: 100%;
      transform: translateY(-50%);
      margin-left: 4px;
    }

    .${d}-layout-vertical.${d}-sidebar-right .${d}-collapse-btn {
      left: auto;
      right: 100%;
      margin-left: 0;
      margin-right: 4px;
    }

    .${d}-layout-minimal .${d}-collapse-btn {
      top: -8px;
      right: -8px;
      left: auto;
      transform: none;
    }

    .${d}-layout-bottom-dock .${d}-collapse-btn {
      bottom: 100%;
      left: 50%;
      top: auto;
      transform: translateX(-50%);
      margin-bottom: 4px;
    }

    /* Fullscreen mode - toolbars inside the fullscreen container */
    :fullscreen .${d}-container,
    :-webkit-full-screen .${d}-container {
      position: fixed;
      top: 0;
      margin-top: 8px;
    }

    :fullscreen .${d}-player-controls,
    :-webkit-full-screen .${d}-player-controls {
      position: fixed;
      bottom: 0;
      margin-bottom: 8px;
    }

    .${d}-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      padding: 0;
      border: none;
      border-radius: 6px;
      background: transparent;
      color: var(--${d}-text-secondary);
      cursor: pointer;
      transition: background 0.15s ease, color 0.15s ease;
      outline: none;
    }

    .${d}-btn:hover {
      background: var(--${d}-bg-hover);
      color: var(--${d}-text-primary);
    }

    .${d}-btn:active {
      background: var(--${d}-bg-active);
    }

    .${d}-btn.active {
      background: var(--${d}-accent);
      color: #ffffff;
    }

    .${d}-btn.active:hover {
      background: var(--${d}-accent-hover);
    }

    .${d}-btn:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }

    .${d}-btn svg {
      width: 18px;
      height: 18px;
    }

    .${d}-divider {
      flex: 0 0 1px;
      width: 1px;
      height: 20px;
      margin: 0 4px;
      background: var(--${d}-border);
    }

    .${d}-color-picker {
      width: 32px;
      height: 32px;
      padding: 4px;
      border: none;
      border-radius: 6px;
      background: transparent;
      cursor: pointer;
      transition: background 0.15s ease;
    }

    .${d}-color-picker:hover {
      background: var(--${d}-bg-hover);
    }

    .${d}-color-picker::-webkit-color-swatch-wrapper {
      padding: 0;
    }

    .${d}-color-picker::-webkit-color-swatch {
      border: 2px solid var(--${d}-border);
      border-radius: 4px;
    }

    .${d}-color-picker:hover::-webkit-color-swatch {
      border-color: var(--${d}-border-hover);
    }

    .${d}-slider {
      width: 48px;
      height: 28px;
      padding: 0 8px;
      border: 1px solid var(--${d}-border);
      border-radius: 6px;
      background: var(--${d}-bg-secondary);
      color: var(--${d}-text-primary);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 12px;
      font-weight: 500;
      text-align: center;
      transition: border-color 0.15s ease;
    }

    .${d}-slider:hover {
      border-color: var(--${d}-border-hover);
    }

    .${d}-slider:focus {
      outline: none;
      border-color: var(--${d}-accent);
    }

    .${d}-group {
      display: inline-flex;
      align-items: center;
      gap: 2px;
    }

    .${d}-fullscreen-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      padding: 0;
      border: none;
      border-radius: 6px;
      background: transparent;
      color: var(--${d}-text-secondary);
      cursor: pointer;
      transition: background 0.15s ease, color 0.15s ease;
      outline: none;
    }

    .${d}-fullscreen-btn:hover {
      background: var(--${d}-bg-hover);
      color: var(--${d}-text-primary);
    }

    .${d}-fullscreen-btn svg {
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
      background: var(--${d}-bg-secondary);
      color: var(--${d}-text-primary);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 12px;
      font-weight: 500;
      line-height: 1.3;
      white-space: nowrap;
      border-radius: 6px;
      border: 1px solid var(--${d}-border);
      box-shadow: 0 4px 12px var(--${d}-shadow);
    }

    /* Tooltip arrow */
    [data-tooltip]::before {
      content: '';
      inset-block-end: calc(100% + 2px);
      inset-inline-start: 50%;
      translate: -50% 4px;
      border: 6px solid transparent;
      border-block-start-color: var(--${d}-bg-secondary);
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
      border-block-end-color: var(--${d}-bg-secondary);
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
      .${d}-container {
        gap: 4px;
        padding: 6px;
        margin-top: 4px;
        border-radius: 10px;
      }

      .${d}-player-controls {
        gap: 4px;
        padding: 6px;
        margin-bottom: 4px;
        border-radius: 10px;
      }

      .${d}-btn {
        width: 44px;
        height: 44px;
        border-radius: 8px;
      }

      .${d}-btn svg {
        width: 22px;
        height: 22px;
      }

      .${d}-divider {
        height: 28px;
        margin: 0 6px;
      }

      .${d}-color-picker {
        width: 44px;
        height: 44px;
        padding: 6px;
        border-radius: 8px;
      }

      .${d}-slider {
        width: 56px;
        height: 36px;
        font-size: 14px;
        border-radius: 8px;
      }

      .${d}-fullscreen-btn {
        width: 44px;
        height: 44px;
        border-radius: 8px;
      }

      .${d}-fullscreen-btn svg {
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
    :fullscreen .${d}-container,
    :-webkit-full-screen .${d}-container {
      margin-top: max(8px, env(safe-area-inset-top, 8px));
    }

    :fullscreen .${d}-player-controls,
    :-webkit-full-screen .${d}-player-controls {
      margin-bottom: max(8px, env(safe-area-inset-bottom, 8px));
    }

    /* Mobile fullscreen - extra adjustments */
    @media (max-width: 960px) {
      :fullscreen .${d}-container,
      :-webkit-full-screen .${d}-container {
        margin-top: max(4px, env(safe-area-inset-top, 4px));
        padding-left: max(6px, env(safe-area-inset-left, 6px));
        padding-right: max(6px, env(safe-area-inset-right, 6px));
      }

      :fullscreen .${d}-player-controls,
      :-webkit-full-screen .${d}-player-controls {
        margin-bottom: max(4px, env(safe-area-inset-bottom, 4px));
        padding-left: max(6px, env(safe-area-inset-left, 6px));
        padding-right: max(6px, env(safe-area-inset-right, 6px));
      }
    }

    /* Landscape orientation on mobile - compact mode */
    @media (max-width: 960px) and (orientation: landscape) and (max-height: 500px) {
      .${d}-container {
        padding: 4px;
        gap: 2px;
      }

      .${d}-btn {
        width: 36px;
        height: 36px;
      }

      .${d}-btn svg {
        width: 18px;
        height: 18px;
      }

      .${d}-divider {
        height: 24px;
        margin: 0 4px;
      }

      .${d}-color-picker {
        width: 36px;
        height: 36px;
        padding: 4px;
      }

      .${d}-slider {
        width: 48px;
        height: 32px;
        font-size: 12px;
      }

      .${d}-fullscreen-btn {
        width: 36px;
        height: 36px;
      }

      .${d}-fullscreen-btn svg {
        width: 18px;
        height: 18px;
      }

      .${d}-player-controls {
        padding: 4px;
        gap: 2px;
      }
    }
  `}var K=null;function Et(a="dark"){K||(K=document.createElement("style"),K.id=`${d}-theme-styles`,document.head.appendChild(K));let o=Ze[a];K.textContent=`
    :root {
      ${Qe(o)}
    }
    ${tn()}
  `}function F(a){a.classList.add(`${d}-btn`)}function Kt(a){a.classList.add(`${d}-container`)}function qt(a){a.classList.add(`${d}-player-controls`)}function _t(a){a.classList.add(`${d}-color-picker`)}function Jt(a){a.classList.add(`${d}-slider`)}function Zt(a){a.classList.add(`${d}-fullscreen-btn`)}function q(){let a=document.createElement("div");return a.classList.add(`${d}-divider`),a}function _(){return d}function Qt(a){let o=document.createElement("button");o.type="button",o.dataset.tooltip="Toggle theme",F(o);let t=()=>{let e=a.theme==="dark";o.innerHTML=e?`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
        </svg>`};return t(),a.addEvent(o,"click",()=>{a.setTheme(a.theme==="dark"?"light":"dark"),t()}),o}function te(a,o){let t=document.createElement("button");t.type="button",F(t),t.style.float="right",t.dataset.tooltip="Download frame",t.dataset.tooltipPosition="bottom",t.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>',o.addEvent(t,"click",()=>{let e=o.frameToDataUrl();if(!e)return;let n=document.createElement("a");n.download=`frame_${String(o.activeTimeFrame).padStart(3,"0")}.png`,n.href=e,n.click()}),o.buttons.push(t),o.playerControlsContainer.appendChild(t)}var ee='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume-x"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="22" x2="16" y1="9" y2="15"></line><line x1="16" x2="22" y1="9" y2="15"></line></svg>',ne='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume-2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>';function oe(a,o){let t=document.createElement("button");t.type="button",F(t),t.dataset.tooltip="Mute/Unmute",t.dataset.tooltipPosition="bottom",a.muted||a.volume===0?t.innerHTML=ee:t.innerHTML=ne,o.addEvent(a,"volumechange",()=>{a.muted||a.volume===0?t.innerHTML=ee:t.innerHTML=ne}),o.addEvent(t,"click",()=>{if(a.muted){a.muted=!1;return}a.volume===0?a.volume=1:a.volume=0}),o.buttons.push(t),o.playerControlsContainer.appendChild(t)}var z=[{value:0,label:"off"},{value:.25,label:"25%"},{value:.5,label:"50%"},{value:.7,label:"70%"},{value:1,label:"100%"}];function ie(a,o=!1){let t=o?'<circle cx="18" cy="6" r="4" fill="currentColor" opacity="0.7"/>':"";return`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <style>
      .label {
        font-family: sans-serif;
        font-size: 9px;
      }
    </style>
    <rect x="3" y="3" width="18" height="18" rx="2" opacity="${a.value===0?.3:a.value}"/>
    <text x="12" y="14" text-anchor="middle" class="label" fill="currentColor">${a.label}</text>
    ${t}
  </svg>`}function kt(a){let o=z.findIndex(t=>t.value===a);return o===-1?4:o}function ae(a){let o=document.createElement("button");o.type="button",o.dataset.tooltip="Opacity";let t=kt(a.overlayOpacity),e=()=>{var h;let i=a.currentTool==="move"?a.pluginForTool("move"):null,r=i==null?void 0:i.getSelectedShape();if(r){let s=(h=r.opacity)!=null?h:1,l=kt(s);o.innerHTML=ie(z[l],!0),o.dataset.tooltip="Shape opacity"}else o.innerHTML=ie(z[t],!1),o.dataset.tooltip="Overlay opacity"};e(),F(o),a.addEvent(o,"click",()=>{var h;let i=a.currentTool==="move"?a.pluginForTool("move"):null,r=i==null?void 0:i.getSelectedShape();if(r&&i){let s=(h=r.opacity)!=null?h:1,l=kt(s);l=(l+1)%z.length;let c=z[l].value;i.setSelectedShapeOpacity(c)}else t=(t+1)%z.length,a.overlayOpacity=z[t].value,a.redrawFullCanvas();e()});let n=a.redrawFullCanvas.bind(a);return a.redrawFullCanvas=()=>{n(),e()},a.buttons.push(o),a.uiContainer.appendChild(o),o}var re='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>',en='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pause"><rect width="4" height="16" x="6" y="4"></rect><rect width="4" height="16" x="14" y="4"></rect></svg>';function se(a,o){let t=document.createElement("button");t.type="button",t.innerHTML=re,F(t),t.dataset.tooltip="Play/Pause",t.dataset.tooltipPosition="bottom",o.addEvent(a,"play",()=>{t.innerHTML=en}),o.addEvent(a,"pause",()=>{t.innerHTML=re}),o.addEvent(t,"click",()=>{o.withRefVideo(e=>{e.paused&&e.play().then(()=>{o.showButton("compare")})}),a.paused?a.play().then(()=>{o.redrawFullCanvas()}):(a.pause(),o.raf(()=>{o.redrawFullCanvas()}))}),o.buttons.push(t),o.playerControlsContainer.appendChild(t)}function le(a){return`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-superscript">
        <style>
            .small {
                font-family: auto;
                font-size: ${a===1?"16":"24"}px;
            }
        </style>
        <text x="${a===1?3:2}" y="${a===1?17:20}" font-weight="normal" class="small">${{"0.25":"\xBC","0.5":"\xBD","0.75":"\xBE",1:"1\xD7"}[String(a)]}</text>
        
    </svg>`}function he(a,o){let t=[.25,.5,.75,1],e=document.createElement("button"),n=t[t.length-1];e.type="button",a.playbackRate=n,e.innerHTML=le(n),F(e),e.dataset.tooltip="Playback speed",e.dataset.tooltipPosition="bottom",o.addEvent(e,"click",()=>{let i=t.indexOf(a.playbackRate),r=i+1>=t.length?0:i+1;a.playbackRate=t[r],e.innerHTML=le(t[r])}),o.buttons.push(e),o.playerControlsContainer.appendChild(e)}var nn=500;function ce(a,o,t){let e=null,n=!1,i=()=>{n=!1,e=setTimeout(()=>{n=!0,t(),o.redrawFullCanvas()},nn)},r=()=>{e&&(clearTimeout(e),e=null)},h=()=>{e&&(clearTimeout(e),e=null)},s=l=>{n&&(l.preventDefault(),l.stopImmediatePropagation(),n=!1)};o.addEvent(a,"click",s),a.addEventListener("pointerdown",i),a.addEventListener("pointerup",r),a.addEventListener("pointerleave",h),o.destructors.push(()=>{a.removeEventListener("pointerdown",i),a.removeEventListener("pointerup",r),a.removeEventListener("pointerleave",h),e&&clearTimeout(e)})}var Q=class{constructor(o,t){this.create=(o,t,e=this.uiContainer,n,i="top")=>{let r=document.createElement("button");if(r.type="button",r.innerHTML=o,F(r),n&&(r.dataset.tooltip=n,i==="bottom"&&(r.dataset.tooltipPosition="bottom")),e.appendChild(r),this.buttons.push(r),typeof t=="function")this.addEvent(r,"click",t);else{r.dataset.tool=t;let h=()=>{this.currentTool===t?this.currentTool=null:this.currentTool=t};try{this.tool.pluginForTool(t),this.addEvent(r,"click",h)}catch(s){console.error(s),r.disabled=!0}}return r};this.tool=o,this.uiContainer=t}get buttons(){return this.tool.buttons}get addEvent(){return this.tool.addEvent.bind(this.tool)}get currentTool(){return this.tool.currentTool}set currentTool(o){this.tool.currentTool=o}};function de(a,o){let t=a.videoElement.tagName==="VIDEO"?a.videoElement:null;if(o.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>',"rectangle",o.uiContainer,"Rectangle"),o.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>',"circle",o.uiContainer,"Circle"),o.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.3 8.7 8.7 21.3c-1 1-2.5 1-3.4 0l-2.6-2.6c-1-1-1-2.5 0-3.4L15.3 2.7c1-1 2.5-1 3.4 0l2.6 2.6c1 1 1 2.5 0 3.4Z"></path><path d="m7.5 10.5 2 2"></path><path d="m10.5 7.5 2 2"></path><path d="m13.5 4.5 2 2"></path><path d="m4.5 13.5 2 2"></path></svg>',"line",o.uiContainer,"Line"),o.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"></path><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"></path></svg>',"curve",o.uiContainer,"Freehand"),o.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>',"arrow",o.uiContainer,"Arrow"),o.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>',"text",o.uiContainer,"Text"),o.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"></path><path d="M22 21H7"></path><path d="m5 11 9 9"></path></svg>',"eraser",o.uiContainer,"Eraser"),o.uiContainer.appendChild(q()),o.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 9 2 12 5 15"></polyline><polyline points="9 5 12 2 15 5"></polyline><polyline points="15 19 12 22 9 19"></polyline><polyline points="19 9 22 12 19 15"></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line></svg>',"move",o.uiContainer,"Move shape"),o.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-flip-horizontal"><path d="M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3"></path><path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3"></path><path d="M12 20v2"></path><path d="M12 14v2"></path><path d="M12 8v2"></path><path d="M12 2v2"></path></svg>',"compare",o.uiContainer,"Compare videos"),ae(a),o.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"></path><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path></svg>',()=>{a.handleUndo()},o.uiContainer,"Undo (Ctrl+Z)"),t){let e=o.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>',()=>{a.prevFrame()},a.playerControlsContainer,"Previous frame (hold for annotation)","bottom");ce(e,a,()=>a.prevAnnotatedFrame()),se(t,a);let n=o.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>',()=>{a.nextFrame()},a.playerControlsContainer,"Next frame (hold for annotation)","bottom");ce(n,a,()=>a.nextAnnotatedFrame()),oe(t,a),he(t,a),te(t,a)}o.create(`<svg viewBox="0 0 24 24" width="24" height="24">
      <path fill="currentColor" d="M3 3h18v18H3V3m2 2v14h14V5H5z"/>
      <path fill="currentColor" d="M7 7h10v10H7V7m2 2v6h6V9H9z"/>
    </svg>`,"selection",o.uiContainer,"Select region")}var $=(a,o)=>{let t=a.target===document.body,e=o.uiContainer.contains(a.target),n=o.playerControlsContainer.contains(a.target),i=o.videoElement.contains(a.target),r=o.canvas.contains(a.target);return e||n||i||r||t};function tt(a){return a.pointerType==="pen"?!1:a.pointerType==="touch"&&a.isPrimary===!1}function ue(a,o){if(!$(a,o))return;let t=o.uiContainer.contains(a.target),e=o.playerControlsContainer.contains(a.target);if(t||e)return;let n=o.videoElement;n.tagName==="VIDEO"&&(n.paused||(o.currentTool=null,n.pause(),o.raf(()=>I(this,null,function*(){o.redrawFullCanvas()}))))}function pe(a,o){var t;$(a,o)&&(a.preventDefault(),a.stopPropagation(),a.stopImmediatePropagation(),(t=a.clipboardData)==null||t.setData("application/json",JSON.stringify(o.saveCurrentFrame())))}function me(a,o){var e;if(!$(a,o))return;a.preventDefault(),a.stopPropagation(),a.stopImmediatePropagation();let t=o.saveCurrentFrame();o.replaceFrame(o.playbackFrame,[]),o.redrawFullCanvas(),(e=a.clipboardData)==null||e.setData("application/json",JSON.stringify(t))}function fe(a,o){if(!$(a,o))return;let t=o.videoElement;t.tagName==="VIDEO"&&(a.key==="ArrowLeft"||a.key==="ArrowRight"?(a.preventDefault(),a.stopPropagation(),a.stopImmediatePropagation(),a.key==="ArrowLeft"?o.prevFrame():a.key==="ArrowRight"&&o.nextFrame()):a.code==="Space"&&(a.preventDefault(),a.stopPropagation(),a.stopImmediatePropagation(),t.paused?t.play().then(()=>{o.redrawFullCanvas()}):(t.pause(),o.raf(()=>{o.redrawFullCanvas()}))))}function ge(a,o){var i,r,h,s,l;if(!$(a,o))return;let t=(r=(i=a.clipboardData)==null?void 0:i.types)!=null?r:[];if(t.includes("application/json"))a.preventDefault(),a.stopPropagation(),a.stopImmediatePropagation();else if(t.includes("Files")){let c=(h=a.clipboardData)==null?void 0:h.files;if(c&&c.length>0){let u=c[0];if(u.type.startsWith("image/")){a.preventDefault(),a.stopPropagation(),a.stopImmediatePropagation();let p=new Image,g=URL.createObjectURL(u);p.addEventListener("load",()=>{URL.revokeObjectURL(g);let v=p.naturalWidth/p.naturalHeight,b=.25,y=b/v*o.aspectRatio;o.addShapesToFrame(o.playbackFrame,[{type:"image",image:p,x:0,y:0,width:b,height:y,strokeStyle:"red",fillStyle:"red",lineWidth:2}]),o.redrawFullCanvas(),o.raf(()=>{o.show()}),o.currentTool="move"},{once:!0}),p.addEventListener("error",()=>{URL.revokeObjectURL(g)},{once:!0}),p.src=g,o.redrawFullCanvas()}}}else if(t.includes("text/plain")){let c=(s=a.clipboardData)==null?void 0:s.getData("text/plain");c&&(a.preventDefault(),a.stopPropagation(),a.stopImmediatePropagation(),o.addShapesToFrame(o.playbackFrame,[{type:"text",text:c,x:.4,y:.4,strokeStyle:o.ctx.strokeStyle,fillStyle:o.ctx.fillStyle,lineWidth:o.ctx.lineWidth}]),o.show(),o.currentTool="move",o.redrawFullCanvas())}else return;let e=(l=a.clipboardData)==null?void 0:l.getData("application/json");if(!e)return;let n=JSON.parse(e);n&&n.shapes&&n.version===1&&(o.addShapesToFrame(o.playbackFrame,n.shapes),o.redrawFullCanvas())}var V={r:"#d31a3b",g:"#15d33b",b:"#0085CA",y:"#F3CE32",a:"#7fffd4",c:"#00ffff",d:"#696969",e:"#50c878",f:"#ff00ff",h:"#f0fff0",i:"#4b0082",j:"#00a86b",k:"#f0e68c",l:"#e6e6fa",m:"#98ff98",n:"#000080",o:"#ffa500",p:"#800080",q:"#e5acc8",s:"#0f52ba",t:"#008080",u:"#3f00ff",v:"#ee82ee",w:"#ffffff",x:"#738678",z:"#0014a8"};function ve(a,o){let t=document.createElement("input");t.type="color",t.value=a,t.dataset.tooltip="Stroke color";let e=n=>{o.ctx.strokeStyle=n.target.value,o.ctx.fillStyle=n.target.value,o.focusOnMediaNode()};return o.addEvent(t,"input",e),t}function ye(a){let o=document.createElement("input");o.type="number",o.step="1",o.min="1",o.max="10",o.value="5",o.style.margin="5px",o.dataset.tooltip="Stroke width";let t=e=>{a.ctx.lineWidth=e.target.valueAsNumber,a.focusOnMediaNode()};return a.addEvent(o,"input",t),o}var on=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
</svg>`;function xe(a){let o=document.createElement("button");o.innerHTML=on,o.type="button",o.dataset.tooltip="Fullscreen",o.dataset.tooltipPosition="bottom",Zt(o);let t=()=>{if(document.fullscreenElement)document.exitFullscreen&&document.exitFullscreen();else{let n=a.videoElement.parentElement;n!=null&&n.requestFullscreen&&n.requestFullscreen()}};o.addEventListener("click",t);let e=()=>{a.setCanvasSize(),a.playbackFrame=a.playbackFrame,a.canvas.focus(),a.redrawFullCanvas(),o.blur()};return document.addEventListener("fullscreenchange",e),a.destructors.push(()=>{o.removeEventListener("click",t),document.removeEventListener("fullscreenchange",e)}),o}var an=V.r,rn="",sn="";function be(){var h,s;let a=document.createElement("div");a.style.cssText=sn,Kt(a),(h=this.canvas.parentNode)==null||h.insertBefore(a,this.canvas);let o=document.createElement("div");o.style.cssText=rn,qt(o),(s=this.canvas.parentNode)==null||s.insertBefore(o,this.canvas.nextSibling),this.playerControlsContainer=o;let t=this.videoElement.tagName==="VIDEO"?this.videoElement:null;this.uiContainer=a;let e=()=>{let l=document.createElement("div");return l.style.display="inline-flex",l.style.alignItems="center",l},n=new Q(this,a);de(this,n),this.isMobile&&(this.hideButton("line"),this.hideButton("circle"),this.hideButton("rectangle"),this.hideButton("eraser")),this.hideButton("compare"),a.appendChild(q()),this.colorPicker=ve(an,this),_t(this.colorPicker),a.appendChild(this.colorPicker);let i=e();this.strokeSizePicker=ye(this),Jt(this.strokeSizePicker),i.appendChild(this.strokeSizePicker),a.appendChild(i),a.appendChild(q());let r=Qt(this);if(a.appendChild(r),t){this.hide(),this.addEvent(t,"pause",()=>{this.show()}),this.addEvent(t,"seek",()=>{t.paused&&this.show()}),this.addEvent(t,"timeupdate",()=>{t.currentTime<2e-4&&!t.paused&&this.startAnnotationsAsVideo()}),this.addEvent(t,"error",()=>{this.hide()}),this.addEvent(t,"stalled",()=>{this.hide()}),this.addEvent(t,"play",()=>{this.hideControls(),this.startAnnotationsAsVideo()}),this.addEvent(document,"copy",c=>{pe(c,this)}),this.addEvent(document,"cut",c=>{me(c,this)}),this.addEvent(document,"paste",c=>{ge(c,this)}),this.addEvent(document,"click",c=>{ue(c,this)}),this.addEvent(document,"keydown",c=>{fe(c,this)}),this.addEvent(document.body.querySelector("div"),"drop",c=>{var u;(u=c.dataTransfer)!=null&&u.types});let l=xe(this);o.appendChild(l)}}function we(){var a;this.canvas=document.createElement("canvas"),this.ctx=this.canvas.getContext("2d"),(a=this.videoElement.parentNode)==null||a.insertBefore(this.canvas,this.videoElement.nextSibling),this.canvas.style.position="absolute",this.canvas.style.backgroundColor="transparent",this.canvas.style.top="0",this.canvas.style.left="0",this.canvas.style.zIndex="1",this.addEvent(this.canvas,"pointerdown",this.handleMouseDown),this.addEvent(this.canvas,"pointermove",this.handleMouseMove),this.addEvent(this.canvas,"pointerup",this.handleMouseUp),this.addEvent(this.canvas,"pointercancel",this.handleMouseUp),this.addEvent(this.canvas,"pointerenter",()=>{this.isCursorOverCanvas=!0}),this.addEvent(this.canvas,"pointerleave",()=>{this.isCursorOverCanvas=!1}),this.addEvent(this.canvas,"touchmove",o=>{o.stopImmediatePropagation(),o.stopPropagation(),o.preventDefault()}),this.addEvent(window,"resize",this.setCanvasSize),this.addEvent(document,"keydown",this.onKeyDown)}var et=class{constructor(){this.destructors=[];this.isDestroyed=!1;this.activeTimeFrame=1;this.globalShapes=[];this.timeStack=new Map;this.undoTimeStack=new Map}cleanFrameStacks(){this.timeStack.clear(),this.undoTimeStack.clear()}destroy(){this.destructors.forEach(o=>o()),this.destructors=[],this.globalShapes=[],this.cleanFrameStacks()}raf(o){return requestAnimationFrame(o)}addEvent(o,t,e){let n=i=>{this.isDestroyed||e(i)};o.addEventListener(t,n),this.destructors.push(()=>{o.removeEventListener(t,n)})}addProgressBarOverlay(){throw new Error("Method not implemented.")}initUI(){throw new Error("Method not implemented.")}initCanvas(){throw new Error("Method not implemented.")}addFrameSquareOverlay(o=this.activeTimeFrame){throw new Error("Method not implemented.")}addVideoOverlay(){throw new Error("Method not implemented.")}withRefVideo(o){this.isDestroyed||this.referenceVideoElement&&o(this.referenceVideoElement)}withVideo(o){if(this.isDestroyed)return;let t=this.videoElement;!t||t.tagName!=="VIDEO"||o(t)}};var C=class{constructor(o){this.startX=0;this.startY=0;this.isDrawing=!1;this.annotationTool=o}isPointerAtShape(o,t,e){return!1}on(o,t){}get ctx(){return this.annotationTool.ctx}onDeactivate(){}onActivate(){}reset(){this.startX=0,this.startY=0,this.isDrawing=!1}save(o){this.annotationTool.addShape(o)}applyRotation(o,t,e){return o.rotation?(this.ctx.save(),this.ctx.translate(t,e),this.ctx.rotate(o.rotation),this.ctx.translate(-t,-e),!0):!1}restoreRotation(){this.ctx.restore()}getRotationCenter(o,t,e){return o.rotationCenterX!==void 0&&o.rotationCenterY!==void 0?{x:o.rotationCenterX*this.annotationTool.canvasWidth,y:o.rotationCenterY*this.annotationTool.canvasHeight}:{x:t,y:e}}};var nt=class extends C{constructor(){super(...arguments);this.name="rectangle"}move(t,e,n){return t.x+=e,t.y+=n,t}normalize(t,e,n){return M(T({},t),{x:t.x/e,y:t.y/n,width:t.width/e,height:t.height/n})}onPointerDown(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.startX=e,this.startY=n,this.isDrawing=!0}onPointerMove(t){if(!this.isDrawing)return;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.drawRectangle(this.startX,this.startY,e-this.startX,n-this.startY)}onPointerUp(t){if(!this.isDrawing)return;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.save({type:"rectangle",x:this.startX,y:this.startY,width:e-this.startX,height:n-this.startY,strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth}),this.drawRectangle(this.startX,this.startY,e-this.startX,n-this.startY),this.isDrawing=!1}drawRectangle(t,e,n,i){this.ctx.beginPath(),this.ctx.rect(t,e,n,i),this.ctx.stroke()}draw(t){let e=t.x+t.width/2,n=t.y+t.height/2,i=this.getRotationCenter(t,e,n),r=this.applyRotation(t,i.x,i.y);this.drawRectangle(t.x,t.y,t.width,t.height),r&&this.restoreRotation()}isPointerAtShape(t,e,n){let r=Math.min(t.x,t.x+t.width),h=Math.max(t.x,t.x+t.width),s=Math.min(t.y,t.y+t.height),l=Math.max(t.y,t.y+t.height),c=Math.abs(e-r)<=5,u=Math.abs(e-h)<=5,p=Math.abs(n-s)<=5,g=Math.abs(n-l)<=5,v=n>=s-5&&n<=l+5,b=e>=r-5&&e<=h+5;return(c||u)&&v||(p||g)&&b}};var ot=class extends C{constructor(){super(...arguments);this.name="circle"}move(t,e,n){return t.x+=e,t.y+=n,t}normalize(t,e,n){return M(T({},t),{x:t.x/e,y:t.y/n,radius:t.radius/e})}onPointerDown(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.startX=e,this.startY=n,this.isDrawing=!0}onPointerMove(t){if(!this.isDrawing)return;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t),i=Math.sqrt(Math.pow(e-this.startX,2)+Math.pow(n-this.startY,2));this.drawCircle(this.startX,this.startY,i)}onPointerUp(t){if(!this.isDrawing)return;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t),i=Math.sqrt(Math.pow(e-this.startX,2)+Math.pow(n-this.startY,2));this.save({type:"circle",x:this.startX,y:this.startY,radius:i,strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth}),this.drawCircle(this.startX,this.startY,i),this.isDrawing=!1}drawCircle(t,e,n){this.ctx.beginPath(),this.ctx.arc(t,e,n,0,2*Math.PI),this.ctx.stroke()}draw(t){if(t.radius===void 0||t.radius<0)return;let e=this.getRotationCenter(t,t.x,t.y),n=this.applyRotation(t,e.x,e.y);this.drawCircle(t.x,t.y,t.radius),n&&this.restoreRotation()}isPointerAtShape(t,e,n){var l;if(t.radius===void 0||t.radius<0)return!1;let i=e-t.x,r=n-t.y,h=Math.sqrt(i*i+r*r),s=Math.max(((l=t.lineWidth)!=null?l:1)/2,5);return h<=t.radius+s}};var it=class{constructor(o,t){this.x=o;this.y=t}distanceToLine(o,t){let e=t.x-o.x,n=t.y-o.y,i=Math.abs(n*this.x-e*this.y+t.x*o.y-t.y*o.x),r=Math.sqrt(n*n+e*e);return i/r}};function at(a,o){if(a.length<=2)return a;let t=a[0],e=a[a.length-1],n=-1,i=0;for(let r=1;r<a.length-1;r++){let h=a[r].distanceToLine(t,e);h>i&&(n=r,i=h)}if(i>o){let r=at(a.slice(0,n+1),o),h=at(a.slice(n),o);return r.slice(0,r.length-1).concat(h)}else return[t,e]}var rt=class extends C{constructor(){super(...arguments);this.name="curve";this.curvePoints=[];this.zoomScale=2;this.zoomRadius=100;this.zoomCtx=null;this.zoomCanvas=null;this.onKeyPress=t=>{let e=t.key;if(e===null||e===" "||t.isComposing)return;let n=Number(e);if(isNaN(n)||!n){e in V&&(this.annotationTool.colorPicker.value=V[e],this.annotationTool.setCanvasSettings());return}this.annotationTool.strokeSizePicker.value=e,this.annotationTool.setCanvasSettings()}}move(t,e,n){return t.points=t.points.map(i=>({x:i.x+e,y:i.y+n})),t}onActivate(){this.initZoomCanvas(),document.addEventListener("keypress",this.onKeyPress)}onDeactivate(){this.zoomCtx=null,this.zoomCanvas=null,document.removeEventListener("keypress",this.onKeyPress)}normalize(t,e,n){return M(T({},t),{points:t.points.map(i=>({x:i.x/e,y:i.y/n}))})}draw(t){if(!t.points||t.points.length===0)return;let e=0,n=0;for(let l of t.points)e+=l.x,n+=l.y;let i=e/t.points.length,r=n/t.points.length,h=this.getRotationCenter(t,i,r),s=this.applyRotation(t,h.x,h.y);this.drawCurve(t),s&&this.restoreRotation()}reset(){super.reset(),this.curvePoints=[]}onPointerDown(t){if(this.isDrawing)return;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.curvePoints=[],this.startX=e,this.startY=n,this.isDrawing=!0,this.curvePoints.push({x:e,y:n})}onPointerMove(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);if(!this.isDrawing){this.drawZoomCircle(e,n,t.shiftKey);return}this.curvePoints.push({x:e,y:n}),this.drawCurve({points:this.curvePoints,lineWidth:this.ctx.lineWidth}),this.drawZoomCircle(e,n,t.shiftKey)}onPointerUp(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);if(this.drawZoomCircle(e,n,t.shiftKey),!this.isDrawing)return;this.curvePoints.push({x:e,y:n});let i=this.curvePoints.map(c=>new it(c.x,c.y)),l={type:"curve",points:at(i,.5).map(c=>({x:c.x,y:c.y})),strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth};this.save(l),this.curvePoints=[],this.isDrawing=!1}drawCurve(t){if(t.points.length===2&&t.points[0].x===t.points[1].x&&t.points[0].y===t.points[1].y){let e=t.lineWidth/4,n=0,i=2*Math.PI;this.ctx.beginPath(),this.ctx.arc(t.points[0].x,t.points[0].y,e,n,i),this.ctx.stroke()}else{this.ctx.beginPath(),this.ctx.moveTo(t.points[0].x,t.points[0].y);for(let e=0;e<t.points.length-1;e++){let n=t.points[e],i=t.points[e+1];this.ctx.quadraticCurveTo(n.x,n.y,i.x,i.y)}this.ctx.stroke()}}initZoomCanvas(){let t=document.createElement("canvas"),e=2;t.width=this.zoomRadius*2*e,t.height=this.zoomRadius*2*e;let n=t.getContext("2d");n&&(n.imageSmoothingQuality="high",n.imageSmoothingEnabled=!0,this.zoomCtx=n,this.zoomCanvas=t)}isPointerAtShape(t,e,n){var r;if(!t.points||t.points.length===0)return!1;let i=Math.max(((r=t.lineWidth)!=null?r:this.ctx.lineWidth)/2,5);for(let h=0;h<t.points.length-1;h++){let s=t.points[h],l=t.points[h+1],c=e-s.x,u=n-s.y,p=l.x-s.x,g=l.y-s.y,v=c*p+u*g,b=p*p+g*g,y=-1;b!==0&&(y=v/b);let f,m;y<0?(f=s.x,m=s.y):y>1?(f=l.x,m=l.y):(f=s.x+y*p,m=s.y+y*g);let x=e-f,w=n-m;if(Math.sqrt(x*x+w*w)<i)return!0}return!1}drawZoomCircle(t,e,n=!1){if(!n)return;this.isDrawing||(this.annotationTool.clearCanvas(),this.annotationTool.addVideoOverlay(),this.annotationTool.drawShapesOverlay());let i=this.zoomCtx;if(!i)return;let r=this.annotationTool.pixelRatio,h=this.zoomRadius*2/this.zoomScale,s=t-h/2,l=e-h/2;i.clearRect(0,0,this.zoomCanvas.width,this.zoomCanvas.height),i.drawImage(this.ctx.canvas,s*r,l*r,h*r,h*r,0,0,this.zoomRadius*2,this.zoomRadius*2),this.ctx.save(),this.ctx.beginPath(),this.ctx.arc(t,e,this.zoomRadius,0,2*Math.PI),this.ctx.closePath(),this.ctx.clip(),this.ctx.drawImage(this.zoomCanvas,t-this.zoomRadius,e-this.zoomRadius),this.ctx.restore()}};var st=class extends C{constructor(){super(...arguments);this.name="line"}move(t,e,n){return t.x1+=e,t.y1+=n,t.x2+=e,t.y2+=n,t}normalize(t,e,n){return M(T({},t),{x1:t.x1/e,y1:t.y1/n,x2:t.x2/e,y2:t.y2/n})}onPointerDown(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.startX=e,this.startY=n,this.isDrawing=!0}onPointerMove(t){if(!this.isDrawing)return;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.drawLine(this.startX,this.startY,e,n)}onPointerUp(t){if(!this.isDrawing)return;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.save({type:"line",x1:this.startX,y1:this.startY,x2:e,y2:n,fillStyle:this.ctx.fillStyle,strokeStyle:this.ctx.strokeStyle,lineWidth:this.ctx.lineWidth}),this.drawLine(this.startX,this.startY,e,n),this.isDrawing=!1}drawLine(t,e,n,i){this.ctx.beginPath(),this.ctx.moveTo(t,e),this.ctx.lineTo(n,i),this.ctx.stroke()}draw(t){let e=(t.x1+t.x2)/2,n=(t.y1+t.y2)/2,i=this.getRotationCenter(t,e,n),r=this.applyRotation(t,i.x,i.y);this.drawLine(t.x1,t.y1,t.x2,t.y2),r&&this.restoreRotation()}isPointerAtShape(t,e,n){var p;let{x1:i,y1:r,x2:h,y2:s}=t,l=Math.max(((p=t.lineWidth)!=null?p:1)/2,5),c=(h-i)*(r-n)-(i-e)*(s-r),u=O(h-i,2)+O(s-r,2);if(u===0){let g=e-i,v=n-r;return Math.sqrt(g*g+v*v)<=l}return Math.abs(c)/Math.sqrt(u)<=l&&e>=Math.min(i,h)-l&&e<=Math.max(i,h)+l&&n>=Math.min(r,s)-l&&n<=Math.max(r,s)+l}};var lt=class extends C{constructor(){super(...arguments);this.name="arrow"}normalize(t,e,n){return M(T({},t),{x1:t.x1/e,y1:t.y1/n,x2:t.x2/e,y2:t.y2/n})}move(t,e,n){return t.x1+=e,t.y1+=n,t.x2+=e,t.y2+=n,t}draw(t){let e=(t.x1+t.x2)/2,n=(t.y1+t.y2)/2,i=this.getRotationCenter(t,e,n),r=this.applyRotation(t,i.x,i.y);this.drawArrow(t.x1,t.y1,t.x2,t.y2,t.lineWidth),r&&this.restoreRotation()}onPointerDown(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.startX=e,this.startY=n,this.isDrawing=!0}onPointerMove(t){if(!this.isDrawing)return;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.drawArrow(this.startX,this.startY,e,n)}onPointerUp(t){if(!this.isDrawing)return;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.save({type:"arrow",x1:this.startX,y1:this.startY,x2:e,y2:n,strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth}),this.drawArrow(this.startX,this.startY,e,n),this.isDrawing=!1}drawArrow(t,e,n,i,r){let h=10+2.5*(r!=null?r:this.ctx.lineWidth),s=Math.PI/6,l=Math.atan2(i-e,n-t);this.ctx.beginPath(),this.ctx.moveTo(t,e),this.ctx.lineTo(n,i),this.ctx.stroke(),this.ctx.beginPath(),this.ctx.moveTo(n,i),this.ctx.lineTo(n-h*Math.cos(l+s),i-h*Math.sin(l+s)),this.ctx.moveTo(n,i),this.ctx.lineTo(n-h*Math.cos(l-s),i-h*Math.sin(l-s)),this.ctx.stroke()}isPointerAtShape(t,e,n){var p;let{x1:i,y1:r,x2:h,y2:s}=t,l=Math.max(((p=t.lineWidth)!=null?p:1)/2,5),c=(h-i)*(r-n)-(i-e)*(s-r),u=O(h-i,2)+O(s-r,2);if(u===0){let g=e-i,v=n-r;return Math.sqrt(g*g+v*v)<=l}return Math.abs(c)/Math.sqrt(u)<=l&&e>=Math.min(i,h)-l&&e<=Math.max(i,h)+l&&n>=Math.min(r,s)-l&&n<=Math.max(r,s)+l}};var ht=class extends C{constructor(){super(...arguments);this.name="text";this.activePopup=null;this.handleKeyDown=t=>{}}move(t,e,n){return t.x+=e,t.y+=n,t}onActivate(){this.annotationTool.canvas.style.cursor="text",this.isDrawing=!0}onDeactivate(){this.destroyPopup(),this.annotationTool.canvas.style.cursor="default",this.isDrawing=!1}draw(t){var g;if(!t.text)return;let e=t.text.split(`
`),n=16+((g=t.lineWidth)!=null?g:this.ctx.lineWidth)*.5,i=n*1.25;this.ctx.font=`${n}px Helvetica Neue, Arial`;let r=e.map(v=>this.ctx.measureText(v).width),h=r.length>0?Math.max(...r):0,s=e.length*i,l=t.x+h/2,c=t.y-n/2+s/2,u=this.getRotationCenter(t,l,c),p=this.applyRotation(t,u.x,u.y);for(let v=0;v<e.length;v++)this.drawTextLine(t.x,t.y+v*i,e[v],n);p&&this.restoreRotation()}drawText(t,e,n){let i=16+this.ctx.lineWidth*.5;this.ctx.font=`${i}px Helvetica Neue, Arial`,this.ctx.fillText(n,t,e)}drawTextLine(t,e,n,i){this.ctx.font=`${i}px Helvetica Neue, Arial`,this.ctx.fillText(n,t,e)}onPointerDown(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.startX=e,this.startY=n}onPointerMove(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.ctx.beginPath(),this.ctx.arc(e,n,5,0,2*Math.PI),this.ctx.fill()}normalize(t,e,n){return M(T({},t),{x:t.x/e,y:t.y/n})}destroyPopup(){var t;this.activePopup&&((t=this.annotationTool.canvas.parentElement)==null||t.removeChild(this.activePopup),this.activePopup=null,document.removeEventListener("keydown",this.handleKeyDown))}createTextInputPopup(t,e){var g;this.destroyPopup();let n=document.createElement("div");this.activePopup=n,n.style.cssText=`
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
    `;let i=document.createElement("input");i.type="text",i.placeholder="Enter text to draw",i.style.cssText=`
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
    `,i.addEventListener("focus",()=>{i.style.borderColor="#007bff"}),i.addEventListener("blur",()=>{i.style.borderColor="#ddd"});let r=document.createElement("div");r.style.cssText=`
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
    `,s=document.createElement("button");s.textContent="Cancel",s.style.cssText=`
      ${h}
      background: #f0f0f0;
      color: #333;
    `,s.addEventListener("mouseover",()=>{s.style.opacity="0.8"}),s.addEventListener("mouseout",()=>{s.style.opacity="1"});let l=document.createElement("button");l.textContent="OK",l.style.cssText=`
      ${h}
      background: #007bff;
      color: white;
    `,l.addEventListener("mouseover",()=>{l.style.opacity="0.8"}),l.addEventListener("mouseout",()=>{l.style.opacity="1"});let c=()=>{this.destroyPopup()},u=()=>{let v=i.value.trim();v&&(this.save({type:"text",x:t,y:e,text:v,strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth}),this.annotationTool.currentTool=null),c()},p=v=>{v.key==="Escape"?c():v.key==="Enter"&&u()};this.handleKeyDown=p,l.onclick=u,s.onclick=c,i.onkeyup=p,document.addEventListener("keydown",p),r.appendChild(s),r.appendChild(l),n.appendChild(i),n.appendChild(r),(g=this.annotationTool.canvas.parentElement)==null||g.appendChild(n),requestAnimationFrame(()=>{i.focus()})}onPointerUp(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.createTextInputPopup(e,n)}isPointerAtShape(t,e,n){var u;if(!t.text)return!1;let i=t.text.split(`
`);if(i.length===0)return!1;let r=16+((u=t.lineWidth)!=null?u:1)*.5,h=r*1.25,s=i.length*h;this.ctx.font=`${r}px Helvetica Neue, Arial`;let l=i.map(p=>this.ctx.measureText(p).width),c=l.length>0?Math.max(...l):0;return c===0?!1:e>=t.x&&e<=t.x+c&&n>=t.y-r&&n<=t.y+s-r}};var ct=class extends C{constructor(){super(...arguments);this.name="eraser"}move(t,e,n){return t.x+=e,t.y+=n,t}normalize(t,e,n){return M(T({},t),{x:t.x/e,y:t.y/n,width:t.width/e,height:t.height/n})}draw(t){this.drawEraser(t.x,t.y,t.width,t.height)}onPointerDown(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.startX=e,this.startY=n,this.isDrawing=!0}onPointerMove(t){if(!this.isDrawing)return;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.ctx.save(),this.ctx.strokeStyle="rgba(255, 255, 255, 0.5)",this.ctx.lineWidth=1,this.ctx.fillStyle="rgba(255, 255, 255, 0.3)",this.ctx.fillRect(this.startX,this.startY,e-this.startX,n-this.startY),this.ctx.strokeRect(this.startX,this.startY,e-this.startX,n-this.startY),this.ctx.restore()}onPointerUp(t){if(!this.isDrawing)return;this.isDrawing=!1;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.save({type:"eraser",x:this.startX,y:this.startY,width:e-this.startX,height:n-this.startY,strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth})}drawEraser(t,e,n,i){this.ctx.clearRect(t,e,n,i)}isPointerAtShape(t,e,n){let i=Math.min(t.x,t.x+t.width),r=Math.max(t.x,t.x+t.width),h=Math.min(t.y,t.y+t.height),s=Math.max(t.y,t.y+t.height);return e>=i&&e<=r&&n>=h&&n<=s}};var dt=class extends C{constructor(){super(...arguments);this.name="move";this.shape=null;this.shapeIndex=-1;this.lastDrawnShape=null;this.isScale=!1;this.selectedShapeIndex=-1;this.boundHandleKeyDown=null;this.activeHandle=null;this.handleSize=8;this.resizeStartBounds=null;this.resizeOriginalShape=null;this.rotationActive=!1;this.rotationStartAngle=0;this.rotationShapeStartAngle=0;this.centerDragActive=!1;this.rotationHandleDistance=40}cloneShape(t){if(t.type==="image"){let e=t;return M(T({},JSON.parse(JSON.stringify(t))),{image:e.image})}return JSON.parse(JSON.stringify(t))}getSelectedShape(){return this.selectedShapeIndex<0||this.selectedShapeIndex>=this.annotationTool.shapes.length?null:this.annotationTool.shapes[this.selectedShapeIndex]}setSelectedShapeOpacity(t){return this.selectedShapeIndex<0||this.selectedShapeIndex>=this.annotationTool.shapes.length?!1:(this.annotationTool.undoStack.push([...this.annotationTool.shapes]),this.annotationTool.shapes[this.selectedShapeIndex].opacity=t,this.annotationTool.redrawFullCanvas(),!0)}move(t){return t}normalize(t){return T({},t)}onActivate(){this.boundHandleKeyDown=this.handleKeyDown.bind(this),document.addEventListener("keydown",this.boundHandleKeyDown)}onDeactivate(){this.boundHandleKeyDown&&(document.removeEventListener("keydown",this.boundHandleKeyDown),this.boundHandleKeyDown=null),this.selectedShapeIndex=-1}handleKeyDown(t){if((t.key==="Backspace"||t.key==="Delete")&&this.selectedShapeIndex>=0){t.preventDefault(),this.deleteSelectedShape();return}if((t.ctrlKey||t.metaKey)&&t.key.toLowerCase()==="d"&&this.selectedShapeIndex>=0){t.preventDefault(),this.duplicateSelectedShape();return}if((t.ctrlKey||t.metaKey)&&t.shiftKey&&t.key==="ArrowRight"){t.preventDefault(),this.copyAnnotationsToNextFrame();return}if((t.ctrlKey||t.metaKey)&&t.shiftKey&&t.key==="ArrowLeft"){t.preventDefault(),this.copyAnnotationsToPrevFrame();return}}duplicateSelectedShape(){let t=this.getSelectedShape();if(!t)return;let e=this.cloneShape(t),n=20;this.getShapeBounds(e)&&this.offsetShape(e,n,n),this.annotationTool.undoStack.push([...this.annotationTool.shapes]);let r=this.annotationTool.serialize([e])[0];this.annotationTool.shapes.push(r),this.selectedShapeIndex=this.annotationTool.shapes.length-1,this.annotationTool.redrawFullCanvas()}copyAnnotationsToNextFrame(){let e=this.annotationTool.activeTimeFrame+1;if(e>this.annotationTool.totalFrames||this.annotationTool.shapes.length===0)return;let n=this.annotationTool.timeStack.get(e)||[],i=this.annotationTool.shapes.map(h=>this.cloneShape(h)),r=[...n,...i];this.annotationTool.timeStack.set(e,r),this.annotationTool.playbackFrame=e,this.annotationTool.redrawFullCanvas()}copyAnnotationsToPrevFrame(){let e=this.annotationTool.activeTimeFrame-1;if(e<1||this.annotationTool.shapes.length===0)return;let n=this.annotationTool.timeStack.get(e)||[],i=this.annotationTool.shapes.map(h=>this.cloneShape(h)),r=[...n,...i];this.annotationTool.timeStack.set(e,r),this.annotationTool.playbackFrame=e,this.annotationTool.redrawFullCanvas()}offsetShape(t,e,n){let i=this.annotationTool.deserialize([t])[0],h=this.annotationTool.pluginForTool(i.type).move(i,e,n);Object.assign(t,this.annotationTool.serialize([h])[0])}getShapeBounds(t){var n;let e=this.annotationTool.deserialize([t])[0];switch(e.type){case"rectangle":{let i=e;return{x:Math.min(i.x,i.x+i.width),y:Math.min(i.y,i.y+i.height),width:Math.abs(i.width),height:Math.abs(i.height)}}case"image":{let i=e;return{x:Math.min(i.x,i.x+i.width),y:Math.min(i.y,i.y+i.height),width:Math.abs(i.width),height:Math.abs(i.height)}}case"selection":{let i=e;return{x:Math.min(i.x,i.x+i.width),y:Math.min(i.y,i.y+i.height),width:Math.abs(i.width),height:Math.abs(i.height)}}case"circle":{let i=e;return{x:i.x-i.radius,y:i.y-i.radius,width:i.radius*2,height:i.radius*2}}case"line":{let i=e,r=Math.min(i.x1,i.x2),h=Math.min(i.y1,i.y2),s=Math.max(i.x1,i.x2),l=Math.max(i.y1,i.y2);return{x:r,y:h,width:s-r||10,height:l-h||10}}case"arrow":{let i=e,r=Math.min(i.x1,i.x2),h=Math.min(i.y1,i.y2),s=Math.max(i.x1,i.x2),l=Math.max(i.y1,i.y2);return{x:r,y:h,width:s-r||10,height:l-h||10}}case"curve":{let i=e;if(!i.points||i.points.length===0)return null;let r=1/0,h=1/0,s=-1/0,l=-1/0;for(let c of i.points)r=Math.min(r,c.x),h=Math.min(h,c.y),s=Math.max(s,c.x),l=Math.max(l,c.y);return{x:r,y:h,width:s-r||10,height:l-h||10}}case"text":{let i=e;if(!i.text)return null;let h=16+((n=t.lineWidth)!=null?n:1)*.5,s=i.text.length*h*.6;return{x:i.x,y:i.y-h,width:s||50,height:h*1.2}}default:return null}}drawResizeHandles(){let t=this.getSelectedShape();if(!t)return;let e=this.getShapeBounds(t);if(!e)return;let n=this.annotationTool.ctx,i=this.handleSize,r=i/2,h=[{pos:"nw",x:e.x,y:e.y},{pos:"n",x:e.x+e.width/2,y:e.y},{pos:"ne",x:e.x+e.width,y:e.y},{pos:"e",x:e.x+e.width,y:e.y+e.height/2},{pos:"se",x:e.x+e.width,y:e.y+e.height},{pos:"s",x:e.x+e.width/2,y:e.y+e.height},{pos:"sw",x:e.x,y:e.y+e.height},{pos:"w",x:e.x,y:e.y+e.height/2}];n.save(),n.strokeStyle="#5b9fff",n.lineWidth=1,n.setLineDash([4,4]),n.strokeRect(e.x,e.y,e.width,e.height),n.setLineDash([]),n.fillStyle="#ffffff",n.strokeStyle="#5b9fff",n.lineWidth=1;for(let s of h)n.fillRect(s.x-r,s.y-r,i,i),n.strokeRect(s.x-r,s.y-r,i,i);n.restore(),this.drawRotationHandles(e)}getShapeRotationCenter(t,e){return t.rotationCenterX!==void 0&&t.rotationCenterY!==void 0?{x:t.rotationCenterX*this.annotationTool.canvasWidth,y:t.rotationCenterY*this.annotationTool.canvasHeight}:{x:e.x+e.width/2,y:e.y+e.height/2}}drawRotationHandles(t){var c;let e=this.getSelectedShape();if(!e)return;let n=this.annotationTool.ctx,i=this.getShapeRotationCenter(e,t),r=(c=e.rotation)!=null?c:0,h=i.x+Math.sin(r)*this.rotationHandleDistance,s=i.y-Math.cos(r)*this.rotationHandleDistance;n.save(),n.beginPath(),n.strokeStyle="#5b9fff",n.lineWidth=1,n.setLineDash([]),n.moveTo(i.x,i.y),n.lineTo(h,s),n.stroke();let l=6;n.beginPath(),n.strokeStyle="#5b9fff",n.lineWidth=1.5,n.moveTo(i.x-l,i.y),n.lineTo(i.x+l,i.y),n.moveTo(i.x,i.y-l),n.lineTo(i.x,i.y+l),n.stroke(),n.beginPath(),n.fillStyle="#ffffff",n.strokeStyle="#5b9fff",n.lineWidth=1.5,n.arc(i.x,i.y,4,0,Math.PI*2),n.fill(),n.stroke(),n.beginPath(),n.fillStyle="#ffffff",n.strokeStyle="#5b9fff",n.lineWidth=1.5,n.arc(h,s,6,0,Math.PI*2),n.fill(),n.stroke(),n.beginPath(),n.strokeStyle="#5b9fff",n.lineWidth=1,n.arc(h,s,3,-Math.PI*.7,Math.PI*.5),n.stroke(),n.restore()}isPointerAtRotationHandle(t,e){var g;let n=this.getSelectedShape();if(!n)return!1;let i=this.getShapeBounds(n);if(!i)return!1;let r=this.getShapeRotationCenter(n,i),h=(g=n.rotation)!=null?g:0,s=r.x+Math.sin(h)*this.rotationHandleDistance,l=r.y-Math.cos(h)*this.rotationHandleDistance,c=t-s,u=e-l;return Math.sqrt(c*c+u*u)<=12}isPointerAtRotationCenter(t,e){let n=this.getSelectedShape();if(!n)return!1;let i=this.getShapeBounds(n);if(!i)return!1;let r=this.getShapeRotationCenter(n,i),h=t-r.x,s=e-r.y;return Math.sqrt(h*h+s*s)<=10}calculateAngle(t,e,n,i){return Math.atan2(n-t,-(i-e))}getHandleAtPosition(t,e){let n=this.getSelectedShape();if(!n)return null;let i=this.getShapeBounds(n);if(!i)return null;let h=(this.handleSize+4)/2,s=[{pos:"nw",x:i.x,y:i.y},{pos:"n",x:i.x+i.width/2,y:i.y},{pos:"ne",x:i.x+i.width,y:i.y},{pos:"e",x:i.x+i.width,y:i.y+i.height/2},{pos:"se",x:i.x+i.width,y:i.y+i.height},{pos:"s",x:i.x+i.width/2,y:i.y+i.height},{pos:"sw",x:i.x,y:i.y+i.height},{pos:"w",x:i.x,y:i.y+i.height/2}];for(let l of s)if(t>=l.x-h&&t<=l.x+h&&e>=l.y-h&&e<=l.y+h)return l.pos;return null}getCursorForHandle(t){return{nw:"nw-resize",n:"n-resize",ne:"ne-resize",e:"e-resize",se:"se-resize",s:"s-resize",sw:"sw-resize",w:"w-resize"}[t]}resizeShape(t,e,n,i,r,h=!1){var y;if(!this.resizeOriginalShape)return;let s=this.annotationTool.deserialize([this.resizeOriginalShape])[0],l=r.x,c=r.y,u=r.width,p=r.height;switch(e){case"nw":l+=n,c+=i,u-=n,p-=i;break;case"n":c+=i,p-=i;break;case"ne":c+=i,u+=n,p-=i;break;case"e":u+=n;break;case"se":u+=n,p+=i;break;case"s":p+=i;break;case"sw":l+=n,u-=n,p+=i;break;case"w":l+=n,u-=n;break}if(h&&r.width>0&&r.height>0){let f=r.width/r.height;if(e==="n"||e==="s"){let m=p*f,x=m-u;u=m,l-=x/2}else if(e==="e"||e==="w"){let m=u/f,x=m-p;p=m,c-=x/2}else{let m=u/r.width,x=p/r.height,w=Math.max(Math.abs(m),Math.abs(x)),E=m>=0?1:-1,S=x>=0?1:-1,k=r.width*w*E,P=r.height*w*S;e==="nw"?(l=r.x+r.width-k,c=r.y+r.height-P):e==="ne"?c=r.y+r.height-P:e==="sw"&&(l=r.x+r.width-k),u=k,p=P}}let g=10;u<g&&(e.includes("w")&&(l=r.x+r.width-g),u=g),p<g&&(e.includes("n")&&(c=r.y+r.height-g),p=g);let v=r.width>0?u/r.width:1,b=r.height>0?p/r.height:1;switch(s.type){case"rectangle":{let f=t;f.x=l/this.annotationTool.canvasWidth,f.y=c/this.annotationTool.canvasHeight,f.width=u/this.annotationTool.canvasWidth,f.height=p/this.annotationTool.canvasHeight;break}case"selection":{let f=t;f.x=l/this.annotationTool.canvasWidth,f.y=c/this.annotationTool.canvasHeight,f.width=u/this.annotationTool.canvasWidth,f.height=p/this.annotationTool.canvasHeight;break}case"circle":{let f=t,m=Math.min(u,p)/2,x=l+u/2,w=c+p/2;f.x=x/this.annotationTool.canvasWidth,f.y=w/this.annotationTool.canvasHeight,f.radius=m/this.annotationTool.canvasWidth;break}case"line":{let f=t,m=s,x=(m.x1-r.x)*v+l,w=(m.y1-r.y)*b+c,E=(m.x2-r.x)*v+l,S=(m.y2-r.y)*b+c;f.x1=x/this.annotationTool.canvasWidth,f.y1=w/this.annotationTool.canvasHeight,f.x2=E/this.annotationTool.canvasWidth,f.y2=S/this.annotationTool.canvasHeight;break}case"arrow":{let f=t,m=s,x=(m.x1-r.x)*v+l,w=(m.y1-r.y)*b+c,E=(m.x2-r.x)*v+l,S=(m.y2-r.y)*b+c;f.x1=x/this.annotationTool.canvasWidth,f.y1=w/this.annotationTool.canvasHeight,f.x2=E/this.annotationTool.canvasWidth,f.y2=S/this.annotationTool.canvasHeight;break}case"curve":{let f=t,m=s;if(!m.points||m.points.length===0)break;f.points=m.points.map(x=>({x:((x.x-r.x)*v+l)/this.annotationTool.canvasWidth,y:((x.y-r.y)*b+c)/this.annotationTool.canvasHeight}));break}case"text":{let f=t,m=s,w=16+((y=this.resizeOriginalShape.lineWidth)!=null?y:1)*.5,E=(m.x-r.x)*v+l,S=(m.y-r.y)*b+c;f.x=E/this.annotationTool.canvasWidth,f.y=S/this.annotationTool.canvasHeight;let k=(v+b)/2,P=w*k;f.lineWidth=Math.max(1,(P-16)*2);break}case"image":{let f=t;f.x=l/this.annotationTool.canvasWidth,f.y=c/this.annotationTool.canvasHeight,f.width=u/this.annotationTool.canvasWidth,f.height=p/this.annotationTool.canvasHeight;break}}}deleteSelectedShape(){this.selectedShapeIndex<0||this.selectedShapeIndex>=this.annotationTool.shapes.length||(this.annotationTool.undoStack.push([...this.annotationTool.shapes]),this.annotationTool.shapes.splice(this.selectedShapeIndex,1),this.selectedShapeIndex=-1,this.shapeIndex=-1,this.annotationTool.redrawFullCanvas())}onPointerDown(t){var l;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);if(this.selectedShapeIndex>=0&&this.isPointerAtRotationHandle(e,n)){let c=this.getSelectedShape();if(c){let u=this.getShapeBounds(c);if(u){let p=this.getShapeRotationCenter(c,u);this.rotationActive=!0,this.rotationStartAngle=this.calculateAngle(p.x,p.y,e,n),this.rotationShapeStartAngle=(l=c.rotation)!=null?l:0,this.isDrawing=!0,this.annotationTool.undoStack.push([...this.annotationTool.shapes]),this.annotationTool.canvas.style.cursor="grabbing";return}}}if(this.selectedShapeIndex>=0&&this.isPointerAtRotationCenter(e,n)){this.centerDragActive=!0,this.startX=e,this.startY=n,this.isDrawing=!0,this.annotationTool.undoStack.push([...this.annotationTool.shapes]),this.annotationTool.canvas.style.cursor="move";return}let i=this.getHandleAtPosition(e,n);if(i&&this.selectedShapeIndex>=0){this.activeHandle=i,this.startX=e,this.startY=n,this.isDrawing=!0;let c=this.getSelectedShape();c&&(this.resizeStartBounds=this.getShapeBounds(c),this.resizeOriginalShape=this.cloneShape(c),this.annotationTool.undoStack.push([...this.annotationTool.shapes])),this.annotationTool.canvas.style.cursor=this.getCursorForHandle(i);return}let r=this.annotationTool.shapes,h=r.slice().reverse(),s=!1;for(let c of h)if(this.isPointerAtShape(c,e,n)){this.shape=this.cloneShape(c),this.shapeIndex=r.indexOf(c),this.selectedShapeIndex=this.shapeIndex,s=!0;break}s||(this.selectedShapeIndex=-1,this.annotationTool.redrawFullCanvas()),this.shape&&(this.lastDrawnShape=null,this.startX=e,this.startY=n,this.isDrawing=!0,this.isScale=this.shape.type==="image"?this.isPointerAtCorner(this.shape,e,n):!1,this.isScale?this.annotationTool.canvas.style.cursor="nw-resize":this.annotationTool.canvas.style.cursor="move")}isPointerAtShape(t,e,n){let i=this.annotationTool.deserialize([t])[0];if(i.rotation){let h=this.getShapeBounds(t);if(h){let s=this.getShapeRotationCenter(t,h),l=Math.cos(-i.rotation),c=Math.sin(-i.rotation),u=e-s.x,p=n-s.y;e=s.x+u*l-p*c,n=s.y+u*c+p*l}}return this.annotationTool.pluginForTool(i.type).isPointerAtShape(i,e,n)}isPointerAtCorner(t,e,n){if(!("type"in t))return!1;let i=this.annotationTool.deserialize([t])[0],r=15,h=Math.abs(i.y-n)<r,s=Math.abs(i.x-e)<r,l=Math.abs(i.x+i.width-e)<r,c=Math.abs(i.y+i.height-n)<r;return h&&s||h&&l||c&&s||c&&l}onPointerMove(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);if(this.isDrawing&&this.rotationActive){let l=this.annotationTool.shapes[this.selectedShapeIndex];if(l){let c=this.getShapeBounds(l);if(c){let u=this.getShapeRotationCenter(l,c),p=this.calculateAngle(u.x,u.y,e,n),g=this.rotationShapeStartAngle+(p-this.rotationStartAngle);if(t.shiftKey){let v=Math.PI/12;g=Math.round(g/v)*v}l.rotation=g,this.annotationTool.redrawFullCanvas()}}return}if(this.isDrawing&&this.centerDragActive){let l=this.annotationTool.shapes[this.selectedShapeIndex];l&&(l.rotationCenterX=e/this.annotationTool.canvasWidth,l.rotationCenterY=n/this.annotationTool.canvasHeight,this.annotationTool.redrawFullCanvas());return}if(this.isDrawing&&this.activeHandle&&this.resizeStartBounds){let l=e-this.startX,c=n-this.startY,u=this.annotationTool.shapes[this.selectedShapeIndex];u&&(this.resizeShape(u,this.activeHandle,l,c,this.resizeStartBounds,t.shiftKey),this.annotationTool.redrawFullCanvas());return}if(!this.isDrawing&&this.selectedShapeIndex>=0){if(this.isPointerAtRotationHandle(e,n)){this.annotationTool.canvas.style.cursor="grab";return}if(this.isPointerAtRotationCenter(e,n)){this.annotationTool.canvas.style.cursor="move";return}let l=this.getHandleAtPosition(e,n);if(l){this.annotationTool.canvas.style.cursor=this.getCursorForHandle(l);return}}if(!this.isDrawing||!this.shape){this.isDrawing||(this.annotationTool.canvas.style.cursor="default");return}let i=e-this.startX,r=n-this.startY;this.startX=e-i,this.startY=n-r;let h=this.annotationTool.deserialize([this.shape])[0],s=h.type==="image"?h:JSON.parse(JSON.stringify(h));if(s.type!=="audio-peaks")if(s.type==="image")if(this.isScale){let{width:l,height:c}=s,u=l/c,p=l+i,g=p/u;s.width=p,s.height=g,this.lastDrawnShape=s,this.annotationTool.pluginForTool(s.type).draw(s)}else{let l=this.annotationTool.pluginForTool(s.type).move(s,i,r);this.lastDrawnShape=l,this.annotationTool.pluginForTool(s.type).draw(l)}else{let l=this.annotationTool.pluginForTool(s.type).move(s,i,r);this.lastDrawnShape=l,this.annotationTool.pluginForTool(s.type).draw(l)}}onPointerUp(t){if(this.rotationActive){this.rotationActive=!1,this.isDrawing=!1,this.annotationTool.canvas.style.cursor="default",this.annotationTool.redrawFullCanvas();return}if(this.centerDragActive){this.centerDragActive=!1,this.isDrawing=!1,this.annotationTool.canvas.style.cursor="default",this.annotationTool.redrawFullCanvas();return}if(this.activeHandle){this.activeHandle=null,this.resizeStartBounds=null,this.resizeOriginalShape=null,this.isDrawing=!1,this.annotationTool.canvas.style.cursor="default",this.annotationTool.redrawFullCanvas();return}if(!this.isDrawing||!this.lastDrawnShape){this.isDrawing=!1,this.annotationTool.redrawFullCanvas();return}this.lastDrawnShape&&this.shape&&(this.lastDrawnShape.fillStyle=this.shape.fillStyle,this.lastDrawnShape.strokeStyle=this.shape.strokeStyle,this.lastDrawnShape.lineWidth=this.shape.lineWidth,this.shape.opacity!==void 0&&(this.lastDrawnShape.opacity=this.shape.opacity),this.save(this.lastDrawnShape)),this.isDrawing=!1,this.isScale=!1,this.shape=null,this.lastDrawnShape=null,this.annotationTool.canvas.style.cursor="default",this.annotationTool.redrawFullCanvas()}draw(){throw new Error("Method not implemented.")}reset(){this.isDrawing=!1,this.shape=null,this.isScale=!1,this.lastDrawnShape=null,this.shapeIndex=-1,this.selectedShapeIndex=-1,this.activeHandle=null,this.resizeStartBounds=null,this.resizeOriginalShape=null,this.rotationActive=!1,this.centerDragActive=!1,this.annotationTool.canvas.style.cursor="default"}save(t){this.annotationTool.replaceShape(t,this.shapeIndex)}};var ut=class extends C{constructor(){super(...arguments);this.name="image"}move(t,e,n){return t.x+=e,t.y+=n,t}onPointerDown(t){}onPointerMove(t){}onPointerUp(t){}normalize(t,e,n){return M(T({},t),{x:t.x/e,y:t.y/n,width:t.width/e,height:t.height/n})}draw(t){if(!(t.image instanceof HTMLImageElement)){console.error("Image is not an instance of HTMLImageElement");return}if(t.width===0||t.height===0)return;let e=t.x+t.width/2,n=t.y+t.height/2,i=this.getRotationCenter(t,e,n),r=this.applyRotation(t,i.x,i.y);this.ctx.drawImage(t.image,t.x,t.y,t.width,t.height),r&&this.restoreRotation()}isPointerAtShape(t,e,n){let i=Math.min(t.x,t.x+t.width),r=Math.max(t.x,t.x+t.width),h=Math.min(t.y,t.y+t.height),s=Math.max(t.y,t.y+t.height);return e>=i&&e<=r&&n>=h&&n<=s}};var pt=class extends C{constructor(){super(...arguments);this.name="compare";this.comparisonLine=0;this.leftOpacity=1;this.isDrawing=!1}get rightOpacity(){return this.annotationTool.overlayOpacity}move(t,e,n){return t.x+=e,t}onActivate(){this.comparisonLine=this.annotationTool.canvasWidth/2,this.leftOpacity=1,this.annotationTool.canvas.style.cursor="col-resize"}onDeactivate(){this.annotationTool.canvas.style.cursor="default",this.comparisonLine=0,this.leftOpacity=1,this.isDrawing=!1}normalize(t,e,n){return M(T({},t),{x:t.x/e})}onPointerDown(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.startX=e,this.startY=n,this.isDrawing=!0,this.disablePreviousCompare(),this.onPointerMove(t)}onPointerMove(t){if(!this.isDrawing){if(this.annotationTool.globalShapes.length>0){let i=this.annotationTool.globalShapes[0];if(i.type==="compare"){let r=this.annotationTool.deserialize([i])[0];this.draw(r),this.annotationTool.addFrameSquareOverlay()}}return}let{x:e}=this.annotationTool.getRelativeCoords(t);this.comparisonLine=e;let n={type:"compare",strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth,x:e};this.draw(n),this.drawDelimiter(n)}onPointerUp(){this.isDrawing&&(this.save({type:"compare",strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth,disabled:!1,x:this.comparisonLine}),this.isDrawing=!1)}removePreviousCompare(){this.annotationTool.globalShapes=this.annotationTool.globalShapes.filter(t=>t.type!=="compare")}disablePreviousCompare(){this.annotationTool.globalShapes=this.annotationTool.globalShapes.map(t=>t.type==="compare"?M(T({},t),{disabled:!0}):t)}save(t){this.removePreviousCompare();let e=this.annotationTool.serialize([t])[0];e.x<.05||e.x>.95||this.annotationTool.addGlobalShape(e)}drawDelimiter(t){this.ctx.beginPath(),this.ctx.moveTo(t.x,0),this.ctx.lineTo(t.x,this.annotationTool.canvasWidth),this.ctx.stroke()}drawShape(t){var Bt,Ot,zt,Vt,Wt,Xt,Yt,Nt;let e=this.annotationTool.videoElement,n=this.annotationTool.referenceVideoElement;if(!e||!n)return;let i=this.ctx.globalAlpha,r=this.annotationTool.canvasWidth,h=this.annotationTool.canvasHeight,s=t.x,l=n.videoHeight-e.videoHeight,c=n.videoWidth-e.videoWidth,u=this.annotationTool.isMobile;this.ctx.globalAlpha=this.leftOpacity;let p=(Ot=(Bt=this.annotationTool.referenceVideoFrameBuffer)==null?void 0:Bt.frameNumberFromTime(e.currentTime))!=null?Ot:1,g=p;if(c>e.videoWidth&&l>e.videoHeight&&!this.annotationTool.isMobile){let D=(Xt=(Wt=this.annotationTool.referenceVideoFrameBuffer)==null?void 0:Wt.getFrameNumberBySignature((Vt=(zt=this.annotationTool.videoFrameBuffer)==null?void 0:zt.getAudioFingerprint(p))!=null?Vt:null,p))!=null?Xt:p,G=Math.abs(p-D);G>=1&&G<=3&&(g=D)}let b=(Yt=this.annotationTool.referenceVideoFrameBuffer)==null?void 0:Yt.getFrame(g),y=(Nt=this.annotationTool.videoFrameBuffer)==null?void 0:Nt.getFrame(p);if(u){this.ctx.imageSmoothingQuality="low";let D=s/r,G=s;this.ctx.drawImage(y!=null?y:e,0,0,D*e.videoWidth,e.videoHeight,0,0,G,h)}else{let D=y?y.width:e.videoWidth,G=y?y.height:e.videoHeight;this.ctx.drawImage(y!=null?y:e,0,0,D,G,0,0,r,h)}this.ctx.globalAlpha=this.rightOpacity;let f=0,m=0,x=e.videoWidth/e.videoHeight,w=n.videoWidth/n.videoHeight,S=Math.abs(x-w)>.1,k=10,P=Math.abs(l)>k,A=e.videoWidth,L=e.videoHeight,R=0;if(c<-k)if(S){let D=e.videoWidth/r;R=Math.abs(c/2),R=R/D,R<=k&&(R=0)}else A=n.videoWidth;else c>k&&(A=n.videoWidth);if(l===0)f=0;else if(l>0)S?(f=l/2,f<=k&&(f=0)):L=P?n.videoHeight:e.videoHeight;else if(!S)L=P?n.videoHeight:e.videoHeight;else{m=Math.abs(l/2);let D=e.videoHeight/h;m=m/D,m<=k&&(m=0)}let St=s-R,$t=r-St,ze=$t/r*A;b&&this.rightOpacity>0&&(u&&(this.ctx.imageSmoothingQuality="low"),this.ctx.drawImage(b,St/r*A,f,ze,L,St+R,m,$t,h)),this.ctx.globalAlpha=i}draw(t){if(t.disabled)return;let e=this.annotationTool.videoElement,n=this.annotationTool.referenceVideoElement;!e||!n||this.drawShape(t)}};function cn(a){let o=a[0],t=a[0];for(let e=1;e<a.length;e++)a[e]<o&&(o=a[e]),a[e]>t&&(t=a[e]);return[o,t]}var ft=class extends C{constructor(t){super(t);this.name="audio-peaks";this.canvas=document.createElement("canvas");this.props={peaks:new Int8Array,theme:{waveOutlineColor:"rgba(255,192,203,0.7)",waveFillColor:"grey",waveProgressColor:"orange"},waveHeight:40,bits:16};this.drawCtx=this.canvas.getContext("2d")}onVideoBlobSet(t){return I(this,null,function*(){let e=yield t.arrayBuffer();this.init(e)})}on(t,e){t==="videoBlobSet"&&this.onVideoBlobSet(e)}extractPeaks(t){return I(this,null,function*(){let{default:e}=yield Promise.resolve().then(()=>qe(ke(),1)),n=this.progressBarCoordinates.width,i=Math.ceil(t.length/n);return e(t,i,!0)})}setProps(t){let[e,n]=cn(t.data[0]),i=Math.pow(2,t.bits-1)-1,r=-Math.pow(2,t.bits-1);this.props.peaks=t.data[0].map(h=>h<0?Math.round(h/e*r):Math.round(h/n*i)),this.props.bits=t.bits}init(t){return I(this,null,function*(){try{let n=yield new AudioContext().decodeAudioData(t),i=yield this.extractPeaks(n);this.initCanvas(),this.setProps(i),this.annotationTool.removeGlobalShape("audio-peaks"),this.annotationTool.addGlobalShape({x:0,y:0,strokeStyle:"red",fillStyle:"red",lineWidth:1,type:"audio-peaks"}),this.clearLocalCanvas(),this.drawOnCanvas()}catch(e){this.initCanvas(),this.props.peaks=new Int8Array,this.annotationTool.removeGlobalShape("audio-peaks"),this.clearLocalCanvas(),console.error(e)}})}initCanvas(){this.canvas.width=this.progressBarCoordinates.width*this.pixelRatio,this.canvas.height=this.props.waveHeight*this.pixelRatio,this.drawCtx.scale(this.pixelRatio,this.pixelRatio)}move(t,e,n){return t.x+=e,t.y+=n,t}normalize(t,e,n){return M(T({},t),{x:t.x/e,y:t.y/n})}onPointerDown(t){}onPointerMove(t){}onPointerUp(t){}reset(){this.clearLocalCanvas(),this.props.peaks=new Int8Array,this.annotationTool.removeGlobalShape("audio-peaks")}draw(t){let e=this.annotationTool.videoElement;if(!e||e.tagName!=="VIDEO"||e.muted||e.volume===0)return;this.ctx.clearRect(0,0,this.annotationTool.canvasWidth,this.annotationTool.canvasHeight);let{waveHeight:i,theme:r}=this.props,h=this.ctx,s=i/2,l=this.progressBarCoordinates.y-20,{x:c,width:u}=this.progressBarCoordinates,p=this.annotationTool.playbackFrame,g=this.annotationTool.totalFrames,v=Math.ceil(p/g*u)+c;this.ctx.drawImage(this.canvas,c,l,u,i),h.fillStyle=r.waveProgressColor,h.fillRect(v,l+0,1,s*2)}get pixelRatio(){return this.annotationTool.pixelRatio}get progressBarCoordinates(){return this.annotationTool.progressBarCoordinates}clearLocalCanvas(){this.drawCtx.clearRect(0,0,this.canvas.width,this.canvas.height)}drawOnCanvas(){let{peaks:t,bits:e,waveHeight:n,theme:i}=this.props,r=this.drawCtx,h=0,s=0,l=n/2,c=O(2,e-1),u=0,p=t.length;r.fillStyle=i.waveOutlineColor;for(let g=0;g<p;g+=1){let v=t[(g+h)*2+1]/c,b=Math.abs(v*l);r.fillRect(g+s,u+0+l-b,1,b)}}};var gt=class extends C{constructor(){super(...arguments);this.name="selection";this.selectedArea=null}move(t,e,n){return t.x+=e,t.y+=n,t}normalize(t,e,n){return M(T({},t),{x:t.x/e,y:t.y/n,width:t.width/e,height:t.height/n})}onPointerDown(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.startX=e,this.startY=n,this.isDrawing=!0,this.selectedArea=null}onPointerMove(t){if(!this.isDrawing)return;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.annotationTool.clearCanvas(),this.annotationTool.globalShapes.length>0?this.annotationTool.drawShapesOverlay():this.annotationTool.addVideoOverlay(),this.drawSelectionRect(this.startX,this.startY,e-this.startX,n-this.startY)}onPointerUp(t){if(!this.isDrawing)return;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t),i=Math.min(e,this.startX),r=Math.min(n,this.startY),h=Math.abs(e-this.startX),s=Math.abs(n-this.startY);if(h<1||s<1){this.isDrawing=!1,this.annotationTool.redrawFullCanvas();return}let l=document.createElement("canvas"),c=l.getContext("2d"),u=this.annotationTool.videoElement;if(!(u instanceof HTMLVideoElement))return;let p=u.videoWidth/u.videoHeight,g=this.annotationTool.canvasWidth/this.annotationTool.canvasHeight,v=this.annotationTool.canvasWidth,b=this.annotationTool.canvasHeight,y=0,f=0;p>g?(b=this.annotationTool.canvasWidth/p,f=(this.annotationTool.canvasHeight-b)/2):(v=this.annotationTool.canvasHeight*p,y=(this.annotationTool.canvasWidth-v)/2);let m=u.videoWidth/v,x=u.videoHeight/b,w=(i-y)*m,E=(r-f)*x,S=h*m,k=s*x;l.width=Math.max(1,S),l.height=Math.max(1,k);try{c.drawImage(this.annotationTool.videoElement,w,E,S,k,0,0,S,k);let P=c.getImageData(0,0,l.width,l.height);this.selectedArea=P;let A=document.createElement("canvas");A.width=S+4,A.height=k+4,A.style.width=`${h+4}px`,A.style.height=`${s+4}px`;let L=A.getContext("2d");L.strokeStyle="black",L.lineWidth=2,L.strokeRect(1,1,S+2,k+2),L.strokeStyle="black",L.lineWidth=2,L.strokeRect(2,2,S,k),L.putImageData(P,2,2);let R=new Image;R.onload=()=>{this.annotationTool.pluginForTool("image").save({type:"image",x:i-2,y:r-2,width:h+4,height:s+4,image:R,strokeStyle:"transparent",fillStyle:"transparent",lineWidth:0}),this.isDrawing=!1,this.selectedArea=null,this.annotationTool.redrawFullCanvas()},R.src=A.toDataURL(),this.annotationTool.currentTool="move"}catch(P){console.error("Error capturing selection:",P),this.isDrawing=!1,this.annotationTool.redrawFullCanvas();return}}drawSelectionRect(t,e,n,i){var g,v,b;let r=Math.min(t,t+n),h=Math.min(e,e+i),s=Math.abs(n),l=Math.abs(i),c=this.annotationTool.pixelRatio,u=null;if(s>0&&l>0)try{u=this.ctx.getImageData(r*c,h*c,s*c,l*c)}catch(y){u=null}if(this.ctx.fillStyle="rgba(0, 0, 0, 0.5)",this.ctx.fillRect(0,0,this.annotationTool.canvasWidth,this.annotationTool.canvasHeight),u&&s>0&&l>0)this.ctx.putImageData(u,r*c,h*c);else if(s>0&&l>0){let y=this.annotationTool.videoElement;if(y instanceof HTMLVideoElement){let f=(g=this.annotationTool.videoFrameBuffer)==null?void 0:g.frameNumberFromTime(y.currentTime),m=(b=(v=this.annotationTool.videoFrameBuffer)==null?void 0:v.getFrame(f||0))!=null?b:y,x=m?m.width:y.videoWidth,w=m?m.height:y.videoHeight,E=x/this.annotationTool.canvasWidth,S=w/this.annotationTool.canvasHeight;this.ctx.drawImage(m,r*E,h*S,s*E,l*S,r,h,s,l)}}this.ctx.beginPath();let p=this.ctx.strokeStyle;this.ctx.strokeStyle="#ffffff",this.ctx.lineWidth=2,this.ctx.setLineDash([5,5]),this.ctx.strokeRect(r,h,s,l),this.ctx.setLineDash([]),this.ctx.strokeStyle=p}draw(t){this.drawSelectionRect(t.x,t.y,t.width,t.height)}reset(){super.reset(),this.selectedArea=null}isPointerAtShape(t,e,n){let i=Math.min(t.x,t.x+t.width),r=Math.max(t.x,t.x+t.width),h=Math.min(t.y,t.y+t.height),s=Math.max(t.y,t.y+t.height);return e>=i&&e<=r&&n>=h&&n<=s}};var Me=[nt,ot,st,lt,ht,ct,rt,dt,ut,pt,ft,gt];function Ie(a,o){let t,e,n,i=[],r=!0,h=!1;function s(u,p){if(h)return;let g=Math.abs(p.mediaTime-t),v=Math.abs(p.presentedFrames-e),b=g/v;b&&b<1&&r&&i.length<50&&a.playbackRate===1&&document.hasFocus()&&(i.push(b),n=Math.round(1/c()),o(n,i.length*2)),r=!0,t=p.mediaTime,e=p.presentedFrames,h||a.requestVideoFrameCallback(s)}a.requestVideoFrameCallback(s);let l=()=>{i.pop(),r=!1};a.addEventListener("seeked",l);function c(){return i.reduce((u,p)=>u+p)/i.length}return()=>{h=!0,a.removeEventListener("seeked",l)}}var yt=class yt extends Array{constructor(...o){super(...o),this.id=yt.nextId++}};yt.nextId=0;var Mt=yt,Pe=new Map;function dn(a,o){return`${Math.min(a.id,o.id)}-${Math.max(a.id,o.id)}`}function It(a,o){let t=dn(a,o),e=Pe.get(t);if(e!==void 0)return e;if(a.length===0||o.length===0)return 0;let n=Math.min(a.length,o.length),i=0,r=0;for(let p=0;p<n;p++)i+=a[p],r+=o[p];i/=n,r/=n;let h=0,s=0,l=0;for(let p=0;p<n;p++){let g=a[p]-i,v=o[p]-r;h+=g*v,s+=g*g,l+=v*v}let c=Math.sqrt(s*l),u=c===0?0:(h/c+1)/2;return Pe.set(t,u),u}var Fe=128,vt=class{constructor(o,t){this.video=o;this.fps=t;this.audioContext=null;this.audioBuffer=null;this.fingerprints=new Map;this.isInitialized=!1;this.initPromise=null}init(){return I(this,null,function*(){if(!this.isInitialized)return this.initPromise?this.initPromise:(this.initPromise=this.doInit(),this.initPromise)})}doInit(){return I(this,null,function*(){try{let e=yield(yield(yield fetch(this.video.currentSrc||this.video.src)).blob()).arrayBuffer();this.audioContext=new AudioContext,this.audioBuffer=yield this.audioContext.decodeAudioData(e),this.isInitialized=!0}catch(o){console.warn("Could not extract audio for fingerprinting:",o),this.isInitialized=!0,this.audioBuffer=null}})}hasAudio(){return this.audioBuffer!==null}get totalFrames(){return Math.round(this.video.duration*this.fps)}extractFingerprint(o){if(!this.audioBuffer)return null;let t=(o-1)/this.fps,e=1/this.fps,n=this.audioBuffer.sampleRate,i=Math.floor(t*n),h=Math.floor((t+e)*n)-i;if(h<=0||i>=this.audioBuffer.length)return null;let s=this.audioBuffer.getChannelData(0),l=new Mt,c=Math.max(1,Math.floor(h/Fe));for(let u=0;u<Fe;u++){let p=i+u*c,g=Math.min(p+c,this.audioBuffer.length),v=0,b=0;for(let f=p;f<g;f++)f<s.length&&(v+=s[f]*s[f],b++);let y=b>0?Math.sqrt(v/b):0;l.push(y)}return l}getFingerprint(o){if(this.fingerprints.has(o))return this.fingerprints.get(o);let t=this.extractFingerprint(o);return t&&this.fingerprints.set(o,t),t}extractRange(o,t){for(let e=o;e<=t;e++)this.getFingerprint(e)}setFingerprint(o,t){this.fingerprints.set(o,t)}findBestMatch(o,t,e=3){if(!o||!(this.fingerprints.size>0)&&!this.hasAudio())return t;let i=0,r=t,h=Math.max(1,t-e),s=Math.min(this.totalFrames,t+e);for(let l=h;l<=s;l++){let c=this.getFingerprint(l);if(c){let u=It(o,c);u>i&&(i=u,r=l)}}return r}destroy(){this.fingerprints.clear(),this.audioContext&&(this.audioContext.close().catch(()=>{}),this.audioContext=null),this.audioBuffer=null,this.isInitialized=!1,this.initPromise=null}};var Ae=64,W=class{constructor(o,t,e=!0){this.isDestroyed=!1;this.autoHide=!0;this.isMobile=!1;this.audioExtractor=null;this.audioInitPromise=null;this.seenFrames=0;this.isCanvasSizeSet=!1;this.frames=new Map;this.audioFingerprints=new Map;this.video=o,this.fps=t,this.autoHide=e,this.createCanvas(),this.createTransformCanvas()}createTransformCanvas(){this.transformCanvas=document.createElement("canvas"),this.transformCanvasCtx=this.canvas.getContext("2d",{willReadFrequently:!0,alpha:!1}),this.transformCanvas.width=Ae,this.transformCanvas.height=Ae}initAudioSync(){return I(this,null,function*(){var o;return this.audioExtractor?(o=this.audioInitPromise)!=null?o:Promise.resolve():(this.audioExtractor=new vt(this.video,this.fps),this.audioInitPromise=this.audioExtractor.init(),this.audioInitPromise)})}hasAudioSync(){var o,t;return(t=(o=this.audioExtractor)==null?void 0:o.hasAudio())!=null?t:!1}start(){this.addRequestFrameCallback(),this.isMobile||this.initAudioSync().catch(()=>{})}destroy(){this.isDestroyed=!0,this.frames.forEach(o=>o.close()),this.frames.clear(),this.audioFingerprints.clear(),this.audioExtractor&&(this.audioExtractor.destroy(),this.audioExtractor=null),this.audioInitPromise=null}tick(o,t){if(this.setCanvasSize(),t.expectedDisplayTime-performance.now()>10,this.isDestroyed)return!1;if(this.seenFrames>=this.totalFrames){if(this.autoHide)try{this.video.paused||this.video.pause(),this.video.style.display="none"}catch(h){}return!1}if(this.video.videoWidth===0||this.video.videoHeight===0)return!0;let n=this.video,i=this.frameNumberFromTime(t.mediaTime);if(!Math.max(1,t.presentedFrames>this.totalFrames?t.presentedFrames%this.totalFrames:t.presentedFrames))throw new Error("expectedFrame is 0");if(this.hasFrame(i))this.seenFrames++;else{this.ctx.drawImage(n,0,0,this.width,this.height,0,0,this.width,this.height);let h=this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height);createImageBitmap(h,0,0,this.width,this.height).then(s=>I(this,null,function*(){var l;if(this.setFrame(i,s),!this.isMobile&&((l=this.audioExtractor)!=null&&l.hasAudio())){let c=this.audioExtractor.getFingerprint(i);c&&this.setAudioFingerprint(i,c)}}))}return!0}addRequestFrameCallback(){this.isDestroyed||this.video.requestVideoFrameCallback((o,t)=>{this.tick(o,t)&&this.addRequestFrameCallback()})}createCanvas(){this.canvas=document.createElement("canvas"),this.ctx=this.canvas.getContext("2d",{willReadFrequently:!0,alpha:!1})}setCanvasSize(){this.isCanvasSizeSet||(this.canvas.width=this.video.videoWidth,this.canvas.height=this.video.videoHeight,this.isCanvasSizeSet=!0)}get width(){return this.video.videoWidth}get height(){return this.video.videoHeight}hasFrame(o){return this.frames.has(o)}getFrame(o){return this.frames.has(o)?this.frames.get(o):null}getFrameNumberBySignature(o,t){if(!o)return t;let e=0,n=t;return[t-3,t-2,t-1,t,t+1,t+2,t+3].filter(r=>r>0&&r<=this.totalFrames).forEach(r=>{let h=this.getAudioFingerprint(r);if(h){let s=It(o,h);s>e&&(e=s,n=r)}}),n}setFrame(o,t){this.frames.set(o,t)}setAudioFingerprint(o,t){this.audioFingerprints.set(o,t)}getAudioFingerprint(o){var t;if(this.audioFingerprints.has(o))return this.audioFingerprints.get(o);if((t=this.audioExtractor)!=null&&t.hasAudio()){let e=this.audioExtractor.getFingerprint(o);if(e)return this.audioFingerprints.set(o,e),e}return null}get totalFrames(){return Math.round(this.video.duration*this.fps)}frameNumberFromTime(o){return Math.max(1,Math.round(o*this.fps))}};var X={layout:"horizontal",mobile:{collapsibleToolbars:!0,gesturesEnabled:!0,autoCollapse:!0,breakpoint:960},theme:"dark",toolbar:{draggable:!1,sidebarPosition:"left"},features:{showThemeToggle:!0,showFullscreen:!0,showProgressBar:!0,showFrameCounter:!0}};function Le(a){var o,t;return a?{layout:(o=a.layout)!=null?o:X.layout,theme:(t=a.theme)!=null?t:X.theme,mobile:T(T({},X.mobile),a.mobile),toolbar:T(T({},X.toolbar),a.toolbar),features:T(T({},X.features),a.features)}:T({},X)}var J=class{constructor(o){this.tool=o;this.currentRenderer=null;this.rootElement=null;this.prefix=_()}getRootElement(){if(!this.rootElement){let o=this.tool.canvas;o!=null&&o.parentElement&&(this.rootElement=o.parentElement,this.rootElement.classList.add(`${this.prefix}-root`))}return this.rootElement}clearLayoutClasses(){let o=this.getRootElement();o&&o.classList.remove(`${this.prefix}-layout-horizontal`,`${this.prefix}-layout-vertical`,`${this.prefix}-layout-minimal`,`${this.prefix}-layout-bottom-dock`,`${this.prefix}-sidebar-right`)}setLayout(o,t){this.currentRenderer&&this.currentRenderer.cleanup(),this.clearLayoutClasses();let e=this.getRootElement();e&&(e.classList.add(`${this.prefix}-layout-${o}`),o==="vertical"&&(t==null?void 0:t.sidebarPosition)==="right"&&e.classList.add(`${this.prefix}-sidebar-right`)),this.currentRenderer=this.createRenderer(o),this.currentRenderer.apply(this.tool)}getCurrentLayout(){var o,t;return(t=(o=this.currentRenderer)==null?void 0:o.name)!=null?t:null}createRenderer(o){switch(o){case"horizontal":return new Pt;case"vertical":return new Ft;case"minimal":return new At;case"bottom-dock":return new Lt}}destroy(){this.currentRenderer&&(this.currentRenderer.cleanup(),this.currentRenderer=null),this.clearLayoutClasses(),this.rootElement=null}},Pt=class{constructor(){this.name="horizontal"}apply(o){}cleanup(){}},Ft=class{constructor(){this.name="vertical"}apply(o){}cleanup(){}},At=class{constructor(){this.name="minimal";this.dragState={isDragging:!1,startX:0,startY:0,offsetX:0,offsetY:0};this.container=null;this.boundHandlers={};this.prefix=_()}apply(o){var e;if(this.container=o.uiContainer,!this.container)return;this.boundHandlers.mousedown=this.handleMouseDown.bind(this),this.boundHandlers.mousemove=this.handleMouseMove.bind(this),this.boundHandlers.mouseup=this.handleMouseUp.bind(this),this.container.addEventListener("mousedown",this.boundHandlers.mousedown),document.addEventListener("mousemove",this.boundHandlers.mousemove),document.addEventListener("mouseup",this.boundHandlers.mouseup);let t=o.config;(e=t==null?void 0:t.toolbar)!=null&&e.position&&(this.container.style.left=`${t.toolbar.position.x}px`,this.container.style.top=`${t.toolbar.position.y}px`)}cleanup(){this.container&&this.boundHandlers.mousedown&&this.container.removeEventListener("mousedown",this.boundHandlers.mousedown),this.boundHandlers.mousemove&&document.removeEventListener("mousemove",this.boundHandlers.mousemove),this.boundHandlers.mouseup&&document.removeEventListener("mouseup",this.boundHandlers.mouseup),this.container&&(this.container.style.left="",this.container.style.top=""),this.container=null,this.boundHandlers={}}handleMouseDown(o){if(!this.container||o.target.closest("button, input"))return;this.dragState.isDragging=!0,this.dragState.startX=o.clientX,this.dragState.startY=o.clientY;let t=this.container.getBoundingClientRect();this.dragState.offsetX=t.left,this.dragState.offsetY=t.top,this.container.classList.add(`${this.prefix}-dragging`),o.preventDefault()}handleMouseMove(o){if(!this.dragState.isDragging||!this.container)return;let t=o.clientX-this.dragState.startX,e=o.clientY-this.dragState.startY;this.container.style.left=`${this.dragState.offsetX+t}px`,this.container.style.top=`${this.dragState.offsetY+e}px`}handleMouseUp(){this.container&&(this.dragState.isDragging=!1,this.container.classList.remove(`${this.prefix}-dragging`))}},Lt=class{constructor(){this.name="bottom-dock";this.movedElements=[]}apply(o){let t=o.uiContainer,e=o.playerControlsContainer;if(t&&e)for(;e.firstChild;){let n=e.firstChild;this.movedElements.push(n),t.appendChild(n)}}cleanup(){this.movedElements=[]}};var xt=class{constructor(o,t=!0){this.container=o;this.autoCollapse=t;this.isCollapsed=!1;this.collapseButton=null;this.prefix=_()}init(){this.container.classList.add(`${this.prefix}-collapsible`),this.createCollapseButton()}createCollapseButton(){var o;this.collapseButton=document.createElement("button"),this.collapseButton.type="button",this.collapseButton.classList.add(`${this.prefix}-collapse-btn`),this.collapseButton.setAttribute("aria-label","Toggle toolbar"),this.collapseButton.setAttribute("data-tooltip","Toggle toolbar"),this.updateButtonIcon(),this.collapseButton.addEventListener("click",t=>{t.stopPropagation(),this.toggle()}),(o=this.container.parentElement)==null||o.insertBefore(this.collapseButton,this.container.nextSibling)}updateButtonIcon(){this.collapseButton&&(this.collapseButton.innerHTML=`
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="18 15 12 9 6 15"/>
      </svg>
    `)}collapse(){this.isCollapsed||(this.isCollapsed=!0,this.container.classList.add(`${this.prefix}-collapsed`))}expand(){this.isCollapsed&&(this.isCollapsed=!1,this.container.classList.remove(`${this.prefix}-collapsed`))}toggle(){this.isCollapsed?this.expand():this.collapse()}get collapsed(){return this.isCollapsed}get autoCollapseEnabled(){return this.autoCollapse}setAutoCollapse(o){this.autoCollapse=o}destroy(){this.collapseButton&&(this.collapseButton.remove(),this.collapseButton=null),this.container.classList.remove(`${this.prefix}-collapsible`,`${this.prefix}-collapsed`)}};var Z=class{constructor(o,t){this.canvas=o;this.onGestureChange=t;this.initialDistance=0;this.initialScale=1;this.currentScale=1;this.panStart={x:0,y:0};this.panOffset={x:0,y:0};this.isGesturing=!1;this.activeTouches=0;this.minScale=.5;this.maxScale=3;this.handleTouchStart=o=>{this.activeTouches=o.touches.length,o.touches.length===2&&(o.preventDefault(),this.isGesturing=!0,this.initialDistance=this.getDistance(o.touches[0],o.touches[1]),this.initialScale=this.currentScale,this.panStart=this.getMidpoint(o.touches[0],o.touches[1]))};this.handleTouchMove=o=>{if(o.touches.length===2&&this.isGesturing){o.preventDefault();let e=this.getDistance(o.touches[0],o.touches[1])/this.initialDistance;this.currentScale=Math.max(this.minScale,Math.min(this.maxScale,this.initialScale*e));let n=this.getMidpoint(o.touches[0],o.touches[1]);this.panOffset={x:this.panOffset.x+(n.x-this.panStart.x),y:this.panOffset.y+(n.y-this.panStart.y)},this.panStart=n,this.onGestureChange(this.getState())}};this.handleTouchEnd=o=>{this.activeTouches=o.touches.length,o.touches.length<2&&(this.isGesturing=!1,o.touches.length===1&&(this.panStart={x:o.touches[0].clientX,y:o.touches[0].clientY}))}}init(){this.canvas.addEventListener("touchstart",this.handleTouchStart,{passive:!1}),this.canvas.addEventListener("touchmove",this.handleTouchMove,{passive:!1}),this.canvas.addEventListener("touchend",this.handleTouchEnd,{passive:!1}),this.canvas.addEventListener("touchcancel",this.handleTouchEnd,{passive:!1})}getDistance(o,t){let e=t.clientX-o.clientX,n=t.clientY-o.clientY;return Math.sqrt(e*e+n*n)}getMidpoint(o,t){return{x:(o.clientX+t.clientX)/2,y:(o.clientY+t.clientY)/2}}getState(){return{scale:this.currentScale,panX:this.panOffset.x,panY:this.panOffset.y}}isActive(){return this.isGesturing}hasTwoFingers(){return this.activeTouches>=2}reset(){this.currentScale=1,this.panOffset={x:0,y:0},this.initialScale=1,this.initialDistance=0,this.isGesturing=!1,this.onGestureChange(this.getState())}setScale(o){this.currentScale=Math.max(this.minScale,Math.min(this.maxScale,o)),this.onGestureChange(this.getState())}setPan(o,t){this.panOffset={x:o,y:t},this.onGestureChange(this.getState())}destroy(){this.canvas.removeEventListener("touchstart",this.handleTouchStart),this.canvas.removeEventListener("touchmove",this.handleTouchMove),this.canvas.removeEventListener("touchend",this.handleTouchEnd),this.canvas.removeEventListener("touchcancel",this.handleTouchEnd)}};var un=window.devicePixelRatio||1,Re=25,B=class extends et{constructor(t,e){super();this.referenceVideoFrameBuffer=null;this.videoFrameBuffer=null;this.isMouseDown=!1;this.buttons=[];this.plugins=[];this.annotatedFrameCoordinates=[];this.videoBlobUrl=null;this.referenceVideoBlobUrl=null;this.frameCounterTimeoutId=null;this._enforcedTotalFrames=null;this.isCursorOverCanvas=!1;this.overlayOpacity=.7;this._theme="dark";this.themeChangeListeners=[];this.layoutManager=null;this.collapseController=null;this.gestureHandler=null;this.gestureState={scale:1,panX:0,panY:0};this.fps=Re;this.plannedFn=null;this.ct=0;this.isCanvasInitialized=!1;this.enforcedCanvasSize=null;this.lastNavigatedFrame=0;this.isProgressBarNavigation=!1;this.isAnnotationsAsVideoActive=!1;this.config=Le(e),this._theme=this.config.theme,this.plugins=Me.map(n=>new n(this)),this.init(t)}prevFrame(){let e=this.playbackFrame-1;e<1?this.playbackFrame=this.totalFrames:this.playbackFrame=e}nextFrame(){let e=this.playbackFrame+1;e>this.totalFrames?this.playbackFrame=1:this.playbackFrame=e}getAnnotatedFrames(){let t=[];return this.timeStack.forEach((e,n)=>{e&&e.length>0&&t.push(n)}),t.sort((e,n)=>e-n)}prevAnnotatedFrame(){let t=this.getAnnotatedFrames();if(t.length===0)return;let e=this.playbackFrame;for(let n=t.length-1;n>=0;n--)if(t[n]<e){this.playbackFrame=t[n];return}this.playbackFrame=t[t.length-1]}nextAnnotatedFrame(){let t=this.getAnnotatedFrames();if(t.length===0)return;let e=this.playbackFrame;for(let n of t)if(n>e){this.playbackFrame=n;return}this.playbackFrame=t[0]}get theme(){return this._theme}setTheme(t){this._theme=t,Et(t),this.themeChangeListeners.forEach(e=>e(t))}onThemeChange(t){return this.themeChangeListeners.push(t),()=>{let e=this.themeChangeListeners.indexOf(t);e!==-1&&this.themeChangeListeners.splice(e,1)}}setLayout(t){this.layoutManager||(this.layoutManager=new J(this)),this.layoutManager.setLayout(t,{sidebarPosition:this.config.toolbar.sidebarPosition})}getLayout(){var t,e;return(e=(t=this.layoutManager)==null?void 0:t.getCurrentLayout())!=null?e:this.config.layout}collapseToolbar(){var t;(t=this.collapseController)==null||t.collapse()}expandToolbar(){var t;(t=this.collapseController)==null||t.expand()}toggleToolbar(){var t;(t=this.collapseController)==null||t.toggle()}isToolbarCollapsed(){var t,e;return(e=(t=this.collapseController)==null?void 0:t.collapsed)!=null?e:!1}setGesturesEnabled(t){t&&!this.gestureHandler?(this.gestureHandler=new Z(this.canvas,e=>{this.applyGestureTransform(e)}),this.gestureHandler.init()):!t&&this.gestureHandler&&(this.gestureHandler.destroy(),this.gestureHandler=null,this.resetZoom())}isGesturesEnabled(){return this.gestureHandler!==null}resetZoom(){var t;this.gestureState={scale:1,panX:0,panY:0},(t=this.gestureHandler)==null||t.reset(),this.redrawFullCanvas()}getZoomScale(){return this.gestureState.scale}applyGestureTransform(t){this.gestureState=t,this.redrawFullCanvas()}removeGlobalShape(t){this.globalShapes=this.globalShapes.filter(e=>e.type!==t)}addGlobalShape(t){this.globalShapes.push(t)}get selectedColor(){return this.colorPicker.value}get selectedStrokeSize(){return this.strokeSizePicker.valueAsNumber}get currentTool(){return this._currentTool}set currentTool(t){let e=this._currentTool;e&&(this.getButtonForTool(e).classList.remove("active"),this.pluginForTool(e).onDeactivate()),this._currentTool=t,this.canvas.style.cursor=t?"pointer":"default",t&&(this.getButtonForTool(t).classList.add("active"),this.pluginForTool(t).onActivate())}enableFrameRateDetection(){if(this.destructors.find(n=>n.name==="frameRateDetector"))return;let t=this.videoElement;if(t.tagName==="IMG")return;let e=Ie(t,n=>{this.fps=n});Object.defineProperty(e,"name",{value:"frameRateDetector"}),this.destructors.push(e)}timeToFrame(t){return Math.max(1,Math.round(t*this.fps))}get playbackFrame(){return this.videoElement instanceof HTMLImageElement?1:this.timeToFrame(this.videoElement.currentTime)}set playbackFrame(t){if(this.videoElement instanceof HTMLImageElement)return;let e=t/this.fps;this.videoElement.currentTime=e,this.rvf(()=>{this.show()})}rvf(t){this.plannedFn=t}get canvasWidth(){var t,e;return(e=(t=this.enforcedCanvasSize)==null?void 0:t.width)!=null?e:0}get canvasHeight(){var t,e;return(e=(t=this.enforcedCanvasSize)==null?void 0:t.height)!=null?e:0}get aspectRatio(){return this.canvasHeight===0?0:this.canvasWidth/this.canvasHeight}get isMobile(){var e,n,i;let t=(i=(n=(e=this.config)==null?void 0:e.mobile)==null?void 0:n.breakpoint)!=null?i:960;return window.innerWidth<t}get progressBarCoordinates(){let t=this.isMobile?30:10,e=5,i=this.canvasWidth-e-55,r=e,h=this.canvasHeight-t;return{x:r,y:h,width:i,height:t}}get shapes(){return this.timeStack.has(this.activeTimeFrame)||this.timeStack.set(this.activeTimeFrame,[]),this.timeStack.get(this.activeTimeFrame)}set shapes(t){this.timeStack.set(this.activeTimeFrame,t)}get undoStack(){return this.undoTimeStack.has(this.activeTimeFrame)||this.undoTimeStack.set(this.activeTimeFrame,[]),this.undoTimeStack.get(this.activeTimeFrame)}set undoStack(t){this.undoTimeStack.set(this.activeTimeFrame,t)}get pixelRatio(){return un}setVideoBlob(n){return I(this,arguments,function*(t,e=this.fps){this.videoBlobUrl&&URL.revokeObjectURL(this.videoBlobUrl);let i=URL.createObjectURL(t);this.videoBlobUrl=i,yield this.setVideoUrl(i,e),this.plugins.forEach(r=>{r.on("videoBlobSet",t)})})}setVideoUrl(n){return I(this,arguments,function*(t,e=this.fps){if(this.videoElement instanceof HTMLImageElement)return;let i=this.videoElement;i.src=t.toString(),yield this.videoElement.load(),this.setFrameRate(e),this.videoFrameBuffer&&(this.videoFrameBuffer.destroy(),this.videoFrameBuffer=new W(i,e,!1),this.videoFrameBuffer.isMobile=this.isMobile),this.setCanvasSize()})}enableVideoFrameBuffer(){this.videoElement instanceof HTMLImageElement||(this.videoFrameBuffer=new W(this.videoElement,this.fps,!1),this.videoFrameBuffer.isMobile=this.isMobile)}hide(){this.stopAnnotationsAsVideo(),this.hideControls(),this.hideCanvas()}showControls(){this.uiContainer.style.display=""}hideControls(){this.uiContainer.style.display="none"}showCanvas(){this.canvas.style.display="block"}hideCanvas(){this.canvas.style.display="none"}updateActiveTimeFrame(t=void 0){this.activeTimeFrame=t?this.timeToFrame(t):this.playbackFrame}show(){this.stopAnnotationsAsVideo(),this.updateActiveTimeFrame(),this.showCanvas(),this.showControls(),this.redrawFullCanvas()}setCanvasSettings(){this.ctx.strokeStyle=this.selectedColor,this.ctx.fillStyle=this.selectedColor,this.ctx.lineWidth=this.selectedStrokeSize}pluginForTool(t){if(this.isDestroyed)throw new Error("AnnotationTool is destroyed");let e=this.plugins.find(n=>n.name===t);if(!e)throw new Error(`No plugin found for tool ${t}`);return e}getButtonForTool(t){return this.buttons.find(e=>e.dataset.tool===t)}bindContext(){this.handleMouseDown=this.handleMouseDown.bind(this),this.handleMouseMove=this.handleMouseMove.bind(this),this.handleMouseUp=this.handleMouseUp.bind(this),this.setCanvasSize=this.setCanvasSize.bind(this),this.onKeyDown=this.onKeyDown.bind(this)}initProperties(){this.isDestroyed=!1,this.isProgressBarNavigation=!1,this.shapes=[],this.globalShapes=[],this.currentTool=this.isMobile?null:"curve",Et(this._theme),this.layoutManager=new J(this),this.layoutManager.setLayout(this.config.layout,{sidebarPosition:this.config.toolbar.sidebarPosition}),this.isMobile&&this.config.mobile.collapsibleToolbars&&(this.collapseController=new xt(this.uiContainer,this.config.mobile.autoCollapse),this.collapseController.init()),this.isMobile&&this.config.mobile.gesturesEnabled&&(this.gestureHandler=new Z(this.canvas,t=>{this.applyGestureTransform(t)}),this.gestureHandler.init())}setVideoStyles(){this.videoElement.style.objectFit="cover",this.videoElement.style.objectPosition="left top"}get frameCallbackSupported(){return"requestVideoFrameCallback"in HTMLVideoElement.prototype}initFrameCounter(){if(!this.frameCallbackSupported){this.frameCounterTimeoutId=setTimeout(()=>{var t;this.isDestroyed||((t=this.plannedFn)==null||t.call(this),this.plannedFn=null,this.initFrameCounter(),this.updateActiveTimeFrame(),this.playAnnotationsAsVideo())},1e3/this.fps);return}this.withVideo(t=>{t.requestVideoFrameCallback((e,n)=>{var i,r;this.isCanvasInitialized||this._setCanvasSize(),(i=this.videoFrameBuffer)==null||i.tick(e,n),(r=this.plannedFn)==null||r.call(this),this.plannedFn=null,this.raf(()=>{this.initFrameCounter(),this.updateActiveTimeFrame(n.mediaTime),this.playAnnotationsAsVideo()})})})}init(t){this.videoElement=t,this.setVideoStyles(),this.initFrameCounter(),this.bindContext(),this.initCanvas(),this.initUI(),this.initProperties(),this.setCanvasSize()}onKeyDown(t){(t.ctrlKey||t.metaKey)&&t.key.toLowerCase()==="z"&&this.handleUndo()}handleUndo(){this.undoStack.length>0&&(this.shapes=this.undoStack.pop(),this.redrawFullCanvas())}destroy(){var i,r,h,s,l,c,u,p,g,v,b;if(this.isDestroyed)return;super.destroy(),this.stopAnnotationsAsVideo(),this.frameCounterTimeoutId&&(clearTimeout(this.frameCounterTimeoutId),this.frameCounterTimeoutId=null),this.videoBlobUrl&&(URL.revokeObjectURL(this.videoBlobUrl),this.videoBlobUrl=null),this.referenceVideoBlobUrl&&(URL.revokeObjectURL(this.referenceVideoBlobUrl),this.referenceVideoBlobUrl=null),this.currentTool=null,this.plugins.forEach(y=>y.reset()),this.annotatedFrameCoordinates=[],this.setFrameRate(Re);let t=this.strokeSizePicker.parentElement;if((i=t==null?void 0:t.parentNode)==null||i.removeChild(t),this.referenceVideoElement){let y=this.referenceVideoElement.parentElement;(r=y==null?void 0:y.parentNode)==null||r.removeChild(y),this.referenceVideoElement=null}let e=this.colorPicker.parentElement;(h=e==null?void 0:e.parentNode)==null||h.removeChild(e),this.buttons.forEach(y=>{var f;(f=y.parentNode)==null||f.removeChild(y)}),this.buttons=[],(s=this.uiContainer.parentNode)==null||s.removeChild(this.uiContainer),(l=this.canvas.parentNode)==null||l.removeChild(this.canvas),(c=this.playerControlsContainer.parentElement)==null||c.removeChild(this.playerControlsContainer),["strokeSizePicker","colorPicker","uiContainer","playerControlsContainer","canvas","ctx","videoElement"].forEach(y=>{delete this[y]}),this.activeTimeFrame=0,this.isDestroyed=!0,(u=this.referenceVideoFrameBuffer)==null||u.destroy(),this.referenceVideoFrameBuffer=null,(p=this.videoFrameBuffer)==null||p.destroy(),this.videoFrameBuffer=null,(g=this.layoutManager)==null||g.destroy(),this.layoutManager=null,(v=this.collapseController)==null||v.destroy(),this.collapseController=null,(b=this.gestureHandler)==null||b.destroy(),this.gestureHandler=null,this.gestureState={scale:1,panX:0,panY:0}}_setCanvasSize(){let t=getComputedStyle(this.videoElement),e=parseInt(t.width,10),n=this.videoElement,i=n.videoWidth/n.videoHeight;if(isNaN(e)||!n.videoWidth||!n.videoHeight)return this.isCanvasInitialized=!1,this.setCanvasSettings(),!1;let r=n.parentElement,h=!!document.fullscreenElement,s=Math.min(e,n.videoWidth),l=Math.floor(s/i);if(h&&r){let v=window.innerWidth,b=window.innerHeight-90;v/b>i?(l=b,s=l*i):(s=v,l=s/i),n.style.width=`${s}px`,n.style.height=`${l}px`,n.style.marginTop="40px",n.style.marginBottom="50px"}else n.style.width=`${s}px`,n.style.height=`${l}px`,n.style.marginTop="",n.style.marginBottom="";this.isCanvasInitialized=n.videoWidth>0&&n.videoHeight>0,this.canvas.width=s*this.pixelRatio,this.canvas.height=l*this.pixelRatio,this.canvas.style.width=`${s}px`,this.canvas.style.height=`${l}px`,this.canvas.style.position="absolute";let c=n.offsetTop,u=n.offsetLeft;return this.canvas.style.top=`${c}px`,this.canvas.style.left=`${u}px`,this.enforcedCanvasSize={width:s,height:l},this.ctx.scale(this.pixelRatio,this.pixelRatio),this.setCanvasSettings(),!0}setCanvasSize(){this._setCanvasSize()&&(this.syncVideoSizes(),this.redrawFullCanvas())}replaceShape(t,e){let n=this.serialize([t])[0];this.undoStack.push([...this.shapes]),this.shapes[e]=n}addShape(t){let e=this.serialize([t])[0];this.undoStack.push([...this.shapes]),this.shapes.push(e)}get msPerFrame(){return 1e3/this.fps}syncVideoSizes(){this.withRefVideo(t=>{let n=this.videoElement.getBoundingClientRect();t.style.position="fixed",t.style.top=`${n.top}px`,t.style.left=`${n.left}px`})}addReferenceVideoByURL(i){return I(this,arguments,function*(t,e=this.fps,n="video/mp4"){var l;let r=yield fetch(t).then(c=>c.blob()),h=new Blob([r],{type:n});this.referenceVideoBlobUrl&&URL.revokeObjectURL(this.referenceVideoBlobUrl);let s=window.URL.createObjectURL(h);this.referenceVideoBlobUrl=s,this.referenceVideoElement?((l=this.referenceVideoFrameBuffer)==null||l.destroy(),this.referenceVideoFrameBuffer=new W(this.referenceVideoElement,e),this.referenceVideoFrameBuffer.isMobile=this.isMobile,this.referenceVideoFrameBuffer.start()):(this.referenceVideoElement=document.createElement("video"),this.withRefVideo(c=>{this.isMobile?(c.style.zIndex="2",c.style.display="block",c.style.top="0",c.style.left="0",c.style.opacity="0.25",c.style.width="20px",c.style.height="15px"):(c.style.zIndex="-1",c.style.display="none",c.style.width="100px",c.style.height="70px"),c.style.objectFit="cover",c.style.objectPosition="left top",c.muted=!0,c.volume=0,c.playsInline=!0,c.autoplay=!1,c.controls=!1,c.loop=!0,this.videoElement.after(c),this.referenceVideoFrameBuffer=new W(c,e),this.referenceVideoFrameBuffer.isMobile=this.isMobile,this.referenceVideoFrameBuffer.start()}),this.syncVideoSizes()),this.referenceVideoElement.src=s,this.referenceVideoElement.play().then(()=>{this.showButton("compare")}).catch(()=>{this.hideButton("compare")})})}hideButton(t){let e=this.getButtonForTool(t);e.style.display="none"}showButton(t){let e=this.getButtonForTool(t);e.style.display=""}addSingletonShape(t){let e=this.serialize([t])[0],n=this.shapes.filter(i=>i.type!==t.type);this.replaceFrame(this.playbackFrame,[...n,e])}serialize(t=this.shapes){let e=this.canvasWidth,n=this.canvasHeight;return t.map(i=>this.pluginForTool(i.type).normalize(i,e,n))}deserialize(t){let e=1/this.canvasWidth,n=1/this.canvasHeight;return t.map(i=>this.pluginForTool(i.type).normalize(i,e,n))}getRelativeCoords(t){let e=this.canvas.getBoundingClientRect();return{x:this.getEventX(t)-e.left,y:this.getEventY(t)-e.top}}handleMouseDown(t){var n,i;if(t.preventDefault(),this.isMouseDown=!0,tt(t)||(n=this.gestureHandler)!=null&&n.hasTwoFingers())return;let e=this.frameFromProgressBar(t,!0);if(e){this.isProgressBarNavigation=!0;let r=this.getAnnotationFrame(t);this.isVideoPaused&&(r!==null?this.playbackFrame=r:this.playbackFrame=e);return}this.currentTool&&((i=this.collapseController)!=null&&i.autoCollapseEnabled)&&this.collapseController.collapse(),this.currentTool&&this.pluginForTool(this.currentTool).onPointerDown(t)}get isDrawing(){return this.currentTool?this.pluginForTool(this.currentTool).isDrawing:!1}get isVideoPaused(){return this.videoElement.tagName==="VIDEO"?this.videoElement.paused:!0}get hasGlobalOverlays(){return this.globalShapes.length>0}handleMouseMove(t){if(t.preventDefault(),!tt(t)){if(this.isMouseDown){let e=this.isProgressBarNavigation?this.frameFromProgressBar(t,!1):null;if(e!==null&&!this.isDrawing){if(e===this.lastNavigatedFrame)return;this.lastNavigatedFrame=e,this.isVideoPaused&&(this.playbackFrame=e);return}else this.hideControls(),this.clearCanvas(),this.hasGlobalOverlays||this.addVideoOverlay(),this.drawShapesOverlay()}else this.redrawFullCanvas();this.currentTool&&this.pluginForTool(this.currentTool).onPointerMove(t)}}getEventX(t){return t.clientX}getEventY(t){return t.clientY}handleMouseUp(t){var e;this.isMouseDown=!1,this.isProgressBarNavigation=!1,this.showControls(),!tt(t)&&(this.currentTool&&this.pluginForTool(this.currentTool).onPointerUp(t),(e=this.collapseController)!=null&&e.autoCollapseEnabled&&this.collapseController.expand(),this.redrawFullCanvas())}focusOnMediaNode(){this.videoElement.focus()}drawShapesOverlay(){var n,i;let t={strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth,globalAlpha:this.ctx.globalAlpha},e=this.gestureState.scale!==1||this.gestureState.panX!==0||this.gestureState.panY!==0;if(e){this.ctx.save(),this.ctx.translate(this.gestureState.panX,this.gestureState.panY);let r=this.canvasWidth/2,h=this.canvasHeight/2;this.ctx.translate(r,h),this.ctx.scale(this.gestureState.scale,this.gestureState.scale),this.ctx.translate(-r,-h)}for(let r of this.deserialize(this.globalShapes)){this.ctx.strokeStyle=r.strokeStyle,this.ctx.fillStyle=r.fillStyle,this.ctx.lineWidth=r.lineWidth,this.ctx.globalAlpha=(n=r.opacity)!=null?n:1;try{this.pluginForTool(r.type).draw(r)}catch(h){console.error(h)}}for(let r of this.deserialize(this.shapes)){this.ctx.strokeStyle=r.strokeStyle,this.ctx.fillStyle=r.fillStyle,this.ctx.lineWidth=r.lineWidth,this.ctx.globalAlpha=(i=r.opacity)!=null?i:1;try{this.pluginForTool(r.type).draw(r)}catch(h){console.error(h)}}e&&this.ctx.restore(),this.ctx.strokeStyle=t.strokeStyle,this.ctx.fillStyle=t.fillStyle,this.ctx.lineWidth=t.lineWidth,this.ctx.globalAlpha=t.globalAlpha}clearCanvas(){this.ctx.clearRect(0,0,this.canvasWidth,this.canvasHeight)}frameToDataUrl(){try{this.clearCanvas(),this.addVideoOverlay(),this.addFrameSquareOverlay(),this.drawShapesOverlay();let t=this.canvas.toDataURL("image/png");return this.redrawFullCanvas(),t}catch(t){return console.error(t),null}}redrawFullCanvas(){this.hasGlobalOverlays||(this.clearCanvas(),this.addVideoOverlay()),this.drawShapesOverlay(),this.drawSelectionHandles(),this.addFrameSquareOverlay(),this.addProgressBarOverlay()}drawSelectionHandles(){if(this.currentTool==="move")try{this.pluginForTool("move").drawResizeHandles()}catch(t){}}replaceFrame(t,e){this.timeStack.set(t,this.parseShapes(this.stringifyShapes(e)))}addShapesToFrame(t,e){let n=this.timeStack.get(t)||[];this.timeStack.set(t,[...n,...this.parseShapes(this.stringifyShapes(e))])}setFrameRate(t){var e;(e=this.destructors.find(n=>n.name==="frameRateDetector"))==null||e(),this.fps=t}stringifyShapes(t){return JSON.stringify(t,(e,n)=>e==="image"?n.src:n)}parseShapes(t){return JSON.parse(t,(e,n)=>{if(e==="image"){let i=new Image;return i.src=n,i}return n})}filterNonSerializableShapes(t){return t.filter(e=>e.type!=="image")}saveCurrentFrame(){return{frame:this.playbackFrame,version:1,fps:this.fps,shapes:this.parseShapes(this.stringifyShapes(this.filterNonSerializableShapes(this.shapes)))}}loadAllFrames(t){this.cleanFrameStacks(),t.forEach(e=>{this.timeStack.set(e.frame,e.shapes)})}appendFrames(t){t.forEach(e=>{this.addShapesToFrame(e.frame,e.shapes)})}saveAllFrames(){return Array.from(this.timeStack.keys()).filter(i=>{var r;return(r=this.timeStack.get(i))==null?void 0:r.length}).map(i=>{var r;return{frame:i,fps:this.fps,version:1,shapes:this.filterNonSerializableShapes((r=this.timeStack.get(i))!=null?r:[])}})}getAnnotationFrame(t){var h,s;let e=t.offsetX,n=t.offsetY,i=this.isMobile?20:12;return(s=(h=this.annotatedFrameCoordinates.find(l=>e>=l.x-i&&e<=l.x+i&&n>=l.y-i&&n<=l.y+i))==null?void 0:h.frame)!=null?s:null}get totalFrames(){if(this._enforcedTotalFrames!==null)return this._enforcedTotalFrames;let t=this.videoElement;return t.tagName!=="VIDEO"?1:Math.round(t.duration*this.fps)}setTotalFrames(t){this._enforcedTotalFrames=t!==null?Math.max(1,Math.round(t)):null}getEnforcedTotalFrames(){return this._enforcedTotalFrames}frameFromProgressBar(t,e=!0){if(this.videoElement.tagName!=="VIDEO")return null;let{x:i,width:r,height:h,y:s}=this.progressBarCoordinates,l=t.offsetX,c=t.offsetY,u=()=>{let p=Math.round((l-i)/r*this.totalFrames);return Math.max(1,Math.min(p,this.totalFrames))};return e?l>=i&&l<=i+r&&c>=s&&c<=s+h?u():null:l>=i&&l<=i+r?u():null}hasAnnotationsForFrame(t){if(this.globalShapes.length>0)return!0;if(this.timeStack.has(t)){let e=this.timeStack.get(t);return e&&e.length>0}return!1}stopAnnotationsAsVideo(){this.isAnnotationsAsVideoActive=!1}startAnnotationsAsVideo(){this.isAnnotationsAsVideoActive=!0,this.playAnnotationsAsVideo()}playAnnotationsAsVideo(){this.isAnnotationsAsVideoActive&&(this.hasGlobalOverlays||this.clearCanvas(),this.isMobile?this.hasGlobalOverlays||this.addVideoOverlay():this.addVideoOverlay(),this.drawShapesOverlay(),(this.isCursorOverCanvas||this.isMobile)&&(this.addFrameSquareOverlay(),this.addProgressBarOverlay()))}};function He(a=this.activeTimeFrame){this.ctx.save(),this.ctx.fillStyle="rgba(0, 0, 0, 0.5)";let o=50,t=30,e=20;this.ctx.fillRect(this.canvasWidth-o,this.canvasHeight-t,o,t),this.ctx.fillStyle="white",this.ctx.font=`${e}px sans-serif`,this.ctx.fillText(`${a}`.padStart(3,"0"),this.canvasWidth-40,this.canvasHeight-7),this.ctx.restore()}function De(){var l,c,u;let a=this.videoElement;if(a.tagName!=="VIDEO")return;let o=a.getBoundingClientRect(),t=this.canvas.getBoundingClientRect(),e=o.left-t.left,n=o.top-t.top,i=(l=this.videoFrameBuffer)==null?void 0:l.frameNumberFromTime(a.currentTime),r=(u=(c=this.videoFrameBuffer)==null?void 0:c.getFrame(i||0))!=null?u:a,h=r?r.width:a.videoWidth,s=r?r.height:a.videoHeight;this.ctx.drawImage(r,0,0,h,s,e,n,this.canvasWidth,this.canvasHeight)}function $e(){if(this.videoElement.tagName!=="VIDEO")return;this.annotatedFrameCoordinates=[];let t=Array.from(this.timeStack.keys()).filter(v=>{var b;return(b=this.timeStack.get(v))==null?void 0:b.length}),e=this.totalFrames,{x:n,width:i,height:r,y:h}=this.progressBarCoordinates,s=t.map(v=>Math.round(v/e*i));this.ctx.save(),this.ctx.fillStyle="rgba(0, 0, 0, 0.5)",this.ctx.fillRect(n,h,i,r),this.ctx.fillStyle=V.y;let l=this.isMobile?16:8;s.forEach((v,b)=>{this.ctx.beginPath();let y=n+v,f=this.canvasHeight-r/2;this.ctx.fillRect(y-l/2,f-l/2,l,l),this.annotatedFrameCoordinates.push({x:y,y:f,frame:t[b]})});let c=this.isProgressBarNavigation&&this.lastNavigatedFrame>0?this.lastNavigatedFrame:this.playbackFrame,u=Math.round(c/e*i)+n;this.ctx.fillStyle="white",this.ctx.beginPath();let p=u,g=this.canvasHeight-r/2;this.ctx.beginPath(),this.ctx.fillRect(p-l/2,g-l/2,l,l),this.ctx.fill(),this.ctx.restore()}function Rt(a,o=1){let t=a.replace(/^#/,""),e=0,n=0,i=0;return t.length===3?(e=parseInt(t[0]+t[0],16)/255,n=parseInt(t[1]+t[1],16)/255,i=parseInt(t[2]+t[2],16)/255):t.length===6?(e=parseInt(t.substring(0,2),16)/255,n=parseInt(t.substring(2,4),16)/255,i=parseInt(t.substring(4,6),16)/255):t.length===8&&(e=parseInt(t.substring(0,2),16)/255,n=parseInt(t.substring(2,4),16)/255,i=parseInt(t.substring(4,6),16)/255,o=parseInt(t.substring(6,8),16)/255),[e,n,i,o]}function j(a,o=1){if(typeof a=="string"){if(a.startsWith("rgb")){let t=a.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);if(t)return[parseInt(t[1])/255,parseInt(t[2])/255,parseInt(t[3])/255,t[4]?parseFloat(t[4]):o]}return Rt(a,o)}return[1,0,0,o]}function Be(a,o,t,e){let n=Math.cos(e),i=Math.sin(e),r=a.x-o,h=a.y-t;return{x:o+r*n-h*i,y:t+r*i+h*n}}function Y(a,o,t,e){if(!o.rotation)return a;let n=o.rotationCenterX!==void 0?o.rotationCenterX:t,i=o.rotationCenterY!==void 0?o.rotationCenterY:e;return a.map(r=>Be(r,n,i,o.rotation))}function U(a){return`[ ${a.map(o=>o.toFixed(6)).join(" ")} ]`}function N(a){let o=[];for(let t of a)o.push(t.x,t.y);return`[ ${o.map(t=>t.toFixed(6)).join(" ")} ]`}function pn(a,o,t){var h;let e=j(a.strokeStyle,(h=a.opacity)!=null?h:1),n=0,i=0;for(let s of a.points)n+=s.x,i+=s.y;n/=a.points.length,i/=a.points.length;let r=Y(a.points,a,n,i);return{name:`pen:${o}:${t}:user`,properties:[{type:"float",dimensions:4,name:"color",value:U(e)},{type:"float",name:"width",value:a.lineWidth},{type:"float",dimensions:2,name:"points",value:N(r)},{type:"int",name:"frame",value:t},{type:"byte",name:"brush",value:0},{type:"int",name:"splat",value:0}]}}function mn(a,o,t){var h;let e=j(a.strokeStyle,(h=a.opacity)!=null?h:1),n=(a.x1+a.x2)/2,i=(a.y1+a.y2)/2,r=[{x:a.x1,y:a.y1},{x:a.x2,y:a.y2}];return r=Y(r,a,n,i),{name:`pen:${o}:${t}:user`,properties:[{type:"float",dimensions:4,name:"color",value:U(e)},{type:"float",name:"width",value:a.lineWidth},{type:"float",dimensions:2,name:"points",value:N(r)},{type:"int",name:"frame",value:t},{type:"byte",name:"brush",value:0},{type:"int",name:"splat",value:0}]}}function fn(a,o,t){var g;let e=j(a.strokeStyle,(g=a.opacity)!=null?g:1),n=U(e),i=(a.x1+a.x2)/2,r=(a.y1+a.y2)/2,h=[{x:a.x1,y:a.y1},{x:a.x2,y:a.y2}],s=10+2.5*a.lineWidth,l=Math.PI/6,c=Math.atan2(a.y2-a.y1,a.x2-a.x1),u=[{x:a.x2,y:a.y2},{x:a.x2-s*Math.cos(c+l),y:a.y2-s*Math.sin(c+l)}],p=[{x:a.x2,y:a.y2},{x:a.x2-s*Math.cos(c-l),y:a.y2-s*Math.sin(c-l)}];return h=Y(h,a,i,r),u=Y(u,a,i,r),p=Y(p,a,i,r),[{name:`pen:${o}:${t}:user`,properties:[{type:"float",dimensions:4,name:"color",value:n},{type:"float",name:"width",value:a.lineWidth},{type:"float",dimensions:2,name:"points",value:N(h)},{type:"int",name:"frame",value:t},{type:"byte",name:"brush",value:0},{type:"int",name:"splat",value:0}]},{name:`pen:${o+1}:${t}:user`,properties:[{type:"float",dimensions:4,name:"color",value:n},{type:"float",name:"width",value:a.lineWidth},{type:"float",dimensions:2,name:"points",value:N(u)},{type:"int",name:"frame",value:t},{type:"byte",name:"brush",value:0},{type:"int",name:"splat",value:0}]},{name:`pen:${o+2}:${t}:user`,properties:[{type:"float",dimensions:4,name:"color",value:n},{type:"float",name:"width",value:a.lineWidth},{type:"float",dimensions:2,name:"points",value:N(p)},{type:"int",name:"frame",value:t},{type:"byte",name:"brush",value:0},{type:"int",name:"splat",value:0}]}]}function gn(a,o,t){var h;let e=j(a.strokeStyle,(h=a.opacity)!=null?h:1),n=a.x+a.width/2,i=a.y+a.height/2,r=[{x:a.x,y:a.y},{x:a.x+a.width,y:a.y},{x:a.x+a.width,y:a.y+a.height},{x:a.x,y:a.y+a.height},{x:a.x,y:a.y}];return r=Y(r,a,n,i),{name:`pen:${o}:${t}:user`,properties:[{type:"float",dimensions:4,name:"color",value:U(e)},{type:"float",name:"width",value:a.lineWidth},{type:"float",dimensions:2,name:"points",value:N(r)},{type:"int",name:"frame",value:t},{type:"byte",name:"brush",value:0},{type:"int",name:"splat",value:0}]}}function vn(a,o,t,e=32){var s;let n=j(a.strokeStyle,(s=a.opacity)!=null?s:1),i=a.x,r=a.y,h=[];for(let l=0;l<=e;l++){let c=l/e*Math.PI*2;h.push({x:a.x+Math.cos(c)*a.radius,y:a.y+Math.sin(c)*a.radius})}return h=Y(h,a,i,r),{name:`pen:${o}:${t}:user`,properties:[{type:"float",dimensions:4,name:"color",value:U(n)},{type:"float",name:"width",value:a.lineWidth},{type:"float",dimensions:2,name:"points",value:N(h)},{type:"int",name:"frame",value:t},{type:"byte",name:"brush",value:0},{type:"int",name:"splat",value:0}]}}function yn(a,o,t){var h,s,l,c;let e=j(a.fillStyle,(h=a.opacity)!=null?h:1),n=16+((s=a.lineWidth)!=null?s:1)*.5,i=a.x,r=a.y;if(a.rotation){let u=(l=a.rotationCenterX)!=null?l:a.x,p=(c=a.rotationCenterY)!=null?c:a.y,g=Be({x:a.x,y:a.y},u,p,a.rotation);i=g.x,r=g.y}return{name:`text:${o}:${t}:user`,properties:[{type:"float",dimensions:2,name:"position",value:U([i,r])},{type:"float",dimensions:4,name:"color",value:U(e)},{type:"float",name:"size",value:n/100},{type:"string",name:"text",value:`"${a.text.replace(/"/g,'\\"').replace(/\n/g,"\\n")}"`},{type:"int",name:"frame",value:t}]}}function xn(a,o,t,e,n){let r=(h=>{let s=T({},h);return"x"in s&&typeof s.x=="number"&&(s.x*=e),"y"in s&&typeof s.y=="number"&&(s.y*=n),"x1"in s&&typeof s.x1=="number"&&(s.x1*=e),"y1"in s&&typeof s.y1=="number"&&(s.y1*=n),"x2"in s&&typeof s.x2=="number"&&(s.x2*=e),"y2"in s&&typeof s.y2=="number"&&(s.y2*=n),"width"in s&&typeof s.width=="number"&&s.type==="rectangle"&&(s.width*=e),"height"in s&&typeof s.height=="number"&&(s.height*=n),"radius"in s&&typeof s.radius=="number"&&(s.radius*=e),"points"in s&&Array.isArray(s.points)&&(s.points=s.points.map(l=>({x:l.x*e,y:l.y*n}))),"rotationCenterX"in s&&typeof s.rotationCenterX=="number"&&(s.rotationCenterX*=e),"rotationCenterY"in s&&typeof s.rotationCenterY=="number"&&(s.rotationCenterY*=n),s})(a);switch(a.type){case"curve":return[pn(r,o,t)];case"line":return[mn(r,o,t)];case"arrow":return fn(r,o,t);case"rectangle":return[gn(r,o,t)];case"circle":return[vn(r,o,t)];case"text":return[yn(r,o,t)];case"eraser":case"move":case"image":case"compare":case"audio-peaks":case"selection":return[];default:return[]}}function bn(a){let o=[];o.push(`    ${a.name}`),o.push("    {");for(let t of a.properties){let e=t.dimensions?`${t.type}[${t.dimensions}]`:t.type,n=typeof t.value=="string"?t.value:String(t.value);o.push(`        ${e} ${t.name} = ${n}`)}return o.push("    }"),o.join(`
`)}function Ht(a,o){let{mediaPath:t,width:e,height:n,sessionName:i="sm-annotate-session"}=o,r=[];r.push("GTOa (4)"),r.push(""),r.push("# Generated by sm-annotate OpenRV exporter"),r.push(`# Media: ${t}`),r.push(`# Resolution: ${e}x${n}`),r.push(""),r.push("RVSession : RVSession (4)"),r.push("{"),r.push("    session"),r.push("    {"),r.push(`        string name = "${i}"`),r.push("        int version = 4"),r.push("    }"),r.push("}"),r.push(""),r.push("sourceGroup000000_source : RVFileSource (1)"),r.push("{"),r.push("    media"),r.push("    {"),r.push(`        string movie = "${t}"`),r.push("    }"),r.push("    request"),r.push("    {"),r.push(`        int width = ${e}`),r.push(`        int height = ${n}`),r.push("    }"),r.push("}"),r.push("");let h=[],s=0;for(let l of a)for(let c of l.shapes){let u=xn(c,s,l.frame,e,n);h.push(...u),s+=u.length}if(h.length>0){let l=new Map;for(let c of h){let u=c.name.match(/:\d+:(\d+):/);if(u){let p=parseInt(u[1]);l.has(p)||l.set(p,[]),l.get(p).push(c.name)}}r.push("sourceGroup000000_paint : RVPaint (3)"),r.push("{"),r.push("    paint"),r.push("    {"),r.push(`        int nextId = ${s}`),r.push("    }");for(let[c,u]of l)r.push(`    frame:${c}`),r.push("    {"),r.push(`        string order = [ ${u.map(p=>`"${p}"`).join(" ")} ]`),r.push("    }");for(let c of h)r.push(bn(c));r.push("}")}return r.join(`
`)}function bt(a,o,t="annotations.rv"){let e=Ht(a,o),n=new Blob([e],{type:"text/plain"}),i=URL.createObjectURL(n),r=document.createElement("a");r.href=i,r.download=t,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(i)}function wt(a){if(a.length<3)return"#000000";let o=Math.round(a[0]*255),t=Math.round(a[1]*255),e=Math.round(a[2]*255);return`#${o.toString(16).padStart(2,"0")}${t.toString(16).padStart(2,"0")}${e.toString(16).padStart(2,"0")}`}function wn(a,o){if(a=a.trim(),a.startsWith("[")&&a.endsWith("]")){let t=a.slice(1,-1).trim();if(o==="string"){let n=t.match(/"([^"\\]|\\.)*"/g);return n?n.map(i=>i.slice(1,-1).replace(/\\"/g,'"').replace(/\\n/g,`
`)):[]}return t.split(/\s+/).filter(n=>n.length>0).map(Number)}return a.startsWith('"')&&a.endsWith('"')?a.slice(1,-1).replace(/\\"/g,'"').replace(/\\n/g,`
`):Number(a)}function Tn(a){var r;let o=[],t=a.split(`
`),e=null,n=null,i=0;for(let h=0;h<t.length;h++){let s=t[h].trim();if(s===""||s.startsWith("#")||s==="GTOa (4)")continue;let l=s.match(/^(\S+)\s*:\s*(\S+)\s*\((\d+)\)\s*$/);if(l&&i===0){e={name:l[1],protocol:l[2],version:parseInt(l[3]),components:new Map},o.push(e);continue}if(s==="{"){i++;continue}if(s==="}"){i--,i===1&&(n=null),i===0&&(e=null);continue}if(e&&i>=1){if(!s.includes("=")&&!s.includes("[")&&i===1){n=s,e.components.has(n)||e.components.set(n,new Map);continue}let c=s.match(/^(\w+)(?:\[([^\]]*)\])?\s+(\w+)\s*=\s*(.+)$/);if(c&&n){let[,u,,p,g]=c,v=wn(g,u);(r=e.components.get(n))==null||r.set(p,v)}}}return o}function Sn(a,o,t){let e=a.get("points"),n=a.get("color"),i=a.get("width");if(!e||e.length<4)return null;let r=[];for(let l=0;l<e.length;l+=2)r.push({x:e[l]/o,y:e[l+1]/t});let h=n?wt(n):"#000000",s=n&&n.length>=4?n[3]:1;return{type:"curve",points:r,strokeStyle:h,fillStyle:h,lineWidth:i!=null?i:2,opacity:s}}function Cn(a,o,t){let e=a.get("position"),n=a.get("color"),i=a.get("text"),r=a.get("size");if(!e||e.length<2||!i)return null;let h=n?wt(n):"#000000",s=n&&n.length>=4?n[3]:1,l=(r!=null?r:.16)*100,c=Math.max(1,(l-16)/.5);return{type:"text",x:e[0]/o,y:e[1]/t,text:i,strokeStyle:h,fillStyle:h,lineWidth:c,opacity:s}}function Dt(a,o={}){var u,p,g,v,b,y,f;let t={frames:[]},e=Tn(a),n=e.find(m=>m.protocol==="RVSession");if(n){let m=n.components.get("session");if(m){let x=m.get("name");typeof x=="string"&&(t.sessionName=x)}}let i=e.find(m=>m.protocol==="RVFileSource");if(i){let m=i.components.get("media");if(m){let w=m.get("movie");typeof w=="string"&&(t.mediaPath=w)}let x=i.components.get("request");if(x){let w=x.get("width"),E=x.get("height");typeof w=="number"&&typeof E=="number"&&(t.dimensions={width:w,height:E})}}let r=(g=(p=o.width)!=null?p:(u=t.dimensions)==null?void 0:u.width)!=null?g:1920,h=(y=(b=o.height)!=null?b:(v=t.dimensions)==null?void 0:v.height)!=null?y:1080,s=(f=o.fps)!=null?f:25;t.fps=s;let l=e.find(m=>m.protocol==="RVPaint");if(!l)return t;let c=new Map;for(let[m,x]of l.components){let w=m.match(/^pen:\d+:(\d+):/);if(w){let S=parseInt(w[1]),k=Sn(x,r,h);k&&(c.has(S)||c.set(S,[]),c.get(S).push(k));continue}let E=m.match(/^text:\d+:(\d+):/);if(E){let S=parseInt(E[1]),k=Cn(x,r,h);k&&(c.has(S)||c.set(S,[]),c.get(S).push(k))}}for(let[m,x]of c)t.frames.push({frame:m,fps:s,version:1,shapes:x});return t.frames.sort((m,x)=>m.frame-x.frame),t}function Tt(t){return I(this,arguments,function*(a,o={}){let e=yield a.text();return Dt(e,o)})}B.prototype.initUI=be;B.prototype.initCanvas=we;B.prototype.addFrameSquareOverlay=He;B.prototype.addVideoOverlay=De;B.prototype.addProgressBarOverlay=$e;new EventSource("/esbuild").addEventListener("change",()=>location.reload());var H=document.querySelector("video");function Oe(){return I(this,null,function*(){let a=yield fetch(H.currentSrc).then(y=>y.blob()),o=new Promise(y=>{setTimeout(()=>{y(!0)},250),H.addEventListener("loadeddata",()=>{y(!0)},{once:!0})}),t=yield fetch("./frame_29.png").then(y=>I(this,null,function*(){let f=yield y.blob(),m=new Blob([f],{type:"image/png"}),x=new Image,w=new Promise(E=>{x.addEventListener("load",()=>{E(!0)},{once:!0})});return x.src=window.URL.createObjectURL(m),yield w,x}));H.paused||H.pause();let e=new Blob([a],{type:"video/mp4"}),n=new B(H);yield n.setVideoBlob(e,30),yield o,yield n.addReferenceVideoByURL("./mov_bbb_g.mp4"),requestAnimationFrame(()=>{n.setCanvasSize()}),n.enableVideoFrameBuffer(),console.log({tool:n}),n.addShapesToFrame(29,[{type:"image",image:t,x:0,y:0,width:1,height:1,strokeStyle:"red",lineWidth:2,fillStyle:"red"}]),H.paused||H.pause(),setInterval(()=>{n.destroy(),n.init(H)},1e8),setInterval(()=>{console.log(n.saveAllFrames())},1e5);let i=document.getElementById("file"),r=document.getElementById("download"),h=document.getElementById("sample"),s=document.getElementById("video"),l=document.getElementById("ref-video");s.addEventListener("change",y=>I(this,null,function*(){if(!s.files||s.files.length===0)return;let f=prompt("Enter FPS","30");if(!f)return;let m=s.files[0],x=new Blob([m],{type:m.type});yield n.setVideoBlob(x,parseInt(f,10))})),l.addEventListener("change",y=>I(this,null,function*(){if(!l.files||l.files.length===0)return;let f=prompt("Enter FPS","30");if(!f)return;let m=l.files[0],x=new Blob([m],{type:m.type}),w=window.URL.createObjectURL(x);yield n.addReferenceVideoByURL(w,parseInt(f,10),m.type)})),h.addEventListener("click",y=>{y.stopPropagation(),y.preventDefault(),fetch("./annotations-sample.json").then(f=>f.json()).then(f=>{n.loadAllFrames(f),n.redrawFullCanvas()})}),i.addEventListener("change",y=>{if(!i.files||i.files.length===0)return;let f=i.files[0],m=new FileReader;m.onload=x=>{if(!x.target)return;let w=x.target.result,E=JSON.parse(w);confirm("Append to existing annotations?")?n.appendFrames(E):n.loadAllFrames(E),n.redrawFullCanvas()},m.readAsText(f)}),r.addEventListener("click",y=>{y.stopPropagation(),y.preventDefault();let f=n.saveAllFrames(),m=document.createElement("a");m.href=URL.createObjectURL(new Blob([JSON.stringify(f)],{type:"application/json"}));let x=new Date().toISOString().replace(/:/g,"-");m.download=`annotations-${x}.json`,m.click()});let c=document.getElementById("rv-file"),u=document.getElementById("download-rv");c.addEventListener("change",y=>I(this,null,function*(){if(!c.files||c.files.length===0)return;let f=c.files[0];try{let m=yield Tt(f,{width:n.canvasWidth||1920,height:n.canvasHeight||1080,fps:n.fps});confirm("Append to existing annotations?")?n.appendFrames(m.frames):n.loadAllFrames(m.frames),n.redrawFullCanvas(),m.mediaPath&&console.log("OpenRV media path:",m.mediaPath),m.sessionName&&console.log("OpenRV session:",m.sessionName)}catch(m){console.error("Failed to parse OpenRV file:",m),alert("Failed to parse OpenRV file. Check console for details.")}})),u.addEventListener("click",y=>{y.stopPropagation(),y.preventDefault();let f=n.saveAllFrames();if(f.length===0){alert("No annotations to export.");return}let m=new Date().toISOString().replace(/:/g,"-");bt(f,{mediaPath:H.currentSrc||"video.mp4",width:n.canvasWidth||1920,height:n.canvasHeight||1080,sessionName:`sm-annotate-${m}`},`annotations-${m}.rv`)});let p=document.querySelectorAll(".layout-btn"),g=document.getElementById("layout-label"),v={horizontal:"Horizontal (default)",vertical:"Vertical Sidebar",minimal:"Minimal / Floating","bottom-dock":"Bottom Dock"};p.forEach(y=>{y.addEventListener("click",f=>{let m=f.currentTarget,x=m.dataset.layout;p.forEach(w=>w.classList.remove("active")),m.classList.add("active"),g&&(g.textContent=v[x]),n.setLayout(x),requestAnimationFrame(()=>{n.setCanvasSize()})})});let b;window.addEventListener("resize",()=>{b&&clearTimeout(b),b=window.setTimeout(()=>{n.setCanvasSize()},100)})})}H.readyState===0?H.addEventListener("loadedmetadata",()=>{requestAnimationFrame(()=>{Oe()})},{once:!0}):Oe();})();
