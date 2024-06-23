import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/core/interface/user';
import { AuthService } from 'src/app/core/service/auth.service';
import { JwtService } from 'src/app/core/service/jwt.service';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.css']
})
export class UserViewComponent implements OnInit {
  authenticatedUser: User | null | undefined;

  constructor( private jwtService: JwtService, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.authenticatedUser.subscribe((val) => {
      this.authenticatedUser = val;
    });
  }

}
