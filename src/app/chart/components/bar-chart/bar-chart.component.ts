import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit } from '@angular/core';

import * as d3 from 'd3';

import { IFrameworkData } from '../../containers/chart-shell/chart-shell.component';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {
  @Input() load = new EventEmitter<IFrameworkData[]>();

  private svg: any;
  private x: any;
  private y: any;
  private margin = 50;
  private width = 750 - (this.margin * 2);
  private height = 400 - (this.margin * 2);

  constructor() { }

  ngOnInit(): void {
    this.load.subscribe((data) => {
      if (!this.svg) {
        this.createSvg();
        this.drawBars(data);
      } else {
        this.updateBars(data);
      }
    });
  }

  private createSvg(): void {
    this.svg = d3.select("figure#bar")
      .append("svg")
      .attr("viewBox", `0 0 ${this.width + (this.margin * 2)} ${this.height + (this.margin * 2)}`)
      .append("g")
      .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
  }

  private drawBars(data: IFrameworkData[]): void {
    // Create the X-axis band scale
    this.x = d3.scaleBand()
      .range([0, this.width])
      .domain(data.map(d => d.framework))
      .padding(0.2);

    // Draw the X-axis on the DOM
    this.svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(this.x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Create the Y-axis band scale
    this.y = d3.scaleLinear()
      .domain([0, 200000])
      .range([this.height, 0]);

    // Draw the Y-axis on the DOM
    this.svg.append("g")
      .call(d3.axisLeft(this.y));

    // Create and fill the bars
    this.svg.selectAll("bars")
      .data(data)
      .enter()
      .append("rect")
      .transition()
      .duration(800)
      .attr("x", (d: IFrameworkData) => this.x(d.framework))
      .attr("y", (d: IFrameworkData) => this.y(d.stars))
      .attr("width", this.x.bandwidth())
      .attr("height", (d: IFrameworkData) => this.height - this.y(d.stars))
      .attr("fill", "#d04a35");
  }

  private updateBars(data: IFrameworkData[]): void {
    const update = this.svg.selectAll("rect").data(data);

    update.enter()
      .append("rect")
      .merge(update)
      .transition()
      .duration(800)
      .attr("x", (d: IFrameworkData) => this.x(d.framework))
      .attr("y", (d: IFrameworkData) => this.y(d.stars))
      .attr("width", this.x.bandwidth())
      .attr("height", (d: IFrameworkData) => this.height - this.y(d.stars))
      .attr("fill", "#d04a35");
  }

}
