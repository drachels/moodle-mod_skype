// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.


/**
 * Library of interface functions and constants for module skype
 *
 * All the core Moodle functions, neeeded to allow the module to work
 * integrated in Moodle should be placed here.
 * All the skype specific functions, needed to implement all the module
 * logic, should go to classes files. This will help to save some memory when
 * Moodle is performing actions across all modules.
 *
 * @package   mod_skype
 * @copyright 2011 Amr Hourani a.hourani@gmail.com
 * @copyright 2020 onwards AL Rachels (drachels@drachels.com)
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

var sBrowser, sUsrAg = navigator.userAgent;

// The order matters here, and this may report false positives for unlisted browsers.

if (sUsrAg.indexOf("Firefox") > -1) {
  sBrowser = "Mozilla Firefox";
  // "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0"
} else if (sUsrAg.indexOf("SamsungBrowser") > -1) {
  sBrowser = "Samsung Internet";
  // "Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-G955F Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/9.4 Chrome/67.0.3396.87 Mobile Safari/537.36
} else if (sUsrAg.indexOf("Opera") > -1 || sUsrAg.indexOf("OPR") > -1) {
  sBrowser = "Opera";
  // "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 OPR/57.0.3098.106"
} else if (sUsrAg.indexOf("Trident") > -1) {
  sBrowser = "Microsoft Internet Explorer";
  // "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; Zoom 3.6.0; wbx 1.0.0; rv:11.0) like Gecko"
} else if (sUsrAg.indexOf("Edge") > -1) {
  sBrowser = "Microsoft Edge (Legacy)";
  // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299"
} else if (sUsrAg.indexOf("Edg") > -1) {
  sBrowser = "Microsoft Edge (Chromium)";
  // Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.64
} else if (sUsrAg.indexOf("Chrome") > -1) {
  sBrowser = "Google Chrome or Chromium";
  // "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/66.0.3359.181 Chrome/66.0.3359.181 Safari/537.36"
} else if (sUsrAg.indexOf("Safari") > -1) {
  sBrowser = "Apple Safari";
  // "Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0 Mobile/15E148 Safari/604.1 980x1306"
} else {
  sBrowser = "unknown";
}

var activex = ((navigator.userAgent.indexOf('Win') != -1) &&
              + (navigator.userAgent.indexOf('MSIE') != -1) &&
              + (parseInt(navigator.appVersion) >= 4));
//var CantDetect = '';
var CantDetect = ((navigator.userAgent.indexOf('Safari') != -1) ||
                 + (navigator.userAgent.indexOf('Opera') != -1));
var w,
    h,
    oopswindow,
    detected,
    isSkypeInstalled;

/**
 * Adds oopsPopup object.
 *
 * @returns false
 */
function oopsPopup() {
    if ((navigator.language && navigator.language.indexOf("ja") != -1) ||
       + (navigator.systemLanguage && navigator.systemLanguage.indexOf("ja") != -1) ||
       + (navigator.userLanguage && navigator.userLanguage.indexOf("ja") != -1)) {
        //var URLtoOpen = "skype_not_found/oops.html";
        var URLtoOpen = "oops.php";
    } else {
        var URLtoOpen = "oops.php";
    }
    var windowName = "ELA";
    var popW = 540, popH = 305;
    var scrollB = 'no';
    w = screen.availWidth;
    h = screen.availHeight;
    var leftPos = (w-popW)/2, topPos = (h-popH)/2;
    oopswindow = window.open(URLtoOpen, windowName,'width=' + popW
                                                + ', height=' + popH
                                                + ', scrollbars=' + scrollB
                                                + ', screenx=' + leftPos
                                                + ', screeny=' + topPos
                                                + ', top=' + topPos
                                                + ', left=' + leftPos);
    return false;
}

if (typeof (detected) == "undefined" && activex) {
    document.write(
        ['<script language="VBscript">',
        'Function isSkypeInstalled()',
        'on error resume next',
        'Set oSkype = CreateObject("Skype.Detection")',
        'isSkypeInstalled = IsObject(oSkype)',
        'Set oSkype = nothing',
        'End Function',
        '</script>'].join("\n")
    );
}

/**
 * Adds skypeCheck object.
 *
 * Executed when one of the four user buttons, Conference, Chat, Voicemail, or Contact is clicked.
 * @returns true If Skype is detected.
 * @returns oopsPopup If Skype is not detected.
 */
function skypeCheck() {
    if (CantDetect) {
        return true;
    } else if (!activex) {
        var skypeMime = navigator.mimeTypes["application/x-skype"];
        detected = true;
        if (typeof (skypeMime) == "object") {
            return true;
        } else {
            return oopsPopup();
        }
    } else {
        if (isSkypeInstalled()) {
            detected = true;
            return true;
        }
    }
    detected = true;
    return oopsPopup();
}

/**
 * Adds load detection object.
 *
 */
function loadDetection() {
    if (document.getElementById && document.getElementsByTagName) {
        if (window.addEventListener) {
            window.addEventListener('load', addDetection, false);
        } else if (window.attachEvent) {
            window.attachEvent('onload', addDetection);
        }
    }
}

/**
 * Adds add detection object.
 *
 * @returns skypeCheck
 */
function addDetection() {
    var pageLinks = document.getElementsByTagName("a");
    for (var i=0; i < pageLinks.length; i++) {
        if (pageLinks[i].childNodes[0] && pageLinks[i].childNodes[0].src) {
            if ((pageLinks[i].childNodes[0].src.indexOf('download.skype.com\/share\/skypebuttons') != -1 ||
                + pageLinks[i].childNodes[0].src.indexOf('mystatus.skype.com') != -1) &&
                + (typeof (pageLinks[i].onclick) == "undefined" ||
                + pageLinks[i].onclick === null)) {
                pageLinks[i].onclick = function sChk() {
                    return skypeCheck();
                }
            }
        }
    }
}

loadDetection();