import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotifyTopBarComponent } from './spotify-top-bar.component';

describe('SpotifyTopBarComponent', () =>
{
  let component: SpotifyTopBarComponent;
  let fixture: ComponentFixture<SpotifyTopBarComponent>;

  beforeEach(async(() =>
  {
    TestBed.configureTestingModule({
      declarations: [ SpotifyTopBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() =>
  {
    fixture = TestBed.createComponent(SpotifyTopBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () =>
  {
    expect(component).toBeTruthy();
  });
});
