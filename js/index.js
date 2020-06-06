// DOM Selections
const stage = document.querySelector(".stage");
const cushionMaterials = document.querySelector(".materials-cushion");
const carpetMaterials = document.querySelector(".materials-carpet");
const modelHandle = document.querySelectorAll(".model-handle");
const textureInputs = document.querySelectorAll(".textures img");
const materials = document.querySelectorAll(".materials div");
// const chairPartInput = document.querySelectorAll(".chair-parts .option");
const chairPartInput = document.querySelectorAll(".chair-parts-list div");

let scene,
	camera,
	renderer,
	geometry,
	material,
	texture,
	cube,
	controls,
	loader,
	model,
	cushion,
	carpet,
	group,
	selectedOption = "legs";

//Setting all textures
const allTextures = {
	1: "https://images.pexels.com/photos/1293120/pexels-photo-1293120.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
	2: "https://images.pexels.com/photos/194096/pexels-photo-194096.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
	3: "https://images.pexels.com/photos/122458/pexels-photo-122458.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
	4: "https://images.pexels.com/photos/989946/pexels-photo-989946.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
	5: "https://images.pexels.com/photos/131634/pexels-photo-131634.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
	6: "https://images.pexels.com/photos/3695378/pexels-photo-3695378.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
	7: "https://images.pexels.com/photos/276514/pexels-photo-276514.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
	8: "https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
	9: "https://images.pexels.com/photos/4405250/pexels-photo-4405250.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
	10: "https://images.pexels.com/photos/1724888/pexels-photo-1724888.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
	11: "https://images.pexels.com/photos/3894157/pexels-photo-3894157.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
	default:
		"https://images.pexels.com/photos/129731/pexels-photo-129731.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
};

//Importing the 3d model
const modelPath = "./images/chair.glb";

//Setting up inital Texture and Material
const initialTexture = new THREE.TextureLoader().load(allTextures["default"]);
const initialMaterial = new THREE.MeshBasicMaterial({ map: initialTexture });

// Chair Object Specification
let objectSpecs = [
	{ name: "back", material: initialMaterial },
	{ name: "base", material: initialMaterial },
	{ name: "cushions", material: initialMaterial },
	{ name: "legs", material: initialMaterial },
	{ name: "supports", material: initialMaterial },
];

//Model Loaders
const chairLoader = () => {
	loader = new THREE.GLTFLoader();
	loader.load(modelPath, (gltf) => {
		model = gltf.scene;
		model.scale.set(7, 7, 7);
		model.position.y = -3;
		model.rotation.y = 4;
		for (let part of objectSpecs) {
			setTexture(model, part.name, part.material);
		}
		group.add(model);
		scene.add(group);
	}),
		undefined,
		(error) => {
			console.error(error);
		};
};

const modelHandler = (event) => {
	const [model, action] = event.target.dataset.value.split("-");
	if (action === "add") {
		model === "cushion" ? cushionLoader() : carpetLoader();
	} else {
		model === "cushion" ? cushionUnloader() : carpetUnloader();
	}
};

const cushionLoader = () => {
	if (!scene.getObjectByName("cushion")) {
		cushionMaterials.classList.add("visible");
		geometry = new THREE.BoxGeometry(2, 2, 2);
		texture = new THREE.TextureLoader().load(allTextures["default"]);
		material = new THREE.MeshBasicMaterial({ map: texture });
		cushion = new THREE.Mesh(geometry, material);
		cushion.position.y = 1.5;
		cushion.position.x = 0.2;
		cushion.rotation.y = 15;
		cushion.name = "cushion";
		group.add(cushion);
	}
};

const carpetLoader = () => {
	if (!scene.getObjectByName("carpet")) {
		carpetMaterials.classList.add("visible");
		geometry = new THREE.PlaneGeometry(14, 12, 20, 20);
		texture = new THREE.TextureLoader().load(allTextures["default"]);
		material = new THREE.MeshBasicMaterial({
			map: texture,
			side: THREE.DoubleSide,
		});
		carpet = new THREE.Mesh(geometry, material);
		carpet.rotation.x = Math.PI / 2;
		carpet.position.y = -3;
		carpet.position.z = -1;
		carpet.name = "carpet";
		group.add(carpet);
	}
};

// Model Unloaders
const cushionUnloader = () => {
	if (group.getObjectByName("cushion")) {
		cushionMaterials.classList.remove("visible");
		group.remove(cushion);
	}
};

const carpetUnloader = () => {
	if (group.getObjectByName("carpet")) {
		carpetMaterials.classList.remove("visible");
		group.remove(carpet);
	}
};

//Switch Geometries
const switchGeometry = (event) => {
	let [model, material] = event.target.dataset.value.split(" ");
	let shape = group.getObjectByName(model);
	material = parseInt(material, 10);
	if (model === "carpet") {
		shape.material.map = new THREE.TextureLoader().load(allTextures[material]);
	} else {
		cushionChange(shape, material);
	}
	group.add(shape);
};

const cushionChange = (shape, material) => {
	switch (material) {
		case 1:
			shape.geometry = new THREE.SphereGeometry(2, 3, 4);
			shape.material.map = new THREE.TextureLoader().load(allTextures["1"]);
			break;
		case 2:
			shape.geometry = new THREE.BoxGeometry(2, 2, 2);
			shape.material.map = new THREE.TextureLoader().load(allTextures["2"]);
			break;
		case 3:
			shape.geometry = new THREE.SphereGeometry(2, 3, 4);
			shape.material.map = new THREE.TextureLoader().load(allTextures["3"]);
			break;
		case 4:
			shape.geometry = new THREE.BoxGeometry(2, 2, 2);
			shape.material.map = new THREE.TextureLoader().load(allTextures["4"]);
			break;
		case 5:
			shape.geometry = new THREE.SphereGeometry(2, 3, 4);
			shape.material.map = new THREE.TextureLoader().load(allTextures["5"]);
			break;
	}
	group.add(shape);
};

//Setting Selected Option
setInputOption = (option) => {
	selectedOption = option.dataset.value;
	console.log(selectedOption);
	chairPartInput.forEach((input) => {
		input.classList.remove("active");
	});
	option.classList.add("active");
};

//Create New Texture
const createNewTexture = (textureInfo) => {
	texture = new THREE.TextureLoader().load(allTextures[textureInfo]);
	material = new THREE.MeshBasicMaterial({ map: texture });
	setTexture(model, selectedOption, material);
};

//Set New Texture
const setTexture = (model, partName, material) => {
	model.traverse((part) => {
		if (part.name.includes(partName)) {
			part.material = material;
		}
	});
};

const init = () => {
	//Creating a scene
	scene = new THREE.Scene();
	scene.background = new THREE.Color(0xedf0f2);

	//Setting up the camera
	camera = new THREE.PerspectiveCamera(
		75,
		stage.offsetWidth / stage.offsetHeight,
		1,
		1000
	);
	camera.position.z = 12;

	//Rendering the scene and camera
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(stage.offsetWidth, stage.offsetHeight);
	stage.appendChild(renderer.domElement);

	//Adding the Oribit Controls
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.update();

	//Creating a New Group
	group = new THREE.Group();

	//Adding a new 3D Model
	chairLoader();

	textureInputs.forEach((input) => {
		input.addEventListener("click", (event) => {
			createNewTexture(event.target.dataset.value);
		});
	});

	// chairPartInput.forEach((input) => {
	// 	input.addEventListener("click", (event) => {
	// 		setInputOption(event.target.closest(".option"));
	// 	});
	// });

	chairPartInput.forEach((input) => {
		input.addEventListener("click", (event) => {
			setInputOption(event.target);
		});
	});

	//Handling Addition or Removal of models-cushions,carpets
	modelHandle.forEach((model) => {
		model.addEventListener("click", modelHandler);
	});

	//Switching Geometry
	materials.forEach((material) => {
		material.addEventListener("click", switchGeometry);
	});

	document.addEventListener("keypress", () => {
		if (event.keyCode === 32) {
			for (let part of objectSpecs) {
				setTexture(model, part.name, part.material);
				cushionUnloader();
				carpetUnloader();
			}
		}
	});
};

const animate = () => {
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
};

//Making Scene responsive
window.addEventListener("resize", () => {
	camera.aspect = stage.offsetWidth / stage.offsetHeight;
	renderer.setSize(stage.offsetWidth, stage.offsetHeight);
	camera.updateProjectionMatrix();
});

init();
animate();
