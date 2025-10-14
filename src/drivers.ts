import { getDrivers } from "./api";

export async function getDriverMap(sessionKey: number): Promise<DriverMap> {
  const key = `drivers_${sessionKey}`;
  const cached = localStorage.getItem(key);
  if (cached) return JSON.parse(cached) as DriverMap;

  const drivers = await getDrivers(sessionKey);
  const map: DriverMap = {};
  for (const d of drivers) {
    const name = d.full_name ?? d.name_acronym ?? String(d.driver_number);
    map[d.driver_number] = {
      name,
      team: d.team_name ?? undefined,
      colour: d.team_colour ?? undefined,
    };
  }
  localStorage.setItem(key, JSON.stringify(map));
  return map;
}