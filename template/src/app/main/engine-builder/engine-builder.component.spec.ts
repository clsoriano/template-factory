import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineBuilderComponent } from './engine-builder.component';

describe('EngineBuilderComponent', () => {
  let component: EngineBuilderComponent;
  let fixture: ComponentFixture<EngineBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EngineBuilderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EngineBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
