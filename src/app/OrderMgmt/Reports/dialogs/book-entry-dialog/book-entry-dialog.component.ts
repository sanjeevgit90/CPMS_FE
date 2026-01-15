import { Component, OnInit, Inject  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpHeaders } from '@angular/common/http';
import { PoReportsService } from '../../po-reports.service'; 

@Component({
  selector: 'app-book-entry-dialog',
  templateUrl: './book-entry-dialog.component.html',
  styleUrls: ['./book-entry-dialog.component.css']
})
export class BookEntryDialogComponent implements OnInit {
  
  bookEntryNo: string;
  isSubmitting = false;

  constructor(
    private dialogRef: MatDialogRef<BookEntryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private poReportsService: PoReportsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
  }

  submit() {
    if (!this.bookEntryNo || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    const body = {
      entityId: this.data.entityId,
      bookEntryNo: this.bookEntryNo
    };

    const header = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.poReportsService.updatePrsBookEntry(body, header)
      .subscribe({
        next: () => {
          this.snackBar.open(
            'Book Entry Number saved successfully',
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
            'Failed to save Book Entry Number',
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
