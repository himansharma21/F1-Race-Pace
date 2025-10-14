// ---------- Summary computations for Statistics card ----------
export function summarize(stats: DriverPace[]) {
  if (!stats.length) {
    return {
      medianPace: null as number | null,
      totalStdDev: null as number | null,
      medianFastest: null as number | null,
      fastest: unknown as { driver_number: number; lap: number },
      slowest: null as { driver_number: number; lap: number },
      mostConsistent: null as { driver_number: number; stdev: number },
    };
  }

  // helpers
  const median = (arr: number[]) => {
    const xs = [...arr].sort((a, b) => a - b);
    const n = xs.length;
    if (n === 0) return null;
    const m = Math.floor(n / 2);
    return n % 2 ? xs[m] : (xs[m - 1] + xs[m]) / 2;
  };


  const medianPace = median(stats.map(s => s.avg))!;


  const totalStdDev = stats.reduce((a, s) => a + s.stdev, 0);


  const medianFastest = median(stats.map(s => s.fastest))!;

  
  const fastest = stats.reduce((best, s) =>
    !best || s.fastest < best.lap ? { driver_number: s.driver_number, lap: s.fastest } : best, null as any
  );

 
  const slowest = stats.reduce((worst, s) =>
    !worst || s.fastest > worst.lap ? { driver_number: s.driver_number, lap: s.fastest } : worst, null as any
  );

  
  const mostConsistent = stats.reduce((best, s) =>
    !best || s.stdev < best.stdev ? { driver_number: s.driver_number, stdev: s.stdev } : best, null as any
  );

  return { medianPace, totalStdDev, medianFastest, fastest, slowest, mostConsistent };
}