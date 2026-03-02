'use strict';

const path = require('path');
const { GUI, TABS } = require('./../js/gui');
const MSP = require('./../js/msp');
const MSPCodes = require('./../js/msp/MSPCodes');
const interval = require('./../js/intervals');
const i18n = require('./../js/localization');

TABS.monitoring = {
    activeSubtab: 'osd' // Храним текущую активную подвкладку
};

TABS.monitoring.initialize = function (callback) {
    const self = this;

    GUI.load(path.join(__dirname, "monitoring.html"), function() {
        $('.subtab__header_label').on('click', function () {
            const target = $(this).attr('for');
            
            $('.subtab__header_label').removeClass('subtab__header_label--current');
            $(this).addClass('subtab__header_label--current');

            $('.subtab__content').removeClass('subtab__content--current');
            $('#' + target).addClass('subtab__content--current');

            self.activeSubtab = target.replace('subtab-', '');
            
            handleSubtabChange(self.activeSubtab);
        });

        $('.refresh_btn a').on('click', function () {
            GUI.updateActivatedTab();
        });

        i18n.localize();
        handleSubtabChange(self.activeSubtab);
        GUI.content_ready(callback);
    });

    function handleSubtabChange(subtabId) {
        if (subtabId === 'sensors') {
            interval.add("monitoringSensors", updateSensors, 100);
        } else {
            interval.remove("monitoringSensors");
        }
    }

    function updateSensors() {
        MSP.send_message(MSPCodes.MSP_RAW_IMU, false, false, function (msg) {
            const data = msg.data;
        });
    }

    function updateUI(ax, ay, az, gx, gy, gz) {
        $('#stat-accel .value').text(`${ax}, ${ay}, ${az}`);
        $('#stat-gyro .value').text(`${gx}, ${gy}, ${gz}`);
    }
};

TABS.monitoring.cleanup = function (callback) {
    interval.remove("monitoringSensors");
    
    if (callback) {
        callback();
    }
};