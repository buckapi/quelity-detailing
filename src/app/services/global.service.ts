import { Injectable } from '@angular/core';
import { SupervisorService } from './supervisor.service';
import { RealtimeSupervisorsService } from './realtime-supervisors.service';
import { RealtimeWorkInstructionsService } from './realtime-work-instructions.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  activeRoute = 'login';
  workInstructionSelected: any = {};
  supervisors: any[] = [];
  technicials: any[] = [];
  workInstructions: any[] = [];
  constructor(
    public supervisorService: SupervisorService,
    public realtimeSupervisors: RealtimeSupervisorsService,
    public realtimeWorkInstructions: RealtimeWorkInstructionsService
  ) { }
  setRoute(route: string) {
    this.activeRoute = route;
  }

  conteo() {
    console.log(this.workInstructionSelected);
  }
  viewWorkInstruction(workInstruction: any) {
    this.workInstructionSelected = workInstruction;
    this.activeRoute = 'workinstructiondetail';
    this.conteo();
  }
  
  getSupervisorName(supervisorId: string): string {
    return this.supervisors.find((supervisor: any) => supervisor.id === supervisorId)?.name || '';
  }

  getSupervisorCount(): number {
    return this.supervisors.length;
  }

  getTechnicialCount(): number {
    return this.technicials.length;
  }

  getWorkInstructionCount(): number {
    return this.workInstructions.length;
  }

  getTechnicials(): any[] {
    return this.technicials;
  }


  
}
