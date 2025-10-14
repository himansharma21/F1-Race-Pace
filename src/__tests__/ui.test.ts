import { describe, it, expect } from "vitest";
import { renderRaceDetailPace } from "../ui";

describe("race table render", () => {
  it("renders one row per driver", () => {
    const div = document.createElement("div");
    const session = { meeting_name:"Test GP", date_start:new Date().toISOString() } as any;
    const data = [
      { driver_number: 1, avg: 90, stdev: 0.5, fastest: 88, laps: 2 },
      { driver_number: 11, avg: 91, stdev: 0.7, fastest: 89, laps: 2 },
    ];
    const drivers = {
      1: { name: "Max", team: "Red Bull", colour: "0033FF" },
      11:{ name: "Checo", team: "Red Bull", colour: "0033FF" }
    };
    const summary = { medianPace: 90.5, totalStdDev: 1.2, medianFastest: 88.5,
      fastest: { driver_number: 1, lap: 88 }, slowest:{ driver_number: 11, lap: 89 },
      mostConsistent:{ driver_number: 1, stdev: 0.5 }
    };
    renderRaceDetailPace(div, session, data as any, drivers as any, summary as any);
    expect(div.querySelectorAll("tbody tr").length).toBe(2);
    expect(div.textContent).toContain("Max");
  });
});
