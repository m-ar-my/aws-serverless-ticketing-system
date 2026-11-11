const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, UpdateCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");

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

    let body;
    try {
        body = JSON.parse(event.body || '{}');
    } catch (e) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid JSON in request body' })
        };
    }

    // Validate at least one field is provided
    const allowedFields = ['title', 'description', 'priority', 'status'];
    const updates = {};

    for (const field of allowedFields) {
        if (body[field] !== undefined) {
            updates[field] = body[field];
        }
    }

    if (Object.keys(updates).length === 0) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'At least one field required: title, description, priority, or status' })
        };
    }

    // Validate individual fields if provided
    if (updates.title !== undefined) {
        updates.title = updates.title.trim();
        if (!updates.title) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'title cannot be empty' })
            };
        }
        if (updates.title.length > 200) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'title must be 200 characters or less' })
            };
        }
    }

    if (updates.priority !== undefined) {
        updates.priority = updates.priority.trim().toLowerCase();
        if (!['low', 'medium', 'high'].includes(updates.priority)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'priority must be low, medium, or high' })
            };
        }
    }

    if (updates.status !== undefined) {
        updates.status = updates.status.trim().toLowerCase();
        if (!['open', 'in-progress', 'closed'].includes(updates.status)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'status must be open, in-progress, or closed' })
            };
        }
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

    // Build update expression
    const updateExpressions = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    for (const [key, value] of Object.entries(updates)) {
        updateExpressions.push(`#${key} = :${key}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = value;
    }

    const result = await docClient.send(new UpdateCommand({
        TableName: 'ticketing-table',
        Key: { ticketId },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW'
    }));

    return {
        statusCode: 200,
        body: JSON.stringify(result.Attributes)
    };
};
