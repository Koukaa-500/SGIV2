import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-ordor',
  templateUrl: './ordor.page.html',
  styleUrls: ['./ordor.page.scss'],
})
export class OrdorPage implements OnInit {
  title: string = "Carnet d'ordre";
  orders: any[] = [];

  constructor(private AuthService: AuthenticationService) { }

  ngOnInit() {
    this.loadOrders();
  }

  async loadOrders() {
    (await this.AuthService.getUserHistory()).subscribe(
      (orders: any[]) => {
        this.orders = orders;
      },
      (error: any) => {
        console.error('Error fetching orders:', error);
      }
    );
  }
}
