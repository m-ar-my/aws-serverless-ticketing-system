const { DynamoDBClient, QueryCommand, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");

const client = new DynamoDBClient({});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,X-Api-Key',
  'Content-Type': 'application/json'
};

exports.handler = async (event) => {
  const ticketId = event.pathParameters?.ticketId;

  if (!ticketId) {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "Missing ticketId" }) };
  }

  const query = await client.send(new QueryCommand({
    TableName: "ticketing-table",
    KeyConditionExpression: "ticketId = :id",
    ExpressionAttributeValues: marshall({ ":id": ticketId })
  }));

  if (!query.Items.length) {
    return { statusCode: 404, headers: corsHeaders, body: JSON.stringify({ error: "Ticket not found" }) };
  }

  const createdAt = query.Items[0].createdAt.S;

  await client.send(new DeleteItemCommand({
    TableName: "ticketing-table",
    Key: marshall({ ticketId, createdAt })
  }));

  return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ message: "Ticket deleted" }) };
};
