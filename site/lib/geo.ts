/** Small geometry helpers for the drawn search area. Points are [lat, lng]. */
export type LatLng = [number, number];

/**
 * Nonzero winding test, with lng as x and lat as y. Freehand shapes often cross themselves
 * (overshooting the start, or circling twice); nonzero keeps every looped region inside,
 * which matches how the shape looks while it is being drawn.
 */
export function pointInPolygon([lat, lng]: LatLng, poly: LatLng[]) {
  let wn = 0;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [yi, xi] = poly[i];
    const [yj, xj] = poly[j];
    const cross = (xi - xj) * (lat - yj) - (lng - xj) * (yi - yj);
    if (yj <= lat) {
      if (yi > lat && cross > 0) wn++;
    } else if (yi <= lat && cross < 0) wn--;
  }
  return wn !== 0;
}

/**
 * True when the points cannot enclose anything: fewer than three distinct points, or all of
 * them on (or within `tol` degrees of) one straight line. Signed area is no use here because a
 * figure-of-eight encloses space yet nets to zero.
 */
export function isDegenerate(points: LatLng[], tol = 5e-4) {
  if (points.length < 3) return true;
  const a = points[0];
  let b = a;
  let far = 0;
  for (const p of points) {
    const d = Math.hypot(p[0] - a[0], p[1] - a[1]);
    if (d > far) {
      far = d;
      b = p;
    }
  }
  if (far <= tol) return true;
  return points.every((p) => perpendicular(p, a, b) <= tol);
}

export function bounds(points: LatLng[]) {
  let s = 90, n = -90, w = 180, e = -180;
  for (const [lat, lng] of points) {
    s = Math.min(s, lat);
    n = Math.max(n, lat);
    w = Math.min(w, lng);
    e = Math.max(e, lng);
  }
  return { s, n, w, e };
}

export function centroid(points: LatLng[]): LatLng {
  const b = bounds(points);
  return [(b.s + b.n) / 2, (b.w + b.e) / 2];
}

function perpendicular(p: LatLng, a: LatLng, b: LatLng) {
  const [py, px] = p, [ay, ax] = a, [by, bx] = b;
  const dx = bx - ax, dy = by - ay;
  const len = dx * dx + dy * dy;
  if (!len) return Math.hypot(px - ax, py - ay);
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

/** Douglas–Peucker simplification. */
function dp(points: LatLng[], tol: number): LatLng[] {
  if (points.length < 3) return points;
  let max = 0, idx = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const d = perpendicular(points[i], points[0], points[points.length - 1]);
    if (d > max) {
      max = d;
      idx = i;
    }
  }
  if (max <= tol) return [points[0], points[points.length - 1]];
  const left = dp(points.slice(0, idx + 1), tol);
  const right = dp(points.slice(idx), tol);
  return [...left.slice(0, -1), ...right];
}

/**
 * Simplifies a drawn outline so it stays short enough to share in a URL.
 * Starts at `tol` (degrees) and loosens until the shape has at most maxPoints vertices.
 */
export function simplifyPolygon(points: LatLng[], tol: number, maxPoints = 40): LatLng[] {
  // Drop near-duplicate neighbours (double clicks, jittery touch) first.
  const clean: LatLng[] = [];
  for (const p of points) {
    const last = clean[clean.length - 1];
    if (!last || Math.hypot(p[0] - last[0], p[1] - last[1]) > tol / 4) clean.push(p);
  }
  if (clean.length > 1) {
    const [a, b] = [clean[0], clean[clean.length - 1]];
    if (Math.hypot(a[0] - b[0], a[1] - b[1]) <= tol / 4) clean.pop();
  }
  let out = clean;
  let t = tol;
  for (let i = 0; i < 12 && (out.length > maxPoints || i === 0); i++) {
    out = dp([...clean, clean[0]], t).slice(0, -1);
    t *= 1.6;
  }
  return out.map(([lat, lng]) => [Math.round(lat * 1000) / 1000, Math.round(lng * 1000) / 1000]);
}
