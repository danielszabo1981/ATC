/// <reference path="../vue.js" />
/// <reference path="world.airports.js" />
function init() {
  makeWorldMapGrid();
  wireupMouseClickOnMap();
  app.animatePlanes();

  app.assignPlaneToRoute("SW01", "HNL_OAK");
  app.assignPlaneToRoute("SW02", "MIA_GIG");
  app.assignPlaneToRoute("SW03", "BLR_SYD");
  app.assignPlaneToRoute("SW04", "OAK_HNL");
  app.assignPlaneToRoute("SW05", "DFW_MIA");
  app.assignPlaneToRoute("SW06", "DFW_OAK");
  app.assignPlaneToRoute("SW07", "MIA_FRA");
  app.assignPlaneToRoute("SW07", "MIA_FRA");
  app.assignPlaneToRoute("SW08", "BLR_KWI");
  app.assignPlaneToRoute("SW09", "KWI_FRA");
  app.assignPlaneToRoute("SW10", "CPT_BLR")
}



var app = new Vue({
  el: "#app",
  data: {
    message: "Hello, Traveler.",
    // Refresh airplane position ever N seconds
    animationInterval: 1000,
    // the return value from setInterval. Nullify to pause the animation frames.
    animationStartedSetInterval: null,
    // the number of xpos-pixels to step planes each frame
    airplanePosXIncrement: 1,
    selectedAirport: {},
    selectedAirplane: {},
    airports: AirportData.map( (airport) => createAirport(airport) ),
    airplanes: [
      { code: "SW01",  name: "Bangaloru", x: 859, y: 251, rotateDegrees: 0, currentStep: 0, currentRoute: null, tripPercentage: 0 }
      ,{ code: "SW02", name: "Dallas", x: 252, y: 186, rotateDegrees: 0, currentStep: 0, currentRoute: null, tripPercentage: 0 }
      ,{ code: "SW03", name: "Honolulu", x: 75, y: 229, rotateDegrees: 0, currentStep: 0, currentRoute: null, tripPercentage: 0 }
      ,{ code: "SW04", name: "Frankfurt", x: 609, y: 140, rotateDegrees: 0, currentStep: 0, currentRoute: null, tripPercentage: 0 }
      ,{ code: "SW05", name: "Kuwait", x: 710, y: 210, rotateDegrees: 0, currentStep: 0, currentRoute: null, tripPercentage: 0 }
      ,{ code: "SW06", name: "Miami", x: 329, y: 211, rotateDegrees: 0, currentStep: 0, currentRoute: null, tripPercentage: 0 }
      ,{ code: "SW07", name: "Mumbai", x: 835, y: 230, rotateDegrees: 0, currentStep: 0, currentRoute: null, tripPercentage: 0 }
      ,{ code: "SW08", name: "Oakland", x: 192, y: 170, rotateDegrees: 0, currentStep: 0, currentRoute: null, tripPercentage: 0 }
      ,{ code: "SW09", name: "Rio de Janeiro", x: 457, y: 376, rotateDegrees: 0, currentStep: 0, currentRoute: null, tripPercentage: 0 }
      ,{ code: "SW10", name: "Sydney", x: 1103, y: 413, rotateDegrees: 0, currentStep: 0, currentRoute: null, tripPercentage: 0 }
    ]
  },
  methods: {
    animatePlanes: function () {
      var self = this;
      app.animationStartedSetInterval = setInterval(function () {
        app.movePlanesAlongCurrentRoutes();
      }, app.animationInterval);
    },
    
    movePlanesAlongCurrentRoutes: function () {
      app.airplanes.filter(function (airplane) {
        return airplane.currentRoute !== null;
      })
      .forEach(function (airplane) {
        airplane.currentStep += app.airplanePosXIncrement;

        // for now, when the airplane finishes its route just start it over.
        if (airplane.currentStep >= airplane.currentRoute.path.length -1) {
          airplane.currentStep = 0;
        }

        // Position the airplane on the map
        airplane.x = airplane.currentRoute.path[airplane.currentStep].x;
        airplane.y = airplane.currentRoute.path[airplane.currentStep].y;

        // Point the airplane at the next step (or two)
        function calcAirplaneRotationDegrees(from_x, from_y, to_x, to_y) {
          var p0 = {
            x: from_x,
            y: from_y - Math.sqrt(Math.abs(to_x - from_x) * Math.abs(to_x - from_x)
              + Math.abs(to_y - from_y) * Math.abs(to_y - from_y))
          };
          return (2 * Math.atan2(to_y - p0.y, to_x - p0.x)) * 180 / Math.PI;
        }

        airplane.rotateDegrees = calcAirplaneRotationDegrees(
          airplane.x,
          airplane.y,
          airplane.currentRoute.path[airplane.currentStep + 2].x, // look down the road 2 steps
          airplane.currentRoute.path[airplane.currentStep + 2].y);// look down the road 2 steps

        // calculate trip percentage complete
        airplane.tripPercentage = parseInt( ((airplane.currentStep / airplane.currentRoute.path.length) * 100),10);
      });
    },
    getAirportByCode: function (airportCode) {
      var airportCodeUpper = airportCode.toUpperCase();
      return app.airports.find((airport) => { return airport.code.toUpperCase() === airportCodeUpper; });
    },
    getAirportRouteByCode: function (airport, routeCode) {
      var routeCodeUpper = routeCode.toUpperCase();
      return airport.routes.find((route) => { return route.code.toUpperCase() === routeCodeUpper; });
    },
    getAirplaneByCode: function (airplaneCode) {
      var airplaneCodeUpper = airplaneCode.toUpperCase();
      return app.airplanes.find( (airplane) => { return airplane.code.toUpperCase() === airplaneCodeUpper;});
    },
    assignPlaneToRoute: function (airplaneCode, routeCode) {
      var plane   = app.getAirplaneByCode(airplaneCode);
      var airport = app.getAirportByCode(routeCode.split("_")[0]);
      var route   = app.getAirportRouteByCode(airport, routeCode);

      plane.currentRoute = route;
      plane.x = airport.x;
      plane.y = airport.y;
    },
    vclickAirplane: function (airplane) {
      app.selectedAirplane = airplane;
    },
    vclickAirport: function (airport) {
      app.selectedAirport = airport;
    },
    vClickStartSimulation: function () {
      app.vClickPauseSimulation();
      app.animatePlanes();
    },
    vClickPauseSimulation: function () {
      clearInterval(app.animationStartedSetInterval);
    }
  }
});



function makeWorldMapGrid() {
  var elMapGridLayer = document.getElementById("WorldMap-GridLayer");
  var frag = document.createDocumentFragment();
  for (var i = 0; i < 72; i++) {
    var elDiv = document.createElement("div");
    elDiv.classList.add("WorldMap-GridLayer-Cell");
    frag.appendChild(elDiv);
  }
  elMapGridLayer.appendChild(frag);
}



function wireupMouseClickOnMap() {
  function getClickCoordsOnElement(clickEvent) {
    // e = Mouse click event.
    var rect = clickEvent.target.getBoundingClientRect();
    var x = clickEvent.clientX - rect.left; //x position within the element.
    var y = clickEvent.clientY - rect.top;  //y position within the element.

    return { x: x, y: y };
  }

  $(document.getElementById("WorldMap")).click(function (e) {
    var coords = getClickCoordsOnElement(e);
    document.getElementById("map_mouse_x").innerHTML = coords.x;
    document.getElementById("map_mouse_y").innerHTML = coords.y;
  });
}