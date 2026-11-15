const { DynamoDBClient, QueryCommand, ScanCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const client = new DynamoDBClient({});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,X-Api-Key',
  'Content-Type': 'application/json'
};

exports.handler = async (event) => {
  const ticketId = event.pathParameters?.ticketId;

  if (!ticketId) {
    const result = await client.send(new ScanCommand({ TableName: "ticketing-table" }));
    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify(result.Items.map(unmarshall)) };
  }

  const result = await client.send(new QueryCommand({
    TableName: "ticketing-table",
    KeyConditionExpression: "ticketId = :id",
    ExpressionAttributeValues: marshall({ ":id": ticketId })
  }));

  if (!result.Items.length) {
    return { statusCode: 404, headers: corsHeaders, body: JSON.stringify({ error: "Ticket not found" }) };
  }

  return { statusCode: 200, headers: corsHeaders, body: JSON.stringify(unmarshall(result.Items[0])) };
};
