import { Component, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import moment from 'moment';
import { FormGroup } from '@angular/forms';
import { TemplateService } from '@app/services/template.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import Swal from 'sweetalert2';
import * as Papa from 'papaparse';

@Component({
  selector: 'app-template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.scss']
})
export class TemplateListComponent {
  public showLoader = false;
  moment: any = moment;
  campaignListForm: FormGroup;
  displayedColumns: string[] = ['id','templateCode', 'templateType', 'templateMsgType', 'status', 'inserttime'];
  dataSource!: MatTableDataSource<any>;
  templateData:any;
  @ViewChild('paginatorRef', { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;



  constructor(private location: Location, private templateService: TemplateService,  private ngxService: NgxUiLoaderService,){

  }
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>();
    this.paginator.pageIndex =0;
    this.paginator.pageSize = 5;
    this.getTemplateList();
  }
  getTemplateList() {
    this.showLoader = true;
    let templateUserId = sessionStorage.getItem('userId');
    let limit = this.paginator.pageSize.toString();  
    let start = (this.paginator.pageIndex * this.paginator.pageSize + 1).toString();
    this.ngxService.start();
    this.templateService.getTemplatelistDetails(templateUserId, limit, start, this.paginator.pageIndex, this.paginator.pageSize).subscribe({
      next: (res: any) => {
        this.templateData = res.template;
        this.dataSource.data = this.templateData;
        // Set the total length of the paginator based on the totalCount property
        this.paginator.length = res.totalCount;
        this.showLoader = false;
      },
      error: (err) => {
        this.templateData = [];
        this.dataSource.data = this.templateData;
        this.showLoader = false;
        console.log(err, "Error while fetching the records.");
      }
    });
  }
  

  onPageChanged(event: PageEvent) {
    this.getTemplateList();
  }

  editRow(data) {}
  deleteRow(id: any){}
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  goBack(): void {
    this.location.back();
  }

  

  downloadTemplateFile() {
    this.showLoader = true
    return this.get_download_Rcs_Template_Details_file();
  }

  get_download_Rcs_Template_Details_file() {
    this.showLoader = true;
    let templateUserId = sessionStorage.getItem('userId');
    let limit = this.paginator.pageSize.toString();
    let start = (this.paginator.pageIndex * this.paginator.pageSize + 1).toString();
    this.ngxService.start();


    this.templateService.getTemplateData(templateUserId, limit, start, this.paginator.pageIndex, this.paginator.pageSize).subscribe((data_ar: any) => {
      if (data_ar.template.length > 0) {
        console.log("template::=>" + JSON.stringify(data_ar))
        this.showLoader = false
        data_ar = data_ar.template.map((e) => {
          // Map only the desired properties with custom header names
          return {


            'Template Name/Code': e.templateCode,
            'Template Type': e.templateType,
            'Template Message Type': e.templateMsgType,
            'Status': e.status,
            'Creation Date': moment(e.inserttime).format('MM/DD/YYYY'),
            // Add more properties and header names as needed
          };


        });
        console.log("Campaign List::=>" + JSON.stringify(data_ar))

        var csv = Papa.unparse(data_ar); // Use the 'unparse' function from PapaParse
        var csvData = new Blob(['\uFEFF' + csv], {
          type: 'text/csv;charset=utf-8;'
        });
        var downloadUrl = document.createElement('a');
        downloadUrl.download = 'RCS_Template_Detail_Report.csv';
        downloadUrl.href = window.URL.createObjectURL(csvData);
        downloadUrl.click();
        this.showLoader = false
      } else {
        Swal.fire({
          title: 'Data Not Found',
          width: '250px',
          icon: 'error',
        });
      }
      this.showLoader = false
    }, error => {
      console.log(error)
      Swal.fire({
        title: 'Data Not Found',
        width: '250px',
        icon: 'error',
        // position: 'top-end',


      });
    });
    //  else {
    //   Swal.fire({
    //     title: 'Please Select the date',
    //     width: '250px',
    //     icon: 'error',
    //   });
    //   this.showLoader = false
    // }
    return null;
  }
}
