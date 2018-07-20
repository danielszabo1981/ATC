
function plot_curve(x, y, xx, yy) {
  // returns an array of x,y coordinates to graph a perfect curve between 2 points.
  var startX = x;
  var startY = y;

  var endX = xx;
  var endY = yy;

  var diff_x = xx - x;
  var diff_y = yy - y;

  var xy = [];
  var xy_count = -1;

  var bezierX = x;  // x1
  var bezierY = yy; // y2

  var t;

  for (t = 0.0; t <= 1; t += 0.01) {
    xy_count++;
    xy[xy_count] = {};
    xy[xy_count].x = Math.round((1 - t) * (1 - t) * startX + 2 * (1 - t) * t * bezierX + t * t * endX);
    xy[xy_count].y = Math.round((1 - t) * (1 - t) * startY + 2 * (1 - t) * t * bezierY + t * t * endY);
  }

  return xy; // returns array of coordinates
}

function plot_curve_between_airports(airportStart, airportStop) {
  // returns an array of x,y coordinates to graph a perfect curve between 2 points.
  return plot_curve(
    airportStart.x,
    airportStart.y,
    airportStop.x,
    airportStop.y);
}

function plot_curve_between_airports_by_code(airportStartCode, airportStopCode) {
  console.log(`${airportStartCode} - ${airportStopCode}`);
  // returns an array of x,y coordinates to graph a perfect curve between 2 points.
  var airportStart = getAirportByCode(airportStartCode);
  var airportStop  = getAirportByCode(airportStopCode);
  return plot_curve(
    airportStart.x,
    airportStart.y,
    airportStop.x,
    airportStop.y);
}

const getAirportByCode = (airportCode) => {
  return AirportData.find((airport) => { return airport.code === airportCode });
};

const createRoute = ({ code, startAirportCode, stopAirportCode }) => ({
  code: code.toUpperCase(),
  start: startAirportCode.toUpperCase(),
  stop: stopAirportCode.toUpperCase(),
  path: plot_curve_between_airports_by_code(startAirportCode, stopAirportCode),
  uiPath: plot_curve_between_airports_by_code(startAirportCode, stopAirportCode).filter((element, index) => { return index % 4 === 0; }),
});

const createAirport = ({ code, name, x, y, routes }) => ({
  code,
  name,
  x,
  y,
  // pre-compute the route data points so that they're ready for binding before the app starts
  routes: routes.map((route) => createRoute(route))
});

const AirportData = [
  {
    code: "BLR", name: "Bangaloru", x: 859, y: 251, routes: [
      { code: "BLR_BOM", startAirportCode: "BLR", stopAirportCode: "BOM" },
      { code: "BLR_KWI", startAirportCode: "BLR", stopAirportCode: "KWI" },
      { code: "BLR_SYD", startAirportCode: "BLR", stopAirportCode: "SYD" }
    ]
  },
  {
    code: "CPT", name: "Capte Town", x: 660, y: 410, routes: [
      { code: "CPT_GIG", startAirportCode: "CPT", stopAirportCode: "GIG" },
      { code: "CPT_BLR", startAirportCode: "CPT", stopAirportCode: "BLR" },
      { code: "CPT_FRA", startAirportCode: "CPT", stopAirportCode: "FRA" }
    ]
  },
  {
    code: "DFW", name: "Dallas", x: 252, y: 186, routes: [
      { code: "DFW_OAK", startAirportCode: "DFW", stopAirportCode: "OAK" },
      { code: "DFW_MIA", startAirportCode: "DFW", stopAirportCode: "MIA" }
    ]
  },
  {
    code: "HNL", name: "Honolulu", x: 75, y: 229, routes: [
      { code: "HNL_OAK", startAirportCode: "HNL", stopAirportCode: "OAK" },
    ]
  },
  {
    code: "FRA", name: "Frankfurt", x: 609, y: 140, routes: [
      { code: "FRA_KWI", startAirportCode: "FRA", stopAirportCode: "KWI" },
      { code: "FRA_MIA", startAirportCode: "FRA", stopAirportCode: "MIA" },
    ]
  },
  {
    code: "KWI", name: "Kuwait", x: 710, y: 210, routes: [
      { code: "KWI_FRA", startAirportCode: "KWI", stopAirportCode: "FRA" },
    ]
  },
  {
    code: "MIA", name: "Miami", x: 329, y: 211, routes: [
      { code: "MIA_DFW", startAirportCode: "MIA", stopAirportCode: "DFW" },
      { code: "MIA_FRA", startAirportCode: "MIA", stopAirportCode: "FRA" },
      { code: "MIA_GIG", startAirportCode: "MIA", stopAirportCode: "GIG" },
    ]
  },
  {
    code: "BOM", name: "Mumbai", x: 835, y: 230, routes: []
  },
  {
    code: "OAK", name: "Oakland", x: 192, y: 170, routes: [
      { code: "OAK_HNL", startAirportCode: "OAK", stopAirportCode: "HNL" },
      { code: "OAK_DFW", startAirportCode: "OAK", stopAirportCode: "DFW" },
      { code: "OAK_MIA", startAirportCode: "OAK", stopAirportCode: "MIA" },
    ]
  },
  { code: "GIG", name: "Rio de Janeiro", x: 457, y: 376, routes: [] },
  { code: "SYD", name: "Sydney", x: 1103, y: 413, routes: [] }
];


