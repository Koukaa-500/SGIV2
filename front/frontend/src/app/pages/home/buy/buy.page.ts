import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ProductService } from 'src/app/services/product.service';
import { AccountsService } from 'src/app/services/accounts.service';

@Component({
  selector: 'app-buy',
  templateUrl: './buy.page.html',
  styleUrls: ['./buy.page.scss'],
})
export class BuyPage implements OnInit {
  stock: any;
  transferType: any;
  selectedAccount: any;
  quantity: any;
  stockSymbol: any;
  stockData: any;
  validity: any;
  balance: any;
  cost: number = 0;
  accounts: any[] = []; // Add accounts property

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private productService: ProductService,
    private accountsService: AccountsService
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
      this.quantity = 1;
      this.validity = 1;
      this.stock = 0;
      this.balance = 1000;
    });
    this.getAccounts();
  }

  async getAccounts() {
    try {
      const accountsObservable = await this.accountsService.getAccounts();
      accountsObservable.subscribe(
        response => {
          this.accounts = response.accounts; // Assign fetched accounts to accounts property
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

  async buy(stock: any, quantity: number) {
    if (!this.selectedAccount) {
      console.error('No account selected');
      return;
    }
    const totalCost = stock.price * quantity;
    if (this.balance < totalCost) {
      console.error('Insufficient balance');
      return;
    }

    const payload = {
      accountId: this.selectedAccount,
      stockData: stock,
      quantity
    };

    try {
      const response = await this.accountsService.buyStock(payload);
      console.log('Stock purchased successfully:', response);
      this.balance -= totalCost; // Update balance locally
    } catch (error) {
      console.error('Error buying stock:', error);
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
