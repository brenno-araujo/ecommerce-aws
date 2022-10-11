import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { v4 as uuidv4 } from "uuid";

export interface Product {
  id: string;
  productName: string;
  code: string;
  price: number;
  model: string;
  productUrl: string;
}

export class ProductRepository {
  private ddbClient: DocumentClient;
  private tableName: string;

  constructor(ddbClient: DocumentClient, tableName: string) {
    this.ddbClient = ddbClient;
    this.tableName = tableName;
  }

  async getAlProducts(): Promise<Product[]> {
    const result = await this.ddbClient
      .scan({
        TableName: this.tableName,
      })
      .promise();

    return result.Items as Product[];
  }

  async getProductById(id: string): Promise<Product> {
    const result = await this.ddbClient
      .get({
        TableName: this.tableName,
        Key: {
          id,
        },
      })
      .promise();

    if (!result.Item) {
      throw new Error("Product not found");
    }

    return result.Item as Product;
  }

  async createProduct(product: Product): Promise<Product> {
    const newProduct = {
      ...product,
      id: uuidv4(),
    };

    await this.ddbClient
      .put({
        TableName: this.tableName,
        Item: newProduct,
      })
      .promise();

    return newProduct;
  }

  async updateProduct(productId: string, product: Product): Promise<Product> {
    const updatedProduct = await this.ddbClient
      .update({
        TableName: this.tableName,
        Key: {
          id: productId,
        },
        ConditionExpression: "attribute_exists(id)",
        ReturnValues: "UPDATED_NEW",
        UpdateExpression:
          "set productName = :productName, code = :code, price = :price, model = :model, productUrl = :productUrl",  
        ExpressionAttributeValues: {
          ":productName": product.productName,
          ":code": product.code,
          ":price": product.price,
          ":model": product.model,
          ":productUrl": product.productUrl,
        },
      })
      .promise();

    if (!updatedProduct.Attributes) {
      throw new Error("Product not found");
    }

    return updatedProduct.Attributes as Product;
  }

  async deleteProduct(id: string): Promise<Product> {
    const deletedProduct = await this.ddbClient
      .delete({
        TableName: this.tableName,
        Key: {
          id,
        },
        ReturnValues: "ALL_OLD",
      })
      .promise();

    if (!deletedProduct.Attributes) {
      throw new Error("Product not found");
    }

    return deletedProduct.Attributes as Product;
  }
}
