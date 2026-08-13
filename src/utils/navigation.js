/**
 * Cross-tab / nested-stack navigation helpers.
 *
 * Places and Food are direct Tab screens — their `navigation` is already the
 * tab navigator, so `getParent()?.navigate(...)` is a no-op (parent is null
 * or cannot see sibling tab routes).
 *
 * History / Home / Profile screens live inside nested stacks — they need
 * `getParent()` (the Tab navigator) to jump to sibling tabs.
 *
 * This helper climbs parents until it finds a navigator that knows the route.
 */
export function navigateApp(navigation, name, params) {
  if (!navigation || typeof navigation.navigate !== 'function') return false;

  let current = navigation;
  const seen = new Set();

  while (current && !seen.has(current)) {
    seen.add(current);
    const state = typeof current.getState === 'function' ? current.getState() : null;
    const routeNames = state?.routeNames
      ?? (Array.isArray(state?.routes) ? state.routes.map((r) => r.name) : null);

    if (Array.isArray(routeNames) && routeNames.includes(name)) {
      if (params === undefined) {
        current.navigate(name);
      } else {
        current.navigate(name, params);
      }
      return true;
    }

    const parent = typeof current.getParent === 'function' ? current.getParent() : null;
    if (!parent || parent === current) break;
    current = parent;
  }

  // Fallback: direct navigate on the caller's navigator (works for tab siblings).
  try {
    if (params === undefined) {
      navigation.navigate(name);
    } else {
      navigation.navigate(name, params);
    }
    return true;
  } catch {
    return false;
  }
}
