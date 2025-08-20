import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-member-layout',
  standalone: true,
  templateUrl: './member-layout.component.html',
  styleUrls: ['./member-layout.component.scss'],
  imports: [RouterOutlet]
})
export class MemberLayoutComponent {}
