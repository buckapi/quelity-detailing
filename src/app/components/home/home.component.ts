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
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    TopNavbarComponent,
    CommonModule, 
    
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent   {
  workInstructions: WorkInstruction[] = [];

  constructor(
    public global: GlobalService,
    public auth: AuthPocketbaseService,
    public realtimeWorkInstructions: RealtimeWorkInstructionsService,
    public realtimeSupervisors: RealtimeSupervisorsService,
    private dataApiService: DataApiService,
    private router: Router,
    private workInstructionService: WorkInstructionService
  ){     this.realtimeSupervisors.supervisors$;
         /* this.loadWorkInstructions(); */
         this.realtimeWorkInstructions.workInstructions$;

   
  }
  /* ngOnInit() {    
    this.loadWorkInstructions();
  }

  loadWorkInstructions() {
    this.workInstructionService.getWorkInstructions()
      .subscribe({
        next: (data) => {
          this.workInstructions = data;
        },
        error: (error) => {
          console.error('Error loading work instructions:', error);
        }
      });
  } */

  

  /* viewWorkInstruction(id: number) {
    // Navega a la vista detallada de la instrucción de trabajo
    this.router.navigate(['/work-instruction', id]);
  } */
}
