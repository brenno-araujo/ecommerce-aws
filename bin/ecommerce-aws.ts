#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { ECommerceApiStack } from "../lib/ecommerceApi-stack";
import { ProductsAppStack } from "../lib/productsApp-stack";

const app = new cdk.App();

const env: cdk.Environment = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const tags = {
  cost: "ecommerce",
  team: "brennoTeam",
};

const productsAppStack = new ProductsAppStack(app, "ProductsApp", {
  env: env,
  tags: tags,
});

const ecommerceApiStack = new ECommerceApiStack(app, "EcommerceApi", {
  productsFethHandler: productsAppStack.productsFethHandler,
  tags: tags,
  env: env,
});
ecommerceApiStack.addDependency(productsAppStack);
