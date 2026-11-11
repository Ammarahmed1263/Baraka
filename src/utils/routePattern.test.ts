import { getRoutePattern } from "./routePattern";

describe("getRoutePattern", () => {
  it("strips group segments", () => {
    expect(getRoutePattern(["(tabs)", "journal"])).toBe("/journal");
  });

  it("keeps dynamic segments as patterns", () => {
    expect(getRoutePattern(["activity", "[id]"])).toBe("/activity/[id]");
  });

  it("returns '/' for the root or group-only routes", () => {
    expect(getRoutePattern([])).toBe("/");
    expect(getRoutePattern(["(tabs)"])).toBe("/");
  });
});
