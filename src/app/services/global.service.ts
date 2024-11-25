import { Injectable } from '@angular/core';
import { SupervisorService } from './supervisor.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  activeRoute = 'login';
  workInstructionSelected: any = {};
  supervisors: any[] = [];
  constructor(
    private supervisorService: SupervisorService
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
  
}
