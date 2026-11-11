const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, DeleteCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
    const ticketId = event.pathParameters?.ticketId;

    if (!ticketId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing required path parameter: ticketId' })
        };
    }

    // Check ticket exists
    const existing = await docClient.send(new GetCommand({
        TableName: 'ticketing-table',
        Key: { ticketId }
    }));

    if (!existing.Item) {
        return {
            statusCode: 404,
            body: JSON.stringify({ error: 'Ticket not found' })
        };
    }

    // Delete the ticket
    await docClient.send(new DeleteCommand({
        TableName: 'ticketing-table',
        Key: { ticketId }
    }));

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Ticket deleted successfully', ticketId })
    };
};
