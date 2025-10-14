import type { Session } from "./domain";
import type { DriverPace } from "./pace";
import type { DriverMap } from "./main";

export function setStatus(text: string) {
  const el = document.getElementById("status");
  if (el) el.textContent = text;
}

export function renderRaceList(container: HTMLElement, sessions: Session[]) {
  container.innerHTML = `
    <section class="card">
      <h2>Races</h2>
      <ul style="list-style:none;padding:0;margin:0;">
        ${sessions.map(s => {
          const date = new Date(s.date_start).toLocaleDateString(undefined, { dateStyle: "medium" });
          const title = s.meeting_name ?? `${s.country_name ?? ""} GP`;
          return `<li class="card" style="margin:0.5rem 0;">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:1rem;">
              <div>
                <div><b>${escapeHtml(title)}</b></div>
                <div class="caption">${escapeHtml(s.circuit_short_name ?? "")} • ${date}</div>
              </div>
              <a class="btn" href="#/race/${s.session_key}">Open</a>
            </div>
          </li>`;
        }).join("")}
      </ul>
    </section>
  `;
}

type Summary = ReturnType<typeof fakeSummaryType>;
function fakeSummaryType() {
  return {
    medianPace: null as number | null,
    totalStdDev: null as number | null,
    medianFastest: null as number | null,
    fastest: null as { driver_number: number; lap: number } | null,
    slowest: null as { driver_number: number; lap: number } | null,
    mostConsistent: null as { driver_number: number; stdev: number } | null,
  };
}

export function renderRaceDetailPace(
  container: HTMLElement,
  session: Session,
  data: DriverPace[],
  driverMap: DriverMap,
  summary: Summary
) {
  const title = session.meeting_name ?? `${session.country_name ?? ""} GP`;
  const subtitle = new Date(session.date_start).toLocaleString(undefined, { dateStyle: "medium" });

  const nameOf = (dn: number) => driverMap[dn]?.name ?? String(dn);
  const teamOf = (dn: number) => driverMap[dn]?.team ?? "";
  const colourOf = (dn: number) => driverMap[dn]?.colour;

  const statRow = (label: string, value: string) =>
    `<div style="display:flex;justify-content:space-between;"><span>${label}</span><span class="mono">${value}</span></div>`;

  const fastestStr = summary.fastest
    ? `${dot(colourOf(summary.fastest.driver_number))}${escapeHtml(nameOf(summary.fastest.driver_number))} — ${summary.fastest.lap.toFixed(3)}s`
    : "n/a";

  const slowestStr = summary.slowest
    ? `${dot(colourOf(summary.slowest.driver_number))}${escapeHtml(nameOf(summary.slowest.driver_number))} — ${summary.slowest.lap.toFixed(3)}s`
    : "n/a";

  const consistentStr = summary.mostConsistent
    ? `${dot(colourOf(summary.mostConsistent.driver_number))}${escapeHtml(nameOf(summary.mostConsistent.driver_number))} — σ ${summary.mostConsistent.stdev.toFixed(3)}`
    : "n/a";

  container.innerHTML = `
    <a href="#/" style="text-decoration:none;">← Back</a>

    <!-- Statistics card -->
    <section class="card">
      <h2>Statistics</h2>
      <div class="caption">${escapeHtml(title)} <span>(${subtitle})</span></div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin-top:8px;">
        <div class="card">
          <h3 style="margin-top:0;">Pace</h3>
          ${statRow("Median pace (avg laps)", summary.medianPace == null ? "n/a" : `${summary.medianPace.toFixed(3)}s`)}
          ${statRow("Total stddev (Σ per-driver σ)", summary.totalStdDev == null ? "n/a" : summary.totalStdDev.toFixed(3))}
          ${statRow("Median fastest lap", summary.medianFastest == null ? "n/a" : `${summary.medianFastest.toFixed(3)}s`)}
        </div>
        <div class="card">
          <h3 style="margin-top:0;">Leaders</h3>
          ${statRow("Fastest driver by fast lap", fastestStr)}
          ${statRow("Slowest driver by fast lap", slowestStr)}
          ${statRow("Most consistent (lowest σ)", consistentStr)}
        </div>
      </div>
    </section>

    <!-- Detailed table -->
    <section class="card">
      <h2>${escapeHtml(title)} <span class="caption">(${subtitle})</span></h2>
      <div class="caption">Driver race pace analysis (based on lap durations)</div>
      <div style="overflow:auto;margin-top:0.5rem;">
        <table class="table">
          <thead>
            <tr>
              <th>Driver</th><th>Team</th><th>Laps</th><th>Avg (s)</th><th>StDev</th><th>Fastest Lap</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(d => {
              return `<tr>
                <td>${dot(colourOf(d.driver_number))}${escapeHtml(nameOf(d.driver_number))}</td>
                <td>${escapeHtml(teamOf(d.driver_number))}</td>
                <td class="mono">${d.laps}</td>
                <td class="mono">${d.avg.toFixed(3)}</td>
                <td class="mono">${d.stdev.toFixed(3)}</td>
                <td class="mono">${d.fastest.toFixed(3)}</td>
              </tr>`;
            }).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}


// makes the circular dots for each team's colors
function dot(hex?: string) {
  if (!hex) return "";
  const c = hex.startsWith("#") ? hex : `#${hex}`;
  return `<span style="display:inline-block;width:10px;height:10px;background:${c};border-radius:50%;margin-right:6px;vertical-align:middle;"></span>`;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
