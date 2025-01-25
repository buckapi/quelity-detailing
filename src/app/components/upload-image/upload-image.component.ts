import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadService } from '../../services/upload.service';
import { GlobalService } from '../../services/global.service';
import Swal from 'sweetalert2';

interface UploadResponse {
  url: string;
  id: string;
  filename: string;
  success: boolean;
  record?: any;
  originalFile?: File;
}

@Component({
  selector: 'app-upload-image',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="upload-container">
      <input
        type="file"
        #fileInput
        (change)="onFileSelected($event)"
        accept="image/*"
        [multiple]="allowMultiple"
        style="display: none">
      
      <button 
        class="btn btn-primary" 
        (click)="fileInput.click()"
        [disabled]="isUploading">
        <i class="fas fa-upload me-2"></i>
        {{ buttonText }}
      </button>

      <div *ngIf="isUploading" class="spinner-border text-primary ms-2" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>

      <div *ngIf="previewUrl" class="preview-image mt-3">
        <img [src]="previewUrl" alt="Preview" class="img-thumbnail">
      </div>
    </div>
  `,
  styles: [`
    .upload-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
    .preview-image {
      max-width: 200px;
      width: 100%;
    }
    .preview-image img {
      width: 100%;
      height: auto;
      object-fit: cover;
    }
  `]
})
export class UploadImageComponent {
  @Input() buttonText = 'Upload Image';
  @Input() allowMultiple = false;
  @Output() uploadComplete = new EventEmitter<UploadResponse>();
  @Output() uploadError = new EventEmitter<Error>();
  @Output() fileSelected = new EventEmitter<File>();

  isUploading = false;
  previewUrl: string | null = null;

  constructor(
    private uploadService: UploadService,
    public global: GlobalService
  ) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    if (!file.type.startsWith('image/')) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please select only image files'
      });
      return;
    }

    // Crear preview
    this.previewUrl = URL.createObjectURL(file);
    this.isUploading = true;

    // Preparar los datos de la actividad
    const activityData = {
      workinstructionId: this.global.workInstructionSelected.id,
      technicalId: this.global.workInstructionSelected.technicalId,
      supervisorId: this.global.workInstructionSelected.supervisorId,
      number: new Date().getTime().toString(),
      date: new Date().toISOString(),
      process: 'Image Upload',
      description: 'Image uploaded from work instruction',
      focusPoints: '',
      time: new Date().toISOString()
    };

    // Subir imagen
    this.uploadService.uploadToActivityWorkInstruction(file, activityData).subscribe({
      next: (response: UploadResponse) => {
        this.isUploading = false;
        this.uploadComplete.emit({
          ...response,
          originalFile: file
        });
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Image uploaded successfully'
        });
      },
      error: (error: Error) => {
        this.isUploading = false;
        this.uploadError.emit(error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error uploading image'
        });
      }
    });
  }
}