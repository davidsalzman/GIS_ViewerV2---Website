import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit } from '@angular/core';

import * as d3 from 'd3';

import { IFrameworkData } from '../../containers/chart-shell/chart-shell.component';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {
  @Input() load = new EventEmitter<IFrameworkData[]>();

  private svg: any;
  private margin = 50;
  private width = 750;
  private height = 600;
  // The radius of the pie chart is half the smallest side
  private radius = Math.min(this.width, this.height) / 2 - this.margin;
  private colors: any;

  constructor() { }

  ngOnInit(): void {
    this.load.subscribe((data) => {
      this.createSvg();
      this.createColors(data);
      this.drawChart(data);
    });
  }

  private createSvg(): void {
    if (!this.svg) {
      this.svg = d3.select("figure#pie")
        .append("svg")
        .attr("viewBox", `0 0 ${this.width + (this.margin * 2)} ${this.height + (this.margin * 2)}`)
        .append("g")
        .attr(
          "transform",
          "translate(" + this.width / 2 + "," + this.height / 2 + ")"
        );
    } else {
      this.svg.selectAll("g > *").remove();
    }
  }

  private createColors(data: IFrameworkData[]): void {
    this.colors = d3.scaleOrdinal()
      .domain(data.map(d => d.stars.toString()))
      .range(["#c7d3ec", "#a5b8db", "#879cc4", "#677795", "#5a6782"]);
  }

  private drawChart(data: IFrameworkData[]): void {
    // Compute the position of each group on the pie:
    const pie = d3.pie<any>().value((d: IFrameworkData) => Number(d.stars));

    // Build the pie chart
    this.svg
      .selectAll('pieces')
      .data(pie(data))
      .enter()
      .append('path')
      .attr('d', d3.arc()
        .innerRadius(0)
        .outerRadius(this.radius)
      )
      .attr('fill', (d: any, i: any) => (this.colors(i)))
      .attr("stroke", "#121926")
      .style("stroke-width", "1px");

    // Add labels
    const labelLocation = d3.arc()
      .innerRadius(100)
      .outerRadius(this.radius);

    this.svg
      .selectAll('pieces')
      .data(pie(data))
      .enter()
      .append('text')
      .text((d: any) => d.data.framework)
      .attr("transform", (d: any) => "translate(" + labelLocation.centroid(d) + ")")
      .style("text-anchor", "middle")
      .style("font-size", 15);
  }
}
