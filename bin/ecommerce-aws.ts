#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { ECommerceApiStack } from "../lib/ecommerceApi-stack";
import { ProductsAppStack } from "../lib/productsApp-stack";
import { ProductsAppLayersStack } from "../lib/productsAppLayers-stack";

const app = new cdk.App();

const env: cdk.Environment = {
  account: "x",
  region: "sa-east-1",
};

const tags = {
  cost: "ecommerce",
  team: "brennoTeam",
};

const productsAppLayersStack = new ProductsAppLayersStack(
  app,
  "ProductsAppLayersStack",
  {
    env,
    tags,
  }
);

const productsAppStack = new ProductsAppStack(app, "ProductsApp", {
  env: env,
  tags: tags,
});
productsAppStack.addDependency(productsAppLayersStack);

const ecommerceApiStack = new ECommerceApiStack(app, "EcommerceApi", {
  productsFethHandler: productsAppStack.productsFethHandler,
  productsAdminHandler: productsAppStack.productsAdminHandler,
  tags: tags,
  env: env,
});
ecommerceApiStack.addDependency(productsAppStack);
