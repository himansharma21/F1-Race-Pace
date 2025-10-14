export interface Session {
  session_key: number;
  meeting_key: number;
  country_name?: string;
  location?: string;
  circuit_short_name?: string;
  session_name: string;
  date_start: string;   
  year: number;
  meeting_name?: string; 
}



export interface StartingGridRow {
  session_key: number;
  driver_number: number;
  position: number; 
}

export interface SessionResultRow {
  session_key: number;
  driver_number: number;
  position: number; 
  status?: string;  
}

export interface Driver {
  driver_number: number;
  full_name?: string;
  name_acronym?: string;
  team_name?: string;
  team_colour?: string; 
}

export interface DeltaRow {
  driver_number: number;
  name: string;
  team: string;
  grid: number | null;
  finish: number | null;
  delta: number | null; 
  status?: string;
  teamColour?: string;
}

export function computeDeltas(
  grid: StartingGridRow[],
  results: SessionResultRow[],
  drivers: Driver[]
): DeltaRow[] {
  const gridMap = new Map<number, StartingGridRow>();
  grid.forEach(g => gridMap.set(g.driver_number, g));

  const driverMap = new Map<number, Driver>();
  drivers.forEach(d => driverMap.set(d.driver_number, d));

  const rows: DeltaRow[] = [];

  
  
  const driverNumbers = new Set<number>([
    ...grid.map(g => g.driver_number),
    ...results.map(r => r.driver_number)
  ]);

  for (const dn of driverNumbers) {
    const g = gridMap.get(dn) ?? null;
    const r = results.find(x => x.driver_number === dn) ?? null;
    const dmeta = driverMap.get(dn) ?? {};

    const gridPos = g?.position ?? null;
    const finishPos = r?.position ?? null;
    const delta =
      gridPos != null && finishPos != null ? gridPos - finishPos : null;

    rows.push({
      driver_number: dn,
      name: dmeta.full_name ?? dmeta.name_acronym ?? String(dn),
      team: dmeta.team_name ?? "",
      teamColour: dmeta.team_colour,
      grid: gridPos,
      finish: finishPos,
      delta,
      status: r?.status
    });
  }


  rows.sort((a, b) => {
    if (a.finish != null && b.finish != null) return a.finish - b.finish;
    if (a.grid != null && b.grid != null) return a.grid - b.grid;
    return a.driver_number - b.driver_number;
  });

  return rows;
}

export function medianOf<T>(arr: T[], selector: (x: T) => number | null): number | null {
  const vals = arr.map(selector).filter((v): v is number => v != null).sort((a,b)=>a-b);
  if (vals.length === 0) return null;
  const mid = Math.floor(vals.length / 2);
  return vals.length % 2 === 0 ? (vals[mid - 1] + vals[mid]) / 2 : vals[mid];
}
