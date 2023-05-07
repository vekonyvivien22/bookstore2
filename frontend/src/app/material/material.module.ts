import { NgModule } from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatBadgeModule } from '@angular/material/badge';

import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [],
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatCardModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatGridListModule,
    MatListModule,
    MatTableModule,
    MatMenuModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatBadgeModule,
  ],
  exports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatCardModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatGridListModule,
    MatListModule,
    MatTableModule,
    MatMenuModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatBadgeModule,
  ],
})
export class MaterialModule {}
