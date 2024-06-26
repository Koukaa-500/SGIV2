import { Component, OnInit } from '@angular/core';
import { AccountsService } from '../../../services/accounts.service'; // Adjust the path as necessary
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.page.html',
  styleUrls: ['./add-account.page.scss'],
})
export class AddAccountPage implements OnInit {
  name: string = '';
  solde: any
  title :string = 'Edit Profile'
  constructor(private accountsService: AccountsService, private router: Router) { 
    
  }

  ngOnInit() {
  }

  async addAccount() {
    const accountData = {
      name: this.name,
      solde: this.solde
    };

    (await this.accountsService.addAccount(accountData)).subscribe(
      response => {
        console.log('Account added successfully:', response);
        this.router.navigate(['/portfolio']); // Redirect to portfolio page after successful account creation
      },
      error => {
        console.error('Error adding account:', error);
      }
    );
  }
}
