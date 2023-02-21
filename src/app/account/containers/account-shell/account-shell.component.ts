import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-account-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './account-shell.component.html',
  styleUrls: ['./account-shell.component.scss']
})
export class AccountShellComponent {
}
