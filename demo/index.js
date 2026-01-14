"use strict";(()=>{var Ne=Object.create;var kt=Object.defineProperty,Ue=Object.defineProperties,je=Object.getOwnPropertyDescriptor,Ge=Object.getOwnPropertyDescriptors,qe=Object.getOwnPropertyNames,Gt=Object.getOwnPropertySymbols,Ke=Object.getPrototypeOf,Kt=Object.prototype.hasOwnProperty,_e=Object.prototype.propertyIsEnumerable;var O=Math.pow,qt=(i,o,t)=>o in i?kt(i,o,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[o]=t,T=(i,o)=>{for(var t in o||(o={}))Kt.call(o,t)&&qt(i,t,o[t]);if(Gt)for(var t of Gt(o))_e.call(o,t)&&qt(i,t,o[t]);return i},M=(i,o)=>Ue(i,Ge(o));var Je=(i,o)=>()=>(o||i((o={exports:{}}).exports,o),o.exports);var Ze=(i,o,t,e)=>{if(o&&typeof o=="object"||typeof o=="function")for(let n of qe(o))!Kt.call(i,n)&&n!==t&&kt(i,n,{get:()=>o[n],enumerable:!(e=je(o,n))||e.enumerable});return i};var Qe=(i,o,t)=>(t=i!=null?Ne(Ke(i)):{},Ze(o||!i||!i.__esModule?kt(t,"default",{value:i,enumerable:!0}):t,i));var I=(i,o,t)=>new Promise((e,n)=>{var a=l=>{try{c(t.next(l))}catch(s){n(s)}},r=l=>{try{c(t.throw(l))}catch(s){n(s)}},c=l=>l.done?e(l.value):Promise.resolve(l.value).then(a,r);c((t=t.apply(i,o)).next())});var Ie=Je((Ai,Me)=>{"use strict";function gn(i){for(var o=1/0,t=-1/0,e=0,n=i.length,a;e<n;e++)a=i[e],o>a&&(o=a),t<a&&(t=a);return{min:o,max:t}}function Ce(i,o){var t=Math.pow(2,o-1),e=i<0?i*t:i*(t-1);return Math.max(-t,Math.min(t-1,e))}function Ee(i,o,t){var e,n=i.length,a=Math.ceil(n/o),r,c,l,s,h,u,p=ke(t,a*2);for(e=0;e<a;e++)r=e*o,c=(e+1)*o>n?n:(e+1)*o,l=i.subarray(r,c),u=gn(l),h=Ce(u.min,t),s=Ce(u.max,t),p[e*2]=h,p[e*2+1]=s;return p}function ke(i,o){return new(new Function(`return Int${i}Array`)())(o)}function vn(i,o){var t=i.length,e=1/t,n=i[0].length/2,a=0,r=0,c,l,s=ke(o,n*2);for(r=0;r<n;r++){for(c=0,l=0,a=0;a<t;a++)c+=e*i[a][r*2],l+=e*i[a][r*2+1];s[r*2]=c,s[r*2+1]=l}return[s]}function ft(i,o){return typeof i=="number"?i:o}Me.exports=function(i,o,t,e,n,a){if(o=ft(o,1e3),a=ft(a,16),t==null&&(t=!0),[8,16,32].indexOf(a)<0)throw new Error("Invalid number of bits specified for peaks.");var r=i.numberOfChannels,c=[],l,s,h,u;if(e=ft(e,0),n=ft(n,i.length),typeof i.subarray=="undefined")for(l=0;l<r;l++)h=i.getChannelData(l),u=h.subarray(e,n),c.push(Ee(u,o,a));else c.push(Ee(i.subarray(e,n),o,a));return t&&c.length>1&&(c=vn(c,a)),s=c[0].length/2,{length:s,data:c,bits:a}}});var tn={bgPrimary:"rgba(28, 28, 32, 0.95)",bgSecondary:"rgba(42, 42, 48, 0.98)",bgTertiary:"#35353d",bgHover:"rgba(255, 255, 255, 0.08)",bgActive:"rgba(255, 255, 255, 0.12)",textPrimary:"#f0f0f2",textSecondary:"#a8a8b0",textMuted:"#68687a",border:"rgba(255, 255, 255, 0.1)",borderHover:"rgba(255, 255, 255, 0.2)",accent:"#5b9fff",accentHover:"#7db3ff",shadow:"rgba(0, 0, 0, 0.4)"},en={bgPrimary:"rgba(250, 250, 252, 0.95)",bgSecondary:"rgba(255, 255, 255, 0.98)",bgTertiary:"#f0f0f5",bgHover:"rgba(0, 0, 0, 0.04)",bgActive:"rgba(0, 0, 0, 0.08)",textPrimary:"#1a1a24",textSecondary:"#5a5a6e",textMuted:"#9090a0",border:"rgba(0, 0, 0, 0.1)",borderHover:"rgba(0, 0, 0, 0.2)",accent:"#2563eb",accentHover:"#3b82f6",shadow:"rgba(0, 0, 0, 0.15)"},nn={dark:tn,light:en},d="sm-annotate";function on(i){return`
    --${d}-bg-primary: ${i.bgPrimary};
    --${d}-bg-secondary: ${i.bgSecondary};
    --${d}-bg-tertiary: ${i.bgTertiary};
    --${d}-bg-hover: ${i.bgHover};
    --${d}-bg-active: ${i.bgActive};
    --${d}-text-primary: ${i.textPrimary};
    --${d}-text-secondary: ${i.textSecondary};
    --${d}-text-muted: ${i.textMuted};
    --${d}-border: ${i.border};
    --${d}-border-hover: ${i.borderHover};
    --${d}-accent: ${i.accent};
    --${d}-accent-hover: ${i.accentHover};
    --${d}-shadow: ${i.shadow};

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
  `}function an(){return`
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
        max-width: calc(100vw - 16px);
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        -ms-overflow-style: none;
      }

      .${d}-container::-webkit-scrollbar {
        display: none;
      }

      .${d}-player-controls {
        gap: 4px;
        padding: 6px;
        margin-bottom: 4px;
        border-radius: 10px;
        max-width: calc(100vw - 16px);
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        -ms-overflow-style: none;
      }

      .${d}-player-controls::-webkit-scrollbar {
        display: none;
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
  `}var _=null;function Mt(i="dark"){_||(_=document.createElement("style"),_.id=`${d}-theme-styles`,document.head.appendChild(_));let o=nn[i];_.textContent=`
    :root {
      ${on(o)}
    }
    ${an()}
  `}function F(i){i.classList.add(`${d}-btn`)}function _t(i){i.classList.add(`${d}-container`)}function Jt(i){i.classList.add(`${d}-player-controls`)}function Zt(i){i.classList.add(`${d}-color-picker`)}function Qt(i){i.classList.add(`${d}-slider`)}function te(i){i.classList.add(`${d}-fullscreen-btn`)}function J(){let i=document.createElement("div");return i.classList.add(`${d}-divider`),i}function q(){return d}function ee(i){let o=document.createElement("button");o.type="button",o.dataset.tooltip="Toggle theme",F(o);let t=()=>{let e=i.theme==="dark";o.innerHTML=e?`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
        </svg>`};return t(),i.addEvent(o,"click",()=>{i.setTheme(i.theme==="dark"?"light":"dark"),t()}),o}function ne(i,o){let t=document.createElement("button");t.type="button",F(t),t.style.float="right",t.dataset.tooltip="Download frame",t.dataset.tooltipPosition="bottom",t.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>',o.addEvent(t,"click",()=>{let e=o.frameToDataUrl();if(!e)return;let n=document.createElement("a");n.download=`frame_${String(o.activeTimeFrame).padStart(3,"0")}.png`,n.href=e,n.click()}),o.buttons.push(t),o.playerControlsContainer.appendChild(t)}var oe='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume-x"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="22" x2="16" y1="9" y2="15"></line><line x1="16" x2="22" y1="9" y2="15"></line></svg>',ie='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume-2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>';function ae(i,o){let t=document.createElement("button");t.type="button",F(t),t.dataset.tooltip="Mute/Unmute",t.dataset.tooltipPosition="bottom",i.muted||i.volume===0?t.innerHTML=oe:t.innerHTML=ie,o.addEvent(i,"volumechange",()=>{i.muted||i.volume===0?t.innerHTML=oe:t.innerHTML=ie}),o.addEvent(t,"click",()=>{if(i.muted){i.muted=!1;return}i.volume===0?i.volume=1:i.volume=0}),o.buttons.push(t),o.playerControlsContainer.appendChild(t)}var z=[{value:0,label:"off"},{value:.25,label:"25%"},{value:.5,label:"50%"},{value:.7,label:"70%"},{value:1,label:"100%"}];function re(i,o=!1){let t=o?'<circle cx="18" cy="6" r="4" fill="currentColor" opacity="0.7"/>':"";return`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <style>
      .label {
        font-family: sans-serif;
        font-size: 9px;
      }
    </style>
    <rect x="3" y="3" width="18" height="18" rx="2" opacity="${i.value===0?.3:i.value}"/>
    <text x="12" y="14" text-anchor="middle" class="label" fill="currentColor">${i.label}</text>
    ${t}
  </svg>`}function It(i){let o=z.findIndex(t=>t.value===i);return o===-1?4:o}function se(i){let o=document.createElement("button");o.type="button",o.dataset.tooltip="Opacity";let t=It(i.overlayOpacity),e=()=>{var c;let a=i.currentTool==="move"?i.pluginForTool("move"):null,r=a==null?void 0:a.getSelectedShape();if(r){let l=(c=r.opacity)!=null?c:1,s=It(l);o.innerHTML=re(z[s],!0),o.dataset.tooltip="Shape opacity"}else o.innerHTML=re(z[t],!1),o.dataset.tooltip="Overlay opacity"};e(),F(o),i.addEvent(o,"click",()=>{var c;let a=i.currentTool==="move"?i.pluginForTool("move"):null,r=a==null?void 0:a.getSelectedShape();if(r&&a){let l=(c=r.opacity)!=null?c:1,s=It(l);s=(s+1)%z.length;let h=z[s].value;a.setSelectedShapeOpacity(h)}else t=(t+1)%z.length,i.overlayOpacity=z[t].value,i.redrawFullCanvas();e()});let n=i.redrawFullCanvas.bind(i);return i.redrawFullCanvas=()=>{n(),e()},i.buttons.push(o),i.uiContainer.appendChild(o),o}var le='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>',rn='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pause"><rect width="4" height="16" x="6" y="4"></rect><rect width="4" height="16" x="14" y="4"></rect></svg>';function ce(i,o){let t=document.createElement("button");t.type="button",t.innerHTML=le,F(t),t.dataset.tooltip="Play/Pause",t.dataset.tooltipPosition="bottom",o.addEvent(i,"play",()=>{t.innerHTML=rn}),o.addEvent(i,"pause",()=>{t.innerHTML=le}),o.addEvent(t,"click",()=>{o.withRefVideo(e=>{e.paused&&e.play().then(()=>{o.showButton("compare")})}),i.paused?i.play().then(()=>{o.redrawFullCanvas()}):(i.pause(),o.raf(()=>{o.redrawFullCanvas()}))}),o.buttons.push(t),o.playerControlsContainer.appendChild(t)}function he(i){return`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-superscript">
        <style>
            .small {
                font-family: auto;
                font-size: ${i===1?"16":"24"}px;
            }
        </style>
        <text x="${i===1?3:2}" y="${i===1?17:20}" font-weight="normal" class="small">${{"0.25":"\xBC","0.5":"\xBD","0.75":"\xBE",1:"1\xD7"}[String(i)]}</text>
        
    </svg>`}function de(i,o){let t=[.25,.5,.75,1],e=document.createElement("button"),n=t[t.length-1];e.type="button",i.playbackRate=n,e.innerHTML=he(n),F(e),e.dataset.tooltip="Playback speed",e.dataset.tooltipPosition="bottom",o.addEvent(e,"click",()=>{let a=t.indexOf(i.playbackRate),r=a+1>=t.length?0:a+1;i.playbackRate=t[r],e.innerHTML=he(t[r])}),o.buttons.push(e),o.playerControlsContainer.appendChild(e)}var sn=500;function ue(i,o,t){let e=null,n=!1,a=()=>{n=!1,e=setTimeout(()=>{n=!0,t(),o.redrawFullCanvas()},sn)},r=()=>{e&&(clearTimeout(e),e=null)},c=()=>{e&&(clearTimeout(e),e=null)},l=s=>{n&&(s.preventDefault(),s.stopImmediatePropagation(),n=!1)};o.addEvent(i,"click",l),i.addEventListener("pointerdown",a),i.addEventListener("pointerup",r),i.addEventListener("pointerleave",c),o.destructors.push(()=>{i.removeEventListener("pointerdown",a),i.removeEventListener("pointerup",r),i.removeEventListener("pointerleave",c),e&&clearTimeout(e)})}var tt=class{constructor(o,t){this.create=(o,t,e=this.uiContainer,n,a="top")=>{let r=document.createElement("button");if(r.type="button",r.innerHTML=o,F(r),n&&(r.dataset.tooltip=n,a==="bottom"&&(r.dataset.tooltipPosition="bottom")),e.appendChild(r),this.buttons.push(r),typeof t=="function")this.addEvent(r,"click",t);else{r.dataset.tool=t;let c=()=>{this.currentTool===t?this.currentTool=null:this.currentTool=t};try{this.tool.pluginForTool(t),this.addEvent(r,"click",c)}catch(l){console.error(l),r.disabled=!0}}return r};this.tool=o,this.uiContainer=t}get buttons(){return this.tool.buttons}get addEvent(){return this.tool.addEvent.bind(this.tool)}get currentTool(){return this.tool.currentTool}set currentTool(o){this.tool.currentTool=o}};function pe(i,o){let t=i.videoElement.tagName==="VIDEO"?i.videoElement:null;if(o.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>',"rectangle",o.uiContainer,"Rectangle"),o.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>',"circle",o.uiContainer,"Circle"),o.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.3 8.7 8.7 21.3c-1 1-2.5 1-3.4 0l-2.6-2.6c-1-1-1-2.5 0-3.4L15.3 2.7c1-1 2.5-1 3.4 0l2.6 2.6c1 1 1 2.5 0 3.4Z"></path><path d="m7.5 10.5 2 2"></path><path d="m10.5 7.5 2 2"></path><path d="m13.5 4.5 2 2"></path><path d="m4.5 13.5 2 2"></path></svg>',"line",o.uiContainer,"Line"),o.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"></path><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"></path></svg>',"curve",o.uiContainer,"Freehand"),o.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>',"arrow",o.uiContainer,"Arrow"),o.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>',"text",o.uiContainer,"Text"),o.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"></path><path d="M22 21H7"></path><path d="m5 11 9 9"></path></svg>',"eraser",o.uiContainer,"Eraser"),o.uiContainer.appendChild(J()),o.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 9 2 12 5 15"></polyline><polyline points="9 5 12 2 15 5"></polyline><polyline points="15 19 12 22 9 19"></polyline><polyline points="19 9 22 12 19 15"></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line></svg>',"move",o.uiContainer,"Move shape"),o.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-flip-horizontal"><path d="M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3"></path><path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3"></path><path d="M12 20v2"></path><path d="M12 14v2"></path><path d="M12 8v2"></path><path d="M12 2v2"></path></svg>',"compare",o.uiContainer,"Compare videos"),se(i),o.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"></path><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path></svg>',()=>{i.handleUndo()},o.uiContainer,"Undo (Ctrl+Z)"),t){let e=o.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>',()=>{i.prevFrame()},i.playerControlsContainer,"Previous frame (hold for annotation)","bottom");ue(e,i,()=>i.prevAnnotatedFrame()),ce(t,i);let n=o.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>',()=>{i.nextFrame()},i.playerControlsContainer,"Next frame (hold for annotation)","bottom");ue(n,i,()=>i.nextAnnotatedFrame()),ae(t,i),de(t,i),ne(t,i)}o.create(`<svg viewBox="0 0 24 24" width="24" height="24">
      <path fill="currentColor" d="M3 3h18v18H3V3m2 2v14h14V5H5z"/>
      <path fill="currentColor" d="M7 7h10v10H7V7m2 2v6h6V9H9z"/>
    </svg>`,"selection",o.uiContainer,"Select region")}var D=(i,o)=>{let t=i.target===document.body,e=o.uiContainer.contains(i.target),n=o.playerControlsContainer.contains(i.target),a=o.videoElement.contains(i.target),r=o.canvas.contains(i.target);return e||n||a||r||t};function et(i){return i.pointerType==="pen"?!1:i.pointerType==="touch"&&i.isPrimary===!1}function me(i,o){if(!D(i,o))return;let t=o.uiContainer.contains(i.target),e=o.playerControlsContainer.contains(i.target);if(t||e)return;let n=o.videoElement;n.tagName==="VIDEO"&&(n.paused||(o.currentTool=null,n.pause(),o.raf(()=>I(this,null,function*(){o.redrawFullCanvas()}))))}function fe(i,o){var t;D(i,o)&&(i.preventDefault(),i.stopPropagation(),i.stopImmediatePropagation(),(t=i.clipboardData)==null||t.setData("application/json",JSON.stringify(o.saveCurrentFrame())))}function ge(i,o){var e;if(!D(i,o))return;i.preventDefault(),i.stopPropagation(),i.stopImmediatePropagation();let t=o.saveCurrentFrame();o.replaceFrame(o.playbackFrame,[]),o.redrawFullCanvas(),(e=i.clipboardData)==null||e.setData("application/json",JSON.stringify(t))}function ve(i,o){if(!D(i,o))return;let t=o.videoElement;t.tagName==="VIDEO"&&(i.key==="ArrowLeft"||i.key==="ArrowRight"?(i.preventDefault(),i.stopPropagation(),i.stopImmediatePropagation(),i.key==="ArrowLeft"?o.prevFrame():i.key==="ArrowRight"&&o.nextFrame()):i.code==="Space"&&(i.preventDefault(),i.stopPropagation(),i.stopImmediatePropagation(),t.paused?t.play().then(()=>{o.redrawFullCanvas()}):(t.pause(),o.raf(()=>{o.redrawFullCanvas()}))))}function ye(i,o){var a,r,c,l,s;if(!D(i,o))return;let t=(r=(a=i.clipboardData)==null?void 0:a.types)!=null?r:[];if(t.includes("application/json"))i.preventDefault(),i.stopPropagation(),i.stopImmediatePropagation();else if(t.includes("Files")){let h=(c=i.clipboardData)==null?void 0:c.files;if(h&&h.length>0){let u=h[0];if(u.type.startsWith("image/")){i.preventDefault(),i.stopPropagation(),i.stopImmediatePropagation();let p=new Image,g=URL.createObjectURL(u);p.addEventListener("load",()=>{URL.revokeObjectURL(g);let v=p.naturalWidth/p.naturalHeight,b=.25,y=b/v*o.aspectRatio;o.addShapesToFrame(o.playbackFrame,[{type:"image",image:p,x:0,y:0,width:b,height:y,strokeStyle:"red",fillStyle:"red",lineWidth:2}]),o.redrawFullCanvas(),o.raf(()=>{o.show()}),o.currentTool="move"},{once:!0}),p.addEventListener("error",()=>{URL.revokeObjectURL(g)},{once:!0}),p.src=g,o.redrawFullCanvas()}}}else if(t.includes("text/plain")){let h=(l=i.clipboardData)==null?void 0:l.getData("text/plain");h&&(i.preventDefault(),i.stopPropagation(),i.stopImmediatePropagation(),o.addShapesToFrame(o.playbackFrame,[{type:"text",text:h,x:.4,y:.4,strokeStyle:o.ctx.strokeStyle,fillStyle:o.ctx.fillStyle,lineWidth:o.ctx.lineWidth}]),o.show(),o.currentTool="move",o.redrawFullCanvas())}else return;let e=(s=i.clipboardData)==null?void 0:s.getData("application/json");if(!e)return;let n=JSON.parse(e);n&&n.shapes&&n.version===1&&(o.addShapesToFrame(o.playbackFrame,n.shapes),o.redrawFullCanvas())}var V={r:"#d31a3b",g:"#15d33b",b:"#0085CA",y:"#F3CE32",a:"#7fffd4",c:"#00ffff",d:"#696969",e:"#50c878",f:"#ff00ff",h:"#f0fff0",i:"#4b0082",j:"#00a86b",k:"#f0e68c",l:"#e6e6fa",m:"#98ff98",n:"#000080",o:"#ffa500",p:"#800080",q:"#e5acc8",s:"#0f52ba",t:"#008080",u:"#3f00ff",v:"#ee82ee",w:"#ffffff",x:"#738678",z:"#0014a8"};function xe(i,o){let t=document.createElement("input");t.type="color",t.value=i,t.dataset.tooltip="Stroke color";let e=n=>{o.ctx.strokeStyle=n.target.value,o.ctx.fillStyle=n.target.value,o.focusOnMediaNode()};return o.addEvent(t,"input",e),t}function be(i){let o=document.createElement("input");o.type="number",o.step="1",o.min="1",o.max="10",o.value="5",o.style.margin="5px",o.dataset.tooltip="Stroke width";let t=e=>{i.ctx.lineWidth=e.target.valueAsNumber,i.focusOnMediaNode()};return i.addEvent(o,"input",t),o}var ln=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
</svg>`;function cn(){var i,o;return(o=(i=document.fullscreenElement)!=null?i:document.webkitFullscreenElement)!=null?o:null}function hn(i){if(i.requestFullscreen)return i.requestFullscreen();let o=i;if(o.webkitRequestFullscreen)return o.webkitRequestFullscreen()}function dn(){if(document.exitFullscreen)return document.exitFullscreen();let i=document;if(i.webkitExitFullscreen)return i.webkitExitFullscreen()}function un(){var i;return!!((i=document.fullscreenEnabled)!=null?i:document.webkitFullscreenEnabled)}function we(i){let o=document.createElement("button");if(o.innerHTML=ln,o.type="button",o.dataset.tooltip="Fullscreen",o.dataset.tooltipPosition="bottom",te(o),!un())return o.style.display="none",o;let t=()=>{if(cn())dn();else{let n=i.videoElement.parentElement;n&&hn(n)}};o.addEventListener("click",t);let e=()=>{i.setCanvasSize(),i.playbackFrame=i.playbackFrame,i.canvas.focus(),i.redrawFullCanvas(),o.blur()};return document.addEventListener("fullscreenchange",e),document.addEventListener("webkitfullscreenchange",e),i.destructors.push(()=>{o.removeEventListener("click",t),document.removeEventListener("fullscreenchange",e),document.removeEventListener("webkitfullscreenchange",e)}),o}var pn=V.r,mn="",fn="";function Te(){var c,l;let i=document.createElement("div");i.style.cssText=fn,_t(i),(c=this.canvas.parentNode)==null||c.insertBefore(i,this.canvas);let o=document.createElement("div");o.style.cssText=mn,Jt(o),(l=this.canvas.parentNode)==null||l.insertBefore(o,this.canvas.nextSibling),this.playerControlsContainer=o;let t=this.videoElement.tagName==="VIDEO"?this.videoElement:null;this.uiContainer=i;let e=()=>{let s=document.createElement("div");return s.style.display="inline-flex",s.style.alignItems="center",s},n=new tt(this,i);pe(this,n),this.isMobile&&(this.hideButton("line"),this.hideButton("circle"),this.hideButton("rectangle"),this.hideButton("eraser")),this.hideButton("compare"),i.appendChild(J()),this.colorPicker=xe(pn,this),Zt(this.colorPicker),i.appendChild(this.colorPicker);let a=e();this.strokeSizePicker=be(this),Qt(this.strokeSizePicker),a.appendChild(this.strokeSizePicker),i.appendChild(a),i.appendChild(J());let r=ee(this);if(i.appendChild(r),t){this.hide(),this.addEvent(t,"pause",()=>{this.show()}),this.addEvent(t,"seek",()=>{t.paused&&this.show()}),this.addEvent(t,"timeupdate",()=>{t.currentTime<2e-4&&!t.paused&&this.startAnnotationsAsVideo()}),this.addEvent(t,"error",()=>{this.hide()}),this.addEvent(t,"stalled",()=>{this.hide()}),this.addEvent(t,"play",()=>{this.hideControls(),this.startAnnotationsAsVideo()}),this.addEvent(document,"copy",h=>{fe(h,this)}),this.addEvent(document,"cut",h=>{ge(h,this)}),this.addEvent(document,"paste",h=>{ye(h,this)}),this.addEvent(document,"click",h=>{me(h,this)}),this.addEvent(document,"keydown",h=>{ve(h,this)}),this.addEvent(document.body.querySelector("div"),"drop",h=>{var u;(u=h.dataTransfer)!=null&&u.types});let s=we(this);o.appendChild(s)}}function Se(){var i;this.canvas=document.createElement("canvas"),this.ctx=this.canvas.getContext("2d"),(i=this.videoElement.parentNode)==null||i.insertBefore(this.canvas,this.videoElement.nextSibling),this.canvas.style.position="absolute",this.canvas.style.backgroundColor="transparent",this.canvas.style.top="0",this.canvas.style.left="0",this.canvas.style.zIndex="1",this.addEvent(this.canvas,"pointerdown",this.handleMouseDown),this.addEvent(this.canvas,"pointermove",this.handleMouseMove),this.addEvent(this.canvas,"pointerup",this.handleMouseUp),this.addEvent(this.canvas,"pointercancel",this.handleMouseUp),this.addEvent(this.canvas,"pointerenter",()=>{this.isCursorOverCanvas=!0}),this.addEvent(this.canvas,"pointerleave",()=>{this.isCursorOverCanvas=!1}),this.addEvent(this.canvas,"touchmove",o=>{o.stopImmediatePropagation(),o.stopPropagation(),o.preventDefault()}),this.addEvent(window,"resize",this.setCanvasSize),this.addEvent(document,"keydown",this.onKeyDown)}var nt=class{constructor(){this.destructors=[];this.isDestroyed=!1;this.activeTimeFrame=1;this.globalShapes=[];this.timeStack=new Map;this.undoTimeStack=new Map}cleanFrameStacks(){this.timeStack.clear(),this.undoTimeStack.clear()}destroy(){this.destructors.forEach(o=>o()),this.destructors=[],this.globalShapes=[],this.cleanFrameStacks()}raf(o){return requestAnimationFrame(o)}addEvent(o,t,e){let n=a=>{this.isDestroyed||e(a)};o.addEventListener(t,n),this.destructors.push(()=>{o.removeEventListener(t,n)})}addProgressBarOverlay(){throw new Error("Method not implemented.")}initUI(){throw new Error("Method not implemented.")}initCanvas(){throw new Error("Method not implemented.")}addFrameSquareOverlay(o=this.activeTimeFrame){throw new Error("Method not implemented.")}addVideoOverlay(){throw new Error("Method not implemented.")}withRefVideo(o){this.isDestroyed||this.referenceVideoElement&&o(this.referenceVideoElement)}withVideo(o){if(this.isDestroyed)return;let t=this.videoElement;!t||t.tagName!=="VIDEO"||o(t)}};var k=class{constructor(o){this.startX=0;this.startY=0;this.isDrawing=!1;this.annotationTool=o}isPointerAtShape(o,t,e){return!1}on(o,t){}get ctx(){return this.annotationTool.ctx}onDeactivate(){}onActivate(){}reset(){this.startX=0,this.startY=0,this.isDrawing=!1}save(o){this.annotationTool.addShape(o)}applyRotation(o,t,e){return o.rotation?(this.ctx.save(),this.ctx.translate(t,e),this.ctx.rotate(o.rotation),this.ctx.translate(-t,-e),!0):!1}restoreRotation(){this.ctx.restore()}getRotationCenter(o,t,e){return o.rotationCenterX!==void 0&&o.rotationCenterY!==void 0?{x:o.rotationCenterX*this.annotationTool.canvasWidth,y:o.rotationCenterY*this.annotationTool.canvasHeight}:{x:t,y:e}}};var ot=class extends k{constructor(){super(...arguments);this.name="rectangle"}move(t,e,n){return t.x+=e,t.y+=n,t}normalize(t,e,n){return M(T({},t),{x:t.x/e,y:t.y/n,width:t.width/e,height:t.height/n})}onPointerDown(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.startX=e,this.startY=n,this.isDrawing=!0}onPointerMove(t){if(!this.isDrawing)return;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.drawRectangle(this.startX,this.startY,e-this.startX,n-this.startY)}onPointerUp(t){if(!this.isDrawing)return;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.save({type:"rectangle",x:this.startX,y:this.startY,width:e-this.startX,height:n-this.startY,strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth}),this.drawRectangle(this.startX,this.startY,e-this.startX,n-this.startY),this.isDrawing=!1}drawRectangle(t,e,n,a){this.ctx.beginPath(),this.ctx.rect(t,e,n,a),this.ctx.stroke()}draw(t){let e=t.x+t.width/2,n=t.y+t.height/2,a=this.getRotationCenter(t,e,n),r=this.applyRotation(t,a.x,a.y);this.drawRectangle(t.x,t.y,t.width,t.height),r&&this.restoreRotation()}isPointerAtShape(t,e,n){let r=Math.min(t.x,t.x+t.width),c=Math.max(t.x,t.x+t.width),l=Math.min(t.y,t.y+t.height),s=Math.max(t.y,t.y+t.height),h=Math.abs(e-r)<=5,u=Math.abs(e-c)<=5,p=Math.abs(n-l)<=5,g=Math.abs(n-s)<=5,v=n>=l-5&&n<=s+5,b=e>=r-5&&e<=c+5;return(h||u)&&v||(p||g)&&b}};var it=class extends k{constructor(){super(...arguments);this.name="circle"}move(t,e,n){return t.x+=e,t.y+=n,t}normalize(t,e,n){return M(T({},t),{x:t.x/e,y:t.y/n,radius:t.radius/e})}onPointerDown(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.startX=e,this.startY=n,this.isDrawing=!0}onPointerMove(t){if(!this.isDrawing)return;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t),a=Math.sqrt(Math.pow(e-this.startX,2)+Math.pow(n-this.startY,2));this.drawCircle(this.startX,this.startY,a)}onPointerUp(t){if(!this.isDrawing)return;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t),a=Math.sqrt(Math.pow(e-this.startX,2)+Math.pow(n-this.startY,2));this.save({type:"circle",x:this.startX,y:this.startY,radius:a,strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth}),this.drawCircle(this.startX,this.startY,a),this.isDrawing=!1}drawCircle(t,e,n){this.ctx.beginPath(),this.ctx.arc(t,e,n,0,2*Math.PI),this.ctx.stroke()}draw(t){if(t.radius===void 0||t.radius<0)return;let e=this.getRotationCenter(t,t.x,t.y),n=this.applyRotation(t,e.x,e.y);this.drawCircle(t.x,t.y,t.radius),n&&this.restoreRotation()}isPointerAtShape(t,e,n){var s;if(t.radius===void 0||t.radius<0)return!1;let a=e-t.x,r=n-t.y,c=Math.sqrt(a*a+r*r),l=Math.max(((s=t.lineWidth)!=null?s:1)/2,5);return c<=t.radius+l}};var at=class{constructor(o,t){this.x=o;this.y=t}distanceToLine(o,t){let e=t.x-o.x,n=t.y-o.y,a=Math.abs(n*this.x-e*this.y+t.x*o.y-t.y*o.x),r=Math.sqrt(n*n+e*e);return a/r}};function rt(i,o){if(i.length<=2)return i;let t=i[0],e=i[i.length-1],n=-1,a=0;for(let r=1;r<i.length-1;r++){let c=i[r].distanceToLine(t,e);c>a&&(n=r,a=c)}if(a>o){let r=rt(i.slice(0,n+1),o),c=rt(i.slice(n),o);return r.slice(0,r.length-1).concat(c)}else return[t,e]}var st=class extends k{constructor(){super(...arguments);this.name="curve";this.curvePoints=[];this.zoomScale=2;this.zoomRadius=100;this.zoomCtx=null;this.zoomCanvas=null;this.onKeyPress=t=>{let e=t.key;if(e===null||e===" "||t.isComposing)return;let n=Number(e);if(isNaN(n)||!n){e in V&&(this.annotationTool.colorPicker.value=V[e],this.annotationTool.setCanvasSettings());return}this.annotationTool.strokeSizePicker.value=e,this.annotationTool.setCanvasSettings()}}move(t,e,n){return t.points=t.points.map(a=>({x:a.x+e,y:a.y+n})),t}onActivate(){this.initZoomCanvas(),document.addEventListener("keypress",this.onKeyPress)}onDeactivate(){this.zoomCtx=null,this.zoomCanvas=null,document.removeEventListener("keypress",this.onKeyPress)}normalize(t,e,n){return M(T({},t),{points:t.points.map(a=>({x:a.x/e,y:a.y/n}))})}draw(t){if(!t.points||t.points.length===0)return;let e=0,n=0;for(let s of t.points)e+=s.x,n+=s.y;let a=e/t.points.length,r=n/t.points.length,c=this.getRotationCenter(t,a,r),l=this.applyRotation(t,c.x,c.y);this.drawCurve(t),l&&this.restoreRotation()}reset(){super.reset(),this.curvePoints=[]}onPointerDown(t){if(this.isDrawing)return;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.curvePoints=[],this.startX=e,this.startY=n,this.isDrawing=!0,this.curvePoints.push({x:e,y:n})}onPointerMove(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);if(!this.isDrawing){this.drawZoomCircle(e,n,t.shiftKey);return}this.curvePoints.push({x:e,y:n}),this.drawCurve({points:this.curvePoints,lineWidth:this.ctx.lineWidth}),this.drawZoomCircle(e,n,t.shiftKey)}onPointerUp(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);if(this.drawZoomCircle(e,n,t.shiftKey),!this.isDrawing)return;this.curvePoints.push({x:e,y:n});let a=this.curvePoints.map(h=>new at(h.x,h.y)),s={type:"curve",points:rt(a,.5).map(h=>({x:h.x,y:h.y})),strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth};this.save(s),this.curvePoints=[],this.isDrawing=!1}drawCurve(t){if(t.points.length===2&&t.points[0].x===t.points[1].x&&t.points[0].y===t.points[1].y){let e=t.lineWidth/4,n=0,a=2*Math.PI;this.ctx.beginPath(),this.ctx.arc(t.points[0].x,t.points[0].y,e,n,a),this.ctx.stroke()}else{this.ctx.beginPath(),this.ctx.moveTo(t.points[0].x,t.points[0].y);for(let e=0;e<t.points.length-1;e++){let n=t.points[e],a=t.points[e+1];this.ctx.quadraticCurveTo(n.x,n.y,a.x,a.y)}this.ctx.stroke()}}initZoomCanvas(){let t=document.createElement("canvas"),e=2;t.width=this.zoomRadius*2*e,t.height=this.zoomRadius*2*e;let n=t.getContext("2d");n&&(n.imageSmoothingQuality="high",n.imageSmoothingEnabled=!0,this.zoomCtx=n,this.zoomCanvas=t)}isPointerAtShape(t,e,n){var r;if(!t.points||t.points.length===0)return!1;let a=Math.max(((r=t.lineWidth)!=null?r:this.ctx.lineWidth)/2,5);for(let c=0;c<t.points.length-1;c++){let l=t.points[c],s=t.points[c+1],h=e-l.x,u=n-l.y,p=s.x-l.x,g=s.y-l.y,v=h*p+u*g,b=p*p+g*g,y=-1;b!==0&&(y=v/b);let f,m;y<0?(f=l.x,m=l.y):y>1?(f=s.x,m=s.y):(f=l.x+y*p,m=l.y+y*g);let x=e-f,w=n-m;if(Math.sqrt(x*x+w*w)<a)return!0}return!1}drawZoomCircle(t,e,n=!1){if(!n)return;this.isDrawing||(this.annotationTool.clearCanvas(),this.annotationTool.addVideoOverlay(),this.annotationTool.drawShapesOverlay());let a=this.zoomCtx;if(!a)return;let r=this.annotationTool.pixelRatio,c=this.zoomRadius*2/this.zoomScale,l=t-c/2,s=e-c/2;a.clearRect(0,0,this.zoomCanvas.width,this.zoomCanvas.height),a.drawImage(this.ctx.canvas,l*r,s*r,c*r,c*r,0,0,this.zoomRadius*2,this.zoomRadius*2),this.ctx.save(),this.ctx.beginPath(),this.ctx.arc(t,e,this.zoomRadius,0,2*Math.PI),this.ctx.closePath(),this.ctx.clip(),this.ctx.drawImage(this.zoomCanvas,t-this.zoomRadius,e-this.zoomRadius),this.ctx.restore()}};var lt=class extends k{constructor(){super(...arguments);this.name="line"}move(t,e,n){return t.x1+=e,t.y1+=n,t.x2+=e,t.y2+=n,t}normalize(t,e,n){return M(T({},t),{x1:t.x1/e,y1:t.y1/n,x2:t.x2/e,y2:t.y2/n})}onPointerDown(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.startX=e,this.startY=n,this.isDrawing=!0}onPointerMove(t){if(!this.isDrawing)return;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.drawLine(this.startX,this.startY,e,n)}onPointerUp(t){if(!this.isDrawing)return;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.save({type:"line",x1:this.startX,y1:this.startY,x2:e,y2:n,fillStyle:this.ctx.fillStyle,strokeStyle:this.ctx.strokeStyle,lineWidth:this.ctx.lineWidth}),this.drawLine(this.startX,this.startY,e,n),this.isDrawing=!1}drawLine(t,e,n,a){this.ctx.beginPath(),this.ctx.moveTo(t,e),this.ctx.lineTo(n,a),this.ctx.stroke()}draw(t){let e=(t.x1+t.x2)/2,n=(t.y1+t.y2)/2,a=this.getRotationCenter(t,e,n),r=this.applyRotation(t,a.x,a.y);this.drawLine(t.x1,t.y1,t.x2,t.y2),r&&this.restoreRotation()}isPointerAtShape(t,e,n){var p;let{x1:a,y1:r,x2:c,y2:l}=t,s=Math.max(((p=t.lineWidth)!=null?p:1)/2,5),h=(c-a)*(r-n)-(a-e)*(l-r),u=O(c-a,2)+O(l-r,2);if(u===0){let g=e-a,v=n-r;return Math.sqrt(g*g+v*v)<=s}return Math.abs(h)/Math.sqrt(u)<=s&&e>=Math.min(a,c)-s&&e<=Math.max(a,c)+s&&n>=Math.min(r,l)-s&&n<=Math.max(r,l)+s}};var ct=class extends k{constructor(){super(...arguments);this.name="arrow"}normalize(t,e,n){return M(T({},t),{x1:t.x1/e,y1:t.y1/n,x2:t.x2/e,y2:t.y2/n})}move(t,e,n){return t.x1+=e,t.y1+=n,t.x2+=e,t.y2+=n,t}draw(t){let e=(t.x1+t.x2)/2,n=(t.y1+t.y2)/2,a=this.getRotationCenter(t,e,n),r=this.applyRotation(t,a.x,a.y);this.drawArrow(t.x1,t.y1,t.x2,t.y2,t.lineWidth),r&&this.restoreRotation()}onPointerDown(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.startX=e,this.startY=n,this.isDrawing=!0}onPointerMove(t){if(!this.isDrawing)return;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.drawArrow(this.startX,this.startY,e,n)}onPointerUp(t){if(!this.isDrawing)return;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.save({type:"arrow",x1:this.startX,y1:this.startY,x2:e,y2:n,strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth}),this.drawArrow(this.startX,this.startY,e,n),this.isDrawing=!1}drawArrow(t,e,n,a,r){let c=10+2.5*(r!=null?r:this.ctx.lineWidth),l=Math.PI/6,s=Math.atan2(a-e,n-t);this.ctx.beginPath(),this.ctx.moveTo(t,e),this.ctx.lineTo(n,a),this.ctx.stroke(),this.ctx.beginPath(),this.ctx.moveTo(n,a),this.ctx.lineTo(n-c*Math.cos(s+l),a-c*Math.sin(s+l)),this.ctx.moveTo(n,a),this.ctx.lineTo(n-c*Math.cos(s-l),a-c*Math.sin(s-l)),this.ctx.stroke()}isPointerAtShape(t,e,n){var p;let{x1:a,y1:r,x2:c,y2:l}=t,s=Math.max(((p=t.lineWidth)!=null?p:1)/2,5),h=(c-a)*(r-n)-(a-e)*(l-r),u=O(c-a,2)+O(l-r,2);if(u===0){let g=e-a,v=n-r;return Math.sqrt(g*g+v*v)<=s}return Math.abs(h)/Math.sqrt(u)<=s&&e>=Math.min(a,c)-s&&e<=Math.max(a,c)+s&&n>=Math.min(r,l)-s&&n<=Math.max(r,l)+s}};var ht=class extends k{constructor(){super(...arguments);this.name="text";this.activePopup=null;this.handleKeyDown=t=>{}}move(t,e,n){return t.x+=e,t.y+=n,t}onActivate(){this.annotationTool.canvas.style.cursor="text",this.isDrawing=!0}onDeactivate(){this.destroyPopup(),this.annotationTool.canvas.style.cursor="default",this.isDrawing=!1}draw(t){var g;if(!t.text)return;let e=t.text.split(`
`),n=16+((g=t.lineWidth)!=null?g:this.ctx.lineWidth)*.5,a=n*1.25;this.ctx.font=`${n}px Helvetica Neue, Arial`;let r=e.map(v=>this.ctx.measureText(v).width),c=r.length>0?Math.max(...r):0,l=e.length*a,s=t.x+c/2,h=t.y-n/2+l/2,u=this.getRotationCenter(t,s,h),p=this.applyRotation(t,u.x,u.y);for(let v=0;v<e.length;v++)this.drawTextLine(t.x,t.y+v*a,e[v],n);p&&this.restoreRotation()}drawText(t,e,n){let a=16+this.ctx.lineWidth*.5;this.ctx.font=`${a}px Helvetica Neue, Arial`,this.ctx.fillText(n,t,e)}drawTextLine(t,e,n,a){this.ctx.font=`${a}px Helvetica Neue, Arial`,this.ctx.fillText(n,t,e)}onPointerDown(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.startX=e,this.startY=n}onPointerMove(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.ctx.beginPath(),this.ctx.arc(e,n,5,0,2*Math.PI),this.ctx.fill()}normalize(t,e,n){return M(T({},t),{x:t.x/e,y:t.y/n})}destroyPopup(){var t;this.activePopup&&((t=this.annotationTool.canvas.parentElement)==null||t.removeChild(this.activePopup),this.activePopup=null,document.removeEventListener("keydown",this.handleKeyDown))}createTextInputPopup(t,e){var g;this.destroyPopup();let n=document.createElement("div");this.activePopup=n,n.style.cssText=`
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
    `;let a=document.createElement("input");a.type="text",a.placeholder="Enter text to draw",a.style.cssText=`
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
    `,a.addEventListener("focus",()=>{a.style.borderColor="#007bff"}),a.addEventListener("blur",()=>{a.style.borderColor="#ddd"});let r=document.createElement("div");r.style.cssText=`
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    `;let c=`
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
      ${c}
      background: #f0f0f0;
      color: #333;
    `,l.addEventListener("mouseover",()=>{l.style.opacity="0.8"}),l.addEventListener("mouseout",()=>{l.style.opacity="1"});let s=document.createElement("button");s.textContent="OK",s.style.cssText=`
      ${c}
      background: #007bff;
      color: white;
    `,s.addEventListener("mouseover",()=>{s.style.opacity="0.8"}),s.addEventListener("mouseout",()=>{s.style.opacity="1"});let h=()=>{this.destroyPopup()},u=()=>{let v=a.value.trim();v&&(this.save({type:"text",x:t,y:e,text:v,strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth}),this.annotationTool.currentTool=null),h()},p=v=>{v.key==="Escape"?h():v.key==="Enter"&&u()};this.handleKeyDown=p,s.onclick=u,l.onclick=h,a.onkeyup=p,document.addEventListener("keydown",p),r.appendChild(l),r.appendChild(s),n.appendChild(a),n.appendChild(r),(g=this.annotationTool.canvas.parentElement)==null||g.appendChild(n),requestAnimationFrame(()=>{a.focus()})}onPointerUp(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.createTextInputPopup(e,n)}isPointerAtShape(t,e,n){var u;if(!t.text)return!1;let a=t.text.split(`
`);if(a.length===0)return!1;let r=16+((u=t.lineWidth)!=null?u:1)*.5,c=r*1.25,l=a.length*c;this.ctx.font=`${r}px Helvetica Neue, Arial`;let s=a.map(p=>this.ctx.measureText(p).width),h=s.length>0?Math.max(...s):0;return h===0?!1:e>=t.x&&e<=t.x+h&&n>=t.y-r&&n<=t.y+l-r}};var dt=class extends k{constructor(){super(...arguments);this.name="eraser"}move(t,e,n){return t.x+=e,t.y+=n,t}normalize(t,e,n){return M(T({},t),{x:t.x/e,y:t.y/n,width:t.width/e,height:t.height/n})}draw(t){this.drawEraser(t.x,t.y,t.width,t.height)}onPointerDown(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.startX=e,this.startY=n,this.isDrawing=!0}onPointerMove(t){if(!this.isDrawing)return;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.ctx.save(),this.ctx.strokeStyle="rgba(255, 255, 255, 0.5)",this.ctx.lineWidth=1,this.ctx.fillStyle="rgba(255, 255, 255, 0.3)",this.ctx.fillRect(this.startX,this.startY,e-this.startX,n-this.startY),this.ctx.strokeRect(this.startX,this.startY,e-this.startX,n-this.startY),this.ctx.restore()}onPointerUp(t){if(!this.isDrawing)return;this.isDrawing=!1;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.save({type:"eraser",x:this.startX,y:this.startY,width:e-this.startX,height:n-this.startY,strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth})}drawEraser(t,e,n,a){this.ctx.clearRect(t,e,n,a)}isPointerAtShape(t,e,n){let a=Math.min(t.x,t.x+t.width),r=Math.max(t.x,t.x+t.width),c=Math.min(t.y,t.y+t.height),l=Math.max(t.y,t.y+t.height);return e>=a&&e<=r&&n>=c&&n<=l}};var ut=class extends k{constructor(){super(...arguments);this.name="move";this.shape=null;this.shapeIndex=-1;this.lastDrawnShape=null;this.isScale=!1;this.selectedShapeIndex=-1;this.boundHandleKeyDown=null;this.activeHandle=null;this.handleSize=8;this.resizeStartBounds=null;this.resizeOriginalShape=null;this.rotationActive=!1;this.rotationStartAngle=0;this.rotationShapeStartAngle=0;this.centerDragActive=!1;this.rotationHandleDistance=40}cloneShape(t){if(t.type==="image"){let e=t;return M(T({},JSON.parse(JSON.stringify(t))),{image:e.image})}return JSON.parse(JSON.stringify(t))}getSelectedShape(){return this.selectedShapeIndex<0||this.selectedShapeIndex>=this.annotationTool.shapes.length?null:this.annotationTool.shapes[this.selectedShapeIndex]}setSelectedShapeOpacity(t){return this.selectedShapeIndex<0||this.selectedShapeIndex>=this.annotationTool.shapes.length?!1:(this.annotationTool.undoStack.push([...this.annotationTool.shapes]),this.annotationTool.shapes[this.selectedShapeIndex].opacity=t,this.annotationTool.redrawFullCanvas(),!0)}move(t){return t}normalize(t){return T({},t)}onActivate(){this.boundHandleKeyDown=this.handleKeyDown.bind(this),document.addEventListener("keydown",this.boundHandleKeyDown)}onDeactivate(){this.boundHandleKeyDown&&(document.removeEventListener("keydown",this.boundHandleKeyDown),this.boundHandleKeyDown=null),this.selectedShapeIndex=-1}handleKeyDown(t){if((t.key==="Backspace"||t.key==="Delete")&&this.selectedShapeIndex>=0){t.preventDefault(),this.deleteSelectedShape();return}if((t.ctrlKey||t.metaKey)&&t.key.toLowerCase()==="d"&&this.selectedShapeIndex>=0){t.preventDefault(),this.duplicateSelectedShape();return}if((t.ctrlKey||t.metaKey)&&t.shiftKey&&t.key==="ArrowRight"){t.preventDefault(),this.copyAnnotationsToNextFrame();return}if((t.ctrlKey||t.metaKey)&&t.shiftKey&&t.key==="ArrowLeft"){t.preventDefault(),this.copyAnnotationsToPrevFrame();return}}duplicateSelectedShape(){let t=this.getSelectedShape();if(!t)return;let e=this.cloneShape(t),n=20;this.getShapeBounds(e)&&this.offsetShape(e,n,n),this.annotationTool.undoStack.push([...this.annotationTool.shapes]);let r=this.annotationTool.serialize([e])[0];this.annotationTool.shapes.push(r),this.selectedShapeIndex=this.annotationTool.shapes.length-1,this.annotationTool.redrawFullCanvas()}copyAnnotationsToNextFrame(){let e=this.annotationTool.activeTimeFrame+1;if(e>this.annotationTool.totalFrames||this.annotationTool.shapes.length===0)return;let n=this.annotationTool.timeStack.get(e)||[],a=this.annotationTool.shapes.map(c=>this.cloneShape(c)),r=[...n,...a];this.annotationTool.timeStack.set(e,r),this.annotationTool.playbackFrame=e,this.annotationTool.redrawFullCanvas()}copyAnnotationsToPrevFrame(){let e=this.annotationTool.activeTimeFrame-1;if(e<1||this.annotationTool.shapes.length===0)return;let n=this.annotationTool.timeStack.get(e)||[],a=this.annotationTool.shapes.map(c=>this.cloneShape(c)),r=[...n,...a];this.annotationTool.timeStack.set(e,r),this.annotationTool.playbackFrame=e,this.annotationTool.redrawFullCanvas()}offsetShape(t,e,n){let a=this.annotationTool.deserialize([t])[0],c=this.annotationTool.pluginForTool(a.type).move(a,e,n);Object.assign(t,this.annotationTool.serialize([c])[0])}getShapeBounds(t){var n;let e=this.annotationTool.deserialize([t])[0];switch(e.type){case"rectangle":{let a=e;return{x:Math.min(a.x,a.x+a.width),y:Math.min(a.y,a.y+a.height),width:Math.abs(a.width),height:Math.abs(a.height)}}case"image":{let a=e;return{x:Math.min(a.x,a.x+a.width),y:Math.min(a.y,a.y+a.height),width:Math.abs(a.width),height:Math.abs(a.height)}}case"selection":{let a=e;return{x:Math.min(a.x,a.x+a.width),y:Math.min(a.y,a.y+a.height),width:Math.abs(a.width),height:Math.abs(a.height)}}case"circle":{let a=e;return{x:a.x-a.radius,y:a.y-a.radius,width:a.radius*2,height:a.radius*2}}case"line":{let a=e,r=Math.min(a.x1,a.x2),c=Math.min(a.y1,a.y2),l=Math.max(a.x1,a.x2),s=Math.max(a.y1,a.y2);return{x:r,y:c,width:l-r||10,height:s-c||10}}case"arrow":{let a=e,r=Math.min(a.x1,a.x2),c=Math.min(a.y1,a.y2),l=Math.max(a.x1,a.x2),s=Math.max(a.y1,a.y2);return{x:r,y:c,width:l-r||10,height:s-c||10}}case"curve":{let a=e;if(!a.points||a.points.length===0)return null;let r=1/0,c=1/0,l=-1/0,s=-1/0;for(let h of a.points)r=Math.min(r,h.x),c=Math.min(c,h.y),l=Math.max(l,h.x),s=Math.max(s,h.y);return{x:r,y:c,width:l-r||10,height:s-c||10}}case"text":{let a=e;if(!a.text)return null;let c=16+((n=t.lineWidth)!=null?n:1)*.5,l=a.text.length*c*.6;return{x:a.x,y:a.y-c,width:l||50,height:c*1.2}}default:return null}}drawResizeHandles(){let t=this.getSelectedShape();if(!t)return;let e=this.getShapeBounds(t);if(!e)return;let n=this.annotationTool.ctx,a=this.handleSize,r=a/2,c=[{pos:"nw",x:e.x,y:e.y},{pos:"n",x:e.x+e.width/2,y:e.y},{pos:"ne",x:e.x+e.width,y:e.y},{pos:"e",x:e.x+e.width,y:e.y+e.height/2},{pos:"se",x:e.x+e.width,y:e.y+e.height},{pos:"s",x:e.x+e.width/2,y:e.y+e.height},{pos:"sw",x:e.x,y:e.y+e.height},{pos:"w",x:e.x,y:e.y+e.height/2}];n.save(),n.strokeStyle="#5b9fff",n.lineWidth=1,n.setLineDash([4,4]),n.strokeRect(e.x,e.y,e.width,e.height),n.setLineDash([]),n.fillStyle="#ffffff",n.strokeStyle="#5b9fff",n.lineWidth=1;for(let l of c)n.fillRect(l.x-r,l.y-r,a,a),n.strokeRect(l.x-r,l.y-r,a,a);n.restore(),this.drawRotationHandles(e)}getShapeRotationCenter(t,e){return t.rotationCenterX!==void 0&&t.rotationCenterY!==void 0?{x:t.rotationCenterX*this.annotationTool.canvasWidth,y:t.rotationCenterY*this.annotationTool.canvasHeight}:{x:e.x+e.width/2,y:e.y+e.height/2}}drawRotationHandles(t){var h;let e=this.getSelectedShape();if(!e)return;let n=this.annotationTool.ctx,a=this.getShapeRotationCenter(e,t),r=(h=e.rotation)!=null?h:0,c=a.x+Math.sin(r)*this.rotationHandleDistance,l=a.y-Math.cos(r)*this.rotationHandleDistance;n.save(),n.beginPath(),n.strokeStyle="#5b9fff",n.lineWidth=1,n.setLineDash([]),n.moveTo(a.x,a.y),n.lineTo(c,l),n.stroke();let s=6;n.beginPath(),n.strokeStyle="#5b9fff",n.lineWidth=1.5,n.moveTo(a.x-s,a.y),n.lineTo(a.x+s,a.y),n.moveTo(a.x,a.y-s),n.lineTo(a.x,a.y+s),n.stroke(),n.beginPath(),n.fillStyle="#ffffff",n.strokeStyle="#5b9fff",n.lineWidth=1.5,n.arc(a.x,a.y,4,0,Math.PI*2),n.fill(),n.stroke(),n.beginPath(),n.fillStyle="#ffffff",n.strokeStyle="#5b9fff",n.lineWidth=1.5,n.arc(c,l,6,0,Math.PI*2),n.fill(),n.stroke(),n.beginPath(),n.strokeStyle="#5b9fff",n.lineWidth=1,n.arc(c,l,3,-Math.PI*.7,Math.PI*.5),n.stroke(),n.restore()}isPointerAtRotationHandle(t,e){var g;let n=this.getSelectedShape();if(!n)return!1;let a=this.getShapeBounds(n);if(!a)return!1;let r=this.getShapeRotationCenter(n,a),c=(g=n.rotation)!=null?g:0,l=r.x+Math.sin(c)*this.rotationHandleDistance,s=r.y-Math.cos(c)*this.rotationHandleDistance,h=t-l,u=e-s;return Math.sqrt(h*h+u*u)<=12}isPointerAtRotationCenter(t,e){let n=this.getSelectedShape();if(!n)return!1;let a=this.getShapeBounds(n);if(!a)return!1;let r=this.getShapeRotationCenter(n,a),c=t-r.x,l=e-r.y;return Math.sqrt(c*c+l*l)<=10}calculateAngle(t,e,n,a){return Math.atan2(n-t,-(a-e))}getHandleAtPosition(t,e){let n=this.getSelectedShape();if(!n)return null;let a=this.getShapeBounds(n);if(!a)return null;let c=(this.handleSize+4)/2,l=[{pos:"nw",x:a.x,y:a.y},{pos:"n",x:a.x+a.width/2,y:a.y},{pos:"ne",x:a.x+a.width,y:a.y},{pos:"e",x:a.x+a.width,y:a.y+a.height/2},{pos:"se",x:a.x+a.width,y:a.y+a.height},{pos:"s",x:a.x+a.width/2,y:a.y+a.height},{pos:"sw",x:a.x,y:a.y+a.height},{pos:"w",x:a.x,y:a.y+a.height/2}];for(let s of l)if(t>=s.x-c&&t<=s.x+c&&e>=s.y-c&&e<=s.y+c)return s.pos;return null}getCursorForHandle(t){return{nw:"nw-resize",n:"n-resize",ne:"ne-resize",e:"e-resize",se:"se-resize",s:"s-resize",sw:"sw-resize",w:"w-resize"}[t]}resizeShape(t,e,n,a,r,c=!1){var y;if(!this.resizeOriginalShape)return;let l=this.annotationTool.deserialize([this.resizeOriginalShape])[0],s=r.x,h=r.y,u=r.width,p=r.height;switch(e){case"nw":s+=n,h+=a,u-=n,p-=a;break;case"n":h+=a,p-=a;break;case"ne":h+=a,u+=n,p-=a;break;case"e":u+=n;break;case"se":u+=n,p+=a;break;case"s":p+=a;break;case"sw":s+=n,u-=n,p+=a;break;case"w":s+=n,u-=n;break}if(c&&r.width>0&&r.height>0){let f=r.width/r.height;if(e==="n"||e==="s"){let m=p*f,x=m-u;u=m,s-=x/2}else if(e==="e"||e==="w"){let m=u/f,x=m-p;p=m,h-=x/2}else{let m=u/r.width,x=p/r.height,w=Math.max(Math.abs(m),Math.abs(x)),C=m>=0?1:-1,S=x>=0?1:-1,E=r.width*w*C,P=r.height*w*S;e==="nw"?(s=r.x+r.width-E,h=r.y+r.height-P):e==="ne"?h=r.y+r.height-P:e==="sw"&&(s=r.x+r.width-E),u=E,p=P}}let g=10;u<g&&(e.includes("w")&&(s=r.x+r.width-g),u=g),p<g&&(e.includes("n")&&(h=r.y+r.height-g),p=g);let v=r.width>0?u/r.width:1,b=r.height>0?p/r.height:1;switch(l.type){case"rectangle":{let f=t;f.x=s/this.annotationTool.canvasWidth,f.y=h/this.annotationTool.canvasHeight,f.width=u/this.annotationTool.canvasWidth,f.height=p/this.annotationTool.canvasHeight;break}case"selection":{let f=t;f.x=s/this.annotationTool.canvasWidth,f.y=h/this.annotationTool.canvasHeight,f.width=u/this.annotationTool.canvasWidth,f.height=p/this.annotationTool.canvasHeight;break}case"circle":{let f=t,m=Math.min(u,p)/2,x=s+u/2,w=h+p/2;f.x=x/this.annotationTool.canvasWidth,f.y=w/this.annotationTool.canvasHeight,f.radius=m/this.annotationTool.canvasWidth;break}case"line":{let f=t,m=l,x=(m.x1-r.x)*v+s,w=(m.y1-r.y)*b+h,C=(m.x2-r.x)*v+s,S=(m.y2-r.y)*b+h;f.x1=x/this.annotationTool.canvasWidth,f.y1=w/this.annotationTool.canvasHeight,f.x2=C/this.annotationTool.canvasWidth,f.y2=S/this.annotationTool.canvasHeight;break}case"arrow":{let f=t,m=l,x=(m.x1-r.x)*v+s,w=(m.y1-r.y)*b+h,C=(m.x2-r.x)*v+s,S=(m.y2-r.y)*b+h;f.x1=x/this.annotationTool.canvasWidth,f.y1=w/this.annotationTool.canvasHeight,f.x2=C/this.annotationTool.canvasWidth,f.y2=S/this.annotationTool.canvasHeight;break}case"curve":{let f=t,m=l;if(!m.points||m.points.length===0)break;f.points=m.points.map(x=>({x:((x.x-r.x)*v+s)/this.annotationTool.canvasWidth,y:((x.y-r.y)*b+h)/this.annotationTool.canvasHeight}));break}case"text":{let f=t,m=l,w=16+((y=this.resizeOriginalShape.lineWidth)!=null?y:1)*.5,C=(m.x-r.x)*v+s,S=(m.y-r.y)*b+h;f.x=C/this.annotationTool.canvasWidth,f.y=S/this.annotationTool.canvasHeight;let E=(v+b)/2,P=w*E;f.lineWidth=Math.max(1,(P-16)*2);break}case"image":{let f=t;f.x=s/this.annotationTool.canvasWidth,f.y=h/this.annotationTool.canvasHeight,f.width=u/this.annotationTool.canvasWidth,f.height=p/this.annotationTool.canvasHeight;break}}}deleteSelectedShape(){this.selectedShapeIndex<0||this.selectedShapeIndex>=this.annotationTool.shapes.length||(this.annotationTool.undoStack.push([...this.annotationTool.shapes]),this.annotationTool.shapes.splice(this.selectedShapeIndex,1),this.selectedShapeIndex=-1,this.shapeIndex=-1,this.annotationTool.redrawFullCanvas())}onPointerDown(t){var s;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);if(this.selectedShapeIndex>=0&&this.isPointerAtRotationHandle(e,n)){let h=this.getSelectedShape();if(h){let u=this.getShapeBounds(h);if(u){let p=this.getShapeRotationCenter(h,u);this.rotationActive=!0,this.rotationStartAngle=this.calculateAngle(p.x,p.y,e,n),this.rotationShapeStartAngle=(s=h.rotation)!=null?s:0,this.isDrawing=!0,this.annotationTool.undoStack.push([...this.annotationTool.shapes]),this.annotationTool.canvas.style.cursor="grabbing";return}}}if(this.selectedShapeIndex>=0&&this.isPointerAtRotationCenter(e,n)){this.centerDragActive=!0,this.startX=e,this.startY=n,this.isDrawing=!0,this.annotationTool.undoStack.push([...this.annotationTool.shapes]),this.annotationTool.canvas.style.cursor="move";return}let a=this.getHandleAtPosition(e,n);if(a&&this.selectedShapeIndex>=0){this.activeHandle=a,this.startX=e,this.startY=n,this.isDrawing=!0;let h=this.getSelectedShape();h&&(this.resizeStartBounds=this.getShapeBounds(h),this.resizeOriginalShape=this.cloneShape(h),this.annotationTool.undoStack.push([...this.annotationTool.shapes])),this.annotationTool.canvas.style.cursor=this.getCursorForHandle(a);return}let r=this.annotationTool.shapes,c=r.slice().reverse(),l=!1;for(let h of c)if(this.isPointerAtShape(h,e,n)){this.shape=this.cloneShape(h),this.shapeIndex=r.indexOf(h),this.selectedShapeIndex=this.shapeIndex,l=!0;break}l||(this.selectedShapeIndex=-1,this.annotationTool.redrawFullCanvas()),this.shape&&(this.lastDrawnShape=null,this.startX=e,this.startY=n,this.isDrawing=!0,this.isScale=this.shape.type==="image"?this.isPointerAtCorner(this.shape,e,n):!1,this.isScale?this.annotationTool.canvas.style.cursor="nw-resize":this.annotationTool.canvas.style.cursor="move")}isPointerAtShape(t,e,n){let a=this.annotationTool.deserialize([t])[0];if(a.rotation){let c=this.getShapeBounds(t);if(c){let l=this.getShapeRotationCenter(t,c),s=Math.cos(-a.rotation),h=Math.sin(-a.rotation),u=e-l.x,p=n-l.y;e=l.x+u*s-p*h,n=l.y+u*h+p*s}}return this.annotationTool.pluginForTool(a.type).isPointerAtShape(a,e,n)}isPointerAtCorner(t,e,n){if(!("type"in t))return!1;let a=this.annotationTool.deserialize([t])[0],r=15,c=Math.abs(a.y-n)<r,l=Math.abs(a.x-e)<r,s=Math.abs(a.x+a.width-e)<r,h=Math.abs(a.y+a.height-n)<r;return c&&l||c&&s||h&&l||h&&s}onPointerMove(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);if(this.isDrawing&&this.rotationActive){let s=this.annotationTool.shapes[this.selectedShapeIndex];if(s){let h=this.getShapeBounds(s);if(h){let u=this.getShapeRotationCenter(s,h),p=this.calculateAngle(u.x,u.y,e,n),g=this.rotationShapeStartAngle+(p-this.rotationStartAngle);if(t.shiftKey){let v=Math.PI/12;g=Math.round(g/v)*v}s.rotation=g,this.annotationTool.redrawFullCanvas()}}return}if(this.isDrawing&&this.centerDragActive){let s=this.annotationTool.shapes[this.selectedShapeIndex];s&&(s.rotationCenterX=e/this.annotationTool.canvasWidth,s.rotationCenterY=n/this.annotationTool.canvasHeight,this.annotationTool.redrawFullCanvas());return}if(this.isDrawing&&this.activeHandle&&this.resizeStartBounds){let s=e-this.startX,h=n-this.startY,u=this.annotationTool.shapes[this.selectedShapeIndex];u&&(this.resizeShape(u,this.activeHandle,s,h,this.resizeStartBounds,t.shiftKey),this.annotationTool.redrawFullCanvas());return}if(!this.isDrawing&&this.selectedShapeIndex>=0){if(this.isPointerAtRotationHandle(e,n)){this.annotationTool.canvas.style.cursor="grab";return}if(this.isPointerAtRotationCenter(e,n)){this.annotationTool.canvas.style.cursor="move";return}let s=this.getHandleAtPosition(e,n);if(s){this.annotationTool.canvas.style.cursor=this.getCursorForHandle(s);return}}if(!this.isDrawing||!this.shape){this.isDrawing||(this.annotationTool.canvas.style.cursor="default");return}let a=e-this.startX,r=n-this.startY;this.startX=e-a,this.startY=n-r;let c=this.annotationTool.deserialize([this.shape])[0],l=c.type==="image"?c:JSON.parse(JSON.stringify(c));if(l.type!=="audio-peaks")if(l.type==="image")if(this.isScale){let{width:s,height:h}=l,u=s/h,p=s+a,g=p/u;l.width=p,l.height=g,this.lastDrawnShape=l,this.annotationTool.pluginForTool(l.type).draw(l)}else{let s=this.annotationTool.pluginForTool(l.type).move(l,a,r);this.lastDrawnShape=s,this.annotationTool.pluginForTool(l.type).draw(s)}else{let s=this.annotationTool.pluginForTool(l.type).move(l,a,r);this.lastDrawnShape=s,this.annotationTool.pluginForTool(l.type).draw(s)}}onPointerUp(t){if(this.rotationActive){this.rotationActive=!1,this.isDrawing=!1,this.annotationTool.canvas.style.cursor="default",this.annotationTool.redrawFullCanvas();return}if(this.centerDragActive){this.centerDragActive=!1,this.isDrawing=!1,this.annotationTool.canvas.style.cursor="default",this.annotationTool.redrawFullCanvas();return}if(this.activeHandle){this.activeHandle=null,this.resizeStartBounds=null,this.resizeOriginalShape=null,this.isDrawing=!1,this.annotationTool.canvas.style.cursor="default",this.annotationTool.redrawFullCanvas();return}if(!this.isDrawing||!this.lastDrawnShape){this.isDrawing=!1,this.annotationTool.redrawFullCanvas();return}this.lastDrawnShape&&this.shape&&(this.lastDrawnShape.fillStyle=this.shape.fillStyle,this.lastDrawnShape.strokeStyle=this.shape.strokeStyle,this.lastDrawnShape.lineWidth=this.shape.lineWidth,this.shape.opacity!==void 0&&(this.lastDrawnShape.opacity=this.shape.opacity),this.save(this.lastDrawnShape)),this.isDrawing=!1,this.isScale=!1,this.shape=null,this.lastDrawnShape=null,this.annotationTool.canvas.style.cursor="default",this.annotationTool.redrawFullCanvas()}draw(){throw new Error("Method not implemented.")}reset(){this.isDrawing=!1,this.shape=null,this.isScale=!1,this.lastDrawnShape=null,this.shapeIndex=-1,this.selectedShapeIndex=-1,this.activeHandle=null,this.resizeStartBounds=null,this.resizeOriginalShape=null,this.rotationActive=!1,this.centerDragActive=!1,this.annotationTool.canvas.style.cursor="default"}save(t){this.annotationTool.replaceShape(t,this.shapeIndex)}};var pt=class extends k{constructor(){super(...arguments);this.name="image"}move(t,e,n){return t.x+=e,t.y+=n,t}onPointerDown(t){}onPointerMove(t){}onPointerUp(t){}normalize(t,e,n){return M(T({},t),{x:t.x/e,y:t.y/n,width:t.width/e,height:t.height/n})}draw(t){if(!(t.image instanceof HTMLImageElement)){console.error("Image is not an instance of HTMLImageElement");return}if(t.width===0||t.height===0)return;let e=t.x+t.width/2,n=t.y+t.height/2,a=this.getRotationCenter(t,e,n),r=this.applyRotation(t,a.x,a.y);this.ctx.drawImage(t.image,t.x,t.y,t.width,t.height),r&&this.restoreRotation()}isPointerAtShape(t,e,n){let a=Math.min(t.x,t.x+t.width),r=Math.max(t.x,t.x+t.width),c=Math.min(t.y,t.y+t.height),l=Math.max(t.y,t.y+t.height);return e>=a&&e<=r&&n>=c&&n<=l}};var mt=class extends k{constructor(){super(...arguments);this.name="compare";this.comparisonLine=0;this.leftOpacity=1;this.isDrawing=!1}get rightOpacity(){return this.annotationTool.overlayOpacity}move(t,e,n){return t.x+=e,t}onActivate(){this.comparisonLine=this.annotationTool.canvasWidth/2,this.leftOpacity=1,this.annotationTool.canvas.style.cursor="col-resize"}onDeactivate(){this.annotationTool.canvas.style.cursor="default",this.comparisonLine=0,this.leftOpacity=1,this.isDrawing=!1}normalize(t,e,n){return M(T({},t),{x:t.x/e})}onPointerDown(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.startX=e,this.startY=n,this.isDrawing=!0,this.disablePreviousCompare(),this.onPointerMove(t)}onPointerMove(t){if(!this.isDrawing){if(this.annotationTool.globalShapes.length>0){let a=this.annotationTool.globalShapes[0];if(a.type==="compare"){let r=this.annotationTool.deserialize([a])[0];this.draw(r),this.annotationTool.addFrameSquareOverlay()}}return}let{x:e}=this.annotationTool.getRelativeCoords(t);this.comparisonLine=e;let n={type:"compare",strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth,x:e};this.draw(n),this.drawDelimiter(n)}onPointerUp(){this.isDrawing&&(this.save({type:"compare",strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth,disabled:!1,x:this.comparisonLine}),this.isDrawing=!1)}removePreviousCompare(){this.annotationTool.globalShapes=this.annotationTool.globalShapes.filter(t=>t.type!=="compare")}disablePreviousCompare(){this.annotationTool.globalShapes=this.annotationTool.globalShapes.map(t=>t.type==="compare"?M(T({},t),{disabled:!0}):t)}save(t){this.removePreviousCompare();let e=this.annotationTool.serialize([t])[0];e.x<.05||e.x>.95||this.annotationTool.addGlobalShape(e)}drawDelimiter(t){this.ctx.beginPath(),this.ctx.moveTo(t.x,0),this.ctx.lineTo(t.x,this.annotationTool.canvasWidth),this.ctx.stroke()}drawShape(t){var zt,Vt,Wt,Xt,Yt,Nt,Ut,jt;let e=this.annotationTool.videoElement,n=this.annotationTool.referenceVideoElement;if(!e||!n)return;let a=this.ctx.globalAlpha,r=this.annotationTool.canvasWidth,c=this.annotationTool.canvasHeight,l=t.x,s=n.videoHeight-e.videoHeight,h=n.videoWidth-e.videoWidth,u=this.annotationTool.isMobile;this.ctx.globalAlpha=this.leftOpacity;let p=(Vt=(zt=this.annotationTool.referenceVideoFrameBuffer)==null?void 0:zt.frameNumberFromTime(e.currentTime))!=null?Vt:1,g=p;if(h>e.videoWidth&&s>e.videoHeight&&!this.annotationTool.isMobile){let $=(Nt=(Yt=this.annotationTool.referenceVideoFrameBuffer)==null?void 0:Yt.getFrameNumberBySignature((Xt=(Wt=this.annotationTool.videoFrameBuffer)==null?void 0:Wt.getAudioFingerprint(p))!=null?Xt:null,p))!=null?Nt:p,G=Math.abs(p-$);G>=1&&G<=3&&(g=$)}let b=(Ut=this.annotationTool.referenceVideoFrameBuffer)==null?void 0:Ut.getFrame(g),y=(jt=this.annotationTool.videoFrameBuffer)==null?void 0:jt.getFrame(p);if(u){this.ctx.imageSmoothingQuality="low";let $=l/r,G=l;this.ctx.drawImage(y!=null?y:e,0,0,$*e.videoWidth,e.videoHeight,0,0,G,c)}else{let $=y?y.width:e.videoWidth,G=y?y.height:e.videoHeight;this.ctx.drawImage(y!=null?y:e,0,0,$,G,0,0,r,c)}this.ctx.globalAlpha=this.rightOpacity;let f=0,m=0,x=e.videoWidth/e.videoHeight,w=n.videoWidth/n.videoHeight,S=Math.abs(x-w)>.1,E=10,P=Math.abs(s)>E,L=e.videoWidth,R=e.videoHeight,H=0;if(h<-E)if(S){let $=e.videoWidth/r;H=Math.abs(h/2),H=H/$,H<=E&&(H=0)}else L=n.videoWidth;else h>E&&(L=n.videoWidth);if(s===0)f=0;else if(s>0)S?(f=s/2,f<=E&&(f=0)):R=P?n.videoHeight:e.videoHeight;else if(!S)R=P?n.videoHeight:e.videoHeight;else{m=Math.abs(s/2);let $=e.videoHeight/c;m=m/$,m<=E&&(m=0)}let Et=l-H,Ot=r-Et,Ye=Ot/r*L;b&&this.rightOpacity>0&&(u&&(this.ctx.imageSmoothingQuality="low"),this.ctx.drawImage(b,Et/r*L,f,Ye,R,Et+H,m,Ot,c)),this.ctx.globalAlpha=a}draw(t){if(t.disabled)return;let e=this.annotationTool.videoElement,n=this.annotationTool.referenceVideoElement;!e||!n||this.drawShape(t)}};function yn(i){let o=i[0],t=i[0];for(let e=1;e<i.length;e++)i[e]<o&&(o=i[e]),i[e]>t&&(t=i[e]);return[o,t]}var gt=class extends k{constructor(t){super(t);this.name="audio-peaks";this.canvas=document.createElement("canvas");this.props={peaks:new Int8Array,theme:{waveOutlineColor:"rgba(255,192,203,0.7)",waveFillColor:"grey",waveProgressColor:"orange"},waveHeight:40,bits:16};this.drawCtx=this.canvas.getContext("2d")}onVideoBlobSet(t){return I(this,null,function*(){let e=yield t.arrayBuffer();this.init(e)})}on(t,e){t==="videoBlobSet"&&this.onVideoBlobSet(e)}extractPeaks(t){return I(this,null,function*(){let{default:e}=yield Promise.resolve().then(()=>Qe(Ie(),1)),n=this.progressBarCoordinates.width,a=Math.ceil(t.length/n);return e(t,a,!0)})}setProps(t){let[e,n]=yn(t.data[0]),a=Math.pow(2,t.bits-1)-1,r=-Math.pow(2,t.bits-1);this.props.peaks=t.data[0].map(c=>c<0?Math.round(c/e*r):Math.round(c/n*a)),this.props.bits=t.bits}init(t){return I(this,null,function*(){try{let n=yield new AudioContext().decodeAudioData(t),a=yield this.extractPeaks(n);this.initCanvas(),this.setProps(a),this.annotationTool.removeGlobalShape("audio-peaks"),this.annotationTool.addGlobalShape({x:0,y:0,strokeStyle:"red",fillStyle:"red",lineWidth:1,type:"audio-peaks"}),this.clearLocalCanvas(),this.drawOnCanvas()}catch(e){this.initCanvas(),this.props.peaks=new Int8Array,this.annotationTool.removeGlobalShape("audio-peaks"),this.clearLocalCanvas(),console.error(e)}})}initCanvas(){this.canvas.width=this.progressBarCoordinates.width*this.pixelRatio,this.canvas.height=this.props.waveHeight*this.pixelRatio,this.drawCtx.scale(this.pixelRatio,this.pixelRatio)}move(t,e,n){return t.x+=e,t.y+=n,t}normalize(t,e,n){return M(T({},t),{x:t.x/e,y:t.y/n})}onPointerDown(t){}onPointerMove(t){}onPointerUp(t){}reset(){this.clearLocalCanvas(),this.props.peaks=new Int8Array,this.annotationTool.removeGlobalShape("audio-peaks")}draw(t){let e=this.annotationTool.videoElement;if(!e||e.tagName!=="VIDEO"||e.muted||e.volume===0)return;this.ctx.clearRect(0,0,this.annotationTool.canvasWidth,this.annotationTool.canvasHeight);let{waveHeight:a,theme:r}=this.props,c=this.ctx,l=a/2,s=this.progressBarCoordinates.y-20,{x:h,width:u}=this.progressBarCoordinates,p=this.annotationTool.playbackFrame,g=this.annotationTool.totalFrames,v=Math.ceil(p/g*u)+h;this.ctx.drawImage(this.canvas,h,s,u,a),c.fillStyle=r.waveProgressColor,c.fillRect(v,s+0,1,l*2)}get pixelRatio(){return this.annotationTool.pixelRatio}get progressBarCoordinates(){return this.annotationTool.progressBarCoordinates}clearLocalCanvas(){this.drawCtx.clearRect(0,0,this.canvas.width,this.canvas.height)}drawOnCanvas(){let{peaks:t,bits:e,waveHeight:n,theme:a}=this.props,r=this.drawCtx,c=0,l=0,s=n/2,h=O(2,e-1),u=0,p=t.length;r.fillStyle=a.waveOutlineColor;for(let g=0;g<p;g+=1){let v=t[(g+c)*2+1]/h,b=Math.abs(v*s);r.fillRect(g+l,u+0+s-b,1,b)}}};var vt=class extends k{constructor(){super(...arguments);this.name="selection";this.selectedArea=null}move(t,e,n){return t.x+=e,t.y+=n,t}normalize(t,e,n){return M(T({},t),{x:t.x/e,y:t.y/n,width:t.width/e,height:t.height/n})}onPointerDown(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.startX=e,this.startY=n,this.isDrawing=!0,this.selectedArea=null}onPointerMove(t){if(!this.isDrawing)return;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.annotationTool.clearCanvas(),this.annotationTool.globalShapes.length>0?this.annotationTool.drawShapesOverlay():this.annotationTool.addVideoOverlay(),this.drawSelectionRect(this.startX,this.startY,e-this.startX,n-this.startY)}onPointerUp(t){if(!this.isDrawing)return;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t),a=Math.min(e,this.startX),r=Math.min(n,this.startY),c=Math.abs(e-this.startX),l=Math.abs(n-this.startY);if(c<1||l<1){this.isDrawing=!1,this.annotationTool.redrawFullCanvas();return}let s=document.createElement("canvas"),h=s.getContext("2d"),u=this.annotationTool.videoElement;if(!(u instanceof HTMLVideoElement))return;let p=u.videoWidth/u.videoHeight,g=this.annotationTool.canvasWidth/this.annotationTool.canvasHeight,v=this.annotationTool.canvasWidth,b=this.annotationTool.canvasHeight,y=0,f=0;p>g?(b=this.annotationTool.canvasWidth/p,f=(this.annotationTool.canvasHeight-b)/2):(v=this.annotationTool.canvasHeight*p,y=(this.annotationTool.canvasWidth-v)/2);let m=u.videoWidth/v,x=u.videoHeight/b,w=(a-y)*m,C=(r-f)*x,S=c*m,E=l*x;s.width=Math.max(1,S),s.height=Math.max(1,E);try{h.drawImage(this.annotationTool.videoElement,w,C,S,E,0,0,S,E);let P=h.getImageData(0,0,s.width,s.height);this.selectedArea=P;let L=document.createElement("canvas");L.width=S+4,L.height=E+4,L.style.width=`${c+4}px`,L.style.height=`${l+4}px`;let R=L.getContext("2d");R.strokeStyle="black",R.lineWidth=2,R.strokeRect(1,1,S+2,E+2),R.strokeStyle="black",R.lineWidth=2,R.strokeRect(2,2,S,E),R.putImageData(P,2,2);let H=new Image;H.onload=()=>{this.annotationTool.pluginForTool("image").save({type:"image",x:a-2,y:r-2,width:c+4,height:l+4,image:H,strokeStyle:"transparent",fillStyle:"transparent",lineWidth:0}),this.isDrawing=!1,this.selectedArea=null,this.annotationTool.redrawFullCanvas()},H.src=L.toDataURL(),this.annotationTool.currentTool="move"}catch(P){console.error("Error capturing selection:",P),this.isDrawing=!1,this.annotationTool.redrawFullCanvas();return}}drawSelectionRect(t,e,n,a){var g,v,b;let r=Math.min(t,t+n),c=Math.min(e,e+a),l=Math.abs(n),s=Math.abs(a),h=this.annotationTool.pixelRatio,u=null;if(l>0&&s>0)try{u=this.ctx.getImageData(r*h,c*h,l*h,s*h)}catch(y){u=null}if(this.ctx.fillStyle="rgba(0, 0, 0, 0.5)",this.ctx.fillRect(0,0,this.annotationTool.canvasWidth,this.annotationTool.canvasHeight),u&&l>0&&s>0)this.ctx.putImageData(u,r*h,c*h);else if(l>0&&s>0){let y=this.annotationTool.videoElement;if(y instanceof HTMLVideoElement){let f=(g=this.annotationTool.videoFrameBuffer)==null?void 0:g.frameNumberFromTime(y.currentTime),m=(b=(v=this.annotationTool.videoFrameBuffer)==null?void 0:v.getFrame(f||0))!=null?b:y,x=m?m.width:y.videoWidth,w=m?m.height:y.videoHeight,C=x/this.annotationTool.canvasWidth,S=w/this.annotationTool.canvasHeight;this.ctx.drawImage(m,r*C,c*S,l*C,s*S,r,c,l,s)}}this.ctx.beginPath();let p=this.ctx.strokeStyle;this.ctx.strokeStyle="#ffffff",this.ctx.lineWidth=2,this.ctx.setLineDash([5,5]),this.ctx.strokeRect(r,c,l,s),this.ctx.setLineDash([]),this.ctx.strokeStyle=p}draw(t){this.drawSelectionRect(t.x,t.y,t.width,t.height)}reset(){super.reset(),this.selectedArea=null}isPointerAtShape(t,e,n){let a=Math.min(t.x,t.x+t.width),r=Math.max(t.x,t.x+t.width),c=Math.min(t.y,t.y+t.height),l=Math.max(t.y,t.y+t.height);return e>=a&&e<=r&&n>=c&&n<=l}};var Pe=[ot,it,lt,ct,ht,dt,st,ut,pt,mt,gt,vt];function Fe(i,o){let t,e,n,a=[],r=!0,c=!1;function l(u,p){if(c)return;let g=Math.abs(p.mediaTime-t),v=Math.abs(p.presentedFrames-e),b=g/v;b&&b<1&&r&&a.length<50&&i.playbackRate===1&&document.hasFocus()&&(a.push(b),n=Math.round(1/h()),o(n,a.length*2)),r=!0,t=p.mediaTime,e=p.presentedFrames,c||i.requestVideoFrameCallback(l)}i.requestVideoFrameCallback(l);let s=()=>{a.pop(),r=!1};i.addEventListener("seeked",s);function h(){return a.reduce((u,p)=>u+p)/a.length}return()=>{c=!0,i.removeEventListener("seeked",s)}}var xt=class xt extends Array{constructor(...o){super(...o),this.id=xt.nextId++}};xt.nextId=0;var Pt=xt,Ae=new Map;function xn(i,o){return`${Math.min(i.id,o.id)}-${Math.max(i.id,o.id)}`}function Ft(i,o){let t=xn(i,o),e=Ae.get(t);if(e!==void 0)return e;if(i.length===0||o.length===0)return 0;let n=Math.min(i.length,o.length),a=0,r=0;for(let p=0;p<n;p++)a+=i[p],r+=o[p];a/=n,r/=n;let c=0,l=0,s=0;for(let p=0;p<n;p++){let g=i[p]-a,v=o[p]-r;c+=g*v,l+=g*g,s+=v*v}let h=Math.sqrt(l*s),u=h===0?0:(c/h+1)/2;return Ae.set(t,u),u}var Le=128,yt=class{constructor(o,t){this.video=o;this.fps=t;this.audioContext=null;this.audioBuffer=null;this.fingerprints=new Map;this.isInitialized=!1;this.initPromise=null}init(){return I(this,null,function*(){if(!this.isInitialized)return this.initPromise?this.initPromise:(this.initPromise=this.doInit(),this.initPromise)})}doInit(){return I(this,null,function*(){try{let e=yield(yield(yield fetch(this.video.currentSrc||this.video.src)).blob()).arrayBuffer();this.audioContext=new AudioContext,this.audioBuffer=yield this.audioContext.decodeAudioData(e),this.isInitialized=!0}catch(o){console.warn("Could not extract audio for fingerprinting:",o),this.isInitialized=!0,this.audioBuffer=null}})}hasAudio(){return this.audioBuffer!==null}get totalFrames(){return Math.round(this.video.duration*this.fps)}extractFingerprint(o){if(!this.audioBuffer)return null;let t=(o-1)/this.fps,e=1/this.fps,n=this.audioBuffer.sampleRate,a=Math.floor(t*n),c=Math.floor((t+e)*n)-a;if(c<=0||a>=this.audioBuffer.length)return null;let l=this.audioBuffer.getChannelData(0),s=new Pt,h=Math.max(1,Math.floor(c/Le));for(let u=0;u<Le;u++){let p=a+u*h,g=Math.min(p+h,this.audioBuffer.length),v=0,b=0;for(let f=p;f<g;f++)f<l.length&&(v+=l[f]*l[f],b++);let y=b>0?Math.sqrt(v/b):0;s.push(y)}return s}getFingerprint(o){if(this.fingerprints.has(o))return this.fingerprints.get(o);let t=this.extractFingerprint(o);return t&&this.fingerprints.set(o,t),t}extractRange(o,t){for(let e=o;e<=t;e++)this.getFingerprint(e)}setFingerprint(o,t){this.fingerprints.set(o,t)}findBestMatch(o,t,e=3){if(!o||!(this.fingerprints.size>0)&&!this.hasAudio())return t;let a=0,r=t,c=Math.max(1,t-e),l=Math.min(this.totalFrames,t+e);for(let s=c;s<=l;s++){let h=this.getFingerprint(s);if(h){let u=Ft(o,h);u>a&&(a=u,r=s)}}return r}destroy(){this.fingerprints.clear(),this.audioContext&&(this.audioContext.close().catch(()=>{}),this.audioContext=null),this.audioBuffer=null,this.isInitialized=!1,this.initPromise=null}};var Re=64,W=class{constructor(o,t,e=!0){this.isDestroyed=!1;this.autoHide=!0;this.isMobile=!1;this.audioExtractor=null;this.audioInitPromise=null;this.seenFrames=0;this.isCanvasSizeSet=!1;this.frames=new Map;this.audioFingerprints=new Map;this.video=o,this.fps=t,this.autoHide=e,this.createCanvas(),this.createTransformCanvas()}createTransformCanvas(){this.transformCanvas=document.createElement("canvas"),this.transformCanvasCtx=this.canvas.getContext("2d",{willReadFrequently:!0,alpha:!1}),this.transformCanvas.width=Re,this.transformCanvas.height=Re}initAudioSync(){return I(this,null,function*(){var o;return this.audioExtractor?(o=this.audioInitPromise)!=null?o:Promise.resolve():(this.audioExtractor=new yt(this.video,this.fps),this.audioInitPromise=this.audioExtractor.init(),this.audioInitPromise)})}hasAudioSync(){var o,t;return(t=(o=this.audioExtractor)==null?void 0:o.hasAudio())!=null?t:!1}start(){this.addRequestFrameCallback(),this.isMobile||this.initAudioSync().catch(()=>{})}destroy(){this.isDestroyed=!0,this.frames.forEach(o=>o.close()),this.frames.clear(),this.audioFingerprints.clear(),this.audioExtractor&&(this.audioExtractor.destroy(),this.audioExtractor=null),this.audioInitPromise=null}tick(o,t){if(this.setCanvasSize(),t.expectedDisplayTime-performance.now()>10,this.isDestroyed)return!1;if(this.seenFrames>=this.totalFrames){if(this.autoHide)try{this.video.paused||this.video.pause(),this.video.style.display="none"}catch(c){}return!1}if(this.video.videoWidth===0||this.video.videoHeight===0)return!0;let n=this.video,a=this.frameNumberFromTime(t.mediaTime);if(!Math.max(1,t.presentedFrames>this.totalFrames?t.presentedFrames%this.totalFrames:t.presentedFrames))throw new Error("expectedFrame is 0");if(this.hasFrame(a))this.seenFrames++;else{this.ctx.drawImage(n,0,0,this.width,this.height,0,0,this.width,this.height);let c=this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height);createImageBitmap(c,0,0,this.width,this.height).then(l=>I(this,null,function*(){var s;if(this.setFrame(a,l),!this.isMobile&&((s=this.audioExtractor)!=null&&s.hasAudio())){let h=this.audioExtractor.getFingerprint(a);h&&this.setAudioFingerprint(a,h)}}))}return!0}addRequestFrameCallback(){this.isDestroyed||this.video.requestVideoFrameCallback((o,t)=>{this.tick(o,t)&&this.addRequestFrameCallback()})}createCanvas(){this.canvas=document.createElement("canvas"),this.ctx=this.canvas.getContext("2d",{willReadFrequently:!0,alpha:!1})}setCanvasSize(){this.isCanvasSizeSet||(this.canvas.width=this.video.videoWidth,this.canvas.height=this.video.videoHeight,this.isCanvasSizeSet=!0)}get width(){return this.video.videoWidth}get height(){return this.video.videoHeight}hasFrame(o){return this.frames.has(o)}getFrame(o){return this.frames.has(o)?this.frames.get(o):null}getFrameNumberBySignature(o,t){if(!o)return t;let e=0,n=t;return[t-3,t-2,t-1,t,t+1,t+2,t+3].filter(r=>r>0&&r<=this.totalFrames).forEach(r=>{let c=this.getAudioFingerprint(r);if(c){let l=Ft(o,c);l>e&&(e=l,n=r)}}),n}setFrame(o,t){this.frames.set(o,t)}setAudioFingerprint(o,t){this.audioFingerprints.set(o,t)}getAudioFingerprint(o){var t;if(this.audioFingerprints.has(o))return this.audioFingerprints.get(o);if((t=this.audioExtractor)!=null&&t.hasAudio()){let e=this.audioExtractor.getFingerprint(o);if(e)return this.audioFingerprints.set(o,e),e}return null}get totalFrames(){return Math.round(this.video.duration*this.fps)}frameNumberFromTime(o){return Math.max(1,Math.round(o*this.fps))}};var X={layout:"horizontal",mobile:{collapsibleToolbars:!0,gesturesEnabled:!0,autoCollapse:!0,breakpoint:960},theme:"dark",toolbar:{draggable:!1,sidebarPosition:"left",defaultTool:"curve"},features:{showThemeToggle:!0,showFullscreen:!0,showProgressBar:!0,showFrameCounter:!0}};function He(i){var o,t;return i?{layout:(o=i.layout)!=null?o:X.layout,theme:(t=i.theme)!=null?t:X.theme,mobile:T(T({},X.mobile),i.mobile),toolbar:T(T({},X.toolbar),i.toolbar),features:T(T({},X.features),i.features)}:T({},X)}var Z=class{constructor(o){this.tool=o;this.currentRenderer=null;this.rootElement=null;this.prefix=q()}getRootElement(){if(!this.rootElement){let o=this.tool.canvas;o!=null&&o.parentElement&&(this.rootElement=o.parentElement,this.rootElement.classList.add(`${this.prefix}-root`))}return this.rootElement}clearLayoutClasses(){let o=this.getRootElement();o&&o.classList.remove(`${this.prefix}-layout-horizontal`,`${this.prefix}-layout-vertical`,`${this.prefix}-layout-minimal`,`${this.prefix}-layout-bottom-dock`,`${this.prefix}-sidebar-right`)}setLayout(o,t){this.currentRenderer&&this.currentRenderer.cleanup(),this.clearLayoutClasses();let e=this.getRootElement();e&&(e.classList.add(`${this.prefix}-layout-${o}`),o==="vertical"&&(t==null?void 0:t.sidebarPosition)==="right"&&e.classList.add(`${this.prefix}-sidebar-right`)),this.currentRenderer=this.createRenderer(o),this.currentRenderer.apply(this.tool)}getCurrentLayout(){var o,t;return(t=(o=this.currentRenderer)==null?void 0:o.name)!=null?t:null}createRenderer(o){switch(o){case"horizontal":return new At;case"vertical":return new Lt;case"minimal":return new Rt;case"bottom-dock":return new Ht}}destroy(){this.currentRenderer&&(this.currentRenderer.cleanup(),this.currentRenderer=null),this.clearLayoutClasses(),this.rootElement=null}},At=class{constructor(){this.name="horizontal"}apply(o){}cleanup(){}},Lt=class{constructor(){this.name="vertical"}apply(o){}cleanup(){}},Rt=class{constructor(){this.name="minimal";this.dragState={isDragging:!1,startX:0,startY:0,offsetX:0,offsetY:0};this.container=null;this.boundHandlers={};this.prefix=q()}apply(o){var e;if(this.container=o.uiContainer,!this.container)return;this.boundHandlers.mousedown=this.handleMouseDown.bind(this),this.boundHandlers.mousemove=this.handleMouseMove.bind(this),this.boundHandlers.mouseup=this.handleMouseUp.bind(this),this.container.addEventListener("mousedown",this.boundHandlers.mousedown),document.addEventListener("mousemove",this.boundHandlers.mousemove),document.addEventListener("mouseup",this.boundHandlers.mouseup);let t=o.config;(e=t==null?void 0:t.toolbar)!=null&&e.position&&(this.container.style.left=`${t.toolbar.position.x}px`,this.container.style.top=`${t.toolbar.position.y}px`)}cleanup(){this.container&&this.boundHandlers.mousedown&&this.container.removeEventListener("mousedown",this.boundHandlers.mousedown),this.boundHandlers.mousemove&&document.removeEventListener("mousemove",this.boundHandlers.mousemove),this.boundHandlers.mouseup&&document.removeEventListener("mouseup",this.boundHandlers.mouseup),this.container&&(this.container.style.left="",this.container.style.top=""),this.container=null,this.boundHandlers={}}handleMouseDown(o){if(!this.container||o.target.closest("button, input"))return;this.dragState.isDragging=!0,this.dragState.startX=o.clientX,this.dragState.startY=o.clientY;let t=this.container.getBoundingClientRect();this.dragState.offsetX=t.left,this.dragState.offsetY=t.top,this.container.classList.add(`${this.prefix}-dragging`),o.preventDefault()}handleMouseMove(o){if(!this.dragState.isDragging||!this.container)return;let t=o.clientX-this.dragState.startX,e=o.clientY-this.dragState.startY;this.container.style.left=`${this.dragState.offsetX+t}px`,this.container.style.top=`${this.dragState.offsetY+e}px`}handleMouseUp(){this.container&&(this.dragState.isDragging=!1,this.container.classList.remove(`${this.prefix}-dragging`))}},Ht=class{constructor(){this.name="bottom-dock";this.movedElements=[];this.playerControls=null;this.divider=null;this.prefix=q()}apply(o){let t=o.uiContainer,e=o.playerControlsContainer;if(t&&e)for(this.playerControls=e,this.divider=document.createElement("div"),this.divider.classList.add(`${this.prefix}-divider`),t.appendChild(this.divider);e.firstChild;){let n=e.firstChild;this.movedElements.push(n),t.appendChild(n)}}cleanup(){if(this.playerControls)for(let o of this.movedElements)this.playerControls.appendChild(o);this.divider&&this.divider.parentNode&&this.divider.parentNode.removeChild(this.divider),this.movedElements=[],this.playerControls=null,this.divider=null}};var bt=class{constructor(o,t=!0){this.container=o;this.autoCollapse=t;this.isCollapsed=!1;this.collapseButton=null;this.prefix=q()}init(){this.container.classList.add(`${this.prefix}-collapsible`),this.createCollapseButton()}createCollapseButton(){var o;this.collapseButton=document.createElement("button"),this.collapseButton.type="button",this.collapseButton.classList.add(`${this.prefix}-collapse-btn`),this.collapseButton.setAttribute("aria-label","Toggle toolbar"),this.collapseButton.setAttribute("data-tooltip","Toggle toolbar"),this.updateButtonIcon(),this.collapseButton.addEventListener("click",t=>{t.stopPropagation(),this.toggle()}),(o=this.container.parentElement)==null||o.insertBefore(this.collapseButton,this.container.nextSibling)}updateButtonIcon(){this.collapseButton&&(this.collapseButton.innerHTML=`
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="18 15 12 9 6 15"/>
      </svg>
    `)}collapse(){this.isCollapsed||(this.isCollapsed=!0,this.container.classList.add(`${this.prefix}-collapsed`))}expand(){this.isCollapsed&&(this.isCollapsed=!1,this.container.classList.remove(`${this.prefix}-collapsed`))}toggle(){this.isCollapsed?this.expand():this.collapse()}get collapsed(){return this.isCollapsed}get autoCollapseEnabled(){return this.autoCollapse}setAutoCollapse(o){this.autoCollapse=o}destroy(){this.collapseButton&&(this.collapseButton.remove(),this.collapseButton=null),this.container.classList.remove(`${this.prefix}-collapsible`,`${this.prefix}-collapsed`)}};var Q=class{constructor(o,t){this.canvas=o;this.onGestureChange=t;this.initialDistance=0;this.initialScale=1;this.currentScale=1;this.panStart={x:0,y:0};this.panOffset={x:0,y:0};this.isGesturing=!1;this.activeTouches=0;this.minScale=.5;this.maxScale=3;this.handleTouchStart=o=>{this.activeTouches=o.touches.length,o.touches.length===2&&(o.preventDefault(),this.isGesturing=!0,this.initialDistance=this.getDistance(o.touches[0],o.touches[1]),this.initialScale=this.currentScale,this.panStart=this.getMidpoint(o.touches[0],o.touches[1]))};this.handleTouchMove=o=>{if(o.touches.length===2&&this.isGesturing){o.preventDefault();let e=this.getDistance(o.touches[0],o.touches[1])/this.initialDistance;this.currentScale=Math.max(this.minScale,Math.min(this.maxScale,this.initialScale*e));let n=this.getMidpoint(o.touches[0],o.touches[1]);this.panOffset={x:this.panOffset.x+(n.x-this.panStart.x),y:this.panOffset.y+(n.y-this.panStart.y)},this.panStart=n,this.onGestureChange(this.getState())}};this.handleTouchEnd=o=>{this.activeTouches=o.touches.length,o.touches.length<2&&(this.isGesturing=!1,o.touches.length===1&&(this.panStart={x:o.touches[0].clientX,y:o.touches[0].clientY}))}}init(){this.canvas.addEventListener("touchstart",this.handleTouchStart,{passive:!1}),this.canvas.addEventListener("touchmove",this.handleTouchMove,{passive:!1}),this.canvas.addEventListener("touchend",this.handleTouchEnd,{passive:!1}),this.canvas.addEventListener("touchcancel",this.handleTouchEnd,{passive:!1})}getDistance(o,t){let e=t.clientX-o.clientX,n=t.clientY-o.clientY;return Math.sqrt(e*e+n*n)}getMidpoint(o,t){return{x:(o.clientX+t.clientX)/2,y:(o.clientY+t.clientY)/2}}getState(){return{scale:this.currentScale,panX:this.panOffset.x,panY:this.panOffset.y}}isActive(){return this.isGesturing}hasTwoFingers(){return this.activeTouches>=2}reset(){this.currentScale=1,this.panOffset={x:0,y:0},this.initialScale=1,this.initialDistance=0,this.isGesturing=!1,this.onGestureChange(this.getState())}setScale(o){this.currentScale=Math.max(this.minScale,Math.min(this.maxScale,o)),this.onGestureChange(this.getState())}setPan(o,t){this.panOffset={x:o,y:t},this.onGestureChange(this.getState())}destroy(){this.canvas.removeEventListener("touchstart",this.handleTouchStart),this.canvas.removeEventListener("touchmove",this.handleTouchMove),this.canvas.removeEventListener("touchend",this.handleTouchEnd),this.canvas.removeEventListener("touchcancel",this.handleTouchEnd)}};var bn=window.devicePixelRatio||1,$e=25,B=class extends nt{constructor(t,e){super();this.referenceVideoFrameBuffer=null;this.videoFrameBuffer=null;this.isMouseDown=!1;this.buttons=[];this.plugins=[];this.annotatedFrameCoordinates=[];this.videoBlobUrl=null;this.referenceVideoBlobUrl=null;this.frameCounterTimeoutId=null;this._enforcedTotalFrames=null;this.isCursorOverCanvas=!1;this.overlayOpacity=.7;this._theme="dark";this.themeChangeListeners=[];this.layoutManager=null;this.collapseController=null;this.gestureHandler=null;this.gestureState={scale:1,panX:0,panY:0};this.fps=$e;this.plannedFn=null;this.ct=0;this.isCanvasInitialized=!1;this.enforcedCanvasSize=null;this.lastNavigatedFrame=0;this.isProgressBarNavigation=!1;this.isAnnotationsAsVideoActive=!1;this.config=He(e),this._theme=this.config.theme,this.plugins=Pe.map(n=>new n(this)),this.init(t)}prevFrame(){let e=this.playbackFrame-1;e<1?this.playbackFrame=this.totalFrames:this.playbackFrame=e}nextFrame(){let e=this.playbackFrame+1;e>this.totalFrames?this.playbackFrame=1:this.playbackFrame=e}getAnnotatedFrames(){let t=[];return this.timeStack.forEach((e,n)=>{e&&e.length>0&&t.push(n)}),t.sort((e,n)=>e-n)}prevAnnotatedFrame(){let t=this.getAnnotatedFrames();if(t.length===0)return;let e=this.playbackFrame;for(let n=t.length-1;n>=0;n--)if(t[n]<e){this.playbackFrame=t[n];return}this.playbackFrame=t[t.length-1]}nextAnnotatedFrame(){let t=this.getAnnotatedFrames();if(t.length===0)return;let e=this.playbackFrame;for(let n of t)if(n>e){this.playbackFrame=n;return}this.playbackFrame=t[0]}get theme(){return this._theme}setTheme(t){this._theme=t,Mt(t),this.themeChangeListeners.forEach(e=>e(t))}onThemeChange(t){return this.themeChangeListeners.push(t),()=>{let e=this.themeChangeListeners.indexOf(t);e!==-1&&this.themeChangeListeners.splice(e,1)}}setLayout(t){this.layoutManager||(this.layoutManager=new Z(this)),this.layoutManager.setLayout(t,{sidebarPosition:this.config.toolbar.sidebarPosition})}getLayout(){var t,e;return(e=(t=this.layoutManager)==null?void 0:t.getCurrentLayout())!=null?e:this.config.layout}collapseToolbar(){var t;(t=this.collapseController)==null||t.collapse()}expandToolbar(){var t;(t=this.collapseController)==null||t.expand()}toggleToolbar(){var t;(t=this.collapseController)==null||t.toggle()}isToolbarCollapsed(){var t,e;return(e=(t=this.collapseController)==null?void 0:t.collapsed)!=null?e:!1}setGesturesEnabled(t){t&&!this.gestureHandler?(this.gestureHandler=new Q(this.canvas,e=>{this.applyGestureTransform(e)}),this.gestureHandler.init()):!t&&this.gestureHandler&&(this.gestureHandler.destroy(),this.gestureHandler=null,this.resetZoom())}isGesturesEnabled(){return this.gestureHandler!==null}resetZoom(){var t;this.gestureState={scale:1,panX:0,panY:0},(t=this.gestureHandler)==null||t.reset(),this.redrawFullCanvas()}getZoomScale(){return this.gestureState.scale}applyGestureTransform(t){this.gestureState=t,this.redrawFullCanvas()}removeGlobalShape(t){this.globalShapes=this.globalShapes.filter(e=>e.type!==t)}addGlobalShape(t){this.globalShapes.push(t)}get selectedColor(){return this.colorPicker.value}get selectedStrokeSize(){return this.strokeSizePicker.valueAsNumber}get currentTool(){return this._currentTool}set currentTool(t){let e=this._currentTool;e&&(this.getButtonForTool(e).classList.remove("active"),this.pluginForTool(e).onDeactivate()),this._currentTool=t,this.canvas.style.cursor=t?"pointer":"default",t&&(this.getButtonForTool(t).classList.add("active"),this.pluginForTool(t).onActivate())}enableFrameRateDetection(){if(this.destructors.find(n=>n.name==="frameRateDetector"))return;let t=this.videoElement;if(t.tagName==="IMG")return;let e=Fe(t,n=>{this.fps=n});Object.defineProperty(e,"name",{value:"frameRateDetector"}),this.destructors.push(e)}timeToFrame(t){return Math.max(1,Math.round(t*this.fps))}get playbackFrame(){return this.videoElement instanceof HTMLImageElement?1:this.timeToFrame(this.videoElement.currentTime)}set playbackFrame(t){if(this.videoElement instanceof HTMLImageElement)return;let e=t/this.fps;this.videoElement.currentTime=e,this.rvf(()=>{this.show()})}rvf(t){this.plannedFn=t}get canvasWidth(){var t,e;return(e=(t=this.enforcedCanvasSize)==null?void 0:t.width)!=null?e:0}get canvasHeight(){var t,e;return(e=(t=this.enforcedCanvasSize)==null?void 0:t.height)!=null?e:0}get aspectRatio(){return this.canvasHeight===0?0:this.canvasWidth/this.canvasHeight}get isMobile(){var e,n,a;let t=(a=(n=(e=this.config)==null?void 0:e.mobile)==null?void 0:n.breakpoint)!=null?a:960;return window.innerWidth<t}get progressBarCoordinates(){let t=this.isMobile?30:10,e=5,a=this.canvasWidth-e-55,r=e,c=this.canvasHeight-t;return{x:r,y:c,width:a,height:t}}get shapes(){return this.timeStack.has(this.activeTimeFrame)||this.timeStack.set(this.activeTimeFrame,[]),this.timeStack.get(this.activeTimeFrame)}set shapes(t){this.timeStack.set(this.activeTimeFrame,t)}get undoStack(){return this.undoTimeStack.has(this.activeTimeFrame)||this.undoTimeStack.set(this.activeTimeFrame,[]),this.undoTimeStack.get(this.activeTimeFrame)}set undoStack(t){this.undoTimeStack.set(this.activeTimeFrame,t)}get pixelRatio(){return bn}setVideoBlob(n){return I(this,arguments,function*(t,e=this.fps){this.videoBlobUrl&&URL.revokeObjectURL(this.videoBlobUrl);let a=URL.createObjectURL(t);this.videoBlobUrl=a,yield this.setVideoUrl(a,e),this.plugins.forEach(r=>{r.on("videoBlobSet",t)})})}setVideoUrl(n){return I(this,arguments,function*(t,e=this.fps){if(this.videoElement instanceof HTMLImageElement)return;let a=this.videoElement;a.src=t.toString(),yield this.videoElement.load(),this.setFrameRate(e),this.videoFrameBuffer&&(this.videoFrameBuffer.destroy(),this.videoFrameBuffer=new W(a,e,!1),this.videoFrameBuffer.isMobile=this.isMobile),this.setCanvasSize()})}enableVideoFrameBuffer(){this.videoElement instanceof HTMLImageElement||(this.videoFrameBuffer=new W(this.videoElement,this.fps,!1),this.videoFrameBuffer.isMobile=this.isMobile)}hide(){this.stopAnnotationsAsVideo(),this.hideControls(),this.hideCanvas()}showControls(){this.uiContainer.style.display=""}hideControls(){this.uiContainer.style.display="none"}showCanvas(){this.canvas.style.display="block"}hideCanvas(){this.canvas.style.display="none"}updateActiveTimeFrame(t=void 0){this.activeTimeFrame=t?this.timeToFrame(t):this.playbackFrame}show(){this.stopAnnotationsAsVideo(),this.updateActiveTimeFrame(),this.showCanvas(),this.showControls(),this.redrawFullCanvas()}setCanvasSettings(){this.ctx.strokeStyle=this.selectedColor,this.ctx.fillStyle=this.selectedColor,this.ctx.lineWidth=this.selectedStrokeSize}pluginForTool(t){if(this.isDestroyed)throw new Error("AnnotationTool is destroyed");let e=this.plugins.find(n=>n.name===t);if(!e)throw new Error(`No plugin found for tool ${t}`);return e}getButtonForTool(t){return this.buttons.find(e=>e.dataset.tool===t)}bindContext(){this.handleMouseDown=this.handleMouseDown.bind(this),this.handleMouseMove=this.handleMouseMove.bind(this),this.handleMouseUp=this.handleMouseUp.bind(this),this.setCanvasSize=this.setCanvasSize.bind(this),this.onKeyDown=this.onKeyDown.bind(this)}initProperties(){var t;this.isDestroyed=!1,this.isProgressBarNavigation=!1,this.shapes=[],this.globalShapes=[],this.currentTool=this.isMobile?null:(t=this.config.toolbar.defaultTool)!=null?t:null,Mt(this._theme),this.layoutManager=new Z(this),this.layoutManager.setLayout(this.config.layout,{sidebarPosition:this.config.toolbar.sidebarPosition}),this.isMobile&&this.config.mobile.collapsibleToolbars&&(this.collapseController=new bt(this.uiContainer,this.config.mobile.autoCollapse),this.collapseController.init()),this.isMobile&&this.config.mobile.gesturesEnabled&&(this.gestureHandler=new Q(this.canvas,e=>{this.applyGestureTransform(e)}),this.gestureHandler.init())}setVideoStyles(){this.videoElement.style.objectFit="cover",this.videoElement.style.objectPosition="left top"}get frameCallbackSupported(){return"requestVideoFrameCallback"in HTMLVideoElement.prototype}initFrameCounter(){if(!this.frameCallbackSupported){this.frameCounterTimeoutId=setTimeout(()=>{var t;this.isDestroyed||((t=this.plannedFn)==null||t.call(this),this.plannedFn=null,this.initFrameCounter(),this.updateActiveTimeFrame(),this.playAnnotationsAsVideo())},1e3/this.fps);return}this.withVideo(t=>{t.requestVideoFrameCallback((e,n)=>{var a,r;this.isCanvasInitialized||this._setCanvasSize(),(a=this.videoFrameBuffer)==null||a.tick(e,n),(r=this.plannedFn)==null||r.call(this),this.plannedFn=null,this.raf(()=>{this.initFrameCounter(),this.updateActiveTimeFrame(n.mediaTime),this.playAnnotationsAsVideo()})})})}init(t){this.videoElement=t,this.setVideoStyles(),this.initFrameCounter(),this.bindContext(),this.initCanvas(),this.initUI(),this.initProperties(),this.setCanvasSize()}onKeyDown(t){(t.ctrlKey||t.metaKey)&&t.key.toLowerCase()==="z"&&this.handleUndo()}handleUndo(){this.undoStack.length>0&&(this.shapes=this.undoStack.pop(),this.redrawFullCanvas())}destroy(){var a,r,c,l,s,h,u,p,g,v,b;if(this.isDestroyed)return;super.destroy(),this.stopAnnotationsAsVideo(),this.frameCounterTimeoutId&&(clearTimeout(this.frameCounterTimeoutId),this.frameCounterTimeoutId=null),this.videoBlobUrl&&(URL.revokeObjectURL(this.videoBlobUrl),this.videoBlobUrl=null),this.referenceVideoBlobUrl&&(URL.revokeObjectURL(this.referenceVideoBlobUrl),this.referenceVideoBlobUrl=null),this.currentTool=null,this.plugins.forEach(y=>y.reset()),this.annotatedFrameCoordinates=[],this.setFrameRate($e);let t=this.strokeSizePicker.parentElement;if((a=t==null?void 0:t.parentNode)==null||a.removeChild(t),this.referenceVideoElement){let y=this.referenceVideoElement.parentElement;(r=y==null?void 0:y.parentNode)==null||r.removeChild(y),this.referenceVideoElement=null}let e=this.colorPicker.parentElement;(c=e==null?void 0:e.parentNode)==null||c.removeChild(e),this.buttons.forEach(y=>{var f;(f=y.parentNode)==null||f.removeChild(y)}),this.buttons=[],(l=this.uiContainer.parentNode)==null||l.removeChild(this.uiContainer),(s=this.canvas.parentNode)==null||s.removeChild(this.canvas),(h=this.playerControlsContainer.parentElement)==null||h.removeChild(this.playerControlsContainer),["strokeSizePicker","colorPicker","uiContainer","playerControlsContainer","canvas","ctx","videoElement"].forEach(y=>{delete this[y]}),this.activeTimeFrame=0,this.isDestroyed=!0,(u=this.referenceVideoFrameBuffer)==null||u.destroy(),this.referenceVideoFrameBuffer=null,(p=this.videoFrameBuffer)==null||p.destroy(),this.videoFrameBuffer=null,(g=this.layoutManager)==null||g.destroy(),this.layoutManager=null,(v=this.collapseController)==null||v.destroy(),this.collapseController=null,(b=this.gestureHandler)==null||b.destroy(),this.gestureHandler=null,this.gestureState={scale:1,panX:0,panY:0}}_setCanvasSize(){var p;let t=getComputedStyle(this.videoElement),e=parseInt(t.width,10),n=this.videoElement,a=n.videoWidth/n.videoHeight;if(isNaN(e)||!n.videoWidth||!n.videoHeight)return this.isCanvasInitialized=!1,this.setCanvasSettings(),!1;let r=n.parentElement,c=!!((p=document.fullscreenElement)!=null?p:document.webkitFullscreenElement),l=Math.min(e,n.videoWidth),s=Math.floor(l/a);if(c&&r){let b=window.innerWidth,y=window.innerHeight-90;b/y>a?(s=y,l=s*a):(l=b,s=l/a),n.style.width=`${l}px`,n.style.height=`${s}px`,n.style.marginTop="40px",n.style.marginBottom="50px"}else n.style.width=`${l}px`,n.style.height=`${s}px`,n.style.marginTop="",n.style.marginBottom="";this.isCanvasInitialized=n.videoWidth>0&&n.videoHeight>0,this.canvas.width=l*this.pixelRatio,this.canvas.height=s*this.pixelRatio,this.canvas.style.width=`${l}px`,this.canvas.style.height=`${s}px`,this.canvas.style.position="absolute";let h=n.offsetTop,u=n.offsetLeft;return this.canvas.style.top=`${h}px`,this.canvas.style.left=`${u}px`,this.enforcedCanvasSize={width:l,height:s},this.ctx.scale(this.pixelRatio,this.pixelRatio),this.setCanvasSettings(),!0}setCanvasSize(){this._setCanvasSize()&&(this.syncVideoSizes(),this.redrawFullCanvas())}replaceShape(t,e){let n=this.serialize([t])[0];this.undoStack.push([...this.shapes]),this.shapes[e]=n}addShape(t){let e=this.serialize([t])[0];this.undoStack.push([...this.shapes]),this.shapes.push(e)}get msPerFrame(){return 1e3/this.fps}syncVideoSizes(){this.withRefVideo(t=>{let n=this.videoElement.getBoundingClientRect();t.style.position="fixed",t.style.top=`${n.top}px`,t.style.left=`${n.left}px`})}addReferenceVideoByURL(a){return I(this,arguments,function*(t,e=this.fps,n="video/mp4"){var s;let r=yield fetch(t).then(h=>h.blob()),c=new Blob([r],{type:n});this.referenceVideoBlobUrl&&URL.revokeObjectURL(this.referenceVideoBlobUrl);let l=window.URL.createObjectURL(c);this.referenceVideoBlobUrl=l,this.referenceVideoElement?((s=this.referenceVideoFrameBuffer)==null||s.destroy(),this.referenceVideoFrameBuffer=new W(this.referenceVideoElement,e),this.referenceVideoFrameBuffer.isMobile=this.isMobile,this.referenceVideoFrameBuffer.start()):(this.referenceVideoElement=document.createElement("video"),this.withRefVideo(h=>{this.isMobile?(h.style.zIndex="2",h.style.display="block",h.style.top="0",h.style.left="0",h.style.opacity="0.25",h.style.width="20px",h.style.height="15px"):(h.style.zIndex="-1",h.style.display="none",h.style.width="100px",h.style.height="70px"),h.style.objectFit="cover",h.style.objectPosition="left top",h.muted=!0,h.volume=0,h.playsInline=!0,h.autoplay=!1,h.controls=!1,h.loop=!0,this.videoElement.after(h),this.referenceVideoFrameBuffer=new W(h,e),this.referenceVideoFrameBuffer.isMobile=this.isMobile,this.referenceVideoFrameBuffer.start()}),this.syncVideoSizes()),this.referenceVideoElement.src=l,this.referenceVideoElement.play().then(()=>{this.showButton("compare")}).catch(()=>{this.hideButton("compare")})})}hideButton(t){let e=this.getButtonForTool(t);e.style.display="none"}showButton(t){let e=this.getButtonForTool(t);e.style.display=""}addSingletonShape(t){let e=this.serialize([t])[0],n=this.shapes.filter(a=>a.type!==t.type);this.replaceFrame(this.playbackFrame,[...n,e])}serialize(t=this.shapes){let e=this.canvasWidth,n=this.canvasHeight;return t.map(a=>this.pluginForTool(a.type).normalize(a,e,n))}deserialize(t){let e=1/this.canvasWidth,n=1/this.canvasHeight;return t.map(a=>this.pluginForTool(a.type).normalize(a,e,n))}getRelativeCoords(t){let e=this.canvas.getBoundingClientRect();return{x:this.getEventX(t)-e.left,y:this.getEventY(t)-e.top}}handleMouseDown(t){var n,a;if(t.preventDefault(),this.isMouseDown=!0,et(t)||(n=this.gestureHandler)!=null&&n.hasTwoFingers())return;let e=this.frameFromProgressBar(t,!0);if(e){this.isProgressBarNavigation=!0;let r=this.getAnnotationFrame(t);this.isVideoPaused&&(r!==null?this.playbackFrame=r:this.playbackFrame=e);return}this.currentTool&&((a=this.collapseController)!=null&&a.autoCollapseEnabled)&&this.collapseController.collapse(),this.currentTool&&this.pluginForTool(this.currentTool).onPointerDown(t)}get isDrawing(){return this.currentTool?this.pluginForTool(this.currentTool).isDrawing:!1}get isVideoPaused(){return this.videoElement.tagName==="VIDEO"?this.videoElement.paused:!0}get hasGlobalOverlays(){return this.globalShapes.length>0}handleMouseMove(t){if(t.preventDefault(),!et(t)){if(this.isMouseDown){let e=this.isProgressBarNavigation?this.frameFromProgressBar(t,!1):null;if(e!==null&&!this.isDrawing){if(e===this.lastNavigatedFrame)return;this.lastNavigatedFrame=e,this.activeTimeFrame=e,this.isVideoPaused&&(this.playbackFrame=e),this.clearCanvas(),this.hasGlobalOverlays||this.addVideoOverlay(),this.drawShapesOverlay(),this.addProgressBarOverlay();return}else this.hideControls(),this.clearCanvas(),this.hasGlobalOverlays||this.addVideoOverlay(),this.drawShapesOverlay()}else this.redrawFullCanvas();this.currentTool&&this.pluginForTool(this.currentTool).onPointerMove(t)}}getEventX(t){return t.clientX}getEventY(t){return t.clientY}handleMouseUp(t){var e;this.isMouseDown=!1,this.isProgressBarNavigation=!1,this.showControls(),!et(t)&&(this.currentTool&&this.pluginForTool(this.currentTool).onPointerUp(t),(e=this.collapseController)!=null&&e.autoCollapseEnabled&&this.collapseController.expand(),this.redrawFullCanvas())}focusOnMediaNode(){this.videoElement.focus()}drawShapesOverlay(){var n,a;let t={strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth,globalAlpha:this.ctx.globalAlpha},e=this.gestureState.scale!==1||this.gestureState.panX!==0||this.gestureState.panY!==0;if(e){this.ctx.save(),this.ctx.translate(this.gestureState.panX,this.gestureState.panY);let r=this.canvasWidth/2,c=this.canvasHeight/2;this.ctx.translate(r,c),this.ctx.scale(this.gestureState.scale,this.gestureState.scale),this.ctx.translate(-r,-c)}for(let r of this.deserialize(this.globalShapes)){this.ctx.strokeStyle=r.strokeStyle,this.ctx.fillStyle=r.fillStyle,this.ctx.lineWidth=r.lineWidth,this.ctx.globalAlpha=(n=r.opacity)!=null?n:1;try{this.pluginForTool(r.type).draw(r)}catch(c){console.error(c)}}for(let r of this.deserialize(this.shapes)){this.ctx.strokeStyle=r.strokeStyle,this.ctx.fillStyle=r.fillStyle,this.ctx.lineWidth=r.lineWidth,this.ctx.globalAlpha=(a=r.opacity)!=null?a:1;try{this.pluginForTool(r.type).draw(r)}catch(c){console.error(c)}}e&&this.ctx.restore(),this.ctx.strokeStyle=t.strokeStyle,this.ctx.fillStyle=t.fillStyle,this.ctx.lineWidth=t.lineWidth,this.ctx.globalAlpha=t.globalAlpha}clearCanvas(){this.ctx.clearRect(0,0,this.canvasWidth,this.canvasHeight)}frameToDataUrl(){try{this.clearCanvas(),this.addVideoOverlay(),this.addFrameSquareOverlay(),this.drawShapesOverlay();let t=this.canvas.toDataURL("image/png");return this.redrawFullCanvas(),t}catch(t){return console.error(t),null}}redrawFullCanvas(){this.clearCanvas(),this.addVideoOverlay(),this.drawShapesOverlay(),this.drawSelectionHandles(),this.addFrameSquareOverlay(),this.addProgressBarOverlay()}drawSelectionHandles(){if(this.currentTool==="move")try{this.pluginForTool("move").drawResizeHandles()}catch(t){}}replaceFrame(t,e){this.timeStack.set(t,this.parseShapes(this.stringifyShapes(e)))}addShapesToFrame(t,e){let n=this.timeStack.get(t)||[];this.timeStack.set(t,[...n,...this.parseShapes(this.stringifyShapes(e))])}setFrameRate(t){var e;(e=this.destructors.find(n=>n.name==="frameRateDetector"))==null||e(),this.fps=t}stringifyShapes(t){return JSON.stringify(t,(e,n)=>e==="image"?n.src:n)}parseShapes(t){return JSON.parse(t,(e,n)=>{if(e==="image"){let a=new Image;return a.src=n,a}return n})}filterNonSerializableShapes(t){return t.filter(e=>e.type!=="image")}saveCurrentFrame(){return{frame:this.playbackFrame,version:1,fps:this.fps,shapes:this.parseShapes(this.stringifyShapes(this.filterNonSerializableShapes(this.shapes)))}}loadAllFrames(t){this.cleanFrameStacks(),t.forEach(e=>{let n=e.shapes||[];this.timeStack.set(e.frame,this.parseShapes(this.stringifyShapes(n)))})}appendFrames(t){t.forEach(e=>{this.addShapesToFrame(e.frame,e.shapes)})}saveAllFrames(){return Array.from(this.timeStack.keys()).filter(a=>{var r;return(r=this.timeStack.get(a))==null?void 0:r.length}).map(a=>{var r;return{frame:a,fps:this.fps,version:1,shapes:this.filterNonSerializableShapes((r=this.timeStack.get(a))!=null?r:[])}})}getAnnotationFrame(t){var c,l;let e=t.offsetX,n=t.offsetY,a=this.isMobile?20:12;return(l=(c=this.annotatedFrameCoordinates.find(s=>e>=s.x-a&&e<=s.x+a&&n>=s.y-a&&n<=s.y+a))==null?void 0:c.frame)!=null?l:null}get totalFrames(){if(this._enforcedTotalFrames!==null)return this._enforcedTotalFrames;let t=this.videoElement;return t.tagName!=="VIDEO"?1:Math.round(t.duration*this.fps)}setTotalFrames(t){this._enforcedTotalFrames=t!==null?Math.max(1,Math.round(t)):null}getEnforcedTotalFrames(){return this._enforcedTotalFrames}frameFromProgressBar(t,e=!0){if(this.videoElement.tagName!=="VIDEO")return null;let{x:a,width:r,height:c,y:l}=this.progressBarCoordinates,s=t.offsetX,h=t.offsetY,u=()=>{let p=Math.round((s-a)/r*this.totalFrames);return Math.max(1,Math.min(p,this.totalFrames))};return e?s>=a&&s<=a+r&&h>=l&&h<=l+c?u():null:s>=a&&s<=a+r?u():null}hasAnnotationsForFrame(t){if(this.globalShapes.length>0)return!0;if(this.timeStack.has(t)){let e=this.timeStack.get(t);return e&&e.length>0}return!1}stopAnnotationsAsVideo(){this.isAnnotationsAsVideoActive=!1}startAnnotationsAsVideo(){this.isAnnotationsAsVideoActive=!0,this.playAnnotationsAsVideo()}playAnnotationsAsVideo(){this.isAnnotationsAsVideoActive&&(this.clearCanvas(),this.addVideoOverlay(),this.drawShapesOverlay(),(this.isCursorOverCanvas||this.isMobile)&&(this.addFrameSquareOverlay(),this.addProgressBarOverlay()))}};function De(i=this.activeTimeFrame){this.ctx.save(),this.ctx.fillStyle="rgba(0, 0, 0, 0.5)";let o=50,t=30,e=20;this.ctx.fillRect(this.canvasWidth-o,this.canvasHeight-t,o,t),this.ctx.fillStyle="white",this.ctx.font=`${e}px sans-serif`,this.ctx.fillText(`${i}`.padStart(3,"0"),this.canvasWidth-40,this.canvasHeight-7),this.ctx.restore()}function Be(){var s,h;let i=this.videoElement;if(i.tagName!=="VIDEO")return;let o=i.getBoundingClientRect(),t=this.canvas.getBoundingClientRect(),e=o.left-t.left,n=o.top-t.top,a=this.activeTimeFrame,r=(h=(s=this.videoFrameBuffer)==null?void 0:s.getFrame(a||0))!=null?h:i,c=r?r.width:i.videoWidth,l=r?r.height:i.videoHeight;this.ctx.drawImage(r,0,0,c,l,e,n,this.canvasWidth,this.canvasHeight)}function Oe(){if(this.videoElement.tagName!=="VIDEO")return;this.annotatedFrameCoordinates=[];let t=Array.from(this.timeStack.keys()).filter(v=>{var b;return(b=this.timeStack.get(v))==null?void 0:b.length}),e=this.totalFrames,{x:n,width:a,height:r,y:c}=this.progressBarCoordinates,l=t.map(v=>Math.round(v/e*a));this.ctx.save(),this.ctx.fillStyle="rgba(0, 0, 0, 0.5)",this.ctx.fillRect(n,c,a,r),this.ctx.fillStyle=V.y;let s=this.isMobile?16:8;l.forEach((v,b)=>{this.ctx.beginPath();let y=n+v,f=this.canvasHeight-r/2;this.ctx.fillRect(y-s/2,f-s/2,s,s),this.annotatedFrameCoordinates.push({x:y,y:f,frame:t[b]})});let h=this.isProgressBarNavigation&&this.lastNavigatedFrame>0?this.lastNavigatedFrame:this.playbackFrame,u=Math.round(h/e*a)+n;this.ctx.fillStyle="white",this.ctx.beginPath();let p=u,g=this.canvasHeight-r/2;this.ctx.beginPath(),this.ctx.fillRect(p-s/2,g-s/2,s,s),this.ctx.fill(),this.ctx.restore()}function $t(i,o=1){let t=i.replace(/^#/,""),e=0,n=0,a=0;return t.length===3?(e=parseInt(t[0]+t[0],16)/255,n=parseInt(t[1]+t[1],16)/255,a=parseInt(t[2]+t[2],16)/255):t.length===6?(e=parseInt(t.substring(0,2),16)/255,n=parseInt(t.substring(2,4),16)/255,a=parseInt(t.substring(4,6),16)/255):t.length===8&&(e=parseInt(t.substring(0,2),16)/255,n=parseInt(t.substring(2,4),16)/255,a=parseInt(t.substring(4,6),16)/255,o=parseInt(t.substring(6,8),16)/255),[e,n,a,o]}function K(i,o=1){if(typeof i=="string"){if(i.startsWith("rgb")){let t=i.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);if(t)return[parseInt(t[1])/255,parseInt(t[2])/255,parseInt(t[3])/255,t[4]?parseFloat(t[4]):o]}return $t(i,o)}return[1,0,0,o]}function ze(i,o,t,e){let n=Math.cos(e),a=Math.sin(e),r=i.x-o,c=i.y-t;return{x:o+r*n-c*a,y:t+r*a+c*n}}function Y(i,o,t,e){if(!o.rotation)return i;let n=o.rotationCenterX!==void 0?o.rotationCenterX:t,a=o.rotationCenterY!==void 0?o.rotationCenterY:e;return i.map(r=>ze(r,n,a,o.rotation))}function Ve(i,o,t){return{x:i*2-1,y:1-o*2}}function j(i){return`[ [ ${i.map(o=>wt(o)).join(" ")} ] ]`}function N(i){return`[ ${i.map(o=>wt(o)).join(" ")} ]`}function wt(i){return Number.isInteger(i)?String(i):i.toFixed(9).replace(/\.?0+$/,"")||"0"}function U(i,o){return`[ ${i.map(e=>{let n=Ve(e.x,e.y,o);return`[ ${wt(n.x)} ${wt(n.y)} ]`}).join(" ")} ]`}function wn(i,o,t,e,n){var p;let a=K(i.strokeStyle,(p=i.opacity)!=null?p:1),r=e/n,c=0,l=0;for(let g of i.points)c+=g.x,l+=g.y;c/=i.points.length,l/=i.points.length;let s=Y(i.points,i,c,l),h=i.lineWidth/n,u=new Array(s.length).fill(h);return{name:`"pen:${o}:${t}:User"`,properties:[{type:"float",dimensions:4,name:"color",value:j(a)},{type:"float",name:"width",value:N(u)},{type:"string",name:"brush",value:'"circle"'},{type:"float",dimensions:2,name:"points",value:U(s,r)},{type:"int",name:"debug",value:0},{type:"int",name:"join",value:3},{type:"int",name:"cap",value:1},{type:"int",name:"splat",value:0}]}}function Tn(i,o,t,e,n){var p;let a=K(i.strokeStyle,(p=i.opacity)!=null?p:1),r=e/n,c=(i.x1+i.x2)/2,l=(i.y1+i.y2)/2,s=[{x:i.x1,y:i.y1},{x:i.x2,y:i.y2}];s=Y(s,i,c,l);let h=i.lineWidth/n,u=new Array(s.length).fill(h);return{name:`"pen:${o}:${t}:User"`,properties:[{type:"float",dimensions:4,name:"color",value:j(a)},{type:"float",name:"width",value:N(u)},{type:"string",name:"brush",value:'"circle"'},{type:"float",dimensions:2,name:"points",value:U(s,r)},{type:"int",name:"debug",value:0},{type:"int",name:"join",value:3},{type:"int",name:"cap",value:1},{type:"int",name:"splat",value:0}]}}function Sn(i,o,t,e,n){var m;let a=K(i.strokeStyle,(m=i.opacity)!=null?m:1),r=j(a),c=e/n,l=(i.x1+i.x2)/2,s=(i.y1+i.y2)/2,h=[{x:i.x1,y:i.y1},{x:i.x2,y:i.y2}],u=10+2.5*i.lineWidth,p=Math.PI/6,g=Math.atan2(i.y2-i.y1,i.x2-i.x1),v=[{x:i.x2,y:i.y2},{x:i.x2-u*Math.cos(g+p),y:i.y2-u*Math.sin(g+p)}],b=[{x:i.x2,y:i.y2},{x:i.x2-u*Math.cos(g-p),y:i.y2-u*Math.sin(g-p)}];h=Y(h,i,l,s),v=Y(v,i,l,s),b=Y(b,i,l,s);let y=i.lineWidth/n,f=new Array(2).fill(y);return[{name:`"pen:${o}:${t}:User"`,properties:[{type:"float",dimensions:4,name:"color",value:r},{type:"float",name:"width",value:N(f)},{type:"string",name:"brush",value:'"circle"'},{type:"float",dimensions:2,name:"points",value:U(h,c)},{type:"int",name:"debug",value:0},{type:"int",name:"join",value:3},{type:"int",name:"cap",value:1},{type:"int",name:"splat",value:0}]},{name:`"pen:${o+1}:${t}:User"`,properties:[{type:"float",dimensions:4,name:"color",value:r},{type:"float",name:"width",value:N(f)},{type:"string",name:"brush",value:'"circle"'},{type:"float",dimensions:2,name:"points",value:U(v,c)},{type:"int",name:"debug",value:0},{type:"int",name:"join",value:3},{type:"int",name:"cap",value:1},{type:"int",name:"splat",value:0}]},{name:`"pen:${o+2}:${t}:User"`,properties:[{type:"float",dimensions:4,name:"color",value:r},{type:"float",name:"width",value:N(f)},{type:"string",name:"brush",value:'"circle"'},{type:"float",dimensions:2,name:"points",value:U(b,c)},{type:"int",name:"debug",value:0},{type:"int",name:"join",value:3},{type:"int",name:"cap",value:1},{type:"int",name:"splat",value:0}]}]}function Cn(i,o,t,e,n){var p;let a=K(i.strokeStyle,(p=i.opacity)!=null?p:1),r=e/n,c=i.x+i.width/2,l=i.y+i.height/2,s=[{x:i.x,y:i.y},{x:i.x+i.width,y:i.y},{x:i.x+i.width,y:i.y+i.height},{x:i.x,y:i.y+i.height},{x:i.x,y:i.y}];s=Y(s,i,c,l);let h=i.lineWidth/n,u=new Array(s.length).fill(h);return{name:`"pen:${o}:${t}:User"`,properties:[{type:"float",dimensions:4,name:"color",value:j(a)},{type:"float",name:"width",value:N(u)},{type:"string",name:"brush",value:'"circle"'},{type:"float",dimensions:2,name:"points",value:U(s,r)},{type:"int",name:"debug",value:0},{type:"int",name:"join",value:3},{type:"int",name:"cap",value:1},{type:"int",name:"splat",value:0}]}}function En(i,o,t,e,n,a=32){var g;let r=K(i.strokeStyle,(g=i.opacity)!=null?g:1),c=e/n,l=i.x,s=i.y,h=[];for(let v=0;v<=a;v++){let b=v/a*Math.PI*2;h.push({x:i.x+Math.cos(b)*i.radius,y:i.y+Math.sin(b)*i.radius})}h=Y(h,i,l,s);let u=i.lineWidth/n,p=new Array(h.length).fill(u);return{name:`"pen:${o}:${t}:User"`,properties:[{type:"float",dimensions:4,name:"color",value:j(r)},{type:"float",name:"width",value:N(p)},{type:"string",name:"brush",value:'"circle"'},{type:"float",dimensions:2,name:"points",value:U(h,c)},{type:"int",name:"debug",value:0},{type:"int",name:"join",value:3},{type:"int",name:"cap",value:1},{type:"int",name:"splat",value:0}]}}function kn(i,o,t,e,n){var g,v,b,y;let a=K(i.fillStyle,(g=i.opacity)!=null?g:1),r=e/n,c=i.x,l=i.y,s=0;if(i.rotation){let f=(v=i.rotationCenterX)!=null?v:i.x,m=(b=i.rotationCenterY)!=null?b:i.y,x=ze({x:i.x,y:i.y},f,m,i.rotation);c=x.x,l=x.y,s=i.rotation*180/Math.PI}let h=Ve(c,l,r),p=(16+((y=i.lineWidth)!=null?y:1)*.5)/n;return{name:`"text:${o}:${t}:User"`,properties:[{type:"float",dimensions:2,name:"position",value:j([h.x,h.y])},{type:"float",dimensions:4,name:"color",value:j(a)},{type:"float",name:"spacing",value:.8},{type:"float",name:"size",value:p},{type:"float",name:"scale",value:1},{type:"float",name:"rotation",value:s},{type:"string",name:"font",value:'""'},{type:"string",name:"text",value:`"${i.text.replace(/"/g,'\\"').replace(/\n/g,"\\n")}"`},{type:"string",name:"origin",value:'""'},{type:"int",name:"debug",value:0}]}}function Mn(i,o,t,e,n){switch(i.type){case"curve":return[wn(i,o,t,e,n)];case"line":return[Tn(i,o,t,e,n)];case"arrow":return Sn(i,o,t,e,n);case"rectangle":return[Cn(i,o,t,e,n)];case"circle":return[En(i,o,t,e,n)];case"text":return[kn(i,o,t,e,n)];case"eraser":case"move":case"image":case"compare":case"audio-peaks":case"selection":return[];default:return[]}}function In(i){let o=[];o.push(`    ${i.name}`),o.push("    {");for(let t of i.properties){let e=t.dimensions?`${t.type}[${t.dimensions}]`:t.type,n=typeof t.value=="string"?t.value:String(t.value);o.push(`        ${e} ${t.name} = ${n}`)}return o.push("    }"),o.join(`
`)}function Dt(i,o){let{mediaPath:t,width:e,height:n,sessionName:a="sm-annotate-session"}=o,r=[];r.push("GTOa (4)"),r.push(""),r.push("# Generated by sm-annotate OpenRV exporter"),r.push(`# Media: ${t}`),r.push(`# Resolution: ${e}x${n}`),r.push(""),r.push("RVSession : RVSession (4)"),r.push("{"),r.push("    session"),r.push("    {"),r.push(`        string name = "${a}"`),r.push("        int version = 4"),r.push("    }"),r.push("}"),r.push(""),r.push("sourceGroup000000_source : RVFileSource (1)"),r.push("{"),r.push("    media"),r.push("    {"),r.push(`        string movie = "${t}"`),r.push("    }"),r.push("    request"),r.push("    {"),r.push(`        int width = ${e}`),r.push(`        int height = ${n}`),r.push("    }"),r.push("}"),r.push("");let c=[],l=0;for(let s of i)for(let h of s.shapes){let u=Mn(h,l,s.frame,e,n);c.push(...u),l+=u.length}if(c.length>0){let s=new Map;for(let h of c){let u=h.name.match(/:\d+:(\d+):/);if(u){let p=parseInt(u[1]);s.has(p)||s.set(p,[]);let g=h.name.startsWith('"')&&h.name.endsWith('"')?h.name.slice(1,-1):h.name;s.get(p).push(g)}}r.push("sourceGroup000000_paint : RVPaint (3)"),r.push("{"),r.push("    paint"),r.push("    {"),r.push(`        int nextId = ${l}`),r.push("        int nextAnnotationId = 0"),r.push("        int show = 1"),r.push("        string exclude = [ ]"),r.push("        string include = [ ]"),r.push("    }");for(let h of c)r.push(In(h));for(let[h,u]of s)r.push(`    "frame:${h}"`),r.push("    {"),r.push(`        string order = [ ${u.map(p=>`"${p}"`).join(" ")} ]`),r.push("    }");r.push("}")}return r.join(`
`)}function Tt(i,o,t="annotations.rv"){let e=Dt(i,o),n=new Blob([e],{type:"text/plain"}),a=URL.createObjectURL(n),r=document.createElement("a");r.href=a,r.download=t,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(a)}function St(i){if(i.length<3)return"#000000";let o=Math.round(i[0]*255),t=Math.round(i[1]*255),e=Math.round(i[2]*255);return`#${o.toString(16).padStart(2,"0")}${t.toString(16).padStart(2,"0")}${e.toString(16).padStart(2,"0")}`}function Pn(i,o){if(i=i.trim(),i.startsWith("[")&&i.endsWith("]")){let t=i.slice(1,-1).trim();if(t==="")return o==="string"?[]:[];if(o==="string"){let n=t.match(/"([^"\\]|\\.)*"/g);return n?n.map(a=>a.slice(1,-1).replace(/\\"/g,'"').replace(/\\n/g,`
`)):[]}if(t.includes("[")){let n=[],a=t.match(/-?\d+\.?\d*(?:e[+-]?\d+)?/gi);if(a)for(let r of a)n.push(Number(r));return n}return t.split(/\s+/).filter(n=>n.length>0&&!isNaN(Number(n))).map(Number)}return i.startsWith('"')&&i.endsWith('"')?i.slice(1,-1).replace(/\\"/g,'"').replace(/\\n/g,`
`):Number(i)}function Fn(i){var r;let o=[],t=i.split(`
`),e=null,n=null,a=0;for(let c=0;c<t.length;c++){let l=t[c].trim();if(l===""||l.startsWith("#")||l==="GTOa (4)")continue;let s=l.match(/^(\S+)\s*:\s*(\S+)\s*\((\d+)\)\s*$/);if(s&&a===0){e={name:s[1],protocol:s[2],version:parseInt(s[3]),components:new Map},o.push(e);continue}if(l==="{"){a++;continue}if(l==="}"){a--,a===1&&(n=null),a===0&&(e=null);continue}if(e&&a>=1){if(a===1){let u=l.match(/^"([^"]+)"$/);if(u){n=u[1],e.components.has(n)||e.components.set(n,new Map);continue}if(!l.includes("=")&&!l.includes("[")){n=l,e.components.has(n)||e.components.set(n,new Map);continue}}let h=l.match(/^(\w+)(?:\[([^\]]*)\])?\s+(\w+)\s*=\s*(.+)$/);if(h&&n){let[,u,,p,g]=h,v=Pn(g,u);(r=e.components.get(n))==null||r.set(p,v)}}}return o}function We(i,o,t){return{x:(i+1)/2,y:(1-o)/2}}function An(i,o,t){let e=i.get("points"),n=i.get("color"),a=i.get("width");if(!e||e.length<4)return null;let r=o/t,c=[];for(let u=0;u<e.length;u+=2){let p=We(e[u],e[u+1],r);c.push(p)}let l=n?St(n):"#000000",s=n&&n.length>=4?n[3]:1,h=2;if(typeof a=="number")h=a*t;else if(Array.isArray(a)&&a.length>0){let u=a[0];typeof u=="number"&&(h=u*t)}return h=Math.max(1,Math.min(h,50)),{type:"curve",points:c,strokeStyle:l,fillStyle:l,lineWidth:h,opacity:s}}function Ln(i,o,t){let e=i.get("position"),n=i.get("color"),a=i.get("text"),r=i.get("size");if(!e||e.length<2||!a)return null;let c=o/t,l=We(e[0],e[1],c),s=n?St(n):"#000000",h=n&&n.length>=4?n[3]:1,p=(r!=null?r:.01)*t,g=Math.max(1,(p-16)/.5);return{type:"text",x:l.x,y:l.y,text:a,strokeStyle:s,fillStyle:s,lineWidth:g,opacity:h}}function Bt(i,o={}){var u,p,g,v,b,y,f;let t={frames:[]},e=Fn(i),n=e.find(m=>m.protocol==="RVSession");if(n){let m=n.components.get("session");if(m){let x=m.get("name");typeof x=="string"&&(t.sessionName=x)}}let a=e.find(m=>m.protocol==="RVFileSource");if(a){let m=a.components.get("media");if(m){let w=m.get("movie");typeof w=="string"&&(t.mediaPath=w)}let x=a.components.get("proxy");if(x){let w=x.get("size");w&&w.length>=2&&(t.dimensions={width:w[0],height:w[1]})}if(!t.dimensions){let w=a.components.get("request");if(w){let C=w.get("width"),S=w.get("height");typeof C=="number"&&typeof S=="number"&&(t.dimensions={width:C,height:S})}}}if(!t.dimensions){let m=e.find(x=>x.protocol==="RVStack");if(m){let x=m.components.get("output");if(x){let w=x.get("size");w&&w.length>=2&&(t.dimensions={width:w[0],height:w[1]})}}}if(!t.dimensions){let m=e.find(x=>x.protocol==="RVSequence");if(m){let x=m.components.get("output");if(x){let w=x.get("size");w&&w.length>=2&&(t.dimensions={width:w[0],height:w[1]})}}}let r=(g=(p=(u=t.dimensions)==null?void 0:u.width)!=null?p:o.width)!=null?g:1920,c=(y=(b=(v=t.dimensions)==null?void 0:v.height)!=null?b:o.height)!=null?y:1080,l=(f=o.fps)!=null?f:25;t.fps=l;let s=e.filter(m=>m.protocol==="RVPaint");if(s.length===0)return t;let h=new Map;for(let m of s)for(let[x,w]of m.components){let C=x.match(/^pen:\d+:(\d+):/i);if(C){let E=parseInt(C[1]),P=An(w,r,c);P&&(h.has(E)||h.set(E,[]),h.get(E).push(P));continue}let S=x.match(/^text:\d+:(\d+):/i);if(S){let E=parseInt(S[1]),P=Ln(w,r,c);P&&(h.has(E)||h.set(E,[]),h.get(E).push(P))}}for(let[m,x]of h)t.frames.push({frame:m,fps:l,version:1,shapes:x});return t.frames.sort((m,x)=>m.frame-x.frame),t}function Ct(t){return I(this,arguments,function*(i,o={}){let e=yield i.text();return Bt(e,o)})}B.prototype.initUI=Te;B.prototype.initCanvas=Se;B.prototype.addFrameSquareOverlay=De;B.prototype.addVideoOverlay=Be;B.prototype.addProgressBarOverlay=Oe;new EventSource("/esbuild").addEventListener("change",()=>location.reload());var A=document.querySelector("video");function Xe(){return I(this,null,function*(){let i=yield fetch(A.currentSrc).then(y=>y.blob()),o=new Promise(y=>{setTimeout(()=>{y(!0)},250),A.addEventListener("loadeddata",()=>{y(!0)},{once:!0})}),t=yield fetch("./frame_29.png").then(y=>I(this,null,function*(){let f=yield y.blob(),m=new Blob([f],{type:"image/png"}),x=new Image,w=new Promise(C=>{x.addEventListener("load",()=>{C(!0)},{once:!0})});return x.src=window.URL.createObjectURL(m),yield w,x}));A.paused||A.pause();let e=new Blob([i],{type:"video/mp4"}),n=new B(A,{toolbar:{defaultTool:null}});yield n.setVideoBlob(e,30),yield o,yield n.addReferenceVideoByURL("./mov_bbb_g.mp4"),requestAnimationFrame(()=>{n.setCanvasSize()}),n.enableVideoFrameBuffer(),console.log({tool:n}),n.addShapesToFrame(29,[{type:"image",image:t,x:0,y:0,width:1,height:1,strokeStyle:"red",lineWidth:2,fillStyle:"red"}]),A.paused||A.pause(),setInterval(()=>{n.destroy(),n.init(A)},1e8),setInterval(()=>{console.log(n.saveAllFrames())},1e5);let a=document.getElementById("file"),r=document.getElementById("download"),c=document.getElementById("sample"),l=document.getElementById("video"),s=document.getElementById("ref-video");l.addEventListener("change",y=>I(this,null,function*(){if(!l.files||l.files.length===0)return;let f=prompt("Enter FPS","30");if(!f)return;let m=l.files[0],x=new Blob([m],{type:m.type});yield n.setVideoBlob(x,parseInt(f,10))})),s.addEventListener("change",y=>I(this,null,function*(){if(!s.files||s.files.length===0)return;let f=prompt("Enter FPS","30");if(!f)return;let m=s.files[0],x=new Blob([m],{type:m.type}),w=window.URL.createObjectURL(x);yield n.addReferenceVideoByURL(w,parseInt(f,10),m.type)})),c.addEventListener("click",y=>{y.stopPropagation(),y.preventDefault(),fetch("./annotations-sample.json").then(f=>f.json()).then(f=>{n.loadAllFrames(f),n.updateActiveTimeFrame(),n.redrawFullCanvas()})}),a.addEventListener("change",y=>{if(!a.files||a.files.length===0)return;let f=a.files[0],m=new FileReader;m.onload=x=>{if(!x.target)return;let w=x.target.result,C=JSON.parse(w);confirm("Append to existing annotations?")?n.appendFrames(C):n.loadAllFrames(C),n.updateActiveTimeFrame(),n.redrawFullCanvas()},m.readAsText(f)}),r.addEventListener("click",y=>{y.stopPropagation(),y.preventDefault();let f=n.saveAllFrames(),m=document.createElement("a");m.href=URL.createObjectURL(new Blob([JSON.stringify(f)],{type:"application/json"}));let x=new Date().toISOString().replace(/:/g,"-");m.download=`annotations-${x}.json`,m.click()});let h=document.getElementById("rv-file"),u=document.getElementById("download-rv");h.addEventListener("change",y=>I(this,null,function*(){if(!h.files||h.files.length===0)return;let f=h.files[0];try{let m=yield Ct(f,{fps:n.fps});console.log("RV file dimensions:",m.dimensions),console.log("Demo video dimensions:",A.videoWidth,"x",A.videoHeight),console.log("Canvas dimensions:",n.canvasWidth,"x",n.canvasHeight),confirm("Append to existing annotations?")?n.appendFrames(m.frames):n.loadAllFrames(m.frames),n.updateActiveTimeFrame(),n.redrawFullCanvas();let w=m.frames.map(C=>C.frame);console.log(`Loaded ${m.frames.length} annotated frames:`,w),m.frames.length>0&&console.log("First frame shapes:",m.frames[0].shapes),m.mediaPath&&console.log("OpenRV media path:",m.mediaPath)}catch(m){console.error("Failed to parse OpenRV file:",m),alert("Failed to parse OpenRV file. Check console for details.")}})),u.addEventListener("click",y=>{y.stopPropagation(),y.preventDefault();let f=n.saveAllFrames();if(f.length===0){alert("No annotations to export.");return}let m=new Date().toISOString().replace(/:/g,"-");Tt(f,{mediaPath:A.currentSrc||"video.mp4",width:n.canvasWidth||1920,height:n.canvasHeight||1080,sessionName:`sm-annotate-${m}`},`annotations-${m}.rv`)});let p=document.querySelectorAll(".layout-btn"),g=document.getElementById("layout-label"),v={horizontal:"Horizontal (default)",vertical:"Vertical Sidebar",minimal:"Minimal / Floating","bottom-dock":"Bottom Dock"};p.forEach(y=>{y.addEventListener("click",f=>{let m=f.currentTarget,x=m.dataset.layout;p.forEach(w=>w.classList.remove("active")),m.classList.add("active"),g&&(g.textContent=v[x]),n.setLayout(x),requestAnimationFrame(()=>{n.setCanvasSize()})})});let b;window.addEventListener("resize",()=>{b&&clearTimeout(b),b=window.setTimeout(()=>{n.setCanvasSize()},100)})})}A.readyState===0?A.addEventListener("loadedmetadata",()=>{requestAnimationFrame(()=>{Xe()})},{once:!0}):Xe();})();
