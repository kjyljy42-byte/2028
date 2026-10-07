export function getCountdown(target, now = Date.now()) {
  const total = Math.max(
    0,
    Math.ceil((new Date(target).getTime() - now) / 1000),
  );
  return {
    total,
    days: Math.floor(total / 86400),
    hours: Math.floor(total / 3600) % 24,
    minutes: Math.floor(total / 60) % 60,
    seconds: total % 60,
  };
}
