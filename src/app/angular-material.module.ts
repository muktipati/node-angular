import { NgModule } from '@angular/core';
import {
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinner,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatDialogModule
  } from '@angular/material';

@NgModule({
    exports:[
        MatInputModule,
        MatCardModule,
        MatButtonModule,
        MatToolbarModule,
        MatExpansionModule,
        MatPaginatorModule,
        MatDialogModule,
        MatProgressSpinnerModule,
    ]
})
export class AngularMaterialModule {

}