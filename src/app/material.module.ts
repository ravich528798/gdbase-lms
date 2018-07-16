import { NgModule } from '@angular/core';

import { MatButtonModule, MatToolbarModule, MatIconModule, MatCardModule, MatMenuModule, MatInputModule, MatProgressBarModule, MatBottomSheetModule, MatSelectModule, MatSidenavModule, MatTableModule, MatPaginatorModule, MatSortModule } from '@angular/material';

@NgModule({
    providers: [],
    imports: [MatButtonModule, MatToolbarModule, MatIconModule, MatCardModule, MatMenuModule, MatInputModule, MatProgressBarModule, MatBottomSheetModule, MatSelectModule, MatSidenavModule, MatTableModule, MatPaginatorModule, MatSortModule],
    exports: [MatButtonModule, MatToolbarModule, MatIconModule, MatCardModule, MatMenuModule, MatInputModule, MatProgressBarModule, MatBottomSheetModule, MatSelectModule, MatSidenavModule, MatTableModule, MatPaginatorModule, MatSortModule],
})

export class MaterialModule { }