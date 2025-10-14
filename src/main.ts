import { getRaceSessions, getRaceBundle, getDrivers } from "./api";
import { type Session } from "./domain";
import { setStatus, renderRaceList, renderRaceDetailPace } from "./ui";
import { Router } from "./router";
import { getRacePace, type DriverPace } from "./pace";
import { summarize } from "./stats";
import { getDriverMap } from "./drivers";

const form = document.getElementById("controls") as HTMLFormElement;
const seasonInput = document.getElementById("season") as HTMLInputElement;
const view = document.getElementById("view") as HTMLElement;

let cachedSessions: Session[] = [];


export interface DriverMeta {
  name: string;
  team?: string;
  colour?: string;
}
export type DriverMap = Record<number, DriverMeta>;


form.addEventListener("submit", async (e) => {
  e.preventDefault();
  window.location.hash = "#/";   // back to list on season change
  await loadList();
});

async function loadList() {
  const year = Number(seasonInput.value);
  setStatus("Loading races…");
  try {
    cachedSessions = (await getRaceSessions(year)).sort(
      (a, b) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime()
    );
    renderRaceList(view, cachedSessions);
    setStatus(`Loaded ${cachedSessions.length} races for ${year}.`);
  } catch (err) {
    console.error(err);
    setStatus("Failed to load race list.");
    view.innerHTML = `<section class="card">Could not load races for ${year}.</section>`;
  }
}

async function loadRace(sessionKey: number) {
  setStatus("Loading race pace data…");

  let session = cachedSessions.find(s => s.session_key === sessionKey);
  if (!session) {
    try {
      await loadList();
      session = cachedSessions.find(s => s.session_key === sessionKey);
    } catch { console.log("Could not load race pace data...") }
  }

  try {
    const [stats, driverMap] = await Promise.all([
      getRacePace(sessionKey),
      getDriverMap(sessionKey)
    ]);

    const summary = summarize(stats);

    const fallbackSession: Session =
      session ??
      ({
        session_key: sessionKey,
        meeting_key: 0,
        session_name: "Race",
        date_start: new Date().toISOString(),
        year: Number(seasonInput.value),
        meeting_name: "(Unknown GP)",
      } as Session);

   
    renderRaceDetailPace(view, fallbackSession, stats, driverMap, summary);
    setStatus("Done.");
  } catch (err) {
    console.error(err);
    view.innerHTML = `<a href="#/">← Back</a><div class="card">Failed to load race pace data.</div>`;
    setStatus("Failed to load.");
  }
}


const router = new Router();
router.add(/^#\/$/, () => loadList());
router.add(/^#\/race\/(?<id>\d+)$/, ({ id }) => loadRace(Number(id)));
router.setNotFound(() => { window.location.hash = "#/"; });
router.start();

loadList().catch(console.error);
