import { NgModule } from '@angular/core';

import { MatButtonModule, MatToolbarModule, MatIconModule, MatCardModule, MatMenuModule, MatInputModule, MatProgressBarModule, MatBottomSheetModule, MatSelectModule, MatSidenavModule, MatTableModule, MatPaginatorModule, MatSortModule, MatDialogModule, MatSnackBarModule, MatProgressSpinnerModule } from '@angular/material';

@NgModule({
    providers: [],
    imports: [MatButtonModule, MatToolbarModule, MatIconModule, MatCardModule, MatMenuModule, MatInputModule, MatProgressBarModule, MatBottomSheetModule, MatSelectModule, MatSidenavModule, MatTableModule, MatPaginatorModule, MatSortModule, MatDialogModule, MatSnackBarModule, MatProgressSpinnerModule],
    exports: [MatButtonModule, MatToolbarModule, MatIconModule, MatCardModule, MatMenuModule, MatInputModule, MatProgressBarModule, MatBottomSheetModule, MatSelectModule, MatSidenavModule, MatTableModule, MatPaginatorModule, MatSortModule, MatDialogModule, MatSnackBarModule, MatProgressSpinnerModule],
})

export class MaterialModule { }