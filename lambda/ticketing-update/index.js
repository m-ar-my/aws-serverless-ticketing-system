const { DynamoDBClient, QueryCommand, UpdateItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");

const client = new DynamoDBClient({});

exports.handler = async (event) => {
  const ticketId = event.pathParameters?.ticketId;
  const body = JSON.parse(event.body || "{}");

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

  const allowed = ["title", "description", "priority", "status"];
  const updates = Object.keys(body).filter(k => allowed.includes(k));

  if (updates.length === 0) {
    return { statusCode: 400, body: JSON.stringify({ error: "No valid fields to update" }) };
  }

  const expression = "SET " + updates.map((k, i) => `#f${i} = :v${i}`).join(", ");
  const names = Object.fromEntries(updates.map((k, i) => [`#f${i}`, k]));
  const values = marshall(Object.fromEntries(updates.map((k, i) => [`:v${i}`, body[k]])));

  await client.send(new UpdateItemCommand({
    TableName: "ticketing-table",
    Key: marshall({ ticketId, createdAt }),
    UpdateExpression: expression,
    ExpressionAttributeNames: names,
    ExpressionAttributeValues: values
  }));

  return { statusCode: 200, body: JSON.stringify({ message: "Ticket updated" }) };
};
