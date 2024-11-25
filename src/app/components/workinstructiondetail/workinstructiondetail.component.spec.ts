import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkinstructiondetailComponent } from './workinstructiondetail.component';

describe('WorkinstructiondetailComponent', () => {
  let component: WorkinstructiondetailComponent;
  let fixture: ComponentFixture<WorkinstructiondetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkinstructiondetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkinstructiondetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
