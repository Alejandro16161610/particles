const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  10,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
let cubeMesh = new THREE.Mesh();
let stars, starGeo;
let colorTimer = 0; // Timer to change color every 3 seconds
 //Terminal Code: python3 -m http.server
//browser: localhost:8000
lighting();
cube();
particles();

function changeParticleColor() {
    // Generate a random color
    let newColor = new THREE.Color(Math.random(), Math.random(), Math.random());
    stars.material.color = newColor;
}

function particles() {
  const points = [];
  for (let i = 0; i < 6000; i++) {
   let star = new THREE.Vector3(
      Math.random() * 600 - 300,
      Math.random() * 600 - 300,
      Math.random() * 600 - 300
    );
    points.push(star);
  }
  
  starGeo = new THREE.BufferGeometry().setFromPoints(points);
  let sprite = new THREE.TextureLoader().load("assets/images/star.png");
  let starMaterial = new THREE.PointsMaterial({
    color: 0xffb6c1,
    size: 0.7,
    map: sprite,
  });

  
  stars = new THREE.Points(starGeo, starMaterial);
  scene.add(stars);
}

function animateParticles() {
  starGeo.verticesNeedUpdate = true;
  stars.position.y -= 0.9;

  // Reset y-position when particles fall off the screen
  if (stars.position.y < -300) {
      stars.position.y = Math.random() * 600 - 300;
  }

  // Change color every 3 seconds
  colorTimer += 1;
  if (colorTimer >= 180) { // 60 frames per second * 3 seconds = 180 frames
      colorTimer = 0;
      changeParticleColor();
  }
}

function cube() {
  const texture = new THREE.TextureLoader().load("assets/textures/wooden.jpg");
  const cubeMaterial = new THREE.MeshBasicMaterial({ map: texture });
  const cubeGeometry = new THREE.BoxGeometry(10, 5, 5, 5);
  cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);

  cubeMesh.position.z = -5;
  camera.position.z = 15;

  scene.add(cubeMesh);
}

function lighting() {
  const light = new THREE.HemisphereLight(0x780a44, 0x1c3020, 1);
  scene.add(light);

  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(0, 0, 15);
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.camera.near = 500;
  spotLight.shadow.camera.far = 4000;
  spotLight.shadow.camera.fov = 30;
  scene.add(spotLight);
}

function animate() {
  requestAnimationFrame(animate);
  animateParticles();
  cubeMesh.rotation.x += 0.008;
  cubeMesh.rotation.y += 0.008;
  renderer.render(scene, camera);
}

animate();