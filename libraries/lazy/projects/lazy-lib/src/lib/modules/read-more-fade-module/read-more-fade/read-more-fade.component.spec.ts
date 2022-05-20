import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadMoreFadeComponent } from './read-more-fade.component';

describe('ReadMoreFadeComponent', () => {
  let component: ReadMoreFadeComponent;
  let fixture: ComponentFixture<ReadMoreFadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadMoreFadeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadMoreFadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
