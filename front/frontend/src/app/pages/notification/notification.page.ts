import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {
  title: string = "Notification";
  notificationMessages: string[] = [];

  constructor() { }

  ngOnInit() {
    this.checkStockMarketStatus(); // Check initially
    setInterval(() => {
      this.checkStockMarketStatus();
    }, 500); // Check every half second (adjust as needed)
  }

  checkStockMarketStatus() {
    const currentHour = new Date().getHours();
    let message: string;
    if (currentHour >= 6 && currentHour < 20) {
      message = "Stock market is open.";
    } else {
      message = "Stock market is closed.";
    }
    
    // Append the message to the array
    // this.notificationMessages.push(message);
  }
}
