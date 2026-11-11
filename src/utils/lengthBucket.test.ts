import { getLengthBucket, MEDIUM_MAX, SHORT_MAX } from "./lengthBucket";

describe("getLengthBucket", () => {
  it("buckets at the documented thresholds", () => {
    expect(getLengthBucket("a".repeat(SHORT_MAX))).toBe("short");
    expect(getLengthBucket("a".repeat(SHORT_MAX + 1))).toBe("medium");
    expect(getLengthBucket("a".repeat(MEDIUM_MAX))).toBe("medium");
    expect(getLengthBucket("a".repeat(MEDIUM_MAX + 1))).toBe("long");
  });

  it("ignores surrounding whitespace", () => {
    expect(getLengthBucket("   " + "a".repeat(SHORT_MAX) + "   ")).toBe("short");
  });

  it("counts Arabic letters and emoji once each", () => {
    expect(getLengthBucket("ن".repeat(SHORT_MAX))).toBe("short");
    expect(getLengthBucket("🌙".repeat(SHORT_MAX))).toBe("short");
  });

  it("treats empty text as short", () => {
    expect(getLengthBucket("")).toBe("short");
  });
});
