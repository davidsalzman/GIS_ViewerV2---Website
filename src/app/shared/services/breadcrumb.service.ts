import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { IBreadcrumb } from 'src/app/shared/components/breadcrumbs/breadcrumbs.component';

@Injectable({
    providedIn: 'root',
})
export class BreadcrumbService {
    public breadcrumbs$: Observable<IBreadcrumb[] | null>;
    private breadcrumbsSubject: Subject<IBreadcrumb[] | null>;
    private _breadcrumbs: IBreadcrumb[] | null = null;

    constructor() {
        this.breadcrumbsSubject = new Subject<IBreadcrumb[] | null>();
        this.breadcrumbs$ = this.breadcrumbsSubject.asObservable();
    }

    public getBreadcrumbs(): IBreadcrumb[] | null {
        return this._breadcrumbs;
    }

    set breadcrumbs(breadcrumbs: IBreadcrumb[] | null) {
        this._breadcrumbs = breadcrumbs;
        this.breadcrumbsSubject.next(breadcrumbs);
    }
}
