#!/bin/bash

cordova build --release android
a='./platforms/android/build/outputs/apk/android-release-unsigned.apk'

jarsigner -verbose -keystore my-release-key.keystore "$a" alias_name

echo "Checking if APK is verified..."
jarsigner -verify "$a"

rm app.apk
zipalign -v 4 $a "app.apk"
