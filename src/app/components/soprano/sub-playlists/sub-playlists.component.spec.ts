import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SubPlaylistsComponent } from './sub-playlists.component';

describe('SubPlaylistsComponent', () =>
{
  let component: SubPlaylistsComponent;
  let fixture: ComponentFixture<SubPlaylistsComponent>;

  beforeEach(async(() =>
  {
    TestBed.configureTestingModule({
      declarations: [ SubPlaylistsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() =>
  {
    fixture = TestBed.createComponent(SubPlaylistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () =>
  {
    expect(component).toBeTruthy();
  });
});
