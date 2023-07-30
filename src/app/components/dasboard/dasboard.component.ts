import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReportsService } from '@app/services/reports.service';
import { ChartConfiguration, ChartData, ChartEvent, ChartOptions, ChartType } from 'chart.js';
import moment from 'moment';
import { BaseChartDirective } from 'ng2-charts';
@Component({
  selector: 'app-dasboard',
  templateUrl: './dasboard.component.html',
  styleUrls: ['./dasboard.component.scss']
})
export class DasboardComponent {
  dashBoardForm:FormGroup;
  currentDate = new Date();
  public showLoader = false;
  dashboardData: any[];
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  counters: NodeListOf<Element>;
  totalSum: number = 0;
  startDate:HTMLInputElement;
  endDate:HTMLInputElement;
  constructor(
    private reportservice: ReportsService,
    private formbuilder: FormBuilder,
  ){
    this.dashboardReport();
  }

  ngOnInit() {
    this.currentDate = new Date(this.currentDate.setDate(this.currentDate.getDate()));
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


    this.getSummaryDate()
  }

  getSummaryDate(){
    let username = sessionStorage.getItem('username');
    let from = moment(this.currentDate).format('YYYY-MM-DD');
    let to = moment(this.currentDate).format('YYYY-MM-DD');
    this.reportservice.getSummaryData(username, from, to).subscribe({
      next: (res: any) => {
        this.dashboardData = res.data;
        console.log(this.dashboardData, "Counts");
        this.calculateTotalSum();
        this.showLoader=false
      },
      error:(err) =>{
        console.log(err, "Error while fetching the records.");
        this.showLoader = false;
      }
    })
  }

  getSummaryData(startDate: HTMLInputElement, endDate: HTMLInputElement){
    this.showLoader=true;
    let username = sessionStorage.getItem('username');
    let from = moment(startDate.value).format('YYYY-MM-DD');
    let to = moment(endDate.value).format('YYYY-MM-DD');
    this.reportservice.getSummaryData(username, from, to).subscribe({
      next: (res: any) => {
        this.dashboardData = res.data;
        console.log(this.dashboardData, "Counts");
        this.calculateTotalSum();
        this.showLoader=false
      },
      error:(err) =>{
        console.log(err, "Error while fetching the records.");
        this.showLoader = false;
      }
    })
  }

  dashboardReport() {
    this.dashBoardForm = this.formbuilder.group({
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
      campaignId:[],
      leadId:[],
    })
  }
  calculateTotalSum() {
    if (this.dashboardData && this.dashboardData.length > 0) {
      this.totalSum = this.dashboardData.reduce((sum, item) => {
        return sum + item.TOTAL + item.SUBMITTED + item.Delivered + item.NonRCS_FAILED;
      }, 0);
    } else {
      this.totalSum = 0;
  }
}

getSum(index: string)  {
  let sum = 0;
  for(let i = 0; i < this.dashboardData.length; i++) {
    sum += this.dashboardData[i][index];
  }
  return sum;
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
