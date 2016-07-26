SMSReader-II-Cordova-II-Plugin
Plugin to operate SMS, send / list / intercept / delete / restore.

How to Use?

Use the plugin with Cordova CLI:

cordova plugin add com.dileepindia.cordova.sms

Quick Start

    # create a demo project
    cordova create test1 com.dileepindia.test1 Test1
    cd test1
    cordova platform add android

    # now add plugin
    cordova plugin add com.dileepindia.cordova.sms

    # copy the demo file
    rm -r www/*; cp plugins/com.dileepindia.cordova.sms/test/* www/;

    # now build and run the demo in your device or emulator
    cordova prepare; 
    cordova run android; 

    # or import into Xcode / eclipse
API Overview
Methods

sendSMS(address(s), text, successCallback, failureCallback);
listSMS(filter, successCallback, failureCallback);
deleteSMS(filter, successCallback, failureCallback);

startWatch(successCallback, failureCallback);
stopWatch(successCallback, failureCallback);

enableIntercept(on_off, successCallback, failureCallback);
restoreSMS(msg_or_msgs, successCallback, failureCallback);

setOptions(options, successCallback, failureCallback);
Events

'onSMSArrive'

If you want use this plugin as private project contact us for full version with additional feature and complete API 
documentation.  http://www.dileepyadav.wordpress.com  [https://gitorious.org/0xdroid]


 [~>](https://github.com/floatinghotpot/cordova-plugin-sms/blob/master/docs/README.md)
 
