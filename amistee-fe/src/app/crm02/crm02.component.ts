import { Component } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from "ngx-spinner";

import { AppService } from '../app.service';
import { DetailComponent } from '../modals/detail.component';

@Component({
  selector: 'app-crm02',
  templateUrl: './crm02.component.html',
  styleUrls: ['./crm02.component.css']
})
export class Crm02Component {
  title = 'amistee-fe';
  rows: any;
  columns: any;
  response: any;
  pageSize = 10;
  alert: any;
  displayAlert: any;
  modalRef: BsModalRef;
  fromDateModel: Date;
  toDateModel: Date;
  assignedToModel: any;
  subscription: any;
  dateConfig = {
    containerClass: 'theme-dark-blue',
    dateInputFormat: 'YYYY-MM-DD'
  };
  rowsClone: any = [];
  isDataAvailable = false;
  constructor(private appService: AppService,
    private modalService: BsModalService,
    private spinner: NgxSpinnerService) {
    this.response = {"data":[{"zip":"","date":"01/06/2021","typeOfEstimate":"Duct Lining Powered by DuctArmor","address":"","notes":"test","city":"","pushToHelpDesk":"no","updatedDate":"2021-01-06T17:34:55.348Z","type":"","message":"test","furnaces":"","assignedTo":null,"createdDate":"2021-01-06T17:33:24.322Z","size":"","phone":"773-991-3261","name":"Rohit","state":"","time":"12:33 PM","id":6750680466,"email":"rohitl@mprglobalsolutions.com","hear":"","fromSource":"http://13.126.131.57/"},{"zip":"","date":"01/06/2021","typeOfEstimate":"Duct Sealing powered by Aeroseal","address":"","city":"","updatedDate":"2021-01-06T16:33:03.944Z","type":"","message":"Comments By SP","furnaces":"","createdDate":"2021-01-06T16:33:03.944Z","size":"","phone":"942-821-9319","name":"SP PATEl","state":"","time":"11:33 AM","id":3499945768,"email":"sanj@gmail.com","hear":"","fromSource":"http://13.126.131.57/"},{"zip":"","date":"01/06/2021","typeOfEstimate":"Air Duct Cleaning","address":"","notes":"Commnts t SP","city":"","pushToHelpDesk":null,"updatedDate":"2021-01-06T16:28:10.672Z","type":"","message":"Commnts t SP","furnaces":"","assignedTo":null,"createdDate":"2021-01-06T12:33:53.313Z","size":"","phone":"834-736-9385","name":"Sanjay Patel_new","state":"","time":"7:33 AM","id":8346505363,"email":"sanju20591@gmail.com","hear":"","fromSource":"http://13.126.131.57/"},{"zip":"385120","date":"01/06/2021","typeOfEstimate":"Dryer Vent Cleaning","address":"B-23 Gaurinagar society, Ghatlodia","city":"Ahmedabad","updatedDate":"2021-01-06T08:33:47.050Z","type":"","message":"6Th Jany","furnaces":"","createdDate":"2021-01-06T08:33:47.050Z","size":"","phone":"8347369385","name":"Sanjay Patel","state":"Gujarat","time":"3:33 AM","id":2311002463,"email":"sanju20591@gmail.com","hear":"dfdf","fromSource":"http://13.126.131.57/"},{"zip":"385120","date":"12/30/2020","typeOfEstimate":"Air Duct Cleaning","address":"B-23 Gaurinagar society, Ghatlodia","notes":"Commetns By Sanjay and Rohit1\n","city":"Ahmedabad","pushToHelpDesk":"yes","updatedDate":"2020-12-30T17:57:56.478Z","type":"","message":"Commetns By Sanjay and Rohit","furnaces":"","assignedTo":"Sanjay Patel","createdDate":"2020-12-30T16:40:19.637Z","size":"","phone":"8347369385","name":"Rohit l","state":"Gujarat","time":"11:40 AM","id":6709592722,"email":"sanju20591@gmail.com","hear":"Cp,et","fromSource":"http://localhost/amistee/amistee-duct-cleaning-contact_us.htm"},{"zip":"385120","date":"12/30/2020","typeOfEstimate":"Air Duct Cleaning","address":"B-23 Gaurinagar society, Ghatlodia","city":"Ahmedabad","updatedDate":"2020-12-30T16:38:51.906Z","type":"","message":"Comments","furnaces":"","createdDate":"2020-12-30T16:38:51.906Z","size":"","phone":"8347369385","name":"Sanjay Patel","state":"Gujarat","time":"11:38 AM","id":8589837588,"email":"sanju20591@gmail.com","hear":"sdsd","fromSource":"http://localhost/amistee/amistee-duct-cleaning-contact_us.htm"},{"zip":"12345","address":"Address","createdDate":"2020-12-28T18:32:39.751Z","city":"City","phone":"45657121212","name":"SANJAY PAATE11111111","state":"STATE","id":2141742250,"updatedDate":"2020-12-29T18:15:58.287Z","message":null,"email":"abc@gmail.com"},{"createdDate":"2020-12-28T18:31:01.894Z","phone":"45657121212","name":"SANJAY PAATEL","id":1061143157,"updatedDate":"2020-12-29T16:21:46.286Z","state":null,"message":null,"email":"san@gmail.com"},{"zip":"385120","date":"12/28/2020","typeOfEstimate":"Air Duct and Dryer Vent Cleaning","address":"B-23 Gaurinagar society, Ghatlodia","city":"Ahmedabad","updatedDate":"2020-12-29T16:18:44.514Z","type":"","message":"Comments bY Snau","furnaces":"","createdDate":"2020-12-28T18:21:51.859Z","size":"","phone":"8347369385","name":"Sanjay Patel 28121","state":"Gujarat","time":"1:21 PM","id":3060690163,"email":"sanju20591@gmail.com","hear":"dTYO","fromSource":"http://localhost/amistee/amistee-duct-cleaning-contact_us.htm"},{"zip":"340012","date":"12/28/2020","typeOfEstimate":"Insultation","address":"Addeess","city":"city","updatedDate":"2020-12-28T17:52:17.183Z","type":"","message":"Cimment","furnaces":"","createdDate":"2020-12-28T17:52:17.183Z","size":"","phone":"1234567","name":"Sanjay","state":"state","time":"12:52 PM","id":9106961042,"email":"sanja@gmail.com","hear":"Comments by RWE","fromSource":"http://localhost/amistee/amistee-duct-cleaning-contact_us.htm"},{"zip":"38004","date":"12/28/2020","typeOfEstimate":"Dryer Vent Cleaning","address":"Add","notes":"Comments by SPComments by SPComments by SPComments by SPComments by SPComments by SPComments by SPComments by SPComments by SPComments by SPComments by SPComments by SPComments by SPComments by SPComments by SPComments by SPComments by SPComments by","city":"City","pushToHelpDesk":"yes","updatedDate":"2020-12-30T18:09:05.447Z","type":"","message":"Comments by SPComments by SPComments by SPComments by SPComments by SPComments by SPComments by SPComments by SPComments by SPComments by SPComments by SPComments by SPComments by SPComments by SPComments by SPComments by SPComments by SPComments by","furnaces":"","assignedTo":"sas","createdDate":"2020-12-28T17:51:41.592Z","size":"","phone":"1212121212","name":"SANJAY_1234","state":"STATE","time":"12:51 PM","id":1316391868,"email":"sanj@gmail.com","hear":"NEW R WEB","fromSource":"http://localhost/amistee/amistee-duct-cleaning-contact_us.htm"},{"zip":"385120","date":"12/28/2020","typeOfEstimate":"Air Duct Cleaning","address":"B-23 Gaurinagar society, Ghatlodia","city":"Ahmedabad","updatedDate":"2020-12-29T16:06:31.423Z","type":"","message":"Comments by SPComments by SPComments by SPComments by SPComments by SPComments by SPComments by SPComments by SPComments by SP\nComments by SPComments by SPComments by SPComments by SPComments by SPComments by SPComments by SPComments by SPComments by SPComments by SPComments by SPComments by SPComments by SPComments by SP1\n","furnaces":"","createdDate":"2020-12-28T17:08:10.933Z","size":"","phone":"83473693851","name":"Sanjay Patel1","state":"Gujarat12","time":"12:08 PM","id":7859040641,"email":"sanju20591@gmail.com1","hear":"SD","fromSource":"http://localhost/amistee/amistee-duct-cleaning-contact_us.htm"},{"zip":"12345","date":"12/23/2020","typeOfEstimate":"Air Duct Cleaning","address":"Address","notes":"Comment by Sanjay","city":"City","pushToHelpDesk":"yes","updatedDate":"2021-01-06T17:38:52.078Z","message":"Comment by Sanjay","assignedTo":null,"createdDate":"2020-12-28T16:39:41.519Z","phone":"45657121212","name":"SANJAY PAATE","state":"STATE","time":"1:43 PM","id":3813036688,"email":"san@gmail.com","hear":"From WEB","fromSource":"http://localhost/amistee/amistee-duct-cleaning-contact_us.htm"},{"zip":"12345","date":"12/23/2020","typeOfEstimate":"Air Duct Cleaning","address":"Address","city":"City","updatedDate":"2020-12-27T18:26:41.521Z","message":"Comment by Sanjay","createdDate":"2020-12-27T18:26:41.521Z","phone":"45657121212","name":"SANJAY PAATE","state":"STATE","time":"1:43 PM","id":2639252104,"email":"san@gmail.com","hear":"From WEB","fromSource":"http://localhost/amistee/amistee-duct-cleaning-contact_us.htm"},{"zip":"12345","date":"12/23/2020","typeOfEstimate":"Air Duct Cleaning","address":"Address","notes":"Comment by Sanjay","city":"City","pushToHelpDesk":null,"updatedDate":"2021-01-06T16:35:27.519Z","message":"Comment by Sanjay","assignedTo":null,"createdDate":"2020-12-27T18:26:40.005Z","phone":"45657121212","name":"SANJAY PAATE_NEW_NEW","state":"STATE","time":"1:43 PM","id":3587725417,"email":"san@gmail.com","hear":"From WEB","fromSource":"http://localhost/amistee/amistee-duct-cleaning-contact_us.htm"},{"zip":"12345","date":"12/23/2020","typeOfEstimate":"Air Duct Cleaning","address":"Address","notes":"Comment by Sanjay","city":"City","pushToHelpDesk":null,"updatedDate":"2021-01-06T16:35:12.000Z","message":"Comment by Sanjay","assignedTo":null,"createdDate":"2020-12-27T18:26:37.737Z","phone":"45657121212","name":"SANJAY PAATEL","state":"STATE","time":"1:43 PM","id":9701981939,"email":"san@gmail.com","hear":"From WEB","fromSource":"http://localhost/amistee/amistee-duct-cleaning-contact_us.htm"},{"zip":"12345","date":"12/23/2020","typeOfEstimate":"Air Duct Cleaning","address":"Address","city":"City","updatedDate":"2020-12-27T18:26:34.991Z","message":"Comment by Sanjay","createdDate":"2020-12-27T18:26:34.991Z","phone":"45657121212","name":"SANJAY PAATE","state":"STATE","time":"1:43 PM","id":8501668871,"email":"san@gmail.com","hear":"From WEB","fromSource":"http://localhost/amistee/amistee-duct-cleaning-contact_us.htm"},{"zip":"12345","date":"12/23/2020","typeOfEstimate":"Air Duct Cleaning","address":"Address","city":"City","updatedDate":"2020-12-28T17:27:14.337Z","message":"Comment by Sanjay","createdDate":"2020-12-26T19:36:00.931Z","phone":"45657121212","name":"SANJAY PAATE12","state":"STATE12","time":"1:43 PM","id":8387711134,"email":"san@gmail.com","hear":"From WEB","fromSource":"http://localhost/amistee/amistee-duct-cleaning-contact_us.htm"},{"zip":"12345","date":"12/23/2020","typeOfEstimate":"Air Duct Cleaning","address":"Address","city":"City","updatedDate":"2020-12-27T19:14:39.122Z","message":"Comment by Sanjay12","createdDate":"2020-12-26T19:23:36.659Z","phone":"45657121212","name":"SANJAY12","state":"STATE","time":"1:43 PM","id":512417802,"email":"san@gmail.com","hear":"From WEB","fromSource":"http://localhost/amistee/amistee-duct-cleaning-contact_us.htm"},{"zip":"12345","date":"12/23/2020","typeOfEstimate":"Air Duct Cleaning","address":"Address","city":"City","updatedDate":"2020-12-27T18:43:40.098Z","message":"Comment by Sanjay","createdDate":"2020-12-26T19:07:56.277Z","phone":"45657121212","name":"New new1234556","state":"STATE","time":"1:43 PM","id":51926778,"email":"san@gmail.com","hear":"From WEB","fromSource":"http://localhost/amistee/amistee-duct-cleaning-contact_us.htm"}]}
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
      },
      { 
        name: 'Update'
      }];
  }

  ngOnInit() {
    this.subscription = this.appService.getMessage().subscribe( (message) => {
      const messageObject = message.message;
      this.displayAlert = false;
      if(messageObject && messageObject.success) {
        this.alert = {
          type: 'success',
          message: 'Contact details updated successfully'
        }
        this.displayAlert = true;
        if (messageObject.refresh) {
          this.getData();
        }
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
    this.isDataAvailable = false;
    this.appService.getContacts().subscribe( (response: any) => {
      this.spinner.hide();
      this.isDataAvailable = true;
      if (response && response.data) {
        this.rows = response.data;
        this.rowsClone = [...this.rows];
      }
    }, 
    (error: any) => {
      this.spinner.hide();
      this.alert = {
        type: 'danger',
        message: 'Error while gettings contact queries'
      };
      this.isDataAvailable = true;
      this.displayAlert = true;
      if (this.response && this.response.data) {
        this.rows = this.response.data;
        this.rowsClone = [...this.rows];
      }
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

  doSearch() {
    if ((this.fromDateModel && this.toDateModel) || this.assignedToModel) {
      this.isDataAvailable = false;
      let rows = this.rowsClone;
      if (this.fromDateModel && this.toDateModel) {
        this.fromDateModel.setUTCHours(0,0,0,0);
        this.toDateModel.setUTCHours(23,59,59,999);
        const fromDate = this.fromDateModel.toISOString();
        const toDate = this.toDateModel.toISOString();
        rows = this.rowsClone.filter( (row: any) => {
          return (row.createdDate >= fromDate && row.createdDate <= toDate)
        });
      }

      if (this.assignedToModel) {
        rows = rows.filter( (row: any) => {
          return (row.assignedTo === this.assignedToModel)
        });
      }
      this.rows = rows;
      this.isDataAvailable = true;
    }
  }

  doUpdate(row) {
    const bodyData = this.prepareRequestBody(row);
    this.spinner.show();
      this.appService.update(
        {data: bodyData}, row.id).subscribe((response) => {
        this.spinner.hide();
        this.appService.sendMessage({
          refresh: false,
          success: true
        });
      }, (err) => {
        console.log(err);
        this.spinner.hide();
        this.appService.sendMessage({
          refresh: false,
          success: false
        });
      })
  }

  prepareRequestBody(row) {
    return {
      notes: row.notes,
      message: row.message,
      assignedTo: row.assignedTo
    }
  }

  resetFilters() {
    this.fromDateModel = null;
    this.toDateModel = null;
    this.assignedToModel = null;
    this.rows = this.rowsClone;
    // this.getData();
  }

  updateValue(event, cell, rowIndex) {
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
  }
}
