import { Component, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
@Component({
  selector: 'app-dasboard',
  templateUrl: './dasboard.component.html',
  styleUrls: ['./dasboard.component.scss']
})
export class DasboardComponent {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  counters: NodeListOf<Element>;
  ngOnInit() {
    this.counters = document.querySelectorAll(".counter");

    this.counters.forEach((counter: Element) => {
      counter.textContent = "0";
      const updateCounter = () => {
        const target = +counter.getAttribute("data-target");
        const count = +counter.textContent;
        const increment = target / 200;
        if (count < target) {
          counter.textContent = `${Math.ceil(count + increment)}`;
          setTimeout(updateCounter, 1);
        } else {
          counter.textContent = target.toString();
        }
      };
      updateCounter();
    });
    
  }
  public barChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.4
      }
    },
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 10
      }
    },
    plugins: {
      legend: { display: true },
    }
  };
  public barChartLabels: string[] = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];
  public barChartType: ChartType = 'bar';

  public barChartData: ChartData<'bar'> = {
    labels: this.barChartLabels,
    datasets: [
      { data: [ 65, 59, 80, 81, 56, 55, 40 ], label: 'Submitted' },
      { data: [ 28, 48, 40, 19, 86, 27, 90 ], label: 'Delivered' }
    ]
  };

  // events
  public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  public randomize(): void {
    this.barChartType = this.barChartType === 'bar' ? 'line' : 'bar';
  }  
}
