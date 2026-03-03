'use strict';

const path = require('path');
const { GUI, TABS } = require('./../js/gui');
const Settings = require('./../js/settings');
const i18n = require('./../js/localization');
const tabs = require('./../js/tabs');

TABS.monitoring = {};

TABS.monitoring.initialize = function (callback) {
    if (GUI.active_tab !== 'monitoring') {
        GUI.active_tab = 'monitoring';
    }

    GUI.load(path.join(__dirname, "monitoring.html"), Settings.processHtml(function() {
        i18n.localize();

        tabs.init($('.tab-monitoring'));

        const $osdContainer = $('#subtab-osd');
        const $sensorsContainer = $('#subtab-sensors');

        $osdContainer.load(path.join(__dirname, "osd.html"), function() {
            i18n.localize();

            if (TABS.osd && typeof TABS.osd.initializeAsSubtab === 'function') {
                TABS.osd.initializeAsSubtab(callback);
            } else {
                GUI.content_ready(callback);
            }
        });

        $sensorsContainer.load(path.join(__dirname, "sensors.html"), function() {
            i18n.localize();

            if (TABS.sensors && typeof TABS.sensors.initializeAsSubtab === 'function') {
                TABS.sensors.initializeAsSubtab(callback);
            } else {
                GUI.content_ready(callback);
            }
        });
    }));
};

TABS.monitoring.cleanup = function (callback) {
    
    if (TABS.osd && typeof TABS.osd.cleanup === 'function') {
        TABS.osd.cleanup();
    }

    if (TABS.sensors && typeof TABS.sensors.cleanup === 'function') {
        TABS.sensors.cleanup();
    }
    
    if (callback) {
        callback();
    }
};