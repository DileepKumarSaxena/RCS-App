import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  constructor(private toaster: ToastrService) { }

   success(message: string) {
    this.toaster.success(message);
  }

  error(message: string) {
    this.toaster.error(message);
  }

  warning(message: string) {
    this.toaster.warning(message);
  }

  info(message: string) {
    this.toaster.info(message);
  }

  show(message: string) {
    this.toaster.show(message);
  }
}
