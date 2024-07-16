import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {
  name: string;
  email: string;
  password: string;
  phoneNumber: string | number;
  image: File | null = null;
  showPassword: boolean = true;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private toastController: ToastController
  ) {
    this.name = '';
    this.email = '';
    this.password = '';
    this.phoneNumber = '';
  }

  onFileSelected(event: any) {
    this.image = event.target.files[0];
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'bottom'
    });
    toast.present();
  }

  createAccount() {
    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('email', this.email);
    formData.append('password', this.password);
    formData.append('phoneNumber', this.phoneNumber.toString());
    if (this.image) {
      formData.append('image', this.image);
    }

    this.authService.register(formData).subscribe(
      (response) => {
        console.log('Registration successful', response);
        this.presentToast('Registration successful', 'success');
        this.router.navigate(['/login']); // Redirect to login page
      },
      (error) => {
        console.error('Registration failed', error);
        this.presentToast('Registration failed: ' + error, 'danger');
      }
    );
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

}
