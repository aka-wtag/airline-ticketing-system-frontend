import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/service/auth.service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/core/service/toast.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
})
export class AdminPanelComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router, private toastService: ToastService) {}

  ngOnInit(): void {}

  onLogout() {
    this.authService.onLogout().subscribe({next: () => {
      this.authService.removeAuthenticatedUser();
      this.router.navigate(['/login']);
    }, error: (err) => {
      this.toastService.show(err, false);
    }});
  }
}
