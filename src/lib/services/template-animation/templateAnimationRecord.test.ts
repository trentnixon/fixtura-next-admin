import {
  jsonToEditorValue,
  parseRequiredJson,
  toTemplateAnimation,
} from "./templateAnimationRecord";

describe("toTemplateAnimation", () => {
  it("reads a Strapi attributes payload", () => {
    const row = toTemplateAnimation({
      id: 4,
      attributes: {
        presetId: "pulse",
        name: "Pulse",
        description: "A pulse",
        defaultConfiguration: { speed: 1 },
        configurationSchema: { type: "object" },
        operatorVisible: true,
        isActive: true,
        isDefault: false,
        sortOrder: 2,
        catalogueVersion: 3,
        publishedAt: null,
      },
    });

    expect(row.presetId).toBe("pulse");
    expect(row.catalogueVersion).toBe("3");
    expect(row.isActive).toBe(true);
    expect(row.publishedAt).toBeNull();
  });
});

describe("parseRequiredJson", () => {
  it("rejects empty and invalid JSON", () => {
    expect(() => parseRequiredJson("Default configuration", "  ")).toThrow(
      /required/,
    );
    expect(() => parseRequiredJson("Default configuration", "{")).toThrow(
      /valid JSON/,
    );
  });

  it("parses a JSON object", () => {
    expect(parseRequiredJson("Schema", '{"type":"object"}')).toEqual({
      type: "object",
    });
  });
});

describe("jsonToEditorValue", () => {
  it("pretty-prints objects and JSON strings", () => {
    expect(jsonToEditorValue({ speed: 1 })).toBe('{\n  "speed": 1\n}');
    expect(jsonToEditorValue('{"a":1}')).toBe('{\n  "a": 1\n}');
  });
});
