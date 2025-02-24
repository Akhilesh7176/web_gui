import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnDestroy,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader.js';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, MatGridListModule, MatButtonModule],
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('rendererContainer', { static: true })
  rendererContainer!: ElementRef<HTMLDivElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private model: THREE.Object3D | undefined;

  private destroy$ = new Subject<void>();
  private httpClient = inject(HttpClient);

  ngAfterViewInit() {
    this.initScene();
    this.animate();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    window.removeEventListener('resize', () => this.onWindowResize());
  }

  // Object loaded as blob response
  fetchAndLoadModel() {
    this.httpClient
      .get('http://localhost:8080/example.obj', { responseType: 'blob' })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob) => {
          const fileReader = new FileReader();
          fileReader.onload = () => {
            const objText = fileReader.result as string;
            this.loadModel(objText);
          };
          fileReader.onerror = () => {
            console.error('Error reading the file');
          };
          fileReader.readAsText(blob);
        },
        error: (err) => {
          console.error('Error downloading file:', err);
        },
      });
  }

  private loadModel(objText: string) {
    if (this.model) {
      this.scene.remove(this.model);
      this.model = undefined;
    }

    try {
      const loader = new OBJLoader();
      const obj3D = loader.parse(objText);
      this.handleModelLoad(obj3D);
    } catch (e) {
      console.error('Error parsing OBJ file:', e);
    }
  }

  private handleModelLoad(object: THREE.Object3D) {
    this.model = object;

    const box = new THREE.Box3().setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3()).length();

    object.position.sub(center);

    const fov = this.camera.fov * (Math.PI / 180);
    let distance = size / (2 * Math.tan(fov / 2));
    distance *= 1.5;

    this.camera.position.set(0, 0, distance);
    this.controls.target.set(0, 0, 0);
    this.controls.maxDistance = distance * 2;
    this.controls.update();

    this.scene.add(object);
  }

  // Initialises scene
  private initScene(): void {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xeeeeee);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1).normalize();
    this.scene.add(directionalLight);

    const container = this.rendererContainer.nativeElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 5);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.1;

    window.addEventListener('resize', () => this.onWindowResize());
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  private onWindowResize() {
    const container = this.rendererContainer.nativeElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }

  rotateX(): void {
    if (this.model) {
      this.model.rotation.x += Math.PI / 4;
    }
  }

  rotateY(): void {
    if (this.model) {
      this.model.rotation.y += Math.PI / 4;
    }
  }

  rotateZ(): void {
    if (this.model) {
      this.model.rotation.z += Math.PI / 4;
    }
  }
}
