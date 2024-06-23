import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/core/interface/user';
import { AuthService } from 'src/app/core/service/auth.service';
import { JwtService } from 'src/app/core/service/jwt.service';
import { ToastService } from 'src/app/core/service/toast.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  @Input() authenticatedUser: User | null | undefined;

  showDropDown: boolean = false;

  constructor(private authService: AuthService, private toastService: ToastService) { }

  onLogout(): void {
    this.authService.onLogout().subscribe({
      next: () => {
        this.authService.removeAuthenticatedUser();
      }, error: (err: string) => {
        this.toastService.show(err, false);
      }
    });
  }

  toogleDropDown(): void{
    this.showDropDown = !this.showDropDown;
  }
}
