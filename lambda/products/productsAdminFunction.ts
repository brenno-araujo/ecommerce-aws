import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { Product, ProductRepository } from "/opt/nodejs/productsLayer";
import { DynamoDB } from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";

AWSXRay.captureAWS(require("aws-sdk"));

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

  if (event.resource === "/products") {
    console.log("POST /products");
    const product = JSON.parse(event.body!) as Product;
    const newProduct = await productRepository.createProduct(product);
    return {
      statusCode: 201,
      body: JSON.stringify(newProduct),
    };
  }

  if (event.resource === "/products/{id}") {
    const productId = event.pathParameters?.id as string;
    if (event.httpMethod === "PUT") {
      console.log("PUT /products/{id}", productId);
      const product = JSON.parse(event.body!) as Product;
      try {
      const updatedProduct = await productRepository.updateProduct(
        productId,
        product
      );
      return {
        statusCode: 200,
        body: JSON.stringify(updatedProduct),
      }; 
      } catch (ConditionalCheckFailedException) {
        return {
          statusCode: 404,
          body: 'Product not found',
        };
      }
    }
    if (event.httpMethod === "DELETE") {
      console.log("DELETE /products/{id}", productId);
      try {
        const deletedProduct = await productRepository.deleteProduct(productId);
        return {
          statusCode: 200,
          body: JSON.stringify(deletedProduct),
        };
      } catch (error) {
        return {
          statusCode: 404,
          body: (error as Error).message,
        }; 
      }
    }

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Product deleted successfully",
        }),
      };
    }

  return {
    statusCode: 400,
    body: JSON.stringify({
      message: "Bad request",
    }),
  };
}
