import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  title: string = 'Profile';
  name: string | undefined;
  email: string | undefined;
  phoneNumber: string | undefined;
  image: any | undefined;
  isLightModeEnabled = true;
  edit : boolean = false
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private menu: MenuController // Inject MenuController here
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.menu.close('main-menu'); // Access menu property from MenuController
      }
    });
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  showEditProfile(){
    this.router.navigate(['/edit-profile'])
    
  }

  changePassword() {
    this.router.navigate(['/forgetpassword'])
  }

  onSubmit() {
    // Handle opening notification settings
  }

  openTutorial() {
    // Handle opening tutorial
  }

  openPrivacyPolicy() {
    // Handle opening privacy policy
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
        this.image = this.authService.getUserProfileImageUrl(data.id)
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
