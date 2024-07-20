import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.page.html',
  styleUrls: ['./forgetpassword.page.scss'],
})
export class ForgetpasswordPage {

  title : string = 'Change password'

  oldPassword: string;
  newPassword: string;
  confirmPassword: string;

  constructor(private http: HttpClient, private router: Router,private authService:AuthenticationService) {
    this.confirmPassword='';
    this.newPassword='';
    this.oldPassword = ''
  }
ngOnInit(){
  this.confirmPassword='';
    this.newPassword='';
    this.oldPassword = ''
}
  async changePassword() {
    (await this.authService.changePassword(this.oldPassword, this.newPassword, this.confirmPassword))
      .subscribe(response => {
        console.log(response);
        // Handle success response, e.g., redirect to login page or show success message
        this.router.navigate(['/login']);
      }, error => {
        console.error(error);
        // Handle error response, e.g., show error message to the user
      });
  }
  navigateBack(){
    this.router.navigate(['/profile'])
  }
}
