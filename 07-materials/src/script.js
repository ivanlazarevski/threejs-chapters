import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { RGBELoader } from "three/examples/jsm/Addons.js";

/**
 * [Setup]
 */
const gui = new GUI();

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

/**
 * [Camera]
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// [Controls]
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// [Textures]
const textureLoader = new THREE.TextureLoader();

const doorColorTexture = textureLoader.load("./textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("./textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load("./textures/door/ambientOcclusion.jpg");
const doorHeightTexture = textureLoader.load("./textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("./textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("./textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("./textures/door/roughness.jpg");
const matcapTexture = textureLoader.load("./textures/matcaps/5.png");
const gradientTexture = textureLoader.load("./textures/gradients/5.jpg");

doorColorTexture.colorSpace = THREE.SRGBColorSpace;
matcapTexture.colorSpace = THREE.SRGBColorSpace;

const rgbeLoader = new RGBELoader();
rgbeLoader.load("./textures/environmentMap/2k.hdr", (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = environmentMap;
  scene.environment = environmentMap;
});

/** [[MATERIALS START]] */

/**
 * Mesh Basic Material
 * A material for drawing geometries in a simple shaded (flat or wireframe) way.
 */
let material = new THREE.MeshBasicMaterial();
// material.map = doorColorTexture;
// material.color = new THREE.Color(0xff0000);
// material.wireframe = true;

// material.opacity = 0.1;
// material.transparent = true;
// material.alphaMap = doorAlphaTexture;
// material.side = THREE.DoubleSide;

/**
 * [Mesh Normal Material]
 * A material that maps the normal vectors to RGB colors.
 * Normals are information encoded in each vertex that contains the direction of the outside of the face
 */

material = new THREE.MeshNormalMaterial();
// material.flatShading = true; Cool for debugging.

/**
 * [Mesh Matcap Material]
 */
material = new THREE.MeshMatcapMaterial();
material.matcap = matcapTexture;

/**
 * [Mesh Depth Material]
 * Mostly used internally by ThreeJS, used for post processing and shadows. Used to save depth in a texture.
 */

material = new THREE.MeshDepthMaterial();

/**
 * [Mesh Lambert Material]
 * Lambert requires light.
 */

material = new THREE.MeshLambertMaterial();

//Lights arent needed when you have an env map
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 100);
pointLight.position.x = 2;
pointLight.position.y = 1;
pointLight.position.z = 2;
scene.add(pointLight);

/**
 * [Mesh Phong Material]
 * A material for shiny surfaces with specular highlights. Less performant than Lambert.
 * The params arent exactly realistic.
 */
material = new THREE.MeshPhongMaterial();
material.shininess = 100;
material.specular = new THREE.Color(0x1188ff);

/**
 * [Mesh Toon Material] (Personal favorite)
 * A material implementing toon shading. Also known as Cel Shading.
 */

material = new THREE.MeshToonMaterial();
material.gradientMap = gradientTexture;
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;
gradientTexture.generateMipmaps = false;

/**
 * [Mesh Standard Material]
 * Uses physically based rendering principles, like roughness and metalness. Called standard because the PBR is standard in many softwares.
 * Realistic output using realistic params. Should look very similar to Blender and UE.
 */
material = new THREE.MeshStandardMaterial();
// material.metalness = 0.45;
// material.roughness = 0.65;
// material.metalnessMap = doorMetalnessTexture;
// material.roughnessMap = doorRoughnessTexture;
// material.map = doorColorTexture;
// material.aoMap = doorAmbientOcclusionTexture;
// material.aoMapIntensity = 3;
// material.displacementMap = doorHeightTexture;
// material.displacementScale = 0.1;
// material.normalMap = doorNormalTexture;
// material.normalScale.set(0.5, 0.5);
// material.transparent = true;
// material.alphaMap = doorAlphaTexture;

/**
 * [Mesh Physical Material]
 */

material = new THREE.MeshPhysicalMaterial();
material.metalnessMap = doorMetalnessTexture;
material.roughnessMap = doorRoughnessTexture;
material.map = doorColorTexture;
material.aoMap = doorAmbientOcclusionTexture;
material.aoMapIntensity = 3;
material.displacementMap = doorHeightTexture;
material.displacementScale = 0.1;
material.normalMap = doorNormalTexture;
material.normalScale.set(0.5, 0.5);
material.transparent = true;
material.alphaMap = doorAlphaTexture;

// material.clearcoat = 1;
// material.clearcoatRougness = 0;

// Sheen (used for fluffy, fabric materials)
// material.sheen = 1;
// material.sheenRoughness = 0.25;
// material.sheenColor.set(1, 1, 1);

// Iridescence (used for shine artifacts like on liquid surfaces, or disks)
// material.iridescence = 1;
// material.iridescenceIOR = 1; //
// material.iridescenceThicknessRange = [100, 800];

// material.transmission = 1; // Transparency, but the thing behind is deformed. Like through glass.
// material.transmissionIOR = 1.5;
material.thickness = 0;

gui.add(material, "metalness").min(0).max(1).step(0.0001);
gui.add(material, "roughness").min(0).max(1).step(0.0001);
gui.add(material, "sheen").min(0).max(1).step(0.0001);
gui.add(material, "sheenRoughness").min(0).max(1).step(0.0001);
gui.addColor(material, "sheenColor");

// gui.add(material, "clearcoat").min(0).max(1).step(0.0001);
// gui.add(material, "clearcoatRougness").min(0).max(1).step(0.0001);

/** [[MATERIALS END]] */

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), material);
sphere.position.x = -1.8;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 10, 10), material);

const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 16, 32), material);
torus.position.x = 1.8;

scene.add(sphere, plane, torus);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  // sphere.rotation.y = 0.1 * elapsedTime;
  // plane.rotation.y = 0.1 * elapsedTime;
  // torus.rotation.y = 0.1 * elapsedTime;
  //
  // sphere.rotation.x = -0.15 * elapsedTime;
  // plane.rotation.x = -0.15 * elapsedTime;
  // torus.rotation.x = -0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
