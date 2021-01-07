'use strict';
// Following is a model schema validation for create contact API
/*
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "title": "ContactDataRequestValidationModel",
  "type": "object",
  "properties": {
    "data": {
      "type": "object",
      "properties": {
        "name": { "type": "string", "minLength": 3 },
        "address": { "type": "string" },
        "city": { "type": "string" },
        "state": { "type": "string" },
        "zip": { "type": "string" },
        "email": { "type": "string", "minLength": 7 },
        "phone": { "type": "string", "minLength": 9 },
        "typeOfEstimate": { "type": "string" },
        "hear": { "type": "string" },
        "type": { "type": "string" },
        "size": { "type": "string" },
        "furnaces": { "type": "string" },
        "message": { "type": "string" },
        "date": { "type": "string" },
        "time": { "type": "string" },
        "fromSource": { "type": "string" }
      },
      "required": ["name", "email", "phone"],
      "additionalProperties": false
    }
  }
}
*/

// const AWS = require('aws-sdk');
// let docClient = new AWS.DynamoDB.DocumentClient({
//     region: 'us-east-1'
// });

const dbObect = require('./DbService');
module.exports.createContactDataFun = async(event) => {
    const id = Math.ceil(Math.random() * 10000000000);
    const createdDate = new Date().toISOString();
    let bodyData = event.body;
    let dbItemWriteRespone;
    if (bodyData && typeof bodyData === 'string') {
        bodyData = JSON.parse(bodyData);
        bodyData.data.id = id;
        bodyData.data.createdDate = createdDate;
        bodyData.data.updatedDate = createdDate;
        dbItemWriteRespone = await dbObect.createDbItem(bodyData.data);
    }
    if (Object.keys(dbItemWriteRespone).length === 0) {
        return {
            statusCode: 200,
            body: JSON.stringify({
                data: bodyData
            }),
        };
    } else {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Internal server error'
            }),
        }
    }
};