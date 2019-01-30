import { NgModule } from '@angular/core';

import { MatButtonModule, MatToolbarModule, MatIconModule, MatCardModule, MatMenuModule, MatInputModule, MatProgressBarModule, MatBottomSheetModule, MatSelectModule, MatSidenavModule, MatTableModule, MatPaginatorModule, MatSortModule, MatDialogModule, MatSnackBarModule, MatProgressSpinnerModule, MatListModule, MatTooltipModule, MatExpansionModule } from '@angular/material';

@NgModule({
    providers: [],
    imports: [MatButtonModule, MatToolbarModule, MatIconModule, MatCardModule, MatMenuModule, MatInputModule, MatProgressBarModule, MatBottomSheetModule, MatSelectModule, MatSidenavModule, MatTableModule, MatPaginatorModule, MatSortModule, MatDialogModule, MatSnackBarModule, MatProgressSpinnerModule, MatListModule, MatTooltipModule, MatExpansionModule],
    exports: [MatButtonModule, MatToolbarModule, MatIconModule, MatCardModule, MatMenuModule, MatInputModule, MatProgressBarModule, MatBottomSheetModule, MatSelectModule, MatSidenavModule, MatTableModule, MatPaginatorModule, MatSortModule, MatDialogModule, MatSnackBarModule, MatProgressSpinnerModule, MatListModule, MatTooltipModule, MatExpansionModule],
})

export class MaterialModule { }