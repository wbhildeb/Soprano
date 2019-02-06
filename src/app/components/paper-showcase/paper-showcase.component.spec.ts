import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperShowcaseComponent } from './paper-showcase.component';

describe('PaperShowcaseComponent', () => {
  let component: PaperShowcaseComponent;
  let fixture: ComponentFixture<PaperShowcaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaperShowcaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaperShowcaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
