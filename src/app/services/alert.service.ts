import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  successToaster(title: string): void {
    Swal.fire({
      title,
      icon: 'success',
      confirmButtonText: 'OK',
      customClass: {
        icon: 'custom-icon-class',
      },
      width: '300px'
    })
  }

  errorToaster(text: string): void {
    Swal.fire({
      title: 'Error',
      text,
      icon: 'error',
      confirmButtonText: 'OK',
      customClass: {
        icon: 'custom-icon-class',
      },
      width: '300px'
    });
  }
}
