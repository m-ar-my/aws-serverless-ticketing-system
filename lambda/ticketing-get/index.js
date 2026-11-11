const { DynamoDBClient, QueryCommand, ScanCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const client = new DynamoDBClient({});

exports.handler = async (event) => {
  const ticketId = event.pathParameters?.ticketId;

  if (!ticketId) {
    const result = await client.send(new ScanCommand({ TableName: "ticketing-table" }));
    return { statusCode: 200, body: JSON.stringify(result.Items.map(unmarshall)) };
  }

  const result = await client.send(new QueryCommand({
    TableName: "ticketing-table",
    KeyConditionExpression: "ticketId = :id",
    ExpressionAttributeValues: marshall({ ":id": ticketId })
  }));

  if (!result.Items.length) {
    return { statusCode: 404, body: JSON.stringify({ error: "Ticket not found" }) };
  }

  return { statusCode: 200, body: JSON.stringify(unmarshall(result.Items[0])) };
};
