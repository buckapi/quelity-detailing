import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { TopNavbarComponent } from '../ui/top-navbar/top-navbar.component';
import { DataApiService } from '../../services/data-api.service';
import { RealtimeWorkInstructionsService } from '../../services/realtime-work-instructions.service';
import { AuthPocketbaseService } from '../../services/auth-pocketbase.service';
import { RealtimeSupervisorsService } from '../../services/realtime-supervisors.service';
import { Router } from '@angular/router';
import { WorkInstructionService } from '../../services/work-instruction.service';

@Component({
  selector: 'app-workinstructiondetail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workinstructiondetail.component.html',
  styleUrl: './workinstructiondetail.component.css'
})
export class WorkinstructiondetailComponent implements OnInit {
  constructor(
    public global: GlobalService,
    public auth: AuthPocketbaseService,
    public realtimeWorkInstructions: RealtimeWorkInstructionsService,
    public realtimeSupervisors: RealtimeSupervisorsService,
    private dataApiService: DataApiService,
    private router: Router,
    private workInstructionService: WorkInstructionService
  ){    

   
  }

  ngOnInit(): void {
    console.log(this.global.workInstructionSelected);
  }
}
