import { describe, it, expect } from "vitest";
import { computePaceStats } from "../pace";

describe("computePaceStats", () => {
  it("aggregates per driver avg/stdev/fastest", () => {
    const laps = [
      { driver_number: 11, lap_duration: 90 },
      { driver_number: 11, lap_duration: 92 },
      { driver_number: 1,  lap_duration: 88 },
      { driver_number: 1,  lap_duration: 89 },
    ];
    const stats = computePaceStats(laps);
    const d1 = stats.find(s => s.driver_number === 1)!;
    const d11 = stats.find(s => s.driver_number === 11)!;
    expect(d1.fastest).toBe(88);
    expect(d11.avg).toBe((90+92)/2);
    expect(d1.laps).toBe(2);
  });
});
