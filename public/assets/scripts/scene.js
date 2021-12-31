import {
  initializeLayout,
  addWallToLayout,
  removeWallByName,
} from "./meshBuilder.js";

function hideSplash() {
  const item = document
    .getElementById("splashScreen")
    .classList.add("splashScreenHide");
}

//#region loading screen
function CustomLoadingScreen() {}
var loadingScreenDiv = window.document.getElementById("loadingScreen");
CustomLoadingScreen.prototype.displayLoadingUI = function () {
  loadingScreenDiv.style.display = "block";
  window.document.getElementById("loadingLogo").style.display = "block";
  window.document.getElementById("renderCanvas").style.display = "block";
};
CustomLoadingScreen.prototype.hideLoadingUI = function () {
  loadingScreenDiv.style.opacity = 0;
  loadingScreenDiv.ontransitionend = function () {
    loadingScreenDiv.style.display = "none";
    window.document.getElementById("loadingLogo").style.display = "none";
  };
};
//#endregion loading screen

//#region  babylon scene
//scene
var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);

//loadingscreen
var loadingScreen = new CustomLoadingScreen();
engine.loadingScreen = loadingScreen;
engine.displayLoadingUI();

var createScene = function () {
  var scene = new BABYLON.Scene(engine);
  //creating free camera
  var camera = new BABYLON.FreeCamera(
    "Camera",
    new BABYLON.Vector3(0, 2.5, 0),
    scene
  );
  camera.attachControl(canvas, false);

  // lights
  var light1 = new BABYLON.HemisphericLight(
    "HemisphericalLight",
    new BABYLON.Vector3(0.87, -0.059, 0.48),
    scene
  );
  light1.intensity = 0.75;
  var light2 = new BABYLON.DirectionalLight(
    "DirectionLight",
    new BABYLON.Vector3(0.1, -0.5, 0.4),
    scene
  );
  light2.intensity = 1.5;

  //Read the Json file here
  fetch("./assets/scripts/layoutJSON.json")
    .then((resp) => resp.json())
    .then((layout) => {
      //initlize layout
      initializeLayout(
        layout.floorWidth,
        layout.floorLength,
        layout.floorMaterial,
        scene
      );

      //add walls
      addWallToLayout(
        layout.walls,
        layout.wallHeight,
        layout.wallDepth,
        layout.internalMaterial,
        layout.externalMaterial,
        scene
      );

      //removeWall
      document
        .getElementById("removeButton")
        .addEventListener("click", removeWallByName);
    });

  scene.onReadyObservable.addOnce(() => {
    engine.hideLoadingUI();
  });

  return scene;
};

let scene;
export function loadBabylon() {
  scene = createScene();
  engine.displayLoadingUI();

  engine.runRenderLoop(function () {
    scene.render();
  });
  engine.resize();

  //For debug purposes
  //   scene.debugLayer.show();
}

//Start
loadBabylon();

//resize
window.addEventListener("resize", function () {
  engine.resize();
});

//#endregion babylon scene
