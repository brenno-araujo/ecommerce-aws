import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { ProductRepository } from "/opt/nodejs/productsLayer";
import { DynamoDB } from "aws-sdk";

const productsDdb = process.env.PRODUCTS_DDB!;
const ddbClient = new DynamoDB.DocumentClient();
const productRepository = new ProductRepository(ddbClient, productsDdb);

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
      console.log("GET /products - ok");
      const products = await productRepository.getAlProducts();
      return {
        statusCode: 200,
        body: JSON.stringify(products),
      };
    }
  }

  if (event.resource === "/products/{id}") {
    if (method === "GET") {
      const productId = event.pathParameters?.id as string;
      console.log("GET /products/{id}", productId);
      try {
        const product = await productRepository.getProductById(productId);
        return {
          statusCode: 200,
          body: JSON.stringify(product),
        };
      } catch (error) {
        console.log((<Error>error).message);
        return {
          statusCode: 404,
          body: JSON.stringify((<Error>error).message),
        };
      }
    }
  }

  return {
    statusCode: 400,
    body: JSON.stringify({
      message: "Bad request",
    }),
  };
}
