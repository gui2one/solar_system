 var rng = new RNG('Example');

for(var i =0 ; i< 10; i++){
	console.log( rng.random(1, 1000));
}






var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000 );

var controls = new THREE.FirstPersonControls(camera);
controls.movementSpeed = 50.0;

// var controls = new THREE.FirstPersonControls(camera);
var sceneClock = new THREE.Clock({autoStrart: true});


// /// SOUND test


window.AudioContext = (
  window.AudioContext ||
  window.webkitAudioContext ||
  null
);

if (!AudioContext) {
  throw new Error("AudioContext not supported!");
} 

// Create a new audio context.
var ctx = new AudioContext();

// Create a AudioGainNode to control the main volume.
var mainVolume = ctx.createGain();
// Connect the main volume node to the context destination.
mainVolume.connect(ctx.destination);


// Create an object with a sound source and a volume control.
var sound = {};
sound.source = ctx.createBufferSource();
sound.volume = ctx.createGain();

// Connect the sound source to the volume control.
sound.source.connect(sound.volume);
// Hook up the sound volume control to the main volume.
sound.volume.connect(mainVolume);

// Make the sound source loop.
sound.source.loop = true;

// var soundFileName = "sound/Meghan Trainor-All_About_That Bass.mp3";
var soundFileName = "sound/morse_code.mp3";
// Load a sound file using an ArrayBuffer XMLHttpRequest.
var request = new XMLHttpRequest();
request.open("GET", soundFileName, true);
request.responseType = "arraybuffer";
request.onload = function(e) {

  // Create a buffer from the response ArrayBuffer.
  ctx.decodeAudioData(this.response, function onSuccess(buffer) {
    sound.buffer = buffer;

    // Make the sound source use the buffer and start playing it.
    sound.source.buffer = sound.buffer;

    sound.source.start(ctx.currentTime);
  }, function onFailure() {
    alert("Decoding the audio buffer failed");
  });
};
request.send();

sound.panner = ctx.createPanner();
// Instead of hooking up the volume to the main volume, hook it up to the panner.
sound.volume.connect(sound.panner);
// And hook up the panner to the main volume.
sound.panner.connect(mainVolume);




//// END SOUND














var sunLight = new THREE.PointLight(0xffffff,1.8);
sunLight.position.set(0,0,0);

scene.add(sunLight);


var sunGeo = new THREE.SphereGeometry(3,30,30);
var sunMaterial = new THREE.MeshBasicMaterial({map:new THREE.ImageUtils.loadTexture('maps/sun.jpg')});
var sun = new THREE.Mesh(sunGeo, sunMaterial);

scene.add(sun);


var speedMult = 0.1;
var planetsArray = [];


var mercury = new planet(scene,1,10);
mercury.setTexture(new THREE.ImageUtils.loadTexture("maps/mercury.jpg"));
// mercury.setOrbitRadius(10);
mercury.setOrbitSpeed(50.55 * speedMult)
planetsArray[0] = mercury;

var venus = new planet(scene,0.8,15);
venus.setTexture(new THREE.ImageUtils.loadTexture("maps/venus.jpg"));
// venus.setOrbitRadius(15);
venus.setOrbitSpeed(32.5 * speedMult)
planetsArray[1] = venus;

var earth = new planet(scene,2,25);
earth.setTexture(new THREE.ImageUtils.loadTexture("maps/earth.jpg"));
// earth.setOrbitRadius(25);
earth.setOrbitSpeed(45.8 * speedMult)
earth.doMoon(1);
planetsArray[2] = earth;

var mars = new planet(scene,1.2,40);
mars.setTexture(new THREE.ImageUtils.loadTexture("maps/mars.jpg"));
// mars.setOrbitRadius(40);
mars.setOrbitSpeed(39.9 * speedMult);
mars.doMoon(2)
planetsArray[3] = mars;

var jupiter = new planet(scene,4,60);
jupiter.setTexture(new THREE.ImageUtils.loadTexture("maps/jupiter.jpg"));
// jupiter.setOrbitRadius(60);
jupiter.setOrbitSpeed(50.1 * speedMult);
jupiter.doMoon(2)
planetsArray[4] = jupiter;

var saturn = new planet(scene,3,80);
saturn.setTexture(new THREE.ImageUtils.loadTexture("maps/saturn.jpg"));
// saturn.setOrbitRadius(80);
saturn.setOrbitSpeed(49.2 * speedMult);
saturn.doRing();
planetsArray[5] = saturn;

var neptune = new planet(scene,2,100);
neptune.setTexture(new THREE.ImageUtils.loadTexture("maps/neptune.jpg"));
// saturn.setOrbitRadius(80);
neptune.setOrbitSpeed(22.2 * speedMult);
planetsArray[6] = neptune;

var uranus = new planet(scene,1.5,130);
uranus.setTexture(new THREE.ImageUtils.loadTexture("maps/uranus.jpg"));
// saturn.setOrbitRadius(80);
uranus.setOrbitSpeed(21.2 * speedMult);
planetsArray[7] = uranus;




//// planets spot lights for shadow mapping

var spotLightsArray = [];
for(var i=0; i < planetsArray.length; i++){

	spotLightsArray[i] = new THREE.SpotLight(0xffffff,10,100,myDegToRad(30),1);
	//var mercurySpotLight= new THREE.SpotLight(0xffffff,2,100,myDegToRad(30),1);
	spotLightsArray[i].position.set(0,0,0);
	spotLightsArray[i].castShadow = true;
	spotLightsArray[i].onlyShadow = true;   //// <------------ only shadows
	spotLightsArray[i].shadowBias = -0.0001
	spotLightsArray[i].shadowMapWidth = 1024;
	spotLightsArray[i].shadowMapHeight = 1024;
	spotLightsArray[i].shadowDarkness = 0.9;
	spotLightsArray[i].shadowCameraNear = 1;
	spotLightsArray[i].shadowCameraFar = 500;
	spotLightsArray[i].shadowCameraFov =30;
	// spotLightsArray[i].shadowCameraVisible = true;
	scene.add(spotLightsArray[i]);
	scene.add(spotLightsArray[i].target);
}





///////////////////
/////////// END planets spotlights
/////////////////////////:






var renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.shadowMapEnabled = true;

renderer.shadowMapType = THREE.PCFSoftShadowMap;

// renderer.shadowMapCullFace = THREE.CullFaceFront;
// earthSpotLight.shadowCascadeCount = 3;
// renderer.shadowMapCascade = true;

camera.position.y = 20;
camera.position.z = 20;


 //// night shader test --- interessant mais ca marche pas encore... 
// 	uniforms = {

// 		sunPosition: {type: "v3", value: new THREE.Vector3(20,5,20)},
// 		earthPosition: {type: "v3", value: new THREE.Vector3(0,0,0)},
// 		texture1: { type: "t", value: THREE.ImageUtils.loadTexture( "maps/earth_night.jpg" ) }


// 	};

// 	uniforms.texture1.value.wrapS = uniforms.texture1.value.wrapT = THREE.RepeatWrapping;

// earth.planetMesh.material = 	new THREE.ShaderMaterial( {

// 					uniforms: uniforms,
// 					transparent : true,
// 					blending : THREE.NormalBlending,
// 					vertexShader: document.getElementById( 'vertexShader' ).textContent,
// 					fragmentShader: document.getElementById( 'fragmentShader' ).textContent

// 				} );
// console.log(earth.planetMesh.material.uniforms);

//  earth.planetMesh.material.uniforms.sunPosition.needsUpdate = true;
////////////////////
/////////// end NIGHT SHADER TEST
//////////////////




var once = 0;
function animate(t){


		for(var i=0; i<spotLightsArray.length; i++){
			spotLightsArray[i].target.position.set(planetsArray[i].planet.position.x , planetsArray[i].planet.position.y , planetsArray[i].planet.position.z);
		}

		var dt = sceneClock.getDelta();

		controls.update(dt);
		camera.lookAt(new THREE.Vector3( 0, 0, 0 ));
		var mult = 1;

		var p = new THREE.Vector3();

		p.setFromMatrixPosition(earth.moons[0].matrixWorld);
		var px = p.x, py = p.y, pz = p.z;

		// /////
		for (var i = planetsArray.length - 1; i >= 0; i--) {
			planetsArray[i].update();

		};



		// /////


		 






		var volumeVal = (1-Math.sqrt(Math.clamp(camera.position.distanceTo(earth.moons[0].position)/9,0,1)))*0.2;
		mainVolume.gain.value = volumeVal;
		// console.log(volumeVal);



		 earth.moons[0].updateMatrixWorld();
		 // console.log(earth.moon.position.x);
		var p = new THREE.Vector3();
		p.setFromMatrixPosition(earth.moons[0].matrixWorld);

		// And copy the position over to the sound of the object.
		sound.panner.setPosition(p.x * mult, p.y * mult, p.z * mult);

		camera.updateMatrixWorld();
		var p = new THREE.Vector3();
		p.setFromMatrixPosition(camera.matrixWorld);

		// And copy the position over to the listener.
		ctx.listener.setPosition(p.x * mult, p.y * mult, p.z * mult);





		earth.moons[0].updateMatrixWorld();

		var q = new THREE.Vector3();
		q.setFromMatrixPosition(earth.moons[0].matrixWorld);
		var dx = q.x-px, dy = q.y-py, dz = q.z-pz;

		sound.panner.setPosition(q.x * mult, q.y* mult, q.z* mult);
		sound.panner.setVelocity(dx/dt, dy/dt, dz/dt);		
		

		renderer.setClearColor( 0x000000);

	    renderer.render(scene, camera);
	    window.requestAnimationFrame(animate, renderer.domElement);		
}

animate(new Date().getTime());



window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}













