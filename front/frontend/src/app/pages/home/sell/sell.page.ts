import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ProductService } from 'src/app/services/product.service';
import { AccountsService } from 'src/app/services/accounts.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificationService } from 'src/app/services/notification.service';
@Component({
  selector: 'app-sell',
  templateUrl: './sell.page.html',
  styleUrls: ['./sell.page.scss'],
})
export class SellPage implements OnInit {

  stock: any;
  transferType: any;
  selectedAccount: any;
  quantity: any;
  stockSymbol: any;
  stockData: any;
  validity: any;
  cost: number = 0;
  balance: any;
  accounts: any[] = [];

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private productService: ProductService,
    private accountsService: AccountsService,
    private authService: AuthenticationService,
    private notificationService: NotificationService
  ) {
    this.route.paramMap.subscribe(params => {
      if (params.has('symbol')) {
        const symbol = params.get('symbol');
        this.stock = history.state.stockData;
      }
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.stockSymbol = params.get('symbol');
      this.stockData = this.productService.getStockBySymbol(this.stockSymbol);
      this.quantity = 0;
      this.validity = 1;
      this.stock = 100;
      this.balance = 1000;
    });
    this.getAccounts();
  }

  async getAccounts() {
    try {
      const accountsObservable = await this.accountsService.getAccounts();
      accountsObservable.subscribe(
        response => {
          this.accounts = response.accounts;
          console.log('Accounts:', this.accounts);
        },
        error => {
          console.error('Error fetching accounts:', error);
        }
      );
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async sell(stock: any, quantity: number) {
    if (!this.selectedAccount) {
      console.error('No account selected');
      return;
    }

    const payload = {
      accountId: this.selectedAccount,
      stockData: stock,
      quantity
    };

    try {
      const response = await this.accountsService.sellStock(payload);
      const message = `Sold ${quantity} shares of ${stock.symbol} for a total cost of ${stock.price * quantity}`;
      this.authService.addUserHistory(message);
      const mess = `you're sold of the ${stock.symbol} stock is successful`;
      this.notificationService.addNotification(mess);
      console.log('Stock sold successfully:', response);
      this.balance += stock.price * quantity; // Update balance locally
    } catch (error) {
      console.error('Error selling stock:', error);
    }
  }

  incrementQuantity() {
    this.quantity++;
    this.updateCost();
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
      this.updateCost();
    }
  }

  incrementValidity() {
    this.validity++;
  }

  decrementValidity() {
    if (this.validity > 1) {
      this.validity--;
  }
}

updateCost() {
  if (this.stockData && this.stockData.price) {
    this.cost = this.quantity * this.stockData.price;
  }
}
}