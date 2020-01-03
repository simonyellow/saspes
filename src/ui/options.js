/**
 *
 * @copyright Copyright (c) 2018-2020 Gary Kim <gary@garykim.dev>
 *
 * @author Gary Kim <gary@garykim.dev>
 *
 * @license GNU AGPL version 3 only
 *
 * SAS Powerschool Enhancement Suite - A browser extension to improve the experience of SAS Powerschool.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

'use strict';

const browser = require('webextension-polyfill');

var analyticsid = "";

window.addEventListener("load", main, false);
function main () {
    browser.runtime.sendMessage({ action: "analytics_send", args: { url: "saspes://options", action: "Options Page" } });

    browser.storage.local.get({ analytics: true, percent_main_page: true, id: "Not set yet", save_grades_temp: true }).then(function (returned) {
        document.getElementById("analytics").checked = returned.analytics;
        document.getElementById("percent-mp").checked = returned.percent_main_page;
        document.getElementById("analytics-id").innerText = returned.id;
        analyticsid = returned.id;
    });
    document.getElementById("third-party-libraries").href = browser.extension.getURL("web_accessible_resources/libraries.txt");
    document.getElementById("analytics").addEventListener("click", function () {
        const value = document.getElementById("analytics").checked;
        if (!value) {
            browser.runtime.sendMessage({ action: "analytics_send", args: { url: "saspes://disableanalytics.options", action: "Options Page: Disable Analytics" } });
        }
        browser.storage.local.set({ analytics: value });
    });
    document.getElementById("percent-mp").addEventListener("click", function () {
        const value = document.getElementById("percent-mp").checked;
        browser.storage.local.set({ percent_main_page: value });
    });
    document.getElementById("source-code-link").addEventListener("click", (event) => {
        const href = event.currentTarget.getAttribute('href');
        browser.runtime.sendMessage({ action: "analytics_send", args: { url: href, extra: { link: href } } });
    });
    document.getElementById("website-link").addEventListener("click", (event) => {
        const href = event.currentTarget.getAttribute('href');
        browser.runtime.sendMessage({ action: "analytics_send", args: { url: href, extra: { link: href } } });
    });
    document.getElementById("copy-analytics-id").addEventListener("click", (event) => {
        const target = event.currentTarget;
        if (target.getAttribute("attr-pressed")) {
            return;
        }
        navigator.clipboard.writeText(analyticsid);
        target.innerText = "Copied!";
        target.setAttribute("attr-pressed", "true");
        setTimeout(() => {
            target.innerText = "Copy";
            target.removeAttribute("attr-pressed");
        }, 1500);
    });
}
