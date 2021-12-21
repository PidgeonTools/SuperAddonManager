const SCHEMA = {
  type: "object",
  required: ["schema_version", "versions"],
  properties: {
    schema_version: {
      type: "string",
      const: "super-addon-manager-version-info-1.0.0",
    },
    versions: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        required: ["version", "download_url", "minimum_blender_version"],
        properties: {
          version: {
            type: "array",
            items: {
              type: "integer",
            },
            minItems: 1,
            maxItems: 3,
          },
          allow_automatic_download: {
            type: "boolean",
          },
          download_url: {
            type: "string",
            pattern: "https?:\\/\\/.+",
          },
          minimum_blender_version: {
            type: "array",
            items: {
              type: "integer",
            },
            minItems: 3,
            maxItems: 3,
          },
          api_breaking_blender_version: {
            type: "array",
            items: {
              type: "integer",
            },
            minItems: 3,
            maxItems: 3,
          },
        },
      },
    },
  },
};

export default SCHEMA;
