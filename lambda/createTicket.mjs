const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { randomUUID } = require("crypto");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
    let body;
    try {
        body = JSON.parse(event.body || '{}');
    } catch (e) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid JSON in request body' })
        };
    }

    // Validate required fields
    const title = (body.title || '').trim();
    if (!title) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing required field: title' })
        };
    }

    if (title.length > 200) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'title must be 200 characters or less' })
        };
    }

    // Optional fields
    const description = (body.description || '').trim();
    const priority = (body.priority || 'medium').trim().toLowerCase();

    if (!['low', 'medium', 'high'].includes(priority)) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'priority must be low, medium, or high' })
        };
    }

    const ticket = {
        ticketId: randomUUID(),
        title,
        description,
        priority,
        status: 'open',
        createdAt: new Date().toISOString()
    };

    await docClient.send(new PutCommand({
        TableName: 'ticketing-table',
        Item: ticket
    }));

    return {
        statusCode: 201,
        body: JSON.stringify(ticket)
    };
};
