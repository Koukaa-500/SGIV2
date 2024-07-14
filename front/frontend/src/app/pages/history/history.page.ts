import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  history: any[] = [];

  constructor(private AuthService: AuthenticationService) { }

  ngOnInit() {
    this.loadNotifications();

  }
  async loadNotifications() {
    (await this.AuthService.getUserHistory()).subscribe(
      (history: any[]) => {
        this.history = history;
      },
      (error: any) => {
        console.error('Error fetching notifications:', error);
      }
    );
  }


}
function subscribe(arg0: (notifications: any) => void, arg1: (error: any) => void) {
  throw new Error('Function not implemented.');
}

