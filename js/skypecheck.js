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
 * logic, should go to locallib.php. This will help to save some memory when
 * Moodle is performing actions across all modules.
 *
 * @package   mod_skype
 * @copyright 2011 Amr Hourani a.hourani@gmail.com
 * @copyright 2020 onwards AL Rachels (drachels@drachels.com)
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

//window.alert("1 Made it to the skypeCheck.js file.");

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

    //window.alert("2 Made it to the skypeCheck.js file. CantDetect = " + CantDetect + " activex = " + activex);

/**
 * Adds oopsPopup object.
 *
 * @returns false
 */
function oopsPopup() {

    //window.alert("1 Before the if and the navigator.language is = " + navigator.language + " navigator.language.indexOf('ja') is = " + navigator.language.indexOf('ja'));
    //window.alert("2 Still before the if and the navigator.systemLanguage is = " + navigator.systemLanguage + " navigator.systemLanguage.indexOf('ja') is = " + navigator.systemLanguage.indexOf('ja'));

    if ((navigator.language && navigator.language.indexOf("ja") != -1) ||
       + (navigator.systemLanguage && navigator.systemLanguage.indexOf("ja") != -1) ||
       + (navigator.userLanguage && navigator.userLanguage.indexOf("ja") != -1)) {
        //var URLtoOpen = "skype_not_found/oops.html";
        var URLtoOpen = "oops.php";

        //window.alert("In the if part.");

    } else {
        //var URLtoOpen = "skype_not_found/oops.html";
        var URLtoOpen = "oops.php";
        // Firefox is coming throught this else.
        //window.alert("In the else part and the URLtoOpen = " + URLtoOpen);

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

    //window.alert("3 Made it to the function skypeCheck, and CantDetect is = " + CantDetect + " !activex = " + !activex);


    if (CantDetect) {
        return true;
    } else if (!activex) {
        var skypeMime = navigator.mimeTypes["application/x-skype"];
        detected = true;

        //window.alert("4 Made it to the function skypeCheck, and in the elseif due to !activex = " + !activex + " and skypeMime = " + skypeMime);

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

    //window.alert("5 Made it to the function loadDetection. ");

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

    //window.alert("6 Made it to the function addDetection. ");

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