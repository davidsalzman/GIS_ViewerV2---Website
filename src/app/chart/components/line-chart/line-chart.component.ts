import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit } from '@angular/core';

import * as d3 from 'd3';

import { ILineData } from '../../containers/chart-shell/chart-shell.component';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {
  @Input() load = new EventEmitter<ILineData[]>();

  private svg: any;
  private x: any;
  private xAxis: any;
  private y: any;
  private yAxis: any;
  private line: any;
  private margin = 50;
  private width = 750 - (this.margin * 2);
  private height = 400 - (this.margin * 2);

  constructor() { }

  ngOnInit(): void {
    this.load.subscribe((data) => {
      if (!this.svg) {
        this.createSvg(data);
        this.updateLine(data);
      } else {
        this.updateLine(data);
      }
    });
  }

  private createSvg(data: ILineData[]): void {
    this.svg = d3.select("figure#line")
      .append("svg")
      .attr("viewBox", `0 0 ${this.width + (this.margin * 2)} ${this.height + (this.margin * 2)}`)
      .append("g")
      .attr("transform", "translate(" + this.margin + "," + this.margin + ")");

    // Initialize an X axis
    this.x = d3.scaleTime()
      .range([0, this.width])
      .domain(<[Date, Date]>d3.extent(data, (d: ILineData) => d.date));

    this.xAxis = d3.axisBottom(this.x);

    this.svg.append("g")
      .attr("transform", `translate(0, ${this.height})`)
      .attr("class", "myXaxis");

    // Initialize an Y axis
    this.y = d3.scaleLinear()
      .range([this.height, 0])
      .domain(<[number, number]>d3.extent(data, (d: ILineData) => d.stars));
    this.yAxis = d3.axisLeft(this.y);
    this.svg.append("g")
      .attr("class", "myYaxis");
  }

  private updateLine(data: ILineData[]): void {
    // Create the X axis:
    this.x.domain(<[Date, Date]>d3.extent(data, (d: ILineData) => d.date));
    this.svg.selectAll(".myXaxis").transition()
      .duration(1000)
      .call(this.xAxis);

    // create the Y axis
    this.y.domain(<[number, number]>d3.extent(data, (d: ILineData) => d.stars));
    this.svg.selectAll(".myYaxis")
      .transition()
      .duration(1000)
      .call(this.yAxis);

    this.line = d3.line()
      .x((d: any) => this.x(d.date))
      .y((d: any) => this.y(d.stars));

    // Create a update selection: bind to the new data
    const u = this.svg.selectAll(".line")
      .data([data], (d: any) => d.date);

    // Updata the line
    u.join("path")
      .attr("class", "line")
      .transition()
      .duration(1000)
      .attr("d", this.line)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2.5);
  }
}
