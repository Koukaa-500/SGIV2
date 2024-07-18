import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-ordor',
  templateUrl: './ordor.page.html',
  styleUrls: ['./ordor.page.scss'],
})
export class OrdorPage implements OnInit {
  title: string = "Carnet d'ordre";
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
