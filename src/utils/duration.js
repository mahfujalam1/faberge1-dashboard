// Service duration helpers. Durations are stored as minutes (15-minute increments, 15..480).

export const DURATION_MIN = 15;
export const DURATION_MAX = 480;
export const DURATION_STEP = 15;

export const formatDuration = (minutes) => {
  const m = Number(minutes);
  if (!Number.isFinite(m) || m <= 0) return "—";
  if (m < 60) return `${m} minutes`;
  const hours = Math.floor(m / 60);
  const rest = m % 60;
  const hPart = `${hours} ${hours === 1 ? "hr" : "hrs"}`;
  if (rest === 0) return hPart;
  return `${hPart} ${rest} mnts`;
};

export const getDurationOptions = () => {
  const opts = [];
  for (let m = DURATION_MIN; m <= DURATION_MAX; m += DURATION_STEP) {
    opts.push({ value: m, label: formatDuration(m) });
  }
  return opts;
};

export const isValidDuration = (minutes) => {
  const m = Number(minutes);
  return (
    Number.isFinite(m) &&
    m >= DURATION_MIN &&
    m <= DURATION_MAX &&
    m % DURATION_STEP === 0
  );
};
