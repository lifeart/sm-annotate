var Xe=Object.create;var St=Object.defineProperty,Ye=Object.defineProperties,Ne=Object.getOwnPropertyDescriptor,Ue=Object.getOwnPropertyDescriptors,Ge=Object.getOwnPropertyNames,Nt=Object.getOwnPropertySymbols,je=Object.getPrototypeOf,Gt=Object.prototype.hasOwnProperty,Ke=Object.prototype.propertyIsEnumerable;var D=Math.pow,Ut=(o,i,t)=>i in o?St(o,i,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[i]=t,w=(o,i)=>{for(var t in i||(i={}))Gt.call(i,t)&&Ut(o,t,i[t]);if(Nt)for(var t of Nt(i))Ke.call(i,t)&&Ut(o,t,i[t]);return o},M=(o,i)=>Ye(o,Ue(i));var qe=(o,i)=>()=>(i||o((i={exports:{}}).exports,i),i.exports);var _e=(o,i,t,e)=>{if(i&&typeof i=="object"||typeof i=="function")for(let n of Ge(i))!Gt.call(o,n)&&n!==t&&St(o,n,{get:()=>i[n],enumerable:!(e=Ne(i,n))||e.enumerable});return o};var Je=(o,i,t)=>(t=o!=null?Xe(je(o)):{},_e(i||!o||!o.__esModule?St(t,"default",{value:o,enumerable:!0}):t,o));var P=(o,i,t)=>new Promise((e,n)=>{var a=l=>{try{h(t.next(l))}catch(s){n(s)}},r=l=>{try{h(t.throw(l))}catch(s){n(s)}},h=l=>l.done?e(l.value):Promise.resolve(l.value).then(a,r);h((t=t.apply(o,i)).next())});var Me=qe((Mo,Ce)=>{"use strict";function cn(o){for(var i=1/0,t=-1/0,e=0,n=o.length,a;e<n;e++)a=o[e],i>a&&(i=a),t<a&&(t=a);return{min:i,max:t}}function we(o,i){var t=Math.pow(2,i-1),e=o<0?o*t:o*(t-1);return Math.max(-t,Math.min(t-1,e))}function Te(o,i,t){var e,n=o.length,a=Math.ceil(n/i),r,h,l,s,c,u,p=Se(t,a*2);for(e=0;e<a;e++)r=e*i,h=(e+1)*i>n?n:(e+1)*i,l=o.subarray(r,h),u=cn(l),c=we(u.min,t),s=we(u.max,t),p[e*2]=c,p[e*2+1]=s;return p}function Se(o,i){return new(new Function(`return Int${o}Array`)())(i)}function dn(o,i){var t=o.length,e=1/t,n=o[0].length/2,a=0,r=0,h,l,s=Se(i,n*2);for(r=0;r<n;r++){for(h=0,l=0,a=0;a<t;a++)h+=e*o[a][r*2],l+=e*o[a][r*2+1];s[r*2]=h,s[r*2+1]=l}return[s]}function mt(o,i){return typeof o=="number"?o:i}Ce.exports=function(o,i,t,e,n,a){if(i=mt(i,1e3),a=mt(a,16),t==null&&(t=!0),[8,16,32].indexOf(a)<0)throw new Error("Invalid number of bits specified for peaks.");var r=o.numberOfChannels,h=[],l,s,c,u;if(e=mt(e,0),n=mt(n,o.length),typeof o.subarray=="undefined")for(l=0;l<r;l++)c=o.getChannelData(l),u=c.subarray(e,n),h.push(Te(u,i,a));else h.push(Te(o.subarray(e,n),i,a));return t&&h.length>1&&(h=dn(h,a)),s=h[0].length/2,{length:s,data:h,bits:a}}});var Ze={bgPrimary:"rgba(28, 28, 32, 0.95)",bgSecondary:"rgba(42, 42, 48, 0.98)",bgTertiary:"#35353d",bgHover:"rgba(255, 255, 255, 0.08)",bgActive:"rgba(255, 255, 255, 0.12)",textPrimary:"#f0f0f2",textSecondary:"#a8a8b0",textMuted:"#68687a",border:"rgba(255, 255, 255, 0.1)",borderHover:"rgba(255, 255, 255, 0.2)",accent:"#5b9fff",accentHover:"#7db3ff",shadow:"rgba(0, 0, 0, 0.4)"},Qe={bgPrimary:"rgba(250, 250, 252, 0.95)",bgSecondary:"rgba(255, 255, 255, 0.98)",bgTertiary:"#f0f0f5",bgHover:"rgba(0, 0, 0, 0.04)",bgActive:"rgba(0, 0, 0, 0.08)",textPrimary:"#1a1a24",textSecondary:"#5a5a6e",textMuted:"#9090a0",border:"rgba(0, 0, 0, 0.1)",borderHover:"rgba(0, 0, 0, 0.2)",accent:"#2563eb",accentHover:"#3b82f6",shadow:"rgba(0, 0, 0, 0.15)"},tn={dark:Ze,light:Qe},d="sm-annotate";function en(o){return`
    --${d}-bg-primary: ${o.bgPrimary};
    --${d}-bg-secondary: ${o.bgSecondary};
    --${d}-bg-tertiary: ${o.bgTertiary};
    --${d}-bg-hover: ${o.bgHover};
    --${d}-bg-active: ${o.bgActive};
    --${d}-text-primary: ${o.textPrimary};
    --${d}-text-secondary: ${o.textSecondary};
    --${d}-text-muted: ${o.textMuted};
    --${d}-border: ${o.border};
    --${d}-border-hover: ${o.borderHover};
    --${d}-accent: ${o.accent};
    --${d}-accent-hover: ${o.accentHover};
    --${d}-shadow: ${o.shadow};

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
  `}function nn(){return`
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
  `}var q=null;function Ct(o="dark"){q||(q=document.createElement("style"),q.id=`${d}-theme-styles`,document.head.appendChild(q));let i=tn[o];q.textContent=`
    :root {
      ${en(i)}
    }
    ${nn()}
  `}function F(o){o.classList.add(`${d}-btn`)}function jt(o){o.classList.add(`${d}-container`)}function Kt(o){o.classList.add(`${d}-player-controls`)}function qt(o){o.classList.add(`${d}-color-picker`)}function _t(o){o.classList.add(`${d}-slider`)}function Jt(o){o.classList.add(`${d}-fullscreen-btn`)}function _(){let o=document.createElement("div");return o.classList.add(`${d}-divider`),o}function j(){return d}function Zt(o){let i=document.createElement("button");i.type="button",i.dataset.tooltip="Toggle theme",F(i);let t=()=>{let e=o.theme==="dark";i.innerHTML=e?`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
        </svg>`};return t(),o.addEvent(i,"click",()=>{o.setTheme(o.theme==="dark"?"light":"dark"),t()}),i}function Qt(o,i){let t=document.createElement("button");t.type="button",F(t),t.style.float="right",t.dataset.tooltip="Download frame",t.dataset.tooltipPosition="bottom",t.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>',i.addEvent(t,"click",()=>{let e=i.frameToDataUrl();if(!e)return;let n=document.createElement("a");n.download=`frame_${String(i.activeTimeFrame).padStart(3,"0")}.png`,n.href=e,n.click()}),i.buttons.push(t),i.playerControlsContainer.appendChild(t)}var te='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume-x"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="22" x2="16" y1="9" y2="15"></line><line x1="16" x2="22" y1="9" y2="15"></line></svg>',ee='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume-2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>';function ne(o,i){let t=document.createElement("button");t.type="button",F(t),t.dataset.tooltip="Mute/Unmute",t.dataset.tooltipPosition="bottom",o.muted||o.volume===0?t.innerHTML=te:t.innerHTML=ee,i.addEvent(o,"volumechange",()=>{o.muted||o.volume===0?t.innerHTML=te:t.innerHTML=ee}),i.addEvent(t,"click",()=>{if(o.muted){o.muted=!1;return}o.volume===0?o.volume=1:o.volume=0}),i.buttons.push(t),i.playerControlsContainer.appendChild(t)}var O=[{value:0,label:"off"},{value:.25,label:"25%"},{value:.5,label:"50%"},{value:.7,label:"70%"},{value:1,label:"100%"}];function ie(o,i=!1){let t=i?'<circle cx="18" cy="6" r="4" fill="currentColor" opacity="0.7"/>':"";return`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <style>
      .label {
        font-family: sans-serif;
        font-size: 9px;
      }
    </style>
    <rect x="3" y="3" width="18" height="18" rx="2" opacity="${o.value===0?.3:o.value}"/>
    <text x="12" y="14" text-anchor="middle" class="label" fill="currentColor">${o.label}</text>
    ${t}
  </svg>`}function Mt(o){let i=O.findIndex(t=>t.value===o);return i===-1?4:i}function oe(o){let i=document.createElement("button");i.type="button",i.dataset.tooltip="Opacity";let t=Mt(o.overlayOpacity),e=()=>{var h;let a=o.currentTool==="move"?o.pluginForTool("move"):null,r=a==null?void 0:a.getSelectedShape();if(r){let l=(h=r.opacity)!=null?h:1,s=Mt(l);i.innerHTML=ie(O[s],!0),i.dataset.tooltip="Shape opacity"}else i.innerHTML=ie(O[t],!1),i.dataset.tooltip="Overlay opacity"};e(),F(i),o.addEvent(i,"click",()=>{var h;let a=o.currentTool==="move"?o.pluginForTool("move"):null,r=a==null?void 0:a.getSelectedShape();if(r&&a){let l=(h=r.opacity)!=null?h:1,s=Mt(l);s=(s+1)%O.length;let c=O[s].value;a.setSelectedShapeOpacity(c)}else t=(t+1)%O.length,o.overlayOpacity=O[t].value,o.redrawFullCanvas();e()});let n=o.redrawFullCanvas.bind(o);return o.redrawFullCanvas=()=>{n(),e()},o.buttons.push(i),o.uiContainer.appendChild(i),i}var ae='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>',on='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pause"><rect width="4" height="16" x="6" y="4"></rect><rect width="4" height="16" x="14" y="4"></rect></svg>';function re(o,i){let t=document.createElement("button");t.type="button",t.innerHTML=ae,F(t),t.dataset.tooltip="Play/Pause",t.dataset.tooltipPosition="bottom",i.addEvent(o,"play",()=>{t.innerHTML=on}),i.addEvent(o,"pause",()=>{t.innerHTML=ae}),i.addEvent(t,"click",()=>{i.withRefVideo(e=>{e.paused&&e.play().then(()=>{i.showButton("compare")})}),o.paused?o.play().then(()=>{i.redrawFullCanvas()}):(o.pause(),i.raf(()=>{i.redrawFullCanvas()}))}),i.buttons.push(t),i.playerControlsContainer.appendChild(t)}function se(o){return`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-superscript">
        <style>
            .small {
                font-family: auto;
                font-size: ${o===1?"16":"24"}px;
            }
        </style>
        <text x="${o===1?3:2}" y="${o===1?17:20}" font-weight="normal" class="small">${{"0.25":"\xBC","0.5":"\xBD","0.75":"\xBE",1:"1\xD7"}[String(o)]}</text>
        
    </svg>`}function le(o,i){let t=[.25,.5,.75,1],e=document.createElement("button"),n=t[t.length-1];e.type="button",o.playbackRate=n,e.innerHTML=se(n),F(e),e.dataset.tooltip="Playback speed",e.dataset.tooltipPosition="bottom",i.addEvent(e,"click",()=>{let a=t.indexOf(o.playbackRate),r=a+1>=t.length?0:a+1;o.playbackRate=t[r],e.innerHTML=se(t[r])}),i.buttons.push(e),i.playerControlsContainer.appendChild(e)}var an=500;function he(o,i,t){let e=null,n=!1,a=()=>{n=!1,e=setTimeout(()=>{n=!0,t(),i.redrawFullCanvas()},an)},r=()=>{e&&(clearTimeout(e),e=null)},h=()=>{e&&(clearTimeout(e),e=null)},l=s=>{n&&(s.preventDefault(),s.stopImmediatePropagation(),n=!1)};i.addEvent(o,"click",l),o.addEventListener("pointerdown",a),o.addEventListener("pointerup",r),o.addEventListener("pointerleave",h),i.destructors.push(()=>{o.removeEventListener("pointerdown",a),o.removeEventListener("pointerup",r),o.removeEventListener("pointerleave",h),e&&clearTimeout(e)})}var Q=class{constructor(i,t){this.create=(i,t,e=this.uiContainer,n,a="top")=>{let r=document.createElement("button");if(r.type="button",r.innerHTML=i,F(r),n&&(r.dataset.tooltip=n,a==="bottom"&&(r.dataset.tooltipPosition="bottom")),e.appendChild(r),this.buttons.push(r),typeof t=="function")this.addEvent(r,"click",t);else{r.dataset.tool=t;let h=()=>{this.currentTool===t?this.currentTool=null:this.currentTool=t};try{this.tool.pluginForTool(t),this.addEvent(r,"click",h)}catch(l){console.error(l),r.disabled=!0}}return r};this.tool=i,this.uiContainer=t}get buttons(){return this.tool.buttons}get addEvent(){return this.tool.addEvent.bind(this.tool)}get currentTool(){return this.tool.currentTool}set currentTool(i){this.tool.currentTool=i}};function ce(o,i){let t=o.videoElement.tagName==="VIDEO"?o.videoElement:null;if(i.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>',"rectangle",i.uiContainer,"Rectangle"),i.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>',"circle",i.uiContainer,"Circle"),i.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.3 8.7 8.7 21.3c-1 1-2.5 1-3.4 0l-2.6-2.6c-1-1-1-2.5 0-3.4L15.3 2.7c1-1 2.5-1 3.4 0l2.6 2.6c1 1 1 2.5 0 3.4Z"></path><path d="m7.5 10.5 2 2"></path><path d="m10.5 7.5 2 2"></path><path d="m13.5 4.5 2 2"></path><path d="m4.5 13.5 2 2"></path></svg>',"line",i.uiContainer,"Line"),i.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"></path><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"></path></svg>',"curve",i.uiContainer,"Freehand"),i.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>',"arrow",i.uiContainer,"Arrow"),i.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>',"text",i.uiContainer,"Text"),i.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"></path><path d="M22 21H7"></path><path d="m5 11 9 9"></path></svg>',"eraser",i.uiContainer,"Eraser"),i.uiContainer.appendChild(_()),i.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 9 2 12 5 15"></polyline><polyline points="9 5 12 2 15 5"></polyline><polyline points="15 19 12 22 9 19"></polyline><polyline points="19 9 22 12 19 15"></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line></svg>',"move",i.uiContainer,"Move shape"),i.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-flip-horizontal"><path d="M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3"></path><path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3"></path><path d="M12 20v2"></path><path d="M12 14v2"></path><path d="M12 8v2"></path><path d="M12 2v2"></path></svg>',"compare",i.uiContainer,"Compare videos"),oe(o),i.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"></path><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path></svg>',()=>{o.handleUndo()},i.uiContainer,"Undo (Ctrl+Z)"),t){let e=i.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>',()=>{o.prevFrame()},o.playerControlsContainer,"Previous frame (hold for annotation)","bottom");he(e,o,()=>o.prevAnnotatedFrame()),re(t,o);let n=i.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>',()=>{o.nextFrame()},o.playerControlsContainer,"Next frame (hold for annotation)","bottom");he(n,o,()=>o.nextAnnotatedFrame()),ne(t,o),le(t,o),Qt(t,o)}i.create(`<svg viewBox="0 0 24 24" width="24" height="24">
      <path fill="currentColor" d="M3 3h18v18H3V3m2 2v14h14V5H5z"/>
      <path fill="currentColor" d="M7 7h10v10H7V7m2 2v6h6V9H9z"/>
    </svg>`,"selection",i.uiContainer,"Select region")}var $=(o,i)=>{let t=o.target===document.body,e=i.uiContainer.contains(o.target),n=i.playerControlsContainer.contains(o.target),a=i.videoElement.contains(o.target),r=i.canvas.contains(o.target);return e||n||a||r||t};function tt(o){return o.pointerType==="pen"?!1:o.pointerType==="touch"&&o.isPrimary===!1}function de(o,i){if(!$(o,i))return;let t=i.uiContainer.contains(o.target),e=i.playerControlsContainer.contains(o.target);if(t||e)return;let n=i.videoElement;n.tagName==="VIDEO"&&(n.paused||(i.currentTool=null,n.pause(),i.raf(()=>P(this,null,function*(){i.redrawFullCanvas()}))))}function ue(o,i){var t;$(o,i)&&(o.preventDefault(),o.stopPropagation(),o.stopImmediatePropagation(),(t=o.clipboardData)==null||t.setData("application/json",JSON.stringify(i.saveCurrentFrame())))}function pe(o,i){var e;if(!$(o,i))return;o.preventDefault(),o.stopPropagation(),o.stopImmediatePropagation();let t=i.saveCurrentFrame();i.replaceFrame(i.playbackFrame,[]),i.redrawFullCanvas(),(e=o.clipboardData)==null||e.setData("application/json",JSON.stringify(t))}function me(o,i){if(!$(o,i))return;let t=i.videoElement;t.tagName==="VIDEO"&&(o.key==="ArrowLeft"||o.key==="ArrowRight"?(o.preventDefault(),o.stopPropagation(),o.stopImmediatePropagation(),o.key==="ArrowLeft"?i.prevFrame():o.key==="ArrowRight"&&i.nextFrame()):o.code==="Space"&&(o.preventDefault(),o.stopPropagation(),o.stopImmediatePropagation(),t.paused?t.play().then(()=>{i.redrawFullCanvas()}):(t.pause(),i.raf(()=>{i.redrawFullCanvas()}))))}function fe(o,i){var a,r,h,l,s;if(!$(o,i))return;let t=(r=(a=o.clipboardData)==null?void 0:a.types)!=null?r:[];if(t.includes("application/json"))o.preventDefault(),o.stopPropagation(),o.stopImmediatePropagation();else if(t.includes("Files")){let c=(h=o.clipboardData)==null?void 0:h.files;if(c&&c.length>0){let u=c[0];if(u.type.startsWith("image/")){o.preventDefault(),o.stopPropagation(),o.stopImmediatePropagation();let p=new Image,m=URL.createObjectURL(u);p.addEventListener("load",()=>{URL.revokeObjectURL(m);let f=p.naturalWidth/p.naturalHeight,y=.25,x=y/f*i.aspectRatio;i.addShapesToFrame(i.playbackFrame,[{type:"image",image:p,x:0,y:0,width:y,height:x,strokeStyle:"red",fillStyle:"red",lineWidth:2}]),i.redrawFullCanvas(),i.raf(()=>{i.show()}),i.currentTool="move"},{once:!0}),p.addEventListener("error",()=>{URL.revokeObjectURL(m)},{once:!0}),p.src=m,i.redrawFullCanvas()}}}else if(t.includes("text/plain")){let c=(l=o.clipboardData)==null?void 0:l.getData("text/plain");c&&(o.preventDefault(),o.stopPropagation(),o.stopImmediatePropagation(),i.addShapesToFrame(i.playbackFrame,[{type:"text",text:c,x:.4,y:.4,strokeStyle:i.ctx.strokeStyle,fillStyle:i.ctx.fillStyle,lineWidth:i.ctx.lineWidth}]),i.show(),i.currentTool="move",i.redrawFullCanvas())}else return;let e=(s=o.clipboardData)==null?void 0:s.getData("application/json");if(!e)return;let n=JSON.parse(e);n&&n.shapes&&n.version===1&&(i.addShapesToFrame(i.playbackFrame,n.shapes),i.redrawFullCanvas())}var z={r:"#d31a3b",g:"#15d33b",b:"#0085CA",y:"#F3CE32",a:"#7fffd4",c:"#00ffff",d:"#696969",e:"#50c878",f:"#ff00ff",h:"#f0fff0",i:"#4b0082",j:"#00a86b",k:"#f0e68c",l:"#e6e6fa",m:"#98ff98",n:"#000080",o:"#ffa500",p:"#800080",q:"#e5acc8",s:"#0f52ba",t:"#008080",u:"#3f00ff",v:"#ee82ee",w:"#ffffff",x:"#738678",z:"#0014a8"};function ge(o,i){let t=document.createElement("input");t.type="color",t.value=o,t.dataset.tooltip="Stroke color";let e=n=>{i.ctx.strokeStyle=n.target.value,i.ctx.fillStyle=n.target.value,i.focusOnMediaNode()};return i.addEvent(t,"input",e),t}function ve(o){let i=document.createElement("input");i.type="number",i.step="1",i.min="1",i.max="10",i.value="5",i.style.margin="5px",i.dataset.tooltip="Stroke width";let t=e=>{o.ctx.lineWidth=e.target.valueAsNumber,o.focusOnMediaNode()};return o.addEvent(i,"input",t),i}var rn=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
</svg>`;function ye(o){let i=document.createElement("button");i.innerHTML=rn,i.type="button",i.dataset.tooltip="Fullscreen",i.dataset.tooltipPosition="bottom",Jt(i);let t=()=>{if(document.fullscreenElement)document.exitFullscreen&&document.exitFullscreen();else{let n=o.videoElement.parentElement;n!=null&&n.requestFullscreen&&n.requestFullscreen()}};i.addEventListener("click",t);let e=()=>{o.setCanvasSize(),o.playbackFrame=o.playbackFrame,o.canvas.focus(),o.redrawFullCanvas(),i.blur()};return document.addEventListener("fullscreenchange",e),o.destructors.push(()=>{i.removeEventListener("click",t),document.removeEventListener("fullscreenchange",e)}),i}var sn=z.r,ln="",hn="";function xe(){var h,l;let o=document.createElement("div");o.style.cssText=hn,jt(o),(h=this.canvas.parentNode)==null||h.insertBefore(o,this.canvas);let i=document.createElement("div");i.style.cssText=ln,Kt(i),(l=this.canvas.parentNode)==null||l.insertBefore(i,this.canvas.nextSibling),this.playerControlsContainer=i;let t=this.videoElement.tagName==="VIDEO"?this.videoElement:null;this.uiContainer=o;let e=()=>{let s=document.createElement("div");return s.style.display="inline-flex",s.style.alignItems="center",s},n=new Q(this,o);ce(this,n),this.isMobile&&(this.hideButton("line"),this.hideButton("circle"),this.hideButton("rectangle"),this.hideButton("eraser")),this.hideButton("compare"),o.appendChild(_()),this.colorPicker=ge(sn,this),qt(this.colorPicker),o.appendChild(this.colorPicker);let a=e();this.strokeSizePicker=ve(this),_t(this.strokeSizePicker),a.appendChild(this.strokeSizePicker),o.appendChild(a),o.appendChild(_());let r=Zt(this);if(o.appendChild(r),t){this.hide(),this.addEvent(t,"pause",()=>{this.show()}),this.addEvent(t,"seek",()=>{t.paused&&this.show()}),this.addEvent(t,"timeupdate",()=>{t.currentTime<2e-4&&!t.paused&&this.startAnnotationsAsVideo()}),this.addEvent(t,"error",()=>{this.hide()}),this.addEvent(t,"stalled",()=>{this.hide()}),this.addEvent(t,"play",()=>{this.hideControls(),this.startAnnotationsAsVideo()}),this.addEvent(document,"copy",c=>{ue(c,this)}),this.addEvent(document,"cut",c=>{pe(c,this)}),this.addEvent(document,"paste",c=>{fe(c,this)}),this.addEvent(document,"click",c=>{de(c,this)}),this.addEvent(document,"keydown",c=>{me(c,this)}),this.addEvent(document.body.querySelector("div"),"drop",c=>{var u;(u=c.dataTransfer)!=null&&u.types});let s=ye(this);i.appendChild(s)}}function be(){var o;this.canvas=document.createElement("canvas"),this.ctx=this.canvas.getContext("2d"),(o=this.videoElement.parentNode)==null||o.insertBefore(this.canvas,this.videoElement.nextSibling),this.canvas.style.position="absolute",this.canvas.style.backgroundColor="transparent",this.canvas.style.top="0",this.canvas.style.left="0",this.canvas.style.zIndex="1",this.addEvent(this.canvas,"pointerdown",this.handleMouseDown),this.addEvent(this.canvas,"pointermove",this.handleMouseMove),this.addEvent(this.canvas,"pointerup",this.handleMouseUp),this.addEvent(this.canvas,"pointercancel",this.handleMouseUp),this.addEvent(this.canvas,"pointerenter",()=>{this.isCursorOverCanvas=!0}),this.addEvent(this.canvas,"pointerleave",()=>{this.isCursorOverCanvas=!1}),this.addEvent(this.canvas,"touchmove",i=>{i.stopImmediatePropagation(),i.stopPropagation(),i.preventDefault()}),this.addEvent(window,"resize",this.setCanvasSize),this.addEvent(document,"keydown",this.onKeyDown)}var et=class{constructor(){this.destructors=[];this.isDestroyed=!1;this.activeTimeFrame=1;this.globalShapes=[];this.timeStack=new Map;this.undoTimeStack=new Map}cleanFrameStacks(){this.timeStack.clear(),this.undoTimeStack.clear()}destroy(){this.destructors.forEach(i=>i()),this.destructors=[],this.globalShapes=[],this.cleanFrameStacks()}raf(i){return requestAnimationFrame(i)}addEvent(i,t,e){let n=a=>{this.isDestroyed||e(a)};i.addEventListener(t,n),this.destructors.push(()=>{i.removeEventListener(t,n)})}addProgressBarOverlay(){throw new Error("Method not implemented.")}initUI(){throw new Error("Method not implemented.")}initCanvas(){throw new Error("Method not implemented.")}addFrameSquareOverlay(i=this.activeTimeFrame){throw new Error("Method not implemented.")}addVideoOverlay(){throw new Error("Method not implemented.")}withRefVideo(i){this.isDestroyed||this.referenceVideoElement&&i(this.referenceVideoElement)}withVideo(i){if(this.isDestroyed)return;let t=this.videoElement;!t||t.tagName!=="VIDEO"||i(t)}};var C=class{constructor(i){this.startX=0;this.startY=0;this.isDrawing=!1;this.annotationTool=i}isPointerAtShape(i,t,e){return!1}on(i,t){}get ctx(){return this.annotationTool.ctx}onDeactivate(){}onActivate(){}reset(){this.startX=0,this.startY=0,this.isDrawing=!1}save(i){this.annotationTool.addShape(i)}applyRotation(i,t,e){return i.rotation?(this.ctx.save(),this.ctx.translate(t,e),this.ctx.rotate(i.rotation),this.ctx.translate(-t,-e),!0):!1}restoreRotation(){this.ctx.restore()}getRotationCenter(i,t,e){return i.rotationCenterX!==void 0&&i.rotationCenterY!==void 0?{x:i.rotationCenterX*this.annotationTool.canvasWidth,y:i.rotationCenterY*this.annotationTool.canvasHeight}:{x:t,y:e}}};var nt=class extends C{constructor(){super(...arguments);this.name="rectangle"}move(t,e,n){return t.x+=e,t.y+=n,t}normalize(t,e,n){return M(w({},t),{x:t.x/e,y:t.y/n,width:t.width/e,height:t.height/n})}onPointerDown(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.startX=e,this.startY=n,this.isDrawing=!0}onPointerMove(t){if(!this.isDrawing)return;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.drawRectangle(this.startX,this.startY,e-this.startX,n-this.startY)}onPointerUp(t){if(!this.isDrawing)return;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.save({type:"rectangle",x:this.startX,y:this.startY,width:e-this.startX,height:n-this.startY,strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth}),this.drawRectangle(this.startX,this.startY,e-this.startX,n-this.startY),this.isDrawing=!1}drawRectangle(t,e,n,a){this.ctx.beginPath(),this.ctx.rect(t,e,n,a),this.ctx.stroke()}draw(t){let e=t.x+t.width/2,n=t.y+t.height/2,a=this.getRotationCenter(t,e,n),r=this.applyRotation(t,a.x,a.y);this.drawRectangle(t.x,t.y,t.width,t.height),r&&this.restoreRotation()}isPointerAtShape(t,e,n){let r=Math.min(t.x,t.x+t.width),h=Math.max(t.x,t.x+t.width),l=Math.min(t.y,t.y+t.height),s=Math.max(t.y,t.y+t.height),c=Math.abs(e-r)<=5,u=Math.abs(e-h)<=5,p=Math.abs(n-l)<=5,m=Math.abs(n-s)<=5,f=n>=l-5&&n<=s+5,y=e>=r-5&&e<=h+5;return(c||u)&&f||(p||m)&&y}};var it=class extends C{constructor(){super(...arguments);this.name="circle"}move(t,e,n){return t.x+=e,t.y+=n,t}normalize(t,e,n){return M(w({},t),{x:t.x/e,y:t.y/n,radius:t.radius/e})}onPointerDown(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.startX=e,this.startY=n,this.isDrawing=!0}onPointerMove(t){if(!this.isDrawing)return;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t),a=Math.sqrt(Math.pow(e-this.startX,2)+Math.pow(n-this.startY,2));this.drawCircle(this.startX,this.startY,a)}onPointerUp(t){if(!this.isDrawing)return;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t),a=Math.sqrt(Math.pow(e-this.startX,2)+Math.pow(n-this.startY,2));this.save({type:"circle",x:this.startX,y:this.startY,radius:a,strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth}),this.drawCircle(this.startX,this.startY,a),this.isDrawing=!1}drawCircle(t,e,n){this.ctx.beginPath(),this.ctx.arc(t,e,n,0,2*Math.PI),this.ctx.stroke()}draw(t){if(t.radius===void 0||t.radius<0)return;let e=this.getRotationCenter(t,t.x,t.y),n=this.applyRotation(t,e.x,e.y);this.drawCircle(t.x,t.y,t.radius),n&&this.restoreRotation()}isPointerAtShape(t,e,n){var s;if(t.radius===void 0||t.radius<0)return!1;let a=e-t.x,r=n-t.y,h=Math.sqrt(a*a+r*r),l=Math.max(((s=t.lineWidth)!=null?s:1)/2,5);return h<=t.radius+l}};var ot=class{constructor(i,t){this.x=i;this.y=t}distanceToLine(i,t){let e=t.x-i.x,n=t.y-i.y,a=Math.abs(n*this.x-e*this.y+t.x*i.y-t.y*i.x),r=Math.sqrt(n*n+e*e);return a/r}};function at(o,i){if(o.length<=2)return o;let t=o[0],e=o[o.length-1],n=-1,a=0;for(let r=1;r<o.length-1;r++){let h=o[r].distanceToLine(t,e);h>a&&(n=r,a=h)}if(a>i){let r=at(o.slice(0,n+1),i),h=at(o.slice(n),i);return r.slice(0,r.length-1).concat(h)}else return[t,e]}var rt=class extends C{constructor(){super(...arguments);this.name="curve";this.curvePoints=[];this.zoomScale=2;this.zoomRadius=100;this.zoomCtx=null;this.zoomCanvas=null;this.onKeyPress=t=>{let e=t.key;if(e===null||e===" "||t.isComposing)return;let n=Number(e);if(isNaN(n)||!n){e in z&&(this.annotationTool.colorPicker.value=z[e],this.annotationTool.setCanvasSettings());return}this.annotationTool.strokeSizePicker.value=e,this.annotationTool.setCanvasSettings()}}move(t,e,n){return t.points=t.points.map(a=>({x:a.x+e,y:a.y+n})),t}onActivate(){this.initZoomCanvas(),document.addEventListener("keypress",this.onKeyPress)}onDeactivate(){this.zoomCtx=null,this.zoomCanvas=null,document.removeEventListener("keypress",this.onKeyPress)}normalize(t,e,n){return M(w({},t),{points:t.points.map(a=>({x:a.x/e,y:a.y/n}))})}draw(t){if(!t.points||t.points.length===0)return;let e=0,n=0;for(let s of t.points)e+=s.x,n+=s.y;let a=e/t.points.length,r=n/t.points.length,h=this.getRotationCenter(t,a,r),l=this.applyRotation(t,h.x,h.y);this.drawCurve(t),l&&this.restoreRotation()}reset(){super.reset(),this.curvePoints=[]}onPointerDown(t){if(this.isDrawing)return;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.curvePoints=[],this.startX=e,this.startY=n,this.isDrawing=!0,this.curvePoints.push({x:e,y:n})}onPointerMove(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);if(!this.isDrawing){this.drawZoomCircle(e,n,t.shiftKey);return}this.curvePoints.push({x:e,y:n}),this.drawCurve({points:this.curvePoints,lineWidth:this.ctx.lineWidth}),this.drawZoomCircle(e,n,t.shiftKey)}onPointerUp(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);if(this.drawZoomCircle(e,n,t.shiftKey),!this.isDrawing)return;this.curvePoints.push({x:e,y:n});let a=this.curvePoints.map(c=>new ot(c.x,c.y)),s={type:"curve",points:at(a,.5).map(c=>({x:c.x,y:c.y})),strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth};this.save(s),this.curvePoints=[],this.isDrawing=!1}drawCurve(t){if(t.points.length===2&&t.points[0].x===t.points[1].x&&t.points[0].y===t.points[1].y){let e=t.lineWidth/4,n=0,a=2*Math.PI;this.ctx.beginPath(),this.ctx.arc(t.points[0].x,t.points[0].y,e,n,a),this.ctx.stroke()}else{this.ctx.beginPath(),this.ctx.moveTo(t.points[0].x,t.points[0].y);for(let e=0;e<t.points.length-1;e++){let n=t.points[e],a=t.points[e+1];this.ctx.quadraticCurveTo(n.x,n.y,a.x,a.y)}this.ctx.stroke()}}initZoomCanvas(){let t=document.createElement("canvas"),e=2;t.width=this.zoomRadius*2*e,t.height=this.zoomRadius*2*e;let n=t.getContext("2d");n&&(n.imageSmoothingQuality="high",n.imageSmoothingEnabled=!0,this.zoomCtx=n,this.zoomCanvas=t)}isPointerAtShape(t,e,n){var r;if(!t.points||t.points.length===0)return!1;let a=Math.max(((r=t.lineWidth)!=null?r:this.ctx.lineWidth)/2,5);for(let h=0;h<t.points.length-1;h++){let l=t.points[h],s=t.points[h+1],c=e-l.x,u=n-l.y,p=s.x-l.x,m=s.y-l.y,f=c*p+u*m,y=p*p+m*m,x=-1;y!==0&&(x=f/y);let g,v;x<0?(g=l.x,v=l.y):x>1?(g=s.x,v=s.y):(g=l.x+x*p,v=l.y+x*m);let b=e-g,T=n-v;if(Math.sqrt(b*b+T*T)<a)return!0}return!1}drawZoomCircle(t,e,n=!1){if(!n)return;this.isDrawing||(this.annotationTool.clearCanvas(),this.annotationTool.addVideoOverlay(),this.annotationTool.drawShapesOverlay());let a=this.zoomCtx;if(!a)return;let r=this.annotationTool.pixelRatio,h=this.zoomRadius*2/this.zoomScale,l=t-h/2,s=e-h/2;a.clearRect(0,0,this.zoomCanvas.width,this.zoomCanvas.height),a.drawImage(this.ctx.canvas,l*r,s*r,h*r,h*r,0,0,this.zoomRadius*2,this.zoomRadius*2),this.ctx.save(),this.ctx.beginPath(),this.ctx.arc(t,e,this.zoomRadius,0,2*Math.PI),this.ctx.closePath(),this.ctx.clip(),this.ctx.drawImage(this.zoomCanvas,t-this.zoomRadius,e-this.zoomRadius),this.ctx.restore()}};var st=class extends C{constructor(){super(...arguments);this.name="line"}move(t,e,n){return t.x1+=e,t.y1+=n,t.x2+=e,t.y2+=n,t}normalize(t,e,n){return M(w({},t),{x1:t.x1/e,y1:t.y1/n,x2:t.x2/e,y2:t.y2/n})}onPointerDown(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.startX=e,this.startY=n,this.isDrawing=!0}onPointerMove(t){if(!this.isDrawing)return;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.drawLine(this.startX,this.startY,e,n)}onPointerUp(t){if(!this.isDrawing)return;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.save({type:"line",x1:this.startX,y1:this.startY,x2:e,y2:n,fillStyle:this.ctx.fillStyle,strokeStyle:this.ctx.strokeStyle,lineWidth:this.ctx.lineWidth}),this.drawLine(this.startX,this.startY,e,n),this.isDrawing=!1}drawLine(t,e,n,a){this.ctx.beginPath(),this.ctx.moveTo(t,e),this.ctx.lineTo(n,a),this.ctx.stroke()}draw(t){let e=(t.x1+t.x2)/2,n=(t.y1+t.y2)/2,a=this.getRotationCenter(t,e,n),r=this.applyRotation(t,a.x,a.y);this.drawLine(t.x1,t.y1,t.x2,t.y2),r&&this.restoreRotation()}isPointerAtShape(t,e,n){var p;let{x1:a,y1:r,x2:h,y2:l}=t,s=Math.max(((p=t.lineWidth)!=null?p:1)/2,5),c=(h-a)*(r-n)-(a-e)*(l-r),u=D(h-a,2)+D(l-r,2);if(u===0){let m=e-a,f=n-r;return Math.sqrt(m*m+f*f)<=s}return Math.abs(c)/Math.sqrt(u)<=s&&e>=Math.min(a,h)-s&&e<=Math.max(a,h)+s&&n>=Math.min(r,l)-s&&n<=Math.max(r,l)+s}};var lt=class extends C{constructor(){super(...arguments);this.name="arrow"}normalize(t,e,n){return M(w({},t),{x1:t.x1/e,y1:t.y1/n,x2:t.x2/e,y2:t.y2/n})}move(t,e,n){return t.x1+=e,t.y1+=n,t.x2+=e,t.y2+=n,t}draw(t){let e=(t.x1+t.x2)/2,n=(t.y1+t.y2)/2,a=this.getRotationCenter(t,e,n),r=this.applyRotation(t,a.x,a.y);this.drawArrow(t.x1,t.y1,t.x2,t.y2,t.lineWidth),r&&this.restoreRotation()}onPointerDown(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.startX=e,this.startY=n,this.isDrawing=!0}onPointerMove(t){if(!this.isDrawing)return;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.drawArrow(this.startX,this.startY,e,n)}onPointerUp(t){if(!this.isDrawing)return;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.save({type:"arrow",x1:this.startX,y1:this.startY,x2:e,y2:n,strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth}),this.drawArrow(this.startX,this.startY,e,n),this.isDrawing=!1}drawArrow(t,e,n,a,r){let h=10+2.5*(r!=null?r:this.ctx.lineWidth),l=Math.PI/6,s=Math.atan2(a-e,n-t);this.ctx.beginPath(),this.ctx.moveTo(t,e),this.ctx.lineTo(n,a),this.ctx.stroke(),this.ctx.beginPath(),this.ctx.moveTo(n,a),this.ctx.lineTo(n-h*Math.cos(s+l),a-h*Math.sin(s+l)),this.ctx.moveTo(n,a),this.ctx.lineTo(n-h*Math.cos(s-l),a-h*Math.sin(s-l)),this.ctx.stroke()}isPointerAtShape(t,e,n){var p;let{x1:a,y1:r,x2:h,y2:l}=t,s=Math.max(((p=t.lineWidth)!=null?p:1)/2,5),c=(h-a)*(r-n)-(a-e)*(l-r),u=D(h-a,2)+D(l-r,2);if(u===0){let m=e-a,f=n-r;return Math.sqrt(m*m+f*f)<=s}return Math.abs(c)/Math.sqrt(u)<=s&&e>=Math.min(a,h)-s&&e<=Math.max(a,h)+s&&n>=Math.min(r,l)-s&&n<=Math.max(r,l)+s}};var ht=class extends C{constructor(){super(...arguments);this.name="text";this.activePopup=null;this.handleKeyDown=t=>{}}move(t,e,n){return t.x+=e,t.y+=n,t}onActivate(){this.annotationTool.canvas.style.cursor="text",this.isDrawing=!0}onDeactivate(){this.destroyPopup(),this.annotationTool.canvas.style.cursor="default",this.isDrawing=!1}draw(t){var m;if(!t.text)return;let e=t.text.split(`
`),n=16+((m=t.lineWidth)!=null?m:this.ctx.lineWidth)*.5,a=n*1.25;this.ctx.font=`${n}px Helvetica Neue, Arial`;let r=e.map(f=>this.ctx.measureText(f).width),h=r.length>0?Math.max(...r):0,l=e.length*a,s=t.x+h/2,c=t.y-n/2+l/2,u=this.getRotationCenter(t,s,c),p=this.applyRotation(t,u.x,u.y);for(let f=0;f<e.length;f++)this.drawTextLine(t.x,t.y+f*a,e[f],n);p&&this.restoreRotation()}drawText(t,e,n){let a=16+this.ctx.lineWidth*.5;this.ctx.font=`${a}px Helvetica Neue, Arial`,this.ctx.fillText(n,t,e)}drawTextLine(t,e,n,a){this.ctx.font=`${a}px Helvetica Neue, Arial`,this.ctx.fillText(n,t,e)}onPointerDown(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.startX=e,this.startY=n}onPointerMove(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.ctx.beginPath(),this.ctx.arc(e,n,5,0,2*Math.PI),this.ctx.fill()}normalize(t,e,n){return M(w({},t),{x:t.x/e,y:t.y/n})}destroyPopup(){var t;this.activePopup&&((t=this.annotationTool.canvas.parentElement)==null||t.removeChild(this.activePopup),this.activePopup=null,document.removeEventListener("keydown",this.handleKeyDown))}createTextInputPopup(t,e){var m;this.destroyPopup();let n=document.createElement("div");this.activePopup=n,n.style.cssText=`
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
    `,s.addEventListener("mouseover",()=>{s.style.opacity="0.8"}),s.addEventListener("mouseout",()=>{s.style.opacity="1"});let c=()=>{this.destroyPopup()},u=()=>{let f=a.value.trim();f&&(this.save({type:"text",x:t,y:e,text:f,strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth}),this.annotationTool.currentTool=null),c()},p=f=>{f.key==="Escape"?c():f.key==="Enter"&&u()};this.handleKeyDown=p,s.onclick=u,l.onclick=c,a.onkeyup=p,document.addEventListener("keydown",p),r.appendChild(l),r.appendChild(s),n.appendChild(a),n.appendChild(r),(m=this.annotationTool.canvas.parentElement)==null||m.appendChild(n),requestAnimationFrame(()=>{a.focus()})}onPointerUp(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.createTextInputPopup(e,n)}isPointerAtShape(t,e,n){var u;if(!t.text)return!1;let a=t.text.split(`
`);if(a.length===0)return!1;let r=16+((u=t.lineWidth)!=null?u:1)*.5,h=r*1.25,l=a.length*h;this.ctx.font=`${r}px Helvetica Neue, Arial`;let s=a.map(p=>this.ctx.measureText(p).width),c=s.length>0?Math.max(...s):0;return c===0?!1:e>=t.x&&e<=t.x+c&&n>=t.y-r&&n<=t.y+l-r}};var ct=class extends C{constructor(){super(...arguments);this.name="eraser"}move(t,e,n){return t.x+=e,t.y+=n,t}normalize(t,e,n){return M(w({},t),{x:t.x/e,y:t.y/n,width:t.width/e,height:t.height/n})}draw(t){this.drawEraser(t.x,t.y,t.width,t.height)}onPointerDown(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.startX=e,this.startY=n,this.isDrawing=!0}onPointerMove(t){if(!this.isDrawing)return;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.ctx.save(),this.ctx.strokeStyle="rgba(255, 255, 255, 0.5)",this.ctx.lineWidth=1,this.ctx.fillStyle="rgba(255, 255, 255, 0.3)",this.ctx.fillRect(this.startX,this.startY,e-this.startX,n-this.startY),this.ctx.strokeRect(this.startX,this.startY,e-this.startX,n-this.startY),this.ctx.restore()}onPointerUp(t){if(!this.isDrawing)return;this.isDrawing=!1;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.save({type:"eraser",x:this.startX,y:this.startY,width:e-this.startX,height:n-this.startY,strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth})}drawEraser(t,e,n,a){this.ctx.clearRect(t,e,n,a)}isPointerAtShape(t,e,n){let a=Math.min(t.x,t.x+t.width),r=Math.max(t.x,t.x+t.width),h=Math.min(t.y,t.y+t.height),l=Math.max(t.y,t.y+t.height);return e>=a&&e<=r&&n>=h&&n<=l}};var dt=class extends C{constructor(){super(...arguments);this.name="move";this.shape=null;this.shapeIndex=-1;this.lastDrawnShape=null;this.isScale=!1;this.selectedShapeIndex=-1;this.boundHandleKeyDown=null;this.activeHandle=null;this.handleSize=8;this.resizeStartBounds=null;this.resizeOriginalShape=null;this.rotationActive=!1;this.rotationStartAngle=0;this.rotationShapeStartAngle=0;this.centerDragActive=!1;this.rotationHandleDistance=40}cloneShape(t){if(t.type==="image"){let e=t;return M(w({},JSON.parse(JSON.stringify(t))),{image:e.image})}return JSON.parse(JSON.stringify(t))}getSelectedShape(){return this.selectedShapeIndex<0||this.selectedShapeIndex>=this.annotationTool.shapes.length?null:this.annotationTool.shapes[this.selectedShapeIndex]}setSelectedShapeOpacity(t){return this.selectedShapeIndex<0||this.selectedShapeIndex>=this.annotationTool.shapes.length?!1:(this.annotationTool.undoStack.push([...this.annotationTool.shapes]),this.annotationTool.shapes[this.selectedShapeIndex].opacity=t,this.annotationTool.redrawFullCanvas(),!0)}move(t){return t}normalize(t){return w({},t)}onActivate(){this.boundHandleKeyDown=this.handleKeyDown.bind(this),document.addEventListener("keydown",this.boundHandleKeyDown)}onDeactivate(){this.boundHandleKeyDown&&(document.removeEventListener("keydown",this.boundHandleKeyDown),this.boundHandleKeyDown=null),this.selectedShapeIndex=-1}handleKeyDown(t){if((t.key==="Backspace"||t.key==="Delete")&&this.selectedShapeIndex>=0){t.preventDefault(),this.deleteSelectedShape();return}if((t.ctrlKey||t.metaKey)&&t.key.toLowerCase()==="d"&&this.selectedShapeIndex>=0){t.preventDefault(),this.duplicateSelectedShape();return}if((t.ctrlKey||t.metaKey)&&t.shiftKey&&t.key==="ArrowRight"){t.preventDefault(),this.copyAnnotationsToNextFrame();return}if((t.ctrlKey||t.metaKey)&&t.shiftKey&&t.key==="ArrowLeft"){t.preventDefault(),this.copyAnnotationsToPrevFrame();return}}duplicateSelectedShape(){let t=this.getSelectedShape();if(!t)return;let e=this.cloneShape(t),n=20;this.getShapeBounds(e)&&this.offsetShape(e,n,n),this.annotationTool.undoStack.push([...this.annotationTool.shapes]);let r=this.annotationTool.serialize([e])[0];this.annotationTool.shapes.push(r),this.selectedShapeIndex=this.annotationTool.shapes.length-1,this.annotationTool.redrawFullCanvas()}copyAnnotationsToNextFrame(){let e=this.annotationTool.activeTimeFrame+1;if(e>this.annotationTool.totalFrames||this.annotationTool.shapes.length===0)return;let n=this.annotationTool.timeStack.get(e)||[],a=this.annotationTool.shapes.map(h=>this.cloneShape(h)),r=[...n,...a];this.annotationTool.timeStack.set(e,r),this.annotationTool.playbackFrame=e,this.annotationTool.redrawFullCanvas()}copyAnnotationsToPrevFrame(){let e=this.annotationTool.activeTimeFrame-1;if(e<1||this.annotationTool.shapes.length===0)return;let n=this.annotationTool.timeStack.get(e)||[],a=this.annotationTool.shapes.map(h=>this.cloneShape(h)),r=[...n,...a];this.annotationTool.timeStack.set(e,r),this.annotationTool.playbackFrame=e,this.annotationTool.redrawFullCanvas()}offsetShape(t,e,n){let a=this.annotationTool.deserialize([t])[0],h=this.annotationTool.pluginForTool(a.type).move(a,e,n);Object.assign(t,this.annotationTool.serialize([h])[0])}getShapeBounds(t){var n;let e=this.annotationTool.deserialize([t])[0];switch(e.type){case"rectangle":{let a=e;return{x:Math.min(a.x,a.x+a.width),y:Math.min(a.y,a.y+a.height),width:Math.abs(a.width),height:Math.abs(a.height)}}case"image":{let a=e;return{x:Math.min(a.x,a.x+a.width),y:Math.min(a.y,a.y+a.height),width:Math.abs(a.width),height:Math.abs(a.height)}}case"selection":{let a=e;return{x:Math.min(a.x,a.x+a.width),y:Math.min(a.y,a.y+a.height),width:Math.abs(a.width),height:Math.abs(a.height)}}case"circle":{let a=e;return{x:a.x-a.radius,y:a.y-a.radius,width:a.radius*2,height:a.radius*2}}case"line":{let a=e,r=Math.min(a.x1,a.x2),h=Math.min(a.y1,a.y2),l=Math.max(a.x1,a.x2),s=Math.max(a.y1,a.y2);return{x:r,y:h,width:l-r||10,height:s-h||10}}case"arrow":{let a=e,r=Math.min(a.x1,a.x2),h=Math.min(a.y1,a.y2),l=Math.max(a.x1,a.x2),s=Math.max(a.y1,a.y2);return{x:r,y:h,width:l-r||10,height:s-h||10}}case"curve":{let a=e;if(!a.points||a.points.length===0)return null;let r=1/0,h=1/0,l=-1/0,s=-1/0;for(let c of a.points)r=Math.min(r,c.x),h=Math.min(h,c.y),l=Math.max(l,c.x),s=Math.max(s,c.y);return{x:r,y:h,width:l-r||10,height:s-h||10}}case"text":{let a=e;if(!a.text)return null;let h=16+((n=t.lineWidth)!=null?n:1)*.5,l=a.text.length*h*.6;return{x:a.x,y:a.y-h,width:l||50,height:h*1.2}}default:return null}}drawResizeHandles(){let t=this.getSelectedShape();if(!t)return;let e=this.getShapeBounds(t);if(!e)return;let n=this.annotationTool.ctx,a=this.handleSize,r=a/2,h=[{pos:"nw",x:e.x,y:e.y},{pos:"n",x:e.x+e.width/2,y:e.y},{pos:"ne",x:e.x+e.width,y:e.y},{pos:"e",x:e.x+e.width,y:e.y+e.height/2},{pos:"se",x:e.x+e.width,y:e.y+e.height},{pos:"s",x:e.x+e.width/2,y:e.y+e.height},{pos:"sw",x:e.x,y:e.y+e.height},{pos:"w",x:e.x,y:e.y+e.height/2}];n.save(),n.strokeStyle="#5b9fff",n.lineWidth=1,n.setLineDash([4,4]),n.strokeRect(e.x,e.y,e.width,e.height),n.setLineDash([]),n.fillStyle="#ffffff",n.strokeStyle="#5b9fff",n.lineWidth=1;for(let l of h)n.fillRect(l.x-r,l.y-r,a,a),n.strokeRect(l.x-r,l.y-r,a,a);n.restore(),this.drawRotationHandles(e)}getShapeRotationCenter(t,e){return t.rotationCenterX!==void 0&&t.rotationCenterY!==void 0?{x:t.rotationCenterX*this.annotationTool.canvasWidth,y:t.rotationCenterY*this.annotationTool.canvasHeight}:{x:e.x+e.width/2,y:e.y+e.height/2}}drawRotationHandles(t){var c;let e=this.getSelectedShape();if(!e)return;let n=this.annotationTool.ctx,a=this.getShapeRotationCenter(e,t),r=(c=e.rotation)!=null?c:0,h=a.x+Math.sin(r)*this.rotationHandleDistance,l=a.y-Math.cos(r)*this.rotationHandleDistance;n.save(),n.beginPath(),n.strokeStyle="#5b9fff",n.lineWidth=1,n.setLineDash([]),n.moveTo(a.x,a.y),n.lineTo(h,l),n.stroke();let s=6;n.beginPath(),n.strokeStyle="#5b9fff",n.lineWidth=1.5,n.moveTo(a.x-s,a.y),n.lineTo(a.x+s,a.y),n.moveTo(a.x,a.y-s),n.lineTo(a.x,a.y+s),n.stroke(),n.beginPath(),n.fillStyle="#ffffff",n.strokeStyle="#5b9fff",n.lineWidth=1.5,n.arc(a.x,a.y,4,0,Math.PI*2),n.fill(),n.stroke(),n.beginPath(),n.fillStyle="#ffffff",n.strokeStyle="#5b9fff",n.lineWidth=1.5,n.arc(h,l,6,0,Math.PI*2),n.fill(),n.stroke(),n.beginPath(),n.strokeStyle="#5b9fff",n.lineWidth=1,n.arc(h,l,3,-Math.PI*.7,Math.PI*.5),n.stroke(),n.restore()}isPointerAtRotationHandle(t,e){var m;let n=this.getSelectedShape();if(!n)return!1;let a=this.getShapeBounds(n);if(!a)return!1;let r=this.getShapeRotationCenter(n,a),h=(m=n.rotation)!=null?m:0,l=r.x+Math.sin(h)*this.rotationHandleDistance,s=r.y-Math.cos(h)*this.rotationHandleDistance,c=t-l,u=e-s;return Math.sqrt(c*c+u*u)<=12}isPointerAtRotationCenter(t,e){let n=this.getSelectedShape();if(!n)return!1;let a=this.getShapeBounds(n);if(!a)return!1;let r=this.getShapeRotationCenter(n,a),h=t-r.x,l=e-r.y;return Math.sqrt(h*h+l*l)<=10}calculateAngle(t,e,n,a){return Math.atan2(n-t,-(a-e))}getHandleAtPosition(t,e){let n=this.getSelectedShape();if(!n)return null;let a=this.getShapeBounds(n);if(!a)return null;let h=(this.handleSize+4)/2,l=[{pos:"nw",x:a.x,y:a.y},{pos:"n",x:a.x+a.width/2,y:a.y},{pos:"ne",x:a.x+a.width,y:a.y},{pos:"e",x:a.x+a.width,y:a.y+a.height/2},{pos:"se",x:a.x+a.width,y:a.y+a.height},{pos:"s",x:a.x+a.width/2,y:a.y+a.height},{pos:"sw",x:a.x,y:a.y+a.height},{pos:"w",x:a.x,y:a.y+a.height/2}];for(let s of l)if(t>=s.x-h&&t<=s.x+h&&e>=s.y-h&&e<=s.y+h)return s.pos;return null}getCursorForHandle(t){return{nw:"nw-resize",n:"n-resize",ne:"ne-resize",e:"e-resize",se:"se-resize",s:"s-resize",sw:"sw-resize",w:"w-resize"}[t]}resizeShape(t,e,n,a,r,h=!1){var x;if(!this.resizeOriginalShape)return;let l=this.annotationTool.deserialize([this.resizeOriginalShape])[0],s=r.x,c=r.y,u=r.width,p=r.height;switch(e){case"nw":s+=n,c+=a,u-=n,p-=a;break;case"n":c+=a,p-=a;break;case"ne":c+=a,u+=n,p-=a;break;case"e":u+=n;break;case"se":u+=n,p+=a;break;case"s":p+=a;break;case"sw":s+=n,u-=n,p+=a;break;case"w":s+=n,u-=n;break}if(h&&r.width>0&&r.height>0){let g=r.width/r.height;if(e==="n"||e==="s"){let v=p*g,b=v-u;u=v,s-=b/2}else if(e==="e"||e==="w"){let v=u/g,b=v-p;p=v,c-=b/2}else{let v=u/r.width,b=p/r.height,T=Math.max(Math.abs(v),Math.abs(b)),E=v>=0?1:-1,k=b>=0?1:-1,S=r.width*T*E,I=r.height*T*k;e==="nw"?(s=r.x+r.width-S,c=r.y+r.height-I):e==="ne"?c=r.y+r.height-I:e==="sw"&&(s=r.x+r.width-S),u=S,p=I}}let m=10;u<m&&(e.includes("w")&&(s=r.x+r.width-m),u=m),p<m&&(e.includes("n")&&(c=r.y+r.height-m),p=m);let f=r.width>0?u/r.width:1,y=r.height>0?p/r.height:1;switch(l.type){case"rectangle":{let g=t;g.x=s/this.annotationTool.canvasWidth,g.y=c/this.annotationTool.canvasHeight,g.width=u/this.annotationTool.canvasWidth,g.height=p/this.annotationTool.canvasHeight;break}case"selection":{let g=t;g.x=s/this.annotationTool.canvasWidth,g.y=c/this.annotationTool.canvasHeight,g.width=u/this.annotationTool.canvasWidth,g.height=p/this.annotationTool.canvasHeight;break}case"circle":{let g=t,v=Math.min(u,p)/2,b=s+u/2,T=c+p/2;g.x=b/this.annotationTool.canvasWidth,g.y=T/this.annotationTool.canvasHeight,g.radius=v/this.annotationTool.canvasWidth;break}case"line":{let g=t,v=l,b=(v.x1-r.x)*f+s,T=(v.y1-r.y)*y+c,E=(v.x2-r.x)*f+s,k=(v.y2-r.y)*y+c;g.x1=b/this.annotationTool.canvasWidth,g.y1=T/this.annotationTool.canvasHeight,g.x2=E/this.annotationTool.canvasWidth,g.y2=k/this.annotationTool.canvasHeight;break}case"arrow":{let g=t,v=l,b=(v.x1-r.x)*f+s,T=(v.y1-r.y)*y+c,E=(v.x2-r.x)*f+s,k=(v.y2-r.y)*y+c;g.x1=b/this.annotationTool.canvasWidth,g.y1=T/this.annotationTool.canvasHeight,g.x2=E/this.annotationTool.canvasWidth,g.y2=k/this.annotationTool.canvasHeight;break}case"curve":{let g=t,v=l;if(!v.points||v.points.length===0)break;g.points=v.points.map(b=>({x:((b.x-r.x)*f+s)/this.annotationTool.canvasWidth,y:((b.y-r.y)*y+c)/this.annotationTool.canvasHeight}));break}case"text":{let g=t,v=l,T=16+((x=this.resizeOriginalShape.lineWidth)!=null?x:1)*.5,E=(v.x-r.x)*f+s,k=(v.y-r.y)*y+c;g.x=E/this.annotationTool.canvasWidth,g.y=k/this.annotationTool.canvasHeight;let S=(f+y)/2,I=T*S;g.lineWidth=Math.max(1,(I-16)*2);break}case"image":{let g=t;g.x=s/this.annotationTool.canvasWidth,g.y=c/this.annotationTool.canvasHeight,g.width=u/this.annotationTool.canvasWidth,g.height=p/this.annotationTool.canvasHeight;break}}}deleteSelectedShape(){this.selectedShapeIndex<0||this.selectedShapeIndex>=this.annotationTool.shapes.length||(this.annotationTool.undoStack.push([...this.annotationTool.shapes]),this.annotationTool.shapes.splice(this.selectedShapeIndex,1),this.selectedShapeIndex=-1,this.shapeIndex=-1,this.annotationTool.redrawFullCanvas())}onPointerDown(t){var s;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);if(this.selectedShapeIndex>=0&&this.isPointerAtRotationHandle(e,n)){let c=this.getSelectedShape();if(c){let u=this.getShapeBounds(c);if(u){let p=this.getShapeRotationCenter(c,u);this.rotationActive=!0,this.rotationStartAngle=this.calculateAngle(p.x,p.y,e,n),this.rotationShapeStartAngle=(s=c.rotation)!=null?s:0,this.isDrawing=!0,this.annotationTool.undoStack.push([...this.annotationTool.shapes]),this.annotationTool.canvas.style.cursor="grabbing";return}}}if(this.selectedShapeIndex>=0&&this.isPointerAtRotationCenter(e,n)){this.centerDragActive=!0,this.startX=e,this.startY=n,this.isDrawing=!0,this.annotationTool.undoStack.push([...this.annotationTool.shapes]),this.annotationTool.canvas.style.cursor="move";return}let a=this.getHandleAtPosition(e,n);if(a&&this.selectedShapeIndex>=0){this.activeHandle=a,this.startX=e,this.startY=n,this.isDrawing=!0;let c=this.getSelectedShape();c&&(this.resizeStartBounds=this.getShapeBounds(c),this.resizeOriginalShape=this.cloneShape(c),this.annotationTool.undoStack.push([...this.annotationTool.shapes])),this.annotationTool.canvas.style.cursor=this.getCursorForHandle(a);return}let r=this.annotationTool.shapes,h=r.slice().reverse(),l=!1;for(let c of h)if(this.isPointerAtShape(c,e,n)){this.shape=this.cloneShape(c),this.shapeIndex=r.indexOf(c),this.selectedShapeIndex=this.shapeIndex,l=!0;break}l||(this.selectedShapeIndex=-1,this.annotationTool.redrawFullCanvas()),this.shape&&(this.lastDrawnShape=null,this.startX=e,this.startY=n,this.isDrawing=!0,this.isScale=this.shape.type==="image"?this.isPointerAtCorner(this.shape,e,n):!1,this.isScale?this.annotationTool.canvas.style.cursor="nw-resize":this.annotationTool.canvas.style.cursor="move")}isPointerAtShape(t,e,n){let a=this.annotationTool.deserialize([t])[0];if(a.rotation){let h=this.getShapeBounds(t);if(h){let l=this.getShapeRotationCenter(t,h),s=Math.cos(-a.rotation),c=Math.sin(-a.rotation),u=e-l.x,p=n-l.y;e=l.x+u*s-p*c,n=l.y+u*c+p*s}}return this.annotationTool.pluginForTool(a.type).isPointerAtShape(a,e,n)}isPointerAtCorner(t,e,n){if(!("type"in t))return!1;let a=this.annotationTool.deserialize([t])[0],r=15,h=Math.abs(a.y-n)<r,l=Math.abs(a.x-e)<r,s=Math.abs(a.x+a.width-e)<r,c=Math.abs(a.y+a.height-n)<r;return h&&l||h&&s||c&&l||c&&s}onPointerMove(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);if(this.isDrawing&&this.rotationActive){let s=this.annotationTool.shapes[this.selectedShapeIndex];if(s){let c=this.getShapeBounds(s);if(c){let u=this.getShapeRotationCenter(s,c),p=this.calculateAngle(u.x,u.y,e,n),m=this.rotationShapeStartAngle+(p-this.rotationStartAngle);if(t.shiftKey){let f=Math.PI/12;m=Math.round(m/f)*f}s.rotation=m,this.annotationTool.redrawFullCanvas()}}return}if(this.isDrawing&&this.centerDragActive){let s=this.annotationTool.shapes[this.selectedShapeIndex];s&&(s.rotationCenterX=e/this.annotationTool.canvasWidth,s.rotationCenterY=n/this.annotationTool.canvasHeight,this.annotationTool.redrawFullCanvas());return}if(this.isDrawing&&this.activeHandle&&this.resizeStartBounds){let s=e-this.startX,c=n-this.startY,u=this.annotationTool.shapes[this.selectedShapeIndex];u&&(this.resizeShape(u,this.activeHandle,s,c,this.resizeStartBounds,t.shiftKey),this.annotationTool.redrawFullCanvas());return}if(!this.isDrawing&&this.selectedShapeIndex>=0){if(this.isPointerAtRotationHandle(e,n)){this.annotationTool.canvas.style.cursor="grab";return}if(this.isPointerAtRotationCenter(e,n)){this.annotationTool.canvas.style.cursor="move";return}let s=this.getHandleAtPosition(e,n);if(s){this.annotationTool.canvas.style.cursor=this.getCursorForHandle(s);return}}if(!this.isDrawing||!this.shape){this.isDrawing||(this.annotationTool.canvas.style.cursor="default");return}let a=e-this.startX,r=n-this.startY;this.startX=e-a,this.startY=n-r;let h=this.annotationTool.deserialize([this.shape])[0],l=h.type==="image"?h:JSON.parse(JSON.stringify(h));if(l.type!=="audio-peaks")if(l.type==="image")if(this.isScale){let{width:s,height:c}=l,u=s/c,p=s+a,m=p/u;l.width=p,l.height=m,this.lastDrawnShape=l,this.annotationTool.pluginForTool(l.type).draw(l)}else{let s=this.annotationTool.pluginForTool(l.type).move(l,a,r);this.lastDrawnShape=s,this.annotationTool.pluginForTool(l.type).draw(s)}else{let s=this.annotationTool.pluginForTool(l.type).move(l,a,r);this.lastDrawnShape=s,this.annotationTool.pluginForTool(l.type).draw(s)}}onPointerUp(t){if(this.rotationActive){this.rotationActive=!1,this.isDrawing=!1,this.annotationTool.canvas.style.cursor="default",this.annotationTool.redrawFullCanvas();return}if(this.centerDragActive){this.centerDragActive=!1,this.isDrawing=!1,this.annotationTool.canvas.style.cursor="default",this.annotationTool.redrawFullCanvas();return}if(this.activeHandle){this.activeHandle=null,this.resizeStartBounds=null,this.resizeOriginalShape=null,this.isDrawing=!1,this.annotationTool.canvas.style.cursor="default",this.annotationTool.redrawFullCanvas();return}if(!this.isDrawing||!this.lastDrawnShape){this.isDrawing=!1,this.annotationTool.redrawFullCanvas();return}this.lastDrawnShape&&this.shape&&(this.lastDrawnShape.fillStyle=this.shape.fillStyle,this.lastDrawnShape.strokeStyle=this.shape.strokeStyle,this.lastDrawnShape.lineWidth=this.shape.lineWidth,this.shape.opacity!==void 0&&(this.lastDrawnShape.opacity=this.shape.opacity),this.save(this.lastDrawnShape)),this.isDrawing=!1,this.isScale=!1,this.shape=null,this.lastDrawnShape=null,this.annotationTool.canvas.style.cursor="default",this.annotationTool.redrawFullCanvas()}draw(){throw new Error("Method not implemented.")}reset(){this.isDrawing=!1,this.shape=null,this.isScale=!1,this.lastDrawnShape=null,this.shapeIndex=-1,this.selectedShapeIndex=-1,this.activeHandle=null,this.resizeStartBounds=null,this.resizeOriginalShape=null,this.rotationActive=!1,this.centerDragActive=!1,this.annotationTool.canvas.style.cursor="default"}save(t){this.annotationTool.replaceShape(t,this.shapeIndex)}};var ut=class extends C{constructor(){super(...arguments);this.name="image"}move(t,e,n){return t.x+=e,t.y+=n,t}onPointerDown(t){}onPointerMove(t){}onPointerUp(t){}normalize(t,e,n){return M(w({},t),{x:t.x/e,y:t.y/n,width:t.width/e,height:t.height/n})}draw(t){if(!(t.image instanceof HTMLImageElement)){console.error("Image is not an instance of HTMLImageElement");return}if(t.width===0||t.height===0)return;let e=t.x+t.width/2,n=t.y+t.height/2,a=this.getRotationCenter(t,e,n),r=this.applyRotation(t,a.x,a.y);this.ctx.drawImage(t.image,t.x,t.y,t.width,t.height),r&&this.restoreRotation()}isPointerAtShape(t,e,n){let a=Math.min(t.x,t.x+t.width),r=Math.max(t.x,t.x+t.width),h=Math.min(t.y,t.y+t.height),l=Math.max(t.y,t.y+t.height);return e>=a&&e<=r&&n>=h&&n<=l}};var pt=class extends C{constructor(){super(...arguments);this.name="compare";this.comparisonLine=0;this.leftOpacity=1;this.isDrawing=!1}get rightOpacity(){return this.annotationTool.overlayOpacity}move(t,e,n){return t.x+=e,t}onActivate(){this.comparisonLine=this.annotationTool.canvasWidth/2,this.leftOpacity=1,this.annotationTool.canvas.style.cursor="col-resize"}onDeactivate(){this.annotationTool.canvas.style.cursor="default",this.comparisonLine=0,this.leftOpacity=1,this.isDrawing=!1}normalize(t,e,n){return M(w({},t),{x:t.x/e})}onPointerDown(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.startX=e,this.startY=n,this.isDrawing=!0,this.disablePreviousCompare(),this.onPointerMove(t)}onPointerMove(t){if(!this.isDrawing){if(this.annotationTool.globalShapes.length>0){let a=this.annotationTool.globalShapes[0];if(a.type==="compare"){let r=this.annotationTool.deserialize([a])[0];this.draw(r),this.annotationTool.addFrameSquareOverlay()}}return}let{x:e}=this.annotationTool.getRelativeCoords(t);this.comparisonLine=e;let n={type:"compare",strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth,x:e};this.draw(n),this.drawDelimiter(n)}onPointerUp(){this.isDrawing&&(this.save({type:"compare",strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth,disabled:!1,x:this.comparisonLine}),this.isDrawing=!1)}removePreviousCompare(){this.annotationTool.globalShapes=this.annotationTool.globalShapes.filter(t=>t.type!=="compare")}disablePreviousCompare(){this.annotationTool.globalShapes=this.annotationTool.globalShapes.map(t=>t.type==="compare"?M(w({},t),{disabled:!0}):t)}save(t){this.removePreviousCompare();let e=this.annotationTool.serialize([t])[0];e.x<.05||e.x>.95||this.annotationTool.addGlobalShape(e)}drawDelimiter(t){this.ctx.beginPath(),this.ctx.moveTo(t.x,0),this.ctx.lineTo(t.x,this.annotationTool.canvasWidth),this.ctx.stroke()}drawShape(t){var Dt,Bt,Ot,zt,Vt,Wt,Xt,Yt;let e=this.annotationTool.videoElement,n=this.annotationTool.referenceVideoElement;if(!e||!n)return;let a=this.ctx.globalAlpha,r=this.annotationTool.canvasWidth,h=this.annotationTool.canvasHeight,l=t.x,s=n.videoHeight-e.videoHeight,c=n.videoWidth-e.videoWidth,u=this.annotationTool.isMobile;this.ctx.globalAlpha=this.leftOpacity;let p=(Bt=(Dt=this.annotationTool.referenceVideoFrameBuffer)==null?void 0:Dt.frameNumberFromTime(e.currentTime))!=null?Bt:1,m=p;if(c>e.videoWidth&&s>e.videoHeight&&!this.annotationTool.isMobile){let H=(Wt=(Vt=this.annotationTool.referenceVideoFrameBuffer)==null?void 0:Vt.getFrameNumberBySignature((zt=(Ot=this.annotationTool.videoFrameBuffer)==null?void 0:Ot.getAudioFingerprint(p))!=null?zt:null,p))!=null?Wt:p,G=Math.abs(p-H);G>=1&&G<=3&&(m=H)}let y=(Xt=this.annotationTool.referenceVideoFrameBuffer)==null?void 0:Xt.getFrame(m),x=(Yt=this.annotationTool.videoFrameBuffer)==null?void 0:Yt.getFrame(p);if(u){this.ctx.imageSmoothingQuality="low";let H=l/r,G=l;this.ctx.drawImage(x!=null?x:e,0,0,H*e.videoWidth,e.videoHeight,0,0,G,h)}else{let H=x?x.width:e.videoWidth,G=x?x.height:e.videoHeight;this.ctx.drawImage(x!=null?x:e,0,0,H,G,0,0,r,h)}this.ctx.globalAlpha=this.rightOpacity;let g=0,v=0,b=e.videoWidth/e.videoHeight,T=n.videoWidth/n.videoHeight,k=Math.abs(b-T)>.1,S=10,I=Math.abs(s)>S,A=e.videoWidth,L=e.videoHeight,R=0;if(c<-S)if(k){let H=e.videoWidth/r;R=Math.abs(c/2),R=R/H,R<=S&&(R=0)}else A=n.videoWidth;else c>S&&(A=n.videoWidth);if(s===0)g=0;else if(s>0)k?(g=s/2,g<=S&&(g=0)):L=I?n.videoHeight:e.videoHeight;else if(!k)L=I?n.videoHeight:e.videoHeight;else{v=Math.abs(s/2);let H=e.videoHeight/h;v=v/H,v<=S&&(v=0)}let Tt=l-R,$t=r-Tt,We=$t/r*A;y&&this.rightOpacity>0&&(u&&(this.ctx.imageSmoothingQuality="low"),this.ctx.drawImage(y,Tt/r*A,g,We,L,Tt+R,v,$t,h)),this.ctx.globalAlpha=a}draw(t){if(t.disabled)return;let e=this.annotationTool.videoElement,n=this.annotationTool.referenceVideoElement;!e||!n||this.drawShape(t)}};function un(o){let i=o[0],t=o[0];for(let e=1;e<o.length;e++)o[e]<i&&(i=o[e]),o[e]>t&&(t=o[e]);return[i,t]}var ft=class extends C{constructor(t){super(t);this.name="audio-peaks";this.canvas=document.createElement("canvas");this.props={peaks:new Int8Array,theme:{waveOutlineColor:"rgba(255,192,203,0.7)",waveFillColor:"grey",waveProgressColor:"orange"},waveHeight:40,bits:16};this.drawCtx=this.canvas.getContext("2d")}onVideoBlobSet(t){return P(this,null,function*(){let e=yield t.arrayBuffer();this.init(e)})}on(t,e){t==="videoBlobSet"&&this.onVideoBlobSet(e)}extractPeaks(t){return P(this,null,function*(){let{default:e}=yield Promise.resolve().then(()=>Je(Me(),1)),n=this.progressBarCoordinates.width,a=Math.ceil(t.length/n);return e(t,a,!0)})}setProps(t){let[e,n]=un(t.data[0]),a=Math.pow(2,t.bits-1)-1,r=-Math.pow(2,t.bits-1);this.props.peaks=t.data[0].map(h=>h<0?Math.round(h/e*r):Math.round(h/n*a)),this.props.bits=t.bits}init(t){return P(this,null,function*(){try{let n=yield new AudioContext().decodeAudioData(t),a=yield this.extractPeaks(n);this.initCanvas(),this.setProps(a),this.annotationTool.removeGlobalShape("audio-peaks"),this.annotationTool.addGlobalShape({x:0,y:0,strokeStyle:"red",fillStyle:"red",lineWidth:1,type:"audio-peaks"}),this.clearLocalCanvas(),this.drawOnCanvas()}catch(e){this.initCanvas(),this.props.peaks=new Int8Array,this.annotationTool.removeGlobalShape("audio-peaks"),this.clearLocalCanvas(),console.error(e)}})}initCanvas(){this.canvas.width=this.progressBarCoordinates.width*this.pixelRatio,this.canvas.height=this.props.waveHeight*this.pixelRatio,this.drawCtx.scale(this.pixelRatio,this.pixelRatio)}move(t,e,n){return t.x+=e,t.y+=n,t}normalize(t,e,n){return M(w({},t),{x:t.x/e,y:t.y/n})}onPointerDown(t){}onPointerMove(t){}onPointerUp(t){}reset(){this.clearLocalCanvas(),this.props.peaks=new Int8Array,this.annotationTool.removeGlobalShape("audio-peaks")}draw(t){let e=this.annotationTool.videoElement;if(!e||e.tagName!=="VIDEO"||e.muted||e.volume===0)return;this.ctx.clearRect(0,0,this.annotationTool.canvasWidth,this.annotationTool.canvasHeight);let{waveHeight:a,theme:r}=this.props,h=this.ctx,l=a/2,s=this.progressBarCoordinates.y-20,{x:c,width:u}=this.progressBarCoordinates,p=this.annotationTool.playbackFrame,m=this.annotationTool.totalFrames,f=Math.ceil(p/m*u)+c;this.ctx.drawImage(this.canvas,c,s,u,a),h.fillStyle=r.waveProgressColor,h.fillRect(f,s+0,1,l*2)}get pixelRatio(){return this.annotationTool.pixelRatio}get progressBarCoordinates(){return this.annotationTool.progressBarCoordinates}clearLocalCanvas(){this.drawCtx.clearRect(0,0,this.canvas.width,this.canvas.height)}drawOnCanvas(){let{peaks:t,bits:e,waveHeight:n,theme:a}=this.props,r=this.drawCtx,h=0,l=0,s=n/2,c=D(2,e-1),u=0,p=t.length;r.fillStyle=a.waveOutlineColor;for(let m=0;m<p;m+=1){let f=t[(m+h)*2+1]/c,y=Math.abs(f*s);r.fillRect(m+l,u+0+s-y,1,y)}}};var gt=class extends C{constructor(){super(...arguments);this.name="selection";this.selectedArea=null}move(t,e,n){return t.x+=e,t.y+=n,t}normalize(t,e,n){return M(w({},t),{x:t.x/e,y:t.y/n,width:t.width/e,height:t.height/n})}onPointerDown(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.startX=e,this.startY=n,this.isDrawing=!0,this.selectedArea=null}onPointerMove(t){if(!this.isDrawing)return;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.annotationTool.clearCanvas(),this.annotationTool.globalShapes.length>0?this.annotationTool.drawShapesOverlay():this.annotationTool.addVideoOverlay(),this.drawSelectionRect(this.startX,this.startY,e-this.startX,n-this.startY)}onPointerUp(t){if(!this.isDrawing)return;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t),a=Math.min(e,this.startX),r=Math.min(n,this.startY),h=Math.abs(e-this.startX),l=Math.abs(n-this.startY);if(h<1||l<1){this.isDrawing=!1,this.annotationTool.redrawFullCanvas();return}let s=document.createElement("canvas"),c=s.getContext("2d"),u=this.annotationTool.videoElement;if(!(u instanceof HTMLVideoElement))return;let p=u.videoWidth/u.videoHeight,m=this.annotationTool.canvasWidth/this.annotationTool.canvasHeight,f=this.annotationTool.canvasWidth,y=this.annotationTool.canvasHeight,x=0,g=0;p>m?(y=this.annotationTool.canvasWidth/p,g=(this.annotationTool.canvasHeight-y)/2):(f=this.annotationTool.canvasHeight*p,x=(this.annotationTool.canvasWidth-f)/2);let v=u.videoWidth/f,b=u.videoHeight/y,T=(a-x)*v,E=(r-g)*b,k=h*v,S=l*b;s.width=Math.max(1,k),s.height=Math.max(1,S);try{c.drawImage(this.annotationTool.videoElement,T,E,k,S,0,0,k,S);let I=c.getImageData(0,0,s.width,s.height);this.selectedArea=I;let A=document.createElement("canvas");A.width=k+4,A.height=S+4,A.style.width=`${h+4}px`,A.style.height=`${l+4}px`;let L=A.getContext("2d");L.strokeStyle="black",L.lineWidth=2,L.strokeRect(1,1,k+2,S+2),L.strokeStyle="black",L.lineWidth=2,L.strokeRect(2,2,k,S),L.putImageData(I,2,2);let R=new Image;R.onload=()=>{this.annotationTool.pluginForTool("image").save({type:"image",x:a-2,y:r-2,width:h+4,height:l+4,image:R,strokeStyle:"transparent",fillStyle:"transparent",lineWidth:0}),this.isDrawing=!1,this.selectedArea=null,this.annotationTool.redrawFullCanvas()},R.src=A.toDataURL(),this.annotationTool.currentTool="move"}catch(I){console.error("Error capturing selection:",I),this.isDrawing=!1,this.annotationTool.redrawFullCanvas();return}}drawSelectionRect(t,e,n,a){var m,f,y;let r=Math.min(t,t+n),h=Math.min(e,e+a),l=Math.abs(n),s=Math.abs(a),c=this.annotationTool.pixelRatio,u=null;if(l>0&&s>0)try{u=this.ctx.getImageData(r*c,h*c,l*c,s*c)}catch(x){u=null}if(this.ctx.fillStyle="rgba(0, 0, 0, 0.5)",this.ctx.fillRect(0,0,this.annotationTool.canvasWidth,this.annotationTool.canvasHeight),u&&l>0&&s>0)this.ctx.putImageData(u,r*c,h*c);else if(l>0&&s>0){let x=this.annotationTool.videoElement;if(x instanceof HTMLVideoElement){let g=(m=this.annotationTool.videoFrameBuffer)==null?void 0:m.frameNumberFromTime(x.currentTime),v=(y=(f=this.annotationTool.videoFrameBuffer)==null?void 0:f.getFrame(g||0))!=null?y:x,b=v?v.width:x.videoWidth,T=v?v.height:x.videoHeight,E=b/this.annotationTool.canvasWidth,k=T/this.annotationTool.canvasHeight;this.ctx.drawImage(v,r*E,h*k,l*E,s*k,r,h,l,s)}}this.ctx.beginPath();let p=this.ctx.strokeStyle;this.ctx.strokeStyle="#ffffff",this.ctx.lineWidth=2,this.ctx.setLineDash([5,5]),this.ctx.strokeRect(r,h,l,s),this.ctx.setLineDash([]),this.ctx.strokeStyle=p}draw(t){this.drawSelectionRect(t.x,t.y,t.width,t.height)}reset(){super.reset(),this.selectedArea=null}isPointerAtShape(t,e,n){let a=Math.min(t.x,t.x+t.width),r=Math.max(t.x,t.x+t.width),h=Math.min(t.y,t.y+t.height),l=Math.max(t.y,t.y+t.height);return e>=a&&e<=r&&n>=h&&n<=l}};var ke=[nt,it,st,lt,ht,ct,rt,dt,ut,pt,ft,gt];function Ee(o,i){let t,e,n,a=[],r=!0,h=!1;function l(u,p){if(h)return;let m=Math.abs(p.mediaTime-t),f=Math.abs(p.presentedFrames-e),y=m/f;y&&y<1&&r&&a.length<50&&o.playbackRate===1&&document.hasFocus()&&(a.push(y),n=Math.round(1/c()),i(n,a.length*2)),r=!0,t=p.mediaTime,e=p.presentedFrames,h||o.requestVideoFrameCallback(l)}o.requestVideoFrameCallback(l);let s=()=>{a.pop(),r=!1};o.addEventListener("seeked",s);function c(){return a.reduce((u,p)=>u+p)/a.length}return()=>{h=!0,o.removeEventListener("seeked",s)}}var yt=class yt extends Array{constructor(...i){super(...i),this.id=yt.nextId++}};yt.nextId=0;var kt=yt,Ie=new Map;function pn(o,i){return`${Math.min(o.id,i.id)}-${Math.max(o.id,i.id)}`}function Et(o,i){let t=pn(o,i),e=Ie.get(t);if(e!==void 0)return e;if(o.length===0||i.length===0)return 0;let n=Math.min(o.length,i.length),a=0,r=0;for(let p=0;p<n;p++)a+=o[p],r+=i[p];a/=n,r/=n;let h=0,l=0,s=0;for(let p=0;p<n;p++){let m=o[p]-a,f=i[p]-r;h+=m*f,l+=m*m,s+=f*f}let c=Math.sqrt(l*s),u=c===0?0:(h/c+1)/2;return Ie.set(t,u),u}var Pe=128,vt=class{constructor(i,t){this.video=i;this.fps=t;this.audioContext=null;this.audioBuffer=null;this.fingerprints=new Map;this.isInitialized=!1;this.initPromise=null}init(){return P(this,null,function*(){if(!this.isInitialized)return this.initPromise?this.initPromise:(this.initPromise=this.doInit(),this.initPromise)})}doInit(){return P(this,null,function*(){try{let e=yield(yield(yield fetch(this.video.currentSrc||this.video.src)).blob()).arrayBuffer();this.audioContext=new AudioContext,this.audioBuffer=yield this.audioContext.decodeAudioData(e),this.isInitialized=!0}catch(i){console.warn("Could not extract audio for fingerprinting:",i),this.isInitialized=!0,this.audioBuffer=null}})}hasAudio(){return this.audioBuffer!==null}get totalFrames(){return Math.round(this.video.duration*this.fps)}extractFingerprint(i){if(!this.audioBuffer)return null;let t=(i-1)/this.fps,e=1/this.fps,n=this.audioBuffer.sampleRate,a=Math.floor(t*n),h=Math.floor((t+e)*n)-a;if(h<=0||a>=this.audioBuffer.length)return null;let l=this.audioBuffer.getChannelData(0),s=new kt,c=Math.max(1,Math.floor(h/Pe));for(let u=0;u<Pe;u++){let p=a+u*c,m=Math.min(p+c,this.audioBuffer.length),f=0,y=0;for(let g=p;g<m;g++)g<l.length&&(f+=l[g]*l[g],y++);let x=y>0?Math.sqrt(f/y):0;s.push(x)}return s}getFingerprint(i){if(this.fingerprints.has(i))return this.fingerprints.get(i);let t=this.extractFingerprint(i);return t&&this.fingerprints.set(i,t),t}extractRange(i,t){for(let e=i;e<=t;e++)this.getFingerprint(e)}setFingerprint(i,t){this.fingerprints.set(i,t)}findBestMatch(i,t,e=3){if(!i||!(this.fingerprints.size>0)&&!this.hasAudio())return t;let a=0,r=t,h=Math.max(1,t-e),l=Math.min(this.totalFrames,t+e);for(let s=h;s<=l;s++){let c=this.getFingerprint(s);if(c){let u=Et(i,c);u>a&&(a=u,r=s)}}return r}destroy(){this.fingerprints.clear(),this.audioContext&&(this.audioContext.close().catch(()=>{}),this.audioContext=null),this.audioBuffer=null,this.isInitialized=!1,this.initPromise=null}};var Fe=64,V=class{constructor(i,t,e=!0){this.isDestroyed=!1;this.autoHide=!0;this.isMobile=!1;this.audioExtractor=null;this.audioInitPromise=null;this.seenFrames=0;this.isCanvasSizeSet=!1;this.frames=new Map;this.audioFingerprints=new Map;this.video=i,this.fps=t,this.autoHide=e,this.createCanvas(),this.createTransformCanvas()}createTransformCanvas(){this.transformCanvas=document.createElement("canvas"),this.transformCanvasCtx=this.canvas.getContext("2d",{willReadFrequently:!0,alpha:!1}),this.transformCanvas.width=Fe,this.transformCanvas.height=Fe}initAudioSync(){return P(this,null,function*(){var i;return this.audioExtractor?(i=this.audioInitPromise)!=null?i:Promise.resolve():(this.audioExtractor=new vt(this.video,this.fps),this.audioInitPromise=this.audioExtractor.init(),this.audioInitPromise)})}hasAudioSync(){var i,t;return(t=(i=this.audioExtractor)==null?void 0:i.hasAudio())!=null?t:!1}start(){this.addRequestFrameCallback(),this.isMobile||this.initAudioSync().catch(()=>{})}destroy(){this.isDestroyed=!0,this.frames.forEach(i=>i.close()),this.frames.clear(),this.audioFingerprints.clear(),this.audioExtractor&&(this.audioExtractor.destroy(),this.audioExtractor=null),this.audioInitPromise=null}tick(i,t){if(this.setCanvasSize(),t.expectedDisplayTime-performance.now()>10,this.isDestroyed)return!1;if(this.seenFrames>=this.totalFrames){if(this.autoHide)try{this.video.paused||this.video.pause(),this.video.style.display="none"}catch(h){}return!1}if(this.video.videoWidth===0||this.video.videoHeight===0)return!0;let n=this.video,a=this.frameNumberFromTime(t.mediaTime);if(!Math.max(1,t.presentedFrames>this.totalFrames?t.presentedFrames%this.totalFrames:t.presentedFrames))throw new Error("expectedFrame is 0");if(this.hasFrame(a))this.seenFrames++;else{this.ctx.drawImage(n,0,0,this.width,this.height,0,0,this.width,this.height);let h=this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height);createImageBitmap(h,0,0,this.width,this.height).then(l=>P(this,null,function*(){var s;if(this.setFrame(a,l),!this.isMobile&&((s=this.audioExtractor)!=null&&s.hasAudio())){let c=this.audioExtractor.getFingerprint(a);c&&this.setAudioFingerprint(a,c)}}))}return!0}addRequestFrameCallback(){this.isDestroyed||this.video.requestVideoFrameCallback((i,t)=>{this.tick(i,t)&&this.addRequestFrameCallback()})}createCanvas(){this.canvas=document.createElement("canvas"),this.ctx=this.canvas.getContext("2d",{willReadFrequently:!0,alpha:!1})}setCanvasSize(){this.isCanvasSizeSet||(this.canvas.width=this.video.videoWidth,this.canvas.height=this.video.videoHeight,this.isCanvasSizeSet=!0)}get width(){return this.video.videoWidth}get height(){return this.video.videoHeight}hasFrame(i){return this.frames.has(i)}getFrame(i){return this.frames.has(i)?this.frames.get(i):null}getFrameNumberBySignature(i,t){if(!i)return t;let e=0,n=t;return[t-3,t-2,t-1,t,t+1,t+2,t+3].filter(r=>r>0&&r<=this.totalFrames).forEach(r=>{let h=this.getAudioFingerprint(r);if(h){let l=Et(i,h);l>e&&(e=l,n=r)}}),n}setFrame(i,t){this.frames.set(i,t)}setAudioFingerprint(i,t){this.audioFingerprints.set(i,t)}getAudioFingerprint(i){var t;if(this.audioFingerprints.has(i))return this.audioFingerprints.get(i);if((t=this.audioExtractor)!=null&&t.hasAudio()){let e=this.audioExtractor.getFingerprint(i);if(e)return this.audioFingerprints.set(i,e),e}return null}get totalFrames(){return Math.round(this.video.duration*this.fps)}frameNumberFromTime(i){return Math.max(1,Math.round(i*this.fps))}};var W={layout:"horizontal",mobile:{collapsibleToolbars:!0,gesturesEnabled:!0,autoCollapse:!0,breakpoint:960},theme:"dark",toolbar:{draggable:!1,sidebarPosition:"left",defaultTool:"curve"},features:{showThemeToggle:!0,showFullscreen:!0,showProgressBar:!0,showFrameCounter:!0}};function Ae(o){var i,t;return o?{layout:(i=o.layout)!=null?i:W.layout,theme:(t=o.theme)!=null?t:W.theme,mobile:w(w({},W.mobile),o.mobile),toolbar:w(w({},W.toolbar),o.toolbar),features:w(w({},W.features),o.features)}:w({},W)}var J=class{constructor(i){this.tool=i;this.currentRenderer=null;this.rootElement=null;this.prefix=j()}getRootElement(){if(!this.rootElement){let i=this.tool.canvas;i!=null&&i.parentElement&&(this.rootElement=i.parentElement,this.rootElement.classList.add(`${this.prefix}-root`))}return this.rootElement}clearLayoutClasses(){let i=this.getRootElement();i&&i.classList.remove(`${this.prefix}-layout-horizontal`,`${this.prefix}-layout-vertical`,`${this.prefix}-layout-minimal`,`${this.prefix}-layout-bottom-dock`,`${this.prefix}-sidebar-right`)}setLayout(i,t){this.currentRenderer&&this.currentRenderer.cleanup(),this.clearLayoutClasses();let e=this.getRootElement();e&&(e.classList.add(`${this.prefix}-layout-${i}`),i==="vertical"&&(t==null?void 0:t.sidebarPosition)==="right"&&e.classList.add(`${this.prefix}-sidebar-right`)),this.currentRenderer=this.createRenderer(i),this.currentRenderer.apply(this.tool)}getCurrentLayout(){var i,t;return(t=(i=this.currentRenderer)==null?void 0:i.name)!=null?t:null}createRenderer(i){switch(i){case"horizontal":return new It;case"vertical":return new Pt;case"minimal":return new Ft;case"bottom-dock":return new At}}destroy(){this.currentRenderer&&(this.currentRenderer.cleanup(),this.currentRenderer=null),this.clearLayoutClasses(),this.rootElement=null}},It=class{constructor(){this.name="horizontal"}apply(i){}cleanup(){}},Pt=class{constructor(){this.name="vertical"}apply(i){}cleanup(){}},Ft=class{constructor(){this.name="minimal";this.dragState={isDragging:!1,startX:0,startY:0,offsetX:0,offsetY:0};this.container=null;this.boundHandlers={};this.prefix=j()}apply(i){var e;if(this.container=i.uiContainer,!this.container)return;this.boundHandlers.mousedown=this.handleMouseDown.bind(this),this.boundHandlers.mousemove=this.handleMouseMove.bind(this),this.boundHandlers.mouseup=this.handleMouseUp.bind(this),this.container.addEventListener("mousedown",this.boundHandlers.mousedown),document.addEventListener("mousemove",this.boundHandlers.mousemove),document.addEventListener("mouseup",this.boundHandlers.mouseup);let t=i.config;(e=t==null?void 0:t.toolbar)!=null&&e.position&&(this.container.style.left=`${t.toolbar.position.x}px`,this.container.style.top=`${t.toolbar.position.y}px`)}cleanup(){this.container&&this.boundHandlers.mousedown&&this.container.removeEventListener("mousedown",this.boundHandlers.mousedown),this.boundHandlers.mousemove&&document.removeEventListener("mousemove",this.boundHandlers.mousemove),this.boundHandlers.mouseup&&document.removeEventListener("mouseup",this.boundHandlers.mouseup),this.container&&(this.container.style.left="",this.container.style.top=""),this.container=null,this.boundHandlers={}}handleMouseDown(i){if(!this.container||i.target.closest("button, input"))return;this.dragState.isDragging=!0,this.dragState.startX=i.clientX,this.dragState.startY=i.clientY;let t=this.container.getBoundingClientRect();this.dragState.offsetX=t.left,this.dragState.offsetY=t.top,this.container.classList.add(`${this.prefix}-dragging`),i.preventDefault()}handleMouseMove(i){if(!this.dragState.isDragging||!this.container)return;let t=i.clientX-this.dragState.startX,e=i.clientY-this.dragState.startY;this.container.style.left=`${this.dragState.offsetX+t}px`,this.container.style.top=`${this.dragState.offsetY+e}px`}handleMouseUp(){this.container&&(this.dragState.isDragging=!1,this.container.classList.remove(`${this.prefix}-dragging`))}},At=class{constructor(){this.name="bottom-dock";this.movedElements=[];this.playerControls=null;this.divider=null;this.prefix=j()}apply(i){let t=i.uiContainer,e=i.playerControlsContainer;if(t&&e)for(this.playerControls=e,this.divider=document.createElement("div"),this.divider.classList.add(`${this.prefix}-divider`),t.appendChild(this.divider);e.firstChild;){let n=e.firstChild;this.movedElements.push(n),t.appendChild(n)}}cleanup(){if(this.playerControls)for(let i of this.movedElements)this.playerControls.appendChild(i);this.divider&&this.divider.parentNode&&this.divider.parentNode.removeChild(this.divider),this.movedElements=[],this.playerControls=null,this.divider=null}};var xt=class{constructor(i,t=!0){this.container=i;this.autoCollapse=t;this.isCollapsed=!1;this.collapseButton=null;this.prefix=j()}init(){this.container.classList.add(`${this.prefix}-collapsible`),this.createCollapseButton()}createCollapseButton(){var i;this.collapseButton=document.createElement("button"),this.collapseButton.type="button",this.collapseButton.classList.add(`${this.prefix}-collapse-btn`),this.collapseButton.setAttribute("aria-label","Toggle toolbar"),this.collapseButton.setAttribute("data-tooltip","Toggle toolbar"),this.updateButtonIcon(),this.collapseButton.addEventListener("click",t=>{t.stopPropagation(),this.toggle()}),(i=this.container.parentElement)==null||i.insertBefore(this.collapseButton,this.container.nextSibling)}updateButtonIcon(){this.collapseButton&&(this.collapseButton.innerHTML=`
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="18 15 12 9 6 15"/>
      </svg>
    `)}collapse(){this.isCollapsed||(this.isCollapsed=!0,this.container.classList.add(`${this.prefix}-collapsed`))}expand(){this.isCollapsed&&(this.isCollapsed=!1,this.container.classList.remove(`${this.prefix}-collapsed`))}toggle(){this.isCollapsed?this.expand():this.collapse()}get collapsed(){return this.isCollapsed}get autoCollapseEnabled(){return this.autoCollapse}setAutoCollapse(i){this.autoCollapse=i}destroy(){this.collapseButton&&(this.collapseButton.remove(),this.collapseButton=null),this.container.classList.remove(`${this.prefix}-collapsible`,`${this.prefix}-collapsed`)}};var Z=class{constructor(i,t){this.canvas=i;this.onGestureChange=t;this.initialDistance=0;this.initialScale=1;this.currentScale=1;this.panStart={x:0,y:0};this.panOffset={x:0,y:0};this.isGesturing=!1;this.activeTouches=0;this.minScale=.5;this.maxScale=3;this.handleTouchStart=i=>{this.activeTouches=i.touches.length,i.touches.length===2&&(i.preventDefault(),this.isGesturing=!0,this.initialDistance=this.getDistance(i.touches[0],i.touches[1]),this.initialScale=this.currentScale,this.panStart=this.getMidpoint(i.touches[0],i.touches[1]))};this.handleTouchMove=i=>{if(i.touches.length===2&&this.isGesturing){i.preventDefault();let e=this.getDistance(i.touches[0],i.touches[1])/this.initialDistance;this.currentScale=Math.max(this.minScale,Math.min(this.maxScale,this.initialScale*e));let n=this.getMidpoint(i.touches[0],i.touches[1]);this.panOffset={x:this.panOffset.x+(n.x-this.panStart.x),y:this.panOffset.y+(n.y-this.panStart.y)},this.panStart=n,this.onGestureChange(this.getState())}};this.handleTouchEnd=i=>{this.activeTouches=i.touches.length,i.touches.length<2&&(this.isGesturing=!1,i.touches.length===1&&(this.panStart={x:i.touches[0].clientX,y:i.touches[0].clientY}))}}init(){this.canvas.addEventListener("touchstart",this.handleTouchStart,{passive:!1}),this.canvas.addEventListener("touchmove",this.handleTouchMove,{passive:!1}),this.canvas.addEventListener("touchend",this.handleTouchEnd,{passive:!1}),this.canvas.addEventListener("touchcancel",this.handleTouchEnd,{passive:!1})}getDistance(i,t){let e=t.clientX-i.clientX,n=t.clientY-i.clientY;return Math.sqrt(e*e+n*n)}getMidpoint(i,t){return{x:(i.clientX+t.clientX)/2,y:(i.clientY+t.clientY)/2}}getState(){return{scale:this.currentScale,panX:this.panOffset.x,panY:this.panOffset.y}}isActive(){return this.isGesturing}hasTwoFingers(){return this.activeTouches>=2}reset(){this.currentScale=1,this.panOffset={x:0,y:0},this.initialScale=1,this.initialDistance=0,this.isGesturing=!1,this.onGestureChange(this.getState())}setScale(i){this.currentScale=Math.max(this.minScale,Math.min(this.maxScale,i)),this.onGestureChange(this.getState())}setPan(i,t){this.panOffset={x:i,y:t},this.onGestureChange(this.getState())}destroy(){this.canvas.removeEventListener("touchstart",this.handleTouchStart),this.canvas.removeEventListener("touchmove",this.handleTouchMove),this.canvas.removeEventListener("touchend",this.handleTouchEnd),this.canvas.removeEventListener("touchcancel",this.handleTouchEnd)}};var mn=window.devicePixelRatio||1,Le=25,B=class extends et{constructor(t,e){super();this.referenceVideoFrameBuffer=null;this.videoFrameBuffer=null;this.isMouseDown=!1;this.buttons=[];this.plugins=[];this.annotatedFrameCoordinates=[];this.videoBlobUrl=null;this.referenceVideoBlobUrl=null;this.frameCounterTimeoutId=null;this._enforcedTotalFrames=null;this.isCursorOverCanvas=!1;this.overlayOpacity=.7;this._theme="dark";this.themeChangeListeners=[];this.layoutManager=null;this.collapseController=null;this.gestureHandler=null;this.gestureState={scale:1,panX:0,panY:0};this.fps=Le;this.plannedFn=null;this.ct=0;this.isCanvasInitialized=!1;this.enforcedCanvasSize=null;this.lastNavigatedFrame=0;this.isProgressBarNavigation=!1;this.isAnnotationsAsVideoActive=!1;this.config=Ae(e),this._theme=this.config.theme,this.plugins=ke.map(n=>new n(this)),this.init(t)}prevFrame(){let e=this.playbackFrame-1;e<1?this.playbackFrame=this.totalFrames:this.playbackFrame=e}nextFrame(){let e=this.playbackFrame+1;e>this.totalFrames?this.playbackFrame=1:this.playbackFrame=e}getAnnotatedFrames(){let t=[];return this.timeStack.forEach((e,n)=>{e&&e.length>0&&t.push(n)}),t.sort((e,n)=>e-n)}prevAnnotatedFrame(){let t=this.getAnnotatedFrames();if(t.length===0)return;let e=this.playbackFrame;for(let n=t.length-1;n>=0;n--)if(t[n]<e){this.playbackFrame=t[n];return}this.playbackFrame=t[t.length-1]}nextAnnotatedFrame(){let t=this.getAnnotatedFrames();if(t.length===0)return;let e=this.playbackFrame;for(let n of t)if(n>e){this.playbackFrame=n;return}this.playbackFrame=t[0]}get theme(){return this._theme}setTheme(t){this._theme=t,Ct(t),this.themeChangeListeners.forEach(e=>e(t))}onThemeChange(t){return this.themeChangeListeners.push(t),()=>{let e=this.themeChangeListeners.indexOf(t);e!==-1&&this.themeChangeListeners.splice(e,1)}}setLayout(t){this.layoutManager||(this.layoutManager=new J(this)),this.layoutManager.setLayout(t,{sidebarPosition:this.config.toolbar.sidebarPosition})}getLayout(){var t,e;return(e=(t=this.layoutManager)==null?void 0:t.getCurrentLayout())!=null?e:this.config.layout}collapseToolbar(){var t;(t=this.collapseController)==null||t.collapse()}expandToolbar(){var t;(t=this.collapseController)==null||t.expand()}toggleToolbar(){var t;(t=this.collapseController)==null||t.toggle()}isToolbarCollapsed(){var t,e;return(e=(t=this.collapseController)==null?void 0:t.collapsed)!=null?e:!1}setGesturesEnabled(t){t&&!this.gestureHandler?(this.gestureHandler=new Z(this.canvas,e=>{this.applyGestureTransform(e)}),this.gestureHandler.init()):!t&&this.gestureHandler&&(this.gestureHandler.destroy(),this.gestureHandler=null,this.resetZoom())}isGesturesEnabled(){return this.gestureHandler!==null}resetZoom(){var t;this.gestureState={scale:1,panX:0,panY:0},(t=this.gestureHandler)==null||t.reset(),this.redrawFullCanvas()}getZoomScale(){return this.gestureState.scale}applyGestureTransform(t){this.gestureState=t,this.redrawFullCanvas()}removeGlobalShape(t){this.globalShapes=this.globalShapes.filter(e=>e.type!==t)}addGlobalShape(t){this.globalShapes.push(t)}get selectedColor(){return this.colorPicker.value}get selectedStrokeSize(){return this.strokeSizePicker.valueAsNumber}get currentTool(){return this._currentTool}set currentTool(t){let e=this._currentTool;e&&(this.getButtonForTool(e).classList.remove("active"),this.pluginForTool(e).onDeactivate()),this._currentTool=t,this.canvas.style.cursor=t?"pointer":"default",t&&(this.getButtonForTool(t).classList.add("active"),this.pluginForTool(t).onActivate())}enableFrameRateDetection(){if(this.destructors.find(n=>n.name==="frameRateDetector"))return;let t=this.videoElement;if(t.tagName==="IMG")return;let e=Ee(t,n=>{this.fps=n});Object.defineProperty(e,"name",{value:"frameRateDetector"}),this.destructors.push(e)}timeToFrame(t){return Math.max(1,Math.round(t*this.fps))}get playbackFrame(){return this.videoElement instanceof HTMLImageElement?1:this.timeToFrame(this.videoElement.currentTime)}set playbackFrame(t){if(this.videoElement instanceof HTMLImageElement)return;let e=t/this.fps;this.videoElement.currentTime=e,this.rvf(()=>{this.show()})}rvf(t){this.plannedFn=t}get canvasWidth(){var t,e;return(e=(t=this.enforcedCanvasSize)==null?void 0:t.width)!=null?e:0}get canvasHeight(){var t,e;return(e=(t=this.enforcedCanvasSize)==null?void 0:t.height)!=null?e:0}get aspectRatio(){return this.canvasHeight===0?0:this.canvasWidth/this.canvasHeight}get isMobile(){var e,n,a;let t=(a=(n=(e=this.config)==null?void 0:e.mobile)==null?void 0:n.breakpoint)!=null?a:960;return window.innerWidth<t}get progressBarCoordinates(){let t=this.isMobile?30:10,e=5,a=this.canvasWidth-e-55,r=e,h=this.canvasHeight-t;return{x:r,y:h,width:a,height:t}}get shapes(){return this.timeStack.has(this.activeTimeFrame)||this.timeStack.set(this.activeTimeFrame,[]),this.timeStack.get(this.activeTimeFrame)}set shapes(t){this.timeStack.set(this.activeTimeFrame,t)}get undoStack(){return this.undoTimeStack.has(this.activeTimeFrame)||this.undoTimeStack.set(this.activeTimeFrame,[]),this.undoTimeStack.get(this.activeTimeFrame)}set undoStack(t){this.undoTimeStack.set(this.activeTimeFrame,t)}get pixelRatio(){return mn}setVideoBlob(n){return P(this,arguments,function*(t,e=this.fps){this.videoBlobUrl&&URL.revokeObjectURL(this.videoBlobUrl);let a=URL.createObjectURL(t);this.videoBlobUrl=a,yield this.setVideoUrl(a,e),this.plugins.forEach(r=>{r.on("videoBlobSet",t)})})}setVideoUrl(n){return P(this,arguments,function*(t,e=this.fps){if(this.videoElement instanceof HTMLImageElement)return;let a=this.videoElement;a.src=t.toString(),yield this.videoElement.load(),this.setFrameRate(e),this.videoFrameBuffer&&(this.videoFrameBuffer.destroy(),this.videoFrameBuffer=new V(a,e,!1),this.videoFrameBuffer.isMobile=this.isMobile),this.setCanvasSize()})}enableVideoFrameBuffer(){this.videoElement instanceof HTMLImageElement||(this.videoFrameBuffer=new V(this.videoElement,this.fps,!1),this.videoFrameBuffer.isMobile=this.isMobile)}hide(){this.stopAnnotationsAsVideo(),this.hideControls(),this.hideCanvas()}showControls(){this.uiContainer.style.display=""}hideControls(){this.uiContainer.style.display="none"}showCanvas(){this.canvas.style.display="block"}hideCanvas(){this.canvas.style.display="none"}updateActiveTimeFrame(t=void 0){this.activeTimeFrame=t?this.timeToFrame(t):this.playbackFrame}show(){this.stopAnnotationsAsVideo(),this.updateActiveTimeFrame(),this.showCanvas(),this.showControls(),this.redrawFullCanvas()}setCanvasSettings(){this.ctx.strokeStyle=this.selectedColor,this.ctx.fillStyle=this.selectedColor,this.ctx.lineWidth=this.selectedStrokeSize}pluginForTool(t){if(this.isDestroyed)throw new Error("AnnotationTool is destroyed");let e=this.plugins.find(n=>n.name===t);if(!e)throw new Error(`No plugin found for tool ${t}`);return e}getButtonForTool(t){return this.buttons.find(e=>e.dataset.tool===t)}bindContext(){this.handleMouseDown=this.handleMouseDown.bind(this),this.handleMouseMove=this.handleMouseMove.bind(this),this.handleMouseUp=this.handleMouseUp.bind(this),this.setCanvasSize=this.setCanvasSize.bind(this),this.onKeyDown=this.onKeyDown.bind(this)}initProperties(){var t;this.isDestroyed=!1,this.isProgressBarNavigation=!1,this.shapes=[],this.globalShapes=[],this.currentTool=this.isMobile?null:(t=this.config.toolbar.defaultTool)!=null?t:null,Ct(this._theme),this.layoutManager=new J(this),this.layoutManager.setLayout(this.config.layout,{sidebarPosition:this.config.toolbar.sidebarPosition}),this.isMobile&&this.config.mobile.collapsibleToolbars&&(this.collapseController=new xt(this.uiContainer,this.config.mobile.autoCollapse),this.collapseController.init()),this.isMobile&&this.config.mobile.gesturesEnabled&&(this.gestureHandler=new Z(this.canvas,e=>{this.applyGestureTransform(e)}),this.gestureHandler.init())}setVideoStyles(){this.videoElement.style.objectFit="cover",this.videoElement.style.objectPosition="left top"}get frameCallbackSupported(){return"requestVideoFrameCallback"in HTMLVideoElement.prototype}initFrameCounter(){if(!this.frameCallbackSupported){this.frameCounterTimeoutId=setTimeout(()=>{var t;this.isDestroyed||((t=this.plannedFn)==null||t.call(this),this.plannedFn=null,this.initFrameCounter(),this.updateActiveTimeFrame(),this.playAnnotationsAsVideo())},1e3/this.fps);return}this.withVideo(t=>{t.requestVideoFrameCallback((e,n)=>{var a,r;this.isCanvasInitialized||this._setCanvasSize(),(a=this.videoFrameBuffer)==null||a.tick(e,n),(r=this.plannedFn)==null||r.call(this),this.plannedFn=null,this.raf(()=>{this.initFrameCounter(),this.updateActiveTimeFrame(n.mediaTime),this.playAnnotationsAsVideo()})})})}init(t){this.videoElement=t,this.setVideoStyles(),this.initFrameCounter(),this.bindContext(),this.initCanvas(),this.initUI(),this.initProperties(),this.setCanvasSize()}onKeyDown(t){(t.ctrlKey||t.metaKey)&&t.key.toLowerCase()==="z"&&this.handleUndo()}handleUndo(){this.undoStack.length>0&&(this.shapes=this.undoStack.pop(),this.redrawFullCanvas())}destroy(){var a,r,h,l,s,c,u,p,m,f,y;if(this.isDestroyed)return;super.destroy(),this.stopAnnotationsAsVideo(),this.frameCounterTimeoutId&&(clearTimeout(this.frameCounterTimeoutId),this.frameCounterTimeoutId=null),this.videoBlobUrl&&(URL.revokeObjectURL(this.videoBlobUrl),this.videoBlobUrl=null),this.referenceVideoBlobUrl&&(URL.revokeObjectURL(this.referenceVideoBlobUrl),this.referenceVideoBlobUrl=null),this.currentTool=null,this.plugins.forEach(x=>x.reset()),this.annotatedFrameCoordinates=[],this.setFrameRate(Le);let t=this.strokeSizePicker.parentElement;if((a=t==null?void 0:t.parentNode)==null||a.removeChild(t),this.referenceVideoElement){let x=this.referenceVideoElement.parentElement;(r=x==null?void 0:x.parentNode)==null||r.removeChild(x),this.referenceVideoElement=null}let e=this.colorPicker.parentElement;(h=e==null?void 0:e.parentNode)==null||h.removeChild(e),this.buttons.forEach(x=>{var g;(g=x.parentNode)==null||g.removeChild(x)}),this.buttons=[],(l=this.uiContainer.parentNode)==null||l.removeChild(this.uiContainer),(s=this.canvas.parentNode)==null||s.removeChild(this.canvas),(c=this.playerControlsContainer.parentElement)==null||c.removeChild(this.playerControlsContainer),["strokeSizePicker","colorPicker","uiContainer","playerControlsContainer","canvas","ctx","videoElement"].forEach(x=>{delete this[x]}),this.activeTimeFrame=0,this.isDestroyed=!0,(u=this.referenceVideoFrameBuffer)==null||u.destroy(),this.referenceVideoFrameBuffer=null,(p=this.videoFrameBuffer)==null||p.destroy(),this.videoFrameBuffer=null,(m=this.layoutManager)==null||m.destroy(),this.layoutManager=null,(f=this.collapseController)==null||f.destroy(),this.collapseController=null,(y=this.gestureHandler)==null||y.destroy(),this.gestureHandler=null,this.gestureState={scale:1,panX:0,panY:0}}_setCanvasSize(){let t=getComputedStyle(this.videoElement),e=parseInt(t.width,10),n=this.videoElement,a=n.videoWidth/n.videoHeight;if(isNaN(e)||!n.videoWidth||!n.videoHeight)return this.isCanvasInitialized=!1,this.setCanvasSettings(),!1;let r=n.parentElement,h=!!document.fullscreenElement,l=Math.min(e,n.videoWidth),s=Math.floor(l/a);if(h&&r){let f=window.innerWidth,y=window.innerHeight-90;f/y>a?(s=y,l=s*a):(l=f,s=l/a),n.style.width=`${l}px`,n.style.height=`${s}px`,n.style.marginTop="40px",n.style.marginBottom="50px"}else n.style.width=`${l}px`,n.style.height=`${s}px`,n.style.marginTop="",n.style.marginBottom="";this.isCanvasInitialized=n.videoWidth>0&&n.videoHeight>0,this.canvas.width=l*this.pixelRatio,this.canvas.height=s*this.pixelRatio,this.canvas.style.width=`${l}px`,this.canvas.style.height=`${s}px`,this.canvas.style.position="absolute";let c=n.offsetTop,u=n.offsetLeft;return this.canvas.style.top=`${c}px`,this.canvas.style.left=`${u}px`,this.enforcedCanvasSize={width:l,height:s},this.ctx.scale(this.pixelRatio,this.pixelRatio),this.setCanvasSettings(),!0}setCanvasSize(){this._setCanvasSize()&&(this.syncVideoSizes(),this.redrawFullCanvas())}replaceShape(t,e){let n=this.serialize([t])[0];this.undoStack.push([...this.shapes]),this.shapes[e]=n}addShape(t){let e=this.serialize([t])[0];this.undoStack.push([...this.shapes]),this.shapes.push(e)}get msPerFrame(){return 1e3/this.fps}syncVideoSizes(){this.withRefVideo(t=>{let n=this.videoElement.getBoundingClientRect();t.style.position="fixed",t.style.top=`${n.top}px`,t.style.left=`${n.left}px`})}addReferenceVideoByURL(a){return P(this,arguments,function*(t,e=this.fps,n="video/mp4"){var s;let r=yield fetch(t).then(c=>c.blob()),h=new Blob([r],{type:n});this.referenceVideoBlobUrl&&URL.revokeObjectURL(this.referenceVideoBlobUrl);let l=window.URL.createObjectURL(h);this.referenceVideoBlobUrl=l,this.referenceVideoElement?((s=this.referenceVideoFrameBuffer)==null||s.destroy(),this.referenceVideoFrameBuffer=new V(this.referenceVideoElement,e),this.referenceVideoFrameBuffer.isMobile=this.isMobile,this.referenceVideoFrameBuffer.start()):(this.referenceVideoElement=document.createElement("video"),this.withRefVideo(c=>{this.isMobile?(c.style.zIndex="2",c.style.display="block",c.style.top="0",c.style.left="0",c.style.opacity="0.25",c.style.width="20px",c.style.height="15px"):(c.style.zIndex="-1",c.style.display="none",c.style.width="100px",c.style.height="70px"),c.style.objectFit="cover",c.style.objectPosition="left top",c.muted=!0,c.volume=0,c.playsInline=!0,c.autoplay=!1,c.controls=!1,c.loop=!0,this.videoElement.after(c),this.referenceVideoFrameBuffer=new V(c,e),this.referenceVideoFrameBuffer.isMobile=this.isMobile,this.referenceVideoFrameBuffer.start()}),this.syncVideoSizes()),this.referenceVideoElement.src=l,this.referenceVideoElement.play().then(()=>{this.showButton("compare")}).catch(()=>{this.hideButton("compare")})})}hideButton(t){let e=this.getButtonForTool(t);e.style.display="none"}showButton(t){let e=this.getButtonForTool(t);e.style.display=""}addSingletonShape(t){let e=this.serialize([t])[0],n=this.shapes.filter(a=>a.type!==t.type);this.replaceFrame(this.playbackFrame,[...n,e])}serialize(t=this.shapes){let e=this.canvasWidth,n=this.canvasHeight;return t.map(a=>this.pluginForTool(a.type).normalize(a,e,n))}deserialize(t){let e=1/this.canvasWidth,n=1/this.canvasHeight;return t.map(a=>this.pluginForTool(a.type).normalize(a,e,n))}getRelativeCoords(t){let e=this.canvas.getBoundingClientRect();return{x:this.getEventX(t)-e.left,y:this.getEventY(t)-e.top}}handleMouseDown(t){var n,a;if(t.preventDefault(),this.isMouseDown=!0,tt(t)||(n=this.gestureHandler)!=null&&n.hasTwoFingers())return;let e=this.frameFromProgressBar(t,!0);if(e){this.isProgressBarNavigation=!0;let r=this.getAnnotationFrame(t);this.isVideoPaused&&(r!==null?this.playbackFrame=r:this.playbackFrame=e);return}this.currentTool&&((a=this.collapseController)!=null&&a.autoCollapseEnabled)&&this.collapseController.collapse(),this.currentTool&&this.pluginForTool(this.currentTool).onPointerDown(t)}get isDrawing(){return this.currentTool?this.pluginForTool(this.currentTool).isDrawing:!1}get isVideoPaused(){return this.videoElement.tagName==="VIDEO"?this.videoElement.paused:!0}get hasGlobalOverlays(){return this.globalShapes.length>0}handleMouseMove(t){if(t.preventDefault(),!tt(t)){if(this.isMouseDown){let e=this.isProgressBarNavigation?this.frameFromProgressBar(t,!1):null;if(e!==null&&!this.isDrawing){if(e===this.lastNavigatedFrame)return;this.lastNavigatedFrame=e,this.activeTimeFrame=e,this.isVideoPaused&&(this.playbackFrame=e),this.clearCanvas(),this.hasGlobalOverlays||this.addVideoOverlay(),this.drawShapesOverlay(),this.addProgressBarOverlay();return}else this.hideControls(),this.clearCanvas(),this.hasGlobalOverlays||this.addVideoOverlay(),this.drawShapesOverlay()}else this.redrawFullCanvas();this.currentTool&&this.pluginForTool(this.currentTool).onPointerMove(t)}}getEventX(t){return t.clientX}getEventY(t){return t.clientY}handleMouseUp(t){var e;this.isMouseDown=!1,this.isProgressBarNavigation=!1,this.showControls(),!tt(t)&&(this.currentTool&&this.pluginForTool(this.currentTool).onPointerUp(t),(e=this.collapseController)!=null&&e.autoCollapseEnabled&&this.collapseController.expand(),this.redrawFullCanvas())}focusOnMediaNode(){this.videoElement.focus()}drawShapesOverlay(){var n,a;let t={strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth,globalAlpha:this.ctx.globalAlpha},e=this.gestureState.scale!==1||this.gestureState.panX!==0||this.gestureState.panY!==0;if(e){this.ctx.save(),this.ctx.translate(this.gestureState.panX,this.gestureState.panY);let r=this.canvasWidth/2,h=this.canvasHeight/2;this.ctx.translate(r,h),this.ctx.scale(this.gestureState.scale,this.gestureState.scale),this.ctx.translate(-r,-h)}for(let r of this.deserialize(this.globalShapes)){this.ctx.strokeStyle=r.strokeStyle,this.ctx.fillStyle=r.fillStyle,this.ctx.lineWidth=r.lineWidth,this.ctx.globalAlpha=(n=r.opacity)!=null?n:1;try{this.pluginForTool(r.type).draw(r)}catch(h){console.error(h)}}for(let r of this.deserialize(this.shapes)){this.ctx.strokeStyle=r.strokeStyle,this.ctx.fillStyle=r.fillStyle,this.ctx.lineWidth=r.lineWidth,this.ctx.globalAlpha=(a=r.opacity)!=null?a:1;try{this.pluginForTool(r.type).draw(r)}catch(h){console.error(h)}}e&&this.ctx.restore(),this.ctx.strokeStyle=t.strokeStyle,this.ctx.fillStyle=t.fillStyle,this.ctx.lineWidth=t.lineWidth,this.ctx.globalAlpha=t.globalAlpha}clearCanvas(){this.ctx.clearRect(0,0,this.canvasWidth,this.canvasHeight)}frameToDataUrl(){try{this.clearCanvas(),this.addVideoOverlay(),this.addFrameSquareOverlay(),this.drawShapesOverlay();let t=this.canvas.toDataURL("image/png");return this.redrawFullCanvas(),t}catch(t){return console.error(t),null}}redrawFullCanvas(){this.hasGlobalOverlays||(this.clearCanvas(),this.addVideoOverlay()),this.drawShapesOverlay(),this.drawSelectionHandles(),this.addFrameSquareOverlay(),this.addProgressBarOverlay()}drawSelectionHandles(){if(this.currentTool==="move")try{this.pluginForTool("move").drawResizeHandles()}catch(t){}}replaceFrame(t,e){this.timeStack.set(t,this.parseShapes(this.stringifyShapes(e)))}addShapesToFrame(t,e){let n=this.timeStack.get(t)||[];this.timeStack.set(t,[...n,...this.parseShapes(this.stringifyShapes(e))])}setFrameRate(t){var e;(e=this.destructors.find(n=>n.name==="frameRateDetector"))==null||e(),this.fps=t}stringifyShapes(t){return JSON.stringify(t,(e,n)=>e==="image"?n.src:n)}parseShapes(t){return JSON.parse(t,(e,n)=>{if(e==="image"){let a=new Image;return a.src=n,a}return n})}filterNonSerializableShapes(t){return t.filter(e=>e.type!=="image")}saveCurrentFrame(){return{frame:this.playbackFrame,version:1,fps:this.fps,shapes:this.parseShapes(this.stringifyShapes(this.filterNonSerializableShapes(this.shapes)))}}loadAllFrames(t){this.cleanFrameStacks(),t.forEach(e=>{let n=e.shapes||[];this.timeStack.set(e.frame,this.parseShapes(this.stringifyShapes(n)))})}appendFrames(t){t.forEach(e=>{this.addShapesToFrame(e.frame,e.shapes)})}saveAllFrames(){return Array.from(this.timeStack.keys()).filter(a=>{var r;return(r=this.timeStack.get(a))==null?void 0:r.length}).map(a=>{var r;return{frame:a,fps:this.fps,version:1,shapes:this.filterNonSerializableShapes((r=this.timeStack.get(a))!=null?r:[])}})}getAnnotationFrame(t){var h,l;let e=t.offsetX,n=t.offsetY,a=this.isMobile?20:12;return(l=(h=this.annotatedFrameCoordinates.find(s=>e>=s.x-a&&e<=s.x+a&&n>=s.y-a&&n<=s.y+a))==null?void 0:h.frame)!=null?l:null}get totalFrames(){if(this._enforcedTotalFrames!==null)return this._enforcedTotalFrames;let t=this.videoElement;return t.tagName!=="VIDEO"?1:Math.round(t.duration*this.fps)}setTotalFrames(t){this._enforcedTotalFrames=t!==null?Math.max(1,Math.round(t)):null}getEnforcedTotalFrames(){return this._enforcedTotalFrames}frameFromProgressBar(t,e=!0){if(this.videoElement.tagName!=="VIDEO")return null;let{x:a,width:r,height:h,y:l}=this.progressBarCoordinates,s=t.offsetX,c=t.offsetY,u=()=>{let p=Math.round((s-a)/r*this.totalFrames);return Math.max(1,Math.min(p,this.totalFrames))};return e?s>=a&&s<=a+r&&c>=l&&c<=l+h?u():null:s>=a&&s<=a+r?u():null}hasAnnotationsForFrame(t){if(this.globalShapes.length>0)return!0;if(this.timeStack.has(t)){let e=this.timeStack.get(t);return e&&e.length>0}return!1}stopAnnotationsAsVideo(){this.isAnnotationsAsVideoActive=!1}startAnnotationsAsVideo(){this.isAnnotationsAsVideoActive=!0,this.playAnnotationsAsVideo()}playAnnotationsAsVideo(){this.isAnnotationsAsVideoActive&&(this.hasGlobalOverlays||this.clearCanvas(),this.isMobile?this.hasGlobalOverlays||this.addVideoOverlay():this.addVideoOverlay(),this.drawShapesOverlay(),(this.isCursorOverCanvas||this.isMobile)&&(this.addFrameSquareOverlay(),this.addProgressBarOverlay()))}};function Re(o=this.activeTimeFrame){this.ctx.save(),this.ctx.fillStyle="rgba(0, 0, 0, 0.5)";let i=50,t=30,e=20;this.ctx.fillRect(this.canvasWidth-i,this.canvasHeight-t,i,t),this.ctx.fillStyle="white",this.ctx.font=`${e}px sans-serif`,this.ctx.fillText(`${o}`.padStart(3,"0"),this.canvasWidth-40,this.canvasHeight-7),this.ctx.restore()}function He(){var s,c;let o=this.videoElement;if(o.tagName!=="VIDEO")return;let i=o.getBoundingClientRect(),t=this.canvas.getBoundingClientRect(),e=i.left-t.left,n=i.top-t.top,a=this.activeTimeFrame,r=(c=(s=this.videoFrameBuffer)==null?void 0:s.getFrame(a||0))!=null?c:o,h=r?r.width:o.videoWidth,l=r?r.height:o.videoHeight;this.ctx.drawImage(r,0,0,h,l,e,n,this.canvasWidth,this.canvasHeight)}function $e(){if(this.videoElement.tagName!=="VIDEO")return;this.annotatedFrameCoordinates=[];let t=Array.from(this.timeStack.keys()).filter(f=>{var y;return(y=this.timeStack.get(f))==null?void 0:y.length}),e=this.totalFrames,{x:n,width:a,height:r,y:h}=this.progressBarCoordinates,l=t.map(f=>Math.round(f/e*a));this.ctx.save(),this.ctx.fillStyle="rgba(0, 0, 0, 0.5)",this.ctx.fillRect(n,h,a,r),this.ctx.fillStyle=z.y;let s=this.isMobile?16:8;l.forEach((f,y)=>{this.ctx.beginPath();let x=n+f,g=this.canvasHeight-r/2;this.ctx.fillRect(x-s/2,g-s/2,s,s),this.annotatedFrameCoordinates.push({x,y:g,frame:t[y]})});let c=this.isProgressBarNavigation&&this.lastNavigatedFrame>0?this.lastNavigatedFrame:this.playbackFrame,u=Math.round(c/e*a)+n;this.ctx.fillStyle="white",this.ctx.beginPath();let p=u,m=this.canvasHeight-r/2;this.ctx.beginPath(),this.ctx.fillRect(p-s/2,m-s/2,s,s),this.ctx.fill(),this.ctx.restore()}function Lt(o,i=1){let t=o.replace(/^#/,""),e=0,n=0,a=0;return t.length===3?(e=parseInt(t[0]+t[0],16)/255,n=parseInt(t[1]+t[1],16)/255,a=parseInt(t[2]+t[2],16)/255):t.length===6?(e=parseInt(t.substring(0,2),16)/255,n=parseInt(t.substring(2,4),16)/255,a=parseInt(t.substring(4,6),16)/255):t.length===8&&(e=parseInt(t.substring(0,2),16)/255,n=parseInt(t.substring(2,4),16)/255,a=parseInt(t.substring(4,6),16)/255,i=parseInt(t.substring(6,8),16)/255),[e,n,a,i]}function K(o,i=1){if(typeof o=="string"){if(o.startsWith("rgb")){let t=o.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);if(t)return[parseInt(t[1])/255,parseInt(t[2])/255,parseInt(t[3])/255,t[4]?parseFloat(t[4]):i]}return Lt(o,i)}return[1,0,0,i]}function De(o,i,t,e){let n=Math.cos(e),a=Math.sin(e),r=o.x-i,h=o.y-t;return{x:i+r*n-h*a,y:t+r*a+h*n}}function X(o,i,t,e){if(!i.rotation)return o;let n=i.rotationCenterX!==void 0?i.rotationCenterX:t,a=i.rotationCenterY!==void 0?i.rotationCenterY:e;return o.map(r=>De(r,n,a,i.rotation))}function Be(o,i,t){let e=o*2-1,n=1-i*2;return{x:e*t,y:n}}function U(o){return`[ [ ${o.map(i=>bt(i)).join(" ")} ] ]`}function Y(o){return`[ ${o.map(i=>bt(i)).join(" ")} ]`}function bt(o){return Number.isInteger(o)?String(o):o.toFixed(9).replace(/\.?0+$/,"")||"0"}function N(o,i){return`[ ${o.map(e=>{let n=Be(e.x,e.y,i);return`[ ${bt(n.x)} ${bt(n.y)} ]`}).join(" ")} ]`}function fn(o,i,t,e,n){var p;let a=K(o.strokeStyle,(p=o.opacity)!=null?p:1),r=e/n,h=0,l=0;for(let m of o.points)h+=m.x,l+=m.y;h/=o.points.length,l/=o.points.length;let s=X(o.points,o,h,l),c=o.lineWidth/n,u=new Array(s.length).fill(c);return{name:`"pen:${i}:${t}:User"`,properties:[{type:"float",dimensions:4,name:"color",value:U(a)},{type:"float",name:"width",value:Y(u)},{type:"string",name:"brush",value:'"circle"'},{type:"float",dimensions:2,name:"points",value:N(s,r)},{type:"int",name:"debug",value:0},{type:"int",name:"join",value:3},{type:"int",name:"cap",value:1},{type:"int",name:"splat",value:0}]}}function gn(o,i,t,e,n){var p;let a=K(o.strokeStyle,(p=o.opacity)!=null?p:1),r=e/n,h=(o.x1+o.x2)/2,l=(o.y1+o.y2)/2,s=[{x:o.x1,y:o.y1},{x:o.x2,y:o.y2}];s=X(s,o,h,l);let c=o.lineWidth/n,u=new Array(s.length).fill(c);return{name:`"pen:${i}:${t}:User"`,properties:[{type:"float",dimensions:4,name:"color",value:U(a)},{type:"float",name:"width",value:Y(u)},{type:"string",name:"brush",value:'"circle"'},{type:"float",dimensions:2,name:"points",value:N(s,r)},{type:"int",name:"debug",value:0},{type:"int",name:"join",value:3},{type:"int",name:"cap",value:1},{type:"int",name:"splat",value:0}]}}function vn(o,i,t,e,n){var v;let a=K(o.strokeStyle,(v=o.opacity)!=null?v:1),r=U(a),h=e/n,l=(o.x1+o.x2)/2,s=(o.y1+o.y2)/2,c=[{x:o.x1,y:o.y1},{x:o.x2,y:o.y2}],u=10+2.5*o.lineWidth,p=Math.PI/6,m=Math.atan2(o.y2-o.y1,o.x2-o.x1),f=[{x:o.x2,y:o.y2},{x:o.x2-u*Math.cos(m+p),y:o.y2-u*Math.sin(m+p)}],y=[{x:o.x2,y:o.y2},{x:o.x2-u*Math.cos(m-p),y:o.y2-u*Math.sin(m-p)}];c=X(c,o,l,s),f=X(f,o,l,s),y=X(y,o,l,s);let x=o.lineWidth/n,g=new Array(2).fill(x);return[{name:`"pen:${i}:${t}:User"`,properties:[{type:"float",dimensions:4,name:"color",value:r},{type:"float",name:"width",value:Y(g)},{type:"string",name:"brush",value:'"circle"'},{type:"float",dimensions:2,name:"points",value:N(c,h)},{type:"int",name:"debug",value:0},{type:"int",name:"join",value:3},{type:"int",name:"cap",value:1},{type:"int",name:"splat",value:0}]},{name:`"pen:${i+1}:${t}:User"`,properties:[{type:"float",dimensions:4,name:"color",value:r},{type:"float",name:"width",value:Y(g)},{type:"string",name:"brush",value:'"circle"'},{type:"float",dimensions:2,name:"points",value:N(f,h)},{type:"int",name:"debug",value:0},{type:"int",name:"join",value:3},{type:"int",name:"cap",value:1},{type:"int",name:"splat",value:0}]},{name:`"pen:${i+2}:${t}:User"`,properties:[{type:"float",dimensions:4,name:"color",value:r},{type:"float",name:"width",value:Y(g)},{type:"string",name:"brush",value:'"circle"'},{type:"float",dimensions:2,name:"points",value:N(y,h)},{type:"int",name:"debug",value:0},{type:"int",name:"join",value:3},{type:"int",name:"cap",value:1},{type:"int",name:"splat",value:0}]}]}function yn(o,i,t,e,n){var p;let a=K(o.strokeStyle,(p=o.opacity)!=null?p:1),r=e/n,h=o.x+o.width/2,l=o.y+o.height/2,s=[{x:o.x,y:o.y},{x:o.x+o.width,y:o.y},{x:o.x+o.width,y:o.y+o.height},{x:o.x,y:o.y+o.height},{x:o.x,y:o.y}];s=X(s,o,h,l);let c=o.lineWidth/n,u=new Array(s.length).fill(c);return{name:`"pen:${i}:${t}:User"`,properties:[{type:"float",dimensions:4,name:"color",value:U(a)},{type:"float",name:"width",value:Y(u)},{type:"string",name:"brush",value:'"circle"'},{type:"float",dimensions:2,name:"points",value:N(s,r)},{type:"int",name:"debug",value:0},{type:"int",name:"join",value:3},{type:"int",name:"cap",value:1},{type:"int",name:"splat",value:0}]}}function xn(o,i,t,e,n,a=32){var m;let r=K(o.strokeStyle,(m=o.opacity)!=null?m:1),h=e/n,l=o.x,s=o.y,c=[];for(let f=0;f<=a;f++){let y=f/a*Math.PI*2;c.push({x:o.x+Math.cos(y)*o.radius,y:o.y+Math.sin(y)*o.radius})}c=X(c,o,l,s);let u=o.lineWidth/n,p=new Array(c.length).fill(u);return{name:`"pen:${i}:${t}:User"`,properties:[{type:"float",dimensions:4,name:"color",value:U(r)},{type:"float",name:"width",value:Y(p)},{type:"string",name:"brush",value:'"circle"'},{type:"float",dimensions:2,name:"points",value:N(c,h)},{type:"int",name:"debug",value:0},{type:"int",name:"join",value:3},{type:"int",name:"cap",value:1},{type:"int",name:"splat",value:0}]}}function bn(o,i,t,e,n){var m,f,y,x;let a=K(o.fillStyle,(m=o.opacity)!=null?m:1),r=e/n,h=o.x,l=o.y,s=0;if(o.rotation){let g=(f=o.rotationCenterX)!=null?f:o.x,v=(y=o.rotationCenterY)!=null?y:o.y,b=De({x:o.x,y:o.y},g,v,o.rotation);h=b.x,l=b.y,s=o.rotation*180/Math.PI}let c=Be(h,l,r),p=(16+((x=o.lineWidth)!=null?x:1)*.5)/n;return{name:`"text:${i}:${t}:User"`,properties:[{type:"float",dimensions:2,name:"position",value:U([c.x,c.y])},{type:"float",dimensions:4,name:"color",value:U(a)},{type:"float",name:"spacing",value:.8},{type:"float",name:"size",value:p},{type:"float",name:"scale",value:1},{type:"float",name:"rotation",value:s},{type:"string",name:"font",value:'""'},{type:"string",name:"text",value:`"${o.text.replace(/"/g,'\\"').replace(/\n/g,"\\n")}"`},{type:"string",name:"origin",value:'""'},{type:"int",name:"debug",value:0}]}}function wn(o,i,t,e,n){switch(o.type){case"curve":return[fn(o,i,t,e,n)];case"line":return[gn(o,i,t,e,n)];case"arrow":return vn(o,i,t,e,n);case"rectangle":return[yn(o,i,t,e,n)];case"circle":return[xn(o,i,t,e,n)];case"text":return[bn(o,i,t,e,n)];case"eraser":case"move":case"image":case"compare":case"audio-peaks":case"selection":return[];default:return[]}}function Tn(o){let i=[];i.push(`    ${o.name}`),i.push("    {");for(let t of o.properties){let e=t.dimensions?`${t.type}[${t.dimensions}]`:t.type,n=typeof t.value=="string"?t.value:String(t.value);i.push(`        ${e} ${t.name} = ${n}`)}return i.push("    }"),i.join(`
`)}function Rt(o,i){let{mediaPath:t,width:e,height:n,sessionName:a="sm-annotate-session"}=i,r=[];r.push("GTOa (4)"),r.push(""),r.push("# Generated by sm-annotate OpenRV exporter"),r.push(`# Media: ${t}`),r.push(`# Resolution: ${e}x${n}`),r.push(""),r.push("RVSession : RVSession (4)"),r.push("{"),r.push("    session"),r.push("    {"),r.push(`        string name = "${a}"`),r.push("        int version = 4"),r.push("    }"),r.push("}"),r.push(""),r.push("sourceGroup000000_source : RVFileSource (1)"),r.push("{"),r.push("    media"),r.push("    {"),r.push(`        string movie = "${t}"`),r.push("    }"),r.push("    request"),r.push("    {"),r.push(`        int width = ${e}`),r.push(`        int height = ${n}`),r.push("    }"),r.push("}"),r.push("");let h=[],l=0;for(let s of o)for(let c of s.shapes){let u=wn(c,l,s.frame,e,n);h.push(...u),l+=u.length}if(h.length>0){let s=new Map;for(let c of h){let u=c.name.match(/:\d+:(\d+):/);if(u){let p=parseInt(u[1]);s.has(p)||s.set(p,[]);let m=c.name.startsWith('"')&&c.name.endsWith('"')?c.name.slice(1,-1):c.name;s.get(p).push(m)}}r.push("sourceGroup000000_paint : RVPaint (3)"),r.push("{"),r.push("    paint"),r.push("    {"),r.push(`        int nextId = ${l}`),r.push("        int nextAnnotationId = 0"),r.push("        int show = 1"),r.push("        string exclude = [ ]"),r.push("        string include = [ ]"),r.push("    }");for(let c of h)r.push(Tn(c));for(let[c,u]of s)r.push(`    "frame:${c}"`),r.push("    {"),r.push(`        string order = [ ${u.map(p=>`"${p}"`).join(" ")} ]`),r.push("    }");r.push("}")}return r.join(`
`)}function Oe(o,i,t="annotations.rv"){let e=Rt(o,i),n=new Blob([e],{type:"text/plain"}),a=URL.createObjectURL(n),r=document.createElement("a");r.href=a,r.download=t,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(a)}function wt(o){if(o.length<3)return"#000000";let i=Math.round(o[0]*255),t=Math.round(o[1]*255),e=Math.round(o[2]*255);return`#${i.toString(16).padStart(2,"0")}${t.toString(16).padStart(2,"0")}${e.toString(16).padStart(2,"0")}`}function Sn(o,i){if(o=o.trim(),o.startsWith("[")&&o.endsWith("]")){let t=o.slice(1,-1).trim();if(t==="")return i==="string"?[]:[];if(i==="string"){let n=t.match(/"([^"\\]|\\.)*"/g);return n?n.map(a=>a.slice(1,-1).replace(/\\"/g,'"').replace(/\\n/g,`
`)):[]}if(t.includes("[")){let n=[],a=t.match(/-?\d+\.?\d*(?:e[+-]?\d+)?/gi);if(a)for(let r of a)n.push(Number(r));return n}return t.split(/\s+/).filter(n=>n.length>0&&!isNaN(Number(n))).map(Number)}return o.startsWith('"')&&o.endsWith('"')?o.slice(1,-1).replace(/\\"/g,'"').replace(/\\n/g,`
`):Number(o)}function Cn(o){var r;let i=[],t=o.split(`
`),e=null,n=null,a=0;for(let h=0;h<t.length;h++){let l=t[h].trim();if(l===""||l.startsWith("#")||l==="GTOa (4)")continue;let s=l.match(/^(\S+)\s*:\s*(\S+)\s*\((\d+)\)\s*$/);if(s&&a===0){e={name:s[1],protocol:s[2],version:parseInt(s[3]),components:new Map},i.push(e);continue}if(l==="{"){a++;continue}if(l==="}"){a--,a===1&&(n=null),a===0&&(e=null);continue}if(e&&a>=1){if(a===1){let u=l.match(/^"([^"]+)"$/);if(u){n=u[1],e.components.has(n)||e.components.set(n,new Map);continue}if(!l.includes("=")&&!l.includes("[")){n=l,e.components.has(n)||e.components.set(n,new Map);continue}}let c=l.match(/^(\w+)(?:\[([^\]]*)\])?\s+(\w+)\s*=\s*(.+)$/);if(c&&n){let[,u,,p,m]=c,f=Sn(m,u);(r=e.components.get(n))==null||r.set(p,f)}}}return i}function ze(o,i,t){return{x:(o/t+1)/2,y:(1-i)/2}}function Mn(o,i,t){let e=o.get("points"),n=o.get("color"),a=o.get("width");if(!e||e.length<4)return null;let r=i/t,h=[];for(let u=0;u<e.length;u+=2){let p=ze(e[u],e[u+1],r);h.push(p)}let l=n?wt(n):"#000000",s=n&&n.length>=4?n[3]:1,c=2;if(typeof a=="number")c=a*t;else if(Array.isArray(a)&&a.length>0){let u=a[0];typeof u=="number"&&(c=u*t)}return c=Math.max(1,Math.min(c,50)),{type:"curve",points:h,strokeStyle:l,fillStyle:l,lineWidth:c,opacity:s}}function kn(o,i,t){let e=o.get("position"),n=o.get("color"),a=o.get("text"),r=o.get("size");if(!e||e.length<2||!a)return null;let h=i/t,l=ze(e[0],e[1],h),s=n?wt(n):"#000000",c=n&&n.length>=4?n[3]:1,p=(r!=null?r:.01)*t,m=Math.max(1,(p-16)/.5);return{type:"text",x:l.x,y:l.y,text:a,strokeStyle:s,fillStyle:s,lineWidth:m,opacity:c}}function Ht(o,i={}){var u,p,m,f,y,x,g;let t={frames:[]},e=Cn(o),n=e.find(v=>v.protocol==="RVSession");if(n){let v=n.components.get("session");if(v){let b=v.get("name");typeof b=="string"&&(t.sessionName=b)}}let a=e.find(v=>v.protocol==="RVFileSource");if(a){let v=a.components.get("media");if(v){let T=v.get("movie");typeof T=="string"&&(t.mediaPath=T)}let b=a.components.get("request");if(b){let T=b.get("width"),E=b.get("height");typeof T=="number"&&typeof E=="number"&&(t.dimensions={width:T,height:E})}}let r=(m=(p=i.width)!=null?p:(u=t.dimensions)==null?void 0:u.width)!=null?m:1920,h=(x=(y=i.height)!=null?y:(f=t.dimensions)==null?void 0:f.height)!=null?x:1080,l=(g=i.fps)!=null?g:25;t.fps=l;let s=e.filter(v=>v.protocol==="RVPaint");if(s.length===0)return t;let c=new Map;for(let v of s)for(let[b,T]of v.components){let E=b.match(/^pen:\d+:(\d+):/i);if(E){let S=parseInt(E[1]),I=Mn(T,r,h);I&&(c.has(S)||c.set(S,[]),c.get(S).push(I));continue}let k=b.match(/^text:\d+:(\d+):/i);if(k){let S=parseInt(k[1]),I=kn(T,r,h);I&&(c.has(S)||c.set(S,[]),c.get(S).push(I))}}for(let[v,b]of c)t.frames.push({frame:v,fps:l,version:1,shapes:b});return t.frames.sort((v,b)=>v.frame-b.frame),t}function Ve(t){return P(this,arguments,function*(o,i={}){let e=yield o.text();return Ht(e,i)})}B.prototype.initUI=xe;B.prototype.initCanvas=be;B.prototype.addFrameSquareOverlay=Re;B.prototype.addVideoOverlay=He;B.prototype.addProgressBarOverlay=$e;export{B as SmAnnotate,W as defaultConfig,Oe as downloadAsOpenRV,Rt as exportToOpenRV,Lt as hexToRGBA,Ht as parseOpenRV,Ve as parseOpenRVFile,wt as rgbaToHex};
