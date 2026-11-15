const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");
const { randomUUID } = require("crypto");

const client = new DynamoDBClient({});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,X-Api-Key',
  'Content-Type': 'application/json'
};

exports.handler = async (event) => {
  const body = JSON.parse(event.body || "{}");

  if (!body.title) {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "Missing title" }) };
  }

  const item = {
    ticketId: randomUUID(),
    createdAt: new Date().toISOString(),
    title: body.title,
    description: body.description || "",
    priority: body.priority || "low",
    status: body.status || "open"
  };

  await client.send(new PutItemCommand({
    TableName: "ticketing-table",
    Item: marshall(item)
  }));

  return { statusCode: 201, headers: corsHeaders, body: JSON.stringify(item) };
};
