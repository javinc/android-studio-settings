cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com-dileepindia-cordova-sms/www/SMS.js",
        "id": "com-dileepindia-cordova-sms.SMS",
        "pluginId": "com-dileepindia-cordova-sms",
        "clobbers": [
            "window.SMS"
        ]
    },
    {
        "file": "plugins/com.cordova.plugins.sms/www/sms.js",
        "id": "com.cordova.plugins.sms.Sms",
        "pluginId": "com.cordova.plugins.sms",
        "clobbers": [
            "window.sms"
        ]
    },
    {
        "file": "plugins/cordova-plugin-device/www/device.js",
        "id": "cordova-plugin-device.device",
        "pluginId": "cordova-plugin-device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/cordova-plugin-device/src/browser/DeviceProxy.js",
        "id": "cordova-plugin-device.DeviceProxy",
        "pluginId": "cordova-plugin-device",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-sim/www/sim.js",
        "id": "cordova-plugin-sim.Sim",
        "pluginId": "cordova-plugin-sim",
        "clobbers": [
            "window.plugins.sim"
        ]
    },
    {
        "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
        "id": "cordova-plugin-splashscreen.SplashScreen",
        "pluginId": "cordova-plugin-splashscreen",
        "clobbers": [
            "navigator.splashscreen"
        ]
    },
    {
        "file": "plugins/cordova-plugin-splashscreen/src/browser/SplashScreenProxy.js",
        "id": "cordova-plugin-splashscreen.SplashScreenProxy",
        "pluginId": "cordova-plugin-splashscreen",
        "runs": true
    },
    {
        "file": "plugins/org.apache.cordova.network-information/www/network.js",
        "id": "org.apache.cordova.network-information.network",
        "pluginId": "org.apache.cordova.network-information",
        "clobbers": [
            "navigator.connection",
            "navigator.network.connection"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.network-information/www/Connection.js",
        "id": "org.apache.cordova.network-information.Connection",
        "pluginId": "org.apache.cordova.network-information",
        "clobbers": [
            "Connection"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.network-information/src/browser/NetworkProxy.js",
        "id": "org.apache.cordova.network-information.NetworkProxy",
        "pluginId": "org.apache.cordova.network-information",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
        "id": "cordova-plugin-inappbrowser.inappbrowser",
        "pluginId": "cordova-plugin-inappbrowser",
        "clobbers": [
            "cordova.InAppBrowser.open",
            "window.open"
        ]
    },
    {
        "file": "plugins/cordova-plugin-inappbrowser/src/browser/InAppBrowserProxy.js",
        "id": "cordova-plugin-inappbrowser.InAppBrowserProxy",
        "pluginId": "cordova-plugin-inappbrowser",
        "merges": [
            ""
        ]
    },
    {
        "file": "plugins/cordova-plugin-background-mode/www/background-mode.js",
        "id": "cordova-plugin-background-mode.BackgroundMode",
        "pluginId": "cordova-plugin-background-mode",
        "clobbers": [
            "cordova.plugins.backgroundMode",
            "plugin.backgroundMode"
        ]
    },
    {
        "file": "plugins/at.gofg.sportscomputer.powermanagement/www/powermanagement.js",
        "id": "at.gofg.sportscomputer.powermanagement.device",
        "pluginId": "at.gofg.sportscomputer.powermanagement",
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
    "cordova-plugin-sim": "1.2.0",
    "cordova-plugin-splashscreen": "3.1.0",
    "cordova-plugin-whitelist": "1.2.1",
    "org.apache.cordova.console": "0.2.13",
    "org.apache.cordova.network-information": "0.2.15",
    "cordova-plugin-inappbrowser": "1.4.0",
    "cordova-plugin-background-mode": "0.6.5",
    "at.gofg.sportscomputer.powermanagement": "1.1.0",
    "com.red_folder.phonegap.plugin.backgroundservice": "2.0.0"
}
// BOTTOM OF METADATA
});