// DOM Selections
const stage = document.querySelector(".stage");
const textureInputs = document.querySelectorAll(".textures img");
const customizeInputs = document.querySelectorAll(".customize .option");

let scene,
	camera,
	renderer,
	geometry,
	material,
	texture,
	cube,
	controls,
	rayCast,
	loader,
	model,
	selectedOption = "legs";

//Setting all textures
const allTextures = {
	1: "https://images.pexels.com/photos/1293120/pexels-photo-1293120.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
	2: "https://images.pexels.com/photos/194096/pexels-photo-194096.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
	3: "https://images.pexels.com/photos/122458/pexels-photo-122458.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
	4: "https://images.pexels.com/photos/989946/pexels-photo-989946.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
	5: "https://images.pexels.com/photos/131634/pexels-photo-131634.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
	6: "https://images.pexels.com/photos/3695378/pexels-photo-3695378.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
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

const loadModel = () => {
	loader = new THREE.GLTFLoader();
	loader.load(modelPath, (gltf) => {
		model = gltf.scene;
		model.scale.set(7, 7, 7);
		model.position.y = -3;
		model.rotation.y = 4;
		for (let part of objectSpecs) {
			setTexture(model, part.name, part.material);
		}
		scene.add(model);
	}),
		undefined,
		(error) => {
			console.error(error);
		};
};

//Setting Selected Option
setInputOption = (option) => {
	selectedOption = option.dataset.value;
	customizeInputs.forEach((input) => {
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
	camera.position.z = 10;

	//Rendering the scene and camera
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(stage.offsetWidth, stage.offsetHeight);
	stage.appendChild(renderer.domElement);

	//Adding the Oribit Controls
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.update();

	//Adding a new 3D Model
	loadModel();

	textureInputs.forEach((input) => {
		input.addEventListener("click", (event) => {
			console.log(event.target.dataset.value);
			createNewTexture(event.target.dataset.value);
		});
	});

	customizeInputs.forEach((input) => {
		input.addEventListener("click", (event) => {
			setInputOption(event.target.closest(".option"));
		});
	});

	document.addEventListener("keypress", () => {
		if (event.keyCode === 32) {
			for (let part of objectSpecs) {
				setTexture(model, part.name, part.material);
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
