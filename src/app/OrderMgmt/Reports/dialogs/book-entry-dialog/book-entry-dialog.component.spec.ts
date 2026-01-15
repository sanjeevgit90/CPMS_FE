import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookEntryDialogComponent } from './book-entry-dialog.component';

describe('BookEntryDialogComponent', () => {
  let component: BookEntryDialogComponent;
  let fixture: ComponentFixture<BookEntryDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookEntryDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookEntryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
