import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * [Setup]
 */
const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100,
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Buffer Geometry
 */
const positionsArray = new Float32Array([
  -1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0,
]);
const indices = new Uint16Array([
  0, 1, 2,  // First triangle
  2, 3, 0   // Second triangle
]);

const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
const geometry = new THREE.BufferGeometry();
geometry.setIndex(new THREE.BufferAttribute(indices, 1));

// It has to say position. It's the name of the value that will be used by the shaders
geometry.setAttribute("position", positionsAttribute);

const meshe = new THREE.Mesh(
  geometry,
  new THREE.MeshBasicMaterial({ color: 0xff1010, wireframe: true }),
);
meshe.position.set(1, 2, 3);
scene.add(meshe);

const dndDice = new THREE.Mesh(
  new THREE.IcosahedronGeometry(1),
  new THREE.MeshBasicMaterial({ color: 0xff1010, wireframe: true }),
);
scene.add(dndDice);

const anotherDice = new THREE.Mesh(
  new THREE.OctahedronGeometry(1),
  new THREE.MeshBasicMaterial({ color: 0x10ff10, wireframe: true }),
);
anotherDice.position.y = 2;
scene.add(anotherDice);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animate
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

/**
 * Geometry Class
 * Box, Plane, Circle, Cone, Cylinder, Ring, Torus, Torus Knot, Dodecahedron
 * Octahedron, Icosahedron, Sphere, Shape, Tube, etc
 */
