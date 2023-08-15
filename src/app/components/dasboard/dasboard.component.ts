import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReportsService } from '@app/services/reports.service';
import { Chart, ChartConfiguration, ChartData, ChartEvent, ChartOptions, ChartType } from 'chart.js';
import moment from 'moment';
import { BaseChartDirective } from 'ng2-charts';
@Component({
  selector: 'app-dasboard',
  templateUrl: './dasboard.component.html',
  styleUrls: ['./dasboard.component.scss']
})
export class DasboardComponent implements AfterViewInit {
  dashBoardForm: FormGroup;
  currentDate = new Date();
  public showLoader = false;
  dashboardData: any[] = [];
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  @ViewChild(BaseChartDirective) lineChart: BaseChartDirective;
  counters: NodeListOf<Element>;
  totalSum: number = 0;
  startDate: HTMLInputElement;
  endDate: HTMLInputElement;
  constructor(
    private reportservice: ReportsService,
    private formbuilder: FormBuilder,
  ) {
    this.dashboardReport();
    
  }

  
  chartTypes: {[key: string]: ChartType} = {
    line: 'line',
    bar: 'bar'
 };
 lineChartType = this.chartTypes['line'];


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


    this.getSummaryDate();

    
  }

  ngAfterViewInit() {
    setTimeout(() => {
    this.updateChartData();
    this.updateLineChartData();
    },100);
 }

  getSummaryDate() {
    let username = sessionStorage.getItem('username');
    let from = moment(this.currentDate).format('YYYY-MM-DD');
    let to = moment(this.currentDate).format('YYYY-MM-DD');
    this.reportservice.getSummaryData(username, from, to).subscribe({
      next: (res: any) => {
        this.dashboardData = res.data;
        this.calculateTotalSum();
        this.updateChartData();
        this.updateLineChartData();
        this.showLoader = false
      },
      error: (err) => {
        console.log(err, "Error while fetching the records.");
        this.showLoader = false;
      }
    })
  }

  getSummaryData(startDate: HTMLInputElement, endDate: HTMLInputElement) {
    this.showLoader = true;
    let username = sessionStorage.getItem('username');
    let from = moment(startDate.value).format('YYYY-MM-DD');
    let to = moment(endDate.value).format('YYYY-MM-DD');
    this.reportservice.getSummaryData(username, from, to).subscribe({
      next: (res: any) => {
        console.log(res, "resresresres");
        this.dashboardData = res.data;
        this.calculateTotalSum();
        this.updateChartData();
        this.showLoader = false
      },
      error: (err) => {
        console.log(err, "Error while fetching the records.");
        this.showLoader = false;
      }
    })
  }

  dashboardReport() {
    this.dashBoardForm = this.formbuilder.group({
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
      campaignId: [],
      leadId: [],
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

  getSum(index: string) {
    let sum = 0;
    for (let i = 0; i < this.dashboardData.length; i++) {
      sum += this.dashboardData[i][index];
    }
    return sum;
  }


  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    elements: {
      line: {
        tension: 0.4
      }
    },
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

  public todayDate = moment().format('YYYY-MM-DD');
  public barChartLabels: string[] = [this.todayDate];

  public barChartType: ChartType = 'bar';

  public barChartData: ChartData<'bar'> = {
    labels: this.barChartLabels,
    datasets: [
      { data: [], label: 'Total Request', backgroundColor: '#343a40' },
      { data: [], label: 'Total Submitted', backgroundColor: '#f3bb45' },
      { data: [], label: 'Total Delivered', backgroundColor: '#68b3c8' },
      { data: [], label: 'Total Failed', backgroundColor: '#7438c0' },
      { data: [], label: 'Total Rejected - NonRCS', backgroundColor: '#eb5e28' },
      { data: [], label: 'Total Invalid Number', backgroundColor: '#a70606' },
    ],
  };

  updateChartData() {
    let dataKeys = ['TOTAL', 'SUBMITTED', 'Delivered', 'failed', 'NonRCS_FAILED', 'Invalid'];

    dataKeys.forEach((key, index) => {
      let sum = this.getSum(key);
      this.barChartData.datasets[index].data = Array(this.barChartLabels.length).fill(sum);
      console.log(this.barChartData.datasets[index].data, "SumData");
    });

    this.chart?.update();
  }
  


  // Line Chart Start Here
  public lineChartOptions: any = {
    responsive: true,
    maintainAspectRatio: true,
  };
  
  lineChartData: any[] = [
    { data: [], label: 'Total Submitted', borderColor: '#f3bb45', backgroundColor: '#f3bb45', pointBackgroundColor: '#f3bb45' },
    { data: [], label: 'Total Delivered', borderColor: '#68b3c8', backgroundColor: '#68b3c8', pointBackgroundColor: '#68b3c8'  },
    { data: [], label: 'Total Rejected - NonRCS', borderColor: '#eb5e28', backgroundColor: '#eb5e28', pointBackgroundColor: '#eb5e28' }
  ];
  
  public lineChartLabels: string[] = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];  
  public lineChartLegend = true;

  updateLineChartData() {
    if (this.dashboardData && this.dashboardData.length > 0) {
      const dataKeys = ['SUBMITTED', 'Delivered', 'NonRCS_FAILED'];
  
      dataKeys.forEach((key, index) => {
        let data: number[] = new Array<number>(24).fill(0);
  
        this.dashboardData.forEach(entry => {
          const hour = entry.datehour;
          data[hour] = entry[key];
        });
  
        this.lineChartData[index].data = data;
      });
  
      this.lineChart?.update();
    }
  }
  
  
  
}
