import { Component, OnInit } from '@angular/core';
import { UserService, User } from 'src/app/services/soprano/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-soprano-top-bar',
  templateUrl: './soprano-top-bar.component.html',
  styleUrls: ['./soprano-top-bar.component.scss']
})

export class SopranoTopBarComponent implements OnInit {

  public isLoggedIn = false;
  private user: User;

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
    return (this.user && this.user.imageURL) ? this.user.imageURL : '';
  }

  ngOnInit()
  {
    // Get UserID
    this.userService.GetUserID().subscribe(() => this.isLoggedIn = true);

    // Get User
    this.userService.GetUser().subscribe(
      (user: User) => this.user = user,
      console.error
    );
  }
}