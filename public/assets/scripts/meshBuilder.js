let selectedWall = null;

export function initializeLayout(fw, fl, fm, scene) {
  const floor = new BABYLON.MeshBuilder.CreatePlane(
    "Floor",
    {
      size: 1,
      width: fw,
      height: fl,
      sideOrientation: BABYLON.Mesh.DOUBLESIDE,
    },
    scene
  );
  floor.position = new BABYLON.Vector3(fw / 2, 0, fl / 2);
  floor.rotation.x = Math.PI / 2;
  floor.material = new BABYLON.StandardMaterial("floorMat", scene);
  floor.material.diffuseTexture = new BABYLON.Texture(fm, scene);
}

export function addWallToLayout(walls, wh, wd, im, em, scene) {
  walls.forEach((walljson) => {
    const wallLength = BABYLON.Vector2.Distance(
      new BABYLON.Vector2(walljson.x1, walljson.y1),
      new BABYLON.Vector2(walljson.x2, walljson.y2)
    );
    const options = {
      width: wallLength,
      width: wallLength + (wd - 0.01), // wall length + extra length to fill wall gaps
      height: wh,
      depth: wd,
    };
    const wall = new BABYLON.MeshBuilder.CreateBox(
      walljson.name,
      options,
      scene
    );

    var intMat = new BABYLON.StandardMaterial("internalMat", scene);
    intMat.diffuseTexture = new BABYLON.Texture(im, scene);
    intMat.diffuseTexture.wAng = Math.PI / 2;

    var extMat = new BABYLON.StandardMaterial("externalMat", scene);
    extMat.diffuseTexture = new BABYLON.Texture(em, scene);

    // mix material
    const wallMat = new BABYLON.MultiMaterial("wallMat", scene);
    wallMat.subMaterials.push(intMat);
    wallMat.subMaterials.push(extMat);

    wall.material = wallMat;

    wall.subMeshes = [];
    const verticesCount = wall.getTotalVertices();

    // Planting materials on each face
    new BABYLON.SubMesh(0, 0, verticesCount, 0, 6, wall);
    new BABYLON.SubMesh(1, 0, verticesCount, 6, 30, wall);

    wall.position = new BABYLON.Vector3(
      (walljson.x1 + walljson.x2) / 2,
      4.45,
      (walljson.y1 + walljson.y2) / 2
    );

    wall.isPickable = true;

    // Babylonjs event system
    wall.actionManager = new BABYLON.ActionManager(scene);
    wall.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnLeftPickTrigger,
        () => {
          if (selectedWall != null) {
            selectedWall.disableEdgesRendering();
          }
          selectedWall = wall;
          wall.edgesWidth = 10;
          wall.enableEdgesRendering();
        }
      )
    );

    //formula to calculate angle between two points
    const a = new BABYLON.Vector2(walljson.x1, walljson.y1);
    const b = new BABYLON.Vector2(walljson.x2, walljson.y2);
    var delta = b.subtract(a).normalize();
    var theta = Math.atan2(delta.y, delta.x);
    wall.rotation.y = -theta;
  });
}

export function removeWallByName() {
  if (selectedWall != null) {
    selectedWall.dispose();
    selectedWall = null;
  }
}
