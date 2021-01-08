import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AlertModule } from 'ngx-bootstrap/alert';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { DetailComponent } from './modals/detail.component';
import { Crm01Component } from './crm01/crm01.component';
import { Crm02Component } from './crm02/crm02.component';
import { RouterModule } from '@angular/router';
import { AppRoutes } from './app.routing';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    DetailComponent,
    Crm01Component,
    Crm02Component
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    NgxSpinnerModule,
    BrowserAnimationsModule,
    AlertModule.forRoot(),
    RouterModule.forRoot(AppRoutes, {enableTracing: false}),
    CommonModule,
    BsDatepickerModule.forRoot(),
    FormsModule
  ],
  providers: [AppService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
