function planet(_sceneObject,radius){
	

	var pivot = new THREE.Object3D();
	var clock = new THREE.Clock({autostart:true});
	this.planetMesh;
	var moonMesh;
	this.radius = radius;
	this.scene = _sceneObject;
	this.texture = new THREE.ImageUtils.loadTexture("js/solar_system/maps/earth.jpg");
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
			map : new THREE.ImageUtils.loadTexture("js/solar_system/maps/moon.jpg"),
			specular : 0x010101,
			specularMap: new THREE.ImageUtils.loadTexture("js/solar_system/maps/moon.jpg"),
			bumpScale : 0.01,
			bumpMap: new THREE.ImageUtils.loadTexture("js/solar_system/maps/moon.jpg")
		});
		moonMesh = new THREE.Mesh(moonGeo, moonMaterial);
		moonMesh.castShadow = true;
		moonMesh.ReceiveShadow = true;
		this.scene.add(pivot);
		this.scene.add(moonMesh);
		this.moon = moonMesh;
		moonMesh.position.x = -4;

		pivot.add(moonMesh);
		 // pivot.rotation.x = myDegToRad(-60);

		var planetGeo = new THREE.SphereGeometry(this.radius,30,30);
		var material = new THREE.MeshPhongMaterial({
			map : this.texture,
			specular : 0x111111,
			specularMap: new THREE.ImageUtils.loadTexture("js/solar_system/maps/earth_specular.jpg"),
			bumpScale : 0.01,
			bumpMap: new THREE.ImageUtils.loadTexture("js/solar_system/maps/earth_bump.jpg")
		});
		

		

		this.material = material;
		this.planetMesh = new THREE.Mesh(planetGeo, material);
		moonMesh.castShadow = true;
		moonMesh.ReceiveShadow = true;		

		this.scene.add(this.planetMesh);

		

	}

	this.initGeometry();


	this.update = function(){
		var delta = clock.getDelta();
		var orbitSpeed = clock.getElapsedTime() * 40;
		var orbitRadius = 4.3;
		this.planetMesh.rotation.y += delta* 0.2;
		this.moon.position.set(
			Math.sin(myDegToRad(orbitSpeed))* orbitRadius,
			0,
			Math.cos(myDegToRad(orbitSpeed))* orbitRadius
			);

		this.moon.lookAt(this.planetMesh.position);

		//pivot.rotation.x += 0.001;



	}



}