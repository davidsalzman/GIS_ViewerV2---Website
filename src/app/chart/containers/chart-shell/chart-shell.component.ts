import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit } from '@angular/core';

import { BreadcrumbService } from 'src/app/shared/services/breadcrumb.service';

import { BarChartComponent } from '../../components/bar-chart/bar-chart.component';
import { LineChartComponent } from '../../components/line-chart/line-chart.component';
import { PieChartComponent } from '../../components/pie-chart/pie-chart.component';
import { ScatterChartComponent } from '../../components/scatter-chart/scatter-chart.component';

export interface IFrameworkData {
  framework: string,
  stars: number,
  released: number,
}

export interface ILineData {
  stars: number,
  date: Date
}

@Component({
  selector: 'app-chart-shell',
  standalone: true,
  imports: [
    CommonModule,

    BarChartComponent,
    LineChartComponent,
    PieChartComponent,
    ScatterChartComponent
  ],
  templateUrl: './chart-shell.component.html',
  styleUrls: ['./chart-shell.component.scss']
})
export class ChartShellComponent implements OnInit {
  public dataLoaded = new EventEmitter<IFrameworkData[]>();
  public dataLoaded2 = new EventEmitter<ILineData[]>();

  private data: IFrameworkData[] = [
    { framework: 'Vue', stars: 166443, released: 2014 },
    { framework: 'React', stars: 150793, released: 2013 },
    { framework: 'Angular', stars: 62342, released: 2016 },
    { framework: 'Backbone', stars: 27647, released: 2010 },
    { framework: 'Ember', stars: 21471, released: 2011 },
  ];

  private data2: IFrameworkData[] = [
    { framework: 'Vue', stars: 26443, released: 2014 },
    { framework: 'React', stars: 153793, released: 2013 },
    { framework: 'Angular', stars: 82342, released: 2016 },
    { framework: 'Backbone', stars: 17647, released: 2010 },
    { framework: 'Ember', stars: 23471, released: 2011 },
  ];

  private lineData: ILineData[] = [
    {
      date: new Date('2010-01-01'),
      stars: 100
    },
    {
      date: new Date('2011-01-01'),
      stars: 200
    },
    {
      date: new Date('2012-01-01'),
      stars: 300
    },
    {
      date: new Date('2013-01-01'),
      stars: 250
    },
    {
      date: new Date('2014-01-01'),
      stars: 350
    },
    {
      date: new Date('2015-01-01'),
      stars: 100
    },
    {
      date: new Date('2016-01-01'),
      stars: 500
    },
  ];

  private lineData2: ILineData[] = [
    {
      date: new Date('2010-01-01'),
      stars: 200
    },
    {
      date: new Date('2011-01-01'),
      stars: 210
    },
    {
      date: new Date('2012-01-01'),
      stars: 350
    },
    {
      date: new Date('2013-01-01'),
      stars: 150
    },
    {
      date: new Date('2014-01-01'),
      stars: 550
    },
    {
      date: new Date('2015-01-01'),
      stars: 100
    },
    {
      date: new Date('2016-01-01'),
      stars: 510
    },
  ];

  constructor(private breadcrumbService: BreadcrumbService) { }

  ngOnInit(): void {
    this.breadcrumbService.breadcrumbs = [{
      name: 'Charts'
    }];

    // Normal data would be loaded via an API this is just simulating that
    setTimeout(() => {
      this.dataLoaded.next(this.data);
      this.dataLoaded2.next(this.lineData);

      setTimeout(() => {
        this.dataLoaded.next(this.data2);
        this.dataLoaded2.next(this.lineData2);
      }, 5000);
    }, 1000);
  }
}
