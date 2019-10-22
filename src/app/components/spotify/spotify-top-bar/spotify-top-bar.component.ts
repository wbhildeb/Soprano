import { Component, OnInit } from '@angular/core';
import { UserService, User } from 'src/app/services/spotify/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-spotify-top-bar',
  templateUrl: './spotify-top-bar.component.html',
  styleUrls: ['./spotify-top-bar.component.css']
})

export class SpotifyTopBarComponent implements OnInit {

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
