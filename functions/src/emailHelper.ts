// const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');

// let transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'doyouwork@amistee.com',
//         pass: 'amistee123'
//     }
// });

export function sendScheduleJobEmail(data: any) {
    try {
    console.log('inside email function');
    // const dest = 'babanb@mprglobalsolutions.com';
    let message ='';
    message += "<p>Contractor Name: " + data.contractorName +"</p>";
	message += "<p>Service Address: " + data.serviceLocation +"</p>";
	message += "<p>Contact Phone Number: " + data.phoneNumber +"</p>";
    message += "<p>Email: " + data.email +"</p>";
    message += "<p>How do we enter the property?: " + data.entryType +"</p>";
    if(data.lockBoxCode){
        message += "<p>Lock Box Code: " + data.lockBoxCode +"</p>";
    }
    if(data.homeOwnerName){
        message += "<p>Home Owner Name: " + data.homeOwnerName +"</p>";
    }
    if(data.homeOwnerContact){
        message += "<p>Home Owner Contact: " + data.homeOwnerContact +"</p>";
    }
	message += "<p>Type of loss: " + data.lossType +"</p>";
	message += "<p>Living Space: " + data.livingSpace +"</p>";
	message += "<p>Number of Furnaces:" + data.numberOfFurnace +"</p>";
    message += "<p>Selected Date: " + data.serviceDate +"</p>";
    message += "<p>Selected Arrival Time: " + data.arrivalTimeSlot +"</p>";
    message += "<p>Emergency - Need ASAP: " + data.emergency +"</p>";
	message += "<p>Add dryer Vent Cleaning?: " + data.addDryerVent +"</p>";
	message += "<p>Is there a PO or job number you would like to associated with this job? :" + data.associatePO +"</p>";
	message += "<p>Entered PO/Job Number: " + data.PONumber + "</p>";
    message += "<p>Would you like us to reach out to the home owner to let them know this job has been scheduled? : " + data.reachToOwner +"</p>";
    message += "<p>Message: " + data.message +"</p>";
    message += "<p>Estimated Quote: " + data.cleaningQuote + "</p>";

    const mailOptions = {
        from: 'cloud@amistee.com', // Something like: Jane Doe <janedoe@gmail.com>
        to: data.email,
        subject: 'Air Duct Cleaning :  Please add to Schedule', // email subject
        html: `<h2>Hello, </h2>
            <br />
            ${message}
        ` // email content in HTML
    };

    (async () => {
        try {
          await sgMail.send(mailOptions);
          return 'Sended';
        } catch (error) {
          console.error(error);
          if (error.response) {
            console.error(error.response.body)
          }
          return error.toString();
        }
      })();
    } catch(error){
        console.log(error);
        return error;
    }
};


export function sendInsulationEstimateEmail(data: any) {
    try {
    let message ='';
    message += "<p>Contractor Name: " + data.contractorName +"</p>";
	message += "<p>Service Address: " + data.serviceLocation +"</p>";
	message += "<p>Contact Phone Number: " + data.phoneNumber +"</p>";
    message += "<p>Email: " + data.email +"</p>";
    message += "<p>How do we enter the property?: " + data.entryType +"</p>";
    if(data.lockBoxCode){
        message += "<p>Lock Box Code: " + data.lockBoxCode +"</p>";
    }
    if(data.homeOwnerName){
        message += "<p>Home Owner Name: " + data.homeOwnerName +"</p>";
    }
    if(data.homeOwnerContact){
        message += "<p>Home Owner Contact: " + data.homeOwnerContact +"</p>";
    }
	message += "<p>Insulation Type: " + data.insulationType +"</p>";
	message += "<p>Area to Estimate: " + data.areaToEstimate +"</p>";
	message += "<p>Is ladder great than 6 ft. Needed to access the space? :" + data.isLadderGreater +"</p>";
    message += "<p>Ideal Completion Date: " + data.completionDate +"</p>";
    message += "<p>Message: " + data.message +"</p>";

    const mailOptions = {
        from: 'cloud@amistee.com', // Something like: Jane Doe <janedoe@gmail.com>
        to: data.email,
        subject: 'Air Duct Cleaning :  Schedule an Insulation Estimate', // email subject
        html: `<h2>Hello, </h2>
            <br />
            ${message}
        ` // email content in HTML
    };

    (async () => {
        try {
          await sgMail.send(mailOptions);
          return 'Sended';
        } catch (error) {
          console.error(error);
          if (error.response) {
            console.error(error.response.body)
          }
          return error.toString();
        }
      })();
    } catch(error){
        console.log(error);
        return error;
    }
};