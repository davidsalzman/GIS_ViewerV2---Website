import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit } from '@angular/core';

import * as d3 from 'd3';

import { IFrameworkData } from '../../containers/chart-shell/chart-shell.component';

@Component({
  selector: 'app-scatter-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scatter-chart.component.html',
  styleUrls: ['./scatter-chart.component.scss']
})
export class ScatterChartComponent implements OnInit {
  @Input() load = new EventEmitter<IFrameworkData[]>();

  private svg: any;
  private margin = 50;
  private width = 750 - (this.margin * 2);
  private height = 400 - (this.margin * 2);

  constructor() { }

  ngOnInit(): void {
    this.load.subscribe((data) => {
      this.createSvg();
      this.drawPlot(data);
    });
  }

  private createSvg(): void {
    if (!this.svg) {
      this.svg = d3.select("figure#scatter")
        .append("svg")
        .attr("viewBox", `0 0 ${this.width + (this.margin * 2)} ${this.height + (this.margin * 2)}`)
        .append("g")
        .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
    } else {
      this.svg.selectAll("g > *").remove();
    }
  }

  private drawPlot(data: IFrameworkData[]): void {
    // Add X axis
    const x = d3.scaleLinear()
      .domain([2009, 2017])
      .range([0, this.width]);
    this.svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([0, 200000])
      .range([this.height, 0]);
    this.svg.append("g")
      .call(d3.axisLeft(y));

    // Add dots
    const dots = this.svg.append('g');
    dots.selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d: IFrameworkData) => x(d.released))
      .attr("cy", (d: IFrameworkData) => y(d.stars))
      .attr("r", 7)
      .style("opacity", .5)
      .style("fill", "#69b3a2");

    // Add labels
    dots.selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .text((d: IFrameworkData) => d.framework)
      .attr("x", (d: IFrameworkData) => x(d.released))
      .attr("y", (d: IFrameworkData) => y(d.stars))
  }
}
