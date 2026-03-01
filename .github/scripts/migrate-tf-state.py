#!/usr/bin/env python3
"""
Migrate Terraform state from v3 (Terraform 0.11 format) to v4 (Terraform 0.13+ format).

v3 stores resources inside a 'modules' array with flat attribute strings.
v4 stores a flat 'resources' array with fully-qualified provider addresses.
If the state is already v4 the script exits without modifying the file.
"""
import json
import sys

PROVIDER_MAP = {
    "aws": "hashicorp/aws",
    "archive": "hashicorp/archive",
}


def qualify_provider(raw):
    """
    'provider.aws'                     -> 'provider["registry.terraform.io/hashicorp/aws"]'
    'registry.terraform.io/-/aws'      -> 'provider["registry.terraform.io/hashicorp/aws"]'
    Already-qualified addresses pass through unchanged.
    """
    if raw.startswith('provider["registry.terraform.io/hashicorp'):
        return raw
    if raw.startswith("provider."):
        short = raw[len("provider."):]
        qualified = PROVIDER_MAP.get(short, f"hashicorp/{short}")
        return f'provider["registry.terraform.io/{qualified}"]'
    if "registry.terraform.io/-/" in raw:
        for short, full in PROVIDER_MAP.items():
            raw = raw.replace(f"registry.terraform.io/-/{short}", f"registry.terraform.io/{full}")
        return raw
    return raw


def module_addr(path):
    """["root", "cloudfrontEdge-s3-module"] -> "module.cloudfrontEdge-s3-module" """
    if not path or path == ["root"]:
        return None
    return ".".join(f"module.{p}" for p in path[1:])


def parse_resource_key(key):
    """
    'aws_s3_bucket.s3_bucket'               -> managed, aws_s3_bucket, s3_bucket
    'data.aws_acm_certificate.acm_certificate' -> data, aws_acm_certificate, acm_certificate
    """
    parts = key.split(".")
    if parts[0] == "data":
        return "data", parts[1], parts[2]
    return "managed", parts[0], parts[1]


def convert_resource(key, v3_res, path):
    mode, rtype, rname = parse_resource_key(key)
    provider = qualify_provider(v3_res.get("provider", "provider.aws"))
    primary = v3_res.get("primary", {})
    meta = primary.get("meta", {})

    schema_version = meta.get("schema_version", 0)
    if not isinstance(schema_version, int):
        schema_version = 0

    attrs = dict(primary.get("attributes", {}))
    if primary.get("id") and "id" not in attrs:
        attrs["id"] = primary["id"]

    instance = {
        "schema_version": schema_version,
        "attributes": attrs,
        "sensitive_attributes": [],
    }

    r = {
        "mode": mode,
        "type": rtype,
        "name": rname,
        "provider": provider,
        "instances": [instance],
    }

    mod = module_addr(path)
    if mod:
        r["module"] = mod

    return r


def migrate(state):
    version = state.get("version")

    if version == 4:
        print("State is already version 4 – nothing to do.")
        return state

    if version != 3:
        print(f"Unexpected state version {version} – skipping.", file=sys.stderr)
        return state

    resources = []
    outputs = {}

    for mod in state.get("modules", []):
        path = mod.get("path", ["root"])
        if path == ["root"]:
            outputs = mod.get("outputs", {})
        for key, res in mod.get("resources", {}).items():
            resources.append(convert_resource(key, res, path))

    return {
        "version": 4,
        "terraform_version": "1.0.0",
        "serial": state.get("serial", 0) + 1,
        "lineage": state.get("lineage", ""),
        "outputs": outputs,
        "resources": resources,
        "check_results": None,
    }


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: migrate-tf-state.py <state-file>", file=sys.stderr)
        sys.exit(1)

    filepath = sys.argv[1]
    with open(filepath) as f:
        state = json.load(f)

    original_version = state.get("version")
    migrated = migrate(state)

    with open(filepath, "w") as f:
        json.dump(migrated, f, indent=2)

    print(f"State migrated from version {original_version} to version {migrated.get('version')}")
