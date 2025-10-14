import { getLaps } from "./api";

interface Lap {
  driver_number: number;
  lap_number: number;
  lap_duration: number;
}

export interface DriverPace {
  driver_number: number;
  avg: number;
  stdev: number;
  fastest: number;
  laps: number;
}

export async function getRacePace(raceId: number): Promise<DriverPace[]> {
  const key = `laps_${raceId}`;
  let laps: Lap[] | null = null;

  const cached = localStorage.getItem(key);
  if (cached) {
    laps = JSON.parse(cached);
  } else {
    const fresh = await getLaps(raceId);
    laps = fresh.filter(r => r.lap_duration);
    localStorage.setItem(key, JSON.stringify(laps));
  }

  return computeStats(laps!);
}

function computeStats(laps: Lap[]): DriverPace[] {
  const byDriver = new Map<number, number[]>();
  for (const l of laps) {
    if (!byDriver.has(l.driver_number)) byDriver.set(l.driver_number, []);
    byDriver.get(l.driver_number)!.push(l.lap_duration);
  }

  const stats: DriverPace[] = [];
  for (const [driver, times] of byDriver) {
    const n = times.length;
    const avg = times.reduce((a, b) => a + b, 0) / n;
    const stdev = Math.sqrt(times.map(t => (t - avg) ** 2).reduce((a, b) => a + b, 0) / n);
    const fastest = Math.min(...times);
    stats.push({ driver_number: driver, avg, stdev, fastest, laps: n });
  }
  return stats.sort((a, b) => a.avg - b.avg);
}

// does not use cache, used for testing
export function computePaceStats(laps: Lap[]): DriverPace[] {
  const byDriver = new Map<number, number[]>();
  for (const l of laps) {
    if (!byDriver.has(l.driver_number)) byDriver.set(l.driver_number, []);
    byDriver.get(l.driver_number)!.push(l.lap_duration);
  }

  const stats: DriverPace[] = [];
  for (const [driver, times] of byDriver) {
    const n = times.length;
    const avg = times.reduce((a, b) => a + b, 0) / n;
    const stdev = Math.sqrt(times.map(t => (t - avg) ** 2).reduce((a, b) => a + b, 0) / n);
    const fastest = Math.min(...times);
    stats.push({ driver_number: driver, avg, stdev, fastest, laps: n });
  }

  return stats.sort((a, b) => a.avg - b.avg);
}
