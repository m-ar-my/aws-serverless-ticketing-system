const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");
const { randomUUID } = require("crypto");

const ddbClient = new DynamoDBClient({});
const snsClient = new SNSClient({ region: "ap-southeast-2" });

const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN;

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

  const allowedPriorities = ["low", "medium", "high"];
  if (body.priority && !allowedPriorities.includes(body.priority)) {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "priority must be low, medium, or high" }) };
  }

  const item = {
    ticketId: randomUUID(),
    createdAt: new Date().toISOString(),
    title: body.title,
    description: body.description || "",
    priority: body.priority || "low",
    status: body.status || "open"
  };

  await ddbClient.send(new PutItemCommand({
    TableName: "ticketing-table",
    Item: marshall(item)
  }));

  // SNS notification
  await snsClient.send(new PublishCommand({
    TopicArn: SNS_TOPIC_ARN,
    Subject: `[Ticketing] New Ticket Created: ${item.ticketId}`,
    Message: `A new ticket has been created.\n\nID: ${item.ticketId}\nTitle: ${item.title}\nDescription: ${item.description}\nPriority: ${item.priority}\nStatus: ${item.status}\nCreated: ${item.createdAt}`
  }));

  return { statusCode: 201, headers: corsHeaders, body: JSON.stringify(item) };
};
