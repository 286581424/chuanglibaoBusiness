package com.chuanglibaobusiness;

import android.app.Application;

import com.facebook.react.ReactApplication;
import org.lovebing.reactnative.baidumap.BaiduMapPackage;
import com.horcrux.svg.SvgPackage;
import ca.jaysoo.extradimensions.ExtraDimensionsPackage;
import fr.greweb.reactnativeviewshot.RNViewShotPackage;
import com.horcrux.svg.SvgPackage;
import com.beefe.picker.PickerViewPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.microsoft.codepush.react.CodePush;
import cn.jpush.reactnativejpush.JPushPackage;
import com.github.wumke.RNExitApp.RNExitAppPackage;
import com.reactlibrary.RNSyanImagePickerPackage;
import com.reactlibrary.RNSyanImagePickerPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.beefe.picker.PickerViewPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.microsoft.codepush.react.CodePush;
import com.beefe.picker.PickerViewPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.microsoft.codepush.react.CodePush;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import android.content.Context;
import androidx.multidex.MultiDex;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private boolean SHUTDOWN_LOG = false;// 设置为 true 将不会打印 log

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected String getJSBundleFile() {
        return CodePush.getJSBundleFile();
        }
    
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
              new MainReactPackage(),
            new BaiduMapPackage(getApplicationContext()),
            new SvgPackage(),
            new ExtraDimensionsPackage(),
            new RNViewShotPackage(),
            new JPushPackage(!BuildConfig.DEBUG, !BuildConfig.DEBUG),
            new RNExitAppPackage(),
            new RNSyanImagePickerPackage(),
            new RCTCameraPackage(),
            new PickerViewPackage(),
            new RNDeviceInfo(),
              new CodePush(BuildConfig.CODEPUSH_KEY, MainApplication.this, BuildConfig.DEBUG,"http://39.108.86.81:3000")
      );

    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  protected void attachBaseContext(Context base) {
    super.attachBaseContext(base);
    MultiDex.install(this);
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
