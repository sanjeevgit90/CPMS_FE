import { Component, OnInit, Inject, Optional, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { InterDistrictDCService } from '../interDC.service';
import { SharedService } from '../../../service/shared.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectApprovalTaskService } from '../../../ProjectMgmt/ProjectApproval/projectapproval.service';
import { InvoiceTaskService } from '../../../BillingMgmt/Invoice/invoicetask/invoicetask.service';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  providers: [InterDistrictDCService, AppGlobals, DialogService, SharedService, ProjectApprovalTaskService, InvoiceTaskService]
})
export class ActionComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private dcService: InterDistrictDCService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService, private taskService: ProjectApprovalTaskService,
    private invoiceService: InvoiceTaskService,
    public dialogRef: MatDialogRef<ActionComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data) { }


  showLoading: boolean = false;
  disable = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;

  flag = '';

  PageTitle = "Action";
  dc = true;
  project = false;
  invoice = false;

  invoicedate = null;
  invoiceno = null;

  ActionData = {
    "approvalStatus": null, "remark": null, "assignToRole": null
  };

  addAssetForm: FormGroup;
  isSubmitted = false;

  back = function () {
    this.dialogRef.close(false);
  }

  processDC = function (action) {
    debugger;
    this.isSubmitted = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    if (this.addAssetForm.invalid) {
      return;
    }
    this.showLoading = true;

    this.dcService.processDC(this.ActionData, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Delivery Challan " + action + " successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          // this.addAssetForm.reset();
          this.dialogRef.close(false);

        })

    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });

  }

  editInterDC = function (id) {
    debugger;
    this.project = false;
    this.dc = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.dcService.taskById(id, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.ActionData = resp;

    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  processProject = function (action) {
    debugger;
    this.isSubmitted = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    if (this.addAssetForm.invalid) {
      return;
    }
    this.showLoading = true;

    this.taskService.processTask(this.ActionData, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Project " + action + " successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          // this.addAssetForm.reset();
          this.dialogRef.close(false);

        })

    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });

  }

  editProject = function (id) {
    debugger;
    this.dc = false;
    this.project = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.taskService.taskById(id, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.ActionData = resp;

    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  processInvoice = function (action) {
    debugger;
    this.isSubmitted = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    if (this.addAssetForm.invalid) {
      return;
    }
    this.showLoading = true;
    this.ActionData.invoiceno = this.invoiceno;
    this.ActionData.invoiceno = this.invoicedate.getTime();
    this.invoiceService.processTask(this.ActionData, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Invoice " + action + " successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          // this.addAssetForm.reset();
          this.dialogRef.close(false);

        })

    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });

  }

  editInvoice = function (id) {
    debugger;
    this.project = false;
    this.dc = false;
    this.invoice = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.invoiceService.taskById(id, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.ActionData = resp;

    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  ngOnInit(): void {
    debugger;
    this.addAssetForm = this.formBuilder.group({
      approvalStatus: [null, Validators.required],
      remark: [null],
      invoicedate: [null],
      invoiceno: [null]
    });

    if (this.data.flag == 'projectApproval') {
      this.editProject(this.data.id);
    }
    else if (this.data.flag == 'invoice') {
      this.editInvoice(this.data.id);
    } else {
      this.editInterDC(this.data.id);
    }


  }
  get formControls() {
    return this.addAssetForm.controls;
  }

}

