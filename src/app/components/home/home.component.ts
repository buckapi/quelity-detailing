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
import { RealtimeTechnicalsService } from '../../services/realtime-technicals.service';
import { RealtimeCustomersService } from '../../services/realtime-customers.service';

interface WorkInstruction {
    id: string | number; 
    companyName: string;
    contactName: string;
    mobile: string;
    progress: number;
    status: string; 
    created: string;
    updated: string;
    collectionId: string;
    expand: any;
    technicalId: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  workInstructions: WorkInstruction[] = [];
  supervisorCount: number = 0;
  technicialCount: number = 0;
  workInstructionCount: number = 0;
  customerCount: number = 0;
  constructor(
    public global: GlobalService,
    public auth: AuthPocketbaseService,
    public realtimeWorkInstructions: RealtimeWorkInstructionsService,
    public realtimeSupervisors: RealtimeSupervisorsService,
    public realtimeTechnicials: RealtimeTechnicalsService,
    private dataApiService: DataApiService,
    private router: Router,
    private workInstructionService: WorkInstructionService,
    public realtimeCustomers: RealtimeCustomersService
  ){     this.realtimeSupervisors.supervisors$;
         this.realtimeWorkInstructions.workInstructions$;
         this.realtimeTechnicials.technicals$;
   
  }

  /* async ngOnInit() {
    this.loadSupervisorCount();
  }

  async loadSupervisorCount() {
    this.supervisorCount = await this.realtimeSupervisors.getSupervisorCount();
  } */

    ngOnInit() {
      this.supervisorCount = this.realtimeSupervisors.getSupervisorCount();
      this.technicialCount = this.realtimeTechnicials.getTechnicialCount();
      this.workInstructionCount = this.realtimeWorkInstructions.getWorkInstructionCount();
      this.customerCount = this.realtimeCustomers.getCustomerCount();
      this.realtimeCustomers.customers$.subscribe((customers) => {
        this.customerCount = customers.length;
      });
      this.realtimeSupervisors.supervisors$.subscribe((supervisors) => {
        this.supervisorCount = supervisors.length;
      });
      this.realtimeTechnicials.technicals$.subscribe((technicals) => {
        this.technicialCount = technicals.length;
      });
      this.realtimeWorkInstructions.workInstructions$.subscribe((workInstructions) => {
        this.workInstructionCount = workInstructions.length;
      });
    }
}
