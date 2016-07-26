cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com-dileepindia-cordova-sms/www/SMS.js",
        "id": "com-dileepindia-cordova-sms.SMS",
        "clobbers": [
            "window.SMS"
        ]
    },
    {
        "file": "plugins/com.cordova.plugins.sms/www/sms.js",
        "id": "com.cordova.plugins.sms.Sms",
        "clobbers": [
            "window.sms"
        ]
    },
    {
        "file": "plugins/cordova-plugin-device/www/device.js",
        "id": "cordova-plugin-device.device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/cordova-plugin-background-mode/www/background-mode.js",
        "id": "cordova-plugin-background-mode.BackgroundMode",
        "clobbers": [
            "cordova.plugins.backgroundMode",
            "plugin.backgroundMode"
        ]
    },
    {
        "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
        "id": "cordova-plugin-inappbrowser.inappbrowser",
        "clobbers": [
            "cordova.InAppBrowser.open",
            "window.open"
        ]
    },
    {
        "file": "plugins/cordova-plugin-sim/www/sim.js",
        "id": "cordova-plugin-sim.Sim",
        "clobbers": [
            "window.plugins.sim"
        ]
    },
    {
        "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
        "id": "cordova-plugin-splashscreen.SplashScreen",
        "clobbers": [
            "navigator.splashscreen"
        ]
    },
    {
        "file": "plugins/cordova-plugin-whitelist/whitelist.js",
        "id": "cordova-plugin-whitelist.whitelist",
        "runs": true
    },
    {
        "file": "plugins/org.apache.cordova.network-information/www/network.js",
        "id": "org.apache.cordova.network-information.network",
        "clobbers": [
            "navigator.connection",
            "navigator.network.connection"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.network-information/www/Connection.js",
        "id": "org.apache.cordova.network-information.Connection",
        "clobbers": [
            "Connection"
        ]
    },
    {
        "file": "plugins/com.red_folder.phonegap.plugin.backgroundservice/www/backgroundService.js",
        "id": "com.red_folder.phonegap.plugin.backgroundservice.BackgroundService"
    },
    {
        "file": "plugins/at.gofg.sportscomputer.powermanagement/www/powermanagement.js",
        "id": "at.gofg.sportscomputer.powermanagement.device",
        "clobbers": [
            "window.powerManagement"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com-dileepindia-cordova-sms": "1.0.1",
    "com.cordova.plugins.sms": "0.1.6",
    "cordova-plugin-device": "1.0.2-dev",
    "cordova-plugin-background-mode": "0.6.5",
    "cordova-plugin-inappbrowser": "1.4.0",
    "cordova-plugin-sim": "1.2.0",
    "cordova-plugin-splashscreen": "3.1.0",
    "cordova-plugin-whitelist": "1.2.1",
    "org.apache.cordova.console": "0.2.13",
    "org.apache.cordova.network-information": "0.2.15",
    "com.red_folder.phonegap.plugin.backgroundservice": "2.0.0",
    "at.gofg.sportscomputer.powermanagement": "1.1.0"
};
// BOTTOM OF METADATA
});