const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
    const ticketId = event.pathParameters?.ticketId;

    // GET /tickets/{ticketId} — fetch single ticket
    if (ticketId) {
        const result = await docClient.send(new GetCommand({
            TableName: 'ticketing-table',
            Key: { ticketId }
        }));

        if (!result.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'Ticket not found' })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(result.Item)
        };
    }

    // GET /tickets — fetch all tickets.
    const result = await docClient.send(new ScanCommand({
        TableName: 'ticketing-table'
    }));

    return {
        statusCode: 200,
        body: JSON.stringify(result.Items || [])
    };
};
