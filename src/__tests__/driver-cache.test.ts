import { describe, it, expect, vi, beforeEach } from "vitest";
import * as api from "../api";
import { getDriverMap } from "../drivers"; // move driver-map logic out of main.ts to drivers.ts

beforeEach(() => localStorage.clear());

describe("driver map cache", () => {
  it("caches drivers in localStorage", async () => {
    const fake = [{ driver_number:44, full_name:"Lewis", team_name:"Mercedes", team_colour:"00FF00" }];
    const spy = vi.spyOn(api, "getDrivers").mockResolvedValue(fake as any);

    const map1 = await getDriverMap(9999);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(map1[44].name).toBe("Lewis");

    const map2 = await getDriverMap(9999);
    expect(spy).toHaveBeenCalledTimes(1); // no second call, pulled from cache
    expect(map2[44].team).toBe("Mercedes");
  });
});
