const { DynamoDBClient, QueryCommand, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

const client = new DynamoDBClient({});
const snsClient = new SNSClient({ region: "ap-southeast-2" });

const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN;

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

  // SNS notification
  await snsClient.send(new PublishCommand({
    TopicArn: SNS_TOPIC_ARN,
    Subject: `[Ticketing] Ticket Deleted: ${ticketId}`,
    Message: `A ticket has been deleted.\n\nID: ${ticketId}\nDeleted: ${new Date().toISOString()}`
  }));

  return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ message: "Ticket deleted" }) };
};
