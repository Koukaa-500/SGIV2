import { Component, OnInit } from '@angular/core';
import { AccountsService } from '../../../services/accounts.service'; // Adjust the path as necessary
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.page.html',
  styleUrls: ['./add-account.page.scss'],
})
export class AddAccountPage implements OnInit {
  name: string = '';
  solde: any
  title :string = 'Edit Profile'
  constructor(private accountsService: AccountsService, private router: Router,private toastController: ToastController) { 
    
  }

  ngOnInit() {
  }

  async addAccount() {
    const accountData = {
      name: this.name,
      solde: this.solde
    };

    try {
      const response = await (await this.accountsService.addAccount(accountData)).toPromise();
      console.log('Account added successfully:', response);
      this.presentToast('Account added successfully!', 'success');
      this.router.navigate(['/portfolio']); // Redirect to portfolio page after successful account creation
    } catch (error) {
      console.error('Error adding account:', error);
      this.presentToast('Error adding account', 'danger');
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
}
