package com.mahavyomastudio.shivcharcha

import android.app.WallpaperManager
import android.graphics.BitmapFactory
import android.os.Build
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.io.File
import java.io.InputStream
import java.net.URL

class WallpaperModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "WallpaperModule"
    }

    @ReactMethod
    fun setWallpaper(imageUriOrUrl: String, destination: String, promise: Promise) {
        Thread {
            try {
                val context = reactApplicationContext
                val wallpaperManager = WallpaperManager.getInstance(context)

                val bitmap = if (imageUriOrUrl.startsWith("http://") || imageUriOrUrl.startsWith("https://")) {
                    val url = URL(imageUriOrUrl)
                    val input: InputStream = url.openStream()
                    BitmapFactory.decodeStream(input)
                } else {
                    val filePath = if (imageUriOrUrl.startsWith("file://")) {
                        imageUriOrUrl.substring(7)
                    } else {
                        imageUriOrUrl
                    }
                    BitmapFactory.decodeFile(filePath)
                }

                if (bitmap == null) {
                    promise.reject("BITMAP_ERROR", "Failed to decode bitmap from image URI")
                    return@Thread
                }

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                    val flag = when (destination) {
                        "home" -> WallpaperManager.FLAG_SYSTEM
                        "lock" -> WallpaperManager.FLAG_LOCK
                        else -> WallpaperManager.FLAG_SYSTEM or WallpaperManager.FLAG_LOCK
                    }
                    wallpaperManager.setBitmap(bitmap, null, true, flag)
                } else {
                    wallpaperManager.setBitmap(bitmap)
                }

                promise.resolve(true)
            } catch (e: Exception) {
                promise.reject("SET_WALLPAPER_ERROR", e.message, e)
            }
        }.start()
    }
}
