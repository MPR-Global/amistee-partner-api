import { Component } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from "ngx-spinner";

import { AppService } from '../app.service';
import { DetailComponent } from '../modals/detail.component';

@Component({
  selector: 'app-crm01',
  templateUrl: './crm01.component.html',
  styleUrls: ['./crm01.component.css']
})
export class Crm01Component {
  title = 'amistee-fe';
  rows: any;
  columns: any;
  response: any;
  pageSize = 10;
  alert: any;
  displayAlert: any;
  modalRef: BsModalRef;
  subscription: any;
  constructor(private appService: AppService,
    private modalService: BsModalService,
    private spinner: NgxSpinnerService) {
    this.response = {
      "data": [
          {
              "zip": "12345",
              "date": "12/23/2020",
              "typeOfEstimate": "Air Duct Cleaning",
              "address": "Address",
              "city": "City",
              "message": "Comment by Sanjay",
              "createdDate": "2020-12-26T19:07:56.277Z",
              "phone": "45657121212",
              "name": "SANJAY",
              "state": "STATE",
              "time": "1:43 PM",
              "id": 51926778,
              "email": "san@gmail.com",
              "hear": "From WEB",
              "fromSource": "http://localhost/amistee/amistee-duct-cleaning-contact_us.htm"
          },
          {
              "zip": "12345",
              "date": "12/23/2020",
              "typeOfEstimate": "Air Duct Cleaning",
              "address": "Address",
              "city": "City",
              "message": "Comment by Sanjay",
              "createdDate": "2020-12-26T19:23:36.659Z",
              "phone": "45657121212",
              "name": "SANJAY",
              "state": "STATE",
              "time": "1:43 PM",
              "id": 512417802,
              "email": "san@gmail.com",
              "hear": "From WEB",
              "fromSource": "http://localhost/amistee/amistee-duct-cleaning-contact_us.htm"
          },
          {
              "zip": "12345",
              "date": "12/23/2020",
              "typeOfEstimate": "Air Duct Cleaning",
              "address": "Address",
              "city": "City",
              "message": "Comment by Sanjay",
              "createdDate": "2020-12-26T19:36:00.931Z",
              "phone": "45657121212",
              "name": "SANJAY PAATE",
              "state": "STATE",
              "time": "1:43 PM",
              "id": 8387711134,
              "email": "san@gmail.com",
              "hear": "From WEB",
              "fromSource": "http://localhost/amistee/amistee-duct-cleaning-contact_us.htm"
          }
      ]
    };
    this.columns = [
      { 
        prop: 'name',
        name: 'Name',
        flexGrow: 1
      },
      { 
        name: 'Email',
        prop: 'email',
        flexGrow: 1
      },
      { 
        name: 'Phone',
        prop: 'phone',
        flexGrow: 1
      },
      { 
        name: 'State',
        prop: 'state',
        flexGrow: 1
      },
      { 
        name: 'City',
        prop: 'city',
        flexGrow: 1
      },
      { 
        name: 'Assigned To',
        prop: 'assignedTo',
        flexGrow: 1
      },
      { 
        name: 'Push to mHelpDesk',
        prop: 'pushToHelpDesk',
        flexGrow: 1
      },
      { 
        name: 'Notes',
        prop: 'notes',
        flexGrow: 2
      },
      { 
        name: 'Message',
        prop: 'message',
        flexGrow: 3
      }];
  }

  ngOnInit() {
    this.subscription = this.appService.getMessage().subscribe( (message) => {
      const messageObject = message.message;
      this.displayAlert = false;
      if(messageObject && messageObject.refresh) {
        this.alert = {
          type: 'success',
          message: 'Contact details updated successfully'
        }
        this.displayAlert = true;
        this.getData();
      } else {
        this.alert = {
          type: 'danger',
          message: 'Error while updating contact details'
        }
        this.displayAlert = true;
      }
    })
    this.getData();
  }

  getData() {
    this.spinner.show();
    this.appService.getContacts().subscribe( (response: any) => {
      this.spinner.hide();
      if (response && response.data) {
        this.rows = response.data;
      }
    }, 
    (error: any) => {
      this.spinner.hide();
      this.alert = {
        type: 'danger',
        message: 'Error while gettings contact queries'
      }
      this.displayAlert = true;
    });
  }

  onSelect(event) {
    if (event && event.selected && event.selected.length) {
      this.modalRef = this.modalService.show(DetailComponent, {
        initialState: {
          data: event.selected[0]
        },
        class: 'modal-lg custom-modal',
        backdrop: 'static'
      });
    }
  }
}
