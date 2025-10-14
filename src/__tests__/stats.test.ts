import { describe, it, expect } from "vitest";
import { summarize } from "../stats";

describe("summarize", () => {
  const S = (dn:number, avg:number, stdev:number, fastest:number) =>
    ({ driver_number: dn, avg, stdev, fastest, laps: 10 });

  it("computes medians and picks extremes", () => {
    const summary = summarize([
      S(1,  90, 0.5, 88),
      S(11, 91, 0.7, 89),
      S(16, 92, 0.4, 90),
    ]);
    expect(summary.medianPace?.toFixed(3)).toBe("91.000");
    expect(summary.medianFastest?.toFixed(3)).toBe("89.000");
    expect(summary.fastest?.driver_number).toBe(1);
    expect(summary.slowest?.driver_number).toBe(16);
    expect(summary.mostConsistent?.driver_number).toBe(16);
  });
});
