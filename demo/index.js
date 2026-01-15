"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/webaudio-peaks/index.js
  var require_webaudio_peaks = __commonJS({
    "node_modules/webaudio-peaks/index.js"(exports, module) {
      "use strict";
      function findMinMax(array) {
        var min = Infinity;
        var max = -Infinity;
        var i = 0;
        var len = array.length;
        var curr;
        for (; i < len; i++) {
          curr = array[i];
          if (min > curr) {
            min = curr;
          }
          if (max < curr) {
            max = curr;
          }
        }
        return {
          min,
          max
        };
      }
      function convert(n, bits) {
        var max = Math.pow(2, bits - 1);
        var v2 = n < 0 ? n * max : n * (max - 1);
        return Math.max(-max, Math.min(max - 1, v2));
      }
      function extractPeaks(channel, samplesPerPixel, bits) {
        var i;
        var chanLength = channel.length;
        var numPeaks = Math.ceil(chanLength / samplesPerPixel);
        var start;
        var end;
        var segment;
        var max;
        var min;
        var extrema;
        var peaks = makeTypedArray(bits, numPeaks * 2);
        for (i = 0; i < numPeaks; i++) {
          start = i * samplesPerPixel;
          end = (i + 1) * samplesPerPixel > chanLength ? chanLength : (i + 1) * samplesPerPixel;
          segment = channel.subarray(start, end);
          extrema = findMinMax(segment);
          min = convert(extrema.min, bits);
          max = convert(extrema.max, bits);
          peaks[i * 2] = min;
          peaks[i * 2 + 1] = max;
        }
        return peaks;
      }
      function makeTypedArray(bits, length) {
        return new (new Function(`return Int${bits}Array`)())(length);
      }
      function makeMono(channelPeaks, bits) {
        var numChan = channelPeaks.length;
        var weight = 1 / numChan;
        var numPeaks = channelPeaks[0].length / 2;
        var c = 0;
        var i = 0;
        var min;
        var max;
        var peaks = makeTypedArray(bits, numPeaks * 2);
        for (i = 0; i < numPeaks; i++) {
          min = 0;
          max = 0;
          for (c = 0; c < numChan; c++) {
            min += weight * channelPeaks[c][i * 2];
            max += weight * channelPeaks[c][i * 2 + 1];
          }
          peaks[i * 2] = min;
          peaks[i * 2 + 1] = max;
        }
        return [peaks];
      }
      function defaultNumber(value, defaultNumber2) {
        if (typeof value === "number") {
          return value;
        } else {
          return defaultNumber2;
        }
      }
      module.exports = function(source, samplesPerPixel, isMono, cueIn, cueOut, bits) {
        samplesPerPixel = defaultNumber(samplesPerPixel, 1e3);
        bits = defaultNumber(bits, 16);
        if (isMono === null || isMono === void 0) {
          isMono = true;
        }
        if ([8, 16, 32].indexOf(bits) < 0) {
          throw new Error("Invalid number of bits specified for peaks.");
        }
        var numChan = source.numberOfChannels;
        var peaks = [];
        var c;
        var numPeaks;
        var channel;
        var slice;
        cueIn = defaultNumber(cueIn, 0);
        cueOut = defaultNumber(cueOut, source.length);
        if (typeof source.subarray === "undefined") {
          for (c = 0; c < numChan; c++) {
            channel = source.getChannelData(c);
            slice = channel.subarray(cueIn, cueOut);
            peaks.push(extractPeaks(slice, samplesPerPixel, bits));
          }
        } else {
          peaks.push(
            extractPeaks(source.subarray(cueIn, cueOut), samplesPerPixel, bits)
          );
        }
        if (isMono && peaks.length > 1) {
          peaks = makeMono(peaks, bits);
        }
        numPeaks = peaks[0].length / 2;
        return {
          length: numPeaks,
          data: peaks,
          bits
        };
      };
    }
  });

  // src/ui/theme.ts
  var darkTheme = {
    bgPrimary: "rgba(28, 28, 32, 0.95)",
    bgSecondary: "rgba(42, 42, 48, 0.98)",
    bgTertiary: "#35353d",
    bgHover: "rgba(255, 255, 255, 0.08)",
    bgActive: "rgba(255, 255, 255, 0.12)",
    textPrimary: "#f0f0f2",
    textSecondary: "#a8a8b0",
    textMuted: "#68687a",
    border: "rgba(255, 255, 255, 0.1)",
    borderHover: "rgba(255, 255, 255, 0.2)",
    accent: "#5b9fff",
    accentHover: "#7db3ff",
    shadow: "rgba(0, 0, 0, 0.4)"
  };
  var lightTheme = {
    bgPrimary: "rgba(250, 250, 252, 0.95)",
    bgSecondary: "rgba(255, 255, 255, 0.98)",
    bgTertiary: "#f0f0f5",
    bgHover: "rgba(0, 0, 0, 0.04)",
    bgActive: "rgba(0, 0, 0, 0.08)",
    textPrimary: "#1a1a24",
    textSecondary: "#5a5a6e",
    textMuted: "#9090a0",
    border: "rgba(0, 0, 0, 0.1)",
    borderHover: "rgba(0, 0, 0, 0.2)",
    accent: "#2563eb",
    accentHover: "#3b82f6",
    shadow: "rgba(0, 0, 0, 0.15)"
  };
  var themes = {
    dark: darkTheme,
    light: lightTheme
  };
  var PREFIX = "sm-annotate";
  function generateThemeCSS(theme) {
    return `
    --${PREFIX}-bg-primary: ${theme.bgPrimary};
    --${PREFIX}-bg-secondary: ${theme.bgSecondary};
    --${PREFIX}-bg-tertiary: ${theme.bgTertiary};
    --${PREFIX}-bg-hover: ${theme.bgHover};
    --${PREFIX}-bg-active: ${theme.bgActive};
    --${PREFIX}-text-primary: ${theme.textPrimary};
    --${PREFIX}-text-secondary: ${theme.textSecondary};
    --${PREFIX}-text-muted: ${theme.textMuted};
    --${PREFIX}-border: ${theme.border};
    --${PREFIX}-border-hover: ${theme.borderHover};
    --${PREFIX}-accent: ${theme.accent};
    --${PREFIX}-accent-hover: ${theme.accentHover};
    --${PREFIX}-shadow: ${theme.shadow};

    /* Customizable sizing and layout variables */
    --${PREFIX}-toolbar-radius: 8px;
    --${PREFIX}-toolbar-padding: 4px;
    --${PREFIX}-toolbar-gap: 2px;
    --${PREFIX}-btn-size: 32px;
    --${PREFIX}-btn-size-mobile: 44px;
    --${PREFIX}-btn-radius: 6px;
    --${PREFIX}-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
    --${PREFIX}-transition-duration: 0.15s;
    --${PREFIX}-z-index-toolbar: 10;
    --${PREFIX}-z-index-tooltip: 1000;
  `;
  }
  function generateStyles() {
    return `
    /* Root container for CSS isolation */
    .${PREFIX}-root {
      font-family: var(--${PREFIX}-font-family);
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .${PREFIX}-root *,
    .${PREFIX}-root *::before,
    .${PREFIX}-root *::after {
      box-sizing: border-box;
    }

    .${PREFIX}-container {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      display: inline-flex;
      flex-direction: row;
      align-items: center;
      flex-wrap: nowrap;
      gap: var(--${PREFIX}-toolbar-gap);
      padding: var(--${PREFIX}-toolbar-padding);
      background: var(--${PREFIX}-bg-primary);
      border: 1px solid var(--${PREFIX}-border);
      border-radius: var(--${PREFIX}-toolbar-radius);
      backdrop-filter: blur(12px);
      box-shadow: 0 4px 16px var(--${PREFIX}-shadow);
      z-index: var(--${PREFIX}-z-index-toolbar);
      margin-top: 8px;
      font-family: var(--${PREFIX}-font-family);
    }

    .${PREFIX}-player-controls {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      display: inline-flex;
      flex-direction: row;
      align-items: center;
      flex-wrap: nowrap;
      gap: var(--${PREFIX}-toolbar-gap);
      padding: var(--${PREFIX}-toolbar-padding);
      background: var(--${PREFIX}-bg-primary);
      border: 1px solid var(--${PREFIX}-border);
      border-radius: var(--${PREFIX}-toolbar-radius);
      backdrop-filter: blur(12px);
      box-shadow: 0 4px 16px var(--${PREFIX}-shadow);
      z-index: var(--${PREFIX}-z-index-toolbar);
      margin-bottom: 8px;
      font-family: var(--${PREFIX}-font-family);
    }

    /* ==================== LAYOUT MODES ==================== */

    /* Horizontal layout (default) - already styled above */
    .${PREFIX}-layout-horizontal .${PREFIX}-container {
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      flex-direction: row;
    }

    /* Vertical sidebar layout */
    .${PREFIX}-layout-vertical .${PREFIX}-container {
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      flex-direction: column;
      margin-top: 0;
      margin-left: 8px;
    }

    .${PREFIX}-layout-vertical.${PREFIX}-sidebar-right .${PREFIX}-container {
      left: auto;
      right: 0;
      margin-left: 0;
      margin-right: 8px;
    }

    .${PREFIX}-layout-vertical .${PREFIX}-divider {
      width: 20px;
      height: 1px;
      margin: 4px 0;
    }

    .${PREFIX}-layout-vertical .${PREFIX}-player-controls {
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      flex-direction: row;
    }

    /* Minimal/Floating layout */
    .${PREFIX}-layout-minimal .${PREFIX}-container {
      top: 8px;
      left: 8px;
      transform: none;
      flex-wrap: wrap;
      max-width: 200px;
      cursor: move;
      user-select: none;
    }

    .${PREFIX}-layout-minimal .${PREFIX}-container.${PREFIX}-dragging {
      opacity: 0.8;
    }

    .${PREFIX}-layout-minimal .${PREFIX}-player-controls {
      bottom: 8px;
      left: 50%;
      transform: translateX(-50%);
    }

    /* Bottom dock layout */
    .${PREFIX}-layout-bottom-dock .${PREFIX}-container {
      top: auto;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      margin-top: 0;
      margin-bottom: 8px;
      flex-direction: row;
    }

    .${PREFIX}-layout-bottom-dock .${PREFIX}-player-controls {
      display: none;
    }

    /* ==================== COLLAPSIBLE TOOLBARS ==================== */

    .${PREFIX}-collapsible {
      transition: transform var(--${PREFIX}-transition-duration) ease,
                  opacity var(--${PREFIX}-transition-duration) ease;
    }

    .${PREFIX}-collapsed {
      opacity: 0.3;
      pointer-events: none;
    }

    .${PREFIX}-collapsed:hover,
    .${PREFIX}-collapsed:focus-within {
      opacity: 1;
      pointer-events: auto;
    }

    /* Collapse direction based on layout */
    .${PREFIX}-layout-horizontal .${PREFIX}-container.${PREFIX}-collapsed {
      transform: translateX(-50%) translateY(-100%);
    }

    .${PREFIX}-layout-vertical .${PREFIX}-container.${PREFIX}-collapsed {
      transform: translateY(-50%) translateX(-100%);
    }

    .${PREFIX}-layout-vertical.${PREFIX}-sidebar-right .${PREFIX}-container.${PREFIX}-collapsed {
      transform: translateY(-50%) translateX(100%);
    }

    .${PREFIX}-layout-minimal .${PREFIX}-container.${PREFIX}-collapsed {
      transform: scale(0.8);
      opacity: 0.3;
    }

    .${PREFIX}-layout-bottom-dock .${PREFIX}-container.${PREFIX}-collapsed {
      transform: translateX(-50%) translateY(100%);
    }

    .${PREFIX}-collapse-btn {
      position: absolute;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--${PREFIX}-bg-secondary);
      border: 1px solid var(--${PREFIX}-border);
      border-radius: 50%;
      cursor: pointer;
      z-index: calc(var(--${PREFIX}-z-index-toolbar) + 1);
      transition: background var(--${PREFIX}-transition-duration) ease;
    }

    .${PREFIX}-collapse-btn:hover {
      background: var(--${PREFIX}-bg-hover);
    }

    .${PREFIX}-collapse-btn svg {
      width: 14px;
      height: 14px;
      color: var(--${PREFIX}-text-secondary);
      transition: transform var(--${PREFIX}-transition-duration) ease;
    }

    .${PREFIX}-collapsed + .${PREFIX}-collapse-btn svg {
      transform: rotate(180deg);
    }

    /* Collapse button position based on layout */
    .${PREFIX}-layout-horizontal .${PREFIX}-collapse-btn {
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-top: 4px;
    }

    .${PREFIX}-layout-vertical .${PREFIX}-collapse-btn {
      top: 50%;
      left: 100%;
      transform: translateY(-50%);
      margin-left: 4px;
    }

    .${PREFIX}-layout-vertical.${PREFIX}-sidebar-right .${PREFIX}-collapse-btn {
      left: auto;
      right: 100%;
      margin-left: 0;
      margin-right: 4px;
    }

    .${PREFIX}-layout-minimal .${PREFIX}-collapse-btn {
      top: -8px;
      right: -8px;
      left: auto;
      transform: none;
    }

    .${PREFIX}-layout-bottom-dock .${PREFIX}-collapse-btn {
      bottom: 100%;
      left: 50%;
      top: auto;
      transform: translateX(-50%);
      margin-bottom: 4px;
    }

    /* Fullscreen mode - toolbars inside the fullscreen container */
    :fullscreen .${PREFIX}-container,
    :-webkit-full-screen .${PREFIX}-container {
      position: fixed;
      top: 0;
      margin-top: 8px;
    }

    :fullscreen .${PREFIX}-player-controls,
    :-webkit-full-screen .${PREFIX}-player-controls {
      position: fixed;
      bottom: 0;
      margin-bottom: 8px;
    }

    .${PREFIX}-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      padding: 0;
      border: none;
      border-radius: 6px;
      background: transparent;
      color: var(--${PREFIX}-text-secondary);
      cursor: pointer;
      transition: background 0.15s ease, color 0.15s ease;
      outline: none;
    }

    .${PREFIX}-btn:hover {
      background: var(--${PREFIX}-bg-hover);
      color: var(--${PREFIX}-text-primary);
    }

    .${PREFIX}-btn:active {
      background: var(--${PREFIX}-bg-active);
    }

    .${PREFIX}-btn.active {
      background: var(--${PREFIX}-accent);
      color: #ffffff;
    }

    .${PREFIX}-btn.active:hover {
      background: var(--${PREFIX}-accent-hover);
    }

    .${PREFIX}-btn:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }

    .${PREFIX}-btn svg {
      width: 18px;
      height: 18px;
    }

    .${PREFIX}-divider {
      flex: 0 0 1px;
      width: 1px;
      height: 20px;
      margin: 0 4px;
      background: var(--${PREFIX}-border);
    }

    .${PREFIX}-color-picker {
      width: 32px;
      height: 32px;
      padding: 4px;
      border: none;
      border-radius: 6px;
      background: transparent;
      cursor: pointer;
      transition: background 0.15s ease;
    }

    .${PREFIX}-color-picker:hover {
      background: var(--${PREFIX}-bg-hover);
    }

    .${PREFIX}-color-picker::-webkit-color-swatch-wrapper {
      padding: 0;
    }

    .${PREFIX}-color-picker::-webkit-color-swatch {
      border: 2px solid var(--${PREFIX}-border);
      border-radius: 4px;
    }

    .${PREFIX}-color-picker:hover::-webkit-color-swatch {
      border-color: var(--${PREFIX}-border-hover);
    }

    .${PREFIX}-slider {
      width: 48px;
      height: 28px;
      padding: 0 8px;
      border: 1px solid var(--${PREFIX}-border);
      border-radius: 6px;
      background: var(--${PREFIX}-bg-secondary);
      color: var(--${PREFIX}-text-primary);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 12px;
      font-weight: 500;
      text-align: center;
      transition: border-color 0.15s ease;
    }

    .${PREFIX}-slider:hover {
      border-color: var(--${PREFIX}-border-hover);
    }

    .${PREFIX}-slider:focus {
      outline: none;
      border-color: var(--${PREFIX}-accent);
    }

    .${PREFIX}-group {
      display: inline-flex;
      align-items: center;
      gap: 2px;
    }

    .${PREFIX}-fullscreen-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      padding: 0;
      border: none;
      border-radius: 6px;
      background: transparent;
      color: var(--${PREFIX}-text-secondary);
      cursor: pointer;
      transition: background 0.15s ease, color 0.15s ease;
      outline: none;
    }

    .${PREFIX}-fullscreen-btn:hover {
      background: var(--${PREFIX}-bg-hover);
      color: var(--${PREFIX}-text-primary);
    }

    .${PREFIX}-fullscreen-btn svg {
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
      background: var(--${PREFIX}-bg-secondary);
      color: var(--${PREFIX}-text-primary);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 12px;
      font-weight: 500;
      line-height: 1.3;
      white-space: nowrap;
      border-radius: 6px;
      border: 1px solid var(--${PREFIX}-border);
      box-shadow: 0 4px 12px var(--${PREFIX}-shadow);
    }

    /* Tooltip arrow */
    [data-tooltip]::before {
      content: '';
      inset-block-end: calc(100% + 2px);
      inset-inline-start: 50%;
      translate: -50% 4px;
      border: 6px solid transparent;
      border-block-start-color: var(--${PREFIX}-bg-secondary);
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
      border-block-end-color: var(--${PREFIX}-bg-secondary);
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
      .${PREFIX}-container {
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

      .${PREFIX}-container::-webkit-scrollbar {
        display: none;
      }

      .${PREFIX}-player-controls {
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

      .${PREFIX}-player-controls::-webkit-scrollbar {
        display: none;
      }

      .${PREFIX}-btn {
        width: 44px;
        height: 44px;
        border-radius: 8px;
      }

      .${PREFIX}-btn svg {
        width: 22px;
        height: 22px;
      }

      .${PREFIX}-divider {
        height: 28px;
        margin: 0 6px;
      }

      .${PREFIX}-color-picker {
        width: 44px;
        height: 44px;
        padding: 6px;
        border-radius: 8px;
      }

      .${PREFIX}-slider {
        width: 56px;
        height: 36px;
        font-size: 14px;
        border-radius: 8px;
      }

      .${PREFIX}-fullscreen-btn {
        width: 44px;
        height: 44px;
        border-radius: 8px;
      }

      .${PREFIX}-fullscreen-btn svg {
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
    :fullscreen .${PREFIX}-container,
    :-webkit-full-screen .${PREFIX}-container {
      margin-top: max(8px, env(safe-area-inset-top, 8px));
    }

    :fullscreen .${PREFIX}-player-controls,
    :-webkit-full-screen .${PREFIX}-player-controls {
      margin-bottom: max(8px, env(safe-area-inset-bottom, 8px));
    }

    /* Mobile fullscreen - extra adjustments */
    @media (max-width: 960px) {
      :fullscreen .${PREFIX}-container,
      :-webkit-full-screen .${PREFIX}-container {
        margin-top: max(4px, env(safe-area-inset-top, 4px));
        padding-left: max(6px, env(safe-area-inset-left, 6px));
        padding-right: max(6px, env(safe-area-inset-right, 6px));
      }

      :fullscreen .${PREFIX}-player-controls,
      :-webkit-full-screen .${PREFIX}-player-controls {
        margin-bottom: max(4px, env(safe-area-inset-bottom, 4px));
        padding-left: max(6px, env(safe-area-inset-left, 6px));
        padding-right: max(6px, env(safe-area-inset-right, 6px));
      }
    }

    /* Landscape orientation on mobile - compact mode */
    @media (max-width: 960px) and (orientation: landscape) and (max-height: 500px) {
      .${PREFIX}-container {
        padding: 4px;
        gap: 2px;
      }

      .${PREFIX}-btn {
        width: 36px;
        height: 36px;
      }

      .${PREFIX}-btn svg {
        width: 18px;
        height: 18px;
      }

      .${PREFIX}-divider {
        height: 24px;
        margin: 0 4px;
      }

      .${PREFIX}-color-picker {
        width: 36px;
        height: 36px;
        padding: 4px;
      }

      .${PREFIX}-slider {
        width: 48px;
        height: 32px;
        font-size: 12px;
      }

      .${PREFIX}-fullscreen-btn {
        width: 36px;
        height: 36px;
      }

      .${PREFIX}-fullscreen-btn svg {
        width: 18px;
        height: 18px;
      }

      .${PREFIX}-player-controls {
        padding: 4px;
        gap: 2px;
      }
    }
  `;
  }
  var styleElement = null;
  function injectThemeStyles(theme = "dark") {
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = `${PREFIX}-theme-styles`;
      document.head.appendChild(styleElement);
    }
    const themeColors = themes[theme];
    styleElement.textContent = `
    :root {
      ${generateThemeCSS(themeColors)}
    }
    ${generateStyles()}
  `;
  }
  function applyButtonStyle(button) {
    button.classList.add(`${PREFIX}-btn`);
  }
  function applyContainerStyle(container) {
    container.classList.add(`${PREFIX}-container`);
  }
  function applyPlayerControlsStyle(container) {
    container.classList.add(`${PREFIX}-player-controls`);
  }
  function applyColorPickerStyle(input) {
    input.classList.add(`${PREFIX}-color-picker`);
  }
  function applySliderStyle(input) {
    input.classList.add(`${PREFIX}-slider`);
  }
  function applyFullscreenButtonStyle(button) {
    button.classList.add(`${PREFIX}-fullscreen-btn`);
  }
  function createDivider() {
    const divider = document.createElement("div");
    divider.classList.add(`${PREFIX}-divider`);
    return divider;
  }
  function getCSSPrefix() {
    return PREFIX;
  }
  function createThemeToggleButton(tool) {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.tooltip = "Toggle theme";
    applyButtonStyle(button);
    const updateIcon = () => {
      const isDark = tool.theme === "dark";
      button.innerHTML = isDark ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>` : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>`;
    };
    updateIcon();
    tool.addEvent(button, "click", () => {
      tool.setTheme(tool.theme === "dark" ? "light" : "dark");
      updateIcon();
    });
    return button;
  }

  // src/ui/download-current-frame-button.ts
  function createDownloadCurrentFrameButton(video2, tool) {
    const button = document.createElement("button");
    button.type = "button";
    applyButtonStyle(button);
    button.style.float = "right";
    button.dataset.tooltip = "Download frame";
    button.dataset.tooltipPosition = "bottom";
    button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>';
    tool.addEvent(button, "click", () => {
      const url = tool.frameToDataUrl();
      if (!url) return;
      const link = document.createElement("a");
      link.download = `frame_${String(tool.activeTimeFrame).padStart(3, "0")}.png`;
      link.href = url;
      link.click();
    });
    tool.buttons.push(button);
    tool.playerControlsContainer.appendChild(button);
  }

  // src/ui/mute-unmute-button.ts
  var muteIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume-x"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="22" x2="16" y1="9" y2="15"></line><line x1="16" x2="22" y1="9" y2="15"></line></svg>';
  var unmuteIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume-2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>';
  function createMuteUnmuteButton(video2, tool) {
    const button = document.createElement("button");
    button.type = "button";
    applyButtonStyle(button);
    button.dataset.tooltip = "Mute/Unmute";
    button.dataset.tooltipPosition = "bottom";
    if (video2.muted || video2.volume === 0) {
      button.innerHTML = muteIcon;
    } else {
      button.innerHTML = unmuteIcon;
    }
    tool.addEvent(video2, "volumechange", () => {
      if (video2.muted || video2.volume === 0) {
        button.innerHTML = muteIcon;
      } else {
        button.innerHTML = unmuteIcon;
      }
    });
    tool.addEvent(button, "click", () => {
      if (video2.muted) {
        video2.muted = false;
        return;
      }
      if (video2.volume === 0) {
        video2.volume = 1;
      } else {
        video2.volume = 0;
      }
    });
    tool.buttons.push(button);
    tool.playerControlsContainer.appendChild(button);
  }

  // src/ui/overlay-opacity-button.ts
  var OPACITY_STATES = [
    { value: 0, label: "off" },
    { value: 0.25, label: "25%" },
    { value: 0.5, label: "50%" },
    { value: 0.7, label: "70%" },
    { value: 1, label: "100%" }
  ];
  function iconForOpacity(state, isShapeMode = false) {
    const shapeIndicator = isShapeMode ? '<circle cx="18" cy="6" r="4" fill="currentColor" opacity="0.7"/>' : "";
    return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <style>
      .label {
        font-family: sans-serif;
        font-size: 9px;
      }
    </style>
    <rect x="3" y="3" width="18" height="18" rx="2" opacity="${state.value === 0 ? 0.3 : state.value}"/>
    <text x="12" y="14" text-anchor="middle" class="label" fill="currentColor">${state.label}</text>
    ${shapeIndicator}
  </svg>`;
  }
  function findStateIndex(opacity) {
    const index = OPACITY_STATES.findIndex((s) => s.value === opacity);
    return index === -1 ? 4 : index;
  }
  function createOverlayOpacityButton(tool) {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.tooltip = "Opacity";
    let overlayIndex = findStateIndex(tool.overlayOpacity);
    const updateButton = () => {
      const movePlugin = tool.currentTool === "move" ? tool.pluginForTool("move") : null;
      const selectedShape = movePlugin?.getSelectedShape();
      if (selectedShape) {
        const shapeOpacity = selectedShape.opacity ?? 1;
        const stateIndex = findStateIndex(shapeOpacity);
        button.innerHTML = iconForOpacity(OPACITY_STATES[stateIndex], true);
        button.dataset.tooltip = "Shape opacity";
      } else {
        button.innerHTML = iconForOpacity(OPACITY_STATES[overlayIndex], false);
        button.dataset.tooltip = "Overlay opacity";
      }
    };
    updateButton();
    applyButtonStyle(button);
    tool.addEvent(button, "click", () => {
      const movePlugin = tool.currentTool === "move" ? tool.pluginForTool("move") : null;
      const selectedShape = movePlugin?.getSelectedShape();
      if (selectedShape && movePlugin) {
        const currentOpacity = selectedShape.opacity ?? 1;
        let shapeIndex = findStateIndex(currentOpacity);
        shapeIndex = (shapeIndex + 1) % OPACITY_STATES.length;
        const newOpacity = OPACITY_STATES[shapeIndex].value;
        movePlugin.setSelectedShapeOpacity(newOpacity);
      } else {
        overlayIndex = (overlayIndex + 1) % OPACITY_STATES.length;
        tool.overlayOpacity = OPACITY_STATES[overlayIndex].value;
        tool.redrawFullCanvas();
      }
      updateButton();
    });
    const originalRedraw = tool.redrawFullCanvas.bind(tool);
    tool.redrawFullCanvas = () => {
      originalRedraw();
      updateButton();
    };
    tool.buttons.push(button);
    tool.uiContainer.appendChild(button);
    return button;
  }

  // src/ui/play-pause-button.ts
  var playIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
  var pauseIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pause"><rect width="4" height="16" x="6" y="4"></rect><rect width="4" height="16" x="14" y="4"></rect></svg>';
  function createPlayPauseButton(video2, tool) {
    const button = document.createElement("button");
    button.type = "button";
    button.innerHTML = playIcon;
    applyButtonStyle(button);
    button.dataset.tooltip = "Play/Pause";
    button.dataset.tooltipPosition = "bottom";
    tool.addEvent(video2, "play", () => {
      button.innerHTML = pauseIcon;
    });
    tool.addEvent(video2, "pause", () => {
      button.innerHTML = playIcon;
    });
    tool.addEvent(button, "click", () => {
      tool.withRefVideo((refVideo) => {
        if (refVideo.paused) {
          refVideo.play().then(() => {
            tool.showButton("compare");
          });
        }
      });
      if (video2.paused) {
        video2.play().then(() => {
          tool.redrawFullCanvas();
        });
      } else {
        video2.pause();
        tool.raf(() => {
          tool.redrawFullCanvas();
        });
      }
    });
    tool.buttons.push(button);
    tool.playerControlsContainer.appendChild(button);
  }

  // src/ui/playback-speed-button.ts
  function iconForSpeed(speed) {
    const ratioMap = {
      "0.25": "\xBC",
      "0.5": "\xBD",
      "0.75": "\xBE",
      "1": "1\xD7"
    };
    return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-superscript">
        <style>
            .small {
                font-family: auto;
                font-size: ${speed === 1 ? "16" : "24"}px;
            }
        </style>
        <text x="${speed === 1 ? 3 : 2}" y="${speed === 1 ? 17 : 20}" font-weight="normal" class="small">${ratioMap[String(speed)]}</text>
        
    </svg>`;
  }
  function createPlaybackSpeedControlButton(video2, tool) {
    const states = [0.25, 0.5, 0.75, 1];
    const button = document.createElement("button");
    const defaultState = states[states.length - 1];
    button.type = "button";
    video2.playbackRate = defaultState;
    button.innerHTML = iconForSpeed(defaultState);
    applyButtonStyle(button);
    button.dataset.tooltip = "Playback speed";
    button.dataset.tooltipPosition = "bottom";
    tool.addEvent(button, "click", () => {
      const currentState = states.indexOf(video2.playbackRate);
      const nextState = currentState + 1 >= states.length ? 0 : currentState + 1;
      video2.playbackRate = states[nextState];
      button.innerHTML = iconForSpeed(states[nextState]);
    });
    tool.buttons.push(button);
    tool.playerControlsContainer.appendChild(button);
  }

  // src/buttons.ts
  var LONG_PRESS_DURATION = 500;
  function setupLongPress(button, tool, onLongPress) {
    let longPressTimer = null;
    let isLongPress = false;
    const onPointerDown = () => {
      isLongPress = false;
      longPressTimer = setTimeout(() => {
        isLongPress = true;
        onLongPress();
        tool.redrawFullCanvas();
      }, LONG_PRESS_DURATION);
    };
    const onPointerUp = () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }
    };
    const onPointerLeave = () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }
    };
    const onClick = (e) => {
      if (isLongPress) {
        e.preventDefault();
        e.stopImmediatePropagation();
        isLongPress = false;
      }
    };
    tool.addEvent(button, "click", onClick);
    button.addEventListener("pointerdown", onPointerDown);
    button.addEventListener("pointerup", onPointerUp);
    button.addEventListener("pointerleave", onPointerLeave);
    tool.destructors.push(() => {
      button.removeEventListener("pointerdown", onPointerDown);
      button.removeEventListener("pointerup", onPointerUp);
      button.removeEventListener("pointerleave", onPointerLeave);
      if (longPressTimer) {
        clearTimeout(longPressTimer);
      }
    });
  }
  var ButtonConstructor = class {
    constructor(tool, container) {
      this.create = (icon, tool, container = this.uiContainer, tooltip, tooltipPosition = "top") => {
        const button = document.createElement("button");
        button.type = "button";
        button.innerHTML = icon;
        applyButtonStyle(button);
        if (tooltip) {
          button.dataset.tooltip = tooltip;
          if (tooltipPosition === "bottom") {
            button.dataset.tooltipPosition = "bottom";
          }
        }
        container.appendChild(button);
        this.buttons.push(button);
        if (typeof tool === "function") {
          this.addEvent(button, "click", tool);
        } else {
          button.dataset.tool = tool;
          const onClick = () => {
            if (this.currentTool === tool) {
              this.currentTool = null;
            } else {
              this.currentTool = tool;
            }
          };
          try {
            this.tool.pluginForTool(tool);
            this.addEvent(button, "click", onClick);
          } catch (e) {
            console.error(e);
            button.disabled = true;
          }
        }
        return button;
      };
      this.tool = tool;
      this.uiContainer = container;
    }
    get buttons() {
      return this.tool.buttons;
    }
    get addEvent() {
      return this.tool.addEvent.bind(this.tool);
    }
    get currentTool() {
      return this.tool.currentTool;
    }
    set currentTool(value) {
      this.tool.currentTool = value;
    }
  };
  function addButtons(tool, Button) {
    const video2 = tool.videoElement.tagName === "VIDEO" ? tool.videoElement : null;
    Button.create(
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>',
      "rectangle",
      Button.uiContainer,
      "Rectangle"
    );
    Button.create(
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>',
      "circle",
      Button.uiContainer,
      "Circle"
    );
    Button.create(
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.3 8.7 8.7 21.3c-1 1-2.5 1-3.4 0l-2.6-2.6c-1-1-1-2.5 0-3.4L15.3 2.7c1-1 2.5-1 3.4 0l2.6 2.6c1 1 1 2.5 0 3.4Z"></path><path d="m7.5 10.5 2 2"></path><path d="m10.5 7.5 2 2"></path><path d="m13.5 4.5 2 2"></path><path d="m4.5 13.5 2 2"></path></svg>',
      "line",
      Button.uiContainer,
      "Line"
    );
    Button.create(
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"></path><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"></path></svg>',
      "curve",
      Button.uiContainer,
      "Freehand"
    );
    Button.create(
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>',
      "arrow",
      Button.uiContainer,
      "Arrow"
    );
    Button.create(
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>',
      "text",
      Button.uiContainer,
      "Text"
    );
    Button.create(
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"></path><path d="M22 21H7"></path><path d="m5 11 9 9"></path></svg>',
      "eraser",
      Button.uiContainer,
      "Eraser"
    );
    Button.uiContainer.appendChild(createDivider());
    Button.create(
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 9 2 12 5 15"></polyline><polyline points="9 5 12 2 15 5"></polyline><polyline points="15 19 12 22 9 19"></polyline><polyline points="19 9 22 12 19 15"></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line></svg>',
      "move",
      Button.uiContainer,
      "Move shape"
    );
    Button.create(
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-flip-horizontal"><path d="M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3"></path><path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3"></path><path d="M12 20v2"></path><path d="M12 14v2"></path><path d="M12 8v2"></path><path d="M12 2v2"></path></svg>',
      "compare",
      Button.uiContainer,
      "Compare videos"
    );
    createOverlayOpacityButton(tool);
    Button.create(
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"></path><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path></svg>',
      () => {
        tool.handleUndo();
      },
      Button.uiContainer,
      "Undo (Ctrl+Z)"
    );
    if (video2) {
      const prevFrameBtn = Button.create(
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>',
        () => {
          tool.prevFrame();
        },
        tool.playerControlsContainer,
        "Previous frame (hold for annotation)",
        "bottom"
      );
      setupLongPress(prevFrameBtn, tool, () => tool.prevAnnotatedFrame());
      createPlayPauseButton(video2, tool);
      const nextFrameBtn = Button.create(
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>',
        () => {
          tool.nextFrame();
        },
        tool.playerControlsContainer,
        "Next frame (hold for annotation)",
        "bottom"
      );
      setupLongPress(nextFrameBtn, tool, () => tool.nextAnnotatedFrame());
      createMuteUnmuteButton(video2, tool);
      createPlaybackSpeedControlButton(video2, tool);
      createDownloadCurrentFrameButton(video2, tool);
    }
    Button.create(
      `<svg viewBox="0 0 24 24" width="24" height="24">
      <path fill="currentColor" d="M3 3h18v18H3V3m2 2v14h14V5H5z"/>
      <path fill="currentColor" d="M7 7h10v10H7V7m2 2v6h6V9H9z"/>
    </svg>`,
      "selection",
      Button.uiContainer,
      "Select region"
    );
  }

  // src/events/utils/index.ts
  var isTargetBelongsToVideo = (event, tool) => {
    const isBody = event.target === document.body;
    const isTool = tool.uiContainer.contains(event.target);
    const isControl = tool.playerControlsContainer.contains(event.target);
    const isVideo = tool.videoElement.contains(event.target);
    const isCanvas = tool.canvas.contains(event.target);
    return isTool || isControl || isVideo || isCanvas || isBody;
  };
  function isMultiTouch(event) {
    if (event.pointerType === "pen") {
      return false;
    }
    return event.pointerType === "touch" && event.isPrimary === false;
  }

  // src/events/document-click.ts
  function onDocumentClick(event, tool) {
    if (!isTargetBelongsToVideo(event, tool)) {
      return;
    }
    const isTool = tool.uiContainer.contains(event.target);
    const isControl = tool.playerControlsContainer.contains(event.target);
    if (isTool || isControl) {
      return;
    }
    const video2 = tool.videoElement;
    if (video2.tagName !== "VIDEO") {
      return;
    }
    if (video2.paused) {
      return;
    }
    tool.currentTool = null;
    video2.pause();
    tool.raf(async () => {
      tool.redrawFullCanvas();
    });
  }

  // src/events/document-copy.ts
  function onDocumentCopy(event, tool) {
    if (!isTargetBelongsToVideo(event, tool)) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    event.clipboardData?.setData(
      "application/json",
      JSON.stringify(tool.saveCurrentFrame())
    );
  }

  // src/events/document-cut.ts
  function onDocumentCut(event, tool) {
    if (!isTargetBelongsToVideo(event, tool)) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    const data = tool.saveCurrentFrame();
    tool.replaceFrame(tool.playbackFrame, []);
    tool.redrawFullCanvas();
    event.clipboardData?.setData("application/json", JSON.stringify(data));
  }

  // src/events/document-keydown.ts
  function onDocumentKeydown(event, tool) {
    if (!isTargetBelongsToVideo(event, tool)) {
      return;
    }
    const video2 = tool.videoElement;
    if (video2.tagName !== "VIDEO") {
      return;
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      if (event.key === "ArrowLeft") {
        tool.prevFrame();
      } else if (event.key === "ArrowRight") {
        tool.nextFrame();
      }
    } else if (event.code === "Space") {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      if (video2.paused) {
        video2.play().then(() => {
          tool.redrawFullCanvas();
        });
      } else {
        video2.pause();
        tool.raf(() => {
          tool.redrawFullCanvas();
        });
      }
    }
  }

  // src/events/document-paste.ts
  function onDocumentPaste(event, tool) {
    if (!isTargetBelongsToVideo(event, tool)) {
      return;
    }
    const dataTypes = event.clipboardData?.types ?? [];
    if (dataTypes.includes("application/json")) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    } else if (dataTypes.includes("Files")) {
      const files = event.clipboardData?.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (file.type.startsWith("image/")) {
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
          const img = new Image();
          const blobUrl = URL.createObjectURL(file);
          img.addEventListener(
            "load",
            () => {
              URL.revokeObjectURL(blobUrl);
              const imageRatio = img.naturalWidth / img.naturalHeight;
              const pasteWidth = 0.25;
              const pasteHeight = pasteWidth / imageRatio * tool.aspectRatio;
              tool.addShapesToFrame(tool.playbackFrame, [
                {
                  type: "image",
                  image: img,
                  x: 0,
                  y: 0,
                  width: pasteWidth,
                  height: pasteHeight,
                  strokeStyle: "red",
                  fillStyle: "red",
                  lineWidth: 2
                }
              ]);
              tool.redrawFullCanvas();
              tool.raf(() => {
                tool.show();
              });
              tool.currentTool = "move";
            },
            {
              once: true
            }
          );
          img.addEventListener(
            "error",
            () => {
              URL.revokeObjectURL(blobUrl);
            },
            {
              once: true
            }
          );
          img.src = blobUrl;
          tool.redrawFullCanvas();
        }
      }
    } else if (dataTypes.includes("text/plain")) {
      const text = event.clipboardData?.getData("text/plain");
      if (text) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        tool.addShapesToFrame(tool.playbackFrame, [
          {
            type: "text",
            text,
            x: 0.4,
            y: 0.4,
            strokeStyle: tool.ctx.strokeStyle,
            fillStyle: tool.ctx.fillStyle,
            lineWidth: tool.ctx.lineWidth
          }
        ]);
        tool.show();
        tool.currentTool = "move";
        tool.redrawFullCanvas();
      }
    } else {
      return;
    }
    const json = event.clipboardData?.getData("application/json");
    if (!json) {
      return;
    }
    const data = JSON.parse(json);
    if (!data) {
      return;
    }
    if (!data.shapes) {
      return;
    }
    if (data.version !== 1) {
      return;
    }
    tool.addShapesToFrame(tool.playbackFrame, data.shapes);
    tool.redrawFullCanvas();
  }

  // src/plugins/utils/color-map.ts
  var colorMap = {
    r: "#d31a3b",
    g: "#15d33b",
    b: "#0085CA",
    y: "#F3CE32",
    "a": "#7fffd4",
    // "b": "#0000ff",
    "c": "#00ffff",
    "d": "#696969",
    "e": "#50c878",
    "f": "#ff00ff",
    // "g": "#008000",
    "h": "#f0fff0",
    "i": "#4b0082",
    "j": "#00a86b",
    "k": "#f0e68c",
    "l": "#e6e6fa",
    "m": "#98ff98",
    "n": "#000080",
    "o": "#ffa500",
    "p": "#800080",
    "q": "#e5acc8",
    // "r": "#e0115f",
    "s": "#0f52ba",
    "t": "#008080",
    "u": "#3f00ff",
    "v": "#ee82ee",
    "w": "#ffffff",
    "x": "#738678",
    // "y": "#ffff00",
    "z": "#0014a8"
  };

  // src/ui/color-picker.ts
  function createColorPicker(defaultColor2, tool) {
    const colorPicker = document.createElement("input");
    colorPicker.type = "color";
    colorPicker.value = defaultColor2;
    colorPicker.dataset.tooltip = "Stroke color";
    const onColorChange = (event) => {
      tool.ctx.strokeStyle = event.target.value;
      tool.ctx.fillStyle = event.target.value;
      tool.focusOnMediaNode();
    };
    tool.addEvent(colorPicker, "input", onColorChange);
    return colorPicker;
  }

  // src/ui/stroke-width-slider.ts
  function createStrokeWidthSlider(tool) {
    const strokeWidthSlider = document.createElement("input");
    strokeWidthSlider.type = "number";
    strokeWidthSlider.step = "1";
    strokeWidthSlider.min = "1";
    strokeWidthSlider.max = "10";
    strokeWidthSlider.value = "5";
    strokeWidthSlider.style.margin = "5px";
    strokeWidthSlider.dataset.tooltip = "Stroke width";
    const onStrokeWidthChange = (event) => {
      tool.ctx.lineWidth = event.target.valueAsNumber;
      tool.focusOnMediaNode();
    };
    tool.addEvent(strokeWidthSlider, "input", onStrokeWidthChange);
    return strokeWidthSlider;
  }

  // src/ui/toggle-fullscreen-button.ts
  var fullscreenIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
</svg>`;
  function getFullscreenElement() {
    return document.fullscreenElement ?? document.webkitFullscreenElement ?? null;
  }
  function requestFullscreen(element) {
    if (element.requestFullscreen) {
      return element.requestFullscreen();
    }
    const el = element;
    if (el.webkitRequestFullscreen) {
      return el.webkitRequestFullscreen();
    }
  }
  function exitFullscreen() {
    if (document.exitFullscreen) {
      return document.exitFullscreen();
    }
    const doc = document;
    if (doc.webkitExitFullscreen) {
      return doc.webkitExitFullscreen();
    }
  }
  function isFullscreenSupported() {
    return !!(document.fullscreenEnabled ?? document.webkitFullscreenEnabled);
  }
  function createFullscreenButton(tool) {
    const button = document.createElement("button");
    button.innerHTML = fullscreenIcon;
    button.type = "button";
    button.dataset.tooltip = "Fullscreen";
    button.dataset.tooltipPosition = "bottom";
    applyFullscreenButtonStyle(button);
    if (!isFullscreenSupported()) {
      button.style.display = "none";
      return button;
    }
    const toggleFullScreen = () => {
      if (!getFullscreenElement()) {
        const container = tool.videoElement.parentElement;
        if (container) {
          requestFullscreen(container);
        }
      } else {
        exitFullscreen();
      }
    };
    button.addEventListener("click", toggleFullScreen);
    const onFullscreenChange = () => {
      tool.setCanvasSize();
      tool.playbackFrame = tool.playbackFrame;
      tool.canvas.focus();
      tool.redrawFullCanvas();
      button.blur();
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("webkitfullscreenchange", onFullscreenChange);
    tool.destructors.push(() => {
      button.removeEventListener("click", toggleFullScreen);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", onFullscreenChange);
    });
    return button;
  }

  // src/ui.ts
  var defaultColor = colorMap.r;
  var playerControlsDefaultStyle = "";
  var uiContainerDefaultStyle = "";
  function initUI() {
    const uiContainer = document.createElement("div");
    uiContainer.style.cssText = uiContainerDefaultStyle;
    applyContainerStyle(uiContainer);
    this.canvas.parentNode?.insertBefore(uiContainer, this.canvas);
    const playerControls = document.createElement("div");
    playerControls.style.cssText = playerControlsDefaultStyle;
    applyPlayerControlsStyle(playerControls);
    this.canvas.parentNode?.insertBefore(playerControls, this.canvas.nextSibling);
    this.playerControlsContainer = playerControls;
    const video2 = this.videoElement.tagName === "VIDEO" ? this.videoElement : null;
    this.uiContainer = uiContainer;
    const createWrapper = () => {
      const wrapper = document.createElement("div");
      wrapper.style.display = "inline-flex";
      wrapper.style.alignItems = "center";
      return wrapper;
    };
    const Button = new ButtonConstructor(this, uiContainer);
    addButtons(this, Button);
    if (this.isMobile) {
      this.hideButton("line");
      this.hideButton("circle");
      this.hideButton("rectangle");
      this.hideButton("eraser");
    }
    this.hideButton("compare");
    uiContainer.appendChild(createDivider());
    this.colorPicker = createColorPicker(defaultColor, this);
    applyColorPickerStyle(this.colorPicker);
    uiContainer.appendChild(this.colorPicker);
    const strokeControlWrapper = createWrapper();
    this.strokeSizePicker = createStrokeWidthSlider(this);
    applySliderStyle(this.strokeSizePicker);
    strokeControlWrapper.appendChild(this.strokeSizePicker);
    uiContainer.appendChild(strokeControlWrapper);
    uiContainer.appendChild(createDivider());
    const themeToggleBtn = createThemeToggleButton(this);
    uiContainer.appendChild(themeToggleBtn);
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
        if (video2.currentTime < 2e-4 && !video2.paused) {
          this.startAnnotationsAsVideo();
        }
      });
      this.addEvent(video2, "error", () => {
        this.hide();
      });
      this.addEvent(video2, "stalled", () => {
        this.hide();
      });
      this.addEvent(video2, "play", () => {
        this.hideControls();
        this.startAnnotationsAsVideo();
      });
      this.addEvent(document, "copy", (event) => {
        onDocumentCopy(event, this);
      });
      this.addEvent(document, "cut", (event) => {
        onDocumentCut(event, this);
      });
      this.addEvent(document, "paste", (event) => {
        onDocumentPaste(event, this);
      });
      this.addEvent(document, "click", (event) => {
        onDocumentClick(event, this);
      });
      this.addEvent(document, "keydown", (event) => {
        onDocumentKeydown(event, this);
      });
      this.addEvent(document.body.querySelector("div"), "drop", (event) => {
        if (event.dataTransfer?.types) {
        }
      });
      const fullscreenButton = createFullscreenButton(this);
      playerControls.appendChild(fullscreenButton);
    }
  }

  // src/canvas.ts
  function initCanvas() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.videoElement.parentNode?.insertBefore(
      this.canvas,
      this.videoElement.nextSibling
    );
    this.canvas.style.position = "absolute";
    this.canvas.style.backgroundColor = "transparent";
    this.canvas.style.top = "0";
    this.canvas.style.left = "0";
    this.canvas.style.zIndex = "1";
    this.addEvent(this.canvas, "pointerdown", this.handleMouseDown);
    this.addEvent(this.canvas, "pointermove", this.handleMouseMove);
    this.addEvent(this.canvas, "pointerup", this.handleMouseUp);
    this.addEvent(this.canvas, "pointercancel", this.handleMouseUp);
    this.addEvent(this.canvas, "pointerenter", () => {
      this.isCursorOverCanvas = true;
    });
    this.addEvent(this.canvas, "pointerleave", () => {
      this.isCursorOverCanvas = false;
    });
    this.addEvent(this.canvas, "touchmove", (e) => {
      e.stopImmediatePropagation();
      e.stopPropagation();
      e.preventDefault();
    });
    this.addEvent(window, "resize", this.setCanvasSize);
    this.addEvent(document, "keydown", this.onKeyDown);
  }

  // src/base.ts
  var AnnotationToolBase = class {
    constructor() {
      this.destructors = [];
      this.isDestroyed = false;
      this.activeTimeFrame = 1;
      this.globalShapes = [];
      this.timeStack = /* @__PURE__ */ new Map();
      // timeFrame -> shapes
      this.undoTimeStack = /* @__PURE__ */ new Map();
    }
    // timeFrame -> shapes
    cleanFrameStacks() {
      this.timeStack.clear();
      this.undoTimeStack.clear();
    }
    destroy() {
      this.destructors.forEach((destructor) => destructor());
      this.destructors = [];
      this.globalShapes = [];
      this.cleanFrameStacks();
    }
    raf(cb) {
      return requestAnimationFrame(cb);
    }
    addEvent(node, event, callback) {
      const safeCallback = (e) => {
        if (this.isDestroyed) return;
        callback(e);
      };
      node.addEventListener(event, safeCallback);
      this.destructors.push(() => {
        node.removeEventListener(event, safeCallback);
      });
    }
    addProgressBarOverlay() {
      throw new Error("Method not implemented.");
    }
    initUI() {
      throw new Error("Method not implemented.");
    }
    initCanvas() {
      throw new Error("Method not implemented.");
    }
    addFrameSquareOverlay(_ = this.activeTimeFrame) {
      throw new Error("Method not implemented.");
    }
    addVideoOverlay() {
      throw new Error("Method not implemented.");
    }
    withRefVideo(cb) {
      if (this.isDestroyed) {
        return;
      }
      if (this.referenceVideoElement) {
        cb(this.referenceVideoElement);
      }
    }
    withVideo(cb) {
      if (this.isDestroyed) {
        return;
      }
      const video2 = this.videoElement;
      if (!video2 || video2.tagName !== "VIDEO") {
        return;
      }
      cb(video2);
    }
  };

  // src/plugins/base.ts
  var BasePlugin = class {
    constructor(annotationTool) {
      this.startX = 0;
      this.startY = 0;
      this.isDrawing = false;
      this.annotationTool = annotationTool;
    }
    isPointerAtShape(_shape, _x, _y) {
      return false;
    }
    on(event, arg) {
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
    /**
     * Apply rotation transform before drawing a shape.
     * Must be paired with restoreRotation() after drawing.
     * @param shape The shape being drawn
     * @param centerX The rotation center X in canvas coordinates
     * @param centerY The rotation center Y in canvas coordinates
     * @returns true if rotation was applied (and restore is needed)
     */
    applyRotation(shape, centerX, centerY) {
      if (!shape.rotation) {
        return false;
      }
      this.ctx.save();
      this.ctx.translate(centerX, centerY);
      this.ctx.rotate(shape.rotation);
      this.ctx.translate(-centerX, -centerY);
      return true;
    }
    /**
     * Restore canvas state after rotation. Only call if applyRotation returned true.
     */
    restoreRotation() {
      this.ctx.restore();
    }
    /**
     * Get the rotation center for a shape in canvas coordinates.
     * Uses custom center if set, otherwise uses provided default center.
     * @param shape The shape
     * @param defaultCenterX Default center X in canvas coordinates
     * @param defaultCenterY Default center Y in canvas coordinates
     */
    getRotationCenter(shape, defaultCenterX, defaultCenterY) {
      if (shape.rotationCenterX !== void 0 && shape.rotationCenterY !== void 0) {
        return {
          x: shape.rotationCenterX * this.annotationTool.canvasWidth,
          y: shape.rotationCenterY * this.annotationTool.canvasHeight
        };
      }
      return { x: defaultCenterX, y: defaultCenterY };
    }
  };

  // src/plugins/rectangle.ts
  var RectangleToolPlugin = class extends BasePlugin {
    constructor() {
      super(...arguments);
      this.name = "rectangle";
    }
    move(shape, dx, dy) {
      shape.x += dx;
      shape.y += dy;
      return shape;
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
      const centerX = shape.x + shape.width / 2;
      const centerY = shape.y + shape.height / 2;
      const rotationCenter = this.getRotationCenter(shape, centerX, centerY);
      const rotated = this.applyRotation(shape, rotationCenter.x, rotationCenter.y);
      this.drawRectangle(shape.x, shape.y, shape.width, shape.height);
      if (rotated) {
        this.restoreRotation();
      }
    }
    isPointerAtShape(shape, x, y) {
      const tolerance = 5;
      const minX = Math.min(shape.x, shape.x + shape.width);
      const maxX = Math.max(shape.x, shape.x + shape.width);
      const minY = Math.min(shape.y, shape.y + shape.height);
      const maxY = Math.max(shape.y, shape.y + shape.height);
      const nearLeftEdge = Math.abs(x - minX) <= tolerance;
      const nearRightEdge = Math.abs(x - maxX) <= tolerance;
      const nearTopEdge = Math.abs(y - minY) <= tolerance;
      const nearBottomEdge = Math.abs(y - maxY) <= tolerance;
      const withinVerticalBounds = y >= minY - tolerance && y <= maxY + tolerance;
      const withinHorizontalBounds = x >= minX - tolerance && x <= maxX + tolerance;
      return (nearLeftEdge || nearRightEdge) && withinVerticalBounds || (nearTopEdge || nearBottomEdge) && withinHorizontalBounds;
    }
  };

  // src/plugins/circle.ts
  var CircleToolPlugin = class extends BasePlugin {
    constructor() {
      super(...arguments);
      this.name = "circle";
    }
    move(shape, dx, dy) {
      shape.x += dx;
      shape.y += dy;
      return shape;
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
      if (shape.radius === void 0 || shape.radius < 0) {
        return;
      }
      const rotationCenter = this.getRotationCenter(shape, shape.x, shape.y);
      const rotated = this.applyRotation(shape, rotationCenter.x, rotationCenter.y);
      this.drawCircle(shape.x, shape.y, shape.radius);
      if (rotated) {
        this.restoreRotation();
      }
    }
    isPointerAtShape(shape, x, y) {
      if (shape.radius === void 0 || shape.radius < 0) return false;
      const dx = x - shape.x;
      const dy = y - shape.y;
      const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);
      const tolerance = Math.max((shape.lineWidth ?? 1) / 2, 5);
      return distanceFromCenter <= shape.radius + tolerance;
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
    if (points.length <= 2) return points;
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
      this.zoomScale = 2;
      // Controls the magnification level
      this.zoomRadius = 100;
      // Radius of the zoom circle
      this.zoomCtx = null;
      // Context for the zoom canvas
      this.zoomCanvas = null;
      this.onKeyPress = (e) => {
        const key = e.key;
        if (key === null || key === " " || e.isComposing) {
          return;
        }
        const maybeNumeric = Number(key);
        if (isNaN(maybeNumeric) || !maybeNumeric) {
          if (key in colorMap) {
            this.annotationTool.colorPicker.value = colorMap[key];
            this.annotationTool.setCanvasSettings();
          }
          return;
        }
        this.annotationTool.strokeSizePicker.value = key;
        this.annotationTool.setCanvasSettings();
      };
    }
    // Zoom canvas element
    move(shape, dx, dy) {
      shape.points = shape.points.map((point) => ({
        x: point.x + dx,
        y: point.y + dy
      }));
      return shape;
    }
    onActivate() {
      this.initZoomCanvas();
      document.addEventListener("keypress", this.onKeyPress);
    }
    onDeactivate() {
      this.zoomCtx = null;
      this.zoomCanvas = null;
      document.removeEventListener("keypress", this.onKeyPress);
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
      if (!shape.points || shape.points.length === 0) {
        return;
      }
      let sumX = 0, sumY = 0;
      for (const p2 of shape.points) {
        sumX += p2.x;
        sumY += p2.y;
      }
      const centerX = sumX / shape.points.length;
      const centerY = sumY / shape.points.length;
      const rotationCenter = this.getRotationCenter(shape, centerX, centerY);
      const rotated = this.applyRotation(shape, rotationCenter.x, rotationCenter.y);
      this.drawCurve(shape);
      if (rotated) {
        this.restoreRotation();
      }
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
      const { x, y } = this.annotationTool.getRelativeCoords(event);
      if (!this.isDrawing) {
        this.drawZoomCircle(x, y, event.shiftKey);
        return;
      }
      this.curvePoints.push({ x, y });
      this.drawCurve({
        points: this.curvePoints,
        lineWidth: this.ctx.lineWidth
      });
      this.drawZoomCircle(x, y, event.shiftKey);
    }
    onPointerUp(event) {
      const { x, y } = this.annotationTool.getRelativeCoords(event);
      this.drawZoomCircle(x, y, event.shiftKey);
      if (!this.isDrawing) {
        return;
      }
      this.curvePoints.push({ x, y });
      const curvePointsAsPoints = this.curvePoints.map(
        (pt) => new Point(pt.x, pt.y)
      );
      const epsilon = 0.5;
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
      if (shape.points.length === 2 && shape.points[0].x === shape.points[1].x && shape.points[0].y === shape.points[1].y) {
        const radius = shape.lineWidth / 4;
        const startAngle = 0;
        const endAngle = 2 * Math.PI;
        this.ctx.beginPath();
        this.ctx.arc(
          shape.points[0].x,
          shape.points[0].y,
          radius,
          startAngle,
          endAngle
        );
        this.ctx.stroke();
      } else {
        this.ctx.beginPath();
        this.ctx.moveTo(shape.points[0].x, shape.points[0].y);
        for (let i = 0; i < shape.points.length - 1; i++) {
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
    }
    initZoomCanvas() {
      const zoomCanvas = document.createElement("canvas");
      const zoomResolutionMultiplier = 2;
      zoomCanvas.width = this.zoomRadius * 2 * zoomResolutionMultiplier;
      zoomCanvas.height = this.zoomRadius * 2 * zoomResolutionMultiplier;
      const zoomCtx = zoomCanvas.getContext("2d");
      if (!zoomCtx) return;
      zoomCtx.imageSmoothingQuality = "high";
      zoomCtx.imageSmoothingEnabled = true;
      this.zoomCtx = zoomCtx;
      this.zoomCanvas = zoomCanvas;
    }
    isPointerAtShape(shape, x, y) {
      if (!shape.points || shape.points.length === 0) return false;
      const threshold = Math.max((shape.lineWidth ?? this.ctx.lineWidth) / 2, 5);
      for (let i = 0; i < shape.points.length - 1; i++) {
        const point = shape.points[i];
        const nextPoint = shape.points[i + 1];
        const A = x - point.x;
        const B2 = y - point.y;
        const C = nextPoint.x - point.x;
        const D = nextPoint.y - point.y;
        const dot = A * C + B2 * D;
        const lenSq = C * C + D * D;
        let param = -1;
        if (lenSq !== 0) {
          param = dot / lenSq;
        }
        let xx, yy;
        if (param < 0) {
          xx = point.x;
          yy = point.y;
        } else if (param > 1) {
          xx = nextPoint.x;
          yy = nextPoint.y;
        } else {
          xx = point.x + param * C;
          yy = point.y + param * D;
        }
        const dx = x - xx;
        const dy = y - yy;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < threshold) {
          return true;
        }
      }
      return false;
    }
    // Function to draw the zoomed circle centered on the current event coordinates without any visible offset
    drawZoomCircle(x, y, isEnabled = false) {
      if (!isEnabled) {
        return;
      }
      if (!this.isDrawing) {
        this.annotationTool.clearCanvas();
        this.annotationTool.addVideoOverlay();
        this.annotationTool.drawShapesOverlay();
      }
      const zoomCtx = this.zoomCtx;
      if (!zoomCtx) return;
      const pixelRatio2 = this.annotationTool.pixelRatio;
      const sourceSize = this.zoomRadius * 2 / this.zoomScale;
      const sourceX = x - sourceSize / 2;
      const sourceY = y - sourceSize / 2;
      zoomCtx.clearRect(0, 0, this.zoomCanvas.width, this.zoomCanvas.height);
      zoomCtx.drawImage(
        this.ctx.canvas,
        sourceX * pixelRatio2,
        // Source X, adjusted for pixel ratio
        sourceY * pixelRatio2,
        // Source Y, adjusted for pixel ratio
        sourceSize * pixelRatio2,
        // Source width, adjusted for pixel ratio
        sourceSize * pixelRatio2,
        // Source height, adjusted for pixel ratio
        0,
        // Destination X
        0,
        // Destination Y
        this.zoomRadius * 2,
        // Destination width
        this.zoomRadius * 2
        // Destination height
      );
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(x, y, this.zoomRadius, 0, 2 * Math.PI);
      this.ctx.closePath();
      this.ctx.clip();
      this.ctx.drawImage(
        this.zoomCanvas,
        x - this.zoomRadius,
        y - this.zoomRadius
      );
      this.ctx.restore();
    }
  };

  // src/plugins/line.ts
  var LineToolPlugin = class extends BasePlugin {
    constructor() {
      super(...arguments);
      this.name = "line";
    }
    move(shape, dx, dy) {
      shape.x1 += dx;
      shape.y1 += dy;
      shape.x2 += dx;
      shape.y2 += dy;
      return shape;
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
      const centerX = (shape.x1 + shape.x2) / 2;
      const centerY = (shape.y1 + shape.y2) / 2;
      const rotationCenter = this.getRotationCenter(shape, centerX, centerY);
      const rotated = this.applyRotation(shape, rotationCenter.x, rotationCenter.y);
      this.drawLine(shape.x1, shape.y1, shape.x2, shape.y2);
      if (rotated) {
        this.restoreRotation();
      }
    }
    isPointerAtShape(shape, x, y) {
      const { x1, y1, x2, y2 } = shape;
      const tolerance = Math.max((shape.lineWidth ?? 1) / 2, 5);
      const distance = (x2 - x1) * (y1 - y) - (x1 - x) * (y2 - y1);
      const lengthSquared = (x2 - x1) ** 2 + (y2 - y1) ** 2;
      if (lengthSquared === 0) {
        const dx = x - x1;
        const dy = y - y1;
        return Math.sqrt(dx * dx + dy * dy) <= tolerance;
      }
      return Math.abs(distance) / Math.sqrt(lengthSquared) <= tolerance && x >= Math.min(x1, x2) - tolerance && x <= Math.max(x1, x2) + tolerance && y >= Math.min(y1, y2) - tolerance && y <= Math.max(y1, y2) + tolerance;
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
    move(shape, dx, dy) {
      shape.x1 += dx;
      shape.y1 += dy;
      shape.x2 += dx;
      shape.y2 += dy;
      return shape;
    }
    draw(shape) {
      const centerX = (shape.x1 + shape.x2) / 2;
      const centerY = (shape.y1 + shape.y2) / 2;
      const rotationCenter = this.getRotationCenter(shape, centerX, centerY);
      const rotated = this.applyRotation(shape, rotationCenter.x, rotationCenter.y);
      this.drawArrow(shape.x1, shape.y1, shape.x2, shape.y2, shape.lineWidth);
      if (rotated) {
        this.restoreRotation();
      }
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
      this.drawArrow(this.startX, this.startY, x, y);
      this.isDrawing = false;
    }
    drawArrow(x1, y1, x2, y2, lineWidth) {
      const headLength = 10 + 2.5 * (lineWidth ?? this.ctx.lineWidth);
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
    isPointerAtShape(shape, x, y) {
      const { x1, y1, x2, y2 } = shape;
      const tolerance = Math.max((shape.lineWidth ?? 1) / 2, 5);
      const distance = (x2 - x1) * (y1 - y) - (x1 - x) * (y2 - y1);
      const lengthSquared = (x2 - x1) ** 2 + (y2 - y1) ** 2;
      if (lengthSquared === 0) {
        const dx = x - x1;
        const dy = y - y1;
        return Math.sqrt(dx * dx + dy * dy) <= tolerance;
      }
      return Math.abs(distance) / Math.sqrt(lengthSquared) <= tolerance && x >= Math.min(x1, x2) - tolerance && x <= Math.max(x1, x2) + tolerance && y >= Math.min(y1, y2) - tolerance && y <= Math.max(y1, y2) + tolerance;
    }
  };

  // src/plugins/text.ts
  var TextToolPlugin = class extends BasePlugin {
    constructor() {
      super(...arguments);
      this.name = "text";
      this.activePopup = null;
      this.handleKeyDown = (_e) => void 0;
    }
    move(shape, dx, dy) {
      shape.x += dx;
      shape.y += dy;
      return shape;
    }
    onActivate() {
      this.annotationTool.canvas.style.cursor = "text";
      this.isDrawing = true;
    }
    onDeactivate() {
      this.destroyPopup();
      this.annotationTool.canvas.style.cursor = "default";
      this.isDrawing = false;
    }
    draw(shape) {
      if (!shape.text) {
        return;
      }
      const lines = shape.text.split("\n");
      const fontSize = 16 + (shape.lineWidth ?? this.ctx.lineWidth) * 0.5;
      const lineHeight = fontSize * 1.25;
      this.ctx.font = `${fontSize}px Helvetica Neue, Arial`;
      const lineWidths = lines.map((line) => this.ctx.measureText(line).width);
      const textWidth = lineWidths.length > 0 ? Math.max(...lineWidths) : 0;
      const textHeight = lines.length * lineHeight;
      const centerX = shape.x + textWidth / 2;
      const centerY = shape.y - fontSize / 2 + textHeight / 2;
      const rotationCenter = this.getRotationCenter(shape, centerX, centerY);
      const rotated = this.applyRotation(shape, rotationCenter.x, rotationCenter.y);
      for (let i = 0; i < lines.length; i++) {
        this.drawTextLine(shape.x, shape.y + i * lineHeight, lines[i], fontSize);
      }
      if (rotated) {
        this.restoreRotation();
      }
    }
    drawText(x, y, text) {
      const fontSize = 16 + this.ctx.lineWidth * 0.5;
      this.ctx.font = `${fontSize}px Helvetica Neue, Arial`;
      this.ctx.fillText(text, x, y);
    }
    drawTextLine(x, y, text, fontSize) {
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
    destroyPopup() {
      if (this.activePopup) {
        this.annotationTool.canvas.parentElement?.removeChild(this.activePopup);
        this.activePopup = null;
        document.removeEventListener("keydown", this.handleKeyDown);
      }
    }
    createTextInputPopup(x, y) {
      this.destroyPopup();
      const popup = document.createElement("div");
      this.activePopup = popup;
      popup.style.cssText = `
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
    `;
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = "Enter text to draw";
      input.style.cssText = `
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
    `;
      input.addEventListener("focus", () => {
        input.style.borderColor = "#007bff";
      });
      input.addEventListener("blur", () => {
        input.style.borderColor = "#ddd";
      });
      const buttonContainer = document.createElement("div");
      buttonContainer.style.cssText = `
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    `;
      const buttonStyles = `
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
    `;
      const cancelButton = document.createElement("button");
      cancelButton.textContent = "Cancel";
      cancelButton.style.cssText = `
      ${buttonStyles}
      background: #f0f0f0;
      color: #333;
    `;
      cancelButton.addEventListener("mouseover", () => {
        cancelButton.style.opacity = "0.8";
      });
      cancelButton.addEventListener("mouseout", () => {
        cancelButton.style.opacity = "1";
      });
      const okButton = document.createElement("button");
      okButton.textContent = "OK";
      okButton.style.cssText = `
      ${buttonStyles}
      background: #007bff;
      color: white;
    `;
      okButton.addEventListener("mouseover", () => {
        okButton.style.opacity = "0.8";
      });
      okButton.addEventListener("mouseout", () => {
        okButton.style.opacity = "1";
      });
      const closePopup = () => {
        this.destroyPopup();
      };
      const handleSave = () => {
        const inputText = input.value.trim();
        if (inputText) {
          this.save({
            type: "text",
            x,
            y,
            text: inputText,
            strokeStyle: this.ctx.strokeStyle,
            fillStyle: this.ctx.fillStyle,
            lineWidth: this.ctx.lineWidth
          });
          this.annotationTool.currentTool = null;
        }
        closePopup();
      };
      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          closePopup();
        } else if (e.key === "Enter") {
          handleSave();
        }
      };
      this.handleKeyDown = handleKeyDown;
      okButton.onclick = handleSave;
      cancelButton.onclick = closePopup;
      input.onkeyup = handleKeyDown;
      document.addEventListener("keydown", handleKeyDown);
      buttonContainer.appendChild(cancelButton);
      buttonContainer.appendChild(okButton);
      popup.appendChild(input);
      popup.appendChild(buttonContainer);
      this.annotationTool.canvas.parentElement?.appendChild(popup);
      requestAnimationFrame(() => {
        input.focus();
      });
    }
    onPointerUp(event) {
      const { x, y } = this.annotationTool.getRelativeCoords(event);
      this.createTextInputPopup(x, y);
    }
    isPointerAtShape(shape, x, y) {
      if (!shape.text) return false;
      const lines = shape.text.split("\n");
      if (lines.length === 0) return false;
      const fontSize = 16 + (shape.lineWidth ?? 1) * 0.5;
      const lineHeight = fontSize * 1.25;
      const textHeight = lines.length * lineHeight;
      this.ctx.font = `${fontSize}px Helvetica Neue, Arial`;
      const lineWidths = lines.map((line) => this.ctx.measureText(line).width);
      const textWidth = lineWidths.length > 0 ? Math.max(...lineWidths) : 0;
      if (textWidth === 0) return false;
      return x >= shape.x && x <= shape.x + textWidth && y >= shape.y - fontSize && y <= shape.y + textHeight - fontSize;
    }
  };

  // src/plugins/eraser.ts
  var EraserToolPlugin = class extends BasePlugin {
    constructor() {
      super(...arguments);
      this.name = "eraser";
    }
    move(shape, dx, dy) {
      shape.x += dx;
      shape.y += dy;
      return shape;
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
    isPointerAtShape(shape, x, y) {
      const minX = Math.min(shape.x, shape.x + shape.width);
      const maxX = Math.max(shape.x, shape.x + shape.width);
      const minY = Math.min(shape.y, shape.y + shape.height);
      const maxY = Math.max(shape.y, shape.y + shape.height);
      return x >= minX && x <= maxX && y >= minY && y <= maxY;
    }
  };

  // src/plugins/move.ts
  var MoveToolPlugin = class extends BasePlugin {
    constructor() {
      super(...arguments);
      this.name = "move";
      this.shape = null;
      this.shapeIndex = -1;
      this.lastDrawnShape = null;
      this.isScale = false;
      // Track selected shape for deletion with Backspace
      this.selectedShapeIndex = -1;
      this.boundHandleKeyDown = null;
      // Resize handle tracking
      this.activeHandle = null;
      this.handleSize = 8;
      this.resizeStartBounds = null;
      this.resizeOriginalShape = null;
      // Rotation handle tracking
      this.rotationActive = false;
      this.rotationStartAngle = 0;
      this.rotationShapeStartAngle = 0;
      this.centerDragActive = false;
      this.rotationHandleDistance = 40;
    }
    // Distance from center to rotation handle
    /**
     * Deep clone a shape, preserving HTMLImageElement references that JSON.stringify can't handle
     */
    cloneShape(shape) {
      if (shape.type === "image") {
        const imgShape = shape;
        return { ...JSON.parse(JSON.stringify(shape)), image: imgShape.image };
      }
      return JSON.parse(JSON.stringify(shape));
    }
    /**
     * Get the currently selected shape, if any
     */
    getSelectedShape() {
      if (this.selectedShapeIndex < 0 || this.selectedShapeIndex >= this.annotationTool.shapes.length) {
        return null;
      }
      return this.annotationTool.shapes[this.selectedShapeIndex];
    }
    /**
     * Set opacity for the currently selected shape
     */
    setSelectedShapeOpacity(opacity) {
      if (this.selectedShapeIndex < 0 || this.selectedShapeIndex >= this.annotationTool.shapes.length) {
        return false;
      }
      this.annotationTool.undoStack.push([...this.annotationTool.shapes]);
      this.annotationTool.shapes[this.selectedShapeIndex].opacity = opacity;
      this.annotationTool.redrawFullCanvas();
      return true;
    }
    move(shape) {
      return shape;
    }
    normalize(shape) {
      return {
        ...shape
      };
    }
    onActivate() {
      this.boundHandleKeyDown = this.handleKeyDown.bind(this);
      document.addEventListener("keydown", this.boundHandleKeyDown);
    }
    onDeactivate() {
      if (this.boundHandleKeyDown) {
        document.removeEventListener("keydown", this.boundHandleKeyDown);
        this.boundHandleKeyDown = null;
      }
      this.selectedShapeIndex = -1;
    }
    handleKeyDown(event) {
      if ((event.key === "Backspace" || event.key === "Delete") && this.selectedShapeIndex >= 0) {
        event.preventDefault();
        this.deleteSelectedShape();
        return;
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "d" && this.selectedShapeIndex >= 0) {
        event.preventDefault();
        this.duplicateSelectedShape();
        return;
      }
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === "ArrowRight") {
        event.preventDefault();
        this.copyAnnotationsToNextFrame();
        return;
      }
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === "ArrowLeft") {
        event.preventDefault();
        this.copyAnnotationsToPrevFrame();
        return;
      }
    }
    /**
     * Duplicate the currently selected shape with an offset
     */
    duplicateSelectedShape() {
      const shape = this.getSelectedShape();
      if (!shape) return;
      const clonedShape = this.cloneShape(shape);
      const offset = 20;
      const bounds = this.getShapeBounds(clonedShape);
      if (bounds) {
        this.offsetShape(clonedShape, offset, offset);
      }
      this.annotationTool.undoStack.push([...this.annotationTool.shapes]);
      const serializedShape = this.annotationTool.serialize([clonedShape])[0];
      this.annotationTool.shapes.push(serializedShape);
      this.selectedShapeIndex = this.annotationTool.shapes.length - 1;
      this.annotationTool.redrawFullCanvas();
    }
    /**
     * Copy current frame's annotations to the next frame
     */
    copyAnnotationsToNextFrame() {
      const currentFrame = this.annotationTool.activeTimeFrame;
      const nextFrame = currentFrame + 1;
      if (nextFrame > this.annotationTool.totalFrames) return;
      if (this.annotationTool.shapes.length === 0) return;
      const existingShapes = this.annotationTool.timeStack.get(nextFrame) || [];
      const clonedShapes = this.annotationTool.shapes.map((s) => this.cloneShape(s));
      const mergedShapes = [...existingShapes, ...clonedShapes];
      this.annotationTool.timeStack.set(nextFrame, mergedShapes);
      this.annotationTool.playbackFrame = nextFrame;
      this.annotationTool.redrawFullCanvas();
    }
    /**
     * Copy current frame's annotations to the previous frame
     */
    copyAnnotationsToPrevFrame() {
      const currentFrame = this.annotationTool.activeTimeFrame;
      const prevFrame = currentFrame - 1;
      if (prevFrame < 1) return;
      if (this.annotationTool.shapes.length === 0) return;
      const existingShapes = this.annotationTool.timeStack.get(prevFrame) || [];
      const clonedShapes = this.annotationTool.shapes.map((s) => this.cloneShape(s));
      const mergedShapes = [...existingShapes, ...clonedShapes];
      this.annotationTool.timeStack.set(prevFrame, mergedShapes);
      this.annotationTool.playbackFrame = prevFrame;
      this.annotationTool.redrawFullCanvas();
    }
    /**
     * Offset a shape by dx, dy
     */
    offsetShape(shape, dx, dy) {
      const deserialized = this.annotationTool.deserialize([shape])[0];
      const plugin = this.annotationTool.pluginForTool(deserialized.type);
      const moved = plugin.move(deserialized, dx, dy);
      Object.assign(shape, this.annotationTool.serialize([moved])[0]);
    }
    /**
     * Get bounding box for any shape
     */
    getShapeBounds(rawShape) {
      const shape = this.annotationTool.deserialize([rawShape])[0];
      switch (shape.type) {
        case "rectangle": {
          const s = shape;
          return {
            x: Math.min(s.x, s.x + s.width),
            y: Math.min(s.y, s.y + s.height),
            width: Math.abs(s.width),
            height: Math.abs(s.height)
          };
        }
        case "image": {
          const s = shape;
          return {
            x: Math.min(s.x, s.x + s.width),
            y: Math.min(s.y, s.y + s.height),
            width: Math.abs(s.width),
            height: Math.abs(s.height)
          };
        }
        case "selection": {
          const s = shape;
          return {
            x: Math.min(s.x, s.x + s.width),
            y: Math.min(s.y, s.y + s.height),
            width: Math.abs(s.width),
            height: Math.abs(s.height)
          };
        }
        case "circle": {
          const c = shape;
          return {
            x: c.x - c.radius,
            y: c.y - c.radius,
            width: c.radius * 2,
            height: c.radius * 2
          };
        }
        case "line": {
          const l = shape;
          const minX = Math.min(l.x1, l.x2);
          const minY = Math.min(l.y1, l.y2);
          const maxX = Math.max(l.x1, l.x2);
          const maxY = Math.max(l.y1, l.y2);
          return {
            x: minX,
            y: minY,
            width: maxX - minX || 10,
            height: maxY - minY || 10
          };
        }
        case "arrow": {
          const a = shape;
          const minX = Math.min(a.x1, a.x2);
          const minY = Math.min(a.y1, a.y2);
          const maxX = Math.max(a.x1, a.x2);
          const maxY = Math.max(a.y1, a.y2);
          return {
            x: minX,
            y: minY,
            width: maxX - minX || 10,
            height: maxY - minY || 10
          };
        }
        case "curve": {
          const c = shape;
          if (!c.points || c.points.length === 0) return null;
          let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
          for (const p2 of c.points) {
            minX = Math.min(minX, p2.x);
            minY = Math.min(minY, p2.y);
            maxX = Math.max(maxX, p2.x);
            maxY = Math.max(maxY, p2.y);
          }
          return {
            x: minX,
            y: minY,
            width: maxX - minX || 10,
            height: maxY - minY || 10
          };
        }
        case "text": {
          const t = shape;
          if (!t.text) return null;
          const lineWidth = rawShape.lineWidth ?? 1;
          const fontSize = 16 + lineWidth * 0.5;
          const estimatedWidth = t.text.length * fontSize * 0.6;
          return {
            x: t.x,
            y: t.y - fontSize,
            width: estimatedWidth || 50,
            height: fontSize * 1.2
          };
        }
        default:
          return null;
      }
    }
    /**
     * Draw resize handles for the selected shape
     */
    drawResizeHandles() {
      const shape = this.getSelectedShape();
      if (!shape) return;
      const bounds = this.getShapeBounds(shape);
      if (!bounds) return;
      const ctx = this.annotationTool.ctx;
      const hs = this.handleSize;
      const halfHs = hs / 2;
      const handles = [
        { pos: "nw", x: bounds.x, y: bounds.y },
        { pos: "n", x: bounds.x + bounds.width / 2, y: bounds.y },
        { pos: "ne", x: bounds.x + bounds.width, y: bounds.y },
        { pos: "e", x: bounds.x + bounds.width, y: bounds.y + bounds.height / 2 },
        { pos: "se", x: bounds.x + bounds.width, y: bounds.y + bounds.height },
        { pos: "s", x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height },
        { pos: "sw", x: bounds.x, y: bounds.y + bounds.height },
        { pos: "w", x: bounds.x, y: bounds.y + bounds.height / 2 }
      ];
      ctx.save();
      ctx.strokeStyle = "#5b9fff";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
      ctx.setLineDash([]);
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#5b9fff";
      ctx.lineWidth = 1;
      for (const handle of handles) {
        ctx.fillRect(handle.x - halfHs, handle.y - halfHs, hs, hs);
        ctx.strokeRect(handle.x - halfHs, handle.y - halfHs, hs, hs);
      }
      ctx.restore();
      this.drawRotationHandles(bounds);
    }
    /**
     * Get the rotation center for the selected shape in canvas coordinates
     */
    getShapeRotationCenter(shape, bounds) {
      if (shape.rotationCenterX !== void 0 && shape.rotationCenterY !== void 0) {
        return {
          x: shape.rotationCenterX * this.annotationTool.canvasWidth,
          y: shape.rotationCenterY * this.annotationTool.canvasHeight
        };
      }
      return {
        x: bounds.x + bounds.width / 2,
        y: bounds.y + bounds.height / 2
      };
    }
    /**
     * Draw rotation handle and center point for the selected shape
     */
    drawRotationHandles(bounds) {
      const shape = this.getSelectedShape();
      if (!shape) return;
      const ctx = this.annotationTool.ctx;
      const center = this.getShapeRotationCenter(shape, bounds);
      const rotation = shape.rotation ?? 0;
      const handleX = center.x + Math.sin(rotation) * this.rotationHandleDistance;
      const handleY = center.y - Math.cos(rotation) * this.rotationHandleDistance;
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = "#5b9fff";
      ctx.lineWidth = 1;
      ctx.setLineDash([]);
      ctx.moveTo(center.x, center.y);
      ctx.lineTo(handleX, handleY);
      ctx.stroke();
      const crossSize = 6;
      ctx.beginPath();
      ctx.strokeStyle = "#5b9fff";
      ctx.lineWidth = 1.5;
      ctx.moveTo(center.x - crossSize, center.y);
      ctx.lineTo(center.x + crossSize, center.y);
      ctx.moveTo(center.x, center.y - crossSize);
      ctx.lineTo(center.x, center.y + crossSize);
      ctx.stroke();
      ctx.beginPath();
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#5b9fff";
      ctx.lineWidth = 1.5;
      ctx.arc(center.x, center.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#5b9fff";
      ctx.lineWidth = 1.5;
      ctx.arc(handleX, handleY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.strokeStyle = "#5b9fff";
      ctx.lineWidth = 1;
      ctx.arc(handleX, handleY, 3, -Math.PI * 0.7, Math.PI * 0.5);
      ctx.stroke();
      ctx.restore();
    }
    /**
     * Check if pointer is at the rotation handle
     */
    isPointerAtRotationHandle(x, y) {
      const shape = this.getSelectedShape();
      if (!shape) return false;
      const bounds = this.getShapeBounds(shape);
      if (!bounds) return false;
      const center = this.getShapeRotationCenter(shape, bounds);
      const rotation = shape.rotation ?? 0;
      const handleX = center.x + Math.sin(rotation) * this.rotationHandleDistance;
      const handleY = center.y - Math.cos(rotation) * this.rotationHandleDistance;
      const dx = x - handleX;
      const dy = y - handleY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance <= 12;
    }
    /**
     * Check if pointer is at the rotation center
     */
    isPointerAtRotationCenter(x, y) {
      const shape = this.getSelectedShape();
      if (!shape) return false;
      const bounds = this.getShapeBounds(shape);
      if (!bounds) return false;
      const center = this.getShapeRotationCenter(shape, bounds);
      const dx = x - center.x;
      const dy = y - center.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance <= 10;
    }
    /**
     * Calculate angle from center to point
     */
    calculateAngle(centerX, centerY, x, y) {
      return Math.atan2(x - centerX, -(y - centerY));
    }
    /**
     * Check if pointer is on a resize handle
     */
    getHandleAtPosition(x, y) {
      const shape = this.getSelectedShape();
      if (!shape) return null;
      const bounds = this.getShapeBounds(shape);
      if (!bounds) return null;
      const hs = this.handleSize + 4;
      const halfHs = hs / 2;
      const handles = [
        { pos: "nw", x: bounds.x, y: bounds.y },
        { pos: "n", x: bounds.x + bounds.width / 2, y: bounds.y },
        { pos: "ne", x: bounds.x + bounds.width, y: bounds.y },
        { pos: "e", x: bounds.x + bounds.width, y: bounds.y + bounds.height / 2 },
        { pos: "se", x: bounds.x + bounds.width, y: bounds.y + bounds.height },
        { pos: "s", x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height },
        { pos: "sw", x: bounds.x, y: bounds.y + bounds.height },
        { pos: "w", x: bounds.x, y: bounds.y + bounds.height / 2 }
      ];
      for (const handle of handles) {
        if (x >= handle.x - halfHs && x <= handle.x + halfHs && y >= handle.y - halfHs && y <= handle.y + halfHs) {
          return handle.pos;
        }
      }
      return null;
    }
    /**
     * Get cursor for handle position
     */
    getCursorForHandle(handle) {
      const cursors = {
        "nw": "nw-resize",
        "n": "n-resize",
        "ne": "ne-resize",
        "e": "e-resize",
        "se": "se-resize",
        "s": "s-resize",
        "sw": "sw-resize",
        "w": "w-resize"
      };
      return cursors[handle];
    }
    /**
     * Resize shape based on handle drag
     * @param keepAspectRatio - When true (shift key), maintains original aspect ratio
     */
    resizeShape(shape, handle, dx, dy, startBounds, keepAspectRatio = false) {
      if (!this.resizeOriginalShape) return;
      const deserialized = this.annotationTool.deserialize([this.resizeOriginalShape])[0];
      let newX = startBounds.x;
      let newY = startBounds.y;
      let newWidth = startBounds.width;
      let newHeight = startBounds.height;
      switch (handle) {
        case "nw":
          newX += dx;
          newY += dy;
          newWidth -= dx;
          newHeight -= dy;
          break;
        case "n":
          newY += dy;
          newHeight -= dy;
          break;
        case "ne":
          newY += dy;
          newWidth += dx;
          newHeight -= dy;
          break;
        case "e":
          newWidth += dx;
          break;
        case "se":
          newWidth += dx;
          newHeight += dy;
          break;
        case "s":
          newHeight += dy;
          break;
        case "sw":
          newX += dx;
          newWidth -= dx;
          newHeight += dy;
          break;
        case "w":
          newX += dx;
          newWidth -= dx;
          break;
      }
      if (keepAspectRatio && startBounds.width > 0 && startBounds.height > 0) {
        const aspectRatio = startBounds.width / startBounds.height;
        if (handle === "n" || handle === "s") {
          const constrainedWidth = newHeight * aspectRatio;
          const widthDiff = constrainedWidth - newWidth;
          newWidth = constrainedWidth;
          newX -= widthDiff / 2;
        } else if (handle === "e" || handle === "w") {
          const constrainedHeight = newWidth / aspectRatio;
          const heightDiff = constrainedHeight - newHeight;
          newHeight = constrainedHeight;
          newY -= heightDiff / 2;
        } else {
          const scaleFromWidth = newWidth / startBounds.width;
          const scaleFromHeight = newHeight / startBounds.height;
          const uniformScale = Math.max(Math.abs(scaleFromWidth), Math.abs(scaleFromHeight));
          const signX = scaleFromWidth >= 0 ? 1 : -1;
          const signY = scaleFromHeight >= 0 ? 1 : -1;
          const constrainedWidth = startBounds.width * uniformScale * signX;
          const constrainedHeight = startBounds.height * uniformScale * signY;
          if (handle === "nw") {
            newX = startBounds.x + startBounds.width - constrainedWidth;
            newY = startBounds.y + startBounds.height - constrainedHeight;
          } else if (handle === "ne") {
            newY = startBounds.y + startBounds.height - constrainedHeight;
          } else if (handle === "sw") {
            newX = startBounds.x + startBounds.width - constrainedWidth;
          }
          newWidth = constrainedWidth;
          newHeight = constrainedHeight;
        }
      }
      const minSize = 10;
      if (newWidth < minSize) {
        if (handle.includes("w")) {
          newX = startBounds.x + startBounds.width - minSize;
        }
        newWidth = minSize;
      }
      if (newHeight < minSize) {
        if (handle.includes("n")) {
          newY = startBounds.y + startBounds.height - minSize;
        }
        newHeight = minSize;
      }
      const scaleX = startBounds.width > 0 ? newWidth / startBounds.width : 1;
      const scaleY = startBounds.height > 0 ? newHeight / startBounds.height : 1;
      switch (deserialized.type) {
        case "rectangle": {
          const rectShape = shape;
          rectShape.x = newX / this.annotationTool.canvasWidth;
          rectShape.y = newY / this.annotationTool.canvasHeight;
          rectShape.width = newWidth / this.annotationTool.canvasWidth;
          rectShape.height = newHeight / this.annotationTool.canvasHeight;
          break;
        }
        case "selection": {
          const selShape = shape;
          selShape.x = newX / this.annotationTool.canvasWidth;
          selShape.y = newY / this.annotationTool.canvasHeight;
          selShape.width = newWidth / this.annotationTool.canvasWidth;
          selShape.height = newHeight / this.annotationTool.canvasHeight;
          break;
        }
        case "circle": {
          const circleShape = shape;
          const radius = Math.min(newWidth, newHeight) / 2;
          const centerX = newX + newWidth / 2;
          const centerY = newY + newHeight / 2;
          circleShape.x = centerX / this.annotationTool.canvasWidth;
          circleShape.y = centerY / this.annotationTool.canvasHeight;
          circleShape.radius = radius / this.annotationTool.canvasWidth;
          break;
        }
        case "line": {
          const lineShape = shape;
          const origLine = deserialized;
          const relX1 = (origLine.x1 - startBounds.x) * scaleX + newX;
          const relY1 = (origLine.y1 - startBounds.y) * scaleY + newY;
          const relX2 = (origLine.x2 - startBounds.x) * scaleX + newX;
          const relY2 = (origLine.y2 - startBounds.y) * scaleY + newY;
          lineShape.x1 = relX1 / this.annotationTool.canvasWidth;
          lineShape.y1 = relY1 / this.annotationTool.canvasHeight;
          lineShape.x2 = relX2 / this.annotationTool.canvasWidth;
          lineShape.y2 = relY2 / this.annotationTool.canvasHeight;
          break;
        }
        case "arrow": {
          const arrowShape = shape;
          const origArrow = deserialized;
          const relX1 = (origArrow.x1 - startBounds.x) * scaleX + newX;
          const relY1 = (origArrow.y1 - startBounds.y) * scaleY + newY;
          const relX2 = (origArrow.x2 - startBounds.x) * scaleX + newX;
          const relY2 = (origArrow.y2 - startBounds.y) * scaleY + newY;
          arrowShape.x1 = relX1 / this.annotationTool.canvasWidth;
          arrowShape.y1 = relY1 / this.annotationTool.canvasHeight;
          arrowShape.x2 = relX2 / this.annotationTool.canvasWidth;
          arrowShape.y2 = relY2 / this.annotationTool.canvasHeight;
          break;
        }
        case "curve": {
          const curveShape = shape;
          const origCurve = deserialized;
          if (!origCurve.points || origCurve.points.length === 0) break;
          curveShape.points = origCurve.points.map((p2) => ({
            x: ((p2.x - startBounds.x) * scaleX + newX) / this.annotationTool.canvasWidth,
            y: ((p2.y - startBounds.y) * scaleY + newY) / this.annotationTool.canvasHeight
          }));
          break;
        }
        case "text": {
          const textShape = shape;
          const origText = deserialized;
          const origLineWidth = this.resizeOriginalShape.lineWidth ?? 1;
          const origFontSize = 16 + origLineWidth * 0.5;
          const relX = (origText.x - startBounds.x) * scaleX + newX;
          const relY = (origText.y - startBounds.y) * scaleY + newY;
          textShape.x = relX / this.annotationTool.canvasWidth;
          textShape.y = relY / this.annotationTool.canvasHeight;
          const avgScale = (scaleX + scaleY) / 2;
          const newFontSize = origFontSize * avgScale;
          textShape.lineWidth = Math.max(1, (newFontSize - 16) * 2);
          break;
        }
        case "image": {
          const imgShape = shape;
          imgShape.x = newX / this.annotationTool.canvasWidth;
          imgShape.y = newY / this.annotationTool.canvasHeight;
          imgShape.width = newWidth / this.annotationTool.canvasWidth;
          imgShape.height = newHeight / this.annotationTool.canvasHeight;
          break;
        }
      }
    }
    deleteSelectedShape() {
      if (this.selectedShapeIndex < 0 || this.selectedShapeIndex >= this.annotationTool.shapes.length) {
        return;
      }
      this.annotationTool.undoStack.push([...this.annotationTool.shapes]);
      this.annotationTool.shapes.splice(this.selectedShapeIndex, 1);
      this.selectedShapeIndex = -1;
      this.shapeIndex = -1;
      this.annotationTool.redrawFullCanvas();
    }
    onPointerDown(event) {
      const { x, y } = this.annotationTool.getRelativeCoords(event);
      if (this.selectedShapeIndex >= 0 && this.isPointerAtRotationHandle(x, y)) {
        const shape = this.getSelectedShape();
        if (shape) {
          const bounds = this.getShapeBounds(shape);
          if (bounds) {
            const center = this.getShapeRotationCenter(shape, bounds);
            this.rotationActive = true;
            this.rotationStartAngle = this.calculateAngle(center.x, center.y, x, y);
            this.rotationShapeStartAngle = shape.rotation ?? 0;
            this.isDrawing = true;
            this.annotationTool.undoStack.push([...this.annotationTool.shapes]);
            this.annotationTool.canvas.style.cursor = "grabbing";
            return;
          }
        }
      }
      if (this.selectedShapeIndex >= 0 && this.isPointerAtRotationCenter(x, y)) {
        this.centerDragActive = true;
        this.startX = x;
        this.startY = y;
        this.isDrawing = true;
        this.annotationTool.undoStack.push([...this.annotationTool.shapes]);
        this.annotationTool.canvas.style.cursor = "move";
        return;
      }
      const handle = this.getHandleAtPosition(x, y);
      if (handle && this.selectedShapeIndex >= 0) {
        this.activeHandle = handle;
        this.startX = x;
        this.startY = y;
        this.isDrawing = true;
        const selectedShape = this.getSelectedShape();
        if (selectedShape) {
          this.resizeStartBounds = this.getShapeBounds(selectedShape);
          this.resizeOriginalShape = this.cloneShape(selectedShape);
          this.annotationTool.undoStack.push([...this.annotationTool.shapes]);
        }
        this.annotationTool.canvas.style.cursor = this.getCursorForHandle(handle);
        return;
      }
      const originalShapes = this.annotationTool.shapes;
      const shapes = originalShapes.slice().reverse();
      let foundShape = false;
      for (const shape of shapes) {
        if (this.isPointerAtShape(shape, x, y)) {
          this.shape = this.cloneShape(shape);
          this.shapeIndex = originalShapes.indexOf(shape);
          this.selectedShapeIndex = this.shapeIndex;
          foundShape = true;
          break;
        }
      }
      if (!foundShape) {
        this.selectedShapeIndex = -1;
        this.annotationTool.redrawFullCanvas();
      }
      if (!this.shape) {
        return;
      }
      this.lastDrawnShape = null;
      this.startX = x;
      this.startY = y;
      this.isDrawing = true;
      this.isScale = this.shape.type === "image" ? this.isPointerAtCorner(this.shape, x, y) : false;
      if (this.isScale) {
        this.annotationTool.canvas.style.cursor = "nw-resize";
      } else {
        this.annotationTool.canvas.style.cursor = "move";
      }
    }
    isPointerAtShape(shape, x, y) {
      const deserializedShape = this.annotationTool.deserialize([shape])[0];
      if (deserializedShape.rotation) {
        const bounds = this.getShapeBounds(shape);
        if (bounds) {
          const center = this.getShapeRotationCenter(shape, bounds);
          const cos = Math.cos(-deserializedShape.rotation);
          const sin = Math.sin(-deserializedShape.rotation);
          const dx = x - center.x;
          const dy = y - center.y;
          x = center.x + dx * cos - dy * sin;
          y = center.y + dx * sin + dy * cos;
        }
      }
      const plugin = this.annotationTool.pluginForTool(deserializedShape.type);
      return plugin.isPointerAtShape(deserializedShape, x, y);
    }
    isPointerAtCorner(rawShape, x, y) {
      if (!("type" in rawShape)) {
        return false;
      }
      const shapeToResolve = this.annotationTool.deserialize([
        rawShape
      ])[0];
      const tolerance = 15;
      const isPointer5pxCloseToImageTop = Math.abs(shapeToResolve.y - y) < tolerance;
      const isPointer5pxCloseToImageLeft = Math.abs(shapeToResolve.x - x) < tolerance;
      const isPointer5pxCloseToImageRight = Math.abs(shapeToResolve.x + shapeToResolve.width - x) < tolerance;
      const isPointer5pxCloseToImageBottom = Math.abs(shapeToResolve.y + shapeToResolve.height - y) < tolerance;
      const isTopLeftCorner = isPointer5pxCloseToImageTop && isPointer5pxCloseToImageLeft;
      const isTopRightCorner = isPointer5pxCloseToImageTop && isPointer5pxCloseToImageRight;
      const isBottomLeftCorner = isPointer5pxCloseToImageBottom && isPointer5pxCloseToImageLeft;
      const isBottomRightCorner = isPointer5pxCloseToImageBottom && isPointer5pxCloseToImageRight;
      const isInCorner = isTopLeftCorner || isTopRightCorner || isBottomLeftCorner || isBottomRightCorner;
      return isInCorner;
    }
    onPointerMove(event) {
      const { x, y } = this.annotationTool.getRelativeCoords(event);
      if (this.isDrawing && this.rotationActive) {
        const shape = this.annotationTool.shapes[this.selectedShapeIndex];
        if (shape) {
          const bounds = this.getShapeBounds(shape);
          if (bounds) {
            const center = this.getShapeRotationCenter(shape, bounds);
            const currentAngle = this.calculateAngle(center.x, center.y, x, y);
            let newRotation = this.rotationShapeStartAngle + (currentAngle - this.rotationStartAngle);
            if (event.shiftKey) {
              const snapAngle = Math.PI / 12;
              newRotation = Math.round(newRotation / snapAngle) * snapAngle;
            }
            shape.rotation = newRotation;
            this.annotationTool.redrawFullCanvas();
          }
        }
        return;
      }
      if (this.isDrawing && this.centerDragActive) {
        const shape = this.annotationTool.shapes[this.selectedShapeIndex];
        if (shape) {
          shape.rotationCenterX = x / this.annotationTool.canvasWidth;
          shape.rotationCenterY = y / this.annotationTool.canvasHeight;
          this.annotationTool.redrawFullCanvas();
        }
        return;
      }
      if (this.isDrawing && this.activeHandle && this.resizeStartBounds) {
        const dx2 = x - this.startX;
        const dy2 = y - this.startY;
        const shape = this.annotationTool.shapes[this.selectedShapeIndex];
        if (shape) {
          this.resizeShape(shape, this.activeHandle, dx2, dy2, this.resizeStartBounds, event.shiftKey);
          this.annotationTool.redrawFullCanvas();
        }
        return;
      }
      if (!this.isDrawing && this.selectedShapeIndex >= 0) {
        if (this.isPointerAtRotationHandle(x, y)) {
          this.annotationTool.canvas.style.cursor = "grab";
          return;
        }
        if (this.isPointerAtRotationCenter(x, y)) {
          this.annotationTool.canvas.style.cursor = "move";
          return;
        }
        const handle = this.getHandleAtPosition(x, y);
        if (handle) {
          this.annotationTool.canvas.style.cursor = this.getCursorForHandle(handle);
          return;
        }
      }
      if (!this.isDrawing || !this.shape) {
        if (!this.isDrawing) {
          this.annotationTool.canvas.style.cursor = "default";
        }
        return;
      }
      const dx = x - this.startX;
      const dy = y - this.startY;
      this.startX = x - dx;
      this.startY = y - dy;
      const lastShape = this.annotationTool.deserialize([this.shape])[0];
      const shapeCopy = lastShape.type === "image" ? lastShape : JSON.parse(JSON.stringify(lastShape));
      if (shapeCopy.type === "audio-peaks") {
        return;
      }
      if (shapeCopy.type === "image") {
        if (this.isScale) {
          const { width, height } = shapeCopy;
          const ratio = width / height;
          const newWidth = width + dx;
          const newHeight = newWidth / ratio;
          shapeCopy.width = newWidth;
          shapeCopy.height = newHeight;
          this.lastDrawnShape = shapeCopy;
          this.annotationTool.pluginForTool(shapeCopy.type).draw(shapeCopy);
        } else {
          const item = this.annotationTool.pluginForTool(shapeCopy.type).move(shapeCopy, dx, dy);
          this.lastDrawnShape = item;
          this.annotationTool.pluginForTool(shapeCopy.type).draw(item);
        }
      } else {
        const item = this.annotationTool.pluginForTool(shapeCopy.type).move(shapeCopy, dx, dy);
        this.lastDrawnShape = item;
        this.annotationTool.pluginForTool(shapeCopy.type).draw(item);
      }
    }
    onPointerUp(event) {
      if (this.rotationActive) {
        this.rotationActive = false;
        this.isDrawing = false;
        this.annotationTool.canvas.style.cursor = "default";
        this.annotationTool.redrawFullCanvas();
        return;
      }
      if (this.centerDragActive) {
        this.centerDragActive = false;
        this.isDrawing = false;
        this.annotationTool.canvas.style.cursor = "default";
        this.annotationTool.redrawFullCanvas();
        return;
      }
      if (this.activeHandle) {
        this.activeHandle = null;
        this.resizeStartBounds = null;
        this.resizeOriginalShape = null;
        this.isDrawing = false;
        this.annotationTool.canvas.style.cursor = "default";
        this.annotationTool.redrawFullCanvas();
        return;
      }
      if (!this.isDrawing || !this.lastDrawnShape) {
        this.isDrawing = false;
        this.annotationTool.redrawFullCanvas();
        return;
      }
      if (this.lastDrawnShape && this.shape) {
        this.lastDrawnShape.fillStyle = this.shape.fillStyle;
        this.lastDrawnShape.strokeStyle = this.shape.strokeStyle;
        this.lastDrawnShape.lineWidth = this.shape.lineWidth;
        if (this.shape.opacity !== void 0) {
          this.lastDrawnShape.opacity = this.shape.opacity;
        }
        this.save(this.lastDrawnShape);
      }
      this.isDrawing = false;
      this.isScale = false;
      this.shape = null;
      this.lastDrawnShape = null;
      this.annotationTool.canvas.style.cursor = "default";
      this.annotationTool.redrawFullCanvas();
    }
    draw() {
      throw new Error("Method not implemented.");
    }
    reset() {
      this.isDrawing = false;
      this.shape = null;
      this.isScale = false;
      this.lastDrawnShape = null;
      this.shapeIndex = -1;
      this.selectedShapeIndex = -1;
      this.activeHandle = null;
      this.resizeStartBounds = null;
      this.resizeOriginalShape = null;
      this.rotationActive = false;
      this.centerDragActive = false;
      this.annotationTool.canvas.style.cursor = "default";
    }
    save(shape) {
      this.annotationTool.replaceShape(shape, this.shapeIndex);
    }
  };

  // src/plugins/image.ts
  var ImageToolPlugin = class extends BasePlugin {
    constructor() {
      super(...arguments);
      this.name = "image";
    }
    move(shape, dx, dy) {
      shape.x += dx;
      shape.y += dy;
      return shape;
    }
    onPointerDown(event) {
    }
    onPointerMove(event) {
    }
    onPointerUp(event) {
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
      if (!(shape.image instanceof HTMLImageElement)) {
        console.error("Image is not an instance of HTMLImageElement");
        return;
      }
      if (shape.width === 0 || shape.height === 0) {
        return;
      }
      const centerX = shape.x + shape.width / 2;
      const centerY = shape.y + shape.height / 2;
      const rotationCenter = this.getRotationCenter(shape, centerX, centerY);
      const rotated = this.applyRotation(shape, rotationCenter.x, rotationCenter.y);
      this.ctx.drawImage(
        shape.image,
        shape.x,
        shape.y,
        shape.width,
        shape.height
      );
      if (rotated) {
        this.restoreRotation();
      }
    }
    isPointerAtShape(shape, x, y) {
      const minX = Math.min(shape.x, shape.x + shape.width);
      const maxX = Math.max(shape.x, shape.x + shape.width);
      const minY = Math.min(shape.y, shape.y + shape.height);
      const maxY = Math.max(shape.y, shape.y + shape.height);
      return x >= minX && x <= maxX && y >= minY && y <= maxY;
    }
  };

  // src/plugins/compare.ts
  var CompareToolPlugin = class extends BasePlugin {
    constructor() {
      super(...arguments);
      this.name = "compare";
      this.comparisonLine = 0;
      this.leftOpacity = 1;
      this.isDrawing = false;
    }
    get rightOpacity() {
      return this.annotationTool.overlayOpacity;
    }
    move(shape, dx, dy) {
      shape.x += dx;
      return shape;
    }
    onActivate() {
      this.comparisonLine = this.annotationTool.canvasWidth / 2;
      this.leftOpacity = 1;
      this.annotationTool.canvas.style.cursor = "col-resize";
    }
    onDeactivate() {
      this.annotationTool.canvas.style.cursor = "default";
      this.comparisonLine = 0;
      this.leftOpacity = 1;
      this.isDrawing = false;
    }
    normalize(shape, canvasWidth, _canvasHeight) {
      return {
        ...shape,
        x: shape.x / canvasWidth
      };
    }
    onPointerDown(event) {
      const { x, y } = this.annotationTool.getRelativeCoords(event);
      this.startX = x;
      this.startY = y;
      this.isDrawing = true;
      this.disablePreviousCompare();
      this.onPointerMove(event);
    }
    onPointerMove(event) {
      if (!this.isDrawing) {
        if (this.annotationTool.globalShapes.length > 0) {
          const shape = this.annotationTool.globalShapes[0];
          if (shape.type === "compare") {
            const deserialized = this.annotationTool.deserialize([
              shape
            ])[0];
            this.draw(deserialized);
            this.annotationTool.addFrameSquareOverlay();
          }
        }
        return;
      }
      const { x } = this.annotationTool.getRelativeCoords(event);
      this.comparisonLine = x;
      const item = {
        type: "compare",
        strokeStyle: this.ctx.strokeStyle,
        fillStyle: this.ctx.fillStyle,
        lineWidth: this.ctx.lineWidth,
        x
      };
      this.draw(item);
      this.drawDelimiter(item);
    }
    onPointerUp() {
      if (!this.isDrawing) {
        return;
      }
      this.save({
        type: "compare",
        strokeStyle: this.ctx.strokeStyle,
        fillStyle: this.ctx.fillStyle,
        lineWidth: this.ctx.lineWidth,
        disabled: false,
        x: this.comparisonLine
      });
      this.isDrawing = false;
    }
    removePreviousCompare() {
      this.annotationTool.globalShapes = this.annotationTool.globalShapes.filter(
        (s) => s.type !== "compare"
      );
    }
    disablePreviousCompare() {
      this.annotationTool.globalShapes = this.annotationTool.globalShapes.map(
        (s) => {
          if (s.type === "compare") {
            return {
              ...s,
              disabled: true
            };
          }
          return s;
        }
      );
    }
    save(shape) {
      this.removePreviousCompare();
      const serialized = this.annotationTool.serialize([shape])[0];
      if (serialized.x < 0.05 || serialized.x > 0.95) {
        return;
      }
      this.annotationTool.addGlobalShape(serialized);
    }
    drawDelimiter(shape) {
      this.ctx.beginPath();
      this.ctx.moveTo(shape.x, 0);
      this.ctx.lineTo(shape.x, this.annotationTool.canvasWidth);
      this.ctx.stroke();
    }
    drawShape(shape) {
      const video1 = this.annotationTool.videoElement;
      const video2 = this.annotationTool.referenceVideoElement;
      if (!video1 || !video2) {
        return;
      }
      const globalAlpha = this.ctx.globalAlpha;
      const w = this.annotationTool.canvasWidth;
      const h = this.annotationTool.canvasHeight;
      const x = shape.x;
      const heightDiff = video2.videoHeight - video1.videoHeight;
      const widthDiff = video2.videoWidth - video1.videoWidth;
      const isMobile = this.annotationTool.isMobile;
      this.ctx.globalAlpha = this.leftOpacity;
      const frameNumber = this.annotationTool.referenceVideoFrameBuffer?.frameNumberFromTime(
        video1.currentTime
      ) ?? 1;
      let referenceVideoFrameNumber = frameNumber;
      const AUDIO_SYNC_ENABLED = widthDiff > video1.videoWidth && heightDiff > video1.videoHeight && !this.annotationTool.isMobile;
      if (AUDIO_SYNC_ENABLED) {
        const bestFrame = this.annotationTool.referenceVideoFrameBuffer?.getFrameNumberBySignature(
          this.annotationTool.videoFrameBuffer?.getAudioFingerprint(frameNumber) ?? null,
          frameNumber
        ) ?? frameNumber;
        const fDiff = Math.abs(frameNumber - bestFrame);
        if (fDiff >= 1 && fDiff <= 3) {
          referenceVideoFrameNumber = bestFrame;
        }
      }
      const referenceVideoFrame = this.annotationTool.referenceVideoFrameBuffer?.getFrame(
        referenceVideoFrameNumber
      );
      const videoFrame = this.annotationTool.videoFrameBuffer?.getFrame(frameNumber);
      if (isMobile) {
        this.ctx.imageSmoothingQuality = "low";
        const normalizedX = x / w;
        const cropWidth = x;
        this.ctx.drawImage(
          videoFrame ?? video1,
          0,
          0,
          normalizedX * video1.videoWidth,
          video1.videoHeight,
          // Source cropping parameters
          0,
          0,
          cropWidth,
          h
          // Destination position and size
        );
      } else {
        const vw = videoFrame ? videoFrame.width : video1.videoWidth;
        const vh = videoFrame ? videoFrame.height : video1.videoHeight;
        this.ctx.drawImage(videoFrame ?? video1, 0, 0, vw, vh, 0, 0, w, h);
      }
      this.ctx.globalAlpha = this.rightOpacity;
      let topCrop = 0;
      let topOffset = 0;
      const ar1 = video1.videoWidth / video1.videoHeight;
      const ar2 = video2.videoWidth / video2.videoHeight;
      const arDiff = Math.abs(ar1 - ar2);
      const isAspectRatioDifferent = arDiff > 0.1;
      const acceptablePixelDiff = 10;
      const isHeightDifferent = Math.abs(heightDiff) > acceptablePixelDiff;
      let sourceWidth = video1.videoWidth;
      let sourceHeight = video1.videoHeight;
      let xOffset = 0;
      if (widthDiff < -acceptablePixelDiff) {
        if (isAspectRatioDifferent) {
          const mainVideoPixelToCanvasRatio = video1.videoWidth / w;
          xOffset = Math.abs(widthDiff / 2);
          xOffset = xOffset / mainVideoPixelToCanvasRatio;
          if (xOffset <= acceptablePixelDiff) {
            xOffset = 0;
          }
        } else {
          sourceWidth = video2.videoWidth;
        }
      } else if (widthDiff > acceptablePixelDiff) {
        sourceWidth = video2.videoWidth;
      }
      if (heightDiff === 0) {
        topCrop = 0;
      } else if (heightDiff > 0) {
        if (!isAspectRatioDifferent) {
          sourceHeight = isHeightDifferent ? video2.videoHeight : video1.videoHeight;
        } else {
          topCrop = heightDiff / 2;
          if (topCrop <= acceptablePixelDiff) {
            topCrop = 0;
          }
        }
      } else {
        if (!isAspectRatioDifferent) {
          sourceHeight = isHeightDifferent ? video2.videoHeight : video1.videoHeight;
        } else {
          topOffset = Math.abs(heightDiff / 2);
          const mainVideoPixelToCanvasRatio = video1.videoHeight / h;
          topOffset = topOffset / mainVideoPixelToCanvasRatio;
          if (topOffset <= acceptablePixelDiff) {
            topOffset = 0;
          }
        }
      }
      const cropX = x - xOffset;
      const cropWidth1 = w - cropX;
      const normalizedCrop = cropWidth1 / w * sourceWidth;
      if (referenceVideoFrame && this.rightOpacity > 0) {
        if (isMobile) {
          this.ctx.imageSmoothingQuality = "low";
        }
        this.ctx.drawImage(
          referenceVideoFrame,
          cropX / w * sourceWidth,
          topCrop,
          normalizedCrop,
          sourceHeight,
          // Source cropping parameters
          cropX + xOffset,
          topOffset,
          cropWidth1,
          h
          // Destination position and size
        );
      }
      this.ctx.globalAlpha = globalAlpha;
    }
    draw(shape) {
      if (shape.disabled) {
        return;
      }
      const video1 = this.annotationTool.videoElement;
      const video2 = this.annotationTool.referenceVideoElement;
      if (!video1 || !video2) {
        return;
      }
      this.drawShape(shape);
    }
  };

  // src/plugins/audio-peaks.ts
  function findMinMaxNumbers(array) {
    let min = array[0];
    let max = array[0];
    for (let i = 1; i < array.length; i++) {
      if (array[i] < min) min = array[i];
      if (array[i] > max) max = array[i];
    }
    return [min, max];
  }
  var AudioPeaksPlugin = class extends BasePlugin {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    constructor(annotationTool) {
      super(annotationTool);
      this.name = "audio-peaks";
      this.canvas = document.createElement("canvas");
      this.props = {
        peaks: new Int8Array(),
        theme: {
          // color of the waveform outline
          waveOutlineColor: "rgba(255,192,203,0.7)",
          waveFillColor: "grey",
          waveProgressColor: "orange"
        },
        waveHeight: 40,
        bits: 16
      };
      this.drawCtx = this.canvas.getContext("2d");
    }
    async onVideoBlobSet(blob) {
      const buffer = await blob.arrayBuffer();
      this.init(buffer);
    }
    on(event, arg) {
      if (event === "videoBlobSet") {
        this.onVideoBlobSet(arg);
      }
    }
    async extractPeaks(decodedData) {
      const { default: extractPeaks } = await Promise.resolve().then(() => __toESM(require_webaudio_peaks(), 1));
      const progressBarWidth = this.progressBarCoordinates.width;
      const perPixel = Math.ceil(decodedData.length / progressBarWidth);
      const peaks = extractPeaks(decodedData, perPixel, true);
      return peaks;
    }
    setProps(peaks) {
      const [min, max] = findMinMaxNumbers(peaks.data[0]);
      const maxNumber = Math.pow(2, peaks.bits - 1) - 1;
      const minNumber = -Math.pow(2, peaks.bits - 1);
      this.props.peaks = peaks.data[0].map((peak) => {
        if (peak < 0) {
          return Math.round(peak / min * minNumber);
        } else {
          return Math.round(peak / max * maxNumber);
        }
      });
      this.props.bits = peaks.bits;
    }
    async init(blob) {
      try {
        const audioContext = new AudioContext();
        const decodedData = await audioContext.decodeAudioData(blob);
        const peaks = await this.extractPeaks(decodedData);
        this.initCanvas();
        this.setProps(peaks);
        this.annotationTool.removeGlobalShape("audio-peaks");
        this.annotationTool.addGlobalShape({
          x: 0,
          y: 0,
          strokeStyle: "red",
          fillStyle: "red",
          lineWidth: 1,
          type: "audio-peaks"
        });
        this.clearLocalCanvas();
        this.drawOnCanvas();
      } catch (e) {
        this.initCanvas();
        this.props.peaks = new Int8Array();
        this.annotationTool.removeGlobalShape("audio-peaks");
        this.clearLocalCanvas();
        console.error(e);
      }
    }
    initCanvas() {
      this.canvas.width = this.progressBarCoordinates.width * this.pixelRatio;
      this.canvas.height = this.props.waveHeight * this.pixelRatio;
      this.drawCtx.scale(this.pixelRatio, this.pixelRatio);
    }
    move(shape, dx, dy) {
      shape.x += dx;
      shape.y += dy;
      return shape;
    }
    normalize(shape, canvasWidth, canvasHeight) {
      return {
        ...shape,
        x: shape.x / canvasWidth,
        y: shape.y / canvasHeight
      };
    }
    onPointerDown(event) {
      return;
    }
    onPointerMove(event) {
      return;
    }
    onPointerUp(event) {
      return;
    }
    reset() {
      this.clearLocalCanvas();
      this.props.peaks = new Int8Array();
      this.annotationTool.removeGlobalShape("audio-peaks");
    }
    draw(_) {
      const maybeVideoElement = this.annotationTool.videoElement;
      if (!maybeVideoElement || maybeVideoElement.tagName !== "VIDEO") {
        return;
      }
      const isMuted = maybeVideoElement.muted;
      if (isMuted || maybeVideoElement.volume === 0) {
        return;
      }
      this.ctx.clearRect(
        0,
        0,
        this.annotationTool.canvasWidth,
        this.annotationTool.canvasHeight
      );
      const { waveHeight, theme } = this.props;
      const cc = this.ctx;
      const h2 = waveHeight / 2;
      let y = this.progressBarCoordinates.y - 20;
      const { x, width } = this.progressBarCoordinates;
      const currentFrame = this.annotationTool.playbackFrame;
      const totalFrames = this.annotationTool.totalFrames;
      const currentFrameCoordinate = Math.ceil(currentFrame / totalFrames * width) + x;
      this.ctx.drawImage(this.canvas, x, y, width, waveHeight);
      cc.fillStyle = theme.waveProgressColor;
      cc.fillRect(currentFrameCoordinate, y + 0, 1, h2 * 2);
    }
    get pixelRatio() {
      return this.annotationTool.pixelRatio;
    }
    get progressBarCoordinates() {
      return this.annotationTool.progressBarCoordinates;
    }
    clearLocalCanvas() {
      this.drawCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    drawOnCanvas() {
      const { peaks, bits, waveHeight, theme } = this.props;
      const cc = this.drawCtx;
      let offset = 0;
      let shift = 0;
      const h2 = waveHeight / 2;
      const maxValue = 2 ** (bits - 1);
      let y = 0;
      const peakSegmentLength = peaks.length;
      cc.fillStyle = theme.waveOutlineColor;
      for (let i = 0; i < peakSegmentLength; i += 1) {
        const maxPeak = peaks[(i + offset) * 2 + 1] / maxValue;
        const max = Math.abs(maxPeak * h2);
        cc.fillRect(i + shift, y + 0 + h2 - max, 1, max);
      }
    }
  };

  // src/plugins/selection.ts
  var SelectionToolPlugin = class extends BasePlugin {
    constructor() {
      super(...arguments);
      this.name = "selection";
      this.selectedArea = null;
    }
    move(shape, dx, dy) {
      shape.x += dx;
      shape.y += dy;
      return shape;
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
      this.selectedArea = null;
    }
    onPointerMove(event) {
      if (!this.isDrawing) {
        return;
      }
      const { x, y } = this.annotationTool.getRelativeCoords(event);
      this.annotationTool.clearCanvas();
      if (this.annotationTool.globalShapes.length > 0) {
        this.annotationTool.drawShapesOverlay();
      } else {
        this.annotationTool.addVideoOverlay();
      }
      this.drawSelectionRect(
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
      const startX = Math.min(x, this.startX);
      const startY = Math.min(y, this.startY);
      const width = Math.abs(x - this.startX);
      const height = Math.abs(y - this.startY);
      if (width < 1 || height < 1) {
        this.isDrawing = false;
        this.annotationTool.redrawFullCanvas();
        return;
      }
      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");
      const video2 = this.annotationTool.videoElement;
      if (!(video2 instanceof HTMLVideoElement)) {
        return;
      }
      const videoAspectRatio = video2.videoWidth / video2.videoHeight;
      const canvasAspectRatio = this.annotationTool.canvasWidth / this.annotationTool.canvasHeight;
      let scaledVideoWidth = this.annotationTool.canvasWidth;
      let scaledVideoHeight = this.annotationTool.canvasHeight;
      let offsetX = 0;
      let offsetY = 0;
      if (videoAspectRatio > canvasAspectRatio) {
        scaledVideoHeight = this.annotationTool.canvasWidth / videoAspectRatio;
        offsetY = (this.annotationTool.canvasHeight - scaledVideoHeight) / 2;
      } else {
        scaledVideoWidth = this.annotationTool.canvasHeight * videoAspectRatio;
        offsetX = (this.annotationTool.canvasWidth - scaledVideoWidth) / 2;
      }
      const scaleX = video2.videoWidth / scaledVideoWidth;
      const scaleY = video2.videoHeight / scaledVideoHeight;
      const scaledStartX = (startX - offsetX) * scaleX;
      const scaledStartY = (startY - offsetY) * scaleY;
      const scaledWidth = width * scaleX;
      const scaledHeight = height * scaleY;
      tempCanvas.width = Math.max(1, scaledWidth);
      tempCanvas.height = Math.max(1, scaledHeight);
      try {
        tempCtx.drawImage(
          this.annotationTool.videoElement,
          scaledStartX,
          scaledStartY,
          scaledWidth,
          scaledHeight,
          0,
          0,
          scaledWidth,
          scaledHeight
        );
        const imageData = tempCtx.getImageData(
          0,
          0,
          tempCanvas.width,
          tempCanvas.height
        );
        this.selectedArea = imageData;
        const canvas = document.createElement("canvas");
        canvas.width = scaledWidth + 4;
        canvas.height = scaledHeight + 4;
        canvas.style.width = `${width + 4}px`;
        canvas.style.height = `${height + 4}px`;
        const ctx = canvas.getContext("2d");
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, scaledWidth + 2, scaledHeight + 2);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeRect(2, 2, scaledWidth, scaledHeight);
        ctx.putImageData(imageData, 2, 2);
        const img = new Image();
        img.onload = () => {
          this.annotationTool.pluginForTool("image").save({
            type: "image",
            x: startX - 2,
            // Adjust position to account for border
            y: startY - 2,
            width: width + 4,
            // Adjust size to account for border
            height: height + 4,
            image: img,
            strokeStyle: "transparent",
            fillStyle: "transparent",
            lineWidth: 0
          });
          this.isDrawing = false;
          this.selectedArea = null;
          this.annotationTool.redrawFullCanvas();
        };
        img.src = canvas.toDataURL();
        this.annotationTool.currentTool = "move";
      } catch (error) {
        console.error("Error capturing selection:", error);
        this.isDrawing = false;
        this.annotationTool.redrawFullCanvas();
        return;
      }
    }
    drawSelectionRect(x, y, width, height) {
      const startX = Math.min(x, x + width);
      const startY = Math.min(y, y + height);
      const rectWidth = Math.abs(width);
      const rectHeight = Math.abs(height);
      const pixelRatio2 = this.annotationTool.pixelRatio;
      let savedImageData = null;
      if (rectWidth > 0 && rectHeight > 0) {
        try {
          savedImageData = this.ctx.getImageData(
            startX * pixelRatio2,
            startY * pixelRatio2,
            rectWidth * pixelRatio2,
            rectHeight * pixelRatio2
          );
        } catch (e) {
          savedImageData = null;
        }
      }
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      this.ctx.fillRect(
        0,
        0,
        this.annotationTool.canvasWidth,
        this.annotationTool.canvasHeight
      );
      if (savedImageData && rectWidth > 0 && rectHeight > 0) {
        this.ctx.putImageData(savedImageData, startX * pixelRatio2, startY * pixelRatio2);
      } else if (rectWidth > 0 && rectHeight > 0) {
        const video2 = this.annotationTool.videoElement;
        if (video2 instanceof HTMLVideoElement) {
          const frameNumber = this.annotationTool.videoFrameBuffer?.frameNumberFromTime(
            video2.currentTime
          );
          const videoFrame = this.annotationTool.videoFrameBuffer?.getFrame(frameNumber || 0) ?? video2;
          const vw = videoFrame ? videoFrame.width : video2.videoWidth;
          const vh = videoFrame ? videoFrame.height : video2.videoHeight;
          const scaleX = vw / this.annotationTool.canvasWidth;
          const scaleY = vh / this.annotationTool.canvasHeight;
          this.ctx.drawImage(
            videoFrame,
            startX * scaleX,
            startY * scaleY,
            rectWidth * scaleX,
            rectHeight * scaleY,
            startX,
            startY,
            rectWidth,
            rectHeight
          );
        }
      }
      this.ctx.beginPath();
      const oldStrokeStyle = this.ctx.strokeStyle;
      this.ctx.strokeStyle = "#ffffff";
      this.ctx.lineWidth = 2;
      this.ctx.setLineDash([5, 5]);
      this.ctx.strokeRect(startX, startY, rectWidth, rectHeight);
      this.ctx.setLineDash([]);
      this.ctx.strokeStyle = oldStrokeStyle;
    }
    draw(shape) {
      this.drawSelectionRect(shape.x, shape.y, shape.width, shape.height);
    }
    reset() {
      super.reset();
      this.selectedArea = null;
    }
    isPointerAtShape(shape, x, y) {
      const minX = Math.min(shape.x, shape.x + shape.width);
      const maxX = Math.max(shape.x, shape.x + shape.width);
      const minY = Math.min(shape.y, shape.y + shape.height);
      const maxY = Math.max(shape.y, shape.y + shape.height);
      return x >= minX && x <= maxX && y >= minY && y <= maxY;
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
    CurveToolPlugin,
    MoveToolPlugin,
    ImageToolPlugin,
    CompareToolPlugin,
    AudioPeaksPlugin,
    SelectionToolPlugin
  ];

  // src/utils/detect-framerate.ts
  function detectFrameRate(videoElement, callback) {
    let lastMediaTime;
    let lastFrameNum;
    let fps;
    const fpsRounder = [];
    let frameNotSeeked = true;
    let isDestroyed = false;
    function ticker(_, metadata) {
      if (isDestroyed) return;
      const mediaTimeDiff = Math.abs(metadata.mediaTime - lastMediaTime);
      const frameNumDiff = Math.abs(metadata.presentedFrames - lastFrameNum);
      const diff = mediaTimeDiff / frameNumDiff;
      if (diff && diff < 1 && frameNotSeeked && fpsRounder.length < 50 && videoElement.playbackRate === 1 && document.hasFocus()) {
        fpsRounder.push(diff);
        fps = Math.round(1 / getFpsAverage());
        callback(fps, fpsRounder.length * 2);
      }
      frameNotSeeked = true;
      lastMediaTime = metadata.mediaTime;
      lastFrameNum = metadata.presentedFrames;
      if (!isDestroyed) {
        videoElement.requestVideoFrameCallback(ticker);
      }
    }
    videoElement.requestVideoFrameCallback(ticker);
    const onSeeked = () => {
      fpsRounder.pop();
      frameNotSeeked = false;
    };
    videoElement.addEventListener("seeked", onSeeked);
    function getFpsAverage() {
      return fpsRounder.reduce((a, b2) => a + b2) / fpsRounder.length;
    }
    return () => {
      isDestroyed = true;
      videoElement.removeEventListener("seeked", onSeeked);
    };
  }

  // src/plugins/utils/audio-fingerprint.ts
  var AudioFingerprint = class _AudioFingerprint extends Array {
    static {
      this.nextId = 0;
    }
    constructor(...items) {
      super(...items);
      this.id = _AudioFingerprint.nextId++;
    }
  };
  var similarityCache = /* @__PURE__ */ new Map();
  function getCacheKey(fp1, fp2) {
    return `${Math.min(fp1.id, fp2.id)}-${Math.max(fp1.id, fp2.id)}`;
  }
  function calculateAudioSimilarity(fp1, fp2) {
    const key = getCacheKey(fp1, fp2);
    const cached = similarityCache.get(key);
    if (cached !== void 0) {
      return cached;
    }
    if (fp1.length === 0 || fp2.length === 0) {
      return 0;
    }
    const len = Math.min(fp1.length, fp2.length);
    let mean1 = 0;
    let mean2 = 0;
    for (let i = 0; i < len; i++) {
      mean1 += fp1[i];
      mean2 += fp2[i];
    }
    mean1 /= len;
    mean2 /= len;
    let numerator = 0;
    let denom1 = 0;
    let denom2 = 0;
    for (let i = 0; i < len; i++) {
      const diff1 = fp1[i] - mean1;
      const diff2 = fp2[i] - mean2;
      numerator += diff1 * diff2;
      denom1 += diff1 * diff1;
      denom2 += diff2 * diff2;
    }
    const denominator = Math.sqrt(denom1 * denom2);
    const correlation = denominator === 0 ? 0 : (numerator / denominator + 1) / 2;
    similarityCache.set(key, correlation);
    return correlation;
  }
  var SAMPLES_PER_FINGERPRINT = 128;
  var AudioFingerprintExtractor = class {
    constructor(video2, fps) {
      this.video = video2;
      this.fps = fps;
      this.audioContext = null;
      this.audioBuffer = null;
      this.fingerprints = /* @__PURE__ */ new Map();
      this.isInitialized = false;
      this.initPromise = null;
    }
    /**
     * Initialize the audio extractor by decoding video audio.
     * This should be called once before extracting fingerprints.
     */
    async init() {
      if (this.isInitialized) {
        return;
      }
      if (this.initPromise) {
        return this.initPromise;
      }
      this.initPromise = this.doInit();
      return this.initPromise;
    }
    async doInit() {
      try {
        const response = await fetch(this.video.currentSrc || this.video.src);
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        this.audioContext = new AudioContext();
        this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        this.isInitialized = true;
      } catch (error) {
        console.warn("Could not extract audio for fingerprinting:", error);
        this.isInitialized = true;
        this.audioBuffer = null;
      }
    }
    /**
     * Check if audio extraction was successful.
     */
    hasAudio() {
      return this.audioBuffer !== null;
    }
    /**
     * Get the total number of frames in the video.
     */
    get totalFrames() {
      return Math.round(this.video.duration * this.fps);
    }
    /**
     * Extract audio fingerprint for a specific frame.
     * The fingerprint covers a small window around the frame time.
     */
    extractFingerprint(frameNumber) {
      if (!this.audioBuffer) {
        return null;
      }
      const frameTime = (frameNumber - 1) / this.fps;
      const windowDuration = 1 / this.fps;
      const sampleRate = this.audioBuffer.sampleRate;
      const startSample = Math.floor(frameTime * sampleRate);
      const endSample = Math.floor((frameTime + windowDuration) * sampleRate);
      const numSamples = endSample - startSample;
      if (numSamples <= 0 || startSample >= this.audioBuffer.length) {
        return null;
      }
      const channelData = this.audioBuffer.getChannelData(0);
      const fingerprint = new AudioFingerprint();
      const samplesPerSegment = Math.max(1, Math.floor(numSamples / SAMPLES_PER_FINGERPRINT));
      for (let i = 0; i < SAMPLES_PER_FINGERPRINT; i++) {
        const segmentStart = startSample + i * samplesPerSegment;
        const segmentEnd = Math.min(segmentStart + samplesPerSegment, this.audioBuffer.length);
        let energy = 0;
        let count = 0;
        for (let j = segmentStart; j < segmentEnd; j++) {
          if (j < channelData.length) {
            energy += channelData[j] * channelData[j];
            count++;
          }
        }
        const rms = count > 0 ? Math.sqrt(energy / count) : 0;
        fingerprint.push(rms);
      }
      return fingerprint;
    }
    /**
     * Get fingerprint for a frame, extracting if not cached.
     */
    getFingerprint(frameNumber) {
      if (this.fingerprints.has(frameNumber)) {
        return this.fingerprints.get(frameNumber);
      }
      const fp = this.extractFingerprint(frameNumber);
      if (fp) {
        this.fingerprints.set(frameNumber, fp);
      }
      return fp;
    }
    /**
     * Pre-extract fingerprints for a range of frames.
     */
    extractRange(startFrame, endFrame) {
      for (let i = startFrame; i <= endFrame; i++) {
        this.getFingerprint(i);
      }
    }
    /**
     * Set a fingerprint for a specific frame (used when buffering frames).
     */
    setFingerprint(frameNumber, fingerprint) {
      this.fingerprints.set(frameNumber, fingerprint);
    }
    /**
     * Find the best matching frame in this extractor for a given fingerprint.
     * Searches within a window around the reference frame number.
     *
     * @param signature - The audio fingerprint to match
     * @param refFrameNumber - The reference frame number to search around
     * @param windowSize - Number of frames to search in each direction (default: 3)
     * @returns The best matching frame number
     */
    findBestMatch(signature, refFrameNumber, windowSize = 3) {
      if (!signature) {
        return refFrameNumber;
      }
      const hasCachedFingerprints = this.fingerprints.size > 0;
      if (!hasCachedFingerprints && !this.hasAudio()) {
        return refFrameNumber;
      }
      let bestScore = 0;
      let bestFrame = refFrameNumber;
      const startFrame = Math.max(1, refFrameNumber - windowSize);
      const endFrame = Math.min(this.totalFrames, refFrameNumber + windowSize);
      for (let frame = startFrame; frame <= endFrame; frame++) {
        const fp = this.getFingerprint(frame);
        if (fp) {
          const score = calculateAudioSimilarity(signature, fp);
          if (score > bestScore) {
            bestScore = score;
            bestFrame = frame;
          }
        }
      }
      return bestFrame;
    }
    /**
     * Clean up resources.
     */
    destroy() {
      this.fingerprints.clear();
      if (this.audioContext) {
        this.audioContext.close().catch(() => {
        });
        this.audioContext = null;
      }
      this.audioBuffer = null;
      this.isInitialized = false;
      this.initPromise = null;
    }
  };

  // src/plugins/utils/video-frame-buffer.ts
  var SIGNATURE_SCALE = 64;
  var VideoFrameBuffer = class {
    constructor(video2, fps, autoHide = true) {
      this.isDestroyed = false;
      this.autoHide = true;
      this.isMobile = false;
      this.audioExtractor = null;
      this.audioInitPromise = null;
      this.seenFrames = 0;
      this.isCanvasSizeSet = false;
      this.frames = /* @__PURE__ */ new Map();
      this.audioFingerprints = /* @__PURE__ */ new Map();
      this.video = video2;
      this.fps = fps;
      this.autoHide = autoHide;
      this.createCanvas();
      this.createTransformCanvas();
    }
    createTransformCanvas() {
      this.transformCanvas = document.createElement("canvas");
      this.transformCanvasCtx = this.canvas.getContext("2d", {
        willReadFrequently: true,
        alpha: false
      });
      this.transformCanvas.width = SIGNATURE_SCALE;
      this.transformCanvas.height = SIGNATURE_SCALE;
    }
    /**
     * Initialize audio fingerprinting for frame sync.
     * Call this after the video is ready.
     */
    async initAudioSync() {
      if (this.audioExtractor) {
        return this.audioInitPromise ?? Promise.resolve();
      }
      this.audioExtractor = new AudioFingerprintExtractor(this.video, this.fps);
      this.audioInitPromise = this.audioExtractor.init();
      return this.audioInitPromise;
    }
    /**
     * Check if audio sync is available.
     */
    hasAudioSync() {
      return this.audioExtractor?.hasAudio() ?? false;
    }
    start() {
      this.addRequestFrameCallback();
      if (!this.isMobile) {
        this.initAudioSync().catch(() => {
        });
      }
    }
    destroy() {
      this.isDestroyed = true;
      this.frames.forEach((frame) => frame.close());
      this.frames.clear();
      this.audioFingerprints.clear();
      if (this.audioExtractor) {
        this.audioExtractor.destroy();
        this.audioExtractor = null;
      }
      this.audioInitPromise = null;
    }
    tick(_, metadata) {
      this.setCanvasSize();
      const delta = metadata.expectedDisplayTime - performance.now();
      if (delta > 10) {
      }
      if (this.isDestroyed) {
        return false;
      }
      if (this.seenFrames >= this.totalFrames) {
        if (this.autoHide) {
          try {
            if (!this.video.paused) {
              this.video.pause();
            }
            this.video.style.display = "none";
          } catch (e) {
          }
        }
        return false;
      }
      if (this.video.videoWidth === 0 || this.video.videoHeight === 0) {
        return true;
      }
      const video2 = this.video;
      const frameNumber = this.frameNumberFromTime(metadata.mediaTime);
      const expectedFrame = Math.max(
        1,
        metadata.presentedFrames > this.totalFrames ? metadata.presentedFrames % this.totalFrames : metadata.presentedFrames
      );
      if (!expectedFrame) {
        throw new Error("expectedFrame is 0");
      }
      if (!this.hasFrame(frameNumber)) {
        this.ctx.drawImage(
          video2,
          0,
          0,
          this.width,
          this.height,
          0,
          0,
          this.width,
          this.height
        );
        const imageData = this.ctx.getImageData(
          0,
          0,
          this.canvas.width,
          this.canvas.height
        );
        createImageBitmap(imageData, 0, 0, this.width, this.height).then(
          async (imageBitmap) => {
            this.setFrame(frameNumber, imageBitmap);
            if (!this.isMobile && this.audioExtractor?.hasAudio()) {
              const fp = this.audioExtractor.getFingerprint(frameNumber);
              if (fp) {
                this.setAudioFingerprint(frameNumber, fp);
              }
            }
          }
        );
      } else {
        this.seenFrames++;
      }
      return true;
    }
    addRequestFrameCallback() {
      if (this.isDestroyed) {
        return;
      }
      this.video.requestVideoFrameCallback((_, metadata) => {
        const repeat = this.tick(_, metadata);
        if (repeat) {
          this.addRequestFrameCallback();
        }
      });
    }
    createCanvas() {
      this.canvas = document.createElement("canvas");
      this.ctx = this.canvas.getContext("2d", {
        willReadFrequently: true,
        alpha: false
      });
    }
    setCanvasSize() {
      if (this.isCanvasSizeSet) {
        return;
      }
      this.canvas.width = this.video.videoWidth;
      this.canvas.height = this.video.videoHeight;
      this.isCanvasSizeSet = true;
    }
    get width() {
      return this.video.videoWidth;
    }
    get height() {
      return this.video.videoHeight;
    }
    hasFrame(frame) {
      return this.frames.has(frame);
    }
    getFrame(frame) {
      if (this.frames.has(frame)) {
        return this.frames.get(frame);
      } else {
        return null;
      }
    }
    /**
     * Find the best matching frame number using audio fingerprint comparison.
     * Searches within a ±3 frame window around the reference frame.
     *
     * @param signature - Audio fingerprint from the main video frame
     * @param refFrameNumber - Reference frame number to search around
     * @returns Best matching frame number based on audio similarity
     */
    getFrameNumberBySignature(signature, refFrameNumber) {
      if (!signature) {
        return refFrameNumber;
      }
      let bestSimilarityScore = 0;
      let bestFrameNumber = refFrameNumber;
      const frameNumbers = [
        refFrameNumber - 3,
        refFrameNumber - 2,
        refFrameNumber - 1,
        refFrameNumber,
        refFrameNumber + 1,
        refFrameNumber + 2,
        refFrameNumber + 3
      ].filter(
        (frameNumber) => frameNumber > 0 && frameNumber <= this.totalFrames
      );
      frameNumbers.forEach((frameNumber) => {
        const fingerprint = this.getAudioFingerprint(frameNumber);
        if (fingerprint) {
          const result = calculateAudioSimilarity(signature, fingerprint);
          if (result > bestSimilarityScore) {
            bestSimilarityScore = result;
            bestFrameNumber = frameNumber;
          }
        }
      });
      return bestFrameNumber;
    }
    setFrame(frame, data) {
      this.frames.set(frame, data);
    }
    /**
     * Store audio fingerprint for a frame.
     */
    setAudioFingerprint(frame, data) {
      this.audioFingerprints.set(frame, data);
    }
    /**
     * Get audio fingerprint for a frame.
     * Falls back to extracting from audio extractor if not cached.
     */
    getAudioFingerprint(frame) {
      if (this.audioFingerprints.has(frame)) {
        return this.audioFingerprints.get(frame);
      }
      if (this.audioExtractor?.hasAudio()) {
        const fp = this.audioExtractor.getFingerprint(frame);
        if (fp) {
          this.audioFingerprints.set(frame, fp);
          return fp;
        }
      }
      return null;
    }
    get totalFrames() {
      return Math.round(this.video.duration * this.fps);
    }
    frameNumberFromTime(time) {
      return Math.max(1, Math.round(time * this.fps));
    }
  };

  // src/config.ts
  var defaultConfig = {
    layout: "horizontal",
    mobile: {
      collapsibleToolbars: true,
      gesturesEnabled: true,
      autoCollapse: true,
      breakpoint: 960
    },
    theme: "dark",
    toolbar: {
      draggable: false,
      sidebarPosition: "left",
      defaultTool: "curve"
    },
    features: {
      showThemeToggle: true,
      showFullscreen: true,
      showProgressBar: true,
      showFrameCounter: true
    }
  };
  function mergeConfig(partial) {
    if (!partial) {
      return { ...defaultConfig };
    }
    return {
      layout: partial.layout ?? defaultConfig.layout,
      theme: partial.theme ?? defaultConfig.theme,
      mobile: {
        ...defaultConfig.mobile,
        ...partial.mobile
      },
      toolbar: {
        ...defaultConfig.toolbar,
        ...partial.toolbar
      },
      features: {
        ...defaultConfig.features,
        ...partial.features
      }
    };
  }

  // src/ui/layout/index.ts
  var LayoutManager = class {
    constructor(tool) {
      this.tool = tool;
      this.currentRenderer = null;
      this.rootElement = null;
      this.prefix = getCSSPrefix();
    }
    /**
     * Get the root container element that holds layout classes
     */
    getRootElement() {
      if (!this.rootElement) {
        const canvas = this.tool.canvas;
        if (canvas?.parentElement) {
          this.rootElement = canvas.parentElement;
          this.rootElement.classList.add(`${this.prefix}-root`);
        }
      }
      return this.rootElement;
    }
    /**
     * Remove all layout classes from root element
     */
    clearLayoutClasses() {
      const root = this.getRootElement();
      if (root) {
        root.classList.remove(
          `${this.prefix}-layout-horizontal`,
          `${this.prefix}-layout-vertical`,
          `${this.prefix}-layout-minimal`,
          `${this.prefix}-layout-bottom-dock`,
          `${this.prefix}-sidebar-right`
        );
      }
    }
    /**
     * Set the active layout mode
     */
    setLayout(mode, options) {
      if (this.currentRenderer) {
        this.currentRenderer.cleanup();
      }
      this.clearLayoutClasses();
      const root = this.getRootElement();
      if (root) {
        root.classList.add(`${this.prefix}-layout-${mode}`);
        if (mode === "vertical" && options?.sidebarPosition === "right") {
          root.classList.add(`${this.prefix}-sidebar-right`);
        }
      }
      this.currentRenderer = this.createRenderer(mode);
      this.currentRenderer.apply(this.tool);
    }
    /**
     * Get current layout mode
     */
    getCurrentLayout() {
      return this.currentRenderer?.name ?? null;
    }
    /**
     * Create a layout renderer for the given mode
     */
    createRenderer(mode) {
      switch (mode) {
        case "horizontal":
          return new HorizontalLayout();
        case "vertical":
          return new VerticalLayout();
        case "minimal":
          return new MinimalLayout();
        case "bottom-dock":
          return new BottomDockLayout();
      }
    }
    /**
     * Cleanup the layout manager
     */
    destroy() {
      if (this.currentRenderer) {
        this.currentRenderer.cleanup();
        this.currentRenderer = null;
      }
      this.clearLayoutClasses();
      this.rootElement = null;
    }
  };
  var HorizontalLayout = class {
    constructor() {
      this.name = "horizontal";
    }
    apply(_tool) {
    }
    cleanup() {
    }
  };
  var VerticalLayout = class {
    constructor() {
      this.name = "vertical";
    }
    apply(_tool) {
    }
    cleanup() {
    }
  };
  var MinimalLayout = class {
    constructor() {
      this.name = "minimal";
      this.dragState = {
        isDragging: false,
        startX: 0,
        startY: 0,
        offsetX: 0,
        offsetY: 0
      };
      this.container = null;
      this.boundHandlers = {};
      this.prefix = getCSSPrefix();
    }
    apply(tool) {
      this.container = tool.uiContainer;
      if (!this.container) return;
      this.boundHandlers.mousedown = this.handleMouseDown.bind(this);
      this.boundHandlers.mousemove = this.handleMouseMove.bind(this);
      this.boundHandlers.mouseup = this.handleMouseUp.bind(this);
      this.container.addEventListener("mousedown", this.boundHandlers.mousedown);
      document.addEventListener("mousemove", this.boundHandlers.mousemove);
      document.addEventListener("mouseup", this.boundHandlers.mouseup);
      const config = tool.config;
      if (config?.toolbar?.position) {
        this.container.style.left = `${config.toolbar.position.x}px`;
        this.container.style.top = `${config.toolbar.position.y}px`;
      }
    }
    cleanup() {
      if (this.container && this.boundHandlers.mousedown) {
        this.container.removeEventListener("mousedown", this.boundHandlers.mousedown);
      }
      if (this.boundHandlers.mousemove) {
        document.removeEventListener("mousemove", this.boundHandlers.mousemove);
      }
      if (this.boundHandlers.mouseup) {
        document.removeEventListener("mouseup", this.boundHandlers.mouseup);
      }
      if (this.container) {
        this.container.style.left = "";
        this.container.style.top = "";
      }
      this.container = null;
      this.boundHandlers = {};
    }
    handleMouseDown(e) {
      if (!this.container) return;
      if (e.target.closest("button, input")) return;
      this.dragState.isDragging = true;
      this.dragState.startX = e.clientX;
      this.dragState.startY = e.clientY;
      const rect = this.container.getBoundingClientRect();
      this.dragState.offsetX = rect.left;
      this.dragState.offsetY = rect.top;
      this.container.classList.add(`${this.prefix}-dragging`);
      e.preventDefault();
    }
    handleMouseMove(e) {
      if (!this.dragState.isDragging || !this.container) return;
      const dx = e.clientX - this.dragState.startX;
      const dy = e.clientY - this.dragState.startY;
      this.container.style.left = `${this.dragState.offsetX + dx}px`;
      this.container.style.top = `${this.dragState.offsetY + dy}px`;
    }
    handleMouseUp() {
      if (!this.container) return;
      this.dragState.isDragging = false;
      this.container.classList.remove(`${this.prefix}-dragging`);
    }
  };
  var BottomDockLayout = class {
    constructor() {
      this.name = "bottom-dock";
      this.movedElements = [];
      this.playerControls = null;
      this.divider = null;
      this.prefix = getCSSPrefix();
    }
    apply(tool) {
      const container = tool.uiContainer;
      const playerControls = tool.playerControlsContainer;
      if (container && playerControls) {
        this.playerControls = playerControls;
        this.divider = document.createElement("div");
        this.divider.classList.add(`${this.prefix}-divider`);
        container.appendChild(this.divider);
        while (playerControls.firstChild) {
          const child = playerControls.firstChild;
          this.movedElements.push(child);
          container.appendChild(child);
        }
      }
    }
    cleanup() {
      if (this.playerControls) {
        for (const element of this.movedElements) {
          this.playerControls.appendChild(element);
        }
      }
      if (this.divider && this.divider.parentNode) {
        this.divider.parentNode.removeChild(this.divider);
      }
      this.movedElements = [];
      this.playerControls = null;
      this.divider = null;
    }
  };

  // src/ui/collapse-controller.ts
  var CollapseController = class {
    constructor(container, autoCollapse = true) {
      this.container = container;
      this.autoCollapse = autoCollapse;
      this.isCollapsed = false;
      this.collapseButton = null;
      this.prefix = getCSSPrefix();
    }
    /**
     * Initialize the collapse controller
     */
    init() {
      this.container.classList.add(`${this.prefix}-collapsible`);
      this.createCollapseButton();
    }
    /**
     * Create the collapse/expand toggle button
     */
    createCollapseButton() {
      this.collapseButton = document.createElement("button");
      this.collapseButton.type = "button";
      this.collapseButton.classList.add(`${this.prefix}-collapse-btn`);
      this.collapseButton.setAttribute("aria-label", "Toggle toolbar");
      this.collapseButton.setAttribute("data-tooltip", "Toggle toolbar");
      this.updateButtonIcon();
      this.collapseButton.addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggle();
      });
      this.container.parentElement?.insertBefore(
        this.collapseButton,
        this.container.nextSibling
      );
    }
    /**
     * Update the button icon based on collapsed state
     */
    updateButtonIcon() {
      if (!this.collapseButton) return;
      this.collapseButton.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="18 15 12 9 6 15"/>
      </svg>
    `;
    }
    /**
     * Collapse the toolbar
     */
    collapse() {
      if (this.isCollapsed) return;
      this.isCollapsed = true;
      this.container.classList.add(`${this.prefix}-collapsed`);
    }
    /**
     * Expand the toolbar
     */
    expand() {
      if (!this.isCollapsed) return;
      this.isCollapsed = false;
      this.container.classList.remove(`${this.prefix}-collapsed`);
    }
    /**
     * Toggle collapse state
     */
    toggle() {
      if (this.isCollapsed) {
        this.expand();
      } else {
        this.collapse();
      }
    }
    /**
     * Check if toolbar is collapsed
     */
    get collapsed() {
      return this.isCollapsed;
    }
    /**
     * Check if auto-collapse is enabled
     */
    get autoCollapseEnabled() {
      return this.autoCollapse;
    }
    /**
     * Set auto-collapse behavior
     */
    setAutoCollapse(enabled) {
      this.autoCollapse = enabled;
    }
    /**
     * Cleanup the controller
     */
    destroy() {
      if (this.collapseButton) {
        this.collapseButton.remove();
        this.collapseButton = null;
      }
      this.container.classList.remove(
        `${this.prefix}-collapsible`,
        `${this.prefix}-collapsed`
      );
    }
  };

  // src/gestures/gesture-handler.ts
  var GestureHandler = class {
    constructor(canvas, onGestureChange) {
      this.canvas = canvas;
      this.onGestureChange = onGestureChange;
      this.initialDistance = 0;
      this.initialScale = 1;
      this.currentScale = 1;
      this.panStart = { x: 0, y: 0 };
      this.panOffset = { x: 0, y: 0 };
      this.isGesturing = false;
      this.activeTouches = 0;
      /** Minimum zoom scale */
      this.minScale = 0.5;
      /** Maximum zoom scale */
      this.maxScale = 3;
      /**
       * Handle touch start - detect two-finger gesture
       */
      this.handleTouchStart = (e) => {
        this.activeTouches = e.touches.length;
        if (e.touches.length === 2) {
          e.preventDefault();
          this.isGesturing = true;
          this.initialDistance = this.getDistance(e.touches[0], e.touches[1]);
          this.initialScale = this.currentScale;
          this.panStart = this.getMidpoint(e.touches[0], e.touches[1]);
        }
      };
      /**
       * Handle touch move - process pinch and pan
       */
      this.handleTouchMove = (e) => {
        if (e.touches.length === 2 && this.isGesturing) {
          e.preventDefault();
          const distance = this.getDistance(e.touches[0], e.touches[1]);
          const scaleChange = distance / this.initialDistance;
          this.currentScale = Math.max(
            this.minScale,
            Math.min(this.maxScale, this.initialScale * scaleChange)
          );
          const midpoint = this.getMidpoint(e.touches[0], e.touches[1]);
          this.panOffset = {
            x: this.panOffset.x + (midpoint.x - this.panStart.x),
            y: this.panOffset.y + (midpoint.y - this.panStart.y)
          };
          this.panStart = midpoint;
          this.onGestureChange(this.getState());
        }
      };
      /**
       * Handle touch end - finish gesture
       */
      this.handleTouchEnd = (e) => {
        this.activeTouches = e.touches.length;
        if (e.touches.length < 2) {
          this.isGesturing = false;
          if (e.touches.length === 1) {
            this.panStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
          }
        }
      };
    }
    /**
     * Initialize gesture listeners
     */
    init() {
      this.canvas.addEventListener("touchstart", this.handleTouchStart, { passive: false });
      this.canvas.addEventListener("touchmove", this.handleTouchMove, { passive: false });
      this.canvas.addEventListener("touchend", this.handleTouchEnd, { passive: false });
      this.canvas.addEventListener("touchcancel", this.handleTouchEnd, { passive: false });
    }
    /**
     * Calculate distance between two touch points
     */
    getDistance(t1, t2) {
      const dx = t2.clientX - t1.clientX;
      const dy = t2.clientY - t1.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }
    /**
     * Calculate midpoint between two touch points
     */
    getMidpoint(t1, t2) {
      return {
        x: (t1.clientX + t2.clientX) / 2,
        y: (t1.clientY + t2.clientY) / 2
      };
    }
    /**
     * Get current gesture state
     */
    getState() {
      return {
        scale: this.currentScale,
        panX: this.panOffset.x,
        panY: this.panOffset.y
      };
    }
    /**
     * Check if a gesture is currently active
     */
    isActive() {
      return this.isGesturing;
    }
    /**
     * Check if there are two fingers touching
     */
    hasTwoFingers() {
      return this.activeTouches >= 2;
    }
    /**
     * Reset gesture state to defaults
     */
    reset() {
      this.currentScale = 1;
      this.panOffset = { x: 0, y: 0 };
      this.initialScale = 1;
      this.initialDistance = 0;
      this.isGesturing = false;
      this.onGestureChange(this.getState());
    }
    /**
     * Set the zoom scale directly
     */
    setScale(scale) {
      this.currentScale = Math.max(this.minScale, Math.min(this.maxScale, scale));
      this.onGestureChange(this.getState());
    }
    /**
     * Set the pan offset directly
     */
    setPan(x, y) {
      this.panOffset = { x, y };
      this.onGestureChange(this.getState());
    }
    /**
     * Cleanup gesture listeners
     */
    destroy() {
      this.canvas.removeEventListener("touchstart", this.handleTouchStart);
      this.canvas.removeEventListener("touchmove", this.handleTouchMove);
      this.canvas.removeEventListener("touchend", this.handleTouchEnd);
      this.canvas.removeEventListener("touchcancel", this.handleTouchEnd);
    }
  };

  // src/core.ts
  var pixelRatio = window.devicePixelRatio || 1;
  var DEFAULT_FPS = 25;
  var AnnotationTool = class extends AnnotationToolBase {
    constructor(videoElement, config) {
      super();
      this.referenceVideoFrameBuffer = null;
      this.videoFrameBuffer = null;
      this.ffmpegFrameExtractor = null;
      this.isMouseDown = false;
      this.buttons = [];
      this.plugins = [];
      this.annotatedFrameCoordinates = [];
      // Track blob URLs for cleanup to prevent memory leaks
      this.videoBlobUrl = null;
      this.referenceVideoBlobUrl = null;
      this.frameCounterTimeoutId = null;
      // Enforced total frames count (overrides calculated value from video duration)
      this._enforcedTotalFrames = null;
      // Track cursor hover state for showing progress bar during playback
      this.isCursorOverCanvas = false;
      // Overlay opacity for compare mode (0 = off, 0.25, 0.5, 0.7, 1)
      this.overlayOpacity = 0.7;
      // Theme for UI elements
      this._theme = "dark";
      // Listeners for theme changes
      this.themeChangeListeners = [];
      // Layout manager for switching between layouts
      this.layoutManager = null;
      // Collapse controller for toolbar visibility
      this.collapseController = null;
      // Gesture handler for pinch-to-zoom and pan
      this.gestureHandler = null;
      // Current gesture transform state
      this.gestureState = { scale: 1, panX: 0, panY: 0 };
      this.fps = DEFAULT_FPS;
      this.plannedFn = null;
      this.ct = 0;
      this.isCanvasInitialized = false;
      this.enforcedCanvasSize = null;
      this.lastNavigatedFrame = 0;
      this.isProgressBarNavigation = false;
      this.isAnnotationsAsVideoActive = false;
      this.config = mergeConfig(config);
      this._theme = this.config.theme;
      this.plugins = plugins.map((Plugin) => new Plugin(this));
      this.init(videoElement);
    }
    prevFrame() {
      const activeTimeFrame = this.playbackFrame;
      const newFrame = activeTimeFrame - 1;
      if (newFrame < 1) {
        this.playbackFrame = this.totalFrames;
      } else {
        this.playbackFrame = newFrame;
      }
    }
    nextFrame() {
      const activeTimeFrame = this.playbackFrame;
      const newFrame = activeTimeFrame + 1;
      if (newFrame > this.totalFrames) {
        this.playbackFrame = 1;
      } else {
        this.playbackFrame = newFrame;
      }
    }
    /**
     * Get sorted list of frames that have annotations
     */
    getAnnotatedFrames() {
      const frames = [];
      this.timeStack.forEach((shapes, frame) => {
        if (shapes && shapes.length > 0) {
          frames.push(frame);
        }
      });
      return frames.sort((a, b2) => a - b2);
    }
    /**
     * Jump to the previous annotated frame
     */
    prevAnnotatedFrame() {
      const annotatedFrames = this.getAnnotatedFrames();
      if (annotatedFrames.length === 0) return;
      const currentFrame = this.playbackFrame;
      for (let i = annotatedFrames.length - 1; i >= 0; i--) {
        if (annotatedFrames[i] < currentFrame) {
          this.playbackFrame = annotatedFrames[i];
          return;
        }
      }
      this.playbackFrame = annotatedFrames[annotatedFrames.length - 1];
    }
    /**
     * Jump to the next annotated frame
     */
    nextAnnotatedFrame() {
      const annotatedFrames = this.getAnnotatedFrames();
      if (annotatedFrames.length === 0) return;
      const currentFrame = this.playbackFrame;
      for (const frame of annotatedFrames) {
        if (frame > currentFrame) {
          this.playbackFrame = frame;
          return;
        }
      }
      this.playbackFrame = annotatedFrames[0];
    }
    get theme() {
      return this._theme;
    }
    setTheme(theme) {
      this._theme = theme;
      injectThemeStyles(theme);
      this.themeChangeListeners.forEach((listener) => listener(theme));
    }
    onThemeChange(listener) {
      this.themeChangeListeners.push(listener);
      return () => {
        const index = this.themeChangeListeners.indexOf(listener);
        if (index !== -1) {
          this.themeChangeListeners.splice(index, 1);
        }
      };
    }
    // ==================== LAYOUT API ====================
    /**
     * Set the layout mode for the annotation tool
     */
    setLayout(mode) {
      if (!this.layoutManager) {
        this.layoutManager = new LayoutManager(this);
      }
      this.layoutManager.setLayout(mode, {
        sidebarPosition: this.config.toolbar.sidebarPosition
      });
    }
    /**
     * Get the current layout mode
     */
    getLayout() {
      return this.layoutManager?.getCurrentLayout() ?? this.config.layout;
    }
    // ==================== COLLAPSE API ====================
    /**
     * Collapse the toolbar
     */
    collapseToolbar() {
      this.collapseController?.collapse();
    }
    /**
     * Expand the toolbar
     */
    expandToolbar() {
      this.collapseController?.expand();
    }
    /**
     * Toggle toolbar collapse state
     */
    toggleToolbar() {
      this.collapseController?.toggle();
    }
    /**
     * Check if toolbar is collapsed
     */
    isToolbarCollapsed() {
      return this.collapseController?.collapsed ?? false;
    }
    // ==================== GESTURE API ====================
    /**
     * Enable or disable gesture support
     */
    setGesturesEnabled(enabled) {
      if (enabled && !this.gestureHandler) {
        this.gestureHandler = new GestureHandler(this.canvas, (state) => {
          this.applyGestureTransform(state);
        });
        this.gestureHandler.init();
      } else if (!enabled && this.gestureHandler) {
        this.gestureHandler.destroy();
        this.gestureHandler = null;
        this.resetZoom();
      }
    }
    /**
     * Check if gestures are enabled
     */
    isGesturesEnabled() {
      return this.gestureHandler !== null;
    }
    /**
     * Reset zoom and pan to default
     */
    resetZoom() {
      this.gestureState = { scale: 1, panX: 0, panY: 0 };
      this.gestureHandler?.reset();
      this.redrawFullCanvas();
    }
    /**
     * Get current zoom scale
     */
    getZoomScale() {
      return this.gestureState.scale;
    }
    /**
     * Apply gesture transform to canvas
     */
    applyGestureTransform(state) {
      this.gestureState = state;
      this.redrawFullCanvas();
    }
    removeGlobalShape(shapeType) {
      this.globalShapes = this.globalShapes.filter((s) => s.type !== shapeType);
    }
    addGlobalShape(shape) {
      this.globalShapes.push(shape);
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
    set currentTool(tool) {
      const prevTool = this._currentTool;
      if (prevTool) {
        this.getButtonForTool(prevTool).classList.remove("active");
        this.pluginForTool(prevTool).onDeactivate();
      }
      this._currentTool = tool;
      this.canvas.style.cursor = tool ? "pointer" : "default";
      if (tool) {
        this.getButtonForTool(tool).classList.add("active");
        this.pluginForTool(tool).onActivate();
      }
    }
    enableFrameRateDetection() {
      if (this.destructors.find((d) => d.name === "frameRateDetector")) return;
      const video2 = this.videoElement;
      if (video2.tagName === "IMG") return;
      const destructor = detectFrameRate(video2, (fps) => {
        this.fps = fps;
      });
      Object.defineProperty(destructor, "name", { value: "frameRateDetector" });
      this.destructors.push(destructor);
    }
    timeToFrame(time) {
      return Math.max(1, Math.round(time * this.fps));
    }
    get playbackFrame() {
      if (this.videoElement instanceof HTMLImageElement) return 1;
      return this.timeToFrame(this.videoElement.currentTime);
    }
    set playbackFrame(frame) {
      if (this.videoElement instanceof HTMLImageElement) return;
      const newTime = frame / this.fps;
      this.videoElement.currentTime = newTime;
      this.rvf(() => {
        this.show();
      });
    }
    rvf(fn) {
      this.plannedFn = fn;
    }
    get canvasWidth() {
      return this.enforcedCanvasSize?.width ?? 0;
    }
    get canvasHeight() {
      return this.enforcedCanvasSize?.height ?? 0;
    }
    get aspectRatio() {
      if (this.canvasHeight === 0) {
        return 0;
      }
      return this.canvasWidth / this.canvasHeight;
    }
    get isMobile() {
      const breakpoint = this.config?.mobile?.breakpoint ?? 960;
      return window.innerWidth < breakpoint;
    }
    get progressBarCoordinates() {
      const height = this.isMobile ? 30 : 10;
      const progressBarLeftMargin = 5;
      const frameOverlayOffset = 55;
      const progressBarWidth = this.canvasWidth - progressBarLeftMargin - frameOverlayOffset;
      const x = progressBarLeftMargin;
      const y = this.canvasHeight - height;
      const width = progressBarWidth;
      return { x, y, width, height };
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
      return pixelRatio;
    }
    async setVideoBlob(blob, fps = this.fps) {
      if (this.videoBlobUrl) {
        URL.revokeObjectURL(this.videoBlobUrl);
      }
      const url = URL.createObjectURL(blob);
      this.videoBlobUrl = url;
      await this.setVideoUrl(url, fps);
      this.plugins.forEach((p2) => {
        p2.on("videoBlobSet", blob);
      });
    }
    async setVideoUrl(url, fps = this.fps) {
      if (this.videoElement instanceof HTMLImageElement) return;
      const video2 = this.videoElement;
      video2.src = url.toString();
      await this.videoElement.load();
      this.setFrameRate(fps);
      if (this.videoFrameBuffer) {
        this.videoFrameBuffer.destroy();
        this.videoFrameBuffer = new VideoFrameBuffer(video2, fps, false);
        this.videoFrameBuffer.isMobile = this.isMobile;
      }
      this.setCanvasSize();
    }
    enableVideoFrameBuffer() {
      if (this.videoElement instanceof HTMLImageElement) return;
      this.videoFrameBuffer = new VideoFrameBuffer(
        this.videoElement,
        this.fps,
        false
      );
      this.videoFrameBuffer.isMobile = this.isMobile;
    }
    /**
     * Set FFmpeg frame extractor for precise frame-accurate playback.
     * When set, extracted frames will be used instead of video element frames.
     */
    setFFmpegFrameExtractor(extractor) {
      this.ffmpegFrameExtractor = extractor;
      this.redrawFullCanvas();
    }
    /**
     * Check if FFmpeg frames are available for the current frame.
     */
    hasFFmpegFrame(frameNumber) {
      return this.ffmpegFrameExtractor?.hasFrame(frameNumber) ?? false;
    }
    hide() {
      this.stopAnnotationsAsVideo();
      this.hideControls();
      this.hideCanvas();
    }
    showControls() {
      this.uiContainer.style.display = "";
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
    updateActiveTimeFrame(mediaTime = void 0) {
      this.activeTimeFrame = mediaTime ? this.timeToFrame(mediaTime) : this.playbackFrame;
    }
    show() {
      this.stopAnnotationsAsVideo();
      this.updateActiveTimeFrame();
      this.showCanvas();
      this.showControls();
      this.redrawFullCanvas();
    }
    setCanvasSettings() {
      this.ctx.strokeStyle = this.selectedColor;
      this.ctx.fillStyle = this.selectedColor;
      this.ctx.lineWidth = this.selectedStrokeSize;
    }
    pluginForTool(tool) {
      if (this.isDestroyed) {
        throw new Error("AnnotationTool is destroyed");
      }
      const maybePlugin = this.plugins.find((p2) => p2.name === tool);
      if (!maybePlugin) {
        throw new Error(`No plugin found for tool ${tool}`);
      }
      return maybePlugin;
    }
    getButtonForTool(tool) {
      return this.buttons.find(
        (button) => button.dataset.tool === tool
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
      this.isProgressBarNavigation = false;
      this.shapes = [];
      this.globalShapes = [];
      this.currentTool = this.isMobile ? null : this.config.toolbar.defaultTool ?? null;
      injectThemeStyles(this._theme);
      this.layoutManager = new LayoutManager(this);
      this.layoutManager.setLayout(this.config.layout, {
        sidebarPosition: this.config.toolbar.sidebarPosition
      });
      if (this.isMobile && this.config.mobile.collapsibleToolbars) {
        this.collapseController = new CollapseController(
          this.uiContainer,
          this.config.mobile.autoCollapse
        );
        this.collapseController.init();
      }
      if (this.isMobile && this.config.mobile.gesturesEnabled) {
        this.gestureHandler = new GestureHandler(this.canvas, (state) => {
          this.applyGestureTransform(state);
        });
        this.gestureHandler.init();
      }
    }
    setVideoStyles() {
      this.videoElement.style.objectFit = "cover";
      this.videoElement.style.objectPosition = "left top";
    }
    get frameCallbackSupported() {
      return "requestVideoFrameCallback" in HTMLVideoElement.prototype;
    }
    initFrameCounter() {
      if (!this.frameCallbackSupported) {
        this.frameCounterTimeoutId = setTimeout(() => {
          if (this.isDestroyed) return;
          this.plannedFn?.();
          this.plannedFn = null;
          this.initFrameCounter();
          this.updateActiveTimeFrame();
          this.playAnnotationsAsVideo();
        }, 1e3 / this.fps);
        return;
      }
      this.withVideo((video2) => {
        video2.requestVideoFrameCallback((_, metadata) => {
          if (!this.isCanvasInitialized) {
            this._setCanvasSize();
          }
          this.videoFrameBuffer?.tick(_, metadata);
          this.plannedFn?.();
          this.plannedFn = null;
          this.raf(() => {
            this.initFrameCounter();
            this.updateActiveTimeFrame(metadata.mediaTime);
            this.playAnnotationsAsVideo();
          });
        });
      });
    }
    init(videoElement) {
      this.videoElement = videoElement;
      this.setVideoStyles();
      this.initFrameCounter();
      this.bindContext();
      this.initCanvas();
      this.initUI();
      this.initProperties();
      this.setCanvasSize();
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
      if (this.isDestroyed) return;
      super.destroy();
      this.stopAnnotationsAsVideo();
      if (this.frameCounterTimeoutId) {
        clearTimeout(this.frameCounterTimeoutId);
        this.frameCounterTimeoutId = null;
      }
      if (this.videoBlobUrl) {
        URL.revokeObjectURL(this.videoBlobUrl);
        this.videoBlobUrl = null;
      }
      if (this.referenceVideoBlobUrl) {
        URL.revokeObjectURL(this.referenceVideoBlobUrl);
        this.referenceVideoBlobUrl = null;
      }
      this.currentTool = null;
      this.plugins.forEach((plugin) => plugin.reset());
      this.annotatedFrameCoordinates = [];
      this.setFrameRate(DEFAULT_FPS);
      const wrapper = this.strokeSizePicker.parentElement;
      wrapper?.parentNode?.removeChild(wrapper);
      if (this.referenceVideoElement) {
        const referenceVideoWrapper = this.referenceVideoElement.parentElement;
        referenceVideoWrapper?.parentNode?.removeChild(referenceVideoWrapper);
        this.referenceVideoElement = null;
      }
      const colorPickerWrapper = this.colorPicker.parentElement;
      colorPickerWrapper?.parentNode?.removeChild(colorPickerWrapper);
      this.buttons.forEach((button) => {
        button.parentNode?.removeChild(button);
      });
      this.buttons = [];
      this.uiContainer.parentNode?.removeChild(this.uiContainer);
      this.canvas.parentNode?.removeChild(this.canvas);
      this.playerControlsContainer.parentElement?.removeChild(
        this.playerControlsContainer
      );
      const keysToDelete = [
        "strokeSizePicker",
        "colorPicker",
        "uiContainer",
        "playerControlsContainer",
        "canvas",
        "ctx",
        "videoElement"
      ];
      keysToDelete.forEach((key) => {
        delete this[key];
      });
      this.activeTimeFrame = 0;
      this.isDestroyed = true;
      this.referenceVideoFrameBuffer?.destroy();
      this.referenceVideoFrameBuffer = null;
      this.videoFrameBuffer?.destroy();
      this.videoFrameBuffer = null;
      this.layoutManager?.destroy();
      this.layoutManager = null;
      this.collapseController?.destroy();
      this.collapseController = null;
      this.gestureHandler?.destroy();
      this.gestureHandler = null;
      this.gestureState = { scale: 1, panX: 0, panY: 0 };
    }
    _setCanvasSize() {
      const style = getComputedStyle(this.videoElement);
      const rawWidth = parseInt(style.width, 10);
      const video2 = this.videoElement;
      const trueAspectRatio = video2.videoWidth / video2.videoHeight;
      if (isNaN(rawWidth) || !video2.videoWidth || !video2.videoHeight) {
        this.isCanvasInitialized = false;
        this.setCanvasSettings();
        return false;
      }
      const container = video2.parentElement;
      const isFullscreen = !!(document.fullscreenElement ?? document.webkitFullscreenElement);
      let width = Math.min(rawWidth, video2.videoWidth);
      let height = Math.floor(width / trueAspectRatio);
      if (isFullscreen && container) {
        const CONTROLS_HEIGHT = 50;
        const TOOLS_HEIGHT = 40;
        const containerWidth = window.innerWidth;
        const containerHeight = window.innerHeight - (CONTROLS_HEIGHT + TOOLS_HEIGHT);
        const containerRatio = containerWidth / containerHeight;
        if (containerRatio > trueAspectRatio) {
          height = containerHeight;
          width = height * trueAspectRatio;
        } else {
          width = containerWidth;
          height = width / trueAspectRatio;
        }
        video2.style.width = `${width}px`;
        video2.style.height = `${height}px`;
        video2.style.marginTop = `${TOOLS_HEIGHT}px`;
        video2.style.marginBottom = `${CONTROLS_HEIGHT}px`;
      } else {
        video2.style.width = `${width}px`;
        video2.style.height = `${height}px`;
        video2.style.marginTop = "";
        video2.style.marginBottom = "";
      }
      this.isCanvasInitialized = video2.videoWidth > 0 && video2.videoHeight > 0;
      this.canvas.width = width * this.pixelRatio;
      this.canvas.height = height * this.pixelRatio;
      this.canvas.style.width = `${width}px`;
      this.canvas.style.height = `${height}px`;
      this.canvas.style.position = "absolute";
      const videoTop = video2.offsetTop;
      const videoLeft = video2.offsetLeft;
      this.canvas.style.top = `${videoTop}px`;
      this.canvas.style.left = `${videoLeft}px`;
      this.enforcedCanvasSize = { width, height };
      this.ctx.scale(this.pixelRatio, this.pixelRatio);
      this.setCanvasSettings();
      return true;
    }
    setCanvasSize() {
      if (this._setCanvasSize()) {
        this.syncVideoSizes();
        this.redrawFullCanvas();
      }
    }
    replaceShape(shape, index) {
      const serializedShape = this.serialize([shape])[0];
      this.undoStack.push([...this.shapes]);
      this.shapes[index] = serializedShape;
    }
    addShape(shape) {
      const serializedShape = this.serialize([shape])[0];
      this.undoStack.push([...this.shapes]);
      this.shapes.push(serializedShape);
    }
    get msPerFrame() {
      return 1e3 / this.fps;
    }
    syncVideoSizes() {
      this.withRefVideo((refVideo) => {
        const video2 = this.videoElement;
        const videoPosition = video2.getBoundingClientRect();
        refVideo.style.position = "fixed";
        refVideo.style.top = `${videoPosition.top}px`;
        refVideo.style.left = `${videoPosition.left}px`;
      });
    }
    async addReferenceVideoByURL(url, fps = this.fps, type = "video/mp4") {
      const blob = await fetch(url).then((r) => r.blob());
      const blobs = new Blob([blob], { type });
      if (this.referenceVideoBlobUrl) {
        URL.revokeObjectURL(this.referenceVideoBlobUrl);
      }
      const mediaUrl = window.URL.createObjectURL(blobs);
      this.referenceVideoBlobUrl = mediaUrl;
      if (!this.referenceVideoElement) {
        this.referenceVideoElement = document.createElement("video");
        this.withRefVideo((refVideo) => {
          if (this.isMobile) {
            refVideo.style.zIndex = "2";
            refVideo.style.display = "block";
            refVideo.style.top = "0";
            refVideo.style.left = "0";
            refVideo.style.opacity = "0.25";
            refVideo.style.width = "20px";
            refVideo.style.height = "15px";
          } else {
            refVideo.style.zIndex = "-1";
            refVideo.style.display = "none";
            refVideo.style.width = "100px";
            refVideo.style.height = "70px";
          }
          refVideo.style.objectFit = "cover";
          refVideo.style.objectPosition = "left top";
          refVideo.muted = true;
          refVideo.volume = 0;
          refVideo.playsInline = true;
          refVideo.autoplay = false;
          refVideo.controls = false;
          refVideo.loop = true;
          this.videoElement.after(refVideo);
          this.referenceVideoFrameBuffer = new VideoFrameBuffer(refVideo, fps);
          this.referenceVideoFrameBuffer.isMobile = this.isMobile;
          this.referenceVideoFrameBuffer.start();
        });
        this.syncVideoSizes();
      } else {
        this.referenceVideoFrameBuffer?.destroy();
        this.referenceVideoFrameBuffer = new VideoFrameBuffer(
          this.referenceVideoElement,
          fps
        );
        this.referenceVideoFrameBuffer.isMobile = this.isMobile;
        this.referenceVideoFrameBuffer.start();
      }
      this.referenceVideoElement.src = mediaUrl;
      this.referenceVideoElement.play().then(() => {
        this.showButton("compare");
      }).catch(() => {
        this.hideButton("compare");
      });
    }
    hideButton(tool) {
      const button = this.getButtonForTool(tool);
      button.style.display = "none";
    }
    showButton(tool) {
      const button = this.getButtonForTool(tool);
      button.style.display = "";
    }
    addSingletonShape(shape) {
      const serializedShape = this.serialize([shape])[0];
      const filteredShapes = this.shapes.filter((s) => s.type !== shape.type);
      this.replaceFrame(this.playbackFrame, [...filteredShapes, serializedShape]);
    }
    serialize(shapes = this.shapes) {
      const canvasWidth = this.canvasWidth;
      const canvasHeight = this.canvasHeight;
      return shapes.map((shape) => {
        const pluginForShape = this.pluginForTool(shape.type);
        return pluginForShape.normalize(shape, canvasWidth, canvasHeight);
      });
    }
    deserialize(shapes) {
      const canvasWidth = 1 / this.canvasWidth;
      const canvasHeight = 1 / this.canvasHeight;
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
      if (isMultiTouch(event)) return;
      if (this.gestureHandler?.hasTwoFingers()) return;
      const genericFrame = this.frameFromProgressBar(event, true);
      if (genericFrame) {
        this.isProgressBarNavigation = true;
        const frame = this.getAnnotationFrame(event);
        if (this.isVideoPaused) {
          if (frame !== null) {
            this.playbackFrame = frame;
          } else {
            this.playbackFrame = genericFrame;
          }
        }
        return;
      }
      if (this.currentTool && this.collapseController?.autoCollapseEnabled) {
        this.collapseController.collapse();
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
    get isVideoPaused() {
      if (this.videoElement.tagName === "VIDEO") {
        return this.videoElement.paused;
      }
      return true;
    }
    get hasGlobalOverlays() {
      return this.globalShapes.length > 0;
    }
    handleMouseMove(event) {
      event.preventDefault();
      if (isMultiTouch(event)) return;
      if (this.isMouseDown) {
        const maybeFrame = this.isProgressBarNavigation ? this.frameFromProgressBar(event, false) : null;
        if (maybeFrame !== null && !this.isDrawing) {
          if (maybeFrame === this.lastNavigatedFrame) {
            return;
          }
          this.lastNavigatedFrame = maybeFrame;
          this.activeTimeFrame = maybeFrame;
          if (this.isVideoPaused) {
            this.playbackFrame = maybeFrame;
          }
          this.clearCanvas();
          if (!this.hasGlobalOverlays) {
            this.addVideoOverlay();
          }
          this.drawShapesOverlay();
          this.addProgressBarOverlay();
          return;
        } else {
          this.hideControls();
          this.clearCanvas();
          if (!this.hasGlobalOverlays) {
            this.addVideoOverlay();
          }
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
      this.isProgressBarNavigation = false;
      this.showControls();
      if (isMultiTouch(event)) return;
      if (this.currentTool) {
        this.pluginForTool(this.currentTool).onPointerUp(event);
      }
      if (this.collapseController?.autoCollapseEnabled) {
        this.collapseController.expand();
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
        lineWidth: this.ctx.lineWidth,
        globalAlpha: this.ctx.globalAlpha
      };
      const hasTransform = this.gestureState.scale !== 1 || this.gestureState.panX !== 0 || this.gestureState.panY !== 0;
      if (hasTransform) {
        this.ctx.save();
        this.ctx.translate(this.gestureState.panX, this.gestureState.panY);
        const cx = this.canvasWidth / 2;
        const cy = this.canvasHeight / 2;
        this.ctx.translate(cx, cy);
        this.ctx.scale(this.gestureState.scale, this.gestureState.scale);
        this.ctx.translate(-cx, -cy);
      }
      for (let shape of this.deserialize(this.globalShapes)) {
        this.ctx.strokeStyle = shape.strokeStyle;
        this.ctx.fillStyle = shape.fillStyle;
        this.ctx.lineWidth = shape.lineWidth;
        this.ctx.globalAlpha = shape.opacity ?? 1;
        try {
          this.pluginForTool(shape.type).draw(shape);
        } catch (e) {
          console.error(e);
        }
      }
      for (let shape of this.deserialize(this.shapes)) {
        this.ctx.strokeStyle = shape.strokeStyle;
        this.ctx.fillStyle = shape.fillStyle;
        this.ctx.lineWidth = shape.lineWidth;
        this.ctx.globalAlpha = shape.opacity ?? 1;
        try {
          this.pluginForTool(shape.type).draw(shape);
        } catch (e) {
          console.error(e);
        }
      }
      if (hasTransform) {
        this.ctx.restore();
      }
      this.ctx.strokeStyle = prevSettings.strokeStyle;
      this.ctx.fillStyle = prevSettings.fillStyle;
      this.ctx.lineWidth = prevSettings.lineWidth;
      this.ctx.globalAlpha = prevSettings.globalAlpha;
    }
    clearCanvas() {
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    }
    frameToDataUrl() {
      try {
        this.clearCanvas();
        this.addVideoOverlay();
        this.addFrameSquareOverlay();
        this.drawShapesOverlay();
        const data = this.canvas.toDataURL("image/png");
        this.redrawFullCanvas();
        return data;
      } catch (e) {
        console.error(e);
        return null;
      }
    }
    redrawFullCanvas() {
      this.clearCanvas();
      this.addVideoOverlay();
      this.drawShapesOverlay();
      this.drawSelectionHandles();
      this.addFrameSquareOverlay();
      this.addProgressBarOverlay();
    }
    drawSelectionHandles() {
      if (this.currentTool !== "move") return;
      try {
        const movePlugin = this.pluginForTool("move");
        movePlugin.drawResizeHandles();
      } catch {
      }
    }
    replaceFrame(frame, shapes) {
      this.timeStack.set(frame, this.parseShapes(this.stringifyShapes(shapes)));
    }
    addShapesToFrame(frame, shapes) {
      const existingShapes = this.timeStack.get(frame) || [];
      this.timeStack.set(frame, [
        ...existingShapes,
        ...this.parseShapes(this.stringifyShapes(shapes))
      ]);
    }
    setFrameRate(fps) {
      this.destructors.find((d) => d.name === "frameRateDetector")?.();
      this.fps = fps;
    }
    stringifyShapes(shapes) {
      return JSON.stringify(shapes, (key, value) => {
        if (key === "image") {
          return value.src;
        }
        return value;
      });
    }
    parseShapes(shapes) {
      return JSON.parse(shapes, (key, value) => {
        if (key === "image") {
          const img = new Image();
          img.src = value;
          return img;
        }
        return value;
      });
    }
    filterNonSerializableShapes(shapes) {
      return shapes.filter((shape) => {
        if (shape.type === "image") {
          return false;
        } else {
          return true;
        }
      });
    }
    saveCurrentFrame() {
      return {
        frame: this.playbackFrame,
        version: 1,
        fps: this.fps,
        shapes: this.parseShapes(
          this.stringifyShapes(this.filterNonSerializableShapes(this.shapes))
        )
      };
    }
    loadAllFrames(frames) {
      this.cleanFrameStacks();
      frames.forEach((frame) => {
        const shapes = frame.shapes || [];
        this.timeStack.set(frame.frame, this.parseShapes(this.stringifyShapes(shapes)));
      });
    }
    appendFrames(frames) {
      frames.forEach((frame) => {
        this.addShapesToFrame(frame.frame, frame.shapes);
      });
    }
    saveAllFrames() {
      const allFrames = Array.from(this.timeStack.keys());
      const annotatedFrames = allFrames.filter((frame) => {
        return this.timeStack.get(frame)?.length;
      });
      const result = annotatedFrames.map((frame) => {
        return {
          frame,
          fps: this.fps,
          version: 1,
          shapes: this.filterNonSerializableShapes(
            this.timeStack.get(frame) ?? []
          )
        };
      });
      return result;
    }
    getAnnotationFrame(event) {
      const x = event.offsetX;
      const y = event.offsetY;
      const tolerance = this.isMobile ? 20 : 12;
      const frame = this.annotatedFrameCoordinates.find((coordinate) => {
        return x >= coordinate.x - tolerance && x <= coordinate.x + tolerance && y >= coordinate.y - tolerance && y <= coordinate.y + tolerance;
      })?.frame ?? null;
      return frame;
    }
    get totalFrames() {
      if (this._enforcedTotalFrames !== null) {
        return this._enforcedTotalFrames;
      }
      const node = this.videoElement;
      if (node.tagName !== "VIDEO") {
        return 1;
      }
      return Math.round(node.duration * this.fps);
    }
    /**
     * Set a fixed total frames count, overriding the calculated value from video duration.
     * Pass null to clear the enforcement and use the calculated value.
     */
    setTotalFrames(frames) {
      this._enforcedTotalFrames = frames !== null ? Math.max(1, Math.round(frames)) : null;
    }
    /**
     * Get the enforced total frames value, or null if using calculated value.
     */
    getEnforcedTotalFrames() {
      return this._enforcedTotalFrames;
    }
    frameFromProgressBar(event, countY = true) {
      const node = this.videoElement;
      if (node.tagName !== "VIDEO") {
        return null;
      }
      const { x, width, height, y } = this.progressBarCoordinates;
      const x1 = event.offsetX;
      const y1 = event.offsetY;
      const calculateFrame = () => {
        const rawFrame = Math.round((x1 - x) / width * this.totalFrames);
        return Math.max(1, Math.min(rawFrame, this.totalFrames));
      };
      if (countY) {
        if (x1 >= x && x1 <= x + width && y1 >= y && y1 <= y + height) {
          return calculateFrame();
        }
        return null;
      } else {
        if (x1 >= x && x1 <= x + width) {
          return calculateFrame();
        }
        return null;
      }
    }
    hasAnnotationsForFrame(frame) {
      if (this.globalShapes.length > 0) {
        return true;
      }
      if (this.timeStack.has(frame)) {
        const shapes = this.timeStack.get(frame);
        return shapes && shapes.length > 0;
      }
      return false;
    }
    stopAnnotationsAsVideo() {
      this.isAnnotationsAsVideoActive = false;
    }
    startAnnotationsAsVideo() {
      this.isAnnotationsAsVideoActive = true;
      this.playAnnotationsAsVideo();
    }
    playAnnotationsAsVideo() {
      if (!this.isAnnotationsAsVideoActive) {
        return;
      }
      this.clearCanvas();
      this.addVideoOverlay();
      this.drawShapesOverlay();
      if (this.isCursorOverCanvas || this.isMobile) {
        this.addFrameSquareOverlay();
        this.addProgressBarOverlay();
      }
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
    const node = this.videoElement;
    if (node.tagName !== "VIDEO") {
      return;
    }
    const videoRect = node.getBoundingClientRect();
    const canvasRect = this.canvas.getBoundingClientRect();
    const offsetX = videoRect.left - canvasRect.left;
    const offsetY = videoRect.top - canvasRect.top;
    const frameNumber = this.activeTimeFrame;
    let videoFrame = null;
    let vw;
    let vh;
    const ffmpegFrame = this.ffmpegFrameExtractor?.getFrame(frameNumber || 1);
    if (ffmpegFrame) {
      videoFrame = ffmpegFrame;
      vw = ffmpegFrame.width;
      vh = ffmpegFrame.height;
    } else {
      const bufferFrame = this.videoFrameBuffer?.getFrame(frameNumber || 0);
      if (bufferFrame) {
        videoFrame = bufferFrame;
        vw = bufferFrame.width;
        vh = bufferFrame.height;
      } else {
        videoFrame = node;
        vw = node.videoWidth;
        vh = node.videoHeight;
      }
    }
    this.ctx.drawImage(
      videoFrame,
      0,
      0,
      vw,
      vh,
      offsetX,
      offsetY,
      this.canvasWidth,
      this.canvasHeight
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
      return this.timeStack.get(frame)?.length;
    });
    const totalFrames = this.totalFrames;
    const { x, width, height, y } = this.progressBarCoordinates;
    const coordinatesOnProgressBar = annotatedFrames.map((frame) => {
      return Math.round(frame / totalFrames * width);
    });
    this.ctx.save();
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    this.ctx.fillRect(x, y, width, height);
    this.ctx.fillStyle = colorMap.y;
    const recSize = this.isMobile ? 16 : 8;
    coordinatesOnProgressBar.forEach((coordinate, index) => {
      this.ctx.beginPath();
      const rx = x + coordinate;
      const ry = this.canvasHeight - height / 2;
      this.ctx.fillRect(rx - recSize / 2, ry - recSize / 2, recSize, recSize);
      this.annotatedFrameCoordinates.push({
        x: rx,
        y: ry,
        frame: annotatedFrames[index]
      });
    });
    const currentFrame = this.isProgressBarNavigation && this.lastNavigatedFrame > 0 ? this.lastNavigatedFrame : this.playbackFrame;
    const currentFrameCoordinate = Math.round(currentFrame / totalFrames * width) + x;
    this.ctx.fillStyle = "white";
    this.ctx.beginPath();
    const ax = currentFrameCoordinate;
    const ay = this.canvasHeight - height / 2;
    this.ctx.beginPath();
    this.ctx.fillRect(ax - recSize / 2, ay - recSize / 2, recSize, recSize);
    this.ctx.fill();
    this.ctx.restore();
  }

  // ../gto-js/dist/gto.js
  var v = /* @__PURE__ */ ((i) => (i[i.BinaryGTO = 0] = "BinaryGTO", i[i.CompressedGTO = 1] = "CompressedGTO", i[i.TextGTO = 2] = "TextGTO", i))(v || {});
  var p = /* @__PURE__ */ ((i) => (i[i.Int = 0] = "Int", i[i.Float = 1] = "Float", i[i.Double = 2] = "Double", i[i.Half = 3] = "Half", i[i.String = 4] = "String", i[i.Boolean = 5] = "Boolean", i[i.Short = 6] = "Short", i[i.Byte = 7] = "Byte", i[i.Int64 = 8] = "Int64", i))(p || {});
  var N = {
    0: "int",
    1: "float",
    2: "double",
    3: "half",
    4: "string",
    5: "bool",
    6: "short",
    7: "byte",
    8: "int64"
  };
  var z = {
    int: 0,
    float: 1,
    double: 2,
    half: 3,
    string: 4,
    bool: 5,
    short: 6,
    byte: 7,
    int64: 8
    /* Int64 */
  };
  var B = {
    0: 4,
    1: 4,
    2: 8,
    3: 2,
    4: 4,
    // String type stores indices (32-bit)
    5: 1,
    6: 2,
    7: 1,
    8: 8
  };
  var R = /* @__PURE__ */ ((i) => (i[i.None = 0] = "None", i[i.HeaderOnly = 1] = "HeaderOnly", i[i.RandomAccess = 2] = "RandomAccess", i[i.BinaryOnly = 4] = "BinaryOnly", i[i.TextOnly = 8] = "TextOnly", i))(R || {});
  var b = /* @__PURE__ */ ((i) => (i[i.Skip = 0] = "Skip", i[i.Read = 1] = "Read", i))(b || {});
  var Y = class {
    magic = 671;
    numStrings = 0;
    numObjects = 0;
    version = 4;
    flags = 0;
  };
  var F = class {
    name = "";
    protocol = "";
    protocolVersion = 0;
    numComponents = 0;
    pad = 0;
    // Internal tracking
    _nameId = 0;
    _protocolId = 0;
    _componentOffset = 0;
  };
  var L = class {
    name = "";
    interpretation = "";
    numProperties = 0;
    flags = 0;
    childLevel = 0;
    // Nesting depth for nested components (v4+)
    // Internal tracking
    _nameId = 0;
    _interpretationId = 0;
    _propertyOffset = 0;
    _object = null;
  };
  var M = class {
    name = "";
    interpretation = "";
    type = 1;
    size = 0;
    // Number of elements
    width = 1;
    // Parts per element (e.g., 3 for xyz)
    dims = [1, 1, 1, 1];
    // Up to 4 dimensional shape
    // Internal tracking
    _nameId = 0;
    _interpretationId = 0;
    _component = null;
    _dataOffset = 0;
    /**
     * Get total number of values (size * width * all dims)
     */
    get totalCount() {
      return this.size * this.width * this.dims.reduce((t, e) => t * e, 1);
    }
    /**
     * Get byte size of the property data
     */
    get byteSize() {
      return this.totalCount * B[this.type];
    }
  };
  var H = class {
    _strings = [];
    // Array of strings (index -> string)
    _lookup = /* @__PURE__ */ new Map();
    // Reverse lookup (string -> index)
    /**
     * Clear the string table
     */
    clear() {
      this._strings = [], this._lookup.clear();
    }
    /**
     * Get number of strings in the table
     */
    get size() {
      return this._strings.length;
    }
    /**
     * Get all strings as an array
     */
    get strings() {
      return [...this._strings];
    }
    /**
     * Add a string to the table (for reading)
     * @param str - String to add
     * @returns Index of the string
     */
    add(t) {
      const e = this._strings.length;
      return this._strings.push(t), this._lookup.set(t, e), e;
    }
    /**
     * Intern a string - add if not present, return index
     * @param str - String to intern
     * @returns Index of the string
     */
    intern(t) {
      const e = this._lookup.get(t);
      return e !== void 0 ? e : this.add(t);
    }
    /**
     * Lookup a string by index
     * @param index - Index of the string
     * @returns The string at the index
     */
    stringFromId(t) {
      if (t < 0 || t >= this._strings.length)
        throw new Error(`String index ${t} out of range (0-${this._strings.length - 1})`);
      return this._strings[t];
    }
    /**
     * Lookup an index by string
     * @param str - String to lookup
     * @returns Index of the string, or undefined if not found
     */
    lookup(t) {
      return this._lookup.get(t);
    }
    /**
     * Check if a string exists in the table
     * @param str - String to check
     */
    has(t) {
      return this._lookup.has(t);
    }
    /**
     * Read string table from a DataView (binary format)
     * @param view - DataView containing the string data
     * @param offset - Starting offset in the view
     * @param numStrings - Number of strings to read
     * @param _littleEndian - Byte order (unused, strings are byte-aligned)
     * @returns Number of bytes consumed
     */
    readFromBinary(t, e, n, r = true) {
      this.clear();
      let s = e;
      const o = new TextDecoder("utf-8");
      for (let l = 0; l < n; l++) {
        let _ = s;
        for (; _ < t.byteLength && t.getUint8(_) !== 0; )
          _++;
        const h = new Uint8Array(t.buffer, t.byteOffset + s, _ - s), d = o.decode(h);
        this.add(d), s = _ + 1;
      }
      return s - e;
    }
    /**
     * Write string table to binary format
     * @returns Binary representation of the string table
     */
    writeToBinary() {
      const t = new TextEncoder();
      let e = 0;
      for (const s of this._strings)
        e += t.encode(s).length + 1;
      const n = new Uint8Array(e);
      let r = 0;
      for (const s of this._strings) {
        const o = t.encode(s);
        n.set(o, r), r += o.length, n[r++] = 0;
      }
      return n;
    }
  };
  function tt(i) {
    const t = i >> 15 & 1, e = i >> 10 & 31, n = i & 1023;
    if (e === 0) {
      if (n === 0)
        return t ? -0 : 0;
      const s = n / 1024;
      return (t ? -1 : 1) * s * Math.pow(2, -14);
    } else if (e === 31)
      return n === 0 ? t ? -1 / 0 : 1 / 0 : NaN;
    const r = 1 + n / 1024;
    return (t ? -1 : 1) * r * Math.pow(2, e - 15);
  }
  function et(i) {
    const t = new ArrayBuffer(4), e = new DataView(t);
    e.setFloat32(0, i, true);
    const n = e.getUint32(0, true), r = n >> 31 & 1, s = n >> 23 & 255, o = n & 8388607;
    if (s === 0)
      return r << 15;
    if (s === 255)
      return o === 0 ? r << 15 | 31744 : r << 15 | 31744 | o >> 13;
    const l = s - 127 + 15;
    if (l >= 31)
      return r << 15 | 31744;
    if (l <= 0) {
      if (l < -10)
        return r << 15;
      const _ = (o | 8388608) >> 1 - l + 13;
      return r << 15 | _;
    }
    return r << 15 | l << 10 | o >> 13;
  }
  function V(i) {
    return i.length >= 2 && i[0] === 31 && i[1] === 139;
  }
  async function nt(i) {
    if (typeof DecompressionStream < "u") {
      const t = new DecompressionStream("gzip"), e = t.writable.getWriter(), n = new Uint8Array(i.length);
      n.set(i), e.write(n), e.close();
      const r = [], s = t.readable.getReader();
      for (; ; ) {
        const { done: h, value: d } = await s.read();
        if (h) break;
        r.push(d);
      }
      const o = r.reduce((h, d) => h + d.length, 0), l = new Uint8Array(o);
      let _ = 0;
      for (const h of r)
        l.set(h, _), _ += h.length;
      return l;
    }
    throw new Error("Gzip decompression not available. DecompressionStream API required.");
  }
  var rt = class {
    input;
    pos = 0;
    line = 1;
    column = 1;
    constructor(t) {
      this.input = t;
    }
    peek() {
      return this.input[this.pos] || "";
    }
    advance() {
      const t = this.input[this.pos++] || "";
      return t === `
` ? (this.line++, this.column = 1) : this.column++, t;
    }
    skipWhitespace() {
      for (; this.pos < this.input.length; ) {
        const t = this.peek();
        if (t === " " || t === "	" || t === `
` || t === "\r")
          this.advance();
        else if (t === "#")
          for (; this.pos < this.input.length && this.peek() !== `
`; )
            this.advance();
        else
          break;
      }
    }
    readString() {
      const t = this.advance();
      let e = "";
      for (; this.pos < this.input.length; ) {
        const n = this.advance();
        if (n === t)
          break;
        if (n === "\\") {
          const r = this.advance();
          switch (r) {
            case "n":
              e += `
`;
              break;
            case "t":
              e += "	";
              break;
            case "r":
              e += "\r";
              break;
            case "\\":
              e += "\\";
              break;
            case '"':
              e += '"';
              break;
            case "'":
              e += "'";
              break;
            default:
              e += r;
          }
        } else
          e += n;
      }
      return { type: "STRING", value: e };
    }
    readNumber() {
      let t = "", e = false, n = false;
      for (this.peek() === "-" && (t += this.advance()); this.pos < this.input.length; ) {
        const s = this.peek();
        if (s >= "0" && s <= "9")
          t += this.advance();
        else if (s === "." && !e && !n)
          e = true, t += this.advance();
        else if ((s === "e" || s === "E") && !n)
          n = true, t += this.advance(), (this.peek() === "+" || this.peek() === "-") && (t += this.advance());
        else
          break;
      }
      return { type: "NUMBER", value: e || n ? parseFloat(t) : parseInt(t, 10) };
    }
    readIdentifier() {
      let t = "";
      for (; this.pos < this.input.length; ) {
        const e = this.peek();
        if (e >= "a" && e <= "z" || e >= "A" && e <= "Z" || e >= "0" && e <= "9" || e === "_" || e === "-" || e === ".")
          t += this.advance();
        else
          break;
      }
      return t === "as" ? { type: "AS", value: t } : { type: "IDENTIFIER", value: t };
    }
    nextToken() {
      if (this.skipWhitespace(), this.pos >= this.input.length)
        return { type: "EOF", value: null };
      const t = this.peek();
      if (t === '"' || t === "'")
        return this.readString();
      if (t >= "0" && t <= "9" || t === "-" && this.input[this.pos + 1] >= "0" && this.input[this.pos + 1] <= "9")
        return this.readNumber();
      if (t >= "a" && t <= "z" || t >= "A" && t <= "Z" || t === "_")
        return this.readIdentifier();
      switch (this.advance(), t) {
        case "{":
          return { type: "LBRACE", value: t };
        case "}":
          return { type: "RBRACE", value: t };
        case "[":
          return { type: "LBRACKET", value: t };
        case "]":
          return { type: "RBRACKET", value: t };
        case "(":
          return { type: "LPAREN", value: t };
        case ")":
          return { type: "RPAREN", value: t };
        case ":":
          return { type: "COLON", value: t };
        case "=":
          return { type: "EQUALS", value: t };
        case ",":
          return { type: "COMMA", value: t };
        default:
          throw new Error(`Unexpected character '${t}' at line ${this.line}, column ${this.column}`);
      }
    }
  };
  var st = class {
    _mode;
    _stringTable = new H();
    _header = new Y();
    _objects = [];
    _components = [];
    _properties = [];
    _filename = "<string>";
    _lexer;
    _currentToken;
    /**
     * Create a new Reader
     * @param mode - Reader mode flags (ReaderMode.*)
     */
    constructor(t = R.None) {
      this._mode = t;
    }
    /**
     * Get string from string table by ID
     */
    stringFromId(t) {
      return this._stringTable.stringFromId(t);
    }
    /**
     * Get the full string table
     */
    stringTable() {
      return this._stringTable.strings;
    }
    /**
     * Get all objects (for RandomAccess mode)
     */
    objects() {
      return this._objects;
    }
    /**
     * Get all components (for RandomAccess mode)
     */
    components() {
      return this._components;
    }
    /**
     * Get all properties (for RandomAccess mode)
     */
    properties() {
      return this._properties;
    }
    /**
     * Open and parse a GTO file (text or binary)
     * Note: For gzip-compressed files, use openAsync() instead
     * @param content - File content
     * @param name - Optional filename for error messages
     * @returns True if successful
     */
    open(t, e = "<string>") {
      this._filename = e, this._stringTable.clear(), this._objects = [], this._components = [], this._properties = [];
      try {
        if (t instanceof ArrayBuffer || t instanceof Uint8Array) {
          const n = t instanceof ArrayBuffer ? new Uint8Array(t) : t;
          if (V(n))
            throw new Error(
              "Gzip-compressed GTO file detected. Use openAsync() for compressed files."
            );
          this._parseBinary(t);
        } else if (typeof t == "string")
          if (t.trimStart().startsWith("GTOa"))
            this._parse(t);
          else
            throw new Error('Unknown GTO format - text files must start with "GTOa"');
        else
          throw new Error("Content must be string, ArrayBuffer, or Uint8Array");
        return true;
      } catch (n) {
        return console.error(`Error parsing GTO file ${e}: ${n.message}`), false;
      }
    }
    /**
     * Open and parse a GTO file asynchronously (supports gzip-compressed files)
     * @param content - File content
     * @param name - Optional filename for error messages
     * @returns Promise resolving to true if successful
     */
    async openAsync(t, e = "<string>") {
      this._filename = e, this._stringTable.clear(), this._objects = [], this._components = [], this._properties = [];
      try {
        if (t instanceof ArrayBuffer || t instanceof Uint8Array) {
          let n = t instanceof ArrayBuffer ? new Uint8Array(t) : t;
          V(n) && (n = await nt(n)), this._parseBinary(n);
        } else if (typeof t == "string")
          if (t.trimStart().startsWith("GTOa"))
            this._parse(t);
          else
            throw new Error('Unknown GTO format - text files must start with "GTOa"');
        else
          throw new Error("Content must be string, ArrayBuffer, or Uint8Array");
        return true;
      } catch (n) {
        return console.error(`Error parsing GTO file ${e}: ${n.message}`), false;
      }
    }
    /**
     * Parse the GTO text content
     */
    _parse(t) {
      const e = new rt(t);
      if (this._lexer = e, this._currentToken = e.nextToken(), this._parseHeader(), this.header(this._header), !(this._mode & R.HeaderOnly))
        for (; this._currentToken.type !== "EOF"; )
          this._parseObject();
    }
    /**
     * Get current token and advance
     */
    _advance() {
      const t = this._currentToken;
      return this._currentToken = this._lexer.nextToken(), t;
    }
    /**
     * Expect a specific token type
     */
    _expect(t) {
      const e = this._currentToken;
      if (e.type !== t)
        throw new Error(`Expected ${t} but got ${e.type} (${e.value}) at line ${this._lexer.line}`);
      return this._advance();
    }
    /**
     * Parse the file header
     */
    _parseHeader() {
      const t = this._expect(
        "IDENTIFIER"
        /* IDENTIFIER */
      );
      if (t.value !== "GTOa")
        throw new Error(`Expected 'GTOa' but got '${t.value}'`);
      this._expect(
        "LPAREN"
        /* LPAREN */
      );
      const e = this._expect(
        "NUMBER"
        /* NUMBER */
      );
      this._expect(
        "RPAREN"
        /* RPAREN */
      ), this._header.version = e.value;
    }
    /**
     * Parse an object declaration
     */
    _parseObject() {
      const t = new F(), e = this._expect(
        "IDENTIFIER"
        /* IDENTIFIER */
      );
      t.name = e.value, t._nameId = this._stringTable.intern(t.name), this._expect(
        "COLON"
        /* COLON */
      );
      const n = this._expect(
        "IDENTIFIER"
        /* IDENTIFIER */
      );
      if (t.protocol = n.value, t._protocolId = this._stringTable.intern(t.protocol), this._currentToken.type === "LPAREN") {
        this._advance();
        const s = this._expect(
          "NUMBER"
          /* NUMBER */
        );
        t.protocolVersion = s.value, this._expect(
          "RPAREN"
          /* RPAREN */
        );
      }
      const r = this.object(
        t.name,
        t.protocol,
        t.protocolVersion,
        t
      );
      for (t._componentOffset = this._components.length, this._objects.push(t), this._expect(
        "LBRACE"
        /* LBRACE */
      ); this._currentToken.type !== "RBRACE"; )
        this._parseComponent(t, r);
      this._expect(
        "RBRACE"
        /* RBRACE */
      ), t.numComponents = this._components.length - t._componentOffset;
    }
    /**
     * Parse a component declaration
     */
    _parseComponent(t, e) {
      const n = new L();
      n._object = t;
      let r;
      if (this._currentToken.type === "STRING" ? r = this._advance() : r = this._expect(
        "IDENTIFIER"
        /* IDENTIFIER */
      ), n.name = r.value, n._nameId = this._stringTable.intern(n.name), this._currentToken.type === "AS") {
        this._advance();
        const o = this._expect(
          "IDENTIFIER"
          /* IDENTIFIER */
        );
        n.interpretation = o.value, n._interpretationId = this._stringTable.intern(n.interpretation);
      }
      let s = b.Skip;
      for (e === b.Read && (s = this.component(n.name, n)), n._propertyOffset = this._properties.length, this._components.push(n), this._expect(
        "LBRACE"
        /* LBRACE */
      ); this._currentToken.type !== "RBRACE"; )
        this._parseProperty(n, s);
      this._expect(
        "RBRACE"
        /* RBRACE */
      ), n.numProperties = this._properties.length - n._propertyOffset;
    }
    /**
     * Parse a property declaration
     */
    _parseProperty(t, e) {
      const n = new M();
      n._component = t;
      const s = this._expect(
        "IDENTIFIER"
        /* IDENTIFIER */
      ).value;
      if (!(s in z))
        throw new Error(`Unknown type '${s}' at line ${this._lexer.line}`);
      if (n.type = z[s], this._currentToken.type === "LBRACKET") {
        this._advance();
        const h = [];
        for (h.push(this._expect(
          "NUMBER"
          /* NUMBER */
        ).value); this._currentToken.type === "COMMA"; )
          this._advance(), h.push(this._expect(
            "NUMBER"
            /* NUMBER */
          ).value);
        this._expect(
          "RBRACKET"
          /* RBRACKET */
        ), n.width = h.length === 1 ? h[0] : 1, h.length > 1 ? n.dims = h : n.width = h[0];
      }
      this._currentToken.type === "LBRACKET" && (this._advance(), n.size = this._expect(
        "NUMBER"
        /* NUMBER */
      ).value, this._expect(
        "RBRACKET"
        /* RBRACKET */
      ));
      const o = this._expect(
        "IDENTIFIER"
        /* IDENTIFIER */
      );
      if (n.name = o.value, n._nameId = this._stringTable.intern(n.name), this._currentToken.type === "AS") {
        this._advance();
        const h = this._expect(
          "IDENTIFIER"
          /* IDENTIFIER */
        );
        n.interpretation = h.value, n._interpretationId = this._stringTable.intern(n.interpretation);
      }
      let l = b.Skip;
      e === b.Read && (l = this.property(
        n.name,
        n.interpretation,
        n
      )), this._properties.push(n), this._expect(
        "EQUALS"
        /* EQUALS */
      );
      let _;
      this._currentToken.type === "LBRACKET" ? _ = this._parseData(n) : _ = this._parseSingleValue(n), n.size === 0 && _.length > 0 && (n.size = Math.floor(_.length / (n.width || 1))), l === b.Read && this.data(n, _.length) !== null && this.dataRead(n, _);
    }
    /**
     * Parse property data values
     */
    _parseData(t) {
      const e = [];
      for (this._expect(
        "LBRACKET"
        /* LBRACKET */
      ); this._currentToken.type !== "RBRACKET"; ) {
        if (this._currentToken.type === "LBRACKET") {
          const n = this._parseNestedData(t);
          e.push(...n);
        } else if (this._currentToken.type === "NUMBER")
          e.push(this._advance().value);
        else if (this._currentToken.type === "STRING") {
          const n = this._advance().value;
          t.type === p.String ? e.push(this._stringTable.intern(n)) : e.push(n);
        } else if (this._currentToken.type === "IDENTIFIER") {
          const n = this._advance().value;
          n === "true" ? e.push(1) : n === "false" ? e.push(0) : e.push(this._stringTable.intern(n));
        } else
          throw new Error(`Unexpected token ${this._currentToken.type} in data at line ${this._lexer.line}`);
        this._currentToken.type === "COMMA" && this._advance();
      }
      return this._expect(
        "RBRACKET"
        /* RBRACKET */
      ), e;
    }
    /**
     * Parse nested array data
     */
    _parseNestedData(t) {
      const e = [];
      for (this._expect(
        "LBRACKET"
        /* LBRACKET */
      ); this._currentToken.type !== "RBRACKET"; ) {
        if (this._currentToken.type === "LBRACKET") {
          const n = this._parseNestedData(t);
          e.push(...n);
        } else if (this._currentToken.type === "NUMBER")
          e.push(this._advance().value);
        else if (this._currentToken.type === "STRING") {
          const n = this._advance().value;
          t.type === p.String ? e.push(this._stringTable.intern(n)) : e.push(n);
        } else if (this._currentToken.type === "IDENTIFIER") {
          const n = this._advance().value;
          n === "true" ? e.push(1) : n === "false" ? e.push(0) : e.push(this._stringTable.intern(n));
        } else
          throw new Error(`Unexpected token ${this._currentToken.type} in nested data at line ${this._lexer.line}`);
        this._currentToken.type === "COMMA" && this._advance();
      }
      return this._expect(
        "RBRACKET"
        /* RBRACKET */
      ), e;
    }
    /**
     * Parse a single value (not in array brackets)
     */
    _parseSingleValue(t) {
      if (this._currentToken.type === "NUMBER")
        return [this._advance().value];
      if (this._currentToken.type === "STRING") {
        const e = this._advance().value;
        return t.type === p.String ? [this._stringTable.intern(e)] : [e];
      } else if (this._currentToken.type === "IDENTIFIER") {
        const e = this._advance().value;
        return e === "true" ? [1] : e === "false" ? [0] : [this._stringTable.intern(e)];
      }
      throw new Error(`Unexpected token ${this._currentToken.type} for single value at line ${this._lexer.line}`);
    }
    // ============================================
    // Binary format parsing
    // ============================================
    /**
     * Parse binary GTO content
     */
    _parseBinary(t) {
      const e = t instanceof ArrayBuffer ? t : t.buffer.slice(t.byteOffset, t.byteOffset + t.byteLength), n = new DataView(e), r = n.getUint32(0, true);
      let s;
      if (r === 671)
        s = true;
      else if (n.getUint32(0, false) === 671)
        s = false;
      else
        throw new Error(`Invalid GTO magic number: 0x${r.toString(16)}`);
      let o = 0;
      o += 4;
      const l = n.getUint32(o, s);
      o += 4;
      const _ = n.getUint32(o, s);
      o += 4;
      const h = n.getUint32(o, s);
      o += 4;
      const d = n.getUint32(o, s);
      if (o += 4, this._header.magic = 671, this._header.numStrings = l, this._header.numObjects = _, this._header.version = h, this._header.flags = d, this.header(this._header), this._mode & R.HeaderOnly)
        return;
      const c = this._stringTable.readFromBinary(n, o, l, s);
      o += c;
      const T = [];
      for (let f = 0; f < _; f++) {
        const g = n.getUint32(o, s);
        o += 4;
        const x = n.getUint32(o, s);
        o += 4;
        const j = n.getUint32(o, s);
        o += 4;
        const I = n.getUint32(o, s);
        o += 4, o += 4, T.push({ nameId: g, protocolId: x, protocolVersion: j, numComponents: I });
      }
      let a = 0;
      for (const f of T)
        a += f.numComponents;
      const u = [];
      for (let f = 0; f < a; f++) {
        const g = n.getUint32(o, s);
        o += 4;
        const x = n.getUint32(o, s);
        o += 4;
        const j = n.getUint32(o, s);
        o += 4;
        const I = n.getUint32(o, s);
        o += 4;
        let y = 0;
        h >= 4 && (y = n.getUint32(o, s), o += 4), u.push({ nameId: g, interpretationId: x, numProperties: j, flags: I, childLevel: y });
      }
      let E = 0;
      for (const f of u)
        E += f.numProperties;
      const O = [];
      for (let f = 0; f < E; f++) {
        const g = n.getUint32(o, s);
        o += 4;
        const x = n.getUint32(o, s);
        o += 4;
        const j = n.getUint8(o);
        o += 1, o += 3;
        const I = n.getUint32(o, s);
        o += 4;
        const y = n.getUint32(o, s);
        o += 4;
        const C = [1, 1, 1, 1];
        h >= 4 && (C[0] = n.getUint32(o, s), o += 4, C[1] = n.getUint32(o, s), o += 4, C[2] = n.getUint32(o, s), o += 4, C[3] = n.getUint32(o, s), o += 4), O.push({ nameId: g, interpretationId: x, type: j, size: I, width: y, dims: C });
      }
      let A = 0, J = 0;
      for (const f of T) {
        const g = new F();
        g.name = this._stringTable.stringFromId(f.nameId), g.protocol = this._stringTable.stringFromId(f.protocolId), g.protocolVersion = f.protocolVersion, g.numComponents = f.numComponents, g._nameId = f.nameId, g._protocolId = f.protocolId, g._componentOffset = this._components.length;
        const x = this.object(
          g.name,
          g.protocol,
          g.protocolVersion,
          g
        );
        this._objects.push(g);
        for (let j = 0; j < f.numComponents; j++) {
          const I = u[A++], y = new L();
          y.name = this._stringTable.stringFromId(I.nameId), y.interpretation = I.interpretationId > 0 ? this._stringTable.stringFromId(I.interpretationId) : "", y.numProperties = I.numProperties, y.flags = I.flags, y.childLevel = I.childLevel, y._nameId = I.nameId, y._interpretationId = I.interpretationId, y._object = g, y._propertyOffset = this._properties.length;
          let C = b.Skip;
          x === b.Read && (C = this.component(y.name, y)), this._components.push(y);
          for (let G = 0; G < I.numProperties; G++) {
            const w = O[J++], m = new M();
            m.name = this._stringTable.stringFromId(w.nameId), m.interpretation = w.interpretationId > 0 ? this._stringTable.stringFromId(w.interpretationId) : "", m.type = w.type, m.size = w.size, m.width = w.width, m.dims = w.dims, m._nameId = w.nameId, m._interpretationId = w.interpretationId, m._component = y, m._dataOffset = o;
            let D = b.Skip;
            C === b.Read && (D = this.property(
              m.name,
              m.interpretation,
              m
            )), this._properties.push(m);
            const S = m.size * m.width, Q = B[m.type] || 4, $ = S * Q;
            if (D === b.Read && S > 0) {
              const Z = this._readBinaryData(n, o, m, S, s);
              this.data(m, $) !== null && this.dataRead(m, Z);
            }
            o += $;
          }
        }
      }
    }
    /**
     * Read binary property data
     */
    _readBinaryData(t, e, n, r, s) {
      const o = [], l = n.type, _ = B[l] || 4;
      for (let h = 0; h < r; h++) {
        const d = this._readBinaryValue(t, e + h * _, l, s);
        o.push(d);
      }
      return o;
    }
    /**
     * Read a single binary value
     */
    _readBinaryValue(t, e, n, r) {
      switch (n) {
        case p.Int:
          return t.getInt32(e, r);
        case p.Float:
          return t.getFloat32(e, r);
        case p.Double:
          return t.getFloat64(e, r);
        case p.Half:
          return tt(t.getUint16(e, r));
        case p.String:
          return t.getUint32(e, r);
        case p.Boolean:
          return t.getUint8(e) !== 0 ? 1 : 0;
        case p.Short:
          return t.getUint16(e, r);
        case p.Byte:
          return t.getUint8(e);
        case p.Int64:
          return Number(t.getBigInt64(e, r));
        default:
          throw new Error(`Unknown data type: ${n}`);
      }
    }
    // ============================================
    // Callback methods - override these in subclass
    // ============================================
    /**
     * Called after the file header is read
     */
    header(t) {
    }
    /**
     * Called for each object in the file
     * @returns Request.Read to read object data, Request.Skip to skip
     */
    object(t, e, n, r) {
      return b.Read;
    }
    /**
     * Called for each component in an object
     * @returns Request.Read to read component data, Request.Skip to skip
     */
    component(t, e) {
      return b.Read;
    }
    /**
     * Called for each property in a component
     * @returns Request.Read to read property data, Request.Skip to skip
     */
    property(t, e, n) {
      return b.Read;
    }
    /**
     * Called to allocate memory for property data
     * @returns Buffer to store data, or null to skip
     */
    data(t, e) {
      return true;
    }
    /**
     * Called after property data is read
     */
    dataRead(t, e) {
    }
  };
  var bt = class extends st {
    result = {
      version: 0,
      objects: []
    };
    _currentObject = null;
    _currentComponent = null;
    constructor() {
      super(R.None);
    }
    header(t) {
      this.result.version = t.version;
    }
    object(t, e, n, r) {
      return this._currentObject = {
        name: t,
        protocol: e,
        protocolVersion: n,
        components: {}
      }, this.result.objects.push(this._currentObject), b.Read;
    }
    component(t, e) {
      return this._currentComponent = {
        interpretation: e.interpretation,
        properties: {}
      }, this._currentObject.components[t] = this._currentComponent, b.Read;
    }
    property(t, e, n) {
      return b.Read;
    }
    dataRead(t, e) {
      const n = {
        type: N[t.type],
        size: t.size,
        width: t.width,
        interpretation: t.interpretation,
        data: this._formatData(t, e)
      };
      this._currentComponent.properties[t.name] = n;
    }
    _formatData(t, e) {
      if (t.type === p.String)
        return e.map((n) => this.stringFromId(n));
      if (t.width > 1) {
        const n = [];
        for (let r = 0; r < e.length; r += t.width)
          n.push(e.slice(r, r + t.width));
        return n;
      }
      return e;
    }
  };
  var it = class {
    _stringTable = new H();
    _state = 0;
    _output = "";
    _indent = 0;
    _version = 4;
    _binaryMode = false;
    _fileType = v.TextGTO;
    // Binary mode storage
    _objectInfos = [];
    _componentInfos = [];
    _propertyInfos = [];
    _propertyData = [];
    _currentObjectIdx = -1;
    _currentComponentIdx = -1;
    // Two-phase API storage
    _pendingProperties = [];
    _propertyIndex = 0;
    intern(t) {
      return Array.isArray(t) ? t.map((e) => this._stringTable.intern(e)) : this._stringTable.intern(t);
    }
    /**
     * Lookup a string ID
     * @param str - String to lookup
     * @returns String ID or undefined
     */
    lookup(t) {
      return this._stringTable.lookup(t);
    }
    /**
     * Get string from ID
     */
    stringFromId(t) {
      return this._stringTable.stringFromId(t);
    }
    /**
     * Open/initialize the writer
     * @param type - File type (TextGTO or BinaryGTO)
     */
    open(t = v.TextGTO) {
      return this._fileType = t, this._state = 0, t === v.BinaryGTO ? (this._binaryMode = true, this._objectInfos = [], this._componentInfos = [], this._propertyInfos = [], this._propertyData = [], this._currentObjectIdx = -1, this._currentComponentIdx = -1) : (this._binaryMode = false, this._output = "", this._indent = 0), true;
    }
    /**
     * Close the writer and finalize output
     * @returns GTO text content or binary ArrayBuffer
     */
    close() {
      return this._state = 3, this._binaryMode ? this._buildBinary() : this.toString();
    }
    /**
     * Get the current output as string
     */
    toString() {
      return `GTOa (${this._version})

${this._output}`;
    }
    /**
     * Add indentation to output
     */
    _writeIndent() {
      this._output += "    ".repeat(this._indent);
    }
    /**
     * Write a line with proper indentation
     */
    _writeLine(t = "") {
      t && (this._writeIndent(), this._output += t), this._output += `
`;
    }
    /**
     * Begin a new object
     * @param name - Object name
     * @param protocol - Protocol name
     * @param protocolVersion - Protocol version
     */
    beginObject(t, e, n = 1) {
      if (this._state === 1 || this._state === 2)
        throw new Error("Cannot begin object while inside another object");
      this._state = 1;
      const r = this.intern(t), s = this.intern(e);
      if (this._binaryMode)
        this._currentObjectIdx = this._objectInfos.length, this._objectInfos.push({
          nameId: r,
          protocolId: s,
          protocolVersion: n,
          numComponents: 0,
          componentStartIdx: this._componentInfos.length
        });
      else {
        let o = `${t} : ${e}`;
        n > 0 && (o += ` (${n})`), this._writeLine(o), this._writeLine("{"), this._indent++;
      }
    }
    /**
     * End the current object
     */
    endObject() {
      if (this._state !== 1)
        throw new Error("No object to end");
      if (this._binaryMode) {
        const t = this._objectInfos[this._currentObjectIdx];
        t.numComponents = this._componentInfos.length - t.componentStartIdx, this._currentObjectIdx = -1;
      } else
        this._indent--, this._writeLine("}"), this._writeLine();
      this._state = 0;
    }
    /**
     * Begin a new component within the current object
     * @param name - Component name
     * @param interpretation - Optional interpretation string
     * @param transposed - Whether data is transposed
     */
    beginComponent(t, e = "", n = false) {
      if (this._state !== 1)
        throw new Error("Must be inside an object to begin component");
      this._state = 2;
      const r = this.intern(t), s = e ? this.intern(e) : 0;
      if (this._binaryMode)
        this._currentComponentIdx = this._componentInfos.length, this._componentInfos.push({
          nameId: r,
          interpretationId: s,
          numProperties: 0,
          flags: n ? 1 : 0,
          childLevel: 0,
          // Nested components not yet supported in builder
          propertyStartIdx: this._propertyInfos.length
        });
      else {
        let o = this._quoteName(t);
        e && (o += ` as ${e}`), this._writeLine(o), this._writeLine("{"), this._indent++;
      }
    }
    /**
     * End the current component
     */
    endComponent() {
      if (this._state !== 2)
        throw new Error("No component to end");
      if (this._binaryMode) {
        const t = this._componentInfos[this._currentComponentIdx];
        t.numProperties = this._propertyInfos.length - t.propertyStartIdx, this._currentComponentIdx = -1;
      } else
        this._indent--, this._writeLine("}"), this._writeLine();
      this._state = 1;
    }
    /**
     * Declare a property and write its data inline (recommended for text format)
     * @param name - Property name
     * @param type - Data type (DataType.*)
     * @param size - Number of elements
     * @param width - Parts per element (e.g., 3 for xyz)
     * @param interpretation - Optional interpretation string
     * @param data - The property data
     */
    propertyWithData(t, e, n, r, s, o) {
      if (this._state !== 2)
        throw new Error("Must be inside a component to declare property");
      const l = this.intern(t), _ = s ? this.intern(s) : 0;
      let h = Array.from(o);
      if (Array.isArray(o) && o.length > 0 && Array.isArray(o[0]) && (h = o.flat()), this._binaryMode)
        this._propertyInfos.push({
          nameId: l,
          interpretationId: _,
          type: e,
          size: n,
          width: r,
          dims: [1, 1, 1, 1]
        }), this._propertyData.push(h);
      else {
        let c = N[e];
        r > 1 && (c += `[${r}]`), c += ` ${t}`, s && (c += ` as ${s}`);
        const T = this._formatData(e, r, n, h);
        c += ` = ${T}`, this._writeLine(c);
      }
    }
    /**
     * Declare a property (for two-phase API compatibility)
     * Note: For text format, prefer propertyWithData instead
     * @param name - Property name
     * @param type - Data type (DataType.*)
     * @param size - Number of elements
     * @param width - Parts per element (e.g., 3 for xyz)
     * @param interpretation - Optional interpretation string
     */
    property(t, e, n, r = 1, s = "") {
      this._pendingProperties.push({ name: t, type: e, size: n, width: r, interpretation: s }), this.intern(t), s && this.intern(s);
    }
    /**
     * Begin the data section (for two-phase API)
     */
    beginData() {
      this._propertyIndex = 0;
    }
    /**
     * Write data for the next property (for two-phase API)
     * @param data - The property data
     */
    propertyData(t) {
      if (!this._pendingProperties || this._propertyIndex >= this._pendingProperties.length)
        throw new Error("No more properties to write data for");
      const e = this._pendingProperties[this._propertyIndex++];
      let r = N[e.type];
      e.width > 1 && (r += `[${e.width}]`), r += ` ${e.name}`, e.interpretation && (r += ` as ${e.interpretation}`);
      const s = Array.from(t), o = this._formatData(e.type, e.width, e.size, s);
      r += ` = ${o}`, this._writeLine(r);
    }
    /**
     * End the data section (for two-phase API)
     */
    endData() {
      this._pendingProperties = [], this._propertyIndex = 0;
    }
    /**
     * Format property data for text output
     */
    _formatData(t, e, n, r) {
      if (!r || r.length === 0)
        return "[ ]";
      if (t === p.String) {
        const o = r.map((l) => typeof l == "string" ? `"${this._escapeString(l)}"` : `"${this._escapeString(this.stringFromId(l))}"`);
        return n === 1 && e === 1 ? o[0] : this._formatArray(o, e);
      }
      const s = r.map((o) => this._formatNumber(o, t));
      return n === 1 && e === 1 ? s[0] : this._formatArray(s, e);
    }
    /**
     * Format an array with grouping by width
     */
    _formatArray(t, e) {
      if (e <= 1 || t.length <= e)
        return `[ ${t.join(" ")} ]`;
      const n = [];
      for (let r = 0; r < t.length; r += e) {
        const s = t.slice(r, r + e);
        n.push(`[ ${s.join(" ")} ]`);
      }
      if (n.length > 4) {
        const r = "    ".repeat(this._indent + 1);
        return `[
${r}${n.join(`
${r}`)}
${"    ".repeat(this._indent)}]`;
      }
      return `[ ${n.join(" ")} ]`;
    }
    /**
     * Format a number for text output
     */
    _formatNumber(t, e) {
      return (e === p.Float || e === p.Double || e === p.Half) && Number.isInteger(t) ? t.toFixed(1) : String(t);
    }
    /**
     * Escape a string for text output
     */
    _escapeString(t) {
      return t.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t");
    }
    /**
     * Quote a name if it contains special characters
     */
    _quoteName(t) {
      return /[^a-zA-Z0-9_\-.]/.test(t) || /^[0-9]/.test(t) ? `"${this._escapeString(t)}"` : t;
    }
    // ============================================
    // Binary format writing
    // ============================================
    /**
     * Build complete binary GTO file
     */
    _buildBinary() {
      const e = this._stringTable.writeToBinary(), n = 20, r = e.byteLength, s = this._objectInfos.length * 20, o = this._componentInfos.length * 20, l = this._propertyInfos.length * 36;
      let _ = 0;
      for (let u = 0; u < this._propertyInfos.length; u++) {
        const E = this._propertyInfos[u], O = this._propertyData[u], A = B[E.type] || 4;
        _ += O.length * A;
      }
      const h = n + r + s + o + l + _, d = new ArrayBuffer(h), c = new DataView(d), T = new Uint8Array(d);
      let a = 0;
      c.setUint32(a, 671, true), a += 4, c.setUint32(a, this._stringTable.size, true), a += 4, c.setUint32(a, this._objectInfos.length, true), a += 4, c.setUint32(a, this._version, true), a += 4, c.setUint32(a, 0, true), a += 4, T.set(e, a), a += r;
      for (const u of this._objectInfos)
        c.setUint32(a, u.nameId, true), a += 4, c.setUint32(a, u.protocolId, true), a += 4, c.setUint32(a, u.protocolVersion, true), a += 4, c.setUint32(a, u.numComponents, true), a += 4, c.setUint32(a, 0, true), a += 4;
      for (const u of this._componentInfos)
        c.setUint32(a, u.nameId, true), a += 4, c.setUint32(a, u.interpretationId, true), a += 4, c.setUint32(a, u.numProperties, true), a += 4, c.setUint32(a, u.flags, true), a += 4, c.setUint32(a, u.childLevel, true), a += 4;
      for (const u of this._propertyInfos)
        c.setUint32(a, u.nameId, true), a += 4, c.setUint32(a, u.interpretationId, true), a += 4, c.setUint8(a, u.type), a += 1, a += 3, c.setUint32(a, u.size, true), a += 4, c.setUint32(a, u.width, true), a += 4, c.setUint32(a, u.dims[0], true), a += 4, c.setUint32(a, u.dims[1], true), a += 4, c.setUint32(a, u.dims[2], true), a += 4, c.setUint32(a, u.dims[3], true), a += 4;
      for (let u = 0; u < this._propertyInfos.length; u++) {
        const E = this._propertyInfos[u], O = this._propertyData[u];
        for (const A of O)
          this._writeBinaryValue(c, a, E.type, A, true), a += B[E.type] || 4;
      }
      return d;
    }
    /**
     * Write a single binary value
     */
    _writeBinaryValue(t, e, n, r, s) {
      switch (n) {
        case p.Int:
          t.setInt32(e, r, s);
          break;
        case p.Float:
          t.setFloat32(e, r, s);
          break;
        case p.Double:
          t.setFloat64(e, r, s);
          break;
        case p.Half:
          t.setUint16(e, et(r), s);
          break;
        case p.String:
          t.setUint32(e, r, s);
          break;
        case p.Boolean:
          t.setUint8(e, r ? 1 : 0);
          break;
        case p.Short:
          t.setUint16(e, r, s);
          break;
        case p.Byte:
          t.setUint8(e, r);
          break;
        case p.Int64:
          t.setBigInt64(e, BigInt(r), s);
          break;
        default:
          throw new Error(`Unknown data type: ${n}`);
      }
    }
  };
  var It = class {
    /**
     * Write structured data to GTO format
     * @param data - Structured data object
     * @param options - Options object
     * @returns GTO text content or binary ArrayBuffer
     */
    static write(t, e = {}) {
      const n = new it(), r = e.binary ? v.BinaryGTO : v.TextGTO;
      n.open(r);
      for (const s of t.objects) {
        n.beginObject(s.name, s.protocol, s.protocolVersion || 1);
        for (const [o, l] of Object.entries(s.components)) {
          n.beginComponent(o, l.interpretation || "");
          for (const [_, h] of Object.entries(l.properties)) {
            let d;
            if (typeof h.type == "string") {
              const a = h.type.charAt(0).toUpperCase() + h.type.slice(1);
              d = p[a], d === void 0 && (d = h.type === "bool" ? p.Boolean : p.Float);
            } else
              d = h.type;
            let c = h.data;
            Array.isArray(h.data) && Array.isArray(h.data[0]) && (c = h.data.flat()), d === p.String && c.length > 0 && typeof c[0] == "string" && (c = c.map((a) => n.intern(a)));
            const T = h.size || Math.floor(c.length / (h.width || 1));
            n.propertyWithData(_, d, T, h.width || 1, h.interpretation || "", c);
          }
          n.endComponent();
        }
        n.endObject();
      }
      return n.close();
    }
  };
  var ot = class {
    _name;
    _parent;
    _properties = {};
    _interpretation = "";
    constructor(t, e) {
      this._name = t, this._parent = e;
    }
    /**
     * Set component interpretation
     */
    as(t) {
      return this._interpretation = t, this;
    }
    // ============================================
    // Integer properties
    // ============================================
    /**
     * Add an int property (width=1)
     */
    int(t, e) {
      return this._addProperty(t, p.Int, 1, e);
    }
    /**
     * Add an int[2] property
     */
    int2(t, e) {
      return this._addProperty(t, p.Int, 2, e);
    }
    /**
     * Add an int[3] property
     */
    int3(t, e) {
      return this._addProperty(t, p.Int, 3, e);
    }
    /**
     * Add an int[4] property
     */
    int4(t, e) {
      return this._addProperty(t, p.Int, 4, e);
    }
    // ============================================
    // Float properties
    // ============================================
    /**
     * Add a float property (width=1)
     */
    float(t, e) {
      return this._addProperty(t, p.Float, 1, e);
    }
    /**
     * Add a float[2] property
     */
    float2(t, e) {
      return this._addProperty(t, p.Float, 2, e);
    }
    /**
     * Add a float[3] property
     */
    float3(t, e) {
      return this._addProperty(t, p.Float, 3, e);
    }
    /**
     * Add a float[4] property
     */
    float4(t, e) {
      return this._addProperty(t, p.Float, 4, e);
    }
    /**
     * Add a float[16] property (4x4 matrix)
     */
    matrix4(t, e) {
      return this._addProperty(t, p.Float, 16, e);
    }
    /**
     * Add a float[9] property (3x3 matrix)
     */
    matrix3(t, e) {
      return this._addProperty(t, p.Float, 9, e);
    }
    // ============================================
    // Double properties
    // ============================================
    /**
     * Add a double property (width=1)
     */
    double(t, e) {
      return this._addProperty(t, p.Double, 1, e);
    }
    /**
     * Add a double[2] property
     */
    double2(t, e) {
      return this._addProperty(t, p.Double, 2, e);
    }
    /**
     * Add a double[3] property
     */
    double3(t, e) {
      return this._addProperty(t, p.Double, 3, e);
    }
    // ============================================
    // String properties
    // ============================================
    /**
     * Add a string property (width=1)
     */
    string(t, e) {
      const n = typeof e == "string" ? [e] : e;
      return this._addProperty(t, p.String, 1, n);
    }
    /**
     * Add a string[N] property
     */
    stringN(t, e, n) {
      return this._addProperty(t, p.String, e, n);
    }
    // ============================================
    // Other types
    // ============================================
    /**
     * Add a byte property
     */
    byte(t, e) {
      return this._addProperty(t, p.Byte, 1, e);
    }
    /**
     * Add a short property
     */
    short(t, e) {
      return this._addProperty(t, p.Short, 1, e);
    }
    /**
     * Add a boolean property
     */
    bool(t, e) {
      return this._addProperty(t, p.Boolean, 1, e);
    }
    // ============================================
    // Generic property
    // ============================================
    /**
     * Add a generic property with custom type and width
     */
    property(t, e, n, r, s = "") {
      return this._addProperty(t, e, n, r), s && (this._properties[t].interpretation = s), this;
    }
    // ============================================
    // Builder methods
    // ============================================
    /**
     * End component and return to parent object builder
     */
    end() {
      return this._parent;
    }
    /**
     * Build the component object
     */
    build() {
      const t = {};
      for (const [e, n] of Object.entries(this._properties))
        t[e] = n;
      return {
        interpretation: this._interpretation,
        properties: t
      };
    }
    // ============================================
    // Internal
    // ============================================
    _addProperty(t, e, n, r) {
      let s, o;
      if (Array.isArray(r) && r.length > 0 && Array.isArray(r[0]))
        o = r.length, s = r;
      else if (Array.isArray(r))
        if (n > 1) {
          o = Math.floor(r.length / n), s = [];
          for (let l = 0; l < r.length; l += n)
            s.push(r.slice(l, l + n));
        } else
          o = r.length, s = r;
      else
        o = 1, s = [r];
      return this._properties[t] = {
        type: this._typeName(e),
        size: o,
        width: n,
        interpretation: "",
        data: s
      }, this;
    }
    _typeName(t) {
      return {
        [p.Int]: "int",
        [p.Float]: "float",
        [p.Double]: "double",
        [p.Half]: "half",
        [p.String]: "string",
        [p.Boolean]: "bool",
        [p.Short]: "short",
        [p.Byte]: "byte",
        [p.Int64]: "int64"
      }[t] || "float";
    }
  };
  var at = class {
    _name;
    _protocol;
    _version;
    _parent;
    _components = {};
    constructor(t, e, n, r) {
      this._name = t, this._protocol = e, this._version = n, this._parent = r;
    }
    /**
     * Start a new component
     */
    component(t, e = "") {
      const n = new ot(t, this);
      return e && n.as(e), this._components[t] = n, n;
    }
    /**
     * End object and return to parent GTO builder
     */
    end() {
      return this._parent;
    }
    /**
     * Build the object
     */
    build() {
      const t = {};
      for (const [e, n] of Object.entries(this._components))
        t[e] = n.build();
      return {
        name: this._name,
        protocol: this._protocol,
        protocolVersion: this._version,
        components: t
      };
    }
  };
  var K = class {
    _objects = [];
    _version = 4;
    /**
     * Set GTO version
     */
    version(t) {
      return this._version = t, this;
    }
    /**
     * Start a new object
     * @param name - Object name
     * @param protocol - Protocol name
     * @param version - Protocol version
     */
    object(t, e, n = 1) {
      const r = new at(t, e, n, this);
      return this._objects.push(r), r;
    }
    /**
     * Build the final GTO data structure
     */
    build() {
      return {
        version: this._version,
        objects: this._objects.map((t) => t.build())
      };
    }
    /**
     * Build and convert to JSON string
     */
    toJSON(t = 2) {
      return JSON.stringify(this.build(), null, t);
    }
  };
  var W = class {
    _name;
    _data;
    _parent;
    constructor(t, e, n) {
      this._name = t, this._data = e, this._parent = n;
    }
    /** Property name */
    get name() {
      return this._name;
    }
    /** Data type (int, float, string, etc.) */
    get type() {
      return this._data.type;
    }
    /** Number of elements */
    get size() {
      return this._data.size;
    }
    /** Parts per element (e.g., 3 for float3) */
    get width() {
      return this._data.width;
    }
    /** Interpretation string */
    get interpretation() {
      return this._data.interpretation;
    }
    /** Raw data array */
    get data() {
      return this._data.data;
    }
    /** Parent component */
    get parent() {
      return this._parent;
    }
    /**
     * Get the value (unwraps single values from arrays)
     * @returns Single value or array
     */
    value() {
      const t = this._data.data;
      return !t || t.length === 0 ? null : t.length === 1 && !Array.isArray(t[0]) || t.length === 1 && Array.isArray(t[0]) ? t[0] : t;
    }
    /**
     * Get value at specific index
     */
    at(t) {
      return this._data.data?.[t] ?? null;
    }
    /**
     * Get first value
     */
    first() {
      return this.at(0);
    }
    /**
     * Get last value
     */
    last() {
      const t = this._data.data;
      return t?.[t.length - 1] ?? null;
    }
    /**
     * Get all values as flat array
     */
    flat() {
      const t = this._data.data;
      return t ? t.flat(1 / 0) : [];
    }
    /**
     * Check if property exists and has data
     */
    exists() {
      return this._data && this._data.data && this._data.data.length > 0;
    }
    /**
     * Get value or default if not exists
     */
    valueOr(t) {
      const e = this.value();
      return e !== null ? e : t;
    }
    /**
     * Map over values
     */
    map(t) {
      return (this._data.data || []).map(t);
    }
    /**
     * Filter values
     */
    filter(t) {
      return (this._data.data || []).filter(t);
    }
    /**
     * Convert to plain object
     */
    toObject() {
      return { ...this._data };
    }
  };
  var ct = class extends W {
    constructor(t) {
      super(t, { type: "", size: 0, width: 0, data: [], interpretation: "" }, null);
    }
    value() {
      return null;
    }
    exists() {
      return false;
    }
  };
  var q = class {
    _name;
    _data;
    _parent;
    _propertyCache = /* @__PURE__ */ new Map();
    constructor(t, e, n) {
      this._name = t, this._data = e, this._parent = n;
    }
    /** Component name */
    get name() {
      return this._name;
    }
    /** Interpretation string */
    get interpretation() {
      return this._data.interpretation;
    }
    /** Parent object */
    get parent() {
      return this._parent;
    }
    /**
     * Get property by name
     */
    property(t) {
      if (!this._propertyCache.has(t)) {
        const e = this._data.properties?.[t];
        this._propertyCache.set(t, e ? new W(t, e, this) : new ct(t));
      }
      return this._propertyCache.get(t);
    }
    /**
     * Shorthand for property().value()
     */
    prop(t) {
      return this.property(t).value();
    }
    /**
     * Check if property exists
     */
    hasProperty(t) {
      return t in (this._data.properties || {});
    }
    /**
     * Get all property names
     */
    propertyNames() {
      return Object.keys(this._data.properties || {});
    }
    /**
     * Get all properties as PropertyDTO array
     */
    properties() {
      return this.propertyNames().map((t) => this.property(t));
    }
    /**
     * Filter properties by type
     * @param type - 'int', 'float', 'string', etc.
     */
    propertiesByType(t) {
      return this.properties().filter((e) => e.type === t);
    }
    /**
     * Find property matching predicate
     */
    findProperty(t) {
      return this.properties().find(t) || null;
    }
    /**
     * Check if component exists
     */
    exists() {
      return this._data !== null && this._data !== void 0;
    }
    /**
     * Convert to plain object
     */
    toObject() {
      return {
        name: this._name,
        interpretation: this.interpretation,
        properties: { ...this._data.properties }
      };
    }
  };
  var lt = class extends q {
    constructor(t) {
      super(t, { interpretation: "", properties: {} }, null);
    }
    exists() {
      return false;
    }
  };
  var U = class {
    _data;
    _componentCache = /* @__PURE__ */ new Map();
    constructor(t) {
      this._data = t;
    }
    /** Object name */
    get name() {
      return this._data.name;
    }
    /** Protocol name */
    get protocol() {
      return this._data.protocol;
    }
    /** Protocol version */
    get protocolVersion() {
      return this._data.protocolVersion;
    }
    /**
     * Get component by name
     */
    component(t) {
      if (!this._componentCache.has(t)) {
        const e = this._data.components?.[t];
        this._componentCache.set(t, e ? new q(t, e, this) : new lt(t));
      }
      return this._componentCache.get(t);
    }
    /**
     * Shorthand: get property value from component
     */
    prop(t, e) {
      return this.component(t).property(e).value();
    }
    /**
     * Check if component exists
     */
    hasComponent(t) {
      return t in (this._data.components || {});
    }
    /**
     * Get all component names
     */
    componentNames() {
      return Object.keys(this._data.components || {});
    }
    /**
     * Get all components as ComponentDTO array
     */
    components() {
      return this.componentNames().map((t) => this.component(t));
    }
    /**
     * Find component matching predicate
     */
    findComponent(t) {
      return this.components().find(t) || null;
    }
    /**
     * Find component by name pattern (regex)
     */
    componentsByPattern(t) {
      const e = typeof t == "string" ? new RegExp(t) : t;
      return this.components().filter((n) => e.test(n.name));
    }
    /**
     * Check if object matches protocol
     */
    isProtocol(t) {
      return this._data.protocol === t;
    }
    /**
     * Check if object exists
     */
    exists() {
      return this._data !== null && this._data !== void 0;
    }
    /**
     * Convert to plain object
     */
    toObject() {
      return { ...this._data };
    }
  };
  var P = class extends U {
    constructor() {
      super({ name: "", protocol: "", protocolVersion: 0, components: {} });
    }
    exists() {
      return false;
    }
  };
  var k = class _k {
    _objects;
    constructor(t) {
      this._objects = t.map((e) => e instanceof U ? e : new U(e));
    }
    /** Number of objects */
    get length() {
      return this._objects.length;
    }
    /**
     * Get object by index
     */
    at(t) {
      return this._objects[t] || new P();
    }
    /**
     * Get first object
     */
    first() {
      return this.at(0);
    }
    /**
     * Get last object
     */
    last() {
      return this.at(this._objects.length - 1);
    }
    /**
     * Filter by protocol
     */
    byProtocol(t) {
      return new _k(this._objects.filter((e) => e.protocol === t));
    }
    /**
     * Filter by name pattern
     */
    byName(t) {
      const e = typeof t == "string" ? new RegExp(t) : t;
      return new _k(this._objects.filter((n) => e.test(n.name)));
    }
    /**
     * Filter by predicate
     */
    filter(t) {
      return new _k(this._objects.filter(t));
    }
    /**
     * Find single object
     */
    find(t) {
      return this._objects.find(t) || new P();
    }
    /**
     * Map over objects
     */
    map(t) {
      return this._objects.map(t);
    }
    /**
     * ForEach over objects
     */
    forEach(t) {
      this._objects.forEach(t);
    }
    /**
     * Check if any object matches predicate
     */
    some(t) {
      return this._objects.some(t);
    }
    /**
     * Check if all objects match predicate
     */
    every(t) {
      return this._objects.every(t);
    }
    /**
     * Get all objects as array
     */
    toArray() {
      return [...this._objects];
    }
    /**
     * Get unique protocols
     */
    protocols() {
      return [...new Set(this._objects.map((t) => t.protocol))];
    }
    /**
     * Group by protocol
     */
    groupByProtocol() {
      const t = /* @__PURE__ */ new Map();
      for (const e of this._objects)
        t.has(e.protocol) || t.set(e.protocol, []), t.get(e.protocol).push(e);
      return new Map([...t].map(([e, n]) => [e, new _k(n)]));
    }
    /**
     * Iterate over objects
     */
    [Symbol.iterator]() {
      return this._objects[Symbol.iterator]();
    }
  };
  var jt = class {
    _data;
    _objects;
    _objectCache = /* @__PURE__ */ new Map();
    /**
     * Create DTO from parsed GTO data
     * @param data - Parsed GTO data (from SimpleReader.result)
     */
    constructor(t) {
      this._data = t, this._objects = new k(t.objects || []);
    }
    /** GTO version */
    get version() {
      return this._data.version;
    }
    /** Number of objects */
    get objectCount() {
      return this._objects.length;
    }
    /**
     * Get all objects
     */
    objects() {
      return this._objects;
    }
    /**
     * Get object by exact name
     */
    object(t) {
      if (!this._objectCache.has(t)) {
        const e = this._data.objects?.find((n) => n.name === t);
        this._objectCache.set(t, e ? new U(e) : new P());
      }
      return this._objectCache.get(t);
    }
    /**
     * Filter objects by protocol
     */
    byProtocol(t) {
      return this._objects.byProtocol(t);
    }
    /**
     * Filter objects by name pattern
     */
    byName(t) {
      return this._objects.byName(t);
    }
    /**
     * Get unique protocols in the file
     */
    protocols() {
      return this._objects.protocols();
    }
    /**
     * Group objects by protocol
     */
    groupByProtocol() {
      return this._objects.groupByProtocol();
    }
    /**
     * Find first object matching predicate
     */
    find(t) {
      return this._objects.find(t);
    }
    /**
     * Filter objects by predicate
     */
    filter(t) {
      return this._objects.filter(t);
    }
    // ============================================
    // RV Session specific helpers
    // ============================================
    /**
     * Get session object (RVSession)
     */
    session() {
      return this.byProtocol("RVSession").first();
    }
    /**
     * Get all source groups
     */
    sourceGroups() {
      return this.byProtocol("RVSourceGroup");
    }
    /**
     * Get all file sources
     */
    fileSources() {
      return this.byProtocol("RVFileSource");
    }
    /**
     * Get connection graph object
     */
    connections() {
      return this.byProtocol("connection").first();
    }
    /**
     * Get all paint/annotation objects
     */
    paints() {
      return this.byProtocol("RVPaint");
    }
    /**
     * Extract media file paths
     */
    mediaPaths() {
      return this.fileSources().map((t) => t.component("media").property("movie").value()).filter(Boolean);
    }
    /**
     * Get timeline info
     */
    timeline() {
      const t = this.session().component("session");
      return {
        range: t.prop("range") || [1, 100],
        region: t.prop("region") || [1, 100],
        fps: t.prop("fps") || 24,
        currentFrame: t.prop("currentFrame") || 1,
        marks: t.prop("marks") || []
      };
    }
    /**
     * Get node connections as array of [from, to] pairs
     */
    connectionEdges() {
      return this.connections().component("evaluation").property("connections").value() || [];
    }
    /**
     * Extract all annotations (pen strokes, text)
     */
    annotations() {
      const t = [];
      for (const e of this.paints())
        for (const n of e.components())
          if (n.name.startsWith("pen:") || n.name.startsWith("text:")) {
            const r = n.name.split(":");
            t.push({
              type: r[0],
              id: r[1],
              frame: parseInt(r[2]) || 0,
              user: r[3] || "",
              node: e.name,
              color: n.prop("color"),
              points: n.prop("points"),
              text: n.prop("text"),
              brush: n.prop("brush")
            });
          }
      return t;
    }
    /**
     * Convert to plain object
     */
    toObject() {
      return { ...this._data };
    }
    /**
     * Convert to JSON string
     */
    toJSON(t = 2) {
      return JSON.stringify(this._data, null, t);
    }
  };

  // src/exporters/openrv.ts
  function hexToRGBA(hex, opacity = 1) {
    const cleanHex = hex.replace(/^#/, "");
    let r = 0, g = 0, b2 = 0;
    if (cleanHex.length === 3) {
      r = parseInt(cleanHex[0] + cleanHex[0], 16) / 255;
      g = parseInt(cleanHex[1] + cleanHex[1], 16) / 255;
      b2 = parseInt(cleanHex[2] + cleanHex[2], 16) / 255;
    } else if (cleanHex.length === 6) {
      r = parseInt(cleanHex.substring(0, 2), 16) / 255;
      g = parseInt(cleanHex.substring(2, 4), 16) / 255;
      b2 = parseInt(cleanHex.substring(4, 6), 16) / 255;
    } else if (cleanHex.length === 8) {
      r = parseInt(cleanHex.substring(0, 2), 16) / 255;
      g = parseInt(cleanHex.substring(2, 4), 16) / 255;
      b2 = parseInt(cleanHex.substring(4, 6), 16) / 255;
      opacity = parseInt(cleanHex.substring(6, 8), 16) / 255;
    }
    return [r, g, b2, opacity];
  }
  function extractColor(style, opacity = 1) {
    if (typeof style === "string") {
      if (style.startsWith("rgb")) {
        const match = style.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (match) {
          return [
            parseInt(match[1]) / 255,
            parseInt(match[2]) / 255,
            parseInt(match[3]) / 255,
            match[4] ? parseFloat(match[4]) : opacity
          ];
        }
      }
      return hexToRGBA(style, opacity);
    }
    return [1, 0, 0, opacity];
  }
  function rotatePoint(point, centerX, centerY, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const dx = point.x - centerX;
    const dy = point.y - centerY;
    return {
      x: centerX + dx * cos - dy * sin,
      y: centerY + dx * sin + dy * cos
    };
  }
  function applyRotationToPoints(points, shape, defaultCenterX, defaultCenterY) {
    if (!shape.rotation) {
      return points;
    }
    const centerX = shape.rotationCenterX !== void 0 ? shape.rotationCenterX : defaultCenterX;
    const centerY = shape.rotationCenterY !== void 0 ? shape.rotationCenterY : defaultCenterY;
    return points.map((p2) => rotatePoint(p2, centerX, centerY, shape.rotation));
  }
  function convertSmAnnotateToOpenRV(smX, smY, aspectRatio) {
    return {
      x: smX * 2 - 1,
      y: (1 - smY * 2) / aspectRatio
    };
  }
  function curveToPenData(shape, id, frame, width, height) {
    const color = extractColor(shape.strokeStyle, shape.opacity ?? 1);
    const aspectRatio = width / height;
    let centerX = 0, centerY = 0;
    for (const p2 of shape.points) {
      centerX += p2.x;
      centerY += p2.y;
    }
    centerX /= shape.points.length;
    centerY /= shape.points.length;
    const points = applyRotationToPoints(shape.points, shape, centerX, centerY);
    const normalizedWidth = shape.lineWidth / height;
    const widthArray = new Array(points.length).fill(normalizedWidth);
    const convertedPoints = points.map((p2) => {
      const converted = convertSmAnnotateToOpenRV(p2.x, p2.y, aspectRatio);
      return [converted.x, converted.y];
    });
    return {
      name: `pen:${id}:${frame}:User`,
      frame,
      color,
      width: widthArray,
      points: convertedPoints,
      brush: "circle"
    };
  }
  function lineToPenData(shape, id, frame, width, height) {
    const color = extractColor(shape.strokeStyle, shape.opacity ?? 1);
    const aspectRatio = width / height;
    const centerX = (shape.x1 + shape.x2) / 2;
    const centerY = (shape.y1 + shape.y2) / 2;
    let points = [
      { x: shape.x1, y: shape.y1 },
      { x: shape.x2, y: shape.y2 }
    ];
    points = applyRotationToPoints(points, shape, centerX, centerY);
    const normalizedWidth = shape.lineWidth / height;
    const widthArray = new Array(points.length).fill(normalizedWidth);
    const convertedPoints = points.map((p2) => {
      const converted = convertSmAnnotateToOpenRV(p2.x, p2.y, aspectRatio);
      return [converted.x, converted.y];
    });
    return {
      name: `pen:${id}:${frame}:User`,
      frame,
      color,
      width: widthArray,
      points: convertedPoints,
      brush: "circle"
    };
  }
  function arrowToPenDataArray(shape, id, frame, width, height) {
    const color = extractColor(shape.strokeStyle, shape.opacity ?? 1);
    const aspectRatio = width / height;
    const centerX = (shape.x1 + shape.x2) / 2;
    const centerY = (shape.y1 + shape.y2) / 2;
    let linePoints = [
      { x: shape.x1, y: shape.y1 },
      { x: shape.x2, y: shape.y2 }
    ];
    const headLengthPx = 10 + 2.5 * shape.lineWidth;
    const headLength = headLengthPx / ((width + height) / 2);
    const headAngle = Math.PI / 6;
    const angle = Math.atan2(shape.y2 - shape.y1, shape.x2 - shape.x1);
    let arrowHead1 = [
      { x: shape.x2, y: shape.y2 },
      {
        x: shape.x2 - headLength * Math.cos(angle + headAngle),
        y: shape.y2 - headLength * Math.sin(angle + headAngle)
      }
    ];
    let arrowHead2 = [
      { x: shape.x2, y: shape.y2 },
      {
        x: shape.x2 - headLength * Math.cos(angle - headAngle),
        y: shape.y2 - headLength * Math.sin(angle - headAngle)
      }
    ];
    linePoints = applyRotationToPoints(linePoints, shape, centerX, centerY);
    arrowHead1 = applyRotationToPoints(arrowHead1, shape, centerX, centerY);
    arrowHead2 = applyRotationToPoints(arrowHead2, shape, centerX, centerY);
    const normalizedWidth = shape.lineWidth / height;
    const widthArray2 = new Array(2).fill(normalizedWidth);
    const convertPoints = (pts) => pts.map((p2) => {
      const converted = convertSmAnnotateToOpenRV(p2.x, p2.y, aspectRatio);
      return [converted.x, converted.y];
    });
    return [
      {
        name: `pen:${id}:${frame}:User`,
        frame,
        color,
        width: widthArray2,
        points: convertPoints(linePoints),
        brush: "circle"
      },
      {
        name: `pen:${id + 1}:${frame}:User`,
        frame,
        color,
        width: widthArray2,
        points: convertPoints(arrowHead1),
        brush: "circle"
      },
      {
        name: `pen:${id + 2}:${frame}:User`,
        frame,
        color,
        width: widthArray2,
        points: convertPoints(arrowHead2),
        brush: "circle"
      }
    ];
  }
  function rectangleToPenData(shape, id, frame, width, height) {
    const color = extractColor(shape.strokeStyle, shape.opacity ?? 1);
    const aspectRatio = width / height;
    const centerX = shape.x + shape.width / 2;
    const centerY = shape.y + shape.height / 2;
    let points = [
      { x: shape.x, y: shape.y },
      { x: shape.x + shape.width, y: shape.y },
      { x: shape.x + shape.width, y: shape.y + shape.height },
      { x: shape.x, y: shape.y + shape.height },
      { x: shape.x, y: shape.y }
      // Close the path
    ];
    points = applyRotationToPoints(points, shape, centerX, centerY);
    const normalizedWidth = shape.lineWidth / height;
    const widthArray = new Array(points.length).fill(normalizedWidth);
    const convertedPoints = points.map((p2) => {
      const converted = convertSmAnnotateToOpenRV(p2.x, p2.y, aspectRatio);
      return [converted.x, converted.y];
    });
    return {
      name: `pen:${id}:${frame}:User`,
      frame,
      color,
      width: widthArray,
      points: convertedPoints,
      brush: "circle"
    };
  }
  function circleToPenData(shape, id, frame, width, height, segments = 32) {
    const color = extractColor(shape.strokeStyle, shape.opacity ?? 1);
    const aspectRatio = width / height;
    const centerX = shape.x;
    const centerY = shape.y;
    let points = [];
    for (let i = 0; i <= segments; i++) {
      const angle = i / segments * Math.PI * 2;
      points.push({
        x: shape.x + Math.cos(angle) * shape.radius,
        y: shape.y + Math.sin(angle) * shape.radius
      });
    }
    points = applyRotationToPoints(points, shape, centerX, centerY);
    const normalizedWidth = shape.lineWidth / height;
    const widthArray = new Array(points.length).fill(normalizedWidth);
    const convertedPoints = points.map((p2) => {
      const converted = convertSmAnnotateToOpenRV(p2.x, p2.y, aspectRatio);
      return [converted.x, converted.y];
    });
    return {
      name: `pen:${id}:${frame}:User`,
      frame,
      color,
      width: widthArray,
      points: convertedPoints,
      brush: "circle"
    };
  }
  function textToTextData(shape, id, frame, width, height) {
    const color = extractColor(shape.fillStyle, shape.opacity ?? 1);
    const aspectRatio = width / height;
    let posX = shape.x;
    let posY = shape.y;
    let textRotation = 0;
    if (shape.rotation) {
      const centerX = shape.rotationCenterX ?? shape.x;
      const centerY = shape.rotationCenterY ?? shape.y;
      const rotated = rotatePoint({ x: shape.x, y: shape.y }, centerX, centerY, shape.rotation);
      posX = rotated.x;
      posY = rotated.y;
      textRotation = shape.rotation * 180 / Math.PI;
    }
    const openrvPos = convertSmAnnotateToOpenRV(posX, posY, aspectRatio);
    const fontSize = 16 + (shape.lineWidth ?? 1) * 0.5;
    const normalizedSize = fontSize / height;
    return {
      name: `text:${id}:${frame}:User`,
      frame,
      position: [openrvPos.x, openrvPos.y],
      color,
      text: shape.text,
      size: normalizedSize,
      rotation: textRotation
    };
  }
  function shapeToComponentData(shape, id, frame, width, height) {
    const penData = [];
    const textData = [];
    let nextId = id;
    switch (shape.type) {
      case "curve":
        penData.push(curveToPenData(shape, nextId, frame, width, height));
        nextId++;
        break;
      case "line":
        penData.push(lineToPenData(shape, nextId, frame, width, height));
        nextId++;
        break;
      case "arrow":
        const arrowData = arrowToPenDataArray(shape, nextId, frame, width, height);
        penData.push(...arrowData);
        nextId += arrowData.length;
        break;
      case "rectangle":
        penData.push(rectangleToPenData(shape, nextId, frame, width, height));
        nextId++;
        break;
      case "circle":
        penData.push(circleToPenData(shape, nextId, frame, width, height));
        nextId++;
        break;
      case "text":
        textData.push(textToTextData(shape, nextId, frame, width, height));
        nextId++;
        break;
      // Skip non-visual shapes
      case "eraser":
      case "move":
      case "image":
      case "compare":
      case "audio-peaks":
      case "selection":
        break;
    }
    return { penData, textData, nextId };
  }
  function exportToOpenRV(frames, options) {
    const { mediaPath, width, height, sessionName = "sm-annotate-session" } = options;
    const allPenData = [];
    const allTextData = [];
    let nextId = 0;
    for (const frameData of frames) {
      for (const shape of frameData.shapes) {
        const result = shapeToComponentData(shape, nextId, frameData.frame, width, height);
        allPenData.push(...result.penData);
        allTextData.push(...result.textData);
        nextId = result.nextId;
      }
    }
    const frameOrders = /* @__PURE__ */ new Map();
    for (const pen of allPenData) {
      if (!frameOrders.has(pen.frame)) {
        frameOrders.set(pen.frame, []);
      }
      frameOrders.get(pen.frame).push(pen.name);
    }
    for (const text of allTextData) {
      if (!frameOrders.has(text.frame)) {
        frameOrders.set(text.frame, []);
      }
      frameOrders.get(text.frame).push(text.name);
    }
    const builder = new K();
    builder.object("RVSession", "RVSession", 4).component("session").string("name", sessionName).int("version", 4).end().end();
    builder.object("sourceGroup000000_source", "RVFileSource", 1).component("media").string("movie", mediaPath).end().component("request").int("width", width).int("height", height).end().end();
    if (allPenData.length > 0 || allTextData.length > 0) {
      const paintObj = builder.object("sourceGroup000000_paint", "RVPaint", 3);
      paintObj.component("paint").int("nextId", nextId).int("nextAnnotationId", 0).int("show", 1).string("exclude", []).string("include", []).end();
      for (const pen of allPenData) {
        paintObj.component(pen.name).float4("color", [pen.color]).float("width", pen.width).string("brush", pen.brush).float2("points", pen.points).int("debug", 0).int("join", 3).int("cap", 1).int("splat", 0).end();
      }
      for (const text of allTextData) {
        paintObj.component(text.name).float2("position", [text.position]).float4("color", [text.color]).float("spacing", 0.8).float("size", text.size).float("scale", 1).float("rotation", text.rotation).string("font", "").string("text", text.text).string("origin", "").int("debug", 0).end();
      }
      for (const [frame, order] of frameOrders) {
        paintObj.component(`frame:${frame}`).string("order", order).end();
      }
      paintObj.end();
    }
    const gtoData = builder.build();
    const output = It.write(gtoData);
    const header = [
      "GTOa (4)",
      "",
      "# Generated by sm-annotate OpenRV exporter",
      `# Media: ${mediaPath}`,
      `# Resolution: ${width}x${height}`,
      ""
    ].join("\n");
    const outputStr = output;
    const outputWithoutHeader = outputStr.replace(/^GTOa \(\d+\)\s*\n?/, "");
    return header + outputWithoutHeader;
  }
  function downloadAsOpenRV(frames, options, filename = "annotations.rv") {
    const content = exportToOpenRV(frames, options);
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // src/exporters/openrv-parser.ts
  function rgbaToHex(rgba) {
    if (rgba.length < 3) return "#000000";
    const r = Math.round(rgba[0] * 255);
    const g = Math.round(rgba[1] * 255);
    const b2 = Math.round(rgba[2] * 255);
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b2.toString(16).padStart(2, "0")}`;
  }
  function convertOpenRVToSmAnnotate(openrvX, openrvY, aspectRatio) {
    return {
      x: (openrvX + 1) / 2,
      y: (1 - openrvY * aspectRatio) / 2
    };
  }
  function applyCoordinateTransform(x, y, scale, offset) {
    let newX = x;
    let newY = y;
    if (scale !== void 0 && scale !== 1) {
      newX = 0.5 + (x - 0.5) * scale;
      newY = 0.5 + (y - 0.5) * scale;
    }
    if (offset) {
      newX -= offset.x;
      newY -= offset.y;
    }
    return { x: newX, y: newY };
  }
  function penComponentToCurve(comp, width, height, targetHeight, scale, offset) {
    const pointsData = comp.prop("points");
    const colorData = comp.prop("color");
    const widthData = comp.prop("width");
    if (!pointsData) {
      return null;
    }
    const flatPoints = Array.isArray(pointsData[0]) ? pointsData.flat() : pointsData;
    if (flatPoints.length < 4) {
      return null;
    }
    const aspectRatio = width / height;
    const points = [];
    for (let i = 0; i < flatPoints.length; i += 2) {
      let converted = convertOpenRVToSmAnnotate(
        flatPoints[i],
        flatPoints[i + 1],
        aspectRatio
      );
      converted = applyCoordinateTransform(converted.x, converted.y, scale, offset);
      points.push(converted);
    }
    const flatColor = colorData ? Array.isArray(colorData[0]) ? colorData[0] : colorData : [0, 0, 0, 1];
    const color = rgbaToHex(flatColor);
    const opacity = flatColor.length >= 4 ? flatColor[3] : 1;
    let lineWidth = 2;
    if (typeof widthData === "number") {
      lineWidth = widthData * targetHeight;
    } else if (Array.isArray(widthData) && widthData.length > 0) {
      const firstWidth = widthData[0];
      if (typeof firstWidth === "number") {
        lineWidth = firstWidth * targetHeight;
      }
    }
    if (scale !== void 0 && scale !== 1) {
      lineWidth *= scale;
    }
    lineWidth = Math.max(1, Math.min(lineWidth, 50));
    return {
      type: "curve",
      points,
      strokeStyle: color,
      fillStyle: color,
      lineWidth,
      opacity
    };
  }
  function textComponentToText(comp, width, height, targetHeight, scale, offset) {
    const positionData = comp.prop("position");
    const colorData = comp.prop("color");
    const textContent = comp.prop("text");
    const size = comp.prop("size");
    if (!textContent) {
      return null;
    }
    if (!positionData) {
      return null;
    }
    const flatPosition = Array.isArray(positionData[0]) ? positionData[0] : positionData;
    if (flatPosition.length < 2) {
      return null;
    }
    const aspectRatio = width / height;
    let converted = convertOpenRVToSmAnnotate(
      flatPosition[0],
      flatPosition[1],
      aspectRatio
    );
    converted = applyCoordinateTransform(converted.x, converted.y, scale, offset);
    const flatColor = colorData ? Array.isArray(colorData[0]) ? colorData[0] : colorData : [0, 0, 0, 1];
    const color = rgbaToHex(flatColor);
    const opacity = flatColor.length >= 4 ? flatColor[3] : 1;
    const normalizedSize = size ?? 0.01;
    let fontSize = normalizedSize * targetHeight;
    if (scale !== void 0 && scale !== 1) {
      fontSize *= scale;
    }
    const lineWidth = Math.max(1, (fontSize - 16) / 0.5);
    return {
      type: "text",
      x: converted.x,
      y: converted.y,
      text: textContent,
      strokeStyle: color,
      fillStyle: color,
      lineWidth,
      opacity
    };
  }
  function extractDimensions(dto) {
    const fileSource = dto.fileSources().first();
    if (fileSource.exists()) {
      const proxySize = fileSource.prop("proxy", "size");
      if (proxySize && proxySize.length >= 2) {
        return { width: proxySize[0], height: proxySize[1] };
      }
      const reqWidth = fileSource.prop("request", "width");
      const reqHeight = fileSource.prop("request", "height");
      if (reqWidth && reqHeight) {
        return { width: reqWidth, height: reqHeight };
      }
    }
    const stack = dto.byProtocol("RVStack").first();
    if (stack.exists()) {
      const outputSize = stack.prop("output", "size");
      if (outputSize && outputSize.length >= 2) {
        return { width: outputSize[0], height: outputSize[1] };
      }
    }
    const seq = dto.byProtocol("RVSequence").first();
    if (seq.exists()) {
      const outputSize = seq.prop("output", "size");
      if (outputSize && outputSize.length >= 2) {
        return { width: outputSize[0], height: outputSize[1] };
      }
    }
    return void 0;
  }
  function parseOpenRV(content, options = {}) {
    const result = {
      frames: []
    };
    const reader = new bt();
    const success = reader.open(content);
    if (!success) {
      if (options.debug) {
        console.log("[OpenRV Parser] Failed to parse GTO content");
      }
      return result;
    }
    const dto = new jt(reader.result);
    const session = dto.session();
    if (session.exists()) {
      const name = session.prop("session", "name");
      if (name) {
        result.sessionName = name;
      }
    }
    const fileSource = dto.fileSources().first();
    if (fileSource.exists()) {
      const movie = fileSource.prop("media", "movie");
      if (movie) {
        result.mediaPath = movie;
      }
    }
    result.dimensions = extractDimensions(dto);
    const width = result.dimensions?.width ?? options.width ?? 1920;
    const height = result.dimensions?.height ?? options.height ?? 1080;
    const targetHeight = options.targetHeight ?? height;
    const fps = options.fps ?? 25;
    const scale = options.coordinateScale;
    const offset = options.coordinateOffset;
    const debug = options.debug ?? false;
    result.fps = fps;
    if (debug) {
      console.log("[OpenRV Parser] Source dimensions:", width, "x", height);
      console.log("[OpenRV Parser] Target height:", targetHeight);
      console.log("[OpenRV Parser] Coordinate scale:", scale);
      console.log("[OpenRV Parser] Coordinate offset:", offset);
    }
    const paints = dto.paints();
    if (paints.length === 0) {
      if (debug) console.log("[OpenRV Parser] No RVPaint objects found");
      return result;
    }
    if (debug) console.log("[OpenRV Parser] Found", paints.length, "RVPaint objects");
    const frameShapes = /* @__PURE__ */ new Map();
    for (const paint of paints) {
      for (const comp of paint.components()) {
        const compName = comp.name;
        const penMatch = compName.match(/^pen:\d+:(\d+):/i);
        if (penMatch) {
          const frame = parseInt(penMatch[1]);
          const shape = penComponentToCurve(comp, width, height, targetHeight, scale, offset);
          if (shape) {
            if (!frameShapes.has(frame)) {
              frameShapes.set(frame, []);
            }
            frameShapes.get(frame).push(shape);
          }
          continue;
        }
        const textMatch = compName.match(/^text:\d+:(\d+):/i);
        if (textMatch) {
          const frame = parseInt(textMatch[1]);
          const shape = textComponentToText(comp, width, height, targetHeight, scale, offset);
          if (shape) {
            if (!frameShapes.has(frame)) {
              frameShapes.set(frame, []);
            }
            frameShapes.get(frame).push(shape);
          }
        }
      }
    }
    for (const [frame, shapes] of frameShapes) {
      result.frames.push({
        frame,
        fps,
        version: 1,
        shapes
      });
    }
    result.frames.sort((a, b2) => a.frame - b2.frame);
    return result;
  }

  // node_modules/@ffmpeg/ffmpeg/dist/esm/const.js
  var CORE_VERSION = "0.12.9";
  var CORE_URL = `https://unpkg.com/@ffmpeg/core@${CORE_VERSION}/dist/umd/ffmpeg-core.js`;
  var FFMessageType;
  (function(FFMessageType2) {
    FFMessageType2["LOAD"] = "LOAD";
    FFMessageType2["EXEC"] = "EXEC";
    FFMessageType2["FFPROBE"] = "FFPROBE";
    FFMessageType2["WRITE_FILE"] = "WRITE_FILE";
    FFMessageType2["READ_FILE"] = "READ_FILE";
    FFMessageType2["DELETE_FILE"] = "DELETE_FILE";
    FFMessageType2["RENAME"] = "RENAME";
    FFMessageType2["CREATE_DIR"] = "CREATE_DIR";
    FFMessageType2["LIST_DIR"] = "LIST_DIR";
    FFMessageType2["DELETE_DIR"] = "DELETE_DIR";
    FFMessageType2["ERROR"] = "ERROR";
    FFMessageType2["DOWNLOAD"] = "DOWNLOAD";
    FFMessageType2["PROGRESS"] = "PROGRESS";
    FFMessageType2["LOG"] = "LOG";
    FFMessageType2["MOUNT"] = "MOUNT";
    FFMessageType2["UNMOUNT"] = "UNMOUNT";
  })(FFMessageType || (FFMessageType = {}));

  // node_modules/@ffmpeg/ffmpeg/dist/esm/utils.js
  var getMessageID = /* @__PURE__ */ (() => {
    let messageID = 0;
    return () => messageID++;
  })();

  // node_modules/@ffmpeg/ffmpeg/dist/esm/errors.js
  var ERROR_UNKNOWN_MESSAGE_TYPE = new Error("unknown message type");
  var ERROR_NOT_LOADED = new Error("ffmpeg is not loaded, call `await ffmpeg.load()` first");
  var ERROR_TERMINATED = new Error("called FFmpeg.terminate()");
  var ERROR_IMPORT_FAILURE = new Error("failed to import ffmpeg-core.js");

  // node_modules/@ffmpeg/ffmpeg/dist/esm/classes.js
  var import_meta = {};
  var FFmpeg = class {
    #worker = null;
    /**
     * #resolves and #rejects tracks Promise resolves and rejects to
     * be called when we receive message from web worker.
     */
    #resolves = {};
    #rejects = {};
    #logEventCallbacks = [];
    #progressEventCallbacks = [];
    loaded = false;
    /**
     * register worker message event handlers.
     */
    #registerHandlers = () => {
      if (this.#worker) {
        this.#worker.onmessage = ({ data: { id, type, data } }) => {
          switch (type) {
            case FFMessageType.LOAD:
              this.loaded = true;
              this.#resolves[id](data);
              break;
            case FFMessageType.MOUNT:
            case FFMessageType.UNMOUNT:
            case FFMessageType.EXEC:
            case FFMessageType.FFPROBE:
            case FFMessageType.WRITE_FILE:
            case FFMessageType.READ_FILE:
            case FFMessageType.DELETE_FILE:
            case FFMessageType.RENAME:
            case FFMessageType.CREATE_DIR:
            case FFMessageType.LIST_DIR:
            case FFMessageType.DELETE_DIR:
              this.#resolves[id](data);
              break;
            case FFMessageType.LOG:
              this.#logEventCallbacks.forEach((f) => f(data));
              break;
            case FFMessageType.PROGRESS:
              this.#progressEventCallbacks.forEach((f) => f(data));
              break;
            case FFMessageType.ERROR:
              this.#rejects[id](data);
              break;
          }
          delete this.#resolves[id];
          delete this.#rejects[id];
        };
      }
    };
    /**
     * Generic function to send messages to web worker.
     */
    #send = ({ type, data }, trans = [], signal) => {
      if (!this.#worker) {
        return Promise.reject(ERROR_NOT_LOADED);
      }
      return new Promise((resolve, reject) => {
        const id = getMessageID();
        this.#worker && this.#worker.postMessage({ id, type, data }, trans);
        this.#resolves[id] = resolve;
        this.#rejects[id] = reject;
        signal?.addEventListener("abort", () => {
          reject(new DOMException(`Message # ${id} was aborted`, "AbortError"));
        }, { once: true });
      });
    };
    on(event, callback) {
      if (event === "log") {
        this.#logEventCallbacks.push(callback);
      } else if (event === "progress") {
        this.#progressEventCallbacks.push(callback);
      }
    }
    off(event, callback) {
      if (event === "log") {
        this.#logEventCallbacks = this.#logEventCallbacks.filter((f) => f !== callback);
      } else if (event === "progress") {
        this.#progressEventCallbacks = this.#progressEventCallbacks.filter((f) => f !== callback);
      }
    }
    /**
     * Loads ffmpeg-core inside web worker. It is required to call this method first
     * as it initializes WebAssembly and other essential variables.
     *
     * @category FFmpeg
     * @returns `true` if ffmpeg core is loaded for the first time.
     */
    load = ({ classWorkerURL, ...config } = {}, { signal } = {}) => {
      if (!this.#worker) {
        this.#worker = classWorkerURL ? new Worker(new URL(classWorkerURL, import_meta.url), {
          type: "module"
        }) : (
          // We need to duplicated the code here to enable webpack
          // to bundle worekr.js here.
          new Worker(new URL("./worker.js", import_meta.url), {
            type: "module"
          })
        );
        this.#registerHandlers();
      }
      return this.#send({
        type: FFMessageType.LOAD,
        data: config
      }, void 0, signal);
    };
    /**
     * Execute ffmpeg command.
     *
     * @remarks
     * To avoid common I/O issues, ["-nostdin", "-y"] are prepended to the args
     * by default.
     *
     * @example
     * ```ts
     * const ffmpeg = new FFmpeg();
     * await ffmpeg.load();
     * await ffmpeg.writeFile("video.avi", ...);
     * // ffmpeg -i video.avi video.mp4
     * await ffmpeg.exec(["-i", "video.avi", "video.mp4"]);
     * const data = ffmpeg.readFile("video.mp4");
     * ```
     *
     * @returns `0` if no error, `!= 0` if timeout (1) or error.
     * @category FFmpeg
     */
    exec = (args, timeout = -1, { signal } = {}) => this.#send({
      type: FFMessageType.EXEC,
      data: { args, timeout }
    }, void 0, signal);
    /**
     * Execute ffprobe command.
     *
     * @example
     * ```ts
     * const ffmpeg = new FFmpeg();
     * await ffmpeg.load();
     * await ffmpeg.writeFile("video.avi", ...);
     * // Getting duration of a video in seconds: ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 video.avi -o output.txt
     * await ffmpeg.ffprobe(["-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", "video.avi", "-o", "output.txt"]);
     * const data = ffmpeg.readFile("output.txt");
     * ```
     *
     * @returns `0` if no error, `!= 0` if timeout (1) or error.
     * @category FFmpeg
     */
    ffprobe = (args, timeout = -1, { signal } = {}) => this.#send({
      type: FFMessageType.FFPROBE,
      data: { args, timeout }
    }, void 0, signal);
    /**
     * Terminate all ongoing API calls and terminate web worker.
     * `FFmpeg.load()` must be called again before calling any other APIs.
     *
     * @category FFmpeg
     */
    terminate = () => {
      const ids = Object.keys(this.#rejects);
      for (const id of ids) {
        this.#rejects[id](ERROR_TERMINATED);
        delete this.#rejects[id];
        delete this.#resolves[id];
      }
      if (this.#worker) {
        this.#worker.terminate();
        this.#worker = null;
        this.loaded = false;
      }
    };
    /**
     * Write data to ffmpeg.wasm.
     *
     * @example
     * ```ts
     * const ffmpeg = new FFmpeg();
     * await ffmpeg.load();
     * await ffmpeg.writeFile("video.avi", await fetchFile("../video.avi"));
     * await ffmpeg.writeFile("text.txt", "hello world");
     * ```
     *
     * @category File System
     */
    writeFile = (path, data, { signal } = {}) => {
      const trans = [];
      if (data instanceof Uint8Array) {
        trans.push(data.buffer);
      }
      return this.#send({
        type: FFMessageType.WRITE_FILE,
        data: { path, data }
      }, trans, signal);
    };
    mount = (fsType, options, mountPoint) => {
      const trans = [];
      return this.#send({
        type: FFMessageType.MOUNT,
        data: { fsType, options, mountPoint }
      }, trans);
    };
    unmount = (mountPoint) => {
      const trans = [];
      return this.#send({
        type: FFMessageType.UNMOUNT,
        data: { mountPoint }
      }, trans);
    };
    /**
     * Read data from ffmpeg.wasm.
     *
     * @example
     * ```ts
     * const ffmpeg = new FFmpeg();
     * await ffmpeg.load();
     * const data = await ffmpeg.readFile("video.mp4");
     * ```
     *
     * @category File System
     */
    readFile = (path, encoding = "binary", { signal } = {}) => this.#send({
      type: FFMessageType.READ_FILE,
      data: { path, encoding }
    }, void 0, signal);
    /**
     * Delete a file.
     *
     * @category File System
     */
    deleteFile = (path, { signal } = {}) => this.#send({
      type: FFMessageType.DELETE_FILE,
      data: { path }
    }, void 0, signal);
    /**
     * Rename a file or directory.
     *
     * @category File System
     */
    rename = (oldPath, newPath, { signal } = {}) => this.#send({
      type: FFMessageType.RENAME,
      data: { oldPath, newPath }
    }, void 0, signal);
    /**
     * Create a directory.
     *
     * @category File System
     */
    createDir = (path, { signal } = {}) => this.#send({
      type: FFMessageType.CREATE_DIR,
      data: { path }
    }, void 0, signal);
    /**
     * List directory contents.
     *
     * @category File System
     */
    listDir = (path, { signal } = {}) => this.#send({
      type: FFMessageType.LIST_DIR,
      data: { path }
    }, void 0, signal);
    /**
     * Delete an empty directory.
     *
     * @category File System
     */
    deleteDir = (path, { signal } = {}) => this.#send({
      type: FFMessageType.DELETE_DIR,
      data: { path }
    }, void 0, signal);
  };

  // node_modules/@ffmpeg/ffmpeg/dist/esm/types.js
  var FFFSType;
  (function(FFFSType2) {
    FFFSType2["MEMFS"] = "MEMFS";
    FFFSType2["NODEFS"] = "NODEFS";
    FFFSType2["NODERAWFS"] = "NODERAWFS";
    FFFSType2["IDBFS"] = "IDBFS";
    FFFSType2["WORKERFS"] = "WORKERFS";
    FFFSType2["PROXYFS"] = "PROXYFS";
  })(FFFSType || (FFFSType = {}));

  // node_modules/@ffmpeg/util/dist/esm/errors.js
  var ERROR_RESPONSE_BODY_READER = new Error("failed to get response body reader");
  var ERROR_INCOMPLETED_DOWNLOAD = new Error("failed to complete download");

  // node_modules/@ffmpeg/util/dist/esm/const.js
  var HeaderContentLength = "Content-Length";

  // node_modules/@ffmpeg/util/dist/esm/index.js
  var readFromBlobOrFile = (blob) => new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const { result } = fileReader;
      if (result instanceof ArrayBuffer) {
        resolve(new Uint8Array(result));
      } else {
        resolve(new Uint8Array());
      }
    };
    fileReader.onerror = (event) => {
      reject(Error(`File could not be read! Code=${event?.target?.error?.code || -1}`));
    };
    fileReader.readAsArrayBuffer(blob);
  });
  var fetchFile = async (file) => {
    let data;
    if (typeof file === "string") {
      if (/data:_data\/([a-zA-Z]*);base64,([^"]*)/.test(file)) {
        data = atob(file.split(",")[1]).split("").map((c) => c.charCodeAt(0));
      } else {
        data = await (await fetch(file)).arrayBuffer();
      }
    } else if (file instanceof URL) {
      data = await (await fetch(file)).arrayBuffer();
    } else if (file instanceof File || file instanceof Blob) {
      data = await readFromBlobOrFile(file);
    } else {
      return new Uint8Array();
    }
    return new Uint8Array(data);
  };
  var downloadWithProgress = async (url, cb) => {
    const resp = await fetch(url);
    let buf;
    try {
      const total = parseInt(resp.headers.get(HeaderContentLength) || "-1");
      const reader = resp.body?.getReader();
      if (!reader)
        throw ERROR_RESPONSE_BODY_READER;
      const chunks = [];
      let received = 0;
      for (; ; ) {
        const { done, value } = await reader.read();
        const delta = value ? value.length : 0;
        if (done) {
          if (total != -1 && total !== received)
            throw ERROR_INCOMPLETED_DOWNLOAD;
          cb && cb({ url, total, received, delta, done });
          break;
        }
        chunks.push(value);
        received += delta;
        cb && cb({ url, total, received, delta, done });
      }
      const data = new Uint8Array(received);
      let position = 0;
      for (const chunk of chunks) {
        data.set(chunk, position);
        position += chunk.length;
      }
      buf = data.buffer;
    } catch (e) {
      console.log(`failed to send download progress event: `, e);
      buf = await resp.arrayBuffer();
      cb && cb({
        url,
        total: buf.byteLength,
        received: buf.byteLength,
        delta: 0,
        done: true
      });
    }
    return buf;
  };
  var toBlobURL = async (url, mimeType, progress = false, cb) => {
    const buf = progress ? await downloadWithProgress(url, cb) : await (await fetch(url)).arrayBuffer();
    const blob = new Blob([buf], { type: mimeType });
    return URL.createObjectURL(blob);
  };

  // src/plugins/utils/ffmpeg-frame-extractor.ts
  var FFmpegFrameExtractor = class {
    constructor() {
      this.ffmpeg = null;
      this.loadPromise = null;
      this.frames = /* @__PURE__ */ new Map();
      this.videoInfo = null;
      this.isDestroyed = false;
      this.extractionAbortController = null;
    }
    /**
     * Load FFmpeg WASM asynchronously.
     * Call this before any other operations.
     */
    async load(onProgress) {
      if (this.ffmpeg) {
        return;
      }
      if (this.loadPromise) {
        return this.loadPromise;
      }
      this.loadPromise = this._load(onProgress);
      return this.loadPromise;
    }
    async _load(onProgress) {
      const hasSharedArrayBuffer = typeof SharedArrayBuffer !== "undefined";
      console.log(`SharedArrayBuffer available: ${hasSharedArrayBuffer}`);
      if (!hasSharedArrayBuffer) {
        console.warn(
          "SharedArrayBuffer not available. FFmpeg may not work correctly.\nTo enable, add these headers to your server:\n  Cross-Origin-Embedder-Policy: require-corp\n  Cross-Origin-Opener-Policy: same-origin"
        );
      }
      this.ffmpeg = new FFmpeg();
      this.ffmpeg.on("log", ({ message }) => {
        console.log("FFmpeg:", message);
        this.parseFFmpegLog(message);
      });
      this.ffmpeg.on("progress", ({ progress }) => {
        console.log("FFmpeg progress:", progress);
        onProgress?.({
          loaded: progress,
          total: 1,
          phase: "extracting"
        });
      });
      onProgress?.({
        loaded: 0,
        total: 1,
        phase: "loading"
      });
      const coreBaseURL = "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm";
      const ffmpegBaseURL = "https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.15/dist/esm";
      const workerResponse = await fetch(`${ffmpegBaseURL}/worker.js`);
      let workerCode = await workerResponse.text();
      workerCode = workerCode.replace(
        /from\s*["']\.\/([^"']+)["']/g,
        `from "${ffmpegBaseURL}/$1"`
      );
      workerCode = workerCode.replace(
        /import\s*["']\.\/([^"']+)["']/g,
        `import "${ffmpegBaseURL}/$1"`
      );
      const workerBlob = new Blob([workerCode], { type: "text/javascript" });
      const classWorkerURL = URL.createObjectURL(workerBlob);
      onProgress?.({
        loaded: 0.25,
        total: 1,
        phase: "loading"
      });
      const coreURL = await toBlobURL(
        `${coreBaseURL}/ffmpeg-core.js`,
        "text/javascript"
      );
      onProgress?.({
        loaded: 0.5,
        total: 1,
        phase: "loading"
      });
      const wasmURL = await toBlobURL(
        `${coreBaseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      );
      onProgress?.({
        loaded: 0.75,
        total: 1,
        phase: "loading"
      });
      await this.ffmpeg.load({
        coreURL,
        wasmURL,
        classWorkerURL
      });
      onProgress?.({
        loaded: 1,
        total: 1,
        phase: "loading"
      });
    }
    /**
     * Check if FFmpeg is loaded and ready.
     */
    isLoaded() {
      return this.ffmpeg !== null;
    }
    parseFFmpegLog(message) {
      const fpsMatch = message.match(/(\d+(?:\.\d+)?)\s*fps/);
      if (fpsMatch && this.videoInfo) {
        const fps = parseFloat(fpsMatch[1]);
        if (fps > 0 && fps < 1e3) {
          this.videoInfo.fps = fps;
        }
      }
      if (this.videoInfo && this.videoInfo.fps === 25) {
        const tbrMatch = message.match(/(\d+(?:\.\d+)?)\s*tbr/);
        if (tbrMatch) {
          const tbr = parseFloat(tbrMatch[1]);
          if (tbr > 0 && tbr < 1e3) {
            this.videoInfo.fps = tbr;
          }
        }
      }
      const durationMatch = message.match(
        /Duration:\s*(\d{2}):(\d{2}):(\d{2})\.(\d+)/
      );
      if (durationMatch && this.videoInfo) {
        const hours = parseInt(durationMatch[1], 10);
        const minutes = parseInt(durationMatch[2], 10);
        const seconds = parseInt(durationMatch[3], 10);
        const centiseconds = parseInt(durationMatch[4], 10);
        this.videoInfo.duration = hours * 3600 + minutes * 60 + seconds + centiseconds / 100;
      }
      const dimensionMatch = message.match(/(\d{2,5})x(\d{2,5})/);
      if (dimensionMatch && this.videoInfo) {
        const width = parseInt(dimensionMatch[1], 10);
        const height = parseInt(dimensionMatch[2], 10);
        if (width > 0 && height > 0) {
          this.videoInfo.width = width;
          this.videoInfo.height = height;
        }
      }
    }
    /**
     * Probe video file to get metadata (FPS, duration, dimensions).
     * This is similar to running ffprobe.
     */
    async probe(videoSource) {
      await this.load();
      if (!this.ffmpeg) {
        throw new Error("FFmpeg not loaded");
      }
      this.videoInfo = {
        fps: 25,
        duration: 0,
        width: 0,
        height: 0,
        totalFrames: 0
      };
      let extension = "mp4";
      if (typeof videoSource !== "string" && videoSource.type) {
        const typeMap = {
          "video/mp4": "mp4",
          "video/webm": "webm",
          "video/quicktime": "mov",
          "video/x-msvideo": "avi",
          "video/x-matroska": "mkv",
          "video/ogg": "ogv"
        };
        extension = typeMap[videoSource.type] || "mp4";
      }
      const inputFileName = `input_probe.${extension}`;
      const fileData = typeof videoSource === "string" ? await fetchFile(videoSource) : await fetchFile(videoSource);
      await this.ffmpeg.writeFile(inputFileName, fileData);
      try {
        await this.ffmpeg.exec(["-i", inputFileName]);
      } catch {
      }
      try {
        await this.ffmpeg.deleteFile(inputFileName);
      } catch {
      }
      if (this.videoInfo.duration > 0 && this.videoInfo.fps > 0) {
        this.videoInfo.totalFrames = Math.round(
          this.videoInfo.duration * this.videoInfo.fps
        );
      }
      console.log("Probed video info:", this.videoInfo);
      return this.videoInfo;
    }
    /**
     * Extract all frames from video as ImageBitmap objects.
     * Uses chunked extraction to avoid WASM memory limits.
     *
     * @param videoSource - Video file as Blob or URL
     * @param options - Extraction options
     */
    async extractFrames(videoSource, options = {}) {
      await this.load(options.onProgress);
      if (!this.ffmpeg) {
        throw new Error("FFmpeg not loaded");
      }
      if (this.isDestroyed) {
        throw new Error("Extractor has been destroyed");
      }
      this.extractionAbortController = new AbortController();
      this.clearFrames();
      if (!this.videoInfo) {
        await this.probe(videoSource);
      }
      const fps = options.fps ?? this.videoInfo?.fps ?? 25;
      const format = options.format ?? "png";
      const totalFrames = options.endFrame ?? this.videoInfo?.totalFrames ?? 0;
      const startFrame = options.startFrame ?? 1;
      let extension = "mp4";
      if (typeof videoSource !== "string" && videoSource.type) {
        const typeMap = {
          "video/mp4": "mp4",
          "video/webm": "webm",
          "video/quicktime": "mov",
          "video/x-msvideo": "avi",
          "video/x-matroska": "mkv",
          "video/ogg": "ogv"
        };
        extension = typeMap[videoSource.type] || "mp4";
      }
      const inputFileName = `input.${extension}`;
      options.onProgress?.({
        loaded: 0,
        total: totalFrames,
        phase: "extracting"
      });
      const fileData = typeof videoSource === "string" ? await fetchFile(videoSource) : await fetchFile(videoSource);
      const fileSizeMB = fileData.byteLength / (1024 * 1024);
      console.log(`Video file size: ${fileSizeMB.toFixed(2)} MB`);
      if (fileSizeMB > 100) {
        throw new Error(
          `Video file too large (${fileSizeMB.toFixed(0)}MB). FFmpeg WASM has memory limits. Please use a smaller video file (<100MB).`
        );
      }
      await this.ffmpeg.writeFile(inputFileName, fileData);
      try {
        const writtenFile = await this.ffmpeg.readFile(inputFileName);
        const size = writtenFile instanceof Uint8Array ? writtenFile.byteLength : writtenFile.length;
        console.log(`Input file written: ${size} bytes`);
      } catch (e) {
        console.error("Failed to verify input file:", e);
      }
      const execWithTimeout = async (args, timeoutMs = 3e4) => {
        console.log("FFmpeg command:", args.join(" "));
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error(`FFmpeg timeout after ${timeoutMs}ms`)), timeoutMs);
        });
        await Promise.race([
          this.ffmpeg.exec(args),
          timeoutPromise
        ]);
      };
      console.log("Testing FFmpeg with single frame extraction (this may take a while for h264)...");
      const testFormat = format === "png" ? "png" : "jpg";
      try {
        const testArgs = [
          "-y",
          "-nostdin",
          "-i",
          inputFileName,
          "-frames:v",
          "1"
        ];
        if (testFormat === "jpg") {
          testArgs.push("-q:v", "8");
        }
        testArgs.push(`test_frame.${testFormat}`);
        await execWithTimeout(testArgs, 6e4);
        const testFrame = await this.ffmpeg.readFile(`test_frame.${testFormat}`);
        const testSize = testFrame instanceof Uint8Array ? testFrame.byteLength : testFrame.length;
        console.log(`Test frame extracted: ${testSize} bytes`);
        await this.ffmpeg.deleteFile(`test_frame.${testFormat}`);
      } catch (e) {
        console.error("Single frame test failed:", e);
        try {
          await this.ffmpeg.deleteFile(inputFileName);
        } catch {
        }
        throw new Error(`FFmpeg cannot process this video (h264 decoding may be too slow in WASM). Error: ${e}`);
      }
      const estimatedTime = Math.max(3e5, totalFrames * 2e3);
      console.log(`Extracting ${totalFrames} frames as ${format.toUpperCase()} at fps=${fps} (estimated timeout: ${(estimatedTime / 1e3).toFixed(0)}s)...`);
      const ffmpegArgs = [
        "-y",
        "-nostdin",
        "-i",
        inputFileName,
        "-vf",
        `fps=${fps}`
      ];
      if (format === "jpg") {
        ffmpegArgs.push("-q:v", "8");
      }
      ffmpegArgs.push(`frame_%06d.${format}`);
      try {
        await execWithTimeout(ffmpegArgs, estimatedTime);
      } catch (e) {
        console.error("Frame extraction failed:", e);
        try {
          await this.ffmpeg.deleteFile(inputFileName);
        } catch {
        }
        throw new Error(`Failed to extract frames: ${e}`);
      }
      let frameIndex = 1;
      while (!this.isDestroyed) {
        const frameFileName = `frame_${String(frameIndex).padStart(6, "0")}.${format}`;
        try {
          const frameData = await this.ffmpeg.readFile(frameFileName);
          if (frameData instanceof Uint8Array) {
            const blob = new Blob([frameData], {
              type: format === "png" ? "image/png" : "image/jpeg"
            });
            const imageBitmap = await createImageBitmap(blob);
            this.frames.set(frameIndex, imageBitmap);
            await this.ffmpeg.deleteFile(frameFileName);
            options.onProgress?.({
              loaded: frameIndex,
              total: totalFrames || frameIndex,
              phase: "processing"
            });
          }
          frameIndex++;
        } catch {
          break;
        }
      }
      console.log(`Extraction complete: ${this.frames.size} frames`);
      try {
        await this.ffmpeg.deleteFile(inputFileName);
      } catch {
      }
      this.extractionAbortController = null;
      return this.frames;
    }
    /**
     * Extract frames in chunks for memory efficiency.
     * Useful for long videos where loading all frames at once is not feasible.
     *
     * @param videoSource - Video file as Blob or URL
     * @param chunkSize - Number of frames per chunk
     * @param onChunk - Callback when a chunk is ready
     */
    async extractFramesInChunks(videoSource, chunkSize, onChunk, options = {}) {
      const info = await this.probe(videoSource);
      const totalFrames = info.totalFrames;
      const fps = options.fps ?? info.fps;
      for (let start = 1; start <= totalFrames; start += chunkSize) {
        if (this.isDestroyed) break;
        const end = Math.min(start + chunkSize - 1, totalFrames);
        this.clearFrames();
        await this.extractFrames(videoSource, {
          fps,
          startFrame: start,
          endFrame: end,
          onProgress: options.onProgress
        });
        onChunk(this.frames, start, end);
      }
    }
    /**
     * Get a specific frame by number.
     */
    getFrame(frameNumber) {
      return this.frames.get(frameNumber) ?? null;
    }
    /**
     * Check if a frame is available.
     */
    hasFrame(frameNumber) {
      return this.frames.has(frameNumber);
    }
    /**
     * Get all available frames.
     */
    getAllFrames() {
      return this.frames;
    }
    /**
     * Get video information (available after probe or extractFrames).
     */
    getVideoInfo() {
      return this.videoInfo;
    }
    /**
     * Get total number of extracted frames.
     */
    get frameCount() {
      return this.frames.size;
    }
    /**
     * Clear all extracted frames from memory.
     */
    clearFrames() {
      this.frames.forEach((frame) => frame.close());
      this.frames.clear();
    }
    /**
     * Abort any ongoing extraction.
     */
    abort() {
      this.extractionAbortController?.abort();
    }
    /**
     * Clean up all resources.
     */
    destroy() {
      this.isDestroyed = true;
      this.abort();
      this.clearFrames();
      this.ffmpeg?.terminate();
      this.ffmpeg = null;
      this.loadPromise = null;
      this.videoInfo = null;
    }
  };

  // src/index.ts
  AnnotationTool.prototype.initUI = initUI;
  AnnotationTool.prototype.initCanvas = initCanvas;
  AnnotationTool.prototype.addFrameSquareOverlay = addFrameSquareOverlay;
  AnnotationTool.prototype.addVideoOverlay = addVideoOverlay;
  AnnotationTool.prototype.addProgressBarOverlay = addProgressBarOverlay;

  // demo/index.ts
  new EventSource("/esbuild").addEventListener("change", () => location.reload());
  var ffmpegExtractor = null;
  var currentVideoBlob = null;
  var ffmpegLoading = false;
  var pendingVideoProcess = null;
  var video = document.querySelector("video");
  async function initAnnotator() {
    const blob = await fetch(video.currentSrc).then((r) => r.blob());
    const loadPromise = new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 250);
      video.addEventListener(
        "loadeddata",
        () => {
          resolve(true);
        },
        {
          once: true
        }
      );
    });
    const imageFrame = await fetch("./frame_29.png").then(async (r) => {
      const blob2 = await r.blob();
      const blobs = new Blob([blob2], { type: "image/png" });
      const img = new Image();
      const imageLoadPromise = new Promise((resolve) => {
        img.addEventListener(
          "load",
          () => {
            resolve(true);
          },
          {
            once: true
          }
        );
      });
      img.src = window.URL.createObjectURL(blobs);
      await imageLoadPromise;
      return img;
    });
    if (!video.paused) {
      video.pause();
    }
    const bl = new Blob([blob], { type: "video/mp4" });
    const tool = new AnnotationTool(video, {
      toolbar: { defaultTool: null }
    });
    await tool.setVideoBlob(bl, 30);
    await loadPromise;
    await tool.addReferenceVideoByURL("./mov_bbb_g.mp4");
    requestAnimationFrame(() => {
      tool.setCanvasSize();
    });
    tool.enableVideoFrameBuffer();
    console.log({ tool });
    tool.addShapesToFrame(29, [
      {
        type: "image",
        image: imageFrame,
        x: 0,
        y: 0,
        width: 1,
        height: 1,
        strokeStyle: "red",
        lineWidth: 2,
        fillStyle: "red"
      }
    ]);
    if (!video.paused) {
      video.pause();
    }
    setInterval(() => {
      tool.destroy();
      tool.init(video);
    }, 1e8);
    setInterval(() => {
      console.log(tool.saveAllFrames());
    }, 1e5);
    const fileInput = document.getElementById("file");
    const downloadButton = document.getElementById(
      "download"
    );
    const sampleButton = document.getElementById("sample");
    const videoInput = document.getElementById("video");
    const refVideoInput = document.getElementById(
      "ref-video"
    );
    videoInput.addEventListener("change", async (e) => {
      if (!videoInput.files || videoInput.files.length === 0) {
        return;
      }
      const file = videoInput.files[0];
      const blobs = new Blob([file], { type: file.type });
      currentVideoBlob = blobs;
      async function processVideo() {
        const ffmpegExtractBtnEl = document.getElementById("ffmpeg-extract");
        const ffmpegInfoEl = document.getElementById("ffmpeg-info");
        const ffmpegFpsEl = document.getElementById("ffmpeg-fps");
        const ffmpegFramesEl = document.getElementById("ffmpeg-frames");
        const ffmpegStatusEl = document.getElementById("ffmpeg-status");
        ffmpegExtractBtnEl.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="2" width="20" height="20" rx="2"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
        Extract Frames
      `;
        if (ffmpegExtractor?.isLoaded()) {
          ffmpegExtractor.clearFrames();
        }
        tool.setFFmpegFrameExtractor(null);
        let detectedFps = 0;
        let fpsDetected = false;
        if (ffmpegExtractor?.isLoaded()) {
          try {
            ffmpegStatusEl.className = "ffmpeg-status loading";
            ffmpegStatusEl.querySelector(".status-text").textContent = "Probing video...";
            const info = await ffmpegExtractor.probe(blobs);
            detectedFps = info.fps;
            fpsDetected = info.fps > 0;
            ffmpegInfoEl.style.display = "flex";
            ffmpegFpsEl.textContent = `FPS: ${info.fps.toFixed(2)}`;
            ffmpegFramesEl.textContent = `Frames: ${info.totalFrames}`;
            ffmpegStatusEl.className = "ffmpeg-status ready";
            ffmpegStatusEl.querySelector(".status-text").textContent = "FFmpeg ready";
            console.log("Detected video info:", info);
          } catch (err) {
            console.error("Failed to probe video:", err);
            ffmpegStatusEl.className = "ffmpeg-status error";
            ffmpegStatusEl.querySelector(".status-text").textContent = "Probe failed";
          }
        }
        let fps;
        if (fpsDetected) {
          fps = detectedFps;
          console.log("Using detected FPS:", fps);
        } else {
          const fpsInput = prompt("Enter FPS", "30");
          if (!fpsInput) {
            return;
          }
          fps = parseInt(fpsInput, 10);
        }
        await tool.setVideoBlob(blobs, fps);
        if (ffmpegExtractor?.isLoaded()) {
          extractFrames();
        }
      }
      if (ffmpegLoading) {
        console.log("FFmpeg is loading, video will be processed when ready...");
        const ffmpegStatusEl = document.getElementById("ffmpeg-status");
        ffmpegStatusEl.querySelector(".status-text").textContent = "Loading FFmpeg... (video queued)";
        pendingVideoProcess = processVideo;
        return;
      }
      await processVideo();
    });
    refVideoInput.addEventListener("change", async (e) => {
      if (!refVideoInput.files || refVideoInput.files.length === 0) {
        return;
      }
      const fps = prompt("Enter FPS", "30");
      if (!fps) {
        return;
      }
      const file = refVideoInput.files[0];
      const blobs = new Blob([file], { type: file.type });
      const url = window.URL.createObjectURL(blobs);
      await tool.addReferenceVideoByURL(url, parseInt(fps, 10), file.type);
    });
    sampleButton.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      fetch("./annotations-sample.json").then((response) => response.json()).then((data) => {
        tool.loadAllFrames(data);
        tool.updateActiveTimeFrame();
        tool.redrawFullCanvas();
      });
    });
    fileInput.addEventListener("change", (e) => {
      if (!fileInput.files || fileInput.files.length === 0) {
        return;
      }
      const file = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = (e2) => {
        if (!e2.target) {
          return;
        }
        const data = e2.target.result;
        const dataObj = JSON.parse(data);
        const append = confirm("Append to existing annotations?");
        if (!append) {
          tool.loadAllFrames(dataObj);
        } else {
          tool.appendFrames(dataObj);
        }
        tool.updateActiveTimeFrame();
        tool.redrawFullCanvas();
      };
      reader.readAsText(file);
    });
    downloadButton.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      const data = tool.saveAllFrames();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(
        new Blob([JSON.stringify(data)], { type: "application/json" })
      );
      const prettyDate = (/* @__PURE__ */ new Date()).toISOString().replace(/:/g, "-");
      a.download = `annotations-${prettyDate}.json`;
      a.click();
    });
    const rvFileInput = document.getElementById("rv-file");
    const downloadRvButton = document.getElementById("download-rv");
    const rvScaleInput = document.getElementById("rv-scale");
    const rvScaleValue = document.getElementById("rv-scale-value");
    const rvOffsetXInput = document.getElementById("rv-offset-x");
    const rvOffsetXValue = document.getElementById("rv-offset-x-value");
    const rvOffsetYInput = document.getElementById("rv-offset-y");
    const rvOffsetYValue = document.getElementById("rv-offset-y-value");
    const rvResetButton = document.getElementById("rv-reset-transform");
    let lastRvFileContent = null;
    function reloadRvAnnotations() {
      if (!lastRvFileContent) return;
      const scale = parseFloat(rvScaleInput.value);
      const offsetX = parseFloat(rvOffsetXInput.value);
      const offsetY = parseFloat(rvOffsetYInput.value);
      const result = parseOpenRV(lastRvFileContent, {
        fps: tool.fps,
        targetHeight: tool.canvasHeight,
        coordinateScale: scale,
        // Invert offset so positive slider values move shapes right/down
        coordinateOffset: { x: -offsetX, y: -offsetY }
      });
      tool.loadAllFrames(result.frames);
      tool.updateActiveTimeFrame();
      tool.redrawFullCanvas();
    }
    rvScaleInput.addEventListener("input", () => {
      rvScaleValue.textContent = rvScaleInput.value;
      reloadRvAnnotations();
    });
    rvOffsetXInput.addEventListener("input", () => {
      rvOffsetXValue.textContent = rvOffsetXInput.value;
      reloadRvAnnotations();
    });
    rvOffsetYInput.addEventListener("input", () => {
      rvOffsetYValue.textContent = rvOffsetYInput.value;
      reloadRvAnnotations();
    });
    rvResetButton.addEventListener("click", () => {
      rvScaleInput.value = "0.85";
      rvScaleValue.textContent = "0.85";
      rvOffsetXInput.value = "0";
      rvOffsetXValue.textContent = "0";
      rvOffsetYInput.value = "0";
      rvOffsetYValue.textContent = "0";
      reloadRvAnnotations();
    });
    rvFileInput.addEventListener("change", async (e) => {
      if (!rvFileInput.files || rvFileInput.files.length === 0) {
        return;
      }
      const file = rvFileInput.files[0];
      try {
        lastRvFileContent = await file.text();
        const scale = parseFloat(rvScaleInput.value);
        const offsetX = parseFloat(rvOffsetXInput.value);
        const offsetY = parseFloat(rvOffsetYInput.value);
        const result = parseOpenRV(lastRvFileContent, {
          fps: tool.fps,
          targetHeight: tool.canvasHeight,
          coordinateScale: scale,
          // Invert offset so positive slider values move shapes right/down
          coordinateOffset: { x: -offsetX, y: -offsetY },
          debug: true
        });
        console.log("RV file dimensions:", result.dimensions);
        console.log("Demo video dimensions:", video.videoWidth, "x", video.videoHeight);
        console.log("Canvas dimensions:", tool.canvasWidth, "x", tool.canvasHeight);
        const append = confirm("Append to existing annotations?");
        if (!append) {
          tool.loadAllFrames(result.frames);
        } else {
          tool.appendFrames(result.frames);
        }
        tool.updateActiveTimeFrame();
        tool.redrawFullCanvas();
        const annotatedFrames = result.frames.map((f) => f.frame);
        console.log(`Loaded ${result.frames.length} annotated frames:`, annotatedFrames);
        if (result.frames.length > 0) {
          console.log("First frame shapes:", result.frames[0].shapes);
        }
        if (result.mediaPath) {
          console.log("OpenRV media path:", result.mediaPath);
        }
      } catch (err) {
        console.error("Failed to parse OpenRV file:", err);
        alert("Failed to parse OpenRV file. Check console for details.");
      }
    });
    downloadRvButton.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      const frames = tool.saveAllFrames();
      if (frames.length === 0) {
        alert("No annotations to export.");
        return;
      }
      const prettyDate = (/* @__PURE__ */ new Date()).toISOString().replace(/:/g, "-");
      downloadAsOpenRV(
        frames,
        {
          mediaPath: video.currentSrc || "video.mp4",
          width: tool.canvasWidth || 1920,
          height: tool.canvasHeight || 1080,
          sessionName: `sm-annotate-${prettyDate}`
        },
        `annotations-${prettyDate}.rv`
      );
    });
    const layoutButtons = document.querySelectorAll(".layout-btn");
    const layoutLabel = document.getElementById("layout-label");
    const layoutLabels = {
      horizontal: "Horizontal (default)",
      vertical: "Vertical Sidebar",
      minimal: "Minimal / Floating",
      "bottom-dock": "Bottom Dock"
    };
    layoutButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const button = e.currentTarget;
        const layout = button.dataset.layout;
        layoutButtons.forEach((b2) => b2.classList.remove("active"));
        button.classList.add("active");
        if (layoutLabel) {
          layoutLabel.textContent = layoutLabels[layout];
        }
        tool.setLayout(layout);
        requestAnimationFrame(() => {
          tool.setCanvasSize();
        });
      });
    });
    const ffmpegLoadBtn = document.getElementById("ffmpeg-load");
    const ffmpegExtractBtn = document.getElementById("ffmpeg-extract");
    const ffmpegStatus = document.getElementById("ffmpeg-status");
    const ffmpegProgress = document.getElementById("ffmpeg-progress");
    const ffmpegProgressFill = document.getElementById("ffmpeg-progress-fill");
    const ffmpegProgressText = document.getElementById("ffmpeg-progress-text");
    const ffmpegInfo = document.getElementById("ffmpeg-info");
    const ffmpegFps = document.getElementById("ffmpeg-fps");
    const ffmpegFrames = document.getElementById("ffmpeg-frames");
    function updateFFmpegStatus(status, text) {
      ffmpegStatus.className = `ffmpeg-status ${status}`;
      ffmpegStatus.querySelector(".status-text").textContent = text;
    }
    function updateProgress(percent) {
      ffmpegProgress.style.display = "flex";
      ffmpegProgressFill.style.width = `${percent}%`;
      ffmpegProgressText.textContent = `${Math.round(percent)}%`;
    }
    function hideProgress() {
      ffmpegProgress.style.display = "none";
    }
    currentVideoBlob = bl;
    async function loadFFmpeg() {
      if (ffmpegExtractor?.isLoaded() || ffmpegLoading) {
        return;
      }
      ffmpegLoading = true;
      ffmpegLoadBtn.disabled = true;
      updateFFmpegStatus("loading", "Loading FFmpeg...");
      updateProgress(0);
      try {
        ffmpegExtractor = new FFmpegFrameExtractor();
        await ffmpegExtractor.load((progress) => {
          if (progress.phase === "loading") {
            updateProgress(progress.loaded * 100);
          }
        });
        ffmpegLoading = false;
        updateFFmpegStatus("ready", "FFmpeg ready");
        hideProgress();
        ffmpegExtractBtn.disabled = false;
        ffmpegLoadBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        FFmpeg Loaded
      `;
        if (currentVideoBlob) {
          const info = await ffmpegExtractor.probe(currentVideoBlob);
          ffmpegInfo.style.display = "flex";
          ffmpegFps.textContent = `FPS: ${info.fps.toFixed(2)}`;
          ffmpegFrames.textContent = `Frames: ${info.totalFrames}`;
          console.log("Video info from FFmpeg:", info);
        }
        if (pendingVideoProcess) {
          const process = pendingVideoProcess;
          pendingVideoProcess = null;
          await process();
        }
      } catch (error) {
        console.error("Failed to load FFmpeg:", error);
        ffmpegLoading = false;
        const isNetworkError = error instanceof TypeError || error instanceof Error && (error.message.includes("fetch") || error.message.includes("network") || error.message.includes("Failed to load"));
        if (isNetworkError) {
          updateFFmpegStatus("error", "Network error - click to retry");
          ffmpegLoadBtn.disabled = false;
        } else {
          updateFFmpegStatus("error", "Failed to load");
        }
        hideProgress();
        if (pendingVideoProcess) {
          const process = pendingVideoProcess;
          pendingVideoProcess = null;
          await process();
        }
      }
    }
    loadFFmpeg();
    ffmpegLoadBtn.addEventListener("click", loadFFmpeg);
    async function extractFrames() {
      if (!ffmpegExtractor?.isLoaded() || !currentVideoBlob) {
        console.warn("Cannot extract frames: FFmpeg not loaded or no video.");
        return;
      }
      ffmpegExtractBtn.disabled = true;
      updateFFmpegStatus("extracting", "Extracting frames...");
      updateProgress(0);
      try {
        const startTime = performance.now();
        const frames = await ffmpegExtractor.extractFrames(currentVideoBlob, {
          format: "png",
          onProgress: (progress) => {
            const percent = progress.total > 0 ? progress.loaded / progress.total * 100 : 0;
            updateProgress(percent);
            updateFFmpegStatus("extracting", `Extracting frame ${progress.loaded}...`);
          }
        });
        const elapsed = ((performance.now() - startTime) / 1e3).toFixed(2);
        console.log(`Extracted ${frames.size} frames in ${elapsed}s`);
        updateFFmpegStatus("ready", `${frames.size} frames extracted`);
        hideProgress();
        ffmpegExtractBtn.disabled = false;
        ffmpegExtractBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="2" width="20" height="20" rx="2"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
        Re-extract (${frames.size} frames)
      `;
        const info = ffmpegExtractor.getVideoInfo();
        if (info) {
          ffmpegFps.textContent = `FPS: ${info.fps.toFixed(2)}`;
          ffmpegFrames.textContent = `Frames: ${frames.size}`;
        }
        tool.setFFmpegFrameExtractor(ffmpegExtractor);
        console.log("FFmpeg frames connected to annotation tool");
        console.log("FFmpeg extracted frames:", frames);
        console.log("Frame 1:", frames.get(1));
      } catch (error) {
        console.error("Failed to extract frames:", error);
        updateFFmpegStatus("error", "Extraction failed");
        hideProgress();
        ffmpegExtractBtn.disabled = false;
      }
    }
    ffmpegExtractBtn.addEventListener("click", extractFrames);
    let resizeTimeout;
    window.addEventListener("resize", () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      resizeTimeout = window.setTimeout(() => {
        tool.setCanvasSize();
      }, 100);
    });
  }
  if (video.readyState === 0) {
    video.addEventListener(
      "loadedmetadata",
      () => {
        requestAnimationFrame(() => {
          initAnnotator();
        });
      },
      { once: true }
    );
  } else {
    initAnnotator();
  }
})();
