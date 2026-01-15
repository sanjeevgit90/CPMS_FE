import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { PoReportsService } from '../po-reports.service';
import { SharedService } from '../../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { BookEntryDialogComponent } from '../dialogs/book-entry-dialog/book-entry-dialog.component';
import { PaymentDetailsDialogComponent } from '../dialogs/payment-details-dialog/payment-details-dialog.component';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-prs-report',
  templateUrl: './prs-report.component.html',
  providers: [PoReportsService, AppGlobals, DialogService, SharedService]

})
export class PrsReportComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private poReportsService: PoReportsService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService, private dialog: MatDialog
  ) { }

  displayedColumns: string[] = ['prsNo','projectPin','purchaseOrderNo','partyName','invoiceNo','invoiceAmount','paymentDueDate','approvalStatus','totalWithoutTaxes','totalTaxes','poGrandTotalInr','currency', 'action'];
  PrsReportData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  showLoading: boolean = false;
  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  PageTitle = "Prs Report";
  add = true;
  edit = false;
  list = true;
  addPrsReportForm: FormGroup;

  projectId: number | string;
  fromDate: string;
  toDate: string;

  prsReportList: any[] = [];
  prsReportRequestBody: any;
  header: any;
  body: any;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.PrsReportData.filter = filterValue.trim().toLowerCase();
  }
  PrsData = {
    "prsNo":null, "purchaseOrderNumber": null, "projectName": null, "issueChequeTo": null, "approvalStatus": null, "fromDate": null, "toDate": null
  };

  cancel = function() {
    this.PrsData = {};
    this.search();
  }

    // Search function
    search = function () {
      debugger;
    
      const headers = { "Authorization": sessionStorage.getItem("token") };
      if(this.PrsData.fromDate != null){
        this.PrsData.fromDate = this.PrsData.fromDate.getTime();
      }
      if(this.PrsData.toDate != null){
        this.PrsData.toDate = this.PrsData.toDate.getTime();
      }
      this.showLoading = true;
      this.poReportsService.getPrsReport(this.PrsData, headers).subscribe(resp => {
        debugger;
        this.showLoading = false;
        this.PrsReportData = new MatTableDataSource(resp.content);
        this.PrsReportData.sort = this.sort;
        this.PrsReportData.paginator = this.paginator;
        this.totalRecords = this.PrsReportData.filteredData.length;
      }, (error: any) => {
        
        this.showLoading = false;
        const errStr = error.error.errorDetail[0];
        this.dialogService.openConfirmDialog(errStr)
        this.PrsData.fromDate = new Date(this.PrsData.fromDate);
        this.PrsData.toDate = new Date(this.PrsData.toDate);
      });
    }

  // Party List
  partyList:any = [];
  getActiveVendors = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getActiveParty(headers).subscribe(resp => {
      debugger;
      this.partyList = resp;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // getting project list
  projectList: any = [];
  getAllProjects = function () {

    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getProjectList(headers).subscribe(resp => {

      this.showLoading = false;
      this.projectList = resp;
    }, (error: any) => {

      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  
openBookEntryPopup(row) {
  const dialogRef = this.dialog.open(BookEntryDialogComponent, {
    width: '400px',
    disableClose: true,
    data: { entityId: row.entityId }
  });

  dialogRef.afterClosed().subscribe(success => {
    if (success) {
      this.loadPrsReport();   // ✅ THIS IS ENOUGH
    }
  });
}

openPaymentDetailsPopup(row) {
  const dialogRef = this.dialog.open(PaymentDetailsDialogComponent, {
    width: '450px',
    disableClose: true,
    data: { entityId: row.entityId }
  });

  dialogRef.afterClosed().subscribe(success => {
    if (success) {
      this.loadPrsReport();   // ✅ SAME HERE
    }
  });
}



reloadPrsReport() {
  this.poReportsService.getPrsReport(this.body, this.header)
    .subscribe((res: any) => {
      this.prsReportList = res;
    });
}



loadPrsReport() {
  this.prsReportRequestBody = {
    projectId: this.projectId,
    fromDate: this.fromDate,
    toDate: this.toDate
  };

  this.header = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  this.poReportsService.getPrsReport(
    this.prsReportRequestBody,
    this.header
  ).subscribe((res: any) => {
    this.prsReportList = res.data;
  });
}

    isBookEntryBtnDisabled(row): boolean {
      // Disable ONLY after it is saved
      return !!row?.bookEntryNo && row.bookEntryNo.trim() !== '';
    }

    isPaymentDetailsBtnDisabled(row): boolean {
      // Disable ONLY after payment details are saved
      return !!row?.paymentDoneDate && !!row?.paymentBookEntryNo;
    }

    // isBookEntryBtnVisible(row): boolean {
    //   // if (!row) {
    //   //   return false;
    //   // }
    //   return !row.bookEntryNo || row.bookEntryNo.trim() === '';
    // }

    // isPaymentDetailsBtnVisible(row): boolean {
    //   return !row?.paymentDoneDate || !row?.paymentBookEntryNo;
    // }

   isBookEntryBtnVisible(row): boolean {
      if (!row) {
        return false;
      }
      // Show ONLY if book entry NOT saved
      return !row.bookEntryNo || row.bookEntryNo.trim() === '';
    }

    isPaymentDetailsBtnVisible(row): boolean {
      if (!row) {
        return false;
      }

      // Show ONLY after book entry saved
      if (!row.bookEntryNo || row.bookEntryNo.trim() === '') {
        return false;
      }

      // Hide if payment already saved
      if (row.paymentDoneDate && row.paymentBookEntryNo) {
        return false;
      }

      return true;
    }

    isActionCompleted(row): boolean {
      return !!row?.bookEntryNo &&
            !!row?.paymentDoneDate &&
            !!row?.paymentBookEntryNo;
    }


    ngOnInit(): void {

      //Fromgroup collection
      this.addPrsReportForm = this.formBuilder.group({
        prsNo: [null],
        purchaseOrderNumber: [null],
        projectName: [null],
        issueChequeTo: [null],
        fromDate: [null],
        toDate: [null],
        approvalStatus: [null]
      });
      this.search();
      this.getActiveVendors();
      this.getAllProjects();
    }
    get formControls() { return this.addPrsReportForm.controls; }
  }
  
