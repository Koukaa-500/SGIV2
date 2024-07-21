import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
  providers: [DatePipe]
})
export class NotificationPage implements OnInit {
  title: string = "Notification";
  notificationMessages: any[] = [];
  today: Date = new Date();
  constructor(private notificationService: NotificationService,private datePipe: DatePipe) {
    
   }

  ngOnInit() {
    
    this.loadNotifications();
  }

  async loadNotifications() {
    (await this.notificationService.getNotifications()).subscribe(
      (notifications) => {
        this.notificationMessages = notifications;
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

    // Format the date using DatePipe and provide a default value if null
    const formattedDate = this.datePipe.transform(notification.date, 'yyyy-MM-dd HH:mm:ss') || '';

    return { message: notificationString, date: formattedDate };
  }

  async markAsRead(notificationId: string) {
    (await this.notificationService.markAsRead(notificationId)).subscribe(
      () => {
        this.loadNotifications(); // Reload notifications to update the state
        
      },
      (error) => {
        console.error('Error marking notification as read:', error);
      }
    );
    window.location.reload();
  }
  
}
