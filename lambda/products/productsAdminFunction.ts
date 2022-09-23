import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  const lambdaRequestId = context.awsRequestId;
  const apiRequestId = event.requestContext.requestId;

  console.log("Lambda Request ID: ", lambdaRequestId);
  console.log("API Request ID: ", apiRequestId);

  if (event.resource === "/products") {
    console.log("POST /products");
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Product created successfully",
      }),
    };
  }

  if (event.resource === "/products/{id}") {
    const productId = event.pathParameters?.id as string;
    if (event.httpMethod === "PUT") {
      console.log("PUT /products/{id}", productId);
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Product updated successfully",
        }),
      };
    }
    if (event.httpMethod === "DELETE") {
      console.log("DELETE /products/{id}", productId);
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Product deleted successfully",
        }),
      };
    }
  }

  return {
    statusCode: 400,
    body: JSON.stringify({
      message: "Bad request",
    }),
  };
}
