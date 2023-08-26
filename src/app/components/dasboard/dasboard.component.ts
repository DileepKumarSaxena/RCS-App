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


  chartTypes: { [key: string]: ChartType } = {
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
    }, 100);
  }

  getSummaryDate() {
    let username = sessionStorage.getItem('username');
    let from = moment(this.currentDate).format('YYYY-MM-DD');
    let to = moment(this.currentDate).format('YYYY-MM-DD');
    // let from = moment('2023-08-15').format('YYYY-MM-DD');
    // let to = moment('2023-08-15').format('YYYY-MM-DD');
    this.reportservice.getSummaryData(username, from, to).subscribe({
      next: (res: any) => {
        // res.data[0]['datehour'] = 9;
        console.log(res.data[0]['datehour'], "datehour");
        // res.data.forEach(el =>{
        //   el['TOTAL'] = 50;
        //   el['SUBMITTED'] = 30;
        //   el['Delivered'] = 15;
        //   el['failed'] = 5;
        //   el['NonRCS_FAILED'] = 5;
        //   el['Invalid'] = 5;
        // })
        console.log(res, "RRRRRR");
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
    this.reportservice.getSummaryDataSearch(username, from, to).subscribe({
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
      { data: [], label: 'Total Delivered', backgroundColor: '#5FC29F' },
      { data: [], label: 'Total Rejected - NonRCS', backgroundColor: '#eb5e28' },
      { data: [], label: 'Total Failed', backgroundColor: '#7438c0' },
      { data: [], label: 'Total Invalid Number', backgroundColor: '#a70606' },
    ],
  };

  updateChartData() {
    let dataKeys = ['TOTAL', 'SUBMITTED', 'Delivered', 'NonRCS_FAILED', 'failed', 'Invalid'];

    dataKeys.forEach((key, index) => {
      let sum = this.getSum(key);
      this.barChartData.datasets[index].data = Array(this.barChartLabels.length).fill(sum);
      console.log(this.barChartData.datasets[index].data, "SumData");
    });

    this.chart?.update();
  }



  // Line Chart Start Here
  lineChartOptions: any = {
    responsive: true,
    maintainAspectRatio: true,
    elements: {
      line: {
        tension: 0.5,
        fill: true,
        backgroundColor: 'rgba(243, 187, 69, 0.2)'
      }
    },

  };


  lineChartData: any[] = [
    { data: [], label: 'Request', borderColor: 'rgba(52, 58, 64, 1)', backgroundColor: 'rgba(52, 58, 64, 0.2)', pointBackgroundColor: 'rgba(52, 58, 64, 0.2)' },
    { data: [], label: 'Delivered', borderColor: 'rgba(95, 194, 159, 1)', backgroundColor: 'rgba(95, 194, 159, 0.2)', pointBackgroundColor: 'rgba(95, 194, 159, 0.2)' },
    { data: [], label: 'Rejected - NonRCS', borderColor: 'rgba(235, 94, 40, 1)', backgroundColor: 'rgba(235, 94, 40, 0.2)', pointBackgroundColor: 'rgba(235, 94, 40, 0.2)' },
    { data: [], label: 'Submitted', borderColor: 'rgba(243, 187, 69, 1)', backgroundColor: 'rgba(243, 187, 69, 0.2)', pointBackgroundColor: 'rgba(243, 187, 69, 0.2)' },
    { data: [], label: 'Failed', borderColor: 'rgba(116, 56, 192, 1)', backgroundColor: 'rgba(116, 56, 192, 0.2)', pointBackgroundColor: 'rgba(116, 56, 192, 0.2)' },
    { data: [], label: 'Invalid Number', borderColor: 'rgba(167, 6, 6, 1)', backgroundColor: 'rgba(167, 6, 6, 0.2)', pointBackgroundColor: 'rgba(167, 6, 6, 0.2)' }
  ];


  public lineChartLabels: string[] = [];
  public lineChartLegend = false;

  // updateLineChartData() {
  //   if (this.dashboardData && this.dashboardData.length > 0) {
  //     let dataKeys = ['TOTAL', 'SUBMITTED', 'Delivered', 'failed', 'NonRCS_FAILED', 'Invalid'];
  //     let currentHour = new Date().getHours();
  //     let hourLabels = Array.from({ length: currentHour + 1 }, (_, i) => `${i}:00`); // Generate labels from 0 to 23

  //     this.lineChartLabels = hourLabels;
  //     console.log(hourLabels, 'hourLabels');
  //     dataKeys.forEach((key, index) => {
  //       let data: number[] = new Array<number>(24).fill(0);

  //       this.dashboardData.forEach(entry => {
  //         const hour = entry.datehour;
  //         data[hour] = entry[key];
  //       });

  //       this.lineChartData[index].data = data;
  //     });

  //     this.lineChart?.update();
  //   }
  // }


  updateLineChartData() {
    if (this.dashboardData && this.dashboardData.length > 0) {
      let dataKeys = ['TOTAL', 'Delivered', 'NonRCS_FAILED', 'SUBMITTED', 'failed', 'Invalid'];

      // let currentHour = new Date().getHours();

      // Find the maximum hour with data
      let maxDataHour = Math.max(...this.dashboardData.map(entry => entry.datehour));
      console.log(maxDataHour, "maxDataHour");
      // Generate labels from 0 to the maximum data hour
      let hourLabels = Array.from({ length: maxDataHour + 1 }, (_, i) => `${i}:00`);

      this.lineChartLabels = hourLabels;

      dataKeys.forEach((key, index) => {
        let data: number[] = new Array<number>(maxDataHour + 1).fill(0);

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
