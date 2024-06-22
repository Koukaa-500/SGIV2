import { Component, OnInit } from '@angular/core';
import { AccountsService } from '../../services/accounts.service'; // Adjust the path as necessary

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.page.html',
  styleUrls: ['./portfolio.page.scss'],
})
export class PortfolioPage implements OnInit {
  title: string = 'portefeuille';
  accounts: any[] = [];

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
}
