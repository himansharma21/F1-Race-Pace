async function getJSON<T>(url: string, signal?: AbortSignal): Promise<T> {
  const r = await fetch(url, { signal });
  if (!r.ok) throw new Error(`${r.status} ${r.statusText} for ${url}`);
  return r.json() as Promise<T>;
}

const BASE = "https://api.openf1.org/v1";

export async function getRaceSessions(year: number): Promise<import("./domain").Session[]> {
  const url = `${BASE}/sessions?year=${year}&session_name=Race`;
  return getJSON(url);
}

export async function getStartingGrid(sessionKey: number) {
  const url = `${BASE}/starting_grid?session_key=${sessionKey}`;
  return getJSON<import("./domain").StartingGridRow[]>(url);
}

export async function getSessionResult(sessionKey: number) {
  const url = `${BASE}/session_result?session_key=${sessionKey}`;
  return getJSON<import("./domain").SessionResultRow[]>(url);
}

export async function getDrivers(sessionKey: number) {
  const url = `${BASE}/drivers?session_key=${sessionKey}`;
  return getJSON<import("./domain").Driver[]>(url);
}

/** Fetch everything needed for a race, in parallel */
export async function getRaceBundle(sessionKey: number) {
  const [grid, result, drivers] = await Promise.all([
    getStartingGrid(sessionKey),
    getSessionResult(sessionKey),
    getDrivers(sessionKey)
  ]);
  return { grid, result, drivers };
}

export async function getLaps(sessionKey: number) {
  const url = `https://api.openf1.org/v1/laps?session_key=${sessionKey}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Lap fetch failed ${r.status}`);
  return r.json() as Promise<{
    driver_number: number;
    lap_number: number;
    lap_duration: number;
  }[]>;
}