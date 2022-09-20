import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as cdk from "aws-cdk-lib";

import { Construct } from "constructs";

export class ProductsAppStack extends cdk.Stack {
  readonly productsFethHandler: lambdaNodejs.NodejsFunction;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

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
      }
    );
  }
}
