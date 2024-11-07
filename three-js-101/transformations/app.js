import * as THREE from "three";
import GUI from "lil-gui";

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
 * [Basic Object]
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xf1c40f });
const mesh = new THREE.Mesh(geometry, material);
mesh.position.z = -2;
scene.add(mesh);

/**
 * [Camera]
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

/**
 * [Transforming Position] (Movement)
 * You can make these changes almost anywhere. It only doesn't work if you do it after the .render() method.
 * It's like telling someone to move after you take a picture, and expect them to have moved in the picture.
 */

gui.add(mesh.position, "x").min(0).max(2).step(0.001).name("Position X");
gui.add(mesh.position, "y").min(0).max(2).step(0.001).name("Position Y");
gui.add(mesh.position, "z").min(0).max(2).step(0.001).name("Position Z");

/**
 * [Transforming Scale]
 */
gui.add(mesh.scale, "x").min(0).max(2).step(0.001).name("Scale X");
gui.add(mesh.scale, "y").min(0).max(2).step(0.001).name("Scale Y");
gui.add(mesh.scale, "z").min(0).max(2).step(0.001).name("Scale Z");

/**
 * [Transforming Rotation]
 * Rotation is an Euler. It's in radians. To convert degrees to radians, multiply the degrees by pi/180
 */

// 1.57 comes from 90 * (Math.PI / 180)
gui.add(mesh.rotation, "x").min(0).max(1.57).step(0.001).name("Rotation X");
gui.add(mesh.rotation, "y").min(0).max(1.57).step(0.001).name("Rotation Y");
gui.add(mesh.rotation, "z").min(0).max(1.57).step(0.001).name("Rotation Z");

/**
 * Be careful when rotating on an axis, you might rotate on another axis as well.
 * Rotation goes x -> y -> z by default, and can result in a so called gimbal lock
 */

/**
 * One way to resolve this is to change the default rotation order, using the .reorder() method
 */
mesh.rotation.reorder("YXZ");
mesh.rotation.x = Math.PI * 0.25;
mesh.rotation.y = Math.PI * 0.25;

// Axes Helper
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

// Vector length between the center of the scene and the object's position.
console.log(mesh.position.length());

// Normalize will take the vector length and reduce it to 1. (1.3)
mesh.position.normalize();

/**
 *  [Groups]
 */
const group = new THREE.Group();
const cube1 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
const cube2 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0xabff00 }));
const cube3 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0xababff }));

cube2.position.x = 2;
cube3.position.x = -2;

group.add(cube1);
group.add(cube2);
group.add(cube3);

group.position.y = -1;
group.scale.y = 1.2;

scene.add(group);

// Vector length to another object. Method argument is of type Vector3.
console.log(mesh.position.distanceTo(camera.position));

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

// Tick method, runs every frame. Needed in order to continuously update the scene.
const tick = () => {
    renderer.render(scene, camera);

    // This method prompts tick to be called again on the next frame.
    window.requestAnimationFrame(tick);
};

tick();
