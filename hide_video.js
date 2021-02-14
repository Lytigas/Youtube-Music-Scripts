// ==UserScript==
// @name        YTM Hide VIdeo
// @namespace   lyt.gs
// @match       *://music.youtube.com/*
// @grant       GM_registerMenuCommand
// @version     0.0
// @author      Lytigas
// @description Hide video on YT music
// @run-at      document-end
// @noframes
// @inject-into auto
// ==/UserScript==

const SHEET = document.styleSheets[0];
let YTMHVimageSrc = null;

function YTMHVremoveOldRule() {
    for (let idx = 0; idx < SHEET.cssRules.length; idx++) {
        let rule = SHEET.cssRules[idx];
        if (rule.cssText.startsWith(".html5-video-player::after")) {
            SHEET.removeRule(idx);
            break;
        }
    }
    YTMHVimageSrc = null;
}

function YTMHVupdateRule() {
    let src = document.querySelector("img.ytmusic-player-bar").src;
    src = src.replace(/sddefault\.jpg.*/, "maxresdefault.jpg");
    if (YTMHVimageSrc === src) {
        return;
    }
    let style = `
    .html5-video-player::after {
        content: " ";
        z-index: 200;
        display: block;
        position: absolute;
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;
        right: 0;
        background-image: url(${src});
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
    }
    `;
    YTMHVremoveOldRule();
    YTMHVimageSrc = src;
    SHEET.insertRule(style, 1);
}

let YTMHVinterval = null;
function YTMHVtoggle() {
    if (YTMHVinterval !== null) {
        clearInterval(YTMHVinterval);
        YTMHVinterval = null;
        YTMHVremoveOldRule();
        return;
    }
    YTMHVupdateRule();
    YTMHVinterval = setInterval(YTMHVupdateRule, 1000);
}

GM_registerMenuCommand("Toggle Hide Video", YTMHVtoggle)

// Default ON!
YTMHVtoggle();
