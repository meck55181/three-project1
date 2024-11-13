// Three.js scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 30;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
directionalLight.position.set(10, 10, 10);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Shadow map properties for better quality
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 100;
directionalLight.shadow.camera.left = -15;
directionalLight.shadow.camera.right = 15;
directionalLight.shadow.camera.top = 15;
directionalLight.shadow.camera.bottom = -15;

const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('scene-container').appendChild(renderer.domElement);

let brainObject;
let rotationSpeed = 0.01;
const maxCharacters = 120;
const overlayImage = document.getElementById('overlay-image');

// Add a background plane behind the brain
const backgroundPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200),  // Made much larger to extend beyond visible edges
    new THREE.MeshBasicMaterial({
        color: 0x000000,  // Black color
        transparent: true,
        opacity: 0.4,     // Reduced opacity to blend better
        blending: THREE.NormalBlending  // Adjust blending mode
    })
);
backgroundPlane.position.z = -15;  // Moved slightly further back
scene.add(backgroundPlane);

// First, remove any existing shadow planes from the scene
scene.children = scene.children.filter(child => !(child.geometry instanceof THREE.PlaneGeometry));

// Add our new circular shadow plane
const shadowPlane = new THREE.Mesh(
    new THREE.CircleGeometry(25, 32),
    new THREE.ShadowMaterial({
        opacity: 0.7
    })
);
// // Change rotation to be vertical instead of horizontal
// shadowPlane.rotation.y = 0;  // Reset Y rotation
// shadowPlane.rotation.x = 0;  // Reset X rotation (no longer -Math.PI/2)
// shadowPlane.position.z = -5;  // Move it behind the brain (negative Z moves it back)
// shadowPlane.position.y = 0;   // Center it vertically
// shadowPlane.receiveShadow = true;
// scene.add(shadowPlane);

// Adjust directional light to cast shadows from front to back
directionalLight.position.set(0, 0, 10);  // Move light to front
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 50;
directionalLight.shadow.camera.left = -10;
directionalLight.shadow.camera.right = 10;
directionalLight.shadow.camera.top = 10;
directionalLight.shadow.camera.bottom = -10;

// Load 3D model
const gltfLoader = new THREE.GLTFLoader();
gltfLoader.load('brain/human_brain_1123.gltf', (gltf) => {  // Corrected path here
    brainObject = gltf.scene;
    brainObject.scale.set(0.9, 0.9, 0.9);
    brainObject.position.set(0, -8, 0);

    brainObject.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material.roughness = 15;
            child.material.metalness = 0.7;
            child.material.emissive = new THREE.Color(0x444444);  // Add slight emissive glow
            child.material.emissiveIntensity = 0.4;  // Control emissive strength
        }
    });

    scene.add(brainObject);
}, undefined, (error) => console.error('Error loading model:', error));

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    if (brainObject) {
        brainObject.rotation.y += rotationSpeed;
    }
    renderer.render(scene, camera);
}
animate();