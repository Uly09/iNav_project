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

    // Загружаем основную структуру мониторинга
    GUI.load(path.join(__dirname, "monitoring.html"), Settings.processHtml(function() {
        i18n.localize();

        // Инициализируем механизм переключения подвкладок (как в pid_tuning)
        tabs.init($('.tab-monitoring'));

        // Определяем контейнер, куда будет загружен OSD
        const $osdContainer = $('#osd-subtab-container');

        // Загружаем контент OSD динамически
        $osdContainer.load(path.join(__dirname, "osd.html"), function() {
            // Локализация свежезагруженного контента
            i18n.localize();

            // Проверяем наличие логики OSD и запускаем её как подвкладку
            if (TABS.osd && typeof TABS.osd.initializeAsSubtab === 'function') {
                TABS.osd.initializeAsSubtab(callback);
            } else {
                // Если специфической функции нет, сообщаем GUI, что контент готов
                GUI.content_ready(callback);
            }
        });
    }));
};

TABS.monitoring.cleanup = function (callback) {
    // Очистка ресурсов OSD при переходе на другую вкладку
    if (TABS.osd && typeof TABS.osd.cleanup === 'function') {
        TABS.osd.cleanup();
    }
    
    if (callback) {
        callback();
    }
};