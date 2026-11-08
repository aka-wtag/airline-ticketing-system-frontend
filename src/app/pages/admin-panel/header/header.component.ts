import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/service/auth.service';
import { ToastService } from 'src/app/core/service/toast.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  constructor(private authService: AuthService, private router: Router, private toastService: ToastService) { }

  onLogout(): void {
    this.authService.onLogout().subscribe({
      next: () => {
        this.authService.removeAuthenticatedUser();
      }, error: (err) => {
        this.toastService.show(err, false);
      }
    });
  }
}
