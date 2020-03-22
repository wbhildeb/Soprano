/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GridGroupComponent } from './grid-group.component';

describe('GridGroupComponent', () =>
{
  let component: GridGroupComponent;
  let fixture: ComponentFixture<GridGroupComponent>;

  beforeEach(async(() =>
  {
    TestBed.configureTestingModule({
      declarations: [ GridGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() =>
  {
    fixture = TestBed.createComponent(GridGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () =>
  {
    expect(component).toBeTruthy();
  });
});
