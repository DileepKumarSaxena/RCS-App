import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthenticationService } from '@app/_services';
import { AddUserService } from '@app/services/add-user.service';
import { ReportsService } from '@app/services/reports.service';
import { Chart, ChartConfiguration, ChartData, ChartEvent, ChartOptions, ChartType } from 'chart.js';
import moment from 'moment';
import { BaseChartDirective } from 'ng2-charts';

// function oneMonthAgoValidator(): ValidatorFn {
//   return (control: AbstractControl): { [key: string]: any } | null => {
//     const startDate = control.get('startDate').value;
//     const endDate = control.get('endDate').value;
//     const oneMonthAgo = moment().subtract(1, 'months');

//     if (startDate && endDate) {
//       if (moment(startDate) < oneMonthAgo || moment(endDate) < oneMonthAgo) {
//         return { oneMonthAgo: true };
//       }
//     }

//     return null;
//   };
// }

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
  userId = sessionStorage.getItem('userId');
  userListbysearch: any;
  dataSource: any;
  userData: any;

  constructor(
    private reportservice: ReportsService,
    private formbuilder: FormBuilder,
    private userservice: AddUserService,
    private authenticationService: AuthenticationService
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

   if (this.userId === '1') {
      this.fetchUserList();
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      // this.updateChartData();
      this.updateLineChartData();
    }, 100);
  }

  getSummaryDate() {
    this.showLoader = true;
    let username = sessionStorage.getItem('username');
    let from = moment(this.currentDate).format('YYYY-MM-DD');
    let to = moment(this.currentDate).format('YYYY-MM-DD');
    // let from = moment('2023-08-16').format('YYYY-MM-DD');
    // let to = moment('2023-08-16').format('YYYY-MM-DD');
    this.reportservice.getSummaryDataHourlyBasis(username, from, to).subscribe({
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
        // this.updateChartData();
        this.updateChartData(this.dashboardData);
        this.updateLineChartData();
        this.showLoader = false
      },
      error: (err) => {
        console.log(err, "Error while fetching the records.");
        this.showLoader = false;
      }
    })
  }

  // getSummaryData(startDate: HTMLInputElement, endDate: HTMLInputElement) {
  //   this.showLoader = true;
  //   let username = sessionStorage.getItem('username');
  //   let from = moment(startDate.value).format('YYYY-MM-DD');
  //   let to = moment(endDate.value).format('YYYY-MM-DD');
  //   this.reportservice.getSummaryData(username, from, to).subscribe({
  //     next: (res: any) => {
  //       console.log(res, "resresresres");
  //       this.dashboardData = res.data;
  //       this.calculateTotalSum();
  //       this.updateChartData();
  //       this.showLoader = false
  //     },
  //     error: (err) => {
  //       console.log(err, "Error while fetching the records.");
  //       this.showLoader = false;
  //     }
  //   })
  // }

  getSummaryDataHourly(startDate: HTMLInputElement, endDate: HTMLInputElement) {
    this.showLoader = true;
    let username = this.dashBoardForm.value.userName;
    let from = moment(startDate.value).format('YYYY-MM-DD');
    let to = moment(endDate.value).format('YYYY-MM-DD');
    this.reportservice.getSummaryDataHourlyBasis(username, from, to).subscribe({
      next: (res: any) => {
        console.log(res, "resresresres");
        this.dashboardData = res.data;
        this.updateChartData(this.dashboardData); // Update the chart with the API data
        this.showLoader = false;
      },
      error: (err) => {
        if (err.status === 401) {
          // Log the user out here (e.g., by calling a logout function)
          console.log("Unauthorized. Logging out...");
          this.authenticationService.logout();
          window.location.reload();
        } else {
          console.log(err, "Error while fetching the records.");
          this.showLoader = false;
        }
      }
    });
  }

  // dashboardReport() {
  //   this.dashBoardForm = this.formbuilder.group(
  //     {
  //       startDate: [moment().format('YYYY-MM-DD'), Validators.required],
  //       endDate: [moment().format('YYYY-MM-DD'), Validators.required],
  //       campaignId: [],
  //       leadId: [],
  //       userName: [],
  //     },
  //     { validator: oneMonthAgoValidator() }
  //   );
  // }

  dashboardReport() {
    this.dashBoardForm = this.formbuilder.group({
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
      campaignId: [],
      leadId: [],
      userName: [],
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
      x: {
        display: true,
        ticks: { autoSkip: false },
      },
      y: {
        min: 0
      }
    },
    plugins: {
      legend: { display: false },
    }
  };

  public todayDate = moment().format('YYYY-MM-DD');
  // public barChartLabels: string[] = [this.todayDate];
  public barChartLabels: string[] = [];

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

  updateChartData(apiData: any[]) {
    if (!apiData || apiData.length === null) {
      return;
    }

    // Aggregate data by date
    const aggregatedData: Record<string, any> = {};

    apiData.forEach(item => {
      const date = item.created_date; // Assuming 'created_date' is the date field
      if (!aggregatedData[date]) {
        aggregatedData[date] = {
          TOTAL: 0,
          SUBMITTED: 0,
          Delivered: 0,
          NonRCS_FAILED: 0,
          failed: 0,
          Invalid: 0,
        };
      }

      aggregatedData[date].TOTAL += item.TOTAL;
      aggregatedData[date].SUBMITTED += item.SUBMITTED;
      aggregatedData[date].Delivered += item.Delivered;
      aggregatedData[date].NonRCS_FAILED += item.NonRCS_FAILED;
      aggregatedData[date].failed += item.failed;
      aggregatedData[date].Invalid += item.Invalid;
    });

    // Extract the aggregated dates and data
    const sortedDates = Object.keys(aggregatedData).sort(); // Sort dates in ascending order
    const labels = sortedDates;
    const datasets = [
      { data: sortedDates.map(date => aggregatedData[date].TOTAL), label: 'Total Request', backgroundColor: '#343a40' },
      { data: sortedDates.map(date => aggregatedData[date].SUBMITTED), label: 'Total Submitted', backgroundColor: '#f3bb45' },
      { data: sortedDates.map(date => aggregatedData[date].Delivered), label: 'Total Delivered', backgroundColor: '#5FC29F' },
      { data: sortedDates.map(date => aggregatedData[date].NonRCS_FAILED), label: 'Total Rejected - NonRCS', backgroundColor: '#eb5e28' },
      { data: sortedDates.map(date => aggregatedData[date].failed), label: 'Total Failed', backgroundColor: '#7438c0' },
      { data: sortedDates.map(date => aggregatedData[date].Invalid), label: 'Total Invalid Number', backgroundColor: '#a70606' },
    ];

    this.barChartLabels = labels;
    this.barChartData = {
      labels: labels,
      datasets: datasets,
    };

    if (this.chart) {
      this.chart.update();
    }
  }


  // Line Chart Start Here
  lineChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: {
        tension: 0.5,
        fill: true,
        backgroundColor: 'rgba(243, 187, 69, 0.2)'
      }
    },
    scales: {
      x: {
        display: true,
      },
      y: {
        min: 0
      }
    }

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
  public lineChartLegend = true;


  updateLineChartData() {
    let dataKeys = ['TOTAL', 'Delivered', 'NonRCS_FAILED', 'SUBMITTED', 'Failed', 'Invalid'];

    let currentHour = new Date().getHours();
    let uploadedHours = this.dashboardData.map(entry => entry.datehour);

    // Find the earliest uploaded hour
    let earliestUploadedHour = Math.min(...uploadedHours);

    // Calculate the starting hour (1 hour back from the earliest uploaded hour)
    let startHour = earliestUploadedHour - 1;
    if (startHour < 0) {
      startHour = 0;
    }

    // Combine uploaded hours with the current hour and the starting hour
    let hoursToShow = [...new Set([...uploadedHours, currentHour, startHour])];
    hoursToShow.sort((a, b) => a - b); // Sort in ascending order

    // Generate labels for the combined hours
    let hourLabels = hoursToShow.map(hour => `${hour}:00`);
    this.lineChartLabels = hourLabels;

    dataKeys.forEach((key, index) => {
      let data: number[] = new Array<number>(hoursToShow.length).fill(0);

      // Fill the data array with values for uploaded hours
      this.dashboardData.forEach(entry => {
        const hour = entry.datehour;
        let hourIndex = hoursToShow.indexOf(hour);
        if (hourIndex !== -1) {
          data[hourIndex] = entry[key];
        }
      });

      this.lineChartData[index].data = data;
    });

    this.lineChart?.update();
  }

  fetchUserList() {
    this.showLoader = true
    this.userservice.getUserReport().subscribe({
      next: (res: any) => {
        this.userListbysearch = res;
        // this.dataSource.data = this.userData;
        this.showLoader = false
      },
      error: (err) => {
        this.userData = [];
        this.dataSource.data = this.userData;
        console.log(err, "Error while fetching the records.");
        this.showLoader = false
      }
    });
  }

}
