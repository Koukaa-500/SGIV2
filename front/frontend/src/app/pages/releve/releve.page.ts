import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-releve',
  templateUrl: './releve.page.html',
  styleUrls: ['./releve.page.scss'],
})
export class RelevePage implements OnInit {

  title: string = "Relevé d'operation";
  orders: any[] = [];

  constructor(private AuthService: AuthenticationService) { }

  ngOnInit() {
    this.loadOrders();
  }

  async loadOrders() {
    (await this.AuthService.getUserOperation()).subscribe(
      (orders: any[]) => {
        this.orders = orders;
      },
      (error: any) => {
        console.error('Error fetching orders:', error);
      }
    );
  }

}
