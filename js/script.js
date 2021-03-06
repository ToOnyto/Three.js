import * as THREE from '../vendor/three.js-master/build/three.module.js';
import Stats from '../vendor/three.js-master/examples/jsm/libs/stats.module.js';
import { OrbitControls } from '../vendor/three.js-master/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from '../vendor/three.js-master/examples/jsm/loaders/FBXLoader.js';

const Scene = {
	vars: {
		container: null,
		scene: null,
		renderer: null,
		camera: null,
		stats: null,
		controls: null,
		texture: null,
		mouse: new THREE.Vector2(),
		raycaster: new THREE.Raycaster(),
		animSpeed: null,
		animPercent: 0.00,
		text: "DAWIN"
	},
	animate: () => {
		requestAnimationFrame(Scene.animate);
		Scene.vars.raycaster.setFromCamera(Scene.vars.mouse, Scene.vars.camera);

		Scene.customAnimation();

		if (Scene.vars.bouton !== undefined) {
			let intersects = Scene.vars.raycaster.intersectObjects(Scene.vars.bouton.children, true);

			if (intersects.length > 0) {
				Scene.vars.animSpeed = 0.05;
			} else {
				Scene.vars.animSpeed = -0.05;
			}
		}
		Scene.render();
	},
	render: () => {
		Scene.vars.renderer.render(Scene.vars.scene, Scene.vars.camera);
		Scene.vars.stats.update();
	},
	customAnimation: () => {
		let vars = Scene.vars;

		if (vars.animSpeed === null) {
			return;
		}

		vars.animPercent = vars.animPercent + vars.animSpeed;

		if (vars.animPercent < 0) {
			vars.animPercent = 0;
			return;
		}
		if (vars.animPercent > 1) {
			vars.animPercent = 1;
			return;
		}

		if (vars.animPercent >= 0.0 && vars.animPercent <= 0.3) {
			let percent = (vars.animPercent - 0.2) / 0.55;
			vars.bouton.position.y = 45 - (10 * percent);
		} else if (vars.animPercent < 0.1) {
			vars.bouton.position.y = 45;
		}

		if (vars.animPercent >= 0.1 && vars.animPercent <= 0.2) {
			vars.scene.children[0].intensity = 0.2;
			vars.scene.children[1].intensity = 0.6;
			vars.scene.children[2].intensity = 0.6;
			vars.scene.children[3].intensity = 0.6;
		} else if (vars.animPercent < 0.3) {
			vars.scene.children[0].intensity = 0.4;
			vars.scene.children[1].intensity = 0.8;
			vars.scene.children[2].intensity = 0.8;
			vars.scene.children[3].intensity = 0.8;
		}

		if (vars.animPercent >= 0.2 && vars.animPercent <= 0.3) {
			vars.scene.children[0].intensity = 0.2;
			vars.scene.children[1].intensity = 0.4;
			vars.scene.children[2].intensity = 0.4;
			vars.scene.children[3].intensity = 0.4;
		} else if (vars.animPercent < 0.6) {
			vars.scene.children[0].intensity = 0.4;
			vars.scene.children[1].intensity = 0.8;
			vars.scene.children[2].intensity = 0.8;
			vars.scene.children[3].intensity = 0.8;
			// red lights off
			vars.scene.children[4].intensity = 0.0;
			vars.scene.children[5].intensity = 0.0;
			vars.scene.children[6].intensity = 0.0;
		}

		if (vars.animPercent >= 0.3 && vars.animPercent <= 0.9) {
			vars.scene.children[0].visible = false;
			vars.scene.children[1].visible = false;
			vars.scene.children[2].visible = false;
			vars.scene.children[3].visible = false;
			vars.scene.children[14].children[0].visible = true;
		} else if (vars.animPercent < 0.3) {
			vars.scene.children[0].intensity = 0.5;
			vars.scene.children[1].visible = true;
			vars.scene.children[2].visible = true;
			vars.scene.children[3].visible = true;
			
		}
		//Full red lights and dragon appearence
		if (vars.animPercent > 0.9) {
			// red lights on
			vars.scene.children[4].intensity = 0.8;
			vars.scene.children[5].intensity = 0.8;
			vars.scene.children[6].intensity = 0.8;
			vars.scene.children[4].visible = true;
		vars.scene.children[5].visible = true;
		const d = 1000;
		let light4 = new THREE.DirectionalLight(0xFF0000, 0.1);
		light4.position.set(400, 200, 400);
		light4.castShadow = true;
		light4.shadow.camera.left = -d;
		light4.shadow.camera.right = d;
		light4.shadow.camera.top = d;
		light4.shadow.camera.bottom = -d;
		light4.shadow.camera.far = 2000;
		light4.shadow.mapSize.width = 4096;
		light4.shadow.mapSize.height = 4096;
		vars.scene.add(light4);
		console.log(vars.scene)};

	},
	loadFBX: (file, scale, position, rotation, color, namespace, callback) => {
		let vars = Scene.vars;
		let loader = new FBXLoader();

		if (file === undefined) {
			return;
		}

		loader.load('./fbx/' + file, (object) => {

			object.traverse((child) => {
				if (child.isMesh) {

					child.castShadow = true;
					child.receiveShadow = true;

					if (namespace === "plaquette") {
						child.material = new THREE.MeshBasicMaterial({
							map: Scene.vars.texture
						});
					}

					if (namespace === "statuette") {
						child.material = new THREE.MeshStandardMaterial({
							color: new THREE.Color(color),
							roughness: .3,
							metalness: .6
						})
					}

					if (namespace === "buba") {
						child.material = new THREE.MeshStandardMaterial({
							color: new THREE.Color(color),
							roughness: 1,
							metalness: 1
						})
					}

					child.material.color = new THREE.Color(color);
				}
			});

			object.position.x = position[0];
			object.position.y = position[1];
			object.position.z = position[2];

			object.rotation.x = rotation[0];
			object.rotation.y = rotation[1];
			object.rotation.z = rotation[2];

			object.scale.x = object.scale.y = object.scale.z = scale;
			Scene.vars[namespace] = object;

			callback();
		});
	},
	loadText: (text, scale, position, rotation, color, namespace, callback) => {
		let loader = new THREE.FontLoader();

		if (text === undefined || text === "") {
			return;
		}

		loader.load('./vendor/three.js-master/examples/fonts/helvetiker_regular.typeface.json', (font) => {
			let geometry = new THREE.TextGeometry(text, {
				font,
				size: 1,
				height: 0.1,
				curveSegments: 1,
				bevelEnabled: false
			});

			geometry.computeBoundingBox();
			let offset = geometry.boundingBox.getCenter().negate();
			geometry.translate(offset.x, offset.y, offset.z);

			let material = new THREE.MeshBasicMaterial({
				color: new THREE.Color(color)
			});

			let mesh = new THREE.Mesh(geometry, material);

			mesh.position.x = position[0];
			mesh.position.y = position[1];
			mesh.position.z = position[2];

			mesh.rotation.x = rotation[0];
			mesh.rotation.y = rotation[1];
			mesh.rotation.z = rotation[2];

			mesh.scale.x = mesh.scale.y = mesh.scale.z = scale;

			Scene.vars[namespace] = mesh;

			callback();
		});
	},
	onWindowResize: () => {
		let vars = Scene.vars;
		vars.camera.aspect = window.innerWidth / window.innerHeight;
		vars.camera.updateProjectionMatrix();
		vars.renderer.setSize(window.innerWidth, window.innerHeight);
	},
	onMouseMove: (event) => {
		Scene.vars.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		Scene.vars.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
	},
	init: () => {
		let vars = Scene.vars;

		// Préparer le container pour la scène
		vars.container = document.createElement('div');
		vars.container.classList.add('fullscreen');
		document.body.appendChild(vars.container);

		// ajout de la scène
		vars.scene = new THREE.Scene();
		vars.scene.background = new THREE.Color(0xa0a0a0);
		vars.scene.fog = new THREE.Fog(vars.scene.background, 500, 3000);

		// paramétrage du moteur de rendu
		vars.renderer = new THREE.WebGLRenderer({ antialias: true });
		vars.renderer.setPixelRatio(window.devicePixelRatio);
		vars.renderer.setSize(window.innerWidth, window.innerHeight);

		vars.renderer.shadowMap.enabled = true;
		vars.renderer.shadowMapSoft = true;

		vars.container.appendChild(vars.renderer.domElement);

		// ajout de la caméra
		vars.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
		vars.camera.position.set(-1.5, 30, 1000);

		// ajout de la lumière
		const lightIntensityHemisphere = .5;
		let light = new THREE.HemisphereLight(0xFFFFFF, 0x444444, lightIntensityHemisphere);
		light.position.set(0, 700, 0);
		vars.scene.add(light);

		// ajout des directionelles
		const lightIntensity = .8;
		const d = 1000;
		let light1 = new THREE.DirectionalLight(0xFFFFFF, lightIntensity);
		light1.position.set(0, 700, 0);
		light1.castShadow = true;
		light1.shadow.camera.left = -d;
		light1.shadow.camera.right = d;
		light1.shadow.camera.top = d;
		light1.shadow.camera.bottom = -d;
		light1.shadow.camera.far = 2000;
		light1.shadow.mapSize.width = 4096;
		light1.shadow.mapSize.height = 4096;
		vars.scene.add(light1);
		// let helper = new THREE.DirectionalLightHelper(light1, 5);
		// vars.scene.add(helper);

		let light2 = new THREE.DirectionalLight(0xFFFFFF, lightIntensity);
		light2.position.set(-400, 200, 400);
		light2.castShadow = true;
		light2.shadow.camera.left = -d;
		light2.shadow.camera.right = d;
		light2.shadow.camera.top = d;
		light2.shadow.camera.bottom = -d;
		light2.shadow.camera.far = 2000;
		light2.shadow.mapSize.width = 4096;
		light2.shadow.mapSize.height = 4096;
		vars.scene.add(light2);
		// let helper2 = new THREE.DirectionalLightHelper(light2, 5);
		// vars.scene.add(helper2);

		let light3 = new THREE.DirectionalLight(0xFFFFFF, lightIntensity);
		light3.position.set(400, 200, 400);
		light3.castShadow = true;
		light3.shadow.camera.left = -d;
		light3.shadow.camera.right = d;
		light3.shadow.camera.top = d;
		light3.shadow.camera.bottom = -d;
		light3.shadow.camera.far = 2000;
		light3.shadow.mapSize.width = 4096;
		light3.shadow.mapSize.height = 4096;
		vars.scene.add(light3);

		let spotLight1 = new THREE.SpotLight(0xFF0000, lightIntensity);
		spotLight1.position.set(160, 320, -600);
		spotLight1.castShadow = true;
		spotLight1.shadow.camera.left = -d;
		spotLight1.shadow.camera.right = d;
		spotLight1.shadow.camera.top = d;
		spotLight1.shadow.camera.bottom = -d;
		spotLight1.shadow.camera.far = 2000;
		spotLight1.shadow.mapSize.width = 4096;
		spotLight1.shadow.mapSize.height = 4096;
		vars.scene.add(spotLight1);
		
		let spotLight2 = new THREE.SpotLight(0xFF0000, lightIntensity);
		spotLight2.position.set(-160, 320, -600);
		spotLight2.castShadow = true;
		spotLight2.shadow.camera.left = -d;
		spotLight2.shadow.camera.right = d;
		spotLight2.shadow.camera.top = d;
		spotLight2.shadow.camera.bottom = -d;
	 	spotLight2.shadow.camera.far = 2000;
		spotLight2.shadow.mapSize.width = 4096;
		spotLight2.shadow.mapSize.height = 4096;
		vars.scene.add(spotLight2);

		vars.scene.children[4].visible = false;
		vars.scene.children[5].visible = false;

		// ajout du sol
		let mesh = new THREE.Mesh(
			new THREE.PlaneBufferGeometry(2000, 2000),
			new THREE.MeshLambertMaterial(
				{ color: new THREE.Color(0x888888) }
			)
		);
		mesh.rotation.x = -Math.PI / 2;
		mesh.receiveShadow = false;
		vars.scene.add(mesh);

		let planeMaterial = new THREE.ShadowMaterial();
		planeMaterial.opacity = 0.07;
		let shadowPlane = new THREE.Mesh(
			new THREE.PlaneBufferGeometry(2000, 2000),
			planeMaterial);
		shadowPlane.rotation.x = -Math.PI / 2;
		shadowPlane.receiveShadow = true;

		vars.scene.add(shadowPlane);

		// ajout de la sphère
		let geometry = new THREE.SphereGeometry(1000, 32, 32);
		let material = new THREE.MeshPhongMaterial({ color: new THREE.Color(0x000000) });
		material.side = THREE.DoubleSide;
		let sphere = new THREE.Mesh(geometry, material);
		vars.scene.add(sphere);

		vars.texture = new THREE.TextureLoader().load('./texture/marbre.jpg');

		let hash = document.location.hash.substr(1);
		if (hash.length !== 0) {
			let text = hash.substring();
			Scene.vars.text = decodeURI(text);
		}

		Scene.loadFBX("Logo_Feelity.FBX", 10, [45, 22, 0], [0, 0, 0], 0xFFFFFF, 'logo', () => {
			Scene.loadFBX("Statuette.FBX", 10, [0, 0, 0], [0, 0, 0], 0xFFD700, 'statuette', () => {
				Scene.loadFBX("Socle_Partie1.FBX", 10, [0, 0, 0], [0, 0, 0], 0x1A1A1A, 'socle1', () => {
					Scene.loadFBX("Socle_Partie2.FBX", 10, [0, 0, 0], [0, 0, 0], 0x1A1A1A, 'socle2', () => {
						Scene.loadFBX("Plaquette.FBX", 10, [0, 4, 45], [0, 0, 0], 0xFFFFFF, 'plaquette', () => {
							Scene.loadFBX("Button.FBX", 10, [0, 45, 180], [0, 0, 0], 0xFF0000, 'bouton', () => {
								Scene.loadFBX("Mask.fbx", 50, [0, 300, -700], [0, 0, 0], 0xFF0000, 'buba', () => {
								Scene.loadText(Scene.vars.text, 10, [0, 23, 52], [0, 0, 0], 0x1A1A1A, "texte", () => {

									let vars = Scene.vars;

									// Statue or
									let gold = new THREE.Group();
									gold.add(vars.socle1);
									gold.add(vars.socle2);
									gold.add(vars.statuette);
									gold.add(vars.logo);
									gold.add(vars.texte);
									gold.add(vars.plaquette);

									let logo2 = vars.logo.clone();
									logo2.rotation.z = Math.PI;
									logo2.position.x = -45;
									vars.logo2 = logo2;
									gold.add(logo2);
									gold.position.z = -50;
									gold.position.y = 10;
									vars.scene.add(gold);
									vars.goldGroup = gold;

									// Statue argent
									let silver = gold.clone();
									silver.position.set(-200, 10, 0);
									silver.rotation.y = Math.PI / 4;
									silver.children[2].traverse(node => {
										if (node.isMesh) {
											node.material = new THREE.MeshStandardMaterial({
												color: new THREE.Color(0xC0C0C0),
												metalness: .6,
												roughness: .3
											})
										}
									});
									vars.scene.add(silver);
									vars.silverGroup = silver;

									// Statue bronze
									let bronze = gold.clone();
									bronze.position.set(200, 10, 0);
									bronze.rotation.y = -Math.PI / 4;
									bronze.children[2].traverse(node => {
										if (node.isMesh) {
											node.material = new THREE.MeshStandardMaterial({
												color: new THREE.Color(0xCD7F32),
												metalness: .6,
												roughness: .3
											})
										}
									});
									vars.scene.add(bronze);
									vars.bronzeGroup = bronze;

									// Bouton
									let geometry2 = new THREE.BoxGeometry(100, 50, 100);
									let material2 = new THREE.MeshBasicMaterial({ color: 0x000000 });
									let cube = new THREE.Mesh(geometry2, material2);
									cube.position.set(0, 0, 180);
									cube.traverse(node => {
										if (node.isMesh) {

											node.castShadow = true;
											node.receiveShadow = true;

											node.material = new THREE.MeshStandardMaterial({
												color: new THREE.Color(0x1A1A1A),
												metalness: .6,
												roughness: .3
											})
										}
									});
									vars.scene.add(cube);

									vars.bouton.traverse(node => {
										if (node.isMesh) {
											node.material = new THREE.MeshStandardMaterial({
												color: new THREE.Color(0xFF0000),
												metalness: .6,
												roughness: .3
											})
										}
									});
									vars.scene.add(vars.bouton);

									vars.buba.traverse(node => {
										if (node.isMesh) {
											node.material = new THREE.MeshStandardMaterial({
												// color: new THREE.Color(0x007FFF),
												color: new THREE.Color(0x660000),
												metalness: .3,
												roughness: .3
											})
										}
									});
									vars.buba.name = "buba";
									vars.scene.add(vars.buba);
									vars.scene.children[14].children[0].visible = false;
									
									let elem = document.querySelector('#loading');
									elem.parentNode.removeChild(elem);
								});
							});
							});
						});
					});
				});
			});
		});

		// ajout des controles
		vars.controls = new OrbitControls(vars.camera, vars.renderer.domElement);
		vars.controls.minDistance = 300;
		vars.controls.maxDistance = 600;
		vars.controls.minPolarAngle = Math.PI / 4;
		vars.controls.maxPolarAngle = Math.PI / 2;
		vars.controls.minAzimuthAngle = - Math.PI / 4;
		vars.controls.maxAzimuthAngle = Math.PI / 4;
		vars.controls.target.set(0, 100, 0);
		vars.controls.update();

		window.addEventListener('resize', Scene.onWindowResize, false);
		window.addEventListener('mousemove', Scene.onMouseMove, false);

		vars.stats = new Stats();
		vars.container.appendChild(vars.stats.dom);

		Scene.animate();

		console.log(vars.scene);
	}
};

Scene.init();