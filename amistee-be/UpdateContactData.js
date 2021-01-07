const dbObect = require('./DbService');
module.exports.updateContactFunc = async(event) => {
    const { id } = event.pathParameters;
    let objectToReturn = {};
    if (id) {
        let bodyData = event.body;
        if (id && bodyData && typeof bodyData === 'string') {
            bodyData = JSON.parse(bodyData);
            const oldItem = await dbObect.getItem(id);
            if (oldItem) {
                const updatedObject = Object.assign(oldItem, bodyData.data);
                const output = await dbObect.updateItem(updatedObject);
                objectToReturn = output.Attributes ? output.Attributes.attributes : {};
            }
        }
    }
    return {
        statusCode: 200,
        body: JSON.stringify({
            data: objectToReturn
        }),
    };
};