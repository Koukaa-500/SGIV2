import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router, NavigationEnd } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string = '';
  password: string = '';
  isDarkMode: boolean;
  errorMessage: string = '';
  showPassword: boolean = true;

  constructor(
    private authService: AuthenticationService, 
    private router: Router,
    private toastController: ToastController
  ) {
    this.isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Listen to route changes
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Clear the form fields on navigation end
        this.email = '';
        this.password = '';
      }
    });
  }

  ngOnInit() {
    // Clear fields on initialization
    this.email = '';
    this.password = '';
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
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

  login() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please provide both email and password';
      this.presentToast(this.errorMessage, 'danger');
      return;
    }
    const credentials = {
      email: this.email,
      password: this.password
    };
    this.authService.login(credentials).subscribe(
      res => {
        console.log("Login successful");
        this.presentToast('Login successful', 'success');
        this.router.navigate(['./profile']);
      },
      err => {
        console.log("Login error");
        this.errorMessage = err;
        this.presentToast('Login failed: ' + err, 'danger');
      }
    );
  }


}
