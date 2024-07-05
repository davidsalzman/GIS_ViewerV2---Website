import { Component, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { BreadcrumbService } from '../shared/services/breadcrumb.service';
import { LocalStorageService } from '../shared/services/local-storage.service';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
    public authService: AuthService,
    private breadcrumbService: BreadcrumbService) { }

    ngOnInit(): void {
      
        this.breadcrumbService.breadcrumbs = null;
        
    }
}



