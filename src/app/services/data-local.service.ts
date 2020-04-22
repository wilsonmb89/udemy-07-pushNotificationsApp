import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { OSNotification } from '@ionic-native/onesignal/ngx';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  private pushNotificationSubject = new Subject<any>();
  pushNotificationStream = this.pushNotificationSubject.asObservable();

  constructor(
    private _storage: Storage
  ) { }

  async getHistoryNotifications() {
    const notifications = await this._storage.get('history_push_notifications');
    return notifications || [];
  }

  async savePushNotification(notification: OSNotification) {
    const currentNotifications = await this.getHistoryNotifications();
    const filteredNotifications =
      currentNotifications.filter((savedNot: OSNotification) => savedNot.payload.notificationID !== notification.payload.notificationID);
    filteredNotifications.unshift(notification);
    await this._storage.set('history_push_notifications', filteredNotifications);
    this.pushNotificationSubject.next(true);
  }

  async setUserId(userId: string) {
    await this._storage.set('push_notifications_userId', userId);
  }

  async getUserId() {
    return (await this._storage.get('push_notifications_userId')) || '';
  }

  async clearStorage() {
    await this._storage.remove('history_push_notifications');
  }
}
