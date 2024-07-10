import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {
  title: string = "Notification";
  notificationMessages: string[] = [];

  constructor(private notificationService: NotificationService) { }

  ngOnInit() {
    this.loadNotifications();
  }

  async loadNotifications() {
    (await this.notificationService.getNotifications()).subscribe(
      (notifications) => {
        this.notificationMessages = notifications;
      },
      (error) => {
        console.error('Error fetching notifications:', error);
      }
    );
  }
}
