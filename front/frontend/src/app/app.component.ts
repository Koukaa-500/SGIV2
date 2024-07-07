import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  name: string | undefined;
  email: string | undefined;
  phoneNumber: string | undefined;
  image: string | undefined;
  isLightModeEnabled = true;
  edit : boolean = false
  activeRoute: string | any;

  constructor(
    private authService: AuthenticationService,
    private menu: MenuController,
    private router: Router
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activeRoute = event.urlAfterRedirects;
      }
    });
  }

  ngOnInit(){
    this.loadUserProfile();
  }

  closeMenu() {
    this.menu.close('main-menu'); // Close the menu with menuId 'main-menu'
  }

  // Optionally, close menu when navigating to a new page
  navigateTo(route: string) {
    this.router.navigate([route]).then(() => {
      this.menu.close('main-menu');
    });
  }
  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }

  async loadUserProfile() {
    (await this.authService.getUserProfile()).subscribe(
      (data) => {
        this.name = data.name;
        this.email = data.email;
        this.phoneNumber = data.phoneNumber;
        this.image = data.image;
        console.log(this.image);
         // Assuming the backend returns the image URL
        console.log('User profile loaded successfully:', data);
      },
      (error) => {
        console.error('Error fetching user profile:', error);
        // Handle error as needed
      }
    );
  }
}
