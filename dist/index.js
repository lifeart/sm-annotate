var xn=Object.create;var Yt=Object.defineProperty,bn=Object.defineProperties,wn=Object.getOwnPropertyDescriptor,Tn=Object.getOwnPropertyDescriptors,Sn=Object.getOwnPropertyNames,gt=Object.getOwnPropertySymbols,Cn=Object.getPrototypeOf,Ut=Object.prototype.hasOwnProperty,de=Object.prototype.propertyIsEnumerable;var ue=i=>{throw TypeError(i)},U=Math.pow,Xt=(i,o,t)=>o in i?Yt(i,o,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[o]=t,I=(i,o)=>{for(var t in o||(o={}))Ut.call(o,t)&&Xt(i,t,o[t]);if(gt)for(var t of gt(o))de.call(o,t)&&Xt(i,t,o[t]);return i},L=(i,o)=>bn(i,Tn(o));var pe=(i,o)=>{var t={};for(var e in i)Ut.call(i,e)&&o.indexOf(e)<0&&(t[e]=i[e]);if(i!=null&&gt)for(var e of gt(i))o.indexOf(e)<0&&de.call(i,e)&&(t[e]=i[e]);return t};var En=(i,o)=>()=>(o||i((o={exports:{}}).exports,o),o.exports);var In=(i,o,t,e)=>{if(o&&typeof o=="object"||typeof o=="function")for(let n of Sn(o))!Ut.call(i,n)&&n!==t&&Yt(i,n,{get:()=>o[n],enumerable:!(e=wn(o,n))||e.enumerable});return i};var kn=(i,o,t)=>(t=i!=null?xn(Cn(i)):{},In(o||!i||!i.__esModule?Yt(t,"default",{value:i,enumerable:!0}):t,i));var H=(i,o,t)=>Xt(i,typeof o!="symbol"?o+"":o,t),me=(i,o,t)=>o.has(i)||ue("Cannot "+t);var S=(i,o,t)=>(me(i,o,"read from private field"),t?t.call(i):o.get(i)),j=(i,o,t)=>o.has(i)?ue("Cannot add the same private member more than once"):o instanceof WeakSet?o.add(i):o.set(i,t),ct=(i,o,t,e)=>(me(i,o,"write to private field"),e?e.call(i,t):o.set(i,t),t);var M=(i,o,t)=>new Promise((e,n)=>{var r=l=>{try{c(t.next(l))}catch(s){n(s)}},a=l=>{try{c(t.throw(l))}catch(s){n(s)}},c=l=>l.done?e(l.value):Promise.resolve(l.value).then(r,a);c((t=t.apply(i,o)).next())});var _e=En((cr,je)=>{"use strict";function Xn(i){for(var o=1/0,t=-1/0,e=0,n=i.length,r;e<n;e++)r=i[e],o>r&&(o=r),t<r&&(t=r);return{min:o,max:t}}function Xe(i,o){var t=Math.pow(2,o-1),e=i<0?i*t:i*(t-1);return Math.max(-t,Math.min(t-1,e))}function Ye(i,o,t){var e,n=i.length,r=Math.ceil(n/o),a,c,l,s,h,u,p=Ue(t,r*2);for(e=0;e<r;e++)a=e*o,c=(e+1)*o>n?n:(e+1)*o,l=i.subarray(a,c),u=Xn(l),h=Xe(u.min,t),s=Xe(u.max,t),p[e*2]=h,p[e*2+1]=s;return p}function Ue(i,o){return new(new Function(`return Int${i}Array`)())(o)}function Yn(i,o){var t=i.length,e=1/t,n=i[0].length/2,r=0,a=0,c,l,s=Ue(o,n*2);for(a=0;a<n;a++){for(c=0,l=0,r=0;r<t;r++)c+=e*i[r][a*2],l+=e*i[r][a*2+1];s[a*2]=c,s[a*2+1]=l}return[s]}function At(i,o){return typeof i=="number"?i:o}je.exports=function(i,o,t,e,n,r){if(o=At(o,1e3),r=At(r,16),t==null&&(t=!0),[8,16,32].indexOf(r)<0)throw new Error("Invalid number of bits specified for peaks.");var a=i.numberOfChannels,c=[],l,s,h,u;if(e=At(e,0),n=At(n,i.length),typeof i.subarray=="undefined")for(l=0;l<a;l++)h=i.getChannelData(l),u=h.subarray(e,n),c.push(Ye(u,o,r));else c.push(Ye(i.subarray(e,n),o,r));return t&&c.length>1&&(c=Yn(c,r)),s=c[0].length/2,{length:s,data:c,bits:r}}});var Mn={bgPrimary:"rgba(28, 28, 32, 0.95)",bgSecondary:"rgba(42, 42, 48, 0.98)",bgTertiary:"#35353d",bgHover:"rgba(255, 255, 255, 0.08)",bgActive:"rgba(255, 255, 255, 0.12)",textPrimary:"#f0f0f2",textSecondary:"#a8a8b0",textMuted:"#68687a",border:"rgba(255, 255, 255, 0.1)",borderHover:"rgba(255, 255, 255, 0.2)",accent:"#5b9fff",accentHover:"#7db3ff",shadow:"rgba(0, 0, 0, 0.4)"},Fn={bgPrimary:"rgba(250, 250, 252, 0.95)",bgSecondary:"rgba(255, 255, 255, 0.98)",bgTertiary:"#f0f0f5",bgHover:"rgba(0, 0, 0, 0.04)",bgActive:"rgba(0, 0, 0, 0.08)",textPrimary:"#1a1a24",textSecondary:"#5a5a6e",textMuted:"#9090a0",border:"rgba(0, 0, 0, 0.1)",borderHover:"rgba(0, 0, 0, 0.2)",accent:"#2563eb",accentHover:"#3b82f6",shadow:"rgba(0, 0, 0, 0.15)"},Pn={dark:Mn,light:Fn},d="sm-annotate";function Rn(i){return`
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
  `}function An(){return`
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
  `}var ht=null;function jt(i="dark"){ht||(ht=document.createElement("style"),ht.id=`${d}-theme-styles`,document.head.appendChild(ht));let o=Pn[i];ht.textContent=`
    :root {
      ${Rn(o)}
    }
    ${An()}
  `}function z(i){i.classList.add(`${d}-btn`)}function fe(i){i.classList.add(`${d}-container`)}function ge(i){i.classList.add(`${d}-player-controls`)}function ve(i){i.classList.add(`${d}-color-picker`)}function ye(i){i.classList.add(`${d}-slider`)}function xe(i){i.classList.add(`${d}-fullscreen-btn`)}function dt(){let i=document.createElement("div");return i.classList.add(`${d}-divider`),i}function st(){return d}function be(i){let o=document.createElement("button");o.type="button",o.dataset.tooltip="Toggle theme",z(o);let t=()=>{let e=i.theme==="dark";o.innerHTML=e?`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
        </svg>`};return t(),i.addEvent(o,"click",()=>{i.setTheme(i.theme==="dark"?"light":"dark"),t()}),o}function we(i,o){let t=document.createElement("button");t.type="button",z(t),t.style.float="right",t.dataset.tooltip="Download frame",t.dataset.tooltipPosition="bottom",t.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>',o.addEvent(t,"click",()=>{let e=o.frameToDataUrl();if(!e)return;let n=document.createElement("a");n.download=`frame_${String(o.activeTimeFrame).padStart(3,"0")}.png`,n.href=e,n.click()}),o.buttons.push(t),o.playerControlsContainer.appendChild(t)}var Te='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume-x"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="22" x2="16" y1="9" y2="15"></line><line x1="16" x2="22" y1="9" y2="15"></line></svg>',Se='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume-2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>';function Ce(i,o){let t=document.createElement("button");t.type="button",z(t),t.dataset.tooltip="Mute/Unmute",t.dataset.tooltipPosition="bottom",i.muted||i.volume===0?t.innerHTML=Te:t.innerHTML=Se,o.addEvent(i,"volumechange",()=>{i.muted||i.volume===0?t.innerHTML=Te:t.innerHTML=Se}),o.addEvent(t,"click",()=>{if(i.muted){i.muted=!1;return}i.volume===0?i.volume=1:i.volume=0}),o.buttons.push(t),o.playerControlsContainer.appendChild(t)}var q=[{value:0,label:"off"},{value:.25,label:"25%"},{value:.5,label:"50%"},{value:.7,label:"70%"},{value:1,label:"100%"}];function Ee(i,o=!1){let t=o?'<circle cx="18" cy="6" r="4" fill="currentColor" opacity="0.7"/>':"";return`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <style>
      .label {
        font-family: sans-serif;
        font-size: 9px;
      }
    </style>
    <rect x="3" y="3" width="18" height="18" rx="2" opacity="${i.value===0?.3:i.value}"/>
    <text x="12" y="14" text-anchor="middle" class="label" fill="currentColor">${i.label}</text>
    ${t}
  </svg>`}function _t(i){let o=q.findIndex(t=>t.value===i);return o===-1?4:o}function Ie(i){let o=document.createElement("button");o.type="button",o.dataset.tooltip="Opacity";let t=_t(i.overlayOpacity),e=()=>{var c;let r=i.currentTool==="move"?i.pluginForTool("move"):null,a=r==null?void 0:r.getSelectedShape();if(a){let l=(c=a.opacity)!=null?c:1,s=_t(l);o.innerHTML=Ee(q[s],!0),o.dataset.tooltip="Shape opacity"}else o.innerHTML=Ee(q[t],!1),o.dataset.tooltip="Overlay opacity"};e(),z(o),i.addEvent(o,"click",()=>{var c;let r=i.currentTool==="move"?i.pluginForTool("move"):null,a=r==null?void 0:r.getSelectedShape();if(a&&r){let l=(c=a.opacity)!=null?c:1,s=_t(l);s=(s+1)%q.length;let h=q[s].value;r.setSelectedShapeOpacity(h)}else t=(t+1)%q.length,i.overlayOpacity=q[t].value,i.redrawFullCanvas();e()});let n=i.redrawFullCanvas.bind(i);return i.redrawFullCanvas=()=>{n(),e()},i.buttons.push(o),i.uiContainer.appendChild(o),o}var ke='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>',Ln='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pause"><rect width="4" height="16" x="6" y="4"></rect><rect width="4" height="16" x="14" y="4"></rect></svg>';function Me(i,o){let t=document.createElement("button");t.type="button",t.innerHTML=ke,z(t),t.dataset.tooltip="Play/Pause",t.dataset.tooltipPosition="bottom",o.addEvent(i,"play",()=>{t.innerHTML=Ln}),o.addEvent(i,"pause",()=>{t.innerHTML=ke}),o.addEvent(t,"click",()=>{o.withRefVideo(e=>{e.paused&&e.play().then(()=>{o.showButton("compare")})}),i.paused?i.play().then(()=>{o.redrawFullCanvas()}):(i.pause(),o.raf(()=>{o.redrawFullCanvas()}))}),o.buttons.push(t),o.playerControlsContainer.appendChild(t)}function Fe(i){return`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-superscript">
        <style>
            .small {
                font-family: auto;
                font-size: ${i===1?"16":"24"}px;
            }
        </style>
        <text x="${i===1?3:2}" y="${i===1?17:20}" font-weight="normal" class="small">${{"0.25":"\xBC","0.5":"\xBD","0.75":"\xBE",1:"1\xD7"}[String(i)]}</text>
        
    </svg>`}function Pe(i,o){let t=[.25,.5,.75,1],e=document.createElement("button"),n=t[t.length-1];e.type="button",i.playbackRate=n,e.innerHTML=Fe(n),z(e),e.dataset.tooltip="Playback speed",e.dataset.tooltipPosition="bottom",o.addEvent(e,"click",()=>{let r=t.indexOf(i.playbackRate),a=r+1>=t.length?0:r+1;i.playbackRate=t[a],e.innerHTML=Fe(t[a])}),o.buttons.push(e),o.playerControlsContainer.appendChild(e)}var Dn=500;function Re(i,o,t){let e=null,n=!1,r=()=>{n=!1,e=setTimeout(()=>{n=!0,t(),o.redrawFullCanvas()},Dn)},a=()=>{e&&(clearTimeout(e),e=null)},c=()=>{e&&(clearTimeout(e),e=null)},l=s=>{n&&(s.preventDefault(),s.stopImmediatePropagation(),n=!1)};o.addEvent(i,"click",l),i.addEventListener("pointerdown",r),i.addEventListener("pointerup",a),i.addEventListener("pointerleave",c),o.destructors.push(()=>{i.removeEventListener("pointerdown",r),i.removeEventListener("pointerup",a),i.removeEventListener("pointerleave",c),e&&clearTimeout(e)})}var vt=class{constructor(o,t){this.create=(o,t,e=this.uiContainer,n,r="top")=>{let a=document.createElement("button");if(a.type="button",a.innerHTML=o,z(a),n&&(a.dataset.tooltip=n,r==="bottom"&&(a.dataset.tooltipPosition="bottom")),e.appendChild(a),this.buttons.push(a),typeof t=="function")this.addEvent(a,"click",t);else{a.dataset.tool=t;let c=()=>{this.currentTool===t?this.currentTool=null:this.currentTool=t};try{this.tool.pluginForTool(t),this.addEvent(a,"click",c)}catch(l){console.error(l),a.disabled=!0}}return a};this.tool=o,this.uiContainer=t}get buttons(){return this.tool.buttons}get addEvent(){return this.tool.addEvent.bind(this.tool)}get currentTool(){return this.tool.currentTool}set currentTool(o){this.tool.currentTool=o}};function Ae(i,o){let t=i.videoElement.tagName==="VIDEO"?i.videoElement:null;if(o.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>',"rectangle",o.uiContainer,"Rectangle"),o.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>',"circle",o.uiContainer,"Circle"),o.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.3 8.7 8.7 21.3c-1 1-2.5 1-3.4 0l-2.6-2.6c-1-1-1-2.5 0-3.4L15.3 2.7c1-1 2.5-1 3.4 0l2.6 2.6c1 1 1 2.5 0 3.4Z"></path><path d="m7.5 10.5 2 2"></path><path d="m10.5 7.5 2 2"></path><path d="m13.5 4.5 2 2"></path><path d="m4.5 13.5 2 2"></path></svg>',"line",o.uiContainer,"Line"),o.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"></path><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"></path></svg>',"curve",o.uiContainer,"Freehand"),o.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>',"arrow",o.uiContainer,"Arrow"),o.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>',"text",o.uiContainer,"Text"),o.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"></path><path d="M22 21H7"></path><path d="m5 11 9 9"></path></svg>',"eraser",o.uiContainer,"Eraser"),o.uiContainer.appendChild(dt()),o.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 9 2 12 5 15"></polyline><polyline points="9 5 12 2 15 5"></polyline><polyline points="15 19 12 22 9 19"></polyline><polyline points="19 9 22 12 19 15"></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line></svg>',"move",o.uiContainer,"Move shape"),o.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-flip-horizontal"><path d="M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3"></path><path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3"></path><path d="M12 20v2"></path><path d="M12 14v2"></path><path d="M12 8v2"></path><path d="M12 2v2"></path></svg>',"compare",o.uiContainer,"Compare videos"),Ie(i),o.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"></path><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path></svg>',()=>{i.handleUndo()},o.uiContainer,"Undo (Ctrl+Z)"),t){let e=o.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>',()=>{i.prevFrame()},i.playerControlsContainer,"Previous frame (hold for annotation)","bottom");Re(e,i,()=>i.prevAnnotatedFrame()),Me(t,i);let n=o.create('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>',()=>{i.nextFrame()},i.playerControlsContainer,"Next frame (hold for annotation)","bottom");Re(n,i,()=>i.nextAnnotatedFrame()),Ce(t,i),Pe(t,i),we(t,i)}o.create(`<svg viewBox="0 0 24 24" width="24" height="24">
      <path fill="currentColor" d="M3 3h18v18H3V3m2 2v14h14V5H5z"/>
      <path fill="currentColor" d="M7 7h10v10H7V7m2 2v6h6V9H9z"/>
    </svg>`,"selection",o.uiContainer,"Select region")}var X=(i,o)=>{let t=i.target===document.body,e=o.uiContainer.contains(i.target),n=o.playerControlsContainer.contains(i.target),r=o.videoElement.contains(i.target),a=o.canvas.contains(i.target);return e||n||r||a||t};function yt(i){return i.pointerType==="pen"?!1:i.pointerType==="touch"&&i.isPrimary===!1}function Le(i,o){if(!X(i,o))return;let t=o.uiContainer.contains(i.target),e=o.playerControlsContainer.contains(i.target);if(t||e)return;let n=o.videoElement;n.tagName==="VIDEO"&&(n.paused||(o.currentTool=null,n.pause(),o.raf(()=>M(this,null,function*(){o.redrawFullCanvas()}))))}function De(i,o){var t;X(i,o)&&(i.preventDefault(),i.stopPropagation(),i.stopImmediatePropagation(),(t=i.clipboardData)==null||t.setData("application/json",JSON.stringify(o.saveCurrentFrame())))}function $e(i,o){var e;if(!X(i,o))return;i.preventDefault(),i.stopPropagation(),i.stopImmediatePropagation();let t=o.saveCurrentFrame();o.replaceFrame(o.playbackFrame,[]),o.redrawFullCanvas(),(e=i.clipboardData)==null||e.setData("application/json",JSON.stringify(t))}function Oe(i,o){if(!X(i,o))return;let t=o.videoElement;t.tagName==="VIDEO"&&(i.key==="ArrowLeft"||i.key==="ArrowRight"?(i.preventDefault(),i.stopPropagation(),i.stopImmediatePropagation(),i.key==="ArrowLeft"?o.prevFrame():i.key==="ArrowRight"&&o.nextFrame()):i.code==="Space"&&(i.preventDefault(),i.stopPropagation(),i.stopImmediatePropagation(),t.paused?t.play().then(()=>{o.redrawFullCanvas()}):(t.pause(),o.raf(()=>{o.redrawFullCanvas()}))))}function He(i,o){var r,a,c,l,s;if(!X(i,o))return;let t=(a=(r=i.clipboardData)==null?void 0:r.types)!=null?a:[];if(t.includes("application/json"))i.preventDefault(),i.stopPropagation(),i.stopImmediatePropagation();else if(t.includes("Files")){let h=(c=i.clipboardData)==null?void 0:c.files;if(h&&h.length>0){let u=h[0];if(u.type.startsWith("image/")){i.preventDefault(),i.stopPropagation(),i.stopImmediatePropagation();let p=new Image,m=URL.createObjectURL(u);p.addEventListener("load",()=>{URL.revokeObjectURL(m);let f=p.naturalWidth/p.naturalHeight,v=.25,y=v/f*o.aspectRatio;o.addShapesToFrame(o.playbackFrame,[{type:"image",image:p,x:0,y:0,width:v,height:y,strokeStyle:"red",fillStyle:"red",lineWidth:2}]),o.redrawFullCanvas(),o.raf(()=>{o.show()}),o.currentTool="move"},{once:!0}),p.addEventListener("error",()=>{URL.revokeObjectURL(m)},{once:!0}),p.src=m,o.redrawFullCanvas()}}}else if(t.includes("text/plain")){let h=(l=i.clipboardData)==null?void 0:l.getData("text/plain");h&&(i.preventDefault(),i.stopPropagation(),i.stopImmediatePropagation(),o.addShapesToFrame(o.playbackFrame,[{type:"text",text:h,x:.4,y:.4,strokeStyle:o.ctx.strokeStyle,fillStyle:o.ctx.fillStyle,lineWidth:o.ctx.lineWidth}]),o.show(),o.currentTool="move",o.redrawFullCanvas())}else return;let e=(s=i.clipboardData)==null?void 0:s.getData("application/json");if(!e)return;let n=JSON.parse(e);n&&n.shapes&&n.version===1&&(o.addShapesToFrame(o.playbackFrame,n.shapes),o.redrawFullCanvas())}var K={r:"#d31a3b",g:"#15d33b",b:"#0085CA",y:"#F3CE32",a:"#7fffd4",c:"#00ffff",d:"#696969",e:"#50c878",f:"#ff00ff",h:"#f0fff0",i:"#4b0082",j:"#00a86b",k:"#f0e68c",l:"#e6e6fa",m:"#98ff98",n:"#000080",o:"#ffa500",p:"#800080",q:"#e5acc8",s:"#0f52ba",t:"#008080",u:"#3f00ff",v:"#ee82ee",w:"#ffffff",x:"#738678",z:"#0014a8"};function Be(i,o){let t=document.createElement("input");t.type="color",t.value=i,t.dataset.tooltip="Stroke color";let e=n=>{o.ctx.strokeStyle=n.target.value,o.ctx.fillStyle=n.target.value,o.focusOnMediaNode()};return o.addEvent(t,"input",e),t}function ze(i){let o=document.createElement("input");o.type="number",o.step="1",o.min="1",o.max="10",o.value="5",o.style.margin="5px",o.dataset.tooltip="Stroke width";let t=e=>{i.ctx.lineWidth=e.target.valueAsNumber,i.focusOnMediaNode()};return i.addEvent(o,"input",t),o}var $n=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
</svg>`;function On(){var i,o;return(o=(i=document.fullscreenElement)!=null?i:document.webkitFullscreenElement)!=null?o:null}function Hn(i){if(i.requestFullscreen)return i.requestFullscreen();let o=i;if(o.webkitRequestFullscreen)return o.webkitRequestFullscreen()}function Bn(){if(document.exitFullscreen)return document.exitFullscreen();let i=document;if(i.webkitExitFullscreen)return i.webkitExitFullscreen()}function zn(){var i;return!!((i=document.fullscreenEnabled)!=null?i:document.webkitFullscreenEnabled)}function Ve(i){let o=document.createElement("button");if(o.innerHTML=$n,o.type="button",o.dataset.tooltip="Fullscreen",o.dataset.tooltipPosition="bottom",xe(o),!zn())return o.style.display="none",o;let t=()=>{if(On())Bn();else{let n=i.videoElement.parentElement;n&&Hn(n)}};o.addEventListener("click",t);let e=()=>{i.setCanvasSize(),i.playbackFrame=i.playbackFrame,i.canvas.focus(),i.redrawFullCanvas(),o.blur()};return document.addEventListener("fullscreenchange",e),document.addEventListener("webkitfullscreenchange",e),i.destructors.push(()=>{o.removeEventListener("click",t),document.removeEventListener("fullscreenchange",e),document.removeEventListener("webkitfullscreenchange",e)}),o}var Vn=K.r,Wn="",Nn="";function We(){var c,l;let i=document.createElement("div");i.style.cssText=Nn,fe(i),(c=this.canvas.parentNode)==null||c.insertBefore(i,this.canvas);let o=document.createElement("div");o.style.cssText=Wn,ge(o),(l=this.canvas.parentNode)==null||l.insertBefore(o,this.canvas.nextSibling),this.playerControlsContainer=o;let t=this.videoElement.tagName==="VIDEO"?this.videoElement:null;this.uiContainer=i;let e=()=>{let s=document.createElement("div");return s.style.display="inline-flex",s.style.alignItems="center",s},n=new vt(this,i);Ae(this,n),this.isMobile&&(this.hideButton("line"),this.hideButton("circle"),this.hideButton("rectangle"),this.hideButton("eraser")),this.hideButton("compare"),i.appendChild(dt()),this.colorPicker=Be(Vn,this),ve(this.colorPicker),i.appendChild(this.colorPicker);let r=e();this.strokeSizePicker=ze(this),ye(this.strokeSizePicker),r.appendChild(this.strokeSizePicker),i.appendChild(r),i.appendChild(dt());let a=be(this);if(i.appendChild(a),t){this.hide(),this.addEvent(t,"pause",()=>{this.show()}),this.addEvent(t,"seek",()=>{t.paused&&this.show()}),this.addEvent(t,"timeupdate",()=>{t.currentTime<2e-4&&!t.paused&&this.startAnnotationsAsVideo()}),this.addEvent(t,"error",()=>{this.hide()}),this.addEvent(t,"stalled",()=>{this.hide()}),this.addEvent(t,"play",()=>{this.hideControls(),this.startAnnotationsAsVideo()}),this.addEvent(document,"copy",h=>{De(h,this)}),this.addEvent(document,"cut",h=>{$e(h,this)}),this.addEvent(document,"paste",h=>{He(h,this)}),this.addEvent(document,"click",h=>{Le(h,this)}),this.addEvent(document,"keydown",h=>{Oe(h,this)}),this.addEvent(document.body.querySelector("div"),"drop",h=>{var u;(u=h.dataTransfer)!=null&&u.types});let s=Ve(this);o.appendChild(s)}}function Ne(){var i;this.canvas=document.createElement("canvas"),this.ctx=this.canvas.getContext("2d"),(i=this.videoElement.parentNode)==null||i.insertBefore(this.canvas,this.videoElement.nextSibling),this.canvas.style.position="absolute",this.canvas.style.backgroundColor="transparent",this.canvas.style.top="0",this.canvas.style.left="0",this.canvas.style.zIndex="1",this.addEvent(this.canvas,"pointerdown",this.handleMouseDown),this.addEvent(this.canvas,"pointermove",this.handleMouseMove),this.addEvent(this.canvas,"pointerup",this.handleMouseUp),this.addEvent(this.canvas,"pointercancel",this.handleMouseUp),this.addEvent(this.canvas,"pointerenter",()=>{this.isCursorOverCanvas=!0}),this.addEvent(this.canvas,"pointerleave",()=>{this.isCursorOverCanvas=!1}),this.addEvent(this.canvas,"touchmove",o=>{o.stopImmediatePropagation(),o.stopPropagation(),o.preventDefault()}),this.addEvent(window,"resize",this.setCanvasSize),this.addEvent(document,"keydown",this.onKeyDown)}var xt=class{constructor(){this.destructors=[];this.isDestroyed=!1;this.activeTimeFrame=1;this.globalShapes=[];this.timeStack=new Map;this.undoTimeStack=new Map}cleanFrameStacks(){this.timeStack.clear(),this.undoTimeStack.clear()}destroy(){this.destructors.forEach(o=>o()),this.destructors=[],this.globalShapes=[],this.cleanFrameStacks()}raf(o){return requestAnimationFrame(o)}addEvent(o,t,e){let n=r=>{this.isDestroyed||e(r)};o.addEventListener(t,n),this.destructors.push(()=>{o.removeEventListener(t,n)})}addProgressBarOverlay(){throw new Error("Method not implemented.")}initUI(){throw new Error("Method not implemented.")}initCanvas(){throw new Error("Method not implemented.")}addFrameSquareOverlay(o=this.activeTimeFrame){throw new Error("Method not implemented.")}addVideoOverlay(){throw new Error("Method not implemented.")}withRefVideo(o){this.isDestroyed||this.referenceVideoElement&&o(this.referenceVideoElement)}withVideo(o){if(this.isDestroyed)return;let t=this.videoElement;!t||t.tagName!=="VIDEO"||o(t)}};var P=class{constructor(o){this.startX=0;this.startY=0;this.isDrawing=!1;this.annotationTool=o}isPointerAtShape(o,t,e){return!1}on(o,t){}get ctx(){return this.annotationTool.ctx}onDeactivate(){}onActivate(){}reset(){this.startX=0,this.startY=0,this.isDrawing=!1}save(o){this.annotationTool.addShape(o)}applyRotation(o,t,e){return o.rotation?(this.ctx.save(),this.ctx.translate(t,e),this.ctx.rotate(o.rotation),this.ctx.translate(-t,-e),!0):!1}restoreRotation(){this.ctx.restore()}getRotationCenter(o,t,e){return o.rotationCenterX!==void 0&&o.rotationCenterY!==void 0?{x:o.rotationCenterX*this.annotationTool.canvasWidth,y:o.rotationCenterY*this.annotationTool.canvasHeight}:{x:t,y:e}}};var bt=class extends P{constructor(){super(...arguments);this.name="rectangle"}move(t,e,n){return t.x+=e,t.y+=n,t}normalize(t,e,n){return L(I({},t),{x:t.x/e,y:t.y/n,width:t.width/e,height:t.height/n})}onPointerDown(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.startX=e,this.startY=n,this.isDrawing=!0}onPointerMove(t){if(!this.isDrawing)return;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.drawRectangle(this.startX,this.startY,e-this.startX,n-this.startY)}onPointerUp(t){if(!this.isDrawing)return;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.save({type:"rectangle",x:this.startX,y:this.startY,width:e-this.startX,height:n-this.startY,strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth}),this.drawRectangle(this.startX,this.startY,e-this.startX,n-this.startY),this.isDrawing=!1}drawRectangle(t,e,n,r){this.ctx.beginPath(),this.ctx.rect(t,e,n,r),this.ctx.stroke()}draw(t){let e=t.x+t.width/2,n=t.y+t.height/2,r=this.getRotationCenter(t,e,n),a=this.applyRotation(t,r.x,r.y);this.drawRectangle(t.x,t.y,t.width,t.height),a&&this.restoreRotation()}isPointerAtShape(t,e,n){let a=Math.min(t.x,t.x+t.width),c=Math.max(t.x,t.x+t.width),l=Math.min(t.y,t.y+t.height),s=Math.max(t.y,t.y+t.height),h=Math.abs(e-a)<=5,u=Math.abs(e-c)<=5,p=Math.abs(n-l)<=5,m=Math.abs(n-s)<=5,f=n>=l-5&&n<=s+5,v=e>=a-5&&e<=c+5;return(h||u)&&f||(p||m)&&v}};var wt=class extends P{constructor(){super(...arguments);this.name="circle"}move(t,e,n){return t.x+=e,t.y+=n,t}normalize(t,e,n){return L(I({},t),{x:t.x/e,y:t.y/n,radius:t.radius/e})}onPointerDown(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.startX=e,this.startY=n,this.isDrawing=!0}onPointerMove(t){if(!this.isDrawing)return;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t),r=Math.sqrt(Math.pow(e-this.startX,2)+Math.pow(n-this.startY,2));this.drawCircle(this.startX,this.startY,r)}onPointerUp(t){if(!this.isDrawing)return;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t),r=Math.sqrt(Math.pow(e-this.startX,2)+Math.pow(n-this.startY,2));this.save({type:"circle",x:this.startX,y:this.startY,radius:r,strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth}),this.drawCircle(this.startX,this.startY,r),this.isDrawing=!1}drawCircle(t,e,n){this.ctx.beginPath(),this.ctx.arc(t,e,n,0,2*Math.PI),this.ctx.stroke()}draw(t){if(t.radius===void 0||t.radius<0)return;let e=this.getRotationCenter(t,t.x,t.y),n=this.applyRotation(t,e.x,e.y);this.drawCircle(t.x,t.y,t.radius),n&&this.restoreRotation()}isPointerAtShape(t,e,n){var s;if(t.radius===void 0||t.radius<0)return!1;let r=e-t.x,a=n-t.y,c=Math.sqrt(r*r+a*a),l=Math.max(((s=t.lineWidth)!=null?s:1)/2,5);return c<=t.radius+l}};var Tt=class{constructor(o,t){this.x=o;this.y=t}distanceToLine(o,t){let e=t.x-o.x,n=t.y-o.y,r=Math.abs(n*this.x-e*this.y+t.x*o.y-t.y*o.x),a=Math.sqrt(n*n+e*e);return r/a}};function St(i,o){if(i.length<=2)return i;let t=i[0],e=i[i.length-1],n=-1,r=0;for(let a=1;a<i.length-1;a++){let c=i[a].distanceToLine(t,e);c>r&&(n=a,r=c)}if(r>o){let a=St(i.slice(0,n+1),o),c=St(i.slice(n),o);return a.slice(0,a.length-1).concat(c)}else return[t,e]}var Ct=class extends P{constructor(){super(...arguments);this.name="curve";this.curvePoints=[];this.zoomScale=2;this.zoomRadius=100;this.zoomCtx=null;this.zoomCanvas=null;this.onKeyPress=t=>{let e=t.key;if(e===null||e===" "||t.isComposing)return;let n=Number(e);if(isNaN(n)||!n){e in K&&(this.annotationTool.colorPicker.value=K[e],this.annotationTool.setCanvasSettings());return}this.annotationTool.strokeSizePicker.value=e,this.annotationTool.setCanvasSettings()}}move(t,e,n){return t.points=t.points.map(r=>({x:r.x+e,y:r.y+n})),t}onActivate(){this.initZoomCanvas(),document.addEventListener("keypress",this.onKeyPress)}onDeactivate(){this.zoomCtx=null,this.zoomCanvas=null,document.removeEventListener("keypress",this.onKeyPress)}normalize(t,e,n){return L(I({},t),{points:t.points.map(r=>({x:r.x/e,y:r.y/n}))})}draw(t){if(!t.points||t.points.length===0)return;let e=0,n=0;for(let s of t.points)e+=s.x,n+=s.y;let r=e/t.points.length,a=n/t.points.length,c=this.getRotationCenter(t,r,a),l=this.applyRotation(t,c.x,c.y);this.drawCurve(t),l&&this.restoreRotation()}reset(){super.reset(),this.curvePoints=[]}onPointerDown(t){if(this.isDrawing)return;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.curvePoints=[],this.startX=e,this.startY=n,this.isDrawing=!0,this.curvePoints.push({x:e,y:n})}onPointerMove(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);if(!this.isDrawing){this.drawZoomCircle(e,n,t.shiftKey);return}this.curvePoints.push({x:e,y:n}),this.drawCurve({points:this.curvePoints,lineWidth:this.ctx.lineWidth}),this.drawZoomCircle(e,n,t.shiftKey)}onPointerUp(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);if(this.drawZoomCircle(e,n,t.shiftKey),!this.isDrawing)return;this.curvePoints.push({x:e,y:n});let r=this.curvePoints.map(h=>new Tt(h.x,h.y)),s={type:"curve",points:St(r,.5).map(h=>({x:h.x,y:h.y})),strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth};this.save(s),this.curvePoints=[],this.isDrawing=!1}drawCurve(t){if(t.points.length===2&&t.points[0].x===t.points[1].x&&t.points[0].y===t.points[1].y){let e=t.lineWidth/4,n=0,r=2*Math.PI;this.ctx.beginPath(),this.ctx.arc(t.points[0].x,t.points[0].y,e,n,r),this.ctx.stroke()}else{this.ctx.beginPath(),this.ctx.moveTo(t.points[0].x,t.points[0].y);for(let e=0;e<t.points.length-1;e++){let n=t.points[e],r=t.points[e+1];this.ctx.quadraticCurveTo(n.x,n.y,r.x,r.y)}this.ctx.stroke()}}initZoomCanvas(){let t=document.createElement("canvas"),e=2;t.width=this.zoomRadius*2*e,t.height=this.zoomRadius*2*e;let n=t.getContext("2d");n&&(n.imageSmoothingQuality="high",n.imageSmoothingEnabled=!0,this.zoomCtx=n,this.zoomCanvas=t)}isPointerAtShape(t,e,n){var a;if(!t.points||t.points.length===0)return!1;let r=Math.max(((a=t.lineWidth)!=null?a:this.ctx.lineWidth)/2,5);for(let c=0;c<t.points.length-1;c++){let l=t.points[c],s=t.points[c+1],h=e-l.x,u=n-l.y,p=s.x-l.x,m=s.y-l.y,f=h*p+u*m,v=p*p+m*m,y=-1;v!==0&&(y=f/v);let g,x;y<0?(g=l.x,x=l.y):y>1?(g=s.x,x=s.y):(g=l.x+y*p,x=l.y+y*m);let C=e-g,R=n-x;if(Math.sqrt(C*C+R*R)<r)return!0}return!1}drawZoomCircle(t,e,n=!1){if(!n)return;this.isDrawing||(this.annotationTool.clearCanvas(),this.annotationTool.addVideoOverlay(),this.annotationTool.drawShapesOverlay());let r=this.zoomCtx;if(!r)return;let a=this.annotationTool.pixelRatio,c=this.zoomRadius*2/this.zoomScale,l=t-c/2,s=e-c/2;r.clearRect(0,0,this.zoomCanvas.width,this.zoomCanvas.height),r.drawImage(this.ctx.canvas,l*a,s*a,c*a,c*a,0,0,this.zoomRadius*2,this.zoomRadius*2),this.ctx.save(),this.ctx.beginPath(),this.ctx.arc(t,e,this.zoomRadius,0,2*Math.PI),this.ctx.closePath(),this.ctx.clip(),this.ctx.drawImage(this.zoomCanvas,t-this.zoomRadius,e-this.zoomRadius),this.ctx.restore()}};var Et=class extends P{constructor(){super(...arguments);this.name="line"}move(t,e,n){return t.x1+=e,t.y1+=n,t.x2+=e,t.y2+=n,t}normalize(t,e,n){return L(I({},t),{x1:t.x1/e,y1:t.y1/n,x2:t.x2/e,y2:t.y2/n})}onPointerDown(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.startX=e,this.startY=n,this.isDrawing=!0}onPointerMove(t){if(!this.isDrawing)return;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.drawLine(this.startX,this.startY,e,n)}onPointerUp(t){if(!this.isDrawing)return;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.save({type:"line",x1:this.startX,y1:this.startY,x2:e,y2:n,fillStyle:this.ctx.fillStyle,strokeStyle:this.ctx.strokeStyle,lineWidth:this.ctx.lineWidth}),this.drawLine(this.startX,this.startY,e,n),this.isDrawing=!1}drawLine(t,e,n,r){this.ctx.beginPath(),this.ctx.moveTo(t,e),this.ctx.lineTo(n,r),this.ctx.stroke()}draw(t){let e=(t.x1+t.x2)/2,n=(t.y1+t.y2)/2,r=this.getRotationCenter(t,e,n),a=this.applyRotation(t,r.x,r.y);this.drawLine(t.x1,t.y1,t.x2,t.y2),a&&this.restoreRotation()}isPointerAtShape(t,e,n){var p;let{x1:r,y1:a,x2:c,y2:l}=t,s=Math.max(((p=t.lineWidth)!=null?p:1)/2,5),h=(c-r)*(a-n)-(r-e)*(l-a),u=U(c-r,2)+U(l-a,2);if(u===0){let m=e-r,f=n-a;return Math.sqrt(m*m+f*f)<=s}return Math.abs(h)/Math.sqrt(u)<=s&&e>=Math.min(r,c)-s&&e<=Math.max(r,c)+s&&n>=Math.min(a,l)-s&&n<=Math.max(a,l)+s}};var It=class extends P{constructor(){super(...arguments);this.name="arrow"}normalize(t,e,n){return L(I({},t),{x1:t.x1/e,y1:t.y1/n,x2:t.x2/e,y2:t.y2/n})}move(t,e,n){return t.x1+=e,t.y1+=n,t.x2+=e,t.y2+=n,t}draw(t){let e=(t.x1+t.x2)/2,n=(t.y1+t.y2)/2,r=this.getRotationCenter(t,e,n),a=this.applyRotation(t,r.x,r.y);this.drawArrow(t.x1,t.y1,t.x2,t.y2,t.lineWidth),a&&this.restoreRotation()}onPointerDown(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.startX=e,this.startY=n,this.isDrawing=!0}onPointerMove(t){if(!this.isDrawing)return;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.drawArrow(this.startX,this.startY,e,n)}onPointerUp(t){if(!this.isDrawing)return;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.save({type:"arrow",x1:this.startX,y1:this.startY,x2:e,y2:n,strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth}),this.drawArrow(this.startX,this.startY,e,n),this.isDrawing=!1}drawArrow(t,e,n,r,a){let c=10+2.5*(a!=null?a:this.ctx.lineWidth),l=Math.PI/6,s=Math.atan2(r-e,n-t);this.ctx.beginPath(),this.ctx.moveTo(t,e),this.ctx.lineTo(n,r),this.ctx.stroke(),this.ctx.beginPath(),this.ctx.moveTo(n,r),this.ctx.lineTo(n-c*Math.cos(s+l),r-c*Math.sin(s+l)),this.ctx.moveTo(n,r),this.ctx.lineTo(n-c*Math.cos(s-l),r-c*Math.sin(s-l)),this.ctx.stroke()}isPointerAtShape(t,e,n){var p;let{x1:r,y1:a,x2:c,y2:l}=t,s=Math.max(((p=t.lineWidth)!=null?p:1)/2,5),h=(c-r)*(a-n)-(r-e)*(l-a),u=U(c-r,2)+U(l-a,2);if(u===0){let m=e-r,f=n-a;return Math.sqrt(m*m+f*f)<=s}return Math.abs(h)/Math.sqrt(u)<=s&&e>=Math.min(r,c)-s&&e<=Math.max(r,c)+s&&n>=Math.min(a,l)-s&&n<=Math.max(a,l)+s}};var kt=class extends P{constructor(){super(...arguments);this.name="text";this.activePopup=null;this.handleKeyDown=t=>{}}move(t,e,n){return t.x+=e,t.y+=n,t}onActivate(){this.annotationTool.canvas.style.cursor="text",this.isDrawing=!0}onDeactivate(){this.destroyPopup(),this.annotationTool.canvas.style.cursor="default",this.isDrawing=!1}draw(t){var m;if(!t.text)return;let e=t.text.split(`
`),n=16+((m=t.lineWidth)!=null?m:this.ctx.lineWidth)*.5,r=n*1.25;this.ctx.font=`${n}px Helvetica Neue, Arial`;let a=e.map(f=>this.ctx.measureText(f).width),c=a.length>0?Math.max(...a):0,l=e.length*r,s=t.x+c/2,h=t.y-n/2+l/2,u=this.getRotationCenter(t,s,h),p=this.applyRotation(t,u.x,u.y);for(let f=0;f<e.length;f++)this.drawTextLine(t.x,t.y+f*r,e[f],n);p&&this.restoreRotation()}drawText(t,e,n){let r=16+this.ctx.lineWidth*.5;this.ctx.font=`${r}px Helvetica Neue, Arial`,this.ctx.fillText(n,t,e)}drawTextLine(t,e,n,r){this.ctx.font=`${r}px Helvetica Neue, Arial`,this.ctx.fillText(n,t,e)}onPointerDown(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.startX=e,this.startY=n}onPointerMove(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.ctx.beginPath(),this.ctx.arc(e,n,5,0,2*Math.PI),this.ctx.fill()}normalize(t,e,n){return L(I({},t),{x:t.x/e,y:t.y/n})}destroyPopup(){var t;this.activePopup&&((t=this.annotationTool.canvas.parentElement)==null||t.removeChild(this.activePopup),this.activePopup=null,document.removeEventListener("keydown",this.handleKeyDown))}createTextInputPopup(t,e){var m;this.destroyPopup();let n=document.createElement("div");this.activePopup=n,n.style.cssText=`
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
    `;let r=document.createElement("input");r.type="text",r.placeholder="Enter text to draw",r.style.cssText=`
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
    `,r.addEventListener("focus",()=>{r.style.borderColor="#007bff"}),r.addEventListener("blur",()=>{r.style.borderColor="#ddd"});let a=document.createElement("div");a.style.cssText=`
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
    `,s.addEventListener("mouseover",()=>{s.style.opacity="0.8"}),s.addEventListener("mouseout",()=>{s.style.opacity="1"});let h=()=>{this.destroyPopup()},u=()=>{let f=r.value.trim();f&&(this.save({type:"text",x:t,y:e,text:f,strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth}),this.annotationTool.currentTool=null),h()},p=f=>{f.key==="Escape"?h():f.key==="Enter"&&u()};this.handleKeyDown=p,s.onclick=u,l.onclick=h,r.onkeyup=p,document.addEventListener("keydown",p),a.appendChild(l),a.appendChild(s),n.appendChild(r),n.appendChild(a),(m=this.annotationTool.canvas.parentElement)==null||m.appendChild(n),requestAnimationFrame(()=>{r.focus()})}onPointerUp(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.createTextInputPopup(e,n)}isPointerAtShape(t,e,n){var u;if(!t.text)return!1;let r=t.text.split(`
`);if(r.length===0)return!1;let a=16+((u=t.lineWidth)!=null?u:1)*.5,c=a*1.25,l=r.length*c;this.ctx.font=`${a}px Helvetica Neue, Arial`;let s=r.map(p=>this.ctx.measureText(p).width),h=s.length>0?Math.max(...s):0;return h===0?!1:e>=t.x&&e<=t.x+h&&n>=t.y-a&&n<=t.y+l-a}};var Mt=class extends P{constructor(){super(...arguments);this.name="eraser"}move(t,e,n){return t.x+=e,t.y+=n,t}normalize(t,e,n){return L(I({},t),{x:t.x/e,y:t.y/n,width:t.width/e,height:t.height/n})}draw(t){this.drawEraser(t.x,t.y,t.width,t.height)}onPointerDown(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.startX=e,this.startY=n,this.isDrawing=!0}onPointerMove(t){if(!this.isDrawing)return;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.ctx.save(),this.ctx.strokeStyle="rgba(255, 255, 255, 0.5)",this.ctx.lineWidth=1,this.ctx.fillStyle="rgba(255, 255, 255, 0.3)",this.ctx.fillRect(this.startX,this.startY,e-this.startX,n-this.startY),this.ctx.strokeRect(this.startX,this.startY,e-this.startX,n-this.startY),this.ctx.restore()}onPointerUp(t){if(!this.isDrawing)return;this.isDrawing=!1;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.save({type:"eraser",x:this.startX,y:this.startY,width:e-this.startX,height:n-this.startY,strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth})}drawEraser(t,e,n,r){this.ctx.clearRect(t,e,n,r)}isPointerAtShape(t,e,n){let r=Math.min(t.x,t.x+t.width),a=Math.max(t.x,t.x+t.width),c=Math.min(t.y,t.y+t.height),l=Math.max(t.y,t.y+t.height);return e>=r&&e<=a&&n>=c&&n<=l}};var Ft=class extends P{constructor(){super(...arguments);this.name="move";this.shape=null;this.shapeIndex=-1;this.lastDrawnShape=null;this.isScale=!1;this.selectedShapeIndex=-1;this.boundHandleKeyDown=null;this.activeHandle=null;this.handleSize=8;this.resizeStartBounds=null;this.resizeOriginalShape=null;this.rotationActive=!1;this.rotationStartAngle=0;this.rotationShapeStartAngle=0;this.centerDragActive=!1;this.rotationHandleDistance=40}cloneShape(t){if(t.type==="image"){let e=t;return L(I({},JSON.parse(JSON.stringify(t))),{image:e.image})}return JSON.parse(JSON.stringify(t))}getSelectedShape(){return this.selectedShapeIndex<0||this.selectedShapeIndex>=this.annotationTool.shapes.length?null:this.annotationTool.shapes[this.selectedShapeIndex]}setSelectedShapeOpacity(t){return this.selectedShapeIndex<0||this.selectedShapeIndex>=this.annotationTool.shapes.length?!1:(this.annotationTool.undoStack.push([...this.annotationTool.shapes]),this.annotationTool.shapes[this.selectedShapeIndex].opacity=t,this.annotationTool.redrawFullCanvas(),!0)}move(t){return t}normalize(t){return I({},t)}onActivate(){this.boundHandleKeyDown=this.handleKeyDown.bind(this),document.addEventListener("keydown",this.boundHandleKeyDown)}onDeactivate(){this.boundHandleKeyDown&&(document.removeEventListener("keydown",this.boundHandleKeyDown),this.boundHandleKeyDown=null),this.selectedShapeIndex=-1}handleKeyDown(t){if((t.key==="Backspace"||t.key==="Delete")&&this.selectedShapeIndex>=0){t.preventDefault(),this.deleteSelectedShape();return}if((t.ctrlKey||t.metaKey)&&t.key.toLowerCase()==="d"&&this.selectedShapeIndex>=0){t.preventDefault(),this.duplicateSelectedShape();return}if((t.ctrlKey||t.metaKey)&&t.shiftKey&&t.key==="ArrowRight"){t.preventDefault(),this.copyAnnotationsToNextFrame();return}if((t.ctrlKey||t.metaKey)&&t.shiftKey&&t.key==="ArrowLeft"){t.preventDefault(),this.copyAnnotationsToPrevFrame();return}}duplicateSelectedShape(){let t=this.getSelectedShape();if(!t)return;let e=this.cloneShape(t),n=20;this.getShapeBounds(e)&&this.offsetShape(e,n,n),this.annotationTool.undoStack.push([...this.annotationTool.shapes]);let a=this.annotationTool.serialize([e])[0];this.annotationTool.shapes.push(a),this.selectedShapeIndex=this.annotationTool.shapes.length-1,this.annotationTool.redrawFullCanvas()}copyAnnotationsToNextFrame(){let e=this.annotationTool.activeTimeFrame+1;if(e>this.annotationTool.totalFrames||this.annotationTool.shapes.length===0)return;let n=this.annotationTool.timeStack.get(e)||[],r=this.annotationTool.shapes.map(c=>this.cloneShape(c)),a=[...n,...r];this.annotationTool.timeStack.set(e,a),this.annotationTool.playbackFrame=e,this.annotationTool.redrawFullCanvas()}copyAnnotationsToPrevFrame(){let e=this.annotationTool.activeTimeFrame-1;if(e<1||this.annotationTool.shapes.length===0)return;let n=this.annotationTool.timeStack.get(e)||[],r=this.annotationTool.shapes.map(c=>this.cloneShape(c)),a=[...n,...r];this.annotationTool.timeStack.set(e,a),this.annotationTool.playbackFrame=e,this.annotationTool.redrawFullCanvas()}offsetShape(t,e,n){let r=this.annotationTool.deserialize([t])[0],c=this.annotationTool.pluginForTool(r.type).move(r,e,n);Object.assign(t,this.annotationTool.serialize([c])[0])}getShapeBounds(t){var n;let e=this.annotationTool.deserialize([t])[0];switch(e.type){case"rectangle":{let r=e;return{x:Math.min(r.x,r.x+r.width),y:Math.min(r.y,r.y+r.height),width:Math.abs(r.width),height:Math.abs(r.height)}}case"image":{let r=e;return{x:Math.min(r.x,r.x+r.width),y:Math.min(r.y,r.y+r.height),width:Math.abs(r.width),height:Math.abs(r.height)}}case"selection":{let r=e;return{x:Math.min(r.x,r.x+r.width),y:Math.min(r.y,r.y+r.height),width:Math.abs(r.width),height:Math.abs(r.height)}}case"circle":{let r=e;return{x:r.x-r.radius,y:r.y-r.radius,width:r.radius*2,height:r.radius*2}}case"line":{let r=e,a=Math.min(r.x1,r.x2),c=Math.min(r.y1,r.y2),l=Math.max(r.x1,r.x2),s=Math.max(r.y1,r.y2);return{x:a,y:c,width:l-a||10,height:s-c||10}}case"arrow":{let r=e,a=Math.min(r.x1,r.x2),c=Math.min(r.y1,r.y2),l=Math.max(r.x1,r.x2),s=Math.max(r.y1,r.y2);return{x:a,y:c,width:l-a||10,height:s-c||10}}case"curve":{let r=e;if(!r.points||r.points.length===0)return null;let a=1/0,c=1/0,l=-1/0,s=-1/0;for(let h of r.points)a=Math.min(a,h.x),c=Math.min(c,h.y),l=Math.max(l,h.x),s=Math.max(s,h.y);return{x:a,y:c,width:l-a||10,height:s-c||10}}case"text":{let r=e;if(!r.text)return null;let c=16+((n=t.lineWidth)!=null?n:1)*.5,l=r.text.length*c*.6;return{x:r.x,y:r.y-c,width:l||50,height:c*1.2}}default:return null}}drawResizeHandles(){let t=this.getSelectedShape();if(!t)return;let e=this.getShapeBounds(t);if(!e)return;let n=this.annotationTool.ctx,r=this.handleSize,a=r/2,c=[{pos:"nw",x:e.x,y:e.y},{pos:"n",x:e.x+e.width/2,y:e.y},{pos:"ne",x:e.x+e.width,y:e.y},{pos:"e",x:e.x+e.width,y:e.y+e.height/2},{pos:"se",x:e.x+e.width,y:e.y+e.height},{pos:"s",x:e.x+e.width/2,y:e.y+e.height},{pos:"sw",x:e.x,y:e.y+e.height},{pos:"w",x:e.x,y:e.y+e.height/2}];n.save(),n.strokeStyle="#5b9fff",n.lineWidth=1,n.setLineDash([4,4]),n.strokeRect(e.x,e.y,e.width,e.height),n.setLineDash([]),n.fillStyle="#ffffff",n.strokeStyle="#5b9fff",n.lineWidth=1;for(let l of c)n.fillRect(l.x-a,l.y-a,r,r),n.strokeRect(l.x-a,l.y-a,r,r);n.restore(),this.drawRotationHandles(e)}getShapeRotationCenter(t,e){return t.rotationCenterX!==void 0&&t.rotationCenterY!==void 0?{x:t.rotationCenterX*this.annotationTool.canvasWidth,y:t.rotationCenterY*this.annotationTool.canvasHeight}:{x:e.x+e.width/2,y:e.y+e.height/2}}drawRotationHandles(t){var h;let e=this.getSelectedShape();if(!e)return;let n=this.annotationTool.ctx,r=this.getShapeRotationCenter(e,t),a=(h=e.rotation)!=null?h:0,c=r.x+Math.sin(a)*this.rotationHandleDistance,l=r.y-Math.cos(a)*this.rotationHandleDistance;n.save(),n.beginPath(),n.strokeStyle="#5b9fff",n.lineWidth=1,n.setLineDash([]),n.moveTo(r.x,r.y),n.lineTo(c,l),n.stroke();let s=6;n.beginPath(),n.strokeStyle="#5b9fff",n.lineWidth=1.5,n.moveTo(r.x-s,r.y),n.lineTo(r.x+s,r.y),n.moveTo(r.x,r.y-s),n.lineTo(r.x,r.y+s),n.stroke(),n.beginPath(),n.fillStyle="#ffffff",n.strokeStyle="#5b9fff",n.lineWidth=1.5,n.arc(r.x,r.y,4,0,Math.PI*2),n.fill(),n.stroke(),n.beginPath(),n.fillStyle="#ffffff",n.strokeStyle="#5b9fff",n.lineWidth=1.5,n.arc(c,l,6,0,Math.PI*2),n.fill(),n.stroke(),n.beginPath(),n.strokeStyle="#5b9fff",n.lineWidth=1,n.arc(c,l,3,-Math.PI*.7,Math.PI*.5),n.stroke(),n.restore()}isPointerAtRotationHandle(t,e){var m;let n=this.getSelectedShape();if(!n)return!1;let r=this.getShapeBounds(n);if(!r)return!1;let a=this.getShapeRotationCenter(n,r),c=(m=n.rotation)!=null?m:0,l=a.x+Math.sin(c)*this.rotationHandleDistance,s=a.y-Math.cos(c)*this.rotationHandleDistance,h=t-l,u=e-s;return Math.sqrt(h*h+u*u)<=12}isPointerAtRotationCenter(t,e){let n=this.getSelectedShape();if(!n)return!1;let r=this.getShapeBounds(n);if(!r)return!1;let a=this.getShapeRotationCenter(n,r),c=t-a.x,l=e-a.y;return Math.sqrt(c*c+l*l)<=10}calculateAngle(t,e,n,r){return Math.atan2(n-t,-(r-e))}getHandleAtPosition(t,e){let n=this.getSelectedShape();if(!n)return null;let r=this.getShapeBounds(n);if(!r)return null;let c=(this.handleSize+4)/2,l=[{pos:"nw",x:r.x,y:r.y},{pos:"n",x:r.x+r.width/2,y:r.y},{pos:"ne",x:r.x+r.width,y:r.y},{pos:"e",x:r.x+r.width,y:r.y+r.height/2},{pos:"se",x:r.x+r.width,y:r.y+r.height},{pos:"s",x:r.x+r.width/2,y:r.y+r.height},{pos:"sw",x:r.x,y:r.y+r.height},{pos:"w",x:r.x,y:r.y+r.height/2}];for(let s of l)if(t>=s.x-c&&t<=s.x+c&&e>=s.y-c&&e<=s.y+c)return s.pos;return null}getCursorForHandle(t){return{nw:"nw-resize",n:"n-resize",ne:"ne-resize",e:"e-resize",se:"se-resize",s:"s-resize",sw:"sw-resize",w:"w-resize"}[t]}resizeShape(t,e,n,r,a,c=!1){var y;if(!this.resizeOriginalShape)return;let l=this.annotationTool.deserialize([this.resizeOriginalShape])[0],s=a.x,h=a.y,u=a.width,p=a.height;switch(e){case"nw":s+=n,h+=r,u-=n,p-=r;break;case"n":h+=r,p-=r;break;case"ne":h+=r,u+=n,p-=r;break;case"e":u+=n;break;case"se":u+=n,p+=r;break;case"s":p+=r;break;case"sw":s+=n,u-=n,p+=r;break;case"w":s+=n,u-=n;break}if(c&&a.width>0&&a.height>0){let g=a.width/a.height;if(e==="n"||e==="s"){let x=p*g,C=x-u;u=x,s-=C/2}else if(e==="e"||e==="w"){let x=u/g,C=x-p;p=x,h-=C/2}else{let x=u/a.width,C=p/a.height,R=Math.max(Math.abs(x),Math.abs(C)),$=x>=0?1:-1,F=C>=0?1:-1,A=a.width*R*$,w=a.height*R*F;e==="nw"?(s=a.x+a.width-A,h=a.y+a.height-w):e==="ne"?h=a.y+a.height-w:e==="sw"&&(s=a.x+a.width-A),u=A,p=w}}let m=10;u<m&&(e.includes("w")&&(s=a.x+a.width-m),u=m),p<m&&(e.includes("n")&&(h=a.y+a.height-m),p=m);let f=a.width>0?u/a.width:1,v=a.height>0?p/a.height:1;switch(l.type){case"rectangle":{let g=t;g.x=s/this.annotationTool.canvasWidth,g.y=h/this.annotationTool.canvasHeight,g.width=u/this.annotationTool.canvasWidth,g.height=p/this.annotationTool.canvasHeight;break}case"selection":{let g=t;g.x=s/this.annotationTool.canvasWidth,g.y=h/this.annotationTool.canvasHeight,g.width=u/this.annotationTool.canvasWidth,g.height=p/this.annotationTool.canvasHeight;break}case"circle":{let g=t,x=Math.min(u,p)/2,C=s+u/2,R=h+p/2;g.x=C/this.annotationTool.canvasWidth,g.y=R/this.annotationTool.canvasHeight,g.radius=x/this.annotationTool.canvasWidth;break}case"line":{let g=t,x=l,C=(x.x1-a.x)*f+s,R=(x.y1-a.y)*v+h,$=(x.x2-a.x)*f+s,F=(x.y2-a.y)*v+h;g.x1=C/this.annotationTool.canvasWidth,g.y1=R/this.annotationTool.canvasHeight,g.x2=$/this.annotationTool.canvasWidth,g.y2=F/this.annotationTool.canvasHeight;break}case"arrow":{let g=t,x=l,C=(x.x1-a.x)*f+s,R=(x.y1-a.y)*v+h,$=(x.x2-a.x)*f+s,F=(x.y2-a.y)*v+h;g.x1=C/this.annotationTool.canvasWidth,g.y1=R/this.annotationTool.canvasHeight,g.x2=$/this.annotationTool.canvasWidth,g.y2=F/this.annotationTool.canvasHeight;break}case"curve":{let g=t,x=l;if(!x.points||x.points.length===0)break;g.points=x.points.map(C=>({x:((C.x-a.x)*f+s)/this.annotationTool.canvasWidth,y:((C.y-a.y)*v+h)/this.annotationTool.canvasHeight}));break}case"text":{let g=t,x=l,R=16+((y=this.resizeOriginalShape.lineWidth)!=null?y:1)*.5,$=(x.x-a.x)*f+s,F=(x.y-a.y)*v+h;g.x=$/this.annotationTool.canvasWidth,g.y=F/this.annotationTool.canvasHeight;let A=(f+v)/2,w=R*A;g.lineWidth=Math.max(1,(w-16)*2);break}case"image":{let g=t;g.x=s/this.annotationTool.canvasWidth,g.y=h/this.annotationTool.canvasHeight,g.width=u/this.annotationTool.canvasWidth,g.height=p/this.annotationTool.canvasHeight;break}}}deleteSelectedShape(){this.selectedShapeIndex<0||this.selectedShapeIndex>=this.annotationTool.shapes.length||(this.annotationTool.undoStack.push([...this.annotationTool.shapes]),this.annotationTool.shapes.splice(this.selectedShapeIndex,1),this.selectedShapeIndex=-1,this.shapeIndex=-1,this.annotationTool.redrawFullCanvas())}onPointerDown(t){var s;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);if(this.selectedShapeIndex>=0&&this.isPointerAtRotationHandle(e,n)){let h=this.getSelectedShape();if(h){let u=this.getShapeBounds(h);if(u){let p=this.getShapeRotationCenter(h,u);this.rotationActive=!0,this.rotationStartAngle=this.calculateAngle(p.x,p.y,e,n),this.rotationShapeStartAngle=(s=h.rotation)!=null?s:0,this.isDrawing=!0,this.annotationTool.undoStack.push([...this.annotationTool.shapes]),this.annotationTool.canvas.style.cursor="grabbing";return}}}if(this.selectedShapeIndex>=0&&this.isPointerAtRotationCenter(e,n)){this.centerDragActive=!0,this.startX=e,this.startY=n,this.isDrawing=!0,this.annotationTool.undoStack.push([...this.annotationTool.shapes]),this.annotationTool.canvas.style.cursor="move";return}let r=this.getHandleAtPosition(e,n);if(r&&this.selectedShapeIndex>=0){this.activeHandle=r,this.startX=e,this.startY=n,this.isDrawing=!0;let h=this.getSelectedShape();h&&(this.resizeStartBounds=this.getShapeBounds(h),this.resizeOriginalShape=this.cloneShape(h),this.annotationTool.undoStack.push([...this.annotationTool.shapes])),this.annotationTool.canvas.style.cursor=this.getCursorForHandle(r);return}let a=this.annotationTool.shapes,c=a.slice().reverse(),l=!1;for(let h of c)if(this.isPointerAtShape(h,e,n)){this.shape=this.cloneShape(h),this.shapeIndex=a.indexOf(h),this.selectedShapeIndex=this.shapeIndex,l=!0;break}l||(this.selectedShapeIndex=-1,this.annotationTool.redrawFullCanvas()),this.shape&&(this.lastDrawnShape=null,this.startX=e,this.startY=n,this.isDrawing=!0,this.isScale=this.shape.type==="image"?this.isPointerAtCorner(this.shape,e,n):!1,this.isScale?this.annotationTool.canvas.style.cursor="nw-resize":this.annotationTool.canvas.style.cursor="move")}isPointerAtShape(t,e,n){let r=this.annotationTool.deserialize([t])[0];if(r.rotation){let c=this.getShapeBounds(t);if(c){let l=this.getShapeRotationCenter(t,c),s=Math.cos(-r.rotation),h=Math.sin(-r.rotation),u=e-l.x,p=n-l.y;e=l.x+u*s-p*h,n=l.y+u*h+p*s}}return this.annotationTool.pluginForTool(r.type).isPointerAtShape(r,e,n)}isPointerAtCorner(t,e,n){if(!("type"in t))return!1;let r=this.annotationTool.deserialize([t])[0],a=15,c=Math.abs(r.y-n)<a,l=Math.abs(r.x-e)<a,s=Math.abs(r.x+r.width-e)<a,h=Math.abs(r.y+r.height-n)<a;return c&&l||c&&s||h&&l||h&&s}onPointerMove(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);if(this.isDrawing&&this.rotationActive){let s=this.annotationTool.shapes[this.selectedShapeIndex];if(s){let h=this.getShapeBounds(s);if(h){let u=this.getShapeRotationCenter(s,h),p=this.calculateAngle(u.x,u.y,e,n),m=this.rotationShapeStartAngle+(p-this.rotationStartAngle);if(t.shiftKey){let f=Math.PI/12;m=Math.round(m/f)*f}s.rotation=m,this.annotationTool.redrawFullCanvas()}}return}if(this.isDrawing&&this.centerDragActive){let s=this.annotationTool.shapes[this.selectedShapeIndex];s&&(s.rotationCenterX=e/this.annotationTool.canvasWidth,s.rotationCenterY=n/this.annotationTool.canvasHeight,this.annotationTool.redrawFullCanvas());return}if(this.isDrawing&&this.activeHandle&&this.resizeStartBounds){let s=e-this.startX,h=n-this.startY,u=this.annotationTool.shapes[this.selectedShapeIndex];u&&(this.resizeShape(u,this.activeHandle,s,h,this.resizeStartBounds,t.shiftKey),this.annotationTool.redrawFullCanvas());return}if(!this.isDrawing&&this.selectedShapeIndex>=0){if(this.isPointerAtRotationHandle(e,n)){this.annotationTool.canvas.style.cursor="grab";return}if(this.isPointerAtRotationCenter(e,n)){this.annotationTool.canvas.style.cursor="move";return}let s=this.getHandleAtPosition(e,n);if(s){this.annotationTool.canvas.style.cursor=this.getCursorForHandle(s);return}}if(!this.isDrawing||!this.shape){this.isDrawing||(this.annotationTool.canvas.style.cursor="default");return}let r=e-this.startX,a=n-this.startY;this.startX=e-r,this.startY=n-a;let c=this.annotationTool.deserialize([this.shape])[0],l=c.type==="image"?c:JSON.parse(JSON.stringify(c));if(l.type!=="audio-peaks")if(l.type==="image")if(this.isScale){let{width:s,height:h}=l,u=s/h,p=s+r,m=p/u;l.width=p,l.height=m,this.lastDrawnShape=l,this.annotationTool.pluginForTool(l.type).draw(l)}else{let s=this.annotationTool.pluginForTool(l.type).move(l,r,a);this.lastDrawnShape=s,this.annotationTool.pluginForTool(l.type).draw(s)}else{let s=this.annotationTool.pluginForTool(l.type).move(l,r,a);this.lastDrawnShape=s,this.annotationTool.pluginForTool(l.type).draw(s)}}onPointerUp(t){if(this.rotationActive){this.rotationActive=!1,this.isDrawing=!1,this.annotationTool.canvas.style.cursor="default",this.annotationTool.redrawFullCanvas();return}if(this.centerDragActive){this.centerDragActive=!1,this.isDrawing=!1,this.annotationTool.canvas.style.cursor="default",this.annotationTool.redrawFullCanvas();return}if(this.activeHandle){this.activeHandle=null,this.resizeStartBounds=null,this.resizeOriginalShape=null,this.isDrawing=!1,this.annotationTool.canvas.style.cursor="default",this.annotationTool.redrawFullCanvas();return}if(!this.isDrawing||!this.lastDrawnShape){this.isDrawing=!1,this.annotationTool.redrawFullCanvas();return}this.lastDrawnShape&&this.shape&&(this.lastDrawnShape.fillStyle=this.shape.fillStyle,this.lastDrawnShape.strokeStyle=this.shape.strokeStyle,this.lastDrawnShape.lineWidth=this.shape.lineWidth,this.shape.opacity!==void 0&&(this.lastDrawnShape.opacity=this.shape.opacity),this.save(this.lastDrawnShape)),this.isDrawing=!1,this.isScale=!1,this.shape=null,this.lastDrawnShape=null,this.annotationTool.canvas.style.cursor="default",this.annotationTool.redrawFullCanvas()}draw(){throw new Error("Method not implemented.")}reset(){this.isDrawing=!1,this.shape=null,this.isScale=!1,this.lastDrawnShape=null,this.shapeIndex=-1,this.selectedShapeIndex=-1,this.activeHandle=null,this.resizeStartBounds=null,this.resizeOriginalShape=null,this.rotationActive=!1,this.centerDragActive=!1,this.annotationTool.canvas.style.cursor="default"}save(t){this.annotationTool.replaceShape(t,this.shapeIndex)}};var Pt=class extends P{constructor(){super(...arguments);this.name="image"}move(t,e,n){return t.x+=e,t.y+=n,t}onPointerDown(t){}onPointerMove(t){}onPointerUp(t){}normalize(t,e,n){return L(I({},t),{x:t.x/e,y:t.y/n,width:t.width/e,height:t.height/n})}draw(t){if(!(t.image instanceof HTMLImageElement)){console.error("Image is not an instance of HTMLImageElement");return}if(t.width===0||t.height===0)return;let e=t.x+t.width/2,n=t.y+t.height/2,r=this.getRotationCenter(t,e,n),a=this.applyRotation(t,r.x,r.y);this.ctx.drawImage(t.image,t.x,t.y,t.width,t.height),a&&this.restoreRotation()}isPointerAtShape(t,e,n){let r=Math.min(t.x,t.x+t.width),a=Math.max(t.x,t.x+t.width),c=Math.min(t.y,t.y+t.height),l=Math.max(t.y,t.y+t.height);return e>=r&&e<=a&&n>=c&&n<=l}};var Rt=class extends P{constructor(){super(...arguments);this.name="compare";this.comparisonLine=0;this.leftOpacity=1;this.isDrawing=!1}get rightOpacity(){return this.annotationTool.overlayOpacity}move(t,e,n){return t.x+=e,t}onActivate(){this.comparisonLine=this.annotationTool.canvasWidth/2,this.leftOpacity=1,this.annotationTool.canvas.style.cursor="col-resize"}onDeactivate(){this.annotationTool.canvas.style.cursor="default",this.comparisonLine=0,this.leftOpacity=1,this.isDrawing=!1}normalize(t,e,n){return L(I({},t),{x:t.x/e})}onPointerDown(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.startX=e,this.startY=n,this.isDrawing=!0,this.disablePreviousCompare(),this.onPointerMove(t)}onPointerMove(t){if(!this.isDrawing){if(this.annotationTool.globalShapes.length>0){let r=this.annotationTool.globalShapes[0];if(r.type==="compare"){let a=this.annotationTool.deserialize([r])[0];this.draw(a),this.annotationTool.addFrameSquareOverlay()}}return}let{x:e}=this.annotationTool.getRelativeCoords(t);this.comparisonLine=e;let n={type:"compare",strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth,x:e};this.draw(n),this.drawDelimiter(n)}onPointerUp(){this.isDrawing&&(this.save({type:"compare",strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth,disabled:!1,x:this.comparisonLine}),this.isDrawing=!1)}removePreviousCompare(){this.annotationTool.globalShapes=this.annotationTool.globalShapes.filter(t=>t.type!=="compare")}disablePreviousCompare(){this.annotationTool.globalShapes=this.annotationTool.globalShapes.map(t=>t.type==="compare"?L(I({},t),{disabled:!0}):t)}save(t){this.removePreviousCompare();let e=this.annotationTool.serialize([t])[0];e.x<.05||e.x>.95||this.annotationTool.addGlobalShape(e)}drawDelimiter(t){this.ctx.beginPath(),this.ctx.moveTo(t.x,0),this.ctx.lineTo(t.x,this.annotationTool.canvasWidth),this.ctx.stroke()}drawShape(t){var ft,ie,re,ae,se,le,ce,he;let e=this.annotationTool.videoElement,n=this.annotationTool.referenceVideoElement;if(!e||!n)return;let r=this.ctx.globalAlpha,a=this.annotationTool.canvasWidth,c=this.annotationTool.canvasHeight,l=t.x,s=n.videoHeight-e.videoHeight,h=n.videoWidth-e.videoWidth,u=this.annotationTool.isMobile;this.ctx.globalAlpha=this.leftOpacity;let p=(ie=(ft=this.annotationTool.referenceVideoFrameBuffer)==null?void 0:ft.frameNumberFromTime(e.currentTime))!=null?ie:1,m=p;if(h>e.videoWidth&&s>e.videoHeight&&!this.annotationTool.isMobile){let N=(le=(se=this.annotationTool.referenceVideoFrameBuffer)==null?void 0:se.getFrameNumberBySignature((ae=(re=this.annotationTool.videoFrameBuffer)==null?void 0:re.getAudioFingerprint(p))!=null?ae:null,p))!=null?le:p,at=Math.abs(p-N);at>=1&&at<=3&&(m=N)}let v=(ce=this.annotationTool.referenceVideoFrameBuffer)==null?void 0:ce.getFrame(m),y=(he=this.annotationTool.videoFrameBuffer)==null?void 0:he.getFrame(p);if(u){this.ctx.imageSmoothingQuality="low";let N=l/a,at=l;this.ctx.drawImage(y!=null?y:e,0,0,N*e.videoWidth,e.videoHeight,0,0,at,c)}else{let N=y?y.width:e.videoWidth,at=y?y.height:e.videoHeight;this.ctx.drawImage(y!=null?y:e,0,0,N,at,0,0,a,c)}this.ctx.globalAlpha=this.rightOpacity;let g=0,x=0,C=e.videoWidth/e.videoHeight,R=n.videoWidth/n.videoHeight,F=Math.abs(C-R)>.1,A=10,w=Math.abs(s)>A,E=e.videoWidth,T=e.videoHeight,b=0;if(h<-A)if(F){let N=e.videoWidth/a;b=Math.abs(h/2),b=b/N,b<=A&&(b=0)}else E=n.videoWidth;else h>A&&(E=n.videoWidth);if(s===0)g=0;else if(s>0)F?(g=s/2,g<=A&&(g=0)):T=w?n.videoHeight:e.videoHeight;else if(!F)T=w?n.videoHeight:e.videoHeight;else{x=Math.abs(s/2);let N=e.videoHeight/c;x=x/N,x<=A&&(x=0)}let D=l-b,O=a-D,W=O/a*E;v&&this.rightOpacity>0&&(u&&(this.ctx.imageSmoothingQuality="low"),this.ctx.drawImage(v,D/a*E,g,W,T,D+b,x,O,c)),this.ctx.globalAlpha=r}draw(t){if(t.disabled)return;let e=this.annotationTool.videoElement,n=this.annotationTool.referenceVideoElement;!e||!n||this.drawShape(t)}};function Un(i){let o=i[0],t=i[0];for(let e=1;e<i.length;e++)i[e]<o&&(o=i[e]),i[e]>t&&(t=i[e]);return[o,t]}var Lt=class extends P{constructor(t){super(t);this.name="audio-peaks";this.canvas=document.createElement("canvas");this.props={peaks:new Int8Array,theme:{waveOutlineColor:"rgba(255,192,203,0.7)",waveFillColor:"grey",waveProgressColor:"orange"},waveHeight:40,bits:16};this.drawCtx=this.canvas.getContext("2d")}onVideoBlobSet(t){return M(this,null,function*(){let e=yield t.arrayBuffer();this.init(e)})}on(t,e){t==="videoBlobSet"&&this.onVideoBlobSet(e)}extractPeaks(t){return M(this,null,function*(){let{default:e}=yield Promise.resolve().then(()=>kn(_e(),1)),n=this.progressBarCoordinates.width,r=Math.ceil(t.length/n);return e(t,r,!0)})}setProps(t){let[e,n]=Un(t.data[0]),r=Math.pow(2,t.bits-1)-1,a=-Math.pow(2,t.bits-1);this.props.peaks=t.data[0].map(c=>c<0?Math.round(c/e*a):Math.round(c/n*r)),this.props.bits=t.bits}init(t){return M(this,null,function*(){try{let n=yield new AudioContext().decodeAudioData(t),r=yield this.extractPeaks(n);this.initCanvas(),this.setProps(r),this.annotationTool.removeGlobalShape("audio-peaks"),this.annotationTool.addGlobalShape({x:0,y:0,strokeStyle:"red",fillStyle:"red",lineWidth:1,type:"audio-peaks"}),this.clearLocalCanvas(),this.drawOnCanvas()}catch(e){this.initCanvas(),this.props.peaks=new Int8Array,this.annotationTool.removeGlobalShape("audio-peaks"),this.clearLocalCanvas(),console.error(e)}})}initCanvas(){this.canvas.width=this.progressBarCoordinates.width*this.pixelRatio,this.canvas.height=this.props.waveHeight*this.pixelRatio,this.drawCtx.scale(this.pixelRatio,this.pixelRatio)}move(t,e,n){return t.x+=e,t.y+=n,t}normalize(t,e,n){return L(I({},t),{x:t.x/e,y:t.y/n})}onPointerDown(t){}onPointerMove(t){}onPointerUp(t){}reset(){this.clearLocalCanvas(),this.props.peaks=new Int8Array,this.annotationTool.removeGlobalShape("audio-peaks")}draw(t){let e=this.annotationTool.videoElement;if(!e||e.tagName!=="VIDEO"||e.muted||e.volume===0)return;this.ctx.clearRect(0,0,this.annotationTool.canvasWidth,this.annotationTool.canvasHeight);let{waveHeight:r,theme:a}=this.props,c=this.ctx,l=r/2,s=this.progressBarCoordinates.y-20,{x:h,width:u}=this.progressBarCoordinates,p=this.annotationTool.playbackFrame,m=this.annotationTool.totalFrames,f=Math.ceil(p/m*u)+h;this.ctx.drawImage(this.canvas,h,s,u,r),c.fillStyle=a.waveProgressColor,c.fillRect(f,s+0,1,l*2)}get pixelRatio(){return this.annotationTool.pixelRatio}get progressBarCoordinates(){return this.annotationTool.progressBarCoordinates}clearLocalCanvas(){this.drawCtx.clearRect(0,0,this.canvas.width,this.canvas.height)}drawOnCanvas(){let{peaks:t,bits:e,waveHeight:n,theme:r}=this.props,a=this.drawCtx,c=0,l=0,s=n/2,h=U(2,e-1),u=0,p=t.length;a.fillStyle=r.waveOutlineColor;for(let m=0;m<p;m+=1){let f=t[(m+c)*2+1]/h,v=Math.abs(f*s);a.fillRect(m+l,u+0+s-v,1,v)}}};var Dt=class extends P{constructor(){super(...arguments);this.name="selection";this.selectedArea=null}move(t,e,n){return t.x+=e,t.y+=n,t}normalize(t,e,n){return L(I({},t),{x:t.x/e,y:t.y/n,width:t.width/e,height:t.height/n})}onPointerDown(t){let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.startX=e,this.startY=n,this.isDrawing=!0,this.selectedArea=null}onPointerMove(t){if(!this.isDrawing)return;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t);this.annotationTool.clearCanvas(),this.annotationTool.globalShapes.length>0?this.annotationTool.drawShapesOverlay():this.annotationTool.addVideoOverlay(),this.drawSelectionRect(this.startX,this.startY,e-this.startX,n-this.startY)}onPointerUp(t){if(!this.isDrawing)return;let{x:e,y:n}=this.annotationTool.getRelativeCoords(t),r=Math.min(e,this.startX),a=Math.min(n,this.startY),c=Math.abs(e-this.startX),l=Math.abs(n-this.startY);if(c<1||l<1){this.isDrawing=!1,this.annotationTool.redrawFullCanvas();return}let s=document.createElement("canvas"),h=s.getContext("2d"),u=this.annotationTool.videoElement;if(!(u instanceof HTMLVideoElement))return;let p=u.videoWidth/u.videoHeight,m=this.annotationTool.canvasWidth/this.annotationTool.canvasHeight,f=this.annotationTool.canvasWidth,v=this.annotationTool.canvasHeight,y=0,g=0;p>m?(v=this.annotationTool.canvasWidth/p,g=(this.annotationTool.canvasHeight-v)/2):(f=this.annotationTool.canvasHeight*p,y=(this.annotationTool.canvasWidth-f)/2);let x=u.videoWidth/f,C=u.videoHeight/v,R=(r-y)*x,$=(a-g)*C,F=c*x,A=l*C;s.width=Math.max(1,F),s.height=Math.max(1,A);try{h.drawImage(this.annotationTool.videoElement,R,$,F,A,0,0,F,A);let w=h.getImageData(0,0,s.width,s.height);this.selectedArea=w;let E=document.createElement("canvas");E.width=F+4,E.height=A+4,E.style.width=`${c+4}px`,E.style.height=`${l+4}px`;let T=E.getContext("2d");T.strokeStyle="black",T.lineWidth=2,T.strokeRect(1,1,F+2,A+2),T.strokeStyle="black",T.lineWidth=2,T.strokeRect(2,2,F,A),T.putImageData(w,2,2);let b=new Image;b.onload=()=>{this.annotationTool.pluginForTool("image").save({type:"image",x:r-2,y:a-2,width:c+4,height:l+4,image:b,strokeStyle:"transparent",fillStyle:"transparent",lineWidth:0}),this.isDrawing=!1,this.selectedArea=null,this.annotationTool.redrawFullCanvas()},b.src=E.toDataURL(),this.annotationTool.currentTool="move"}catch(w){console.error("Error capturing selection:",w),this.isDrawing=!1,this.annotationTool.redrawFullCanvas();return}}drawSelectionRect(t,e,n,r){var m,f,v;let a=Math.min(t,t+n),c=Math.min(e,e+r),l=Math.abs(n),s=Math.abs(r),h=this.annotationTool.pixelRatio,u=null;if(l>0&&s>0)try{u=this.ctx.getImageData(a*h,c*h,l*h,s*h)}catch(y){u=null}if(this.ctx.fillStyle="rgba(0, 0, 0, 0.5)",this.ctx.fillRect(0,0,this.annotationTool.canvasWidth,this.annotationTool.canvasHeight),u&&l>0&&s>0)this.ctx.putImageData(u,a*h,c*h);else if(l>0&&s>0){let y=this.annotationTool.videoElement;if(y instanceof HTMLVideoElement){let g=(m=this.annotationTool.videoFrameBuffer)==null?void 0:m.frameNumberFromTime(y.currentTime),x=(v=(f=this.annotationTool.videoFrameBuffer)==null?void 0:f.getFrame(g||0))!=null?v:y,C=x?x.width:y.videoWidth,R=x?x.height:y.videoHeight,$=C/this.annotationTool.canvasWidth,F=R/this.annotationTool.canvasHeight;this.ctx.drawImage(x,a*$,c*F,l*$,s*F,a,c,l,s)}}this.ctx.beginPath();let p=this.ctx.strokeStyle;this.ctx.strokeStyle="#ffffff",this.ctx.lineWidth=2,this.ctx.setLineDash([5,5]),this.ctx.strokeRect(a,c,l,s),this.ctx.setLineDash([]),this.ctx.strokeStyle=p}draw(t){this.drawSelectionRect(t.x,t.y,t.width,t.height)}reset(){super.reset(),this.selectedArea=null}isPointerAtShape(t,e,n){let r=Math.min(t.x,t.x+t.width),a=Math.max(t.x,t.x+t.width),c=Math.min(t.y,t.y+t.height),l=Math.max(t.y,t.y+t.height);return e>=r&&e<=a&&n>=c&&n<=l}};var Ge=[bt,wt,Et,It,kt,Mt,Ct,Ft,Pt,Rt,Lt,Dt];function qe(i,o){let t,e,n,r=[],a=!0,c=!1;function l(u,p){if(c)return;let m=Math.abs(p.mediaTime-t),f=Math.abs(p.presentedFrames-e),v=m/f;v&&v<1&&a&&r.length<50&&i.playbackRate===1&&document.hasFocus()&&(r.push(v),n=Math.round(1/h()),o(n,r.length*2)),a=!0,t=p.mediaTime,e=p.presentedFrames,c||i.requestVideoFrameCallback(l)}i.requestVideoFrameCallback(l);let s=()=>{r.pop(),a=!1};i.addEventListener("seeked",s);function h(){return r.reduce((u,p)=>u+p)/r.length}return()=>{c=!0,i.removeEventListener("seeked",s)}}var Ot=class Ot extends Array{constructor(...o){super(...o),this.id=Ot.nextId++}};Ot.nextId=0;var Gt=Ot,Ke=new Map;function jn(i,o){return`${Math.min(i.id,o.id)}-${Math.max(i.id,o.id)}`}function qt(i,o){let t=jn(i,o),e=Ke.get(t);if(e!==void 0)return e;if(i.length===0||o.length===0)return 0;let n=Math.min(i.length,o.length),r=0,a=0;for(let p=0;p<n;p++)r+=i[p],a+=o[p];r/=n,a/=n;let c=0,l=0,s=0;for(let p=0;p<n;p++){let m=i[p]-r,f=o[p]-a;c+=m*f,l+=m*m,s+=f*f}let h=Math.sqrt(l*s),u=h===0?0:(c/h+1)/2;return Ke.set(t,u),u}var Je=128,$t=class{constructor(o,t){this.video=o;this.fps=t;this.audioContext=null;this.audioBuffer=null;this.fingerprints=new Map;this.isInitialized=!1;this.initPromise=null}init(){return M(this,null,function*(){if(!this.isInitialized)return this.initPromise?this.initPromise:(this.initPromise=this.doInit(),this.initPromise)})}doInit(){return M(this,null,function*(){try{let e=yield(yield(yield fetch(this.video.currentSrc||this.video.src)).blob()).arrayBuffer();this.audioContext=new AudioContext,this.audioBuffer=yield this.audioContext.decodeAudioData(e),this.isInitialized=!0}catch(o){console.warn("Could not extract audio for fingerprinting:",o),this.isInitialized=!0,this.audioBuffer=null}})}hasAudio(){return this.audioBuffer!==null}get totalFrames(){return Math.round(this.video.duration*this.fps)}extractFingerprint(o){if(!this.audioBuffer)return null;let t=(o-1)/this.fps,e=1/this.fps,n=this.audioBuffer.sampleRate,r=Math.floor(t*n),c=Math.floor((t+e)*n)-r;if(c<=0||r>=this.audioBuffer.length)return null;let l=this.audioBuffer.getChannelData(0),s=new Gt,h=Math.max(1,Math.floor(c/Je));for(let u=0;u<Je;u++){let p=r+u*h,m=Math.min(p+h,this.audioBuffer.length),f=0,v=0;for(let g=p;g<m;g++)g<l.length&&(f+=l[g]*l[g],v++);let y=v>0?Math.sqrt(f/v):0;s.push(y)}return s}getFingerprint(o){if(this.fingerprints.has(o))return this.fingerprints.get(o);let t=this.extractFingerprint(o);return t&&this.fingerprints.set(o,t),t}extractRange(o,t){for(let e=o;e<=t;e++)this.getFingerprint(e)}setFingerprint(o,t){this.fingerprints.set(o,t)}findBestMatch(o,t,e=3){if(!o||!(this.fingerprints.size>0)&&!this.hasAudio())return t;let r=0,a=t,c=Math.max(1,t-e),l=Math.min(this.totalFrames,t+e);for(let s=c;s<=l;s++){let h=this.getFingerprint(s);if(h){let u=qt(o,h);u>r&&(r=u,a=s)}}return a}destroy(){this.fingerprints.clear(),this.audioContext&&(this.audioContext.close().catch(()=>{}),this.audioContext=null),this.audioBuffer=null,this.isInitialized=!1,this.initPromise=null}};var Ze=64,J=class{constructor(o,t,e=!0){this.isDestroyed=!1;this.autoHide=!0;this.isMobile=!1;this.audioExtractor=null;this.audioInitPromise=null;this.seenFrames=0;this.isCanvasSizeSet=!1;this.frames=new Map;this.audioFingerprints=new Map;this.video=o,this.fps=t,this.autoHide=e,this.createCanvas(),this.createTransformCanvas()}createTransformCanvas(){this.transformCanvas=document.createElement("canvas"),this.transformCanvasCtx=this.canvas.getContext("2d",{willReadFrequently:!0,alpha:!1}),this.transformCanvas.width=Ze,this.transformCanvas.height=Ze}initAudioSync(){return M(this,null,function*(){var o;return this.audioExtractor?(o=this.audioInitPromise)!=null?o:Promise.resolve():(this.audioExtractor=new $t(this.video,this.fps),this.audioInitPromise=this.audioExtractor.init(),this.audioInitPromise)})}hasAudioSync(){var o,t;return(t=(o=this.audioExtractor)==null?void 0:o.hasAudio())!=null?t:!1}start(){this.addRequestFrameCallback(),this.isMobile||this.initAudioSync().catch(()=>{})}destroy(){this.isDestroyed=!0,this.frames.forEach(o=>o.close()),this.frames.clear(),this.audioFingerprints.clear(),this.audioExtractor&&(this.audioExtractor.destroy(),this.audioExtractor=null),this.audioInitPromise=null}tick(o,t){if(this.setCanvasSize(),t.expectedDisplayTime-performance.now()>10,this.isDestroyed)return!1;if(this.seenFrames>=this.totalFrames){if(this.autoHide)try{this.video.paused||this.video.pause(),this.video.style.display="none"}catch(c){}return!1}if(this.video.videoWidth===0||this.video.videoHeight===0)return!0;let n=this.video,r=this.frameNumberFromTime(t.mediaTime);if(!Math.max(1,t.presentedFrames>this.totalFrames?t.presentedFrames%this.totalFrames:t.presentedFrames))throw new Error("expectedFrame is 0");if(this.hasFrame(r))this.seenFrames++;else{this.ctx.drawImage(n,0,0,this.width,this.height,0,0,this.width,this.height);let c=this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height);createImageBitmap(c,0,0,this.width,this.height).then(l=>M(this,null,function*(){var s;if(this.setFrame(r,l),!this.isMobile&&((s=this.audioExtractor)!=null&&s.hasAudio())){let h=this.audioExtractor.getFingerprint(r);h&&this.setAudioFingerprint(r,h)}}))}return!0}addRequestFrameCallback(){this.isDestroyed||this.video.requestVideoFrameCallback((o,t)=>{this.tick(o,t)&&this.addRequestFrameCallback()})}createCanvas(){this.canvas=document.createElement("canvas"),this.ctx=this.canvas.getContext("2d",{willReadFrequently:!0,alpha:!1})}setCanvasSize(){this.isCanvasSizeSet||(this.canvas.width=this.video.videoWidth,this.canvas.height=this.video.videoHeight,this.isCanvasSizeSet=!0)}get width(){return this.video.videoWidth}get height(){return this.video.videoHeight}hasFrame(o){return this.frames.has(o)}getFrame(o){return this.frames.has(o)?this.frames.get(o):null}getFrameNumberBySignature(o,t){if(!o)return t;let e=0,n=t;return[t-3,t-2,t-1,t,t+1,t+2,t+3].filter(a=>a>0&&a<=this.totalFrames).forEach(a=>{let c=this.getAudioFingerprint(a);if(c){let l=qt(o,c);l>e&&(e=l,n=a)}}),n}setFrame(o,t){this.frames.set(o,t)}setAudioFingerprint(o,t){this.audioFingerprints.set(o,t)}getAudioFingerprint(o){var t;if(this.audioFingerprints.has(o))return this.audioFingerprints.get(o);if((t=this.audioExtractor)!=null&&t.hasAudio()){let e=this.audioExtractor.getFingerprint(o);if(e)return this.audioFingerprints.set(o,e),e}return null}get totalFrames(){return Math.round(this.video.duration*this.fps)}frameNumberFromTime(o){return Math.max(1,Math.round(o*this.fps))}};var Z={layout:"horizontal",mobile:{collapsibleToolbars:!0,gesturesEnabled:!0,autoCollapse:!0,breakpoint:960},theme:"dark",toolbar:{draggable:!1,sidebarPosition:"left",defaultTool:"curve"},features:{showThemeToggle:!0,showFullscreen:!0,showProgressBar:!0,showFrameCounter:!0}};function Qe(i){var o,t;return i?{layout:(o=i.layout)!=null?o:Z.layout,theme:(t=i.theme)!=null?t:Z.theme,mobile:I(I({},Z.mobile),i.mobile),toolbar:I(I({},Z.toolbar),i.toolbar),features:I(I({},Z.features),i.features)}:I({},Z)}var ut=class{constructor(o){this.tool=o;this.currentRenderer=null;this.rootElement=null;this.prefix=st()}getRootElement(){if(!this.rootElement){let o=this.tool.canvas;o!=null&&o.parentElement&&(this.rootElement=o.parentElement,this.rootElement.classList.add(`${this.prefix}-root`))}return this.rootElement}clearLayoutClasses(){let o=this.getRootElement();o&&o.classList.remove(`${this.prefix}-layout-horizontal`,`${this.prefix}-layout-vertical`,`${this.prefix}-layout-minimal`,`${this.prefix}-layout-bottom-dock`,`${this.prefix}-sidebar-right`)}setLayout(o,t){this.currentRenderer&&this.currentRenderer.cleanup(),this.clearLayoutClasses();let e=this.getRootElement();e&&(e.classList.add(`${this.prefix}-layout-${o}`),o==="vertical"&&(t==null?void 0:t.sidebarPosition)==="right"&&e.classList.add(`${this.prefix}-sidebar-right`)),this.currentRenderer=this.createRenderer(o),this.currentRenderer.apply(this.tool)}getCurrentLayout(){var o,t;return(t=(o=this.currentRenderer)==null?void 0:o.name)!=null?t:null}createRenderer(o){switch(o){case"horizontal":return new Kt;case"vertical":return new Jt;case"minimal":return new Zt;case"bottom-dock":return new Qt}}destroy(){this.currentRenderer&&(this.currentRenderer.cleanup(),this.currentRenderer=null),this.clearLayoutClasses(),this.rootElement=null}},Kt=class{constructor(){this.name="horizontal"}apply(o){}cleanup(){}},Jt=class{constructor(){this.name="vertical"}apply(o){}cleanup(){}},Zt=class{constructor(){this.name="minimal";this.dragState={isDragging:!1,startX:0,startY:0,offsetX:0,offsetY:0};this.container=null;this.boundHandlers={};this.prefix=st()}apply(o){var e;if(this.container=o.uiContainer,!this.container)return;this.boundHandlers.mousedown=this.handleMouseDown.bind(this),this.boundHandlers.mousemove=this.handleMouseMove.bind(this),this.boundHandlers.mouseup=this.handleMouseUp.bind(this),this.container.addEventListener("mousedown",this.boundHandlers.mousedown),document.addEventListener("mousemove",this.boundHandlers.mousemove),document.addEventListener("mouseup",this.boundHandlers.mouseup);let t=o.config;(e=t==null?void 0:t.toolbar)!=null&&e.position&&(this.container.style.left=`${t.toolbar.position.x}px`,this.container.style.top=`${t.toolbar.position.y}px`)}cleanup(){this.container&&this.boundHandlers.mousedown&&this.container.removeEventListener("mousedown",this.boundHandlers.mousedown),this.boundHandlers.mousemove&&document.removeEventListener("mousemove",this.boundHandlers.mousemove),this.boundHandlers.mouseup&&document.removeEventListener("mouseup",this.boundHandlers.mouseup),this.container&&(this.container.style.left="",this.container.style.top=""),this.container=null,this.boundHandlers={}}handleMouseDown(o){if(!this.container||o.target.closest("button, input"))return;this.dragState.isDragging=!0,this.dragState.startX=o.clientX,this.dragState.startY=o.clientY;let t=this.container.getBoundingClientRect();this.dragState.offsetX=t.left,this.dragState.offsetY=t.top,this.container.classList.add(`${this.prefix}-dragging`),o.preventDefault()}handleMouseMove(o){if(!this.dragState.isDragging||!this.container)return;let t=o.clientX-this.dragState.startX,e=o.clientY-this.dragState.startY;this.container.style.left=`${this.dragState.offsetX+t}px`,this.container.style.top=`${this.dragState.offsetY+e}px`}handleMouseUp(){this.container&&(this.dragState.isDragging=!1,this.container.classList.remove(`${this.prefix}-dragging`))}},Qt=class{constructor(){this.name="bottom-dock";this.movedElements=[];this.playerControls=null;this.divider=null;this.prefix=st()}apply(o){let t=o.uiContainer,e=o.playerControlsContainer;if(t&&e)for(this.playerControls=e,this.divider=document.createElement("div"),this.divider.classList.add(`${this.prefix}-divider`),t.appendChild(this.divider);e.firstChild;){let n=e.firstChild;this.movedElements.push(n),t.appendChild(n)}}cleanup(){if(this.playerControls)for(let o of this.movedElements)this.playerControls.appendChild(o);this.divider&&this.divider.parentNode&&this.divider.parentNode.removeChild(this.divider),this.movedElements=[],this.playerControls=null,this.divider=null}};var Ht=class{constructor(o,t=!0){this.container=o;this.autoCollapse=t;this.isCollapsed=!1;this.collapseButton=null;this.prefix=st()}init(){this.container.classList.add(`${this.prefix}-collapsible`),this.createCollapseButton()}createCollapseButton(){var o;this.collapseButton=document.createElement("button"),this.collapseButton.type="button",this.collapseButton.classList.add(`${this.prefix}-collapse-btn`),this.collapseButton.setAttribute("aria-label","Toggle toolbar"),this.collapseButton.setAttribute("data-tooltip","Toggle toolbar"),this.updateButtonIcon(),this.collapseButton.addEventListener("click",t=>{t.stopPropagation(),this.toggle()}),(o=this.container.parentElement)==null||o.insertBefore(this.collapseButton,this.container.nextSibling)}updateButtonIcon(){this.collapseButton&&(this.collapseButton.innerHTML=`
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="18 15 12 9 6 15"/>
      </svg>
    `)}collapse(){this.isCollapsed||(this.isCollapsed=!0,this.container.classList.add(`${this.prefix}-collapsed`))}expand(){this.isCollapsed&&(this.isCollapsed=!1,this.container.classList.remove(`${this.prefix}-collapsed`))}toggle(){this.isCollapsed?this.expand():this.collapse()}get collapsed(){return this.isCollapsed}get autoCollapseEnabled(){return this.autoCollapse}setAutoCollapse(o){this.autoCollapse=o}destroy(){this.collapseButton&&(this.collapseButton.remove(),this.collapseButton=null),this.container.classList.remove(`${this.prefix}-collapsible`,`${this.prefix}-collapsed`)}};var pt=class{constructor(o,t){this.canvas=o;this.onGestureChange=t;this.initialDistance=0;this.initialScale=1;this.currentScale=1;this.panStart={x:0,y:0};this.panOffset={x:0,y:0};this.isGesturing=!1;this.activeTouches=0;this.minScale=.5;this.maxScale=3;this.handleTouchStart=o=>{this.activeTouches=o.touches.length,o.touches.length===2&&(o.preventDefault(),this.isGesturing=!0,this.initialDistance=this.getDistance(o.touches[0],o.touches[1]),this.initialScale=this.currentScale,this.panStart=this.getMidpoint(o.touches[0],o.touches[1]))};this.handleTouchMove=o=>{if(o.touches.length===2&&this.isGesturing){o.preventDefault();let e=this.getDistance(o.touches[0],o.touches[1])/this.initialDistance;this.currentScale=Math.max(this.minScale,Math.min(this.maxScale,this.initialScale*e));let n=this.getMidpoint(o.touches[0],o.touches[1]);this.panOffset={x:this.panOffset.x+(n.x-this.panStart.x),y:this.panOffset.y+(n.y-this.panStart.y)},this.panStart=n,this.onGestureChange(this.getState())}};this.handleTouchEnd=o=>{this.activeTouches=o.touches.length,o.touches.length<2&&(this.isGesturing=!1,o.touches.length===1&&(this.panStart={x:o.touches[0].clientX,y:o.touches[0].clientY}))}}init(){this.canvas.addEventListener("touchstart",this.handleTouchStart,{passive:!1}),this.canvas.addEventListener("touchmove",this.handleTouchMove,{passive:!1}),this.canvas.addEventListener("touchend",this.handleTouchEnd,{passive:!1}),this.canvas.addEventListener("touchcancel",this.handleTouchEnd,{passive:!1})}getDistance(o,t){let e=t.clientX-o.clientX,n=t.clientY-o.clientY;return Math.sqrt(e*e+n*n)}getMidpoint(o,t){return{x:(o.clientX+t.clientX)/2,y:(o.clientY+t.clientY)/2}}getState(){return{scale:this.currentScale,panX:this.panOffset.x,panY:this.panOffset.y}}isActive(){return this.isGesturing}hasTwoFingers(){return this.activeTouches>=2}reset(){this.currentScale=1,this.panOffset={x:0,y:0},this.initialScale=1,this.initialDistance=0,this.isGesturing=!1,this.onGestureChange(this.getState())}setScale(o){this.currentScale=Math.max(this.minScale,Math.min(this.maxScale,o)),this.onGestureChange(this.getState())}setPan(o,t){this.panOffset={x:o,y:t},this.onGestureChange(this.getState())}destroy(){this.canvas.removeEventListener("touchstart",this.handleTouchStart),this.canvas.removeEventListener("touchmove",this.handleTouchMove),this.canvas.removeEventListener("touchend",this.handleTouchEnd),this.canvas.removeEventListener("touchcancel",this.handleTouchEnd)}};var _n=window.devicePixelRatio||1,tn=25,_=class extends xt{constructor(t,e){super();this.referenceVideoFrameBuffer=null;this.videoFrameBuffer=null;this.ffmpegFrameExtractor=null;this.isMouseDown=!1;this.buttons=[];this.plugins=[];this.annotatedFrameCoordinates=[];this.videoBlobUrl=null;this.referenceVideoBlobUrl=null;this.frameCounterTimeoutId=null;this._enforcedTotalFrames=null;this.isCursorOverCanvas=!1;this.overlayOpacity=.7;this._theme="dark";this.themeChangeListeners=[];this.layoutManager=null;this.collapseController=null;this.gestureHandler=null;this.gestureState={scale:1,panX:0,panY:0};this.fps=tn;this.plannedFn=null;this.ct=0;this.isCanvasInitialized=!1;this.enforcedCanvasSize=null;this.lastNavigatedFrame=0;this.isProgressBarNavigation=!1;this.isAnnotationsAsVideoActive=!1;this.config=Qe(e),this._theme=this.config.theme,this.plugins=Ge.map(n=>new n(this)),this.init(t)}prevFrame(){let e=this.playbackFrame-1;e<1?this.playbackFrame=this.totalFrames:this.playbackFrame=e}nextFrame(){let e=this.playbackFrame+1;e>this.totalFrames?this.playbackFrame=1:this.playbackFrame=e}getAnnotatedFrames(){let t=[];return this.timeStack.forEach((e,n)=>{e&&e.length>0&&t.push(n)}),t.sort((e,n)=>e-n)}prevAnnotatedFrame(){let t=this.getAnnotatedFrames();if(t.length===0)return;let e=this.playbackFrame;for(let n=t.length-1;n>=0;n--)if(t[n]<e){this.playbackFrame=t[n];return}this.playbackFrame=t[t.length-1]}nextAnnotatedFrame(){let t=this.getAnnotatedFrames();if(t.length===0)return;let e=this.playbackFrame;for(let n of t)if(n>e){this.playbackFrame=n;return}this.playbackFrame=t[0]}get theme(){return this._theme}setTheme(t){this._theme=t,jt(t),this.themeChangeListeners.forEach(e=>e(t))}onThemeChange(t){return this.themeChangeListeners.push(t),()=>{let e=this.themeChangeListeners.indexOf(t);e!==-1&&this.themeChangeListeners.splice(e,1)}}setLayout(t){this.layoutManager||(this.layoutManager=new ut(this)),this.layoutManager.setLayout(t,{sidebarPosition:this.config.toolbar.sidebarPosition})}getLayout(){var t,e;return(e=(t=this.layoutManager)==null?void 0:t.getCurrentLayout())!=null?e:this.config.layout}collapseToolbar(){var t;(t=this.collapseController)==null||t.collapse()}expandToolbar(){var t;(t=this.collapseController)==null||t.expand()}toggleToolbar(){var t;(t=this.collapseController)==null||t.toggle()}isToolbarCollapsed(){var t,e;return(e=(t=this.collapseController)==null?void 0:t.collapsed)!=null?e:!1}setGesturesEnabled(t){t&&!this.gestureHandler?(this.gestureHandler=new pt(this.canvas,e=>{this.applyGestureTransform(e)}),this.gestureHandler.init()):!t&&this.gestureHandler&&(this.gestureHandler.destroy(),this.gestureHandler=null,this.resetZoom())}isGesturesEnabled(){return this.gestureHandler!==null}resetZoom(){var t;this.gestureState={scale:1,panX:0,panY:0},(t=this.gestureHandler)==null||t.reset(),this.redrawFullCanvas()}getZoomScale(){return this.gestureState.scale}applyGestureTransform(t){this.gestureState=t,this.redrawFullCanvas()}removeGlobalShape(t){this.globalShapes=this.globalShapes.filter(e=>e.type!==t)}addGlobalShape(t){this.globalShapes.push(t)}get selectedColor(){return this.colorPicker.value}get selectedStrokeSize(){return this.strokeSizePicker.valueAsNumber}get currentTool(){return this._currentTool}set currentTool(t){let e=this._currentTool;e&&(this.getButtonForTool(e).classList.remove("active"),this.pluginForTool(e).onDeactivate()),this._currentTool=t,this.canvas.style.cursor=t?"pointer":"default",t&&(this.getButtonForTool(t).classList.add("active"),this.pluginForTool(t).onActivate())}enableFrameRateDetection(){if(this.destructors.find(n=>n.name==="frameRateDetector"))return;let t=this.videoElement;if(t.tagName==="IMG")return;let e=qe(t,n=>{this.fps=n});Object.defineProperty(e,"name",{value:"frameRateDetector"}),this.destructors.push(e)}timeToFrame(t){return Math.max(1,Math.round(t*this.fps))}get playbackFrame(){return this.videoElement instanceof HTMLImageElement?1:this.timeToFrame(this.videoElement.currentTime)}set playbackFrame(t){if(this.videoElement instanceof HTMLImageElement)return;let e=t/this.fps;this.videoElement.currentTime=e,this.rvf(()=>{this.show()})}rvf(t){this.plannedFn=t}get canvasWidth(){var t,e;return(e=(t=this.enforcedCanvasSize)==null?void 0:t.width)!=null?e:0}get canvasHeight(){var t,e;return(e=(t=this.enforcedCanvasSize)==null?void 0:t.height)!=null?e:0}get aspectRatio(){return this.canvasHeight===0?0:this.canvasWidth/this.canvasHeight}get isMobile(){var e,n,r;let t=(r=(n=(e=this.config)==null?void 0:e.mobile)==null?void 0:n.breakpoint)!=null?r:960;return window.innerWidth<t}get progressBarCoordinates(){let t=this.isMobile?30:10,e=5,r=this.canvasWidth-e-55,a=e,c=this.canvasHeight-t;return{x:a,y:c,width:r,height:t}}get shapes(){return this.timeStack.has(this.activeTimeFrame)||this.timeStack.set(this.activeTimeFrame,[]),this.timeStack.get(this.activeTimeFrame)}set shapes(t){this.timeStack.set(this.activeTimeFrame,t)}get undoStack(){return this.undoTimeStack.has(this.activeTimeFrame)||this.undoTimeStack.set(this.activeTimeFrame,[]),this.undoTimeStack.get(this.activeTimeFrame)}set undoStack(t){this.undoTimeStack.set(this.activeTimeFrame,t)}get pixelRatio(){return _n}setVideoBlob(n){return M(this,arguments,function*(t,e=this.fps){this.videoBlobUrl&&URL.revokeObjectURL(this.videoBlobUrl);let r=URL.createObjectURL(t);this.videoBlobUrl=r,yield this.setVideoUrl(r,e),this.plugins.forEach(a=>{a.on("videoBlobSet",t)})})}setVideoUrl(n){return M(this,arguments,function*(t,e=this.fps){if(this.videoElement instanceof HTMLImageElement)return;let r=this.videoElement;r.src=t.toString(),yield this.videoElement.load(),this.setFrameRate(e),this.videoFrameBuffer&&(this.videoFrameBuffer.destroy(),this.videoFrameBuffer=new J(r,e,!1),this.videoFrameBuffer.isMobile=this.isMobile),this.setCanvasSize()})}enableVideoFrameBuffer(){this.videoElement instanceof HTMLImageElement||(this.videoFrameBuffer=new J(this.videoElement,this.fps,!1),this.videoFrameBuffer.isMobile=this.isMobile)}setFFmpegFrameExtractor(t){this.ffmpegFrameExtractor=t,this.redrawFullCanvas()}hasFFmpegFrame(t){var e,n;return(n=(e=this.ffmpegFrameExtractor)==null?void 0:e.hasFrame(t))!=null?n:!1}hide(){this.stopAnnotationsAsVideo(),this.hideControls(),this.hideCanvas()}showControls(){this.uiContainer.style.display=""}hideControls(){this.uiContainer.style.display="none"}showCanvas(){this.canvas.style.display="block"}hideCanvas(){this.canvas.style.display="none"}updateActiveTimeFrame(t=void 0){this.activeTimeFrame=t?this.timeToFrame(t):this.playbackFrame}show(){this.stopAnnotationsAsVideo(),this.updateActiveTimeFrame(),this.showCanvas(),this.showControls(),this.redrawFullCanvas()}setCanvasSettings(){this.ctx.strokeStyle=this.selectedColor,this.ctx.fillStyle=this.selectedColor,this.ctx.lineWidth=this.selectedStrokeSize}pluginForTool(t){if(this.isDestroyed)throw new Error("AnnotationTool is destroyed");let e=this.plugins.find(n=>n.name===t);if(!e)throw new Error(`No plugin found for tool ${t}`);return e}getButtonForTool(t){return this.buttons.find(e=>e.dataset.tool===t)}bindContext(){this.handleMouseDown=this.handleMouseDown.bind(this),this.handleMouseMove=this.handleMouseMove.bind(this),this.handleMouseUp=this.handleMouseUp.bind(this),this.setCanvasSize=this.setCanvasSize.bind(this),this.onKeyDown=this.onKeyDown.bind(this)}initProperties(){var t;this.isDestroyed=!1,this.isProgressBarNavigation=!1,this.shapes=[],this.globalShapes=[],this.currentTool=this.isMobile?null:(t=this.config.toolbar.defaultTool)!=null?t:null,jt(this._theme),this.layoutManager=new ut(this),this.layoutManager.setLayout(this.config.layout,{sidebarPosition:this.config.toolbar.sidebarPosition}),this.isMobile&&this.config.mobile.collapsibleToolbars&&(this.collapseController=new Ht(this.uiContainer,this.config.mobile.autoCollapse),this.collapseController.init()),this.isMobile&&this.config.mobile.gesturesEnabled&&(this.gestureHandler=new pt(this.canvas,e=>{this.applyGestureTransform(e)}),this.gestureHandler.init())}setVideoStyles(){this.videoElement.style.objectFit="cover",this.videoElement.style.objectPosition="left top"}get frameCallbackSupported(){return"requestVideoFrameCallback"in HTMLVideoElement.prototype}initFrameCounter(){if(!this.frameCallbackSupported){this.frameCounterTimeoutId=setTimeout(()=>{var t;this.isDestroyed||((t=this.plannedFn)==null||t.call(this),this.plannedFn=null,this.initFrameCounter(),this.updateActiveTimeFrame(),this.playAnnotationsAsVideo())},1e3/this.fps);return}this.withVideo(t=>{t.requestVideoFrameCallback((e,n)=>{var r,a;this.isCanvasInitialized||this._setCanvasSize(),(r=this.videoFrameBuffer)==null||r.tick(e,n),(a=this.plannedFn)==null||a.call(this),this.plannedFn=null,this.raf(()=>{this.initFrameCounter(),this.updateActiveTimeFrame(n.mediaTime),this.playAnnotationsAsVideo()})})})}init(t){this.videoElement=t,this.setVideoStyles(),this.initFrameCounter(),this.bindContext(),this.initCanvas(),this.initUI(),this.initProperties(),this.setCanvasSize()}onKeyDown(t){(t.ctrlKey||t.metaKey)&&t.key.toLowerCase()==="z"&&this.handleUndo()}handleUndo(){this.undoStack.length>0&&(this.shapes=this.undoStack.pop(),this.redrawFullCanvas())}destroy(){var r,a,c,l,s,h,u,p,m,f,v;if(this.isDestroyed)return;super.destroy(),this.stopAnnotationsAsVideo(),this.frameCounterTimeoutId&&(clearTimeout(this.frameCounterTimeoutId),this.frameCounterTimeoutId=null),this.videoBlobUrl&&(URL.revokeObjectURL(this.videoBlobUrl),this.videoBlobUrl=null),this.referenceVideoBlobUrl&&(URL.revokeObjectURL(this.referenceVideoBlobUrl),this.referenceVideoBlobUrl=null),this.currentTool=null,this.plugins.forEach(y=>y.reset()),this.annotatedFrameCoordinates=[],this.setFrameRate(tn);let t=this.strokeSizePicker.parentElement;if((r=t==null?void 0:t.parentNode)==null||r.removeChild(t),this.referenceVideoElement){let y=this.referenceVideoElement.parentElement;(a=y==null?void 0:y.parentNode)==null||a.removeChild(y),this.referenceVideoElement=null}let e=this.colorPicker.parentElement;(c=e==null?void 0:e.parentNode)==null||c.removeChild(e),this.buttons.forEach(y=>{var g;(g=y.parentNode)==null||g.removeChild(y)}),this.buttons=[],(l=this.uiContainer.parentNode)==null||l.removeChild(this.uiContainer),(s=this.canvas.parentNode)==null||s.removeChild(this.canvas),(h=this.playerControlsContainer.parentElement)==null||h.removeChild(this.playerControlsContainer),["strokeSizePicker","colorPicker","uiContainer","playerControlsContainer","canvas","ctx","videoElement"].forEach(y=>{delete this[y]}),this.activeTimeFrame=0,this.isDestroyed=!0,(u=this.referenceVideoFrameBuffer)==null||u.destroy(),this.referenceVideoFrameBuffer=null,(p=this.videoFrameBuffer)==null||p.destroy(),this.videoFrameBuffer=null,(m=this.layoutManager)==null||m.destroy(),this.layoutManager=null,(f=this.collapseController)==null||f.destroy(),this.collapseController=null,(v=this.gestureHandler)==null||v.destroy(),this.gestureHandler=null,this.gestureState={scale:1,panX:0,panY:0}}_setCanvasSize(){var p;let t=getComputedStyle(this.videoElement),e=parseInt(t.width,10),n=this.videoElement,r=n.videoWidth/n.videoHeight;if(isNaN(e)||!n.videoWidth||!n.videoHeight)return this.isCanvasInitialized=!1,this.setCanvasSettings(),!1;let a=n.parentElement,c=!!((p=document.fullscreenElement)!=null?p:document.webkitFullscreenElement),l=Math.min(e,n.videoWidth),s=Math.floor(l/r);if(c&&a){let v=window.innerWidth,y=window.innerHeight-90;v/y>r?(s=y,l=s*r):(l=v,s=l/r),n.style.width=`${l}px`,n.style.height=`${s}px`,n.style.marginTop="40px",n.style.marginBottom="50px"}else n.style.width=`${l}px`,n.style.height=`${s}px`,n.style.marginTop="",n.style.marginBottom="";this.isCanvasInitialized=n.videoWidth>0&&n.videoHeight>0,this.canvas.width=l*this.pixelRatio,this.canvas.height=s*this.pixelRatio,this.canvas.style.width=`${l}px`,this.canvas.style.height=`${s}px`,this.canvas.style.position="absolute";let h=n.offsetTop,u=n.offsetLeft;return this.canvas.style.top=`${h}px`,this.canvas.style.left=`${u}px`,this.enforcedCanvasSize={width:l,height:s},this.ctx.scale(this.pixelRatio,this.pixelRatio),this.setCanvasSettings(),!0}setCanvasSize(){this._setCanvasSize()&&(this.syncVideoSizes(),this.redrawFullCanvas())}replaceShape(t,e){let n=this.serialize([t])[0];this.undoStack.push([...this.shapes]),this.shapes[e]=n}addShape(t){let e=this.serialize([t])[0];this.undoStack.push([...this.shapes]),this.shapes.push(e)}get msPerFrame(){return 1e3/this.fps}syncVideoSizes(){this.withRefVideo(t=>{let n=this.videoElement.getBoundingClientRect();t.style.position="fixed",t.style.top=`${n.top}px`,t.style.left=`${n.left}px`})}addReferenceVideoByURL(r){return M(this,arguments,function*(t,e=this.fps,n="video/mp4"){var s;let a=yield fetch(t).then(h=>h.blob()),c=new Blob([a],{type:n});this.referenceVideoBlobUrl&&URL.revokeObjectURL(this.referenceVideoBlobUrl);let l=window.URL.createObjectURL(c);this.referenceVideoBlobUrl=l,this.referenceVideoElement?((s=this.referenceVideoFrameBuffer)==null||s.destroy(),this.referenceVideoFrameBuffer=new J(this.referenceVideoElement,e),this.referenceVideoFrameBuffer.isMobile=this.isMobile,this.referenceVideoFrameBuffer.start()):(this.referenceVideoElement=document.createElement("video"),this.withRefVideo(h=>{this.isMobile?(h.style.zIndex="2",h.style.display="block",h.style.top="0",h.style.left="0",h.style.opacity="0.25",h.style.width="20px",h.style.height="15px"):(h.style.zIndex="-1",h.style.display="none",h.style.width="100px",h.style.height="70px"),h.style.objectFit="cover",h.style.objectPosition="left top",h.muted=!0,h.volume=0,h.playsInline=!0,h.autoplay=!1,h.controls=!1,h.loop=!0,this.videoElement.after(h),this.referenceVideoFrameBuffer=new J(h,e),this.referenceVideoFrameBuffer.isMobile=this.isMobile,this.referenceVideoFrameBuffer.start()}),this.syncVideoSizes()),this.referenceVideoElement.src=l,this.referenceVideoElement.play().then(()=>{this.showButton("compare")}).catch(()=>{this.hideButton("compare")})})}hideButton(t){let e=this.getButtonForTool(t);e.style.display="none"}showButton(t){let e=this.getButtonForTool(t);e.style.display=""}addSingletonShape(t){let e=this.serialize([t])[0],n=this.shapes.filter(r=>r.type!==t.type);this.replaceFrame(this.playbackFrame,[...n,e])}serialize(t=this.shapes){let e=this.canvasWidth,n=this.canvasHeight;return t.map(r=>this.pluginForTool(r.type).normalize(r,e,n))}deserialize(t){let e=1/this.canvasWidth,n=1/this.canvasHeight;return t.map(r=>this.pluginForTool(r.type).normalize(r,e,n))}getRelativeCoords(t){let e=this.canvas.getBoundingClientRect();return{x:this.getEventX(t)-e.left,y:this.getEventY(t)-e.top}}handleMouseDown(t){var n,r;if(t.preventDefault(),this.isMouseDown=!0,yt(t)||(n=this.gestureHandler)!=null&&n.hasTwoFingers())return;let e=this.frameFromProgressBar(t,!0);if(e){this.isProgressBarNavigation=!0;let a=this.getAnnotationFrame(t);this.isVideoPaused&&(a!==null?this.playbackFrame=a:this.playbackFrame=e);return}this.currentTool&&((r=this.collapseController)!=null&&r.autoCollapseEnabled)&&this.collapseController.collapse(),this.currentTool&&this.pluginForTool(this.currentTool).onPointerDown(t)}get isDrawing(){return this.currentTool?this.pluginForTool(this.currentTool).isDrawing:!1}get isVideoPaused(){return this.videoElement.tagName==="VIDEO"?this.videoElement.paused:!0}get hasGlobalOverlays(){return this.globalShapes.length>0}handleMouseMove(t){if(t.preventDefault(),!yt(t)){if(this.isMouseDown){let e=this.isProgressBarNavigation?this.frameFromProgressBar(t,!1):null;if(e!==null&&!this.isDrawing){if(e===this.lastNavigatedFrame)return;this.lastNavigatedFrame=e,this.activeTimeFrame=e,this.isVideoPaused&&(this.playbackFrame=e),this.clearCanvas(),this.hasGlobalOverlays||this.addVideoOverlay(),this.drawShapesOverlay(),this.addProgressBarOverlay();return}else this.hideControls(),this.clearCanvas(),this.hasGlobalOverlays||this.addVideoOverlay(),this.drawShapesOverlay()}else this.redrawFullCanvas();this.currentTool&&this.pluginForTool(this.currentTool).onPointerMove(t)}}getEventX(t){return t.clientX}getEventY(t){return t.clientY}handleMouseUp(t){var e;this.isMouseDown=!1,this.isProgressBarNavigation=!1,this.showControls(),!yt(t)&&(this.currentTool&&this.pluginForTool(this.currentTool).onPointerUp(t),(e=this.collapseController)!=null&&e.autoCollapseEnabled&&this.collapseController.expand(),this.redrawFullCanvas())}focusOnMediaNode(){this.videoElement.focus()}drawShapesOverlay(){var n,r;let t={strokeStyle:this.ctx.strokeStyle,fillStyle:this.ctx.fillStyle,lineWidth:this.ctx.lineWidth,globalAlpha:this.ctx.globalAlpha},e=this.gestureState.scale!==1||this.gestureState.panX!==0||this.gestureState.panY!==0;if(e){this.ctx.save(),this.ctx.translate(this.gestureState.panX,this.gestureState.panY);let a=this.canvasWidth/2,c=this.canvasHeight/2;this.ctx.translate(a,c),this.ctx.scale(this.gestureState.scale,this.gestureState.scale),this.ctx.translate(-a,-c)}for(let a of this.deserialize(this.globalShapes)){this.ctx.strokeStyle=a.strokeStyle,this.ctx.fillStyle=a.fillStyle,this.ctx.lineWidth=a.lineWidth,this.ctx.globalAlpha=(n=a.opacity)!=null?n:1;try{this.pluginForTool(a.type).draw(a)}catch(c){console.error(c)}}for(let a of this.deserialize(this.shapes)){this.ctx.strokeStyle=a.strokeStyle,this.ctx.fillStyle=a.fillStyle,this.ctx.lineWidth=a.lineWidth,this.ctx.globalAlpha=(r=a.opacity)!=null?r:1;try{this.pluginForTool(a.type).draw(a)}catch(c){console.error(c)}}e&&this.ctx.restore(),this.ctx.strokeStyle=t.strokeStyle,this.ctx.fillStyle=t.fillStyle,this.ctx.lineWidth=t.lineWidth,this.ctx.globalAlpha=t.globalAlpha}clearCanvas(){this.ctx.clearRect(0,0,this.canvasWidth,this.canvasHeight)}frameToDataUrl(){try{this.clearCanvas(),this.addVideoOverlay(),this.addFrameSquareOverlay(),this.drawShapesOverlay();let t=this.canvas.toDataURL("image/png");return this.redrawFullCanvas(),t}catch(t){return console.error(t),null}}redrawFullCanvas(){this.clearCanvas(),this.addVideoOverlay(),this.drawShapesOverlay(),this.drawSelectionHandles(),this.addFrameSquareOverlay(),this.addProgressBarOverlay()}drawSelectionHandles(){if(this.currentTool==="move")try{this.pluginForTool("move").drawResizeHandles()}catch(t){}}replaceFrame(t,e){this.timeStack.set(t,this.parseShapes(this.stringifyShapes(e)))}addShapesToFrame(t,e){let n=this.timeStack.get(t)||[];this.timeStack.set(t,[...n,...this.parseShapes(this.stringifyShapes(e))])}setFrameRate(t){var e;(e=this.destructors.find(n=>n.name==="frameRateDetector"))==null||e(),this.fps=t}stringifyShapes(t){return JSON.stringify(t,(e,n)=>e==="image"?n.src:n)}parseShapes(t){return JSON.parse(t,(e,n)=>{if(e==="image"){let r=new Image;return r.src=n,r}return n})}filterNonSerializableShapes(t){return t.filter(e=>e.type!=="image")}saveCurrentFrame(){return{frame:this.playbackFrame,version:1,fps:this.fps,shapes:this.parseShapes(this.stringifyShapes(this.filterNonSerializableShapes(this.shapes)))}}loadAllFrames(t){this.cleanFrameStacks(),t.forEach(e=>{let n=e.shapes||[];this.timeStack.set(e.frame,this.parseShapes(this.stringifyShapes(n)))})}appendFrames(t){t.forEach(e=>{this.addShapesToFrame(e.frame,e.shapes)})}saveAllFrames(){return Array.from(this.timeStack.keys()).filter(r=>{var a;return(a=this.timeStack.get(r))==null?void 0:a.length}).map(r=>{var a;return{frame:r,fps:this.fps,version:1,shapes:this.filterNonSerializableShapes((a=this.timeStack.get(r))!=null?a:[])}})}getAnnotationFrame(t){var c,l;let e=t.offsetX,n=t.offsetY,r=this.isMobile?20:12;return(l=(c=this.annotatedFrameCoordinates.find(s=>e>=s.x-r&&e<=s.x+r&&n>=s.y-r&&n<=s.y+r))==null?void 0:c.frame)!=null?l:null}get totalFrames(){if(this._enforcedTotalFrames!==null)return this._enforcedTotalFrames;let t=this.videoElement;return t.tagName!=="VIDEO"?1:Math.round(t.duration*this.fps)}setTotalFrames(t){this._enforcedTotalFrames=t!==null?Math.max(1,Math.round(t)):null}getEnforcedTotalFrames(){return this._enforcedTotalFrames}frameFromProgressBar(t,e=!0){if(this.videoElement.tagName!=="VIDEO")return null;let{x:r,width:a,height:c,y:l}=this.progressBarCoordinates,s=t.offsetX,h=t.offsetY,u=()=>{let p=Math.round((s-r)/a*this.totalFrames);return Math.max(1,Math.min(p,this.totalFrames))};return e?s>=r&&s<=r+a&&h>=l&&h<=l+c?u():null:s>=r&&s<=r+a?u():null}hasAnnotationsForFrame(t){if(this.globalShapes.length>0)return!0;if(this.timeStack.has(t)){let e=this.timeStack.get(t);return e&&e.length>0}return!1}stopAnnotationsAsVideo(){this.isAnnotationsAsVideoActive=!1}startAnnotationsAsVideo(){this.isAnnotationsAsVideoActive=!0,this.playAnnotationsAsVideo()}playAnnotationsAsVideo(){this.isAnnotationsAsVideoActive&&(this.clearCanvas(),this.addVideoOverlay(),this.drawShapesOverlay(),(this.isCursorOverCanvas||this.isMobile)&&(this.addFrameSquareOverlay(),this.addProgressBarOverlay()))}};function en(i=this.activeTimeFrame){this.ctx.save(),this.ctx.fillStyle="rgba(0, 0, 0, 0.5)";let o=50,t=30,e=20;this.ctx.fillRect(this.canvasWidth-o,this.canvasHeight-t,o,t),this.ctx.fillStyle="white",this.ctx.font=`${e}px sans-serif`,this.ctx.fillText(`${i}`.padStart(3,"0"),this.canvasWidth-40,this.canvasHeight-7),this.ctx.restore()}function nn(){var h,u;let i=this.videoElement;if(i.tagName!=="VIDEO")return;let o=i.getBoundingClientRect(),t=this.canvas.getBoundingClientRect(),e=o.left-t.left,n=o.top-t.top,r=this.activeTimeFrame,a=null,c,l,s=(h=this.ffmpegFrameExtractor)==null?void 0:h.getFrame(r||1);if(s)a=s,c=s.width,l=s.height;else{let p=(u=this.videoFrameBuffer)==null?void 0:u.getFrame(r||0);p?(a=p,c=p.width,l=p.height):(a=i,c=i.videoWidth,l=i.videoHeight)}this.ctx.drawImage(a,0,0,c,l,e,n,this.canvasWidth,this.canvasHeight)}function on(){if(this.videoElement.tagName!=="VIDEO")return;this.annotatedFrameCoordinates=[];let t=Array.from(this.timeStack.keys()).filter(f=>{var v;return(v=this.timeStack.get(f))==null?void 0:v.length}),e=this.totalFrames,{x:n,width:r,height:a,y:c}=this.progressBarCoordinates,l=t.map(f=>Math.round(f/e*r));this.ctx.save(),this.ctx.fillStyle="rgba(0, 0, 0, 0.5)",this.ctx.fillRect(n,c,r,a),this.ctx.fillStyle=K.y;let s=this.isMobile?16:8;l.forEach((f,v)=>{this.ctx.beginPath();let y=n+f,g=this.canvasHeight-a/2;this.ctx.fillRect(y-s/2,g-s/2,s,s),this.annotatedFrameCoordinates.push({x:y,y:g,frame:t[v]})});let h=this.isProgressBarNavigation&&this.lastNavigatedFrame>0?this.lastNavigatedFrame:this.playbackFrame,u=Math.round(h/e*r)+n;this.ctx.fillStyle="white",this.ctx.beginPath();let p=u,m=this.canvasHeight-a/2;this.ctx.beginPath(),this.ctx.fillRect(p-s/2,m-s/2,s,s),this.ctx.fill(),this.ctx.restore()}function te(i,o=1){let t=i.replace(/^#/,""),e=0,n=0,r=0;return t.length===3?(e=parseInt(t[0]+t[0],16)/255,n=parseInt(t[1]+t[1],16)/255,r=parseInt(t[2]+t[2],16)/255):t.length===6?(e=parseInt(t.substring(0,2),16)/255,n=parseInt(t.substring(2,4),16)/255,r=parseInt(t.substring(4,6),16)/255):t.length===8&&(e=parseInt(t.substring(0,2),16)/255,n=parseInt(t.substring(2,4),16)/255,r=parseInt(t.substring(4,6),16)/255,o=parseInt(t.substring(6,8),16)/255),[e,n,r,o]}function lt(i,o=1){if(typeof i=="string"){if(i.startsWith("rgb")){let t=i.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);if(t)return[parseInt(t[1])/255,parseInt(t[2])/255,parseInt(t[3])/255,t[4]?parseFloat(t[4]):o]}return te(i,o)}return[1,0,0,o]}function rn(i,o,t,e){let n=Math.cos(e),r=Math.sin(e),a=i.x-o,c=i.y-t;return{x:o+a*n-c*r,y:t+a*r+c*n}}function Q(i,o,t,e){if(!o.rotation)return i;let n=o.rotationCenterX!==void 0?o.rotationCenterX:t,r=o.rotationCenterY!==void 0?o.rotationCenterY:e;return i.map(a=>rn(a,n,r,o.rotation))}function an(i,o,t){return{x:i*2-1,y:(1-o*2)/t}}function nt(i){return`[ [ ${i.map(o=>Bt(o)).join(" ")} ] ]`}function tt(i){return`[ ${i.map(o=>Bt(o)).join(" ")} ]`}function Bt(i){return Number.isInteger(i)?String(i):i.toFixed(9).replace(/\.?0+$/,"")||"0"}function et(i,o){return`[ ${i.map(e=>{let n=an(e.x,e.y,o);return`[ ${Bt(n.x)} ${Bt(n.y)} ]`}).join(" ")} ]`}function Gn(i,o,t,e,n){var p;let r=lt(i.strokeStyle,(p=i.opacity)!=null?p:1),a=e/n,c=0,l=0;for(let m of i.points)c+=m.x,l+=m.y;c/=i.points.length,l/=i.points.length;let s=Q(i.points,i,c,l),h=i.lineWidth/n,u=new Array(s.length).fill(h);return{name:`"pen:${o}:${t}:User"`,properties:[{type:"float",dimensions:4,name:"color",value:nt(r)},{type:"float",name:"width",value:tt(u)},{type:"string",name:"brush",value:'"circle"'},{type:"float",dimensions:2,name:"points",value:et(s,a)},{type:"int",name:"debug",value:0},{type:"int",name:"join",value:3},{type:"int",name:"cap",value:1},{type:"int",name:"splat",value:0}]}}function qn(i,o,t,e,n){var p;let r=lt(i.strokeStyle,(p=i.opacity)!=null?p:1),a=e/n,c=(i.x1+i.x2)/2,l=(i.y1+i.y2)/2,s=[{x:i.x1,y:i.y1},{x:i.x2,y:i.y2}];s=Q(s,i,c,l);let h=i.lineWidth/n,u=new Array(s.length).fill(h);return{name:`"pen:${o}:${t}:User"`,properties:[{type:"float",dimensions:4,name:"color",value:nt(r)},{type:"float",name:"width",value:tt(u)},{type:"string",name:"brush",value:'"circle"'},{type:"float",dimensions:2,name:"points",value:et(s,a)},{type:"int",name:"debug",value:0},{type:"int",name:"join",value:3},{type:"int",name:"cap",value:1},{type:"int",name:"splat",value:0}]}}function Kn(i,o,t,e,n){var C;let r=lt(i.strokeStyle,(C=i.opacity)!=null?C:1),a=nt(r),c=e/n,l=(i.x1+i.x2)/2,s=(i.y1+i.y2)/2,h=[{x:i.x1,y:i.y1},{x:i.x2,y:i.y2}],p=(10+2.5*i.lineWidth)/((e+n)/2),m=Math.PI/6,f=Math.atan2(i.y2-i.y1,i.x2-i.x1),v=[{x:i.x2,y:i.y2},{x:i.x2-p*Math.cos(f+m),y:i.y2-p*Math.sin(f+m)}],y=[{x:i.x2,y:i.y2},{x:i.x2-p*Math.cos(f-m),y:i.y2-p*Math.sin(f-m)}];h=Q(h,i,l,s),v=Q(v,i,l,s),y=Q(y,i,l,s);let g=i.lineWidth/n,x=new Array(2).fill(g);return[{name:`"pen:${o}:${t}:User"`,properties:[{type:"float",dimensions:4,name:"color",value:a},{type:"float",name:"width",value:tt(x)},{type:"string",name:"brush",value:'"circle"'},{type:"float",dimensions:2,name:"points",value:et(h,c)},{type:"int",name:"debug",value:0},{type:"int",name:"join",value:3},{type:"int",name:"cap",value:1},{type:"int",name:"splat",value:0}]},{name:`"pen:${o+1}:${t}:User"`,properties:[{type:"float",dimensions:4,name:"color",value:a},{type:"float",name:"width",value:tt(x)},{type:"string",name:"brush",value:'"circle"'},{type:"float",dimensions:2,name:"points",value:et(v,c)},{type:"int",name:"debug",value:0},{type:"int",name:"join",value:3},{type:"int",name:"cap",value:1},{type:"int",name:"splat",value:0}]},{name:`"pen:${o+2}:${t}:User"`,properties:[{type:"float",dimensions:4,name:"color",value:a},{type:"float",name:"width",value:tt(x)},{type:"string",name:"brush",value:'"circle"'},{type:"float",dimensions:2,name:"points",value:et(y,c)},{type:"int",name:"debug",value:0},{type:"int",name:"join",value:3},{type:"int",name:"cap",value:1},{type:"int",name:"splat",value:0}]}]}function Jn(i,o,t,e,n){var p;let r=lt(i.strokeStyle,(p=i.opacity)!=null?p:1),a=e/n,c=i.x+i.width/2,l=i.y+i.height/2,s=[{x:i.x,y:i.y},{x:i.x+i.width,y:i.y},{x:i.x+i.width,y:i.y+i.height},{x:i.x,y:i.y+i.height},{x:i.x,y:i.y}];s=Q(s,i,c,l);let h=i.lineWidth/n,u=new Array(s.length).fill(h);return{name:`"pen:${o}:${t}:User"`,properties:[{type:"float",dimensions:4,name:"color",value:nt(r)},{type:"float",name:"width",value:tt(u)},{type:"string",name:"brush",value:'"circle"'},{type:"float",dimensions:2,name:"points",value:et(s,a)},{type:"int",name:"debug",value:0},{type:"int",name:"join",value:3},{type:"int",name:"cap",value:1},{type:"int",name:"splat",value:0}]}}function Zn(i,o,t,e,n,r=32){var m;let a=lt(i.strokeStyle,(m=i.opacity)!=null?m:1),c=e/n,l=i.x,s=i.y,h=[];for(let f=0;f<=r;f++){let v=f/r*Math.PI*2;h.push({x:i.x+Math.cos(v)*i.radius,y:i.y+Math.sin(v)*i.radius})}h=Q(h,i,l,s);let u=i.lineWidth/n,p=new Array(h.length).fill(u);return{name:`"pen:${o}:${t}:User"`,properties:[{type:"float",dimensions:4,name:"color",value:nt(a)},{type:"float",name:"width",value:tt(p)},{type:"string",name:"brush",value:'"circle"'},{type:"float",dimensions:2,name:"points",value:et(h,c)},{type:"int",name:"debug",value:0},{type:"int",name:"join",value:3},{type:"int",name:"cap",value:1},{type:"int",name:"splat",value:0}]}}function Qn(i,o,t,e,n){var m,f,v,y;let r=lt(i.fillStyle,(m=i.opacity)!=null?m:1),a=e/n,c=i.x,l=i.y,s=0;if(i.rotation){let g=(f=i.rotationCenterX)!=null?f:i.x,x=(v=i.rotationCenterY)!=null?v:i.y,C=rn({x:i.x,y:i.y},g,x,i.rotation);c=C.x,l=C.y,s=i.rotation*180/Math.PI}let h=an(c,l,a),p=(16+((y=i.lineWidth)!=null?y:1)*.5)/n;return{name:`"text:${o}:${t}:User"`,properties:[{type:"float",dimensions:2,name:"position",value:nt([h.x,h.y])},{type:"float",dimensions:4,name:"color",value:nt(r)},{type:"float",name:"spacing",value:.8},{type:"float",name:"size",value:p},{type:"float",name:"scale",value:1},{type:"float",name:"rotation",value:s},{type:"string",name:"font",value:'""'},{type:"string",name:"text",value:`"${i.text.replace(/"/g,'\\"').replace(/\n/g,"\\n")}"`},{type:"string",name:"origin",value:'""'},{type:"int",name:"debug",value:0}]}}function to(i,o,t,e,n){switch(i.type){case"curve":return[Gn(i,o,t,e,n)];case"line":return[qn(i,o,t,e,n)];case"arrow":return Kn(i,o,t,e,n);case"rectangle":return[Jn(i,o,t,e,n)];case"circle":return[Zn(i,o,t,e,n)];case"text":return[Qn(i,o,t,e,n)];case"eraser":case"move":case"image":case"compare":case"audio-peaks":case"selection":return[];default:return[]}}function eo(i){let o=[];o.push(`    ${i.name}`),o.push("    {");for(let t of i.properties){let e=t.dimensions?`${t.type}[${t.dimensions}]`:t.type,n=typeof t.value=="string"?t.value:String(t.value);o.push(`        ${e} ${t.name} = ${n}`)}return o.push("    }"),o.join(`
`)}function ee(i,o){let{mediaPath:t,width:e,height:n,sessionName:r="sm-annotate-session"}=o,a=[];a.push("GTOa (4)"),a.push(""),a.push("# Generated by sm-annotate OpenRV exporter"),a.push(`# Media: ${t}`),a.push(`# Resolution: ${e}x${n}`),a.push(""),a.push("RVSession : RVSession (4)"),a.push("{"),a.push("    session"),a.push("    {"),a.push(`        string name = "${r}"`),a.push("        int version = 4"),a.push("    }"),a.push("}"),a.push(""),a.push("sourceGroup000000_source : RVFileSource (1)"),a.push("{"),a.push("    media"),a.push("    {"),a.push(`        string movie = "${t}"`),a.push("    }"),a.push("    request"),a.push("    {"),a.push(`        int width = ${e}`),a.push(`        int height = ${n}`),a.push("    }"),a.push("}"),a.push("");let c=[],l=0;for(let s of i)for(let h of s.shapes){let u=to(h,l,s.frame,e,n);c.push(...u),l+=u.length}if(c.length>0){let s=new Map;for(let h of c){let u=h.name.match(/:\d+:(\d+):/);if(u){let p=parseInt(u[1]);s.has(p)||s.set(p,[]);let m=h.name.startsWith('"')&&h.name.endsWith('"')?h.name.slice(1,-1):h.name;s.get(p).push(m)}}a.push("sourceGroup000000_paint : RVPaint (3)"),a.push("{"),a.push("    paint"),a.push("    {"),a.push(`        int nextId = ${l}`),a.push("        int nextAnnotationId = 0"),a.push("        int show = 1"),a.push("        string exclude = [ ]"),a.push("        string include = [ ]"),a.push("    }");for(let h of c)a.push(eo(h));for(let[h,u]of s)a.push(`    "frame:${h}"`),a.push("    {"),a.push(`        string order = [ ${u.map(p=>`"${p}"`).join(" ")} ]`),a.push("    }");a.push("}")}return a.join(`
`)}function sn(i,o,t="annotations.rv"){let e=ee(i,o),n=new Blob([e],{type:"text/plain"}),r=URL.createObjectURL(n),a=document.createElement("a");a.href=r,a.download=t,document.body.appendChild(a),a.click(),document.body.removeChild(a),URL.revokeObjectURL(r)}function zt(i){if(i.length<3)return"#000000";let o=Math.round(i[0]*255),t=Math.round(i[1]*255),e=Math.round(i[2]*255);return`#${o.toString(16).padStart(2,"0")}${t.toString(16).padStart(2,"0")}${e.toString(16).padStart(2,"0")}`}function no(i,o){if(i=i.trim(),i.startsWith("[")&&i.endsWith("]")){let t=i.slice(1,-1).trim();if(t==="")return o==="string"?[]:[];if(o==="string"){let n=t.match(/"([^"\\]|\\.)*"/g);return n?n.map(r=>r.slice(1,-1).replace(/\\"/g,'"').replace(/\\n/g,`
`)):[]}if(t.includes("[")){let n=[],r=t.match(/-?\d+\.?\d*(?:e[+-]?\d+)?/gi);if(r)for(let a of r)n.push(Number(a));return n}return t.split(/\s+/).filter(n=>n.length>0&&!isNaN(Number(n))).map(Number)}return i.startsWith('"')&&i.endsWith('"')?i.slice(1,-1).replace(/\\"/g,'"').replace(/\\n/g,`
`):Number(i)}function oo(i){var a;let o=[],t=i.split(`
`),e=null,n=null,r=0;for(let c=0;c<t.length;c++){let l=t[c].trim();if(l===""||l.startsWith("#")||l==="GTOa (4)")continue;let s=l.match(/^(\S+)\s*:\s*(\S+)\s*\((\d+)\)\s*$/);if(s&&r===0){e={name:s[1],protocol:s[2],version:parseInt(s[3]),components:new Map},o.push(e);continue}if(l==="{"){r++;continue}if(l==="}"){r--,r===1&&(n=null),r===0&&(e=null);continue}if(e&&r>=1){if(r===1){let u=l.match(/^"([^"]+)"(\s*\{)?$/);if(u){n=u[1],e.components.has(n)||e.components.set(n,new Map),u[2]&&r++;continue}let p=l.match(/^([^\s=\[]+)(\s*\{)?$/);if(p&&!l.includes("=")){n=p[1],e.components.has(n)||e.components.set(n,new Map),p[2]&&r++;continue}}let h=l.match(/^(\w+)(?:\[([^\]]*)\])?\s+(\w+)\s*=\s*(.+)$/);if(h&&n){let[,u,,p,m]=h,f=no(m,u);(a=e.components.get(n))==null||a.set(p,f)}}}return o}function ln(i,o,t){return{x:(i+1)/2,y:(1-o*t)/2}}function io(i,o,t,e,n,r){let a=i.get("points"),c=i.get("color"),l=i.get("width");if(!a||a.length<4)return null;let s=o/t,h=[];for(let f=0;f<a.length;f+=2){let v=ln(a[f],a[f+1],s);v=cn(v.x,v.y,n,r),h.push(v)}let u=c?zt(c):"#000000",p=c&&c.length>=4?c[3]:1,m=2;if(typeof l=="number")m=l*e;else if(Array.isArray(l)&&l.length>0){let f=l[0];typeof f=="number"&&(m=f*e)}return n!==void 0&&n!==1&&(m*=n),m=Math.max(1,Math.min(m,50)),{type:"curve",points:h,strokeStyle:u,fillStyle:u,lineWidth:m,opacity:p}}function ro(i,o,t,e,n,r){let a=i.get("position"),c=i.get("color"),l=i.get("text"),s=i.get("size");if(!a||a.length<2||!l)return null;let h=o/t,u=ln(a[0],a[1],h);u=cn(u.x,u.y,n,r);let p=c?zt(c):"#000000",m=c&&c.length>=4?c[3]:1,v=(s!=null?s:.01)*e;n!==void 0&&n!==1&&(v*=n);let y=Math.max(1,(v-16)/.5);return{type:"text",x:u.x,y:u.y,text:l,strokeStyle:p,fillStyle:p,lineWidth:y,opacity:m}}function cn(i,o,t,e){let n=i,r=o;return t!==void 0&&t!==1&&(n=.5+(i-.5)*t,r=.5+(o-.5)*t),e&&(n-=e.x,r-=e.y),{x:n,y:r}}function ne(i,o={}){var v,y,g,x,C,R,$,F,A;let t={frames:[]},e=oo(i),n=e.find(w=>w.protocol==="RVSession");if(n){let w=n.components.get("session");if(w){let E=w.get("name");typeof E=="string"&&(t.sessionName=E)}}let r=e.find(w=>w.protocol==="RVFileSource");if(r){let w=r.components.get("media");if(w){let T=w.get("movie");typeof T=="string"&&(t.mediaPath=T)}let E=r.components.get("proxy");if(E){let T=E.get("size");T&&T.length>=2&&(t.dimensions={width:T[0],height:T[1]})}if(!t.dimensions){let T=r.components.get("request");if(T){let b=T.get("width"),D=T.get("height");typeof b=="number"&&typeof D=="number"&&(t.dimensions={width:b,height:D})}}}if(!t.dimensions){let w=e.find(E=>E.protocol==="RVStack");if(w){let E=w.components.get("output");if(E){let T=E.get("size");T&&T.length>=2&&(t.dimensions={width:T[0],height:T[1]})}}}if(!t.dimensions){let w=e.find(E=>E.protocol==="RVSequence");if(w){let E=w.components.get("output");if(E){let T=E.get("size");T&&T.length>=2&&(t.dimensions={width:T[0],height:T[1]})}}}let a=(g=(y=(v=t.dimensions)==null?void 0:v.width)!=null?y:o.width)!=null?g:1920,c=(R=(C=(x=t.dimensions)==null?void 0:x.height)!=null?C:o.height)!=null?R:1080,l=($=o.targetHeight)!=null?$:c,s=(F=o.fps)!=null?F:25,h=o.coordinateScale,u=o.coordinateOffset,p=(A=o.debug)!=null?A:!1;t.fps=s,p&&(console.log("[OpenRV Parser] Source dimensions:",a,"x",c),console.log("[OpenRV Parser] Target height:",l),console.log("[OpenRV Parser] Coordinate scale:",h),console.log("[OpenRV Parser] Coordinate offset:",u));let m=e.filter(w=>w.protocol==="RVPaint");if(m.length===0)return p&&console.log("[OpenRV Parser] No RVPaint objects found"),t;p&&console.log("[OpenRV Parser] Found",m.length,"RVPaint objects");let f=new Map;for(let w of m)for(let[E,T]of w.components){let b=E.match(/^pen:\d+:(\d+):/i);if(b){let O=parseInt(b[1]),W=io(T,a,c,l,h,u);W&&(f.has(O)||f.set(O,[]),f.get(O).push(W));continue}let D=E.match(/^text:\d+:(\d+):/i);if(D){let O=parseInt(D[1]),W=ro(T,a,c,l,h,u);W&&(f.has(O)||f.set(O,[]),f.get(O).push(W))}}for(let[w,E]of f)t.frames.push({frame:w,fps:s,version:1,shapes:E});return t.frames.sort((w,E)=>w.frame-E.frame),t}function hn(t){return M(this,arguments,function*(i,o={}){let e=yield i.text();return ne(e,o)})}var ao="0.12.9",$a=`https://unpkg.com/@ffmpeg/core@${ao}/dist/umd/ffmpeg-core.js`,k;(function(i){i.LOAD="LOAD",i.EXEC="EXEC",i.FFPROBE="FFPROBE",i.WRITE_FILE="WRITE_FILE",i.READ_FILE="READ_FILE",i.DELETE_FILE="DELETE_FILE",i.RENAME="RENAME",i.CREATE_DIR="CREATE_DIR",i.LIST_DIR="LIST_DIR",i.DELETE_DIR="DELETE_DIR",i.ERROR="ERROR",i.DOWNLOAD="DOWNLOAD",i.PROGRESS="PROGRESS",i.LOG="LOG",i.MOUNT="MOUNT",i.UNMOUNT="UNMOUNT"})(k||(k={}));var dn=(()=>{let i=0;return()=>i++})();var Ba=new Error("unknown message type"),un=new Error("ffmpeg is not loaded, call `await ffmpeg.load()` first"),pn=new Error("called FFmpeg.terminate()"),za=new Error("failed to import ffmpeg-core.js");var mn={};var V,G,Y,ot,it,Wt,B,Vt=class{constructor(){j(this,V,null);j(this,G,{});j(this,Y,{});j(this,ot,[]);j(this,it,[]);H(this,"loaded",!1);j(this,Wt,()=>{S(this,V)&&(S(this,V).onmessage=({data:{id:o,type:t,data:e}})=>{switch(t){case k.LOAD:this.loaded=!0,S(this,G)[o](e);break;case k.MOUNT:case k.UNMOUNT:case k.EXEC:case k.FFPROBE:case k.WRITE_FILE:case k.READ_FILE:case k.DELETE_FILE:case k.RENAME:case k.CREATE_DIR:case k.LIST_DIR:case k.DELETE_DIR:S(this,G)[o](e);break;case k.LOG:S(this,ot).forEach(n=>n(e));break;case k.PROGRESS:S(this,it).forEach(n=>n(e));break;case k.ERROR:S(this,Y)[o](e);break}delete S(this,G)[o],delete S(this,Y)[o]})});j(this,B,({type:o,data:t},e=[],n)=>S(this,V)?new Promise((r,a)=>{let c=dn();S(this,V)&&S(this,V).postMessage({id:c,type:o,data:t},e),S(this,G)[c]=r,S(this,Y)[c]=a,n==null||n.addEventListener("abort",()=>{a(new DOMException(`Message # ${c} was aborted`,"AbortError"))},{once:!0})}):Promise.reject(un));H(this,"load",(n={},{signal:e}={})=>{var r=n,{classWorkerURL:o}=r,t=pe(r,["classWorkerURL"]);return S(this,V)||(ct(this,V,o?new Worker(new URL(o,mn.url),{type:"module"}):new Worker(new URL("./worker.js",mn.url),{type:"module"})),S(this,Wt).call(this)),S(this,B).call(this,{type:k.LOAD,data:t},void 0,e)});H(this,"exec",(o,t=-1,{signal:e}={})=>S(this,B).call(this,{type:k.EXEC,data:{args:o,timeout:t}},void 0,e));H(this,"ffprobe",(o,t=-1,{signal:e}={})=>S(this,B).call(this,{type:k.FFPROBE,data:{args:o,timeout:t}},void 0,e));H(this,"terminate",()=>{let o=Object.keys(S(this,Y));for(let t of o)S(this,Y)[t](pn),delete S(this,Y)[t],delete S(this,G)[t];S(this,V)&&(S(this,V).terminate(),ct(this,V,null),this.loaded=!1)});H(this,"writeFile",(o,t,{signal:e}={})=>{let n=[];return t instanceof Uint8Array&&n.push(t.buffer),S(this,B).call(this,{type:k.WRITE_FILE,data:{path:o,data:t}},n,e)});H(this,"mount",(o,t,e)=>{let n=[];return S(this,B).call(this,{type:k.MOUNT,data:{fsType:o,options:t,mountPoint:e}},n)});H(this,"unmount",o=>{let t=[];return S(this,B).call(this,{type:k.UNMOUNT,data:{mountPoint:o}},t)});H(this,"readFile",(o,t="binary",{signal:e}={})=>S(this,B).call(this,{type:k.READ_FILE,data:{path:o,encoding:t}},void 0,e));H(this,"deleteFile",(o,{signal:t}={})=>S(this,B).call(this,{type:k.DELETE_FILE,data:{path:o}},void 0,t));H(this,"rename",(o,t,{signal:e}={})=>S(this,B).call(this,{type:k.RENAME,data:{oldPath:o,newPath:t}},void 0,e));H(this,"createDir",(o,{signal:t}={})=>S(this,B).call(this,{type:k.CREATE_DIR,data:{path:o}},void 0,t));H(this,"listDir",(o,{signal:t}={})=>S(this,B).call(this,{type:k.LIST_DIR,data:{path:o}},void 0,t));H(this,"deleteDir",(o,{signal:t}={})=>S(this,B).call(this,{type:k.DELETE_DIR,data:{path:o}},void 0,t))}on(o,t){o==="log"?S(this,ot).push(t):o==="progress"&&S(this,it).push(t)}off(o,t){o==="log"?ct(this,ot,S(this,ot).filter(e=>e!==t)):o==="progress"&&ct(this,it,S(this,it).filter(e=>e!==t))}};V=new WeakMap,G=new WeakMap,Y=new WeakMap,ot=new WeakMap,it=new WeakMap,Wt=new WeakMap,B=new WeakMap;var fn;(function(i){i.MEMFS="MEMFS",i.NODEFS="NODEFS",i.NODERAWFS="NODERAWFS",i.IDBFS="IDBFS",i.WORKERFS="WORKERFS",i.PROXYFS="PROXYFS"})(fn||(fn={}));var gn=new Error("failed to get response body reader"),vn=new Error("failed to complete download");var yn="Content-Length";var so=i=>new Promise((o,t)=>{let e=new FileReader;e.onload=()=>{let{result:n}=e;n instanceof ArrayBuffer?o(new Uint8Array(n)):o(new Uint8Array)},e.onerror=n=>{var r,a;t(Error(`File could not be read! Code=${((a=(r=n==null?void 0:n.target)==null?void 0:r.error)==null?void 0:a.code)||-1}`))},e.readAsArrayBuffer(i)}),mt=i=>M(void 0,null,function*(){let o;if(typeof i=="string")/data:_data\/([a-zA-Z]*);base64,([^"]*)/.test(i)?o=atob(i.split(",")[1]).split("").map(t=>t.charCodeAt(0)):o=yield(yield fetch(i)).arrayBuffer();else if(i instanceof URL)o=yield(yield fetch(i)).arrayBuffer();else if(i instanceof File||i instanceof Blob)o=yield so(i);else return new Uint8Array;return new Uint8Array(o)});var lo=(i,o)=>M(void 0,null,function*(){var n;let t=yield fetch(i),e;try{let r=parseInt(t.headers.get(yn)||"-1"),a=(n=t.body)==null?void 0:n.getReader();if(!a)throw gn;let c=[],l=0;for(;;){let{done:u,value:p}=yield a.read(),m=p?p.length:0;if(u){if(r!=-1&&r!==l)throw vn;o&&o({url:i,total:r,received:l,delta:m,done:u});break}c.push(p),l+=m,o&&o({url:i,total:r,received:l,delta:m,done:u})}let s=new Uint8Array(l),h=0;for(let u of c)s.set(u,h),h+=u.length;e=s.buffer}catch(r){console.log("failed to send download progress event: ",r),e=yield t.arrayBuffer(),o&&o({url:i,total:e.byteLength,received:e.byteLength,delta:0,done:!0})}return e}),oe=(i,o,t=!1,e)=>M(void 0,null,function*(){let n=t?yield lo(i,e):yield(yield fetch(i)).arrayBuffer(),r=new Blob([n],{type:o});return URL.createObjectURL(r)});var Nt=class{constructor(){this.ffmpeg=null;this.loadPromise=null;this.frames=new Map;this.videoInfo=null;this.isDestroyed=!1;this.extractionAbortController=null}load(o){return M(this,null,function*(){if(!this.ffmpeg)return this.loadPromise?this.loadPromise:(this.loadPromise=this._load(o),this.loadPromise)})}_load(o){return M(this,null,function*(){let t=typeof SharedArrayBuffer!="undefined";console.log(`SharedArrayBuffer available: ${t}`),t||console.warn(`SharedArrayBuffer not available. FFmpeg may not work correctly.
To enable, add these headers to your server:
  Cross-Origin-Embedder-Policy: require-corp
  Cross-Origin-Opener-Policy: same-origin`),this.ffmpeg=new Vt,this.ffmpeg.on("log",({message:u})=>{console.log("FFmpeg:",u),this.parseFFmpegLog(u)}),this.ffmpeg.on("progress",({progress:u})=>{console.log("FFmpeg progress:",u),o==null||o({loaded:u,total:1,phase:"extracting"})}),o==null||o({loaded:0,total:1,phase:"loading"});let e="https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm",n="https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.15/dist/esm",a=yield(yield fetch(`${n}/worker.js`)).text();a=a.replace(/from\s*["']\.\/([^"']+)["']/g,`from "${n}/$1"`),a=a.replace(/import\s*["']\.\/([^"']+)["']/g,`import "${n}/$1"`);let c=new Blob([a],{type:"text/javascript"}),l=URL.createObjectURL(c);o==null||o({loaded:.25,total:1,phase:"loading"});let s=yield oe(`${e}/ffmpeg-core.js`,"text/javascript");o==null||o({loaded:.5,total:1,phase:"loading"});let h=yield oe(`${e}/ffmpeg-core.wasm`,"application/wasm");o==null||o({loaded:.75,total:1,phase:"loading"}),yield this.ffmpeg.load({coreURL:s,wasmURL:h,classWorkerURL:l}),o==null||o({loaded:1,total:1,phase:"loading"})})}isLoaded(){return this.ffmpeg!==null}parseFFmpegLog(o){let t=o.match(/(\d+(?:\.\d+)?)\s*fps/);if(t&&this.videoInfo){let r=parseFloat(t[1]);r>0&&r<1e3&&(this.videoInfo.fps=r)}if(this.videoInfo&&this.videoInfo.fps===25){let r=o.match(/(\d+(?:\.\d+)?)\s*tbr/);if(r){let a=parseFloat(r[1]);a>0&&a<1e3&&(this.videoInfo.fps=a)}}let e=o.match(/Duration:\s*(\d{2}):(\d{2}):(\d{2})\.(\d+)/);if(e&&this.videoInfo){let r=parseInt(e[1],10),a=parseInt(e[2],10),c=parseInt(e[3],10),l=parseInt(e[4],10);this.videoInfo.duration=r*3600+a*60+c+l/100}let n=o.match(/(\d{2,5})x(\d{2,5})/);if(n&&this.videoInfo){let r=parseInt(n[1],10),a=parseInt(n[2],10);r>0&&a>0&&(this.videoInfo.width=r,this.videoInfo.height=a)}}probe(o){return M(this,null,function*(){if(yield this.load(),!this.ffmpeg)throw new Error("FFmpeg not loaded");this.videoInfo={fps:25,duration:0,width:0,height:0,totalFrames:0};let t="mp4";typeof o!="string"&&o.type&&(t={"video/mp4":"mp4","video/webm":"webm","video/quicktime":"mov","video/x-msvideo":"avi","video/x-matroska":"mkv","video/ogg":"ogv"}[o.type]||"mp4");let e=`input_probe.${t}`,n=typeof o=="string"?yield mt(o):yield mt(o);yield this.ffmpeg.writeFile(e,n);try{yield this.ffmpeg.exec(["-i",e])}catch(r){}try{yield this.ffmpeg.deleteFile(e)}catch(r){}return this.videoInfo.duration>0&&this.videoInfo.fps>0&&(this.videoInfo.totalFrames=Math.round(this.videoInfo.duration*this.videoInfo.fps)),console.log("Probed video info:",this.videoInfo),this.videoInfo})}extractFrames(e){return M(this,arguments,function*(o,t={}){var g,x,C,R,$,F,A,w,E,T;if(yield this.load(t.onProgress),!this.ffmpeg)throw new Error("FFmpeg not loaded");if(this.isDestroyed)throw new Error("Extractor has been destroyed");this.extractionAbortController=new AbortController,this.clearFrames(),this.videoInfo||(yield this.probe(o));let n=(C=(x=t.fps)!=null?x:(g=this.videoInfo)==null?void 0:g.fps)!=null?C:25,r=(R=t.format)!=null?R:"png",a=(A=(F=t.endFrame)!=null?F:($=this.videoInfo)==null?void 0:$.totalFrames)!=null?A:0,c=(w=t.startFrame)!=null?w:1,l="mp4";typeof o!="string"&&o.type&&(l={"video/mp4":"mp4","video/webm":"webm","video/quicktime":"mov","video/x-msvideo":"avi","video/x-matroska":"mkv","video/ogg":"ogv"}[o.type]||"mp4");let s=`input.${l}`;(E=t.onProgress)==null||E.call(t,{loaded:0,total:a,phase:"extracting"});let h=typeof o=="string"?yield mt(o):yield mt(o),u=h.byteLength/(1024*1024);if(console.log(`Video file size: ${u.toFixed(2)} MB`),u>100)throw new Error(`Video file too large (${u.toFixed(0)}MB). FFmpeg WASM has memory limits. Please use a smaller video file (<100MB).`);yield this.ffmpeg.writeFile(s,h);try{let b=yield this.ffmpeg.readFile(s),D=b instanceof Uint8Array?b.byteLength:b.length;console.log(`Input file written: ${D} bytes`)}catch(b){console.error("Failed to verify input file:",b)}let p=(b,D=3e4)=>M(this,null,function*(){console.log("FFmpeg command:",b.join(" "));let O=new Promise((W,ft)=>{setTimeout(()=>ft(new Error(`FFmpeg timeout after ${D}ms`)),D)});yield Promise.race([this.ffmpeg.exec(b),O])});console.log("Testing FFmpeg with single frame extraction (this may take a while for h264)...");let m=r==="png"?"png":"jpg";try{let b=["-y","-nostdin","-i",s,"-frames:v","1"];m==="jpg"&&b.push("-q:v","8"),b.push(`test_frame.${m}`),yield p(b,6e4);let D=yield this.ffmpeg.readFile(`test_frame.${m}`),O=D instanceof Uint8Array?D.byteLength:D.length;console.log(`Test frame extracted: ${O} bytes`),yield this.ffmpeg.deleteFile(`test_frame.${m}`)}catch(b){console.error("Single frame test failed:",b);try{yield this.ffmpeg.deleteFile(s)}catch(D){}throw new Error(`FFmpeg cannot process this video (h264 decoding may be too slow in WASM). Error: ${b}`)}let f=Math.max(3e5,a*2e3);console.log(`Extracting ${a} frames as ${r.toUpperCase()} at fps=${n} (estimated timeout: ${(f/1e3).toFixed(0)}s)...`);let v=["-y","-nostdin","-i",s,"-vf",`fps=${n}`];r==="jpg"&&v.push("-q:v","8"),v.push(`frame_%06d.${r}`);try{yield p(v,f)}catch(b){console.error("Frame extraction failed:",b);try{yield this.ffmpeg.deleteFile(s)}catch(D){}throw new Error(`Failed to extract frames: ${b}`)}let y=1;for(;!this.isDestroyed;){let b=`frame_${String(y).padStart(6,"0")}.${r}`;try{let D=yield this.ffmpeg.readFile(b);if(D instanceof Uint8Array){let O=new Blob([D],{type:r==="png"?"image/png":"image/jpeg"}),W=yield createImageBitmap(O);this.frames.set(y,W),yield this.ffmpeg.deleteFile(b),(T=t.onProgress)==null||T.call(t,{loaded:y,total:a||y,phase:"processing"})}y++}catch(D){break}}console.log(`Extraction complete: ${this.frames.size} frames`);try{yield this.ffmpeg.deleteFile(s)}catch(b){}return this.extractionAbortController=null,this.frames})}extractFramesInChunks(r,a,c){return M(this,arguments,function*(o,t,e,n={}){var u;let l=yield this.probe(o),s=l.totalFrames,h=(u=n.fps)!=null?u:l.fps;for(let p=1;p<=s&&!this.isDestroyed;p+=t){let m=Math.min(p+t-1,s);this.clearFrames(),yield this.extractFrames(o,{fps:h,startFrame:p,endFrame:m,onProgress:n.onProgress}),e(this.frames,p,m)}})}getFrame(o){var t;return(t=this.frames.get(o))!=null?t:null}hasFrame(o){return this.frames.has(o)}getAllFrames(){return this.frames}getVideoInfo(){return this.videoInfo}get frameCount(){return this.frames.size}clearFrames(){this.frames.forEach(o=>o.close()),this.frames.clear()}abort(){var o;(o=this.extractionAbortController)==null||o.abort()}destroy(){var o;this.isDestroyed=!0,this.abort(),this.clearFrames(),(o=this.ffmpeg)==null||o.terminate(),this.ffmpeg=null,this.loadPromise=null,this.videoInfo=null}},rt=null;function co(){return rt||(rt=new Nt),rt}function ho(){rt==null||rt.destroy(),rt=null}_.prototype.initUI=We;_.prototype.initCanvas=Ne;_.prototype.addFrameSquareOverlay=en;_.prototype.addVideoOverlay=nn;_.prototype.addProgressBarOverlay=on;export{Nt as FFmpegFrameExtractor,_ as SmAnnotate,Z as defaultConfig,ho as destroySharedFFmpegExtractor,sn as downloadAsOpenRV,ee as exportToOpenRV,co as getSharedFFmpegExtractor,te as hexToRGBA,ne as parseOpenRV,hn as parseOpenRVFile,zt as rgbaToHex};
