import { Component, OnInit, ViewChild , Inject, Optional} from '@angular/core';
//import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { InvoiceTaskService } from './invoicetask.service';
import { SharedService } from '../../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { ActionComponent} from '../../../AssetMgmt/InterDistrictDeliveryChallan/action/action.component';
import { ViewInvoiceComponent} from '../viewinvoice/viewinvoice.component';

@Component({
  selector: 'app-invoicetask',
  templateUrl: './invoicetask.component.html',
  providers: [AppGlobals, DialogService, SharedService, InvoiceTaskService]
})
export class InvoiceTaskComponent implements OnInit {

  constructor( private router: Router, private route: ActivatedRoute, private http: HttpClient, private taskService: InvoiceTaskService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService, private dialog: MatDialog) { }
  
  displayedColumns: string[] = ['customername', 'milestoneno','projectname','action'];
  historyColumns: string[] = ['customername', 'milestoneno','projectname'];
  TaskRecord: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  showLoading: boolean = false;
  history: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;

  FilterData = {};

  PageTitle = "Invoice Task List";
  filterDiv:boolean = false;
  
  
  filterFunc = function() {
    debugger;
    this.filterDiv = true;
  }
  cancel = function() {
    debugger;
    this.filterDiv = false;
    this.FilterData = {};
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.TaskRecord.filter = filterValue.trim().toLowerCase();
  }
   search = function () {
    debugger;

    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.taskService.getTaskList(this.FilterData, headers).subscribe(resp => {
      debugger;
      this.TaskRecord= new MatTableDataSource(resp);
      this.TaskRecord.sort = this.sort;
      this.TaskRecord.paginator = this.paginator;
      this.totalRecords = this.TaskRecord.filteredData.length;
      this.history=false;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  getHistoryTask = function () {
    debugger;

    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.taskService.getHistoryTask(this.FilterData, headers).subscribe(resp => {
      debugger;
      this.TaskRecord= new MatTableDataSource(resp);
      this.TaskRecord.sort = this.sort;
      this.TaskRecord.paginator = this.paginator;
      this.totalRecords = this.TaskRecord.filteredData.length;
      this.history=true;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  action = function (id) {
    debugger;
    this.data = {};
    this.data.id = id;
    this.data.flag = 'invoice';
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "70%";
    dialogConfig.data = this.data;
    this.dialog.open(ActionComponent, dialogConfig).afterClosed().subscribe(res => {
      debugger;
      this.search();
    })
  }

  viewInvoice = function (id) {
    debugger;
    this.data = {};
    this.data.id = id;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "70%";
    dialogConfig.data = this.data;
    this.dialog.open(ViewInvoiceComponent, dialogConfig).afterClosed().subscribe(res => {
      debugger;

    })
  }
url='';
  ngOnInit(): void {
    debugger;
    this.search();
    
    this.url = this._global.baseUrl;
  }

 

}
