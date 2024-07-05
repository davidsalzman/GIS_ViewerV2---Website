import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faWpforms } from '@fortawesome/free-brands-svg-icons';
import {
    faBars, faBook, faBuilding, faChartBar, faChartPie, faCogs, faEnvelope, faGlobeEurope, faObjectGroup, faHome, faLayerGroup, faList, faListOl, faMap, faMapSigns, faLockOpen, faPeopleArrows,
    faPeopleGroup, faSearch, faScroll, faTh, faUser, faUsers, faWalking, faWallet, faWrench, faPrint, faFont, faFile, faShareFromSquare, faFileArrowUp, faFileArrowDown, faUpload, faDownload
} from '@fortawesome/free-solid-svg-icons';


@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        FontAwesomeModule
    ],
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent {

    faBars = faBars;
    faBook = faBook;
    faWpforms = faWpforms;
    faWalking = faWalking;
    faObjectGroup = faObjectGroup;
    faPeopleArrows = faPeopleArrows;
    faWallet = faWallet;
    faFileArrowDown = faFileArrowDown;
    faFileArrowUp = faFileArrowUp;
    faHome = faHome;
    faGlobeEurope = faGlobeEurope;
    faChartPie = faChartPie;
    faUser = faUser;
    faTh = faTh;
    faLockOpen = faLockOpen;
    faLayerGroup = faLayerGroup;
    faUsers = faUsers;
    faCogs = faCogs;
    faScroll = faScroll;
    faSearch = faSearch;
    faMap = faMap;
    faMapSigns = faMapSigns;
    faChartBar = faChartBar;

    faWrench = faWrench;
    faEnvelope = faEnvelope;
    faListOl = faListOl;
    faPeopleGroup = faPeopleGroup;
    faList = faList;
    faBuilding = faBuilding;
    faPrint = faPrint;
    faFont = faFont;
    faFile = faFile;
    faShareFromSquare = faShareFromSquare;
    faUpload = faUpload;
    faDownload = faDownload;


    @Input() isAdmin = false;
    @Input() isNormal = false;
    @Input() isLoading = false;
    @Input() show = true;

    adminMenu = [
        {
            link_name: 'Admin',
            link: null,
            icon: faBars,
            sub_menu: [
                {
                    link_name: 'Users',
                    link: '/user',
                    icon: faUsers
                },
                {
                    link_name: 'Imports',
                    link: '/import',
                    icon: faUsers
                },
                {
                    link_name: 'Exports',
                    link: '/export',
                    icon: faUsers
                }
            ]

        }
    ];

    constructor() { }

    ngOnInit() { }

    showSubmenu(itemEl: HTMLElement) {
        console.log('clicked showMenu')
        itemEl.classList.toggle('showMenu');
    }
}