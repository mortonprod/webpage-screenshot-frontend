variable "name" {
  default = "shot-frontend"
}
variable "aws_region" {
  default = "us-east-1"
}

variable "domain_names" {
  default = ["pagemelt.alexandermorton.co.uk"]
}

variable "asset_folder" {
  description = "Only supports sub domain changes"
  default = "./dist"
}