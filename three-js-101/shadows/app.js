import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * [Setup]
 */
const gui = new GUI()
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * [Lights]
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
gui.add(ambientLight, 'intensity').min(0).max(3).step(0.001)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
directionalLight.position.set(2, 2, - 1)
gui.add(directionalLight, 'intensity').min(0).max(3).step(0.001)
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(directionalLight)

/**
 * [Materials]
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)

/**
 * [Objects]
 */
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.5

scene.add(sphere, plane)

/**
 * [Shadows]
 * Shadow maps are a technique used in 3D computer graphics to simulate realistic shadows in a scene.
 *  They work by rendering the scene from the perspective of the light source, capturing the depth information of objects in the scene.
 *  This depth information is then stored in a texture called a shadow map.
 *
 *  To enable shadow maps, you need to do it in the renderer. After that, each object needs a definition whether they can receive or cast objects.
 *  Only Point Light, Directional Light and Spotlight support shadows.
 **/
sphere.castShadow = true;
plane.receiveShadow = true;
directionalLight.castShadow = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const lightHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(lightHelper);


// [Enable Shadows]
renderer.shadowMap.enabled = true;

// [Shadow Optimization]
// Render Size
directionalLight.shadow.mapSize.set(1024, 1024);

// Near and Far (For the light camera)
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 5;

// Amplitude
directionalLight.shadow.camera.left = -2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.bottom = -2;

// Blur (Just a general blur)
directionalLight.shadow.radius = 10;
// Shadow Map Algorithm
// THREE.BasicShadowMap
// THREE.PCFSoftShadowMap Usually go for this, if you wanna make it look better
// THREE.VSMShadowMap
// renderer.shadowMap.type = THREE.BasicShadowMap; // Radius doesnt work with PCF


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()