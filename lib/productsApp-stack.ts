import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as cdk from "aws-cdk-lib";
import * as dynadb from "aws-cdk-lib/aws-dynamodb";

import { Construct } from "constructs";

export class ProductsAppStack extends cdk.Stack {
  readonly productsFethHandler: lambdaNodejs.NodejsFunction;
  readonly productsAdminHandler: lambdaNodejs.NodejsFunction;
  readonly productsDdb: dynadb.Table;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.productsDdb = new dynadb.Table(this, "ProductsDdb", {
      tableName: "Products",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      partitionKey: {
        name: "id",
        type: dynadb.AttributeType.STRING,
      },
      billingMode: dynadb.BillingMode.PAY_PER_REQUEST,
      readCapacity: 1,
      writeCapacity: 1,
    });

    this.productsFethHandler = new lambdaNodejs.NodejsFunction(
      this,
      "productsFetchHandler",
      {
        functionName: "productsFetchHandler",
        entry: "lambda/products/productsFethFunction.ts",
        handler: "handler",
        memorySize: 128,
        timeout: cdk.Duration.seconds(5),
        bundling: {
          minify: true,
          sourceMap: false,
        },
        environment: {
          PRODUCTS_DDB: this.productsDdb.tableName,
        },
      }
    );
    this.productsDdb.grantReadData(this.productsFethHandler);

    this.productsAdminHandler = new lambdaNodejs.NodejsFunction(
      this,
      "productsAdminFunction",
      {
        functionName: "productsAdminFunction",
        entry: "lambda/products/productsAdminFunction.ts",
        handler: "handler",
        memorySize: 128,
        timeout: cdk.Duration.seconds(5),
        bundling: {
          minify: true,
          sourceMap: false,
        },
        environment: {
          PRODUCTS_DDB: this.productsDdb.tableName,
        },
      }
    );
    this.productsDdb.grantReadWriteData(this.productsAdminHandler);
  }
}
