import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefectsModalComponent } from './defects-modal.component';

describe('DefectsModalComponent', () => {
  let component: DefectsModalComponent;
  let fixture: ComponentFixture<DefectsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefectsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefectsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
