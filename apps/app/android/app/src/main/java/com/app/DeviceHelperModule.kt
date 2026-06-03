package com.app

import android.os.Build
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class DeviceHelperModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "DeviceHelper"
    }

    @ReactMethod
    fun getDeviceModel(promise: Promise) {
        try {
            val model = Build.MODEL
            val manufacturer = Build.MANUFACTURER
            promise.resolve("$manufacturer $model")
        } catch (e: Exception) {
            promise.reject("ERR_DEVICE_INFO", "Failed to retrieve device model", e)
        }
    }
}
