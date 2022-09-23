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

  const method = event.httpMethod;

  if (event.resource === "/products") {
    if (method === "GET") {
      console.log("GET /products");
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Products fetched successfully",
        }),
      };
    }
  }

  if (event.resource === "/products/{id}") {
    if (method === "GET") {
      const productId = event.pathParameters?.id as string;
      console.log("GET /products/{id}", productId);
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Product fetched successfully",
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
