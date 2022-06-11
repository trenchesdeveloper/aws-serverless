const AWS = require("aws-sdk");
const middy = require("@middy/core");
const httpJsonBodyParser = require("@middy/http-json-body-parser");

const updateTodo = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();

  const { id } = event.pathParameters;
  const { completed } = event.body;

  try {
    const result = await dynamodb
      .update({
        TableName: "TodoTable",
        Key: {
          id,
        },
        UpdateExpression: "set completed = :completed",
        ExpressionAttributeValues: {
          ":completed": completed,
        },
        ReturnValues: "ALL_NEW",
      })
      .promise();
  } catch (error) {
    console.log(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Todo updated successfully",
    }),
  };
};

module.exports = {
  handler: middy(updateTodo).use(httpJsonBodyParser()),
};
