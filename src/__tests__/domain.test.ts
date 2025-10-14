import { describe, it, expect } from "vitest";
import { medianOf, computeDeltas } from "../domain";

describe("medianOf", () => {
  it("handles odd/even", () => {
    expect(medianOf([1,2,3], x => x)).toBe(2);
    expect(medianOf([1,2,3,4], x => x)).toBe(2.5);
  });
  it("handles nulls/empty", () => {
    expect(medianOf([{v:null},{v:2}], x => x.v as any)).toBe(2);
    expect(medianOf([], x => x as any)).toBeNull();
  });
});

describe("computeDeltas", () => {
  it("joins grid/results by driver and sorts by finish", () => {
    const grid = [{session_key:1, driver_number:44, position:1},
                  {session_key:1, driver_number:1, position:2}];
    const results = [{session_key:1, driver_number:1, position:1, status:"Finished"},
                     {session_key:1, driver_number:44, position:2, status:"Finished"}];
    const drivers = [
      {driver_number:44, full_name:"Lewis"},
      {driver_number:1, full_name:"Max"}
    ] as any;
    const rows = computeDeltas(grid as any, results as any, drivers as any);
    expect(rows[0].driver_number).toBe(1);           // winner first
    expect(rows[0].delta).toBe(1);                   // started 2 -> finished 1
    expect(rows[1].delta).toBe(-1);                  // started 1 -> finished 2
  });

  it("handles missing grid/finish gracefully", () => {
    const rows = computeDeltas([], [{session_key:1, driver_number:63, position:5}], [] as any);
    expect(rows[0].grid).toBeNull();
    expect(rows[0].finish).toBe(5);
  });
});
