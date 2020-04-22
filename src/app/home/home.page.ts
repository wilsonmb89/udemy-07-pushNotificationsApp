import { Component, OnInit, OnDestroy, ApplicationRef } from '@angular/core';
import { OSNotification } from '@ionic-native/onesignal/ngx';
import { DataLocalService } from '../services/data-local.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  historialNotificaciones: OSNotification[] = [];
  pushNotificationSubscription: Subscription;
  userId: string;

  constructor(
    private _dataLocalService: DataLocalService,
    private _applicationRef: ApplicationRef
  ) {}

  ngOnInit() {
    this.pushNotificationSubscription = this._dataLocalService.pushNotificationStream.subscribe(
      async (res) => {
        await this.getNotificationHistory();
        this._applicationRef.tick();
      }
    );
  }

  ngOnDestroy() {
    if (!!this.pushNotificationSubscription) {
      this.pushNotificationSubscription.unsubscribe();
    }
  }

  async ionViewWillEnter() {
    this.getNotificationHistory();
    this.userId = await this._dataLocalService.getUserId();
  }

  async getNotificationHistory() {
    this.historialNotificaciones = await this._dataLocalService.getHistoryNotifications();
  }

  async deleteStorage() {
    await this._dataLocalService.clearStorage();
    await this.getNotificationHistory();
  }
}
