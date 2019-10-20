import { Component, OnInit } from '@angular/core';
import { UserService, User } from 'src/app/services/spotify/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-spotify-top-bar',
  templateUrl: './spotify-top-bar.component.html',
  styleUrls: ['./spotify-top-bar.component.css']
})

export class SpotifyTopBarComponent implements OnInit {

  private isLoggedIn = false;
  private user: User;
  private username: string;
  private imageUrl: string;

  constructor(private userService: UserService) {}

  public LogIn(): void
  {
    if (!this.isLoggedIn)
    {
      this.userService.LogIn();
      this.populateUser();
    }
  }

  private populateUser(): void
  {
    if (!this.user) 
    {
      const userObservable: Observable<User> = this.userService.GetUser();

      userObservable.subscribe(
        (res: User) =>
        {
          if (res)
          {
            this.user = res;
            document.getElementById('username').innerHTML = res.name;
            const image = document.getElementById('profilePicture') as HTMLImageElement;
            image.src = res.imageURL;
          }
        },
        console.error
      );
    }
  }

  ngOnInit()
  {
    this.userService.GetUserID().subscribe(() => this.isLoggedIn = true);
    this.populateUser();
  }

}
