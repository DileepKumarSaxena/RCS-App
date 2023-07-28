import { Component, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import moment from 'moment';
import { FormGroup } from '@angular/forms';
import { TemplateService } from '@app/services/template.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgxUiLoaderService } from 'ngx-ui-loader';

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
}
