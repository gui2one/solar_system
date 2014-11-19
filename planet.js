function planet(_sceneObject,radius){
	

	// this.orbitRadius = _orbitRadius;
	var planetPivot = new THREE.Object3D();
	var moonPivot = new THREE.Object3D();
	var clock = new THREE.Clock({autostart:true});
	this.planet;
	var moonMesh;
	this.radius = radius;
	this.scene = _sceneObject;
	this.texture = new THREE.ImageUtils.loadTexture("maps/earth.jpg");

	console.log(this.texture.anisotropy + "!!!!!");

	 this.texture.anisotropy = 4;
	console.log(this.texture.anisotropy + "!!!!!");
	this.material;
	this.moon;

	
	this.setRadius = function(_radius){

		this.radius = _radius;
		
	}

	this.setTexture= function(_texture){


	}

	this.initGeometry = function(){

		var moonGeo = new THREE.SphereGeometry(this.radius * 0.2,20,20);
		var moonMaterial= new THREE.MeshPhongMaterial({
			map : new THREE.ImageUtils.loadTexture("maps/moon.jpg"),
			specular : 0x010101,
			specularMap: new THREE.ImageUtils.loadTexture("maps/moon.jpg"),
			bumpScale : 0.01,
			bumpMap: new THREE.ImageUtils.loadTexture("maps/moon.jpg")
		});
		moonMesh = new THREE.Mesh(moonGeo, moonMaterial);
		moonMesh.castShadow = true;
		moonMesh.receiveShadow = true;
		this.scene.add(moonPivot);
		this.scene.add(moonMesh);
		this.moon = moonMesh;
		moonMesh.position.x = -4;

		moonPivot.add(moonMesh);
		 // moonPivot.rotation.x = myDegToRad(-60);


		var planetGeo = new THREE.SphereGeometry(this.radius,30,30);
		var material = new THREE.MeshPhongMaterial({
			map : this.texture,
			specular : 0x111111,
			specularMap: new THREE.ImageUtils.loadTexture("maps/earth_specular.jpg"),
			bumpScale : 0.01,
			bumpMap: new THREE.ImageUtils.loadTexture("maps/earth_bump.jpg")
		});
		

		

		this.material = material;
		this.planet = new THREE.Mesh(planetGeo, material);
		this.planet.castShadow = true;
		this.planet.receiveShadow = true;		

		this.scene.add(this.planet);
		// this.planet.add(moonPivot);
		// this.scene.add(planetPivot);
		// planetPivot.add(this.planet);
		

		 

		 this.planet.matrixAutoUpdate = true;
		

	}

	this.initGeometry();


	this.update = function(){





		var delta = clock.getDelta();
		var orbitSpeed = clock.getElapsedTime() * 10;
		var orbitRadius = 10;
	
		this.planet.rotation.y += delta* 0.2;

		this.planet.position.set(
			(Math.sin(myDegToRad(orbitSpeed))* orbitRadius),
			0,
			(Math.cos(myDegToRad(orbitSpeed))* orbitRadius)
			);		

		var moonOrbitRadius = 4.5;
		var moonOrbitSpeed = clock.getElapsedTime() * 80;
		this.moon.position.set(
			(Math.sin(myDegToRad(moonOrbitSpeed))* moonOrbitRadius) + this.planet.position.x,
			0 + this.planet.position.y,
			(Math.cos(myDegToRad(moonOrbitSpeed))* moonOrbitRadius) + this.planet.position.z
			);

		this.moon.position += this.planet.position;

		this.moon.lookAt(this.planet.position);

		//moonPivot.rotation.x += 0.001;



	}



}