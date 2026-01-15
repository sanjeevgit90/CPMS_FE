import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpHeaders } from '@angular/common/http';
import { PoReportsService } from '../../po-reports.service';  

@Component({
  selector: 'app-payment-details-dialog',
  templateUrl: './payment-details-dialog.component.html',
  styleUrls: ['./payment-details-dialog.component.css']
})
export class PaymentDetailsDialogComponent {

  paymentDoneDate: Date;
  paymentBookEntryNo: string;
  isSubmitting = false;


  constructor(
    private dialogRef: MatDialogRef<PaymentDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private poReportsService: PoReportsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
  }

  
    submit() {
    if (!this.paymentDoneDate || !this.paymentBookEntryNo || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    const body = {
      entityId: this.data.entityId,
      paymentDoneDate: this.paymentDoneDate.getTime(),
      paymentBookEntryNo: this.paymentBookEntryNo
    };

    const header = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.poReportsService.updatePrsPaymentDetails(body, header)
    .subscribe({
      next: () => {
        this.snackBar.open(
          'Payment details saved successfully',
          'Close',
          {
            duration: 3000,
            panelClass: ['success-snackbar']
          }
        );

        this.dialogRef.close(true);
      },
      error: () => {
        this.isSubmitting = false;
        this.snackBar.open(
          'Failed to save payment details',
          'Close',
          {
            duration: 4000,
            panelClass: ['error-snackbar']
          }
        );
      }
    });

  }

  close() {
    this.dialogRef.close(false);
  }

}
