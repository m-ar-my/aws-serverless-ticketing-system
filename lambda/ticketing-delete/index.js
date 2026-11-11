const { DynamoDBClient, QueryCommand, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");

const client = new DynamoDBClient({});

exports.handler = async (event) => {
  const ticketId = event.pathParameters?.ticketId;

  if (!ticketId) {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing ticketId" }) };
  }

  // Find the createdAt automatically
  const query = await client.send(new QueryCommand({
    TableName: "ticketing-table",
    KeyConditionExpression: "ticketId = :id",
    ExpressionAttributeValues: marshall({ ":id": ticketId })
  }));

  if (!query.Items.length) {
    return { statusCode: 404, body: JSON.stringify({ error: "Ticket not found" }) };
  }

  const createdAt = query.Items[0].createdAt.S;

  await client.send(new DeleteItemCommand({
    TableName: "ticketing-table",
    Key: marshall({ ticketId, createdAt })
  }));

  return { statusCode: 200, body: JSON.stringify({ message: "Ticket deleted" }) };
};
