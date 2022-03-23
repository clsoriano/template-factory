import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CdkStepComponent } from './cdk-step.component';

describe('CdkStepComponent', () => {
  let component: CdkStepComponent;
  let fixture: ComponentFixture<CdkStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CdkStepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CdkStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
