const dbObect = require('./DbService');
module.exports.getContactsFunc = async(event) => {
    const contactsArrayNew = await dbObect.getContacts();
    return {
        statusCode: 200,
        body: JSON.stringify({
            data: contactsArrayNew
        }),
    };
};