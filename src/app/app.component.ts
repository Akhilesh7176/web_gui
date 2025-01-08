import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { EffectComposer } from 'three/examples/jsm/Addons.js';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements AfterViewInit {
  @ViewChild('rendererContainer', { static: true })
  rendererContainer!: ElementRef<HTMLDivElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private model: THREE.Object3D | undefined;

  ngAfterViewInit(): void {
    this.initScene();
    this.animate();
  }

  private initScene(): void {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);

    const container = this.rendererContainer.nativeElement;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    container.appendChild(this.renderer.domElement);
    const composer = new EffectComposer(this.renderer);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1).normalize();
    this.scene.add(directionalLight);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.1;

    const objLoader = new OBJLoader();
    objLoader.load(
      'assets/machine_part.obj',
      (object) => {
        this.model = object;

        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3()).length();

        object.position.x -= center.x;
        object.position.y -= center.y;
        object.position.z -= center.z;

        const fov = this.camera.fov * (Math.PI / 180);
        const distance = size / (1.5 * Math.tan(fov / 2));

        this.camera.position.set(0, 0, distance);
        this.controls.target.set(0, 0, 0);
        this.controls.update();

        this.scene.add(object);
        this.renderer.render(this.scene, this.camera);
      },
      undefined,
      (error) => {
        console.error('Error loading OBJ file:', error);
      }
    );
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  rotateX(): void {
    if (this.model) this.model.rotation.x += Math.PI / 4;
  }
  rotateY(): void {
    if (this.model) this.model.rotation.y += Math.PI / 4;
  }
  rotateZ(): void {
    if (this.model) this.model.rotation.z += Math.PI / 4;
  }
}
