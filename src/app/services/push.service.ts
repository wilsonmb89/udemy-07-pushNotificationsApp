import { Injectable } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { DataLocalService } from './data-local.service';

@Injectable({
  providedIn: 'root'
})
export class PushService {

  constructor(
    private _oneSignal: OneSignal,
    private _dataLocal: DataLocalService
  ) { }

  initConfig() {
    this._oneSignal.startInit('03784201-57c9-4477-97e7-24a81d1a28fd', '735465375125');
    this._oneSignal.inFocusDisplaying(this._oneSignal.OSInFocusDisplayOption.Notification);
    this._oneSignal.handleNotificationReceived().subscribe((noti) => {
      this._dataLocal.savePushNotification(noti);
    });
    this._oneSignal.handleNotificationOpened().subscribe(async (noti) => {
      await this._dataLocal.savePushNotification(noti.notification);
    });
    this._oneSignal.getIds().then(
      info => {
        this._dataLocal.setUserId(info.userId);
      }
    );
    this._oneSignal.endInit();
  }
}
