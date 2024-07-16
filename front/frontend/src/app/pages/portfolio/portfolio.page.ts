import { Component, OnInit } from '@angular/core';
import { AccountsService } from '../../services/accounts.service'; // Adjust the path as necessary

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.page.html',
  styleUrls: ['./portfolio.page.scss'],
})
export class PortfolioPage implements OnInit {
  title: string = 'Portefeuille';
  accounts: any[] = [];
  selectedAccount: any = null;
  selectedStocks: any[] = [];
  user: any;
  currentDate: string | undefined;
  isMarketOpen: boolean | undefined;
  espece: number = 0;
  titre: number = 0;

  constructor(private accountsService: AccountsService) { }

  ngOnInit() {
    this.getAccounts();
    this.user = this.accountsService.getUserData();
    console.log(this.user);
    this.updateDateAndMarketStatus();
    setInterval(() => this.updateDateAndMarketStatus(), 60000); // Update every minute
  }

  async getAccounts() {
    try {
      const accountsObservable = await this.accountsService.getAccounts();
      accountsObservable.subscribe(
        response => {
          this.accounts = response.accounts;
        },
        error => {
          console.error('Error fetching accounts:', error);
        }
      );
    } catch (error) {
      console.error('Error:', error);
    }
  }

  selectAccount(account: any) {
    this.selectedAccount = account;
    this.selectedStocks = account.stock;
    this.calculateEspece();
    this.calculateTitre();
  }

  onAccountChange(event: Event) {
    const accountId = (event.target as HTMLSelectElement).value;
    this.selectedAccount = this.accounts.find(account => account._id === accountId);
    if (this.selectedAccount) {
      this.selectedStocks = this.selectedAccount.stock;
      this.calculateEspece();
      this.calculateTitre();
    } else {
      this.selectedStocks = [];
      this.espece = 0;
      this.titre = 0;
    }
  }

  calculateEspece() {
    this.espece = this.selectedStocks.reduce((total, stock) => total + stock.price * stock.quantity, 0);
  }

  calculateTitre() {
    this.titre = this.selectedAccount.solde + this.espece;
  }

  updateDateAndMarketStatus() {
    const now = new Date();
    this.currentDate = now.toLocaleDateString();
    const hour = now.getHours();
    this.isMarketOpen = hour >= 6 && hour < 20;
  }
}
