import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router, NavigationEnd } from '@angular/router';

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
  constructor(private authService: AuthenticationService, private router: Router) {
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
  login() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please provide both email and password';
      return;
    }
    const credentials = {
      email: this.email,
      password: this.password
    };
    this.authService.login(credentials).subscribe(
      res => {
        console.log("niceeuuuu");
        this.router.navigate(['./profile']);
      },
      err => {
        console.log("error");
        this.errorMessage = err;
      }
    );
  }

  navigateToForgotPassword() {
    console.log("This is forgot password");
  }

  navigateToRegister() {
    console.log("This is register");
  }

  continueAsGuest() {
    console.log('Continue as Guest');
  }
}
