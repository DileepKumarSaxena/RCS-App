import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import moment from 'moment';
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'app-template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.scss']
})
export class TemplateListComponent {
  public showLoader = false;
  moment: any = moment;
  campaignListForm: FormGroup;
  displayedColumns: string[] = ['id','campaignName', 'description', 'messageJson', 'campaignStartTime', 'actions'];
  dataSource!: MatTableDataSource<any>;
  
  constructor(private location: Location){

  }
  getCampaignList(){}
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
