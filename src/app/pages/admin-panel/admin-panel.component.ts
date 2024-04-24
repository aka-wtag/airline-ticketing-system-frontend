import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
})
export class AdminPanelComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  onLogout() {
    this.authService.onLogout();
  }
}
