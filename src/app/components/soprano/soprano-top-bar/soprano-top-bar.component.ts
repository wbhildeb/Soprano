import { UserModel } from './../../../models/soprano/user.model';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/soprano/user.service';

@Component({
  selector: 'app-soprano-top-bar',
  templateUrl: './soprano-top-bar.component.html',
  styleUrls: ['./soprano-top-bar.component.scss']
})

export class SopranoTopBarComponent implements OnInit {

  public isLoggedIn = false;
  private user: UserModel;

  constructor(private userService: UserService) {}

  public LogIn(): void
  {
    if (!this.isLoggedIn)
    {
      this.userService.LogIn();
    }
  }

  public GetUsername(): string
  {
    return (this.user && this.user.name) ? this.user.name : '';
  }

  public GetImageURL(): string
  {
    return (this.user && this.user.image) ? this.user.image : '';
  }

  ngOnInit()
  {
    // Get UserID
    this.userService.GetUserID().subscribe(() => this.isLoggedIn = true);

    // Get User
    this.userService.GetUser().subscribe(
      (user: UserModel) => this.user = user,
      console.error
    );
  }
}
