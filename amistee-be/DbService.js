const DbService = {};
const AWS = require('aws-sdk');
let docClient = new AWS.DynamoDB.DocumentClient({
    region: 'us-east-1'
});
const tableName = 'amistee-db';

module.exports = {
    createDbItem: async(data) => {
        let params = {
            TableName: tableName,
            Item: {
                'PK': 'PK-' + data.id,
                'SK': 'SK-' + data.createdDate,
                'GSI_PK': 'CONTACT_QUIRIES',
                'GSI_SK': 'CONTACT_QUIRIES#' + data.createdDate,
                'attributes': data
            }
        };
        return docClient.put(params).promise();
    },
    getContacts: async() => {
        let params = {
            TableName: tableName,
            KeyConditionExpression: 'GSI_PK = :GSI_PK and begins_with(GSI_SK, :GSI_SK)',
            IndexName: 'GSI',
            ScanIndexForward: false,
            ExpressionAttributeValues: {
                ':GSI_PK': 'CONTACT_QUIRIES',
                ':GSI_SK': 'CONTACT_QUIRIES#'
            }
        };
        const queryOutput = await docClient.query(params).promise();
        if (queryOutput.Count === 0 || !queryOutput.Items) {
            return [];
        }
        return queryOutput.Items.map(item => item.attributes);
    },

    getItem: async(itemId) => {
        let params = {
            TableName: tableName,
            KeyConditionExpression: 'PK = :PK and begins_with(SK, :SK)',
            ExpressionAttributeValues: {
                ':PK': 'PK-' + itemId,
                ':SK': 'SK-'
            }
        };
        const queryOutput = await docClient.query(params).promise();
        console.log('====>', queryOutput)
        if (queryOutput.Count === 0 || !queryOutput.Items) {
            return [];
        }
        return queryOutput.Items[0].attributes;
    },

    updateItem: async(updatedItem) => {
        updatedItem.updatedDate = new Date().toISOString();
        let params = {
            TableName: tableName,
            Key: {
                'PK': 'PK-' + updatedItem.id,
                'SK': 'SK-' + updatedItem.createdDate
            },
            UpdateExpression: "set attributes = :attributes",
            ExpressionAttributeValues: {
                ':attributes': updatedItem
            },
            ReturnValues: 'UPDATED_NEW'
        };
        return docClient.update(params).promise();
    }
};