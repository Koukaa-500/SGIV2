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

  constructor(private accountsService: AccountsService) { }

  ngOnInit() {
    this.getAccounts();
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
  }
  onAccountChange(event: Event) {
    const accountId = (event.target as HTMLSelectElement).value;
    this.selectedAccount = this.accounts.find(account => account._id === accountId);
    if (this.selectedAccount) {
      this.selectedStocks = this.selectedAccount.stock;
    } else {
      this.selectedStocks = [];
    }
  }
}
