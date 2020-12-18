terraform {
  backend "s3" {
    bucket         = "webpage-screenshot-frontend-state"
    key            = "webpage-screenshot-frontend-site"
    region         = "eu-west-2"
    dynamodb_table = "webpage-screenshot-frontend-state"
  }
}

provider "aws" {
  region = "${var.aws_region}"
}

module "cloudfrontEdge-s3-module" {
  source       = "cloudfrontEdge-s3-module"
  name         = "${var.name}"
  aws_region   = "${var.aws_region}"
  domain_names = "${var.domain_names}"
  asset_folder = "${var.asset_folder}"
}