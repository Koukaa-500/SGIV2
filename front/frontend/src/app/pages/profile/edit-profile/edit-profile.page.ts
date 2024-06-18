import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
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


  saveChanges(){

  }

  async loadUserProfile() {
    (await this.authService.getUserProfile()).subscribe(
      (data) => {
        this.name = data.name;
        this.email = data.email;
        this.phoneNumber = data.phoneNumber;
        
        
         // Assuming the backend returns the image URL
        console.log('User profile loaded successfully:', data);
      },
      (error) => {
        console.error('Error fetching user profile:', error);
        // Handle error as needed
      }
    );
  }


  async saveProfileChanges() {
    try {
      const updatedData = {
        name: this.name,
        email: this.email,
        phoneNumber: this.phoneNumber
      };

      const updatedUser = await (await this.authService.updateUserProfile(updatedData)).toPromise();
      this.name = updatedUser.name;
      this.email = updatedUser.email;
      this.phoneNumber = updatedUser.phoneNumber;
      // You can also update image here if needed

      // Show success message or handle UI updates as needed
      console.log('Profile updated successfully:', updatedUser);
      this.router.navigate(['/profile'])
    } catch (error) {
      console.error('Error updating profile:', error);
      // Handle error
    }
  }
}
