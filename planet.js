 

function planet(_sceneObject,radius){
	

	// this.orbitRadius = _orbitRadius;
	var planetPivot = new THREE.Object3D();
	var moonPivot = new THREE.Object3D();
	var clock = new THREE.Clock({autostart:true});
	this.planet;
	this.moons = [];
	var moonsRandValue = [];
	var moonsPivots = [];
	var moonMesh;
	this.radius = radius;
	this.scene = _sceneObject;
	this.texture = new THREE.ImageUtils.loadTexture("maps/earth.jpg");
	this.orbitRadius = 5;
	this.orbitSpeed = 10;

	this.material;
	this.moon;
	this.ring;
	this.bDoRing = false;

	moonsSpeedMullt = 0.01;

	
	this.setRadius = function(_radius){

		this.radius = _radius;
		
	}

	this.setOrbitRadius = function(_orbitRadius){

		this.orbitRadius = _orbitRadius;
	}

	this.setOrbitSpeed = function(_speed){

		this.orbitSpeed = _speed;
	}

	this.setTexture= function(_texture){
		this.material.map = _texture;

	}

	this.doRing = function(){

		this.bDoRing = true;

		var ringGeo = new THREE.RingGeometry( this.radius*1.1, this.radius*1.3, 32 );
		var ringMaterial = new THREE.MeshLambertMaterial( { color: 0xffff00, side: THREE.DoubleSide, map: new THREE.ImageUtils.loadTexture('maps/sun.jpg')} );
		var ringMesh = new THREE.Mesh( ringGeo, ringMaterial );
		this.ring = ringMesh;	
		this.scene.add( this.ring );   
		console.log("added ring");
		this.ring.castShadow = true;
		this.ring.receiveShadow = true;
		
		this.ring.rotation.x = myDegToRad(60);
	}

	this.doMoon = function(_moonsNum){


		for(var i=0; i< _moonsNum; i++){

			 var randRadiusMult = 1-(Math.random()*0.5);

			 moonsRandValue[i] = Math.random();
			var moonGeo = new THREE.SphereGeometry(this.radius * 0.2 * randRadiusMult,20,20);

			var moonMaterial= new THREE.MeshPhongMaterial({
				map : new THREE.ImageUtils.loadTexture("maps/moon.jpg"),
				specular : 0x010101,
				specularMap: new THREE.ImageUtils.loadTexture("maps/moon.jpg"),
				bumpScale : 0.01,
				bumpMap: new THREE.ImageUtils.loadTexture("maps/moon.jpg")
			});		

			this.moons[i] = new THREE.Mesh(moonGeo, moonMaterial);
			this.moons[i].castShadow = true;
			this.moons[i].receiveShadow = true;
			this.scene.add(this.moons[i]);
			console.log("added a moon");
	

		}

	}
	this.initGeometry = function(){




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
		var orbitSpeed = clock.getElapsedTime() * this.orbitSpeed;
		//var orbitRadius = 10;
	
		this.planet.rotation.y += delta* 0.2;

		this.planet.position.set(
			(Math.sin(myDegToRad(orbitSpeed))* this.orbitRadius),
			0,
			(Math.cos(myDegToRad(orbitSpeed))* this.orbitRadius)
		);		

		
		if(this.bDoRing == true){
		
			// console.log(this.ring);
			 this.ring.position.set(this.planet.position.x,this.planet.position.y,this.planet.position.z);
		}

			//////////////////////
			////// moons orbits setup
			//////////////////////////

			var rng = new RNG('Example');

		for(var i=0; i< this.moons.length; i++){

			 


				


			var randOrbitRadiusMult = 1+((rng.random(1, 1000) / 1000.0)*3);
			var moonOrbitRadius = this.radius * 1.5  *randOrbitRadiusMult;
			var moonOrbitSpeed = clock.getElapsedTime() * (rng.random(500, 1000) / 1000.0)*80 *moonsSpeedMullt;
			this.moons[i].position.set(
				(Math.sin(myDegToRad(moonOrbitSpeed))* moonOrbitRadius) + this.planet.position.x,
				(Math.sin(myDegToRad(moonOrbitSpeed))* moonOrbitRadius*0.2) + this.planet.position.y,
				(Math.cos(myDegToRad(moonOrbitSpeed))* moonOrbitRadius) + this.planet.position.z
				);

			this.moons[i].position += this.planet.position;

			//this.moons[i].lookAt(this.planet.position);

		}






	}



}