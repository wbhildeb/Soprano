import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SopranoTopBarComponent } from './soprano-top-bar.component';

describe('SpotifyTopBarComponent', () =>
{
  let component: SopranoTopBarComponent;
  let fixture: ComponentFixture<SopranoTopBarComponent>;

  beforeEach(async(() =>
  {
    TestBed.configureTestingModule({
      declarations: [ SopranoTopBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() =>
  {
    fixture = TestBed.createComponent(SopranoTopBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () =>
  {
    expect(component).toBeTruthy();
  });
});
