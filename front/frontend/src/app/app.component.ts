import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private authService: AuthenticationService,
    private menu: MenuController,
    private router: Router
  ) {}

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
}
