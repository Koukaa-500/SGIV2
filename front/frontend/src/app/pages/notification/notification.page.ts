import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {
  title: string = "Notification";
  notificationMessages: any[] = [];

  constructor(private notificationService: NotificationService) { }

  ngOnInit() {
    this.loadNotifications();
  }

  async loadNotifications() {
    (await this.notificationService.getNotifications()).subscribe(
      (notifications) => {
        this.notificationMessages = notifications.map(this.getNotificationString);
        console.log(this.notificationMessages);
      },
      (error) => {
        console.error('Error fetching notifications:', error);
      }
    );
  }

  getNotificationString(notification: any): { message: string, date: string } {
    let notificationString = '';
    for (let key in notification) {
      if (!isNaN(parseInt(key))) {
        notificationString += notification[key];
      }
    }
    return { message: notificationString, date: notification.date };
  }
}
