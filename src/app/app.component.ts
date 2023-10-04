import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, JwtService } from './_services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'FonadaRCS';

}
