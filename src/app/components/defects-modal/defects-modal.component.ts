import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RealtimeActivitiesService } from '../../services/realtime-activities.service';

interface Defect {
  type: string;
  quantity: number;
  description: string;
}

@Component({
  selector: 'app-defects-modal',
  standalone: true,
  imports: [ CommonModule, NgbModule, FormsModule],
  templateUrl: './defects-modal.component.html',
  styleUrl: './defects-modal.component.css'
})
export class DefectsModalComponent implements OnInit {
    @Input() currentDefects: Defect[] = [];
    defects: Defect[] = [];
    newDefect: Defect = {
        type: '',
        quantity: 0,
        description: ''
    };

    constructor(
        public activeModal: NgbActiveModal
    ) {}

    ngOnInit(): void {
        this.defects = [...this.currentDefects];
    }

    addDefect(): void {
        if (!this.newDefect.type || this.newDefect.quantity <= 0) {
            return;
        }
        this.defects.push({...this.newDefect});
        this.newDefect = {
            type: '',
            quantity: 0,
            description: ''
        };
    }

    removeDefect(index: number): void {
        this.defects.splice(index, 1);
    }

    save(): void {
        this.activeModal.close(this.defects);
    }
}
