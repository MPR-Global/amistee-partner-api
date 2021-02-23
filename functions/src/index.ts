import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as bodyParser from "body-parser";
import * as request from 'request';
import axios, { AxiosRequestConfig } from 'axios';
import { validationResult } from 'express-validator';
import { OAuth2Client } from 'google-auth-library';
import { sendScheduleJobEmail, sendInsulationEstimateEmail } from './emailHelper';
import { userCreationValidators, mobileValidators, scheduleValidators, loginValidators, insulationEstimateValidators } from './validators';
import * as qs from 'qs'
const cors = require("cors");
const { google } = require("googleapis");
const sheets = google.sheets("v4");
// const _ = require("lodash");
const serviceAccount = require("../serviceAccount.json");

admin.initializeApp(functions.config().firebase);
const db = admin.firestore(); // Add this
db.settings({ ignoreUndefinedProperties: true })
const ScheduleSheetId = '1NjwE3GDKllzpNMIgeL60CSeZ8lWJVFEyDqvynpN6Fc4';
const InsulationSheetId = '116AEbPOmNJQBETet_EcCui-qNoNc4JCSSkk3AnCWW5k';
const googleClientID = '580094730932-tkv7n7rf7f3si881siljhbu5f4n14sf6.apps.googleusercontent.com';
const googleClient = new OAuth2Client(googleClientID);
const app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const jwtClient = new google.auth.JWT({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const jwtAuthPromise = jwtClient.authorize();


export const webApi = functions.https.onRequest(app);


async function  getToken(){
  var options:AxiosRequestConfig = { 
      method: 'POST',
      url: 'https://login.mhelpdesk.com/connect/token',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: qs.stringify({ 
          client_id: 'LC1fO4yAi0-ktkoTL-q_KQ',
          client_secret: 'nYSfbiiU',
          grant_type: 'password',
          scope: 'openid profile offline_access mhdapi',
          username: 'rohitl@mprglobalsolutions.com',
          password: 'Amistee123' 
      })
  };

 var res = await axios(options);
 return res.data.access_token;
  // var options = { 
  //   method: 'POST',
  //   url: 'https://login.mhelpdesk.com/connect/token',
  //   headers: { 'content-type': 'application/x-www-form-urlencoded' },
  //   form: { 
  //       client_id: 'LC1fO4yAi0-ktkoTL-q_KQ',
  //       client_secret: 'nYSfbiiU',
  //       grant_type: 'password',
  //       scope: 'openid profile offline_access mhdapi',
  //       username: 'rohitl@mprglobalsolutions.com',
  //       password: 'Amistee123' 
  //   }
  // };

  // request(options, function (error, res, body) {
  // if (error) throw new Error(error);
  
  // const data = JSON.parse(body);
  // console.log('inside get token',data);
  // console.log('token=',data.access_token);
  // return data.access_token;
  // });
}

async function SyncToSheets (jsonData: any, sheetId: string) {
  await jwtAuthPromise;
  let keys = Object.keys(jsonData);
  let rows = [];
    let row: any[] = [];
    keys.forEach((key) => {
      // console.log('data of columns='+key,jsonData[key]);
      row.push(jsonData[key] || "");
    });
    rows.push(row);
  let sheetData = [...rows];
  let range = `Schedules!A1:${String.fromCharCode(
    65 + keys.length
  )}`;

  await jwtAuthPromise
  await sheets.spreadsheets.values.append({
      auth: jwtClient,
      spreadsheetId: sheetId,
      range: range,  // update this range of cells
      valueInputOption: 'RAW',
      requestBody: { values: sheetData }
  }, {})
}

app.get('/warmup', (request, response) => {
    response.send('Warming up friend.');
})

   

app.post('/register', userCreationValidators, async (request: any, response: any) => {
    try {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({ errors: errors.array() });
        }
        const { contractor_name, business_name, mob_number, email, password, company_name } = request.body;
        const data = {
            contractor_name, 
            business_name,
            mob_number,
            email,
            company_name,
            password,
            status:true
        } 
        const user = await db.collection('contractors').select("id").where("mob_number", "==", mob_number).get();

        if (!user.empty){
            // console.log('contractor exist')
            response.status(409).json({message: 'User already exist with this mobile number.'});
            // throw new Error('Contractor doesnt exist.')
        }else{
            const empRef = await db.collection('contractors').add(data);
            const emp = await empRef.get();
            response.json({
                id: empRef.id,
                data: emp.data()
            });
        }

  } catch(error){
    response.status(500).send(error);
  }
})

app.post('/checklogin', mobileValidators, async (request: any, response: any) => {
  try {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }
    const mobile = request.body.mob_number;
    const userQuerySnapshot = await db.collection('contractors').where("mob_number", "==", mobile).get();

    if (!userQuerySnapshot.empty){
        const users:any = [];
        userQuerySnapshot.forEach(
            (doc) => {
                users.push(doc.data());
            }
        );
        response.json(users);
    }else{
        response.status(404).json({message: 'User dose not exist with this mobile number.'});
    }
  } catch(error){
    response.status(500).send(error);
  }
})

app.post('/contractors/login', async (request, response) => {
  try {
    const { mob_number, password } = request.body;
    const empQuerySnapshot = await db.collection('contractors').where('status', '==',true).where('mob_number', '==',mob_number).where('password', '==', password).get();
    const emps:any = [];
    empQuerySnapshot.forEach(
        (doc) => {
          emps.push({
            contractor_name: doc.data().contractor_name,
            company_name: doc.data().company_name,
            business_name: doc.data().business_name,
            mob_number: doc.data().mob_number,
            email: doc.data().email,
            id: doc.id,
          });
        }
    );
      if(emps.length > 0){
        response.json(emps[0]);
      }else{
        response.status(401).send({message: "Unauthorized user"});    
      }
    

  } catch(error){

    response.status(500).send(error);

  }

})

app.post('/partnerlogin', loginValidators, async (request: any, response: any) => {
  try {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      console.log("Validation errors", errors);
        return response.status(400).json({ errors: errors.array() });
    }
    const { email, password, token } = request.body;
    if (!password && !token) {
      console.log("Validation errors", errors);
        return response.status(400).json({ errors: [{msg: 'Validaton error'}] });
    }
    let loginRef = db.collection('contractors');
    let loginSnapshot;
    if(token){
      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: googleClientID
      });
      const payload = ticket.getPayload();
      console.log('client id =', token);
      console.log('google id ', googleClientID);
      console.log('payload data', payload);
      let email ='';
      if(!payload){
        console.log("Validation errors", errors);
        return response.status(400).json({ errors: [{msg: 'Validaton error'}] });
      }
      email = payload.email?? '';
      loginSnapshot = await loginRef.where('status', '==',true).where('email', '==', email).get();  
    }else{
      loginSnapshot = await loginRef.where('status', '==',true).where('email', '==',email).where('password', '==', password).get();  
    }
    const emps:any = [];
    loginSnapshot.forEach(
        (doc) => {
          emps.push({
            contractor_name: doc.data().contractor_name,
            company_name: doc.data().company_name,
            business_name: doc.data().business_name,
            mob_number: doc.data().mob_number,
            email: doc.data().email,
            contractorID: doc.data().contractorID,
            role: doc.data().role,
            id: doc.id,
          });
        }
    );
      if(emps.length > 0){
        response.json({success: true, data: emps[0]});
      }else{
        response.status(401).send({message: "Unauthorized user"});    
      }
    

  } catch(error){
    console.log('some error in login', error);
    response.status(500).send(error);

  }
})


app.post('/schedule', scheduleValidators, async (request: any, response: any) => {
  try {

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      console.log("Validation errors", errors);
        return response.status(400).json({ errors: errors.array() });
    }
    const { contractorID, contractorName, serviceLocation, phoneNumber, email, homeOwnerContact, cleaningQuote, arrivalTimeSlot, homeOwnerName, entryType, lockBoxCode, lossType, livingSpace, numberOfFurnace, serviceDate, emergency, associatePO, PONumber, message, reachToOwner, addDryerVent } = request.body;
    const data = {
      contractorName, 
      serviceLocation,
      phoneNumber,
      email,
      entryType,
      homeOwnerName,
      homeOwnerContact,
      lockBoxCode,
      lossType,
      livingSpace,
      cleaningQuote,
      arrivalTimeSlot,
      numberOfFurnace,
      serviceDate,
      emergency,
      associatePO, 
      PONumber, 
      message,
      reachToOwner,
      addDryerVent
    } 
    const dateToInser = { contractorID, ...data, ticketStatus: "service request has been received." };
    const jobRef = await db.collection('schedules').add(dateToInser);
    // const job = await jobRef.get();
    const scheduleData = {
        id: jobRef.id,
        ...data
    };
    await SyncToSheets(scheduleData, ScheduleSheetId)
    sendScheduleJobEmail(scheduleData);
    response.json(scheduleData);
  } catch(error){
    console.log(error);
    response.status(500).send(error);
  }

})

app.post('/scheduleInsulationEstimate', insulationEstimateValidators, async (request: any, response: any) => {
  try {

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      console.log("Validation errors", errors);
        return response.status(400).json({ errors: errors.array() });
    }
    const { contractorName, serviceLocation, phoneNumber, email, homeOwnerContact, areaToEstimate, homeOwnerName, entryType, lockBoxCode, insulationType, completionDate, message, isLadderGreater } = request.body;
    const data = {
      contractorName, 
      serviceLocation,
      phoneNumber,
      email,
      entryType,
      homeOwnerName,
      homeOwnerContact,
      lockBoxCode,
      areaToEstimate,
      insulationType,
      completionDate,
      isLadderGreater,
      message,
    } 
    const jobRef = await db.collection('insulationEstimates').add(data);
    // const job = await jobRef.get();
    const insulationData = {
        id: jobRef.id,
        ...data
    };
    await SyncToSheets(insulationData, InsulationSheetId)
    sendInsulationEstimateEmail(insulationData);
    response.json(insulationData);
  } catch(error){
    console.log(error);
    response.status(500).send(error);
  }

})

app.post('/getEsitmates', async (request, response) => {
  try {
    
    const { no_of_furnace, dryer_vent, living_space, mobile_number, zipcode } = request.body;
    const errors =[];
    if(!no_of_furnace) errors.push('No of furnace is rqeuired');
    if(!living_space) errors.push('Aprox Square footage of living space is rqeuired');

    if(errors.length>0) response.status(400).json({ errors: errors });
    const NumFurnace = parseInt(no_of_furnace);
    let airDuctCleaingQuote = 0, zipcode_service=true, zipcode_price=0, total=0;
    let dryer_vent_cleaning_quote;

    if(dryer_vent){
      if(dryer_vent== 'roof'){
        dryer_vent_cleaning_quote = 225;
      }else{
        dryer_vent_cleaning_quote = 95;
      }
    }else{
      dryer_vent_cleaning_quote = 0;
    }

    if(zipcode){
      const zipcodeSnapshot = await db.collection('zipcodes').where("zipcodes", "==", zipcode).get();
      if (!zipcodeSnapshot.empty){
          const zipcodes:any = [];
          zipcodeSnapshot.forEach(
              (doc) => {
                zipcodes.push(doc.data());
              }
          );
          zipcode_service = zipcodes[0].coverage;
          zipcode_price = zipcodes[0].additional_price;
          console.log('zipcode price', zipcodes);
      }
    }else{
      console.log('empty zipcode');
    }
    const mobile = mobile_number? mobile_number : 'default';
    const telSnapshot = await db.collection('pricediscounts').where("tel", "==", mobile).get();
    if (!telSnapshot.empty){
        const discounts:any = [];
        telSnapshot.forEach(
            (doc) => {
              discounts.push(doc.data());
            }
        );
        
        console.log('discounts price', discounts);
      if(NumFurnace == 1){
        if(parseInt(living_space) < 2000){
          airDuctCleaingQuote = 0;
        }else if(parseInt(living_space) >= 2000 && parseInt(living_space) < 3000){
          airDuctCleaingQuote = 45;
        }else{
          airDuctCleaingQuote = 100;
        }
        total = discounts[0].farnace_1 + airDuctCleaingQuote + zipcode_price;
      }else if(NumFurnace == 2){
        airDuctCleaingQuote = 0;
        total = discounts[0].farnace_2 + airDuctCleaingQuote + zipcode_price;
      }else{
        airDuctCleaingQuote =0;
        total = discounts[0].farnace_2 + airDuctCleaingQuote + zipcode_price;
      }

    }else{
      console.log('empty mobile');
    }
    if(NumFurnace > 2){
      response.json({message: 'FOR 3 OR MORE FURNACES OR FOR EARLIER APPOINTMENTS EMAIL INFO@AMISTEE.COM OR CALL 877.349.8877'});
    }else if(!zipcode_service){
      response.json({message: 'This location is out of our service area.'});
    }else{
      response.json({air_duct_cleaing_quote: '$'+total, dryer_vent_cleaning_quote: '$'+dryer_vent_cleaning_quote, total: '$'+ (total+dryer_vent_cleaning_quote)});
    }

  } catch(error){

    response.status(500).send(error);

  }

})

app.get('/jobrequests/:id', async (req, response) => {
  try {
    const customerID = req.params.id;

    if (!customerID) response.status(400).json({ errors: ['Customer id is required'] });

    const scheduleQuerySnapshot = await db.collection('schedules').where('contractorID', '==',customerID).get();
    if (scheduleQuerySnapshot.empty) {
      console.log('No matching requests in schedules table.');
    }  
    const jobs:any = [];
    scheduleQuerySnapshot.forEach(
        (doc) => {
          jobs.push({
            serviceLocation: doc.data().serviceLocation,
            ticketStatus: doc.data().ticketStatus,
            serviceDate: doc.data().serviceDate,
            contractorName: doc.data().contractorName,
            entryType: doc.data().entryType,
            email: doc.data().email,
            phoneNumber: doc.data().phoneNumber,
            homeOwnerName: doc.data().homeOwnerName,
            homeOwnerContact: doc.data().homeOwnerContact,
            lockBoxCode: doc.data().lockBoxCode,
            lossType: doc.data().lossType,
            livingSpace: doc.data().livingSpace,
            cleaningQuote: doc.data().cleaningQuote,
            arrivalTimeSlot: doc.data().arrivalTimeSlot,
            numberOfFurnace: doc.data().numberOfFurnace,
            emergency: doc.data().emergency,
            associatePO: doc.data().associatePO, 
            PONumber: doc.data().PONumber,
            message: doc.data().message,
            reachToOwner: doc.data().reachToOwner,
            addDryerVent: doc.data().addDryerVent,
            ticketId: doc.id,
          });
        }
    );
    response.send({results: jobs});
  } catch(error){
    response.status(500).send(error);
  }

})

app.get('/jobs/:id', async (req, response) => {
  try {
    const customerID = req.params.id;
    if (!customerID) response.status(400).json({ errors: ['Customer id is required'] });
        const token = await getToken();
        var options = { 
          method: 'GET',
          url: `https://connect.mhelpdesk.com/api/v1.0/portal/0222731/Customers/${customerID}/Tickets`,
          headers: { 
              'Authorization': 'Bearer '+ token,
              'Content-Type' : 'application/json',
              'Key' : 'LC1fO4yAi0-ktkoTL-q_KQ',
              'Value' : 'nYSfbiiU'
          },
      };
    
        request(options, function (error, res, body) {
        if (error) throw new Error(error);
          response.send(body);
        });
  } catch(error){
    response.status(500).send(error);
  }

})

app.delete('/contractors/:id', async (request, response) => {
  try {

    const empId = request.params.id;

    if (!empId) throw new Error('id is blank');

    await db.collection('contractors')
        .doc(empId)
        .delete();

    response.json({
        id: empId,
    })


  } catch(error){

    response.status(500).send(error);

  }

})

//push notifications
app.post('pushNotification', async (request, response) => {
  try {
      const { username, message, title } = request.body;

      if (!username) throw new Error('username is blank');

      if (!message) throw new Error('message is blank');

      if (!title) throw new Error('title is blank');

      const data = {
          username, 
          message, 
          title
      } 
      const empRef = await db.collection('contractors').add(data);
      const emp = await empRef.get();
  
      response.json({
        id: empRef.id,
        data: emp.data()
      });

  //   await db.collection('employees')
  //       .doc(empId)
  //       .delete();

  //   response.json({
  //       id: empId,
  //   })


  } catch(error){

    response.status(500).send(error);

  }

})
