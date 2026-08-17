const memoryCache = new Map();
const inFlightRequests = new Map();
const storagePrefix = "prescripto-admin-cache:";

const now = () => Date.now();

const safeGetStorage = (key) => {
  try {
    const raw = localStorage.getItem(`${storagePrefix}${key}`);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || parsed.expiresAt <= now()) {
      localStorage.removeItem(`${storagePrefix}${key}`);
      return null;
    }

    return parsed.data;
  } catch {
    return null;
  }
};

const safeSetStorage = (key, data, ttlMs) => {
  try {
    localStorage.setItem(
      `${storagePrefix}${key}`,
      JSON.stringify({
        data,
        expiresAt: now() + ttlMs,
      })
    );
  } catch {
    // Ignore storage quota / unavailable storage failures.
  }
};

export const invalidateCache = (match = "") => {
  for (const key of memoryCache.keys()) {
    if (!match || key.includes(match)) {
      memoryCache.delete(key);
    }
  }

  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (key?.startsWith(storagePrefix) && (!match || key.includes(match))) {
        keys.push(key);
      }
    }
    keys.forEach((key) => localStorage.removeItem(key));
  } catch {
    // Ignore storage access issues.
  }
};

export const cachedRequest = async (
  key,
  fetcher,
  { ttlMs = 60000, persist = false, force = false } = {}
) => {
  const cacheKey = String(key);

  if (!force) {
    const memoryEntry = memoryCache.get(cacheKey);
    if (memoryEntry && memoryEntry.expiresAt > now()) {
      return memoryEntry.data;
    }

    if (persist) {
      const storageData = safeGetStorage(cacheKey);
      if (storageData !== null) {
        memoryCache.set(cacheKey, {
          data: storageData,
          expiresAt: now() + ttlMs,
        });
        return storageData;
      }
    }
  }

  if (inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey);
  }

  const request = Promise.resolve()
    .then(fetcher)
    .then((data) => {
      const entry = {
        data,
        expiresAt: now() + ttlMs,
      };
      memoryCache.set(cacheKey, entry);
      if (persist) {
        safeSetStorage(cacheKey, data, ttlMs);
      }
      return data;
    })
    .finally(() => {
      inFlightRequests.delete(cacheKey);
    });

  inFlightRequests.set(cacheKey, request);
  return request;
};
