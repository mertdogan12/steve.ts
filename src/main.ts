import "./style.css";

import * as THREE from "three";
import { Steve } from "./steve.ts";

import { OrbitControls } from "three/examples/jsm/Addons.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x4bcae3);
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const mouse = new THREE.Vector2();
document.addEventListener("mousemove", onDocumentMouseMove, false);

const BASE_URI = "https://mineskin.eu/skin/";
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const name = urlParams.get("name");

const steve = name === null ? new Steve() : new Steve(BASE_URI + name);
scene.add(steve.steve);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper);

camera.position.z = 50;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const orbitControls = new OrbitControls(camera, renderer.domElement);

renderer.setAnimationLoop(animate);
renderer.render(scene, camera);

function animate() {
  orbitControls.update();
  steve.animateArms();
  steve.lookAtMouse(mouse);

  renderer.render(scene, camera);
}

function onDocumentMouseMove(event: MouseEvent) {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
}
