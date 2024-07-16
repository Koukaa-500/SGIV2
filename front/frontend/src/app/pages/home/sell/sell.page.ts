import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ProductService } from 'src/app/services/product.service';
import { AccountsService } from 'src/app/services/accounts.service';
import { ToastController } from '@ionic/angular';

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
    private toastController: ToastController
  ) {
    this.route.paramMap.subscribe(params => {
      if (params.has('symbol')) {
        const symbol = params.get('symbol');
        this.stock = history.state.stockData;
      }
    });
  }

  ngOnInit() {
    this.getAccounts();
    this.route.paramMap.subscribe(params => {
      this.stockSymbol = params.get('symbol');
      this.stockData = this.productService.getStockBySymbol(this.stockSymbol);
      this.quantity = 0;
      this.validity = 1;
      this.stock = 100;
      this.balance = '';
    });
    
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
      this.presentToast('No account selected', 'danger');
      return;
    }

    const payload = {
      accountId: this.selectedAccount,
      stockData: stock,
      quantity
    };

    try {
      const response = await this.accountsService.sellStock(payload);
      console.log('Stock sold successfully:', response);
      this.balance += stock.price * quantity; // Update balance locally
      this.presentToast('Stock sold successfully!', 'success');
    } catch (error) {
      console.error('Error selling stock:', error);
      this.presentToast('Error selling stock', 'danger');
    }
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: color
    });
    toast.present();
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

  onAccountChange(accountId: string) {
    const selectedAccount = this.accounts.find(account => account._id === accountId);
    if (selectedAccount) {
      this.balance = selectedAccount.solde;
    }
  }
}
