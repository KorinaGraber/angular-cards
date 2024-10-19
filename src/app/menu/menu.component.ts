import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatAnchor } from '@angular/material/button';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink, MatAnchor],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {

}
