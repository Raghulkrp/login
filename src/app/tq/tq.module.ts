import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr'
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatChipsModule } from '@angular/material/chips'
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatTabsModule } from '@angular/material/tabs';
import { NgxPaginationModule } from 'ngx-pagination'
import { TQRoutingModule } from './tq-routing.module';
import { TqQueryComponent } from './tq-query/tq-query.component';

@NgModule({
  declarations: [TqQueryComponent],
  imports: [
    CommonModule,
    TQRoutingModule,
     MatIconModule, ToastrModule.forRoot(),
    FormsModule, MatInputModule, MatRadioModule, MatTooltipModule, MatProgressSpinnerModule,
    ReactiveFormsModule, HttpClientModule, MatTableModule, MatAutocompleteModule, MatTabsModule,
    MatCheckboxModule, MatSelectModule, MatNativeDateModule, MatButtonModule,
    BrowserAnimationsModule, MatFormFieldModule, MatDatepickerModule, NgxPaginationModule, MatChipsModule
  ]
})
export class TQModule { }
