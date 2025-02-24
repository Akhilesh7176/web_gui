Angular Three.js Model Viewer
Overview
This project is an Angular-based 3D model viewer using Three.js. Load, view, and rotate 3D models in OBJ format.
Technologies Used
	•	Angular (Standalone Components)
	•	Three.js for 3D rendering
	•	RxJS for handling HTTP requests
	•	Material UI for UI elements
Installation
	•	Install dependencies: npm install
	•	Cd server
	•	Run command ./run_maclin.sh executes the backend server 
	•	To start the development server: npm start
http://localhost:4200/ in your browser.
Usage
	•	Ensure the OBJ file is available at http://localhost:8080/example.obj.
Code Structure
	•	AppComponent: Main component that initializes Three.js and handles model loading.
	•	fetchAndLoadModel(): Fetches the 3D model from an API.
	•	initScene(): Sets up the Three.js scene, camera, and renderer.
	•	handleModelLoad(): Processes and positions the loaded 3D model.
	•	animate(): Updates the scene.
