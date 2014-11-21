







var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000 );


var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.shadowMapEnabled = true;
renderer.shadowMapType = THREE.PCFSoftShadowMap;

////////////////////
////////// postprocessing
////////////////////

var composer = new THREE.EffectComposer( renderer );
var renderModel = new THREE.RenderPass(scene,camera);



////////////////////
///// FXAA
////////////////////

dpr = 1;
if (window.devicePixelRatio !== undefined) {
  dpr = window.devicePixelRatio;
  console.log(dpr);
}

effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
effectFXAA.uniforms['resolution'].value.set(1 / (window.innerWidth * dpr), 1 / (window.innerHeight * dpr));
effectFXAA.renderToScreen = true;
composer.addPass(renderModel);
composer.addPass(effectFXAA);

composer.addPass(renderModel);


var bloomFactor =0.9 , bloomStrength = 0.7;
var effectBloom = new THREE.BloomPass( bloomStrength,bloomFactor * 25.0, bloomFactor * 4 ,1024 );
// effectBloom.renderToScreen = true;
composer.addPass( effectBloom );





var effectCopy = new THREE.ShaderPass( THREE.CopyShader );
effectCopy.renderToScreen = true;
composer.addPass( effectCopy );




var controls = new THREE.FirstPersonControls(camera, renderer.domElement);
controls.movementSpeed = 10.0;

// var controls = new THREE.FirstPersonControls(camera);
var sceneClock = new THREE.Clock({autoStrart: true});

var gui = new dat.GUI({

	width : 300
});

var uiConfig = {

	param1:true

};

gui.add( uiConfig, 'param1').onChange( function() {

		console.log("changed param1");
});

gui.open();

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

















var sunGeo = new THREE.SphereGeometry(3,30,30);
var sunMaterial = new THREE.MeshBasicMaterial({map:new THREE.ImageUtils.loadTexture('maps/sun.jpg')});
var sun = new THREE.Mesh(sunGeo, sunMaterial);

scene.add(sun);


var speedMult = 0.3;
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






var sunLight = new THREE.PointLight(0xffffff,1.5);
sunLight.position.set(0,0,0);

scene.add(sunLight);

var ambientLight = new THREE.AmbientLight( 0x333333 );
scene.add(ambientLight);



///////////////
//// static spots TEST
///////////////


	var fSpot = [];

	for (var i = 0; i < 6; i++) {
	 	fSpot[i] = new THREE.SpotLight(0xffffff,1,1000,myDegToRad(60),0.0);
		fSpot[i].position.set(0,0,0);
		fSpot[i].castShadow = true;
		fSpot[i].onlyShadow = true;   //// <------------ only shadows
		fSpot[i].shadowBias = 0.0001;
		fSpot[i].shadowMapWidth = 2048;
		fSpot[i].shadowMapHeight = 2048;
		fSpot[i].shadowDarkness = 0.8;
		fSpot[i].shadowCameraNear = 1;
		fSpot[i].shadowCameraFar = 200;
		fSpot[i].shadowCameraFov =60;
		// fSpot[i].shadowCameraVisible = true;


		scene.add(fSpot[i]);
		scene.add(fSpot[i].target);	 	

		fSpot[i].position.set(0,0,0);
		fSpot[i].target.position.set(
			Math.sin(myDegToRad((360/6)*i)),
			0,
			Math.cos(myDegToRad((360/6)*i))
			);		
	 } 









///////////////
//// END static spots TEST
///////////////


 // renderer.shadowMapCullFace = THREE.CullFaceBack;


camera.position.x = 6;
camera.position.y = 12;
camera.position.z = 39;


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


		// console.log(camera.position);
		var dt = sceneClock.getDelta();

		controls.update(dt);

		var mult = 1;

		var p = new THREE.Vector3();

		p.setFromMatrixPosition(earth.moons[0].matrixWorld);
		var px = p.x, py = p.y, pz = p.z;

		// /////
		for (var i = planetsArray.length - 1; i >= 0; i--) {
			planetsArray[i].update();

		};



		// /////


		 






		var volumeVal = (1-Math.sqrt(Math.clamp(camera.position.distanceTo(earth.moons[0].position)/9,0,1)))*1.0;
		mainVolume.gain.value = volumeVal;
		// console.log(volumeVal);zdzzzz



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


		/////////////////////
		/////////  RENDER
		//////////////////:
		
		window.requestAnimationFrame(animate);	

		renderer.clear();

	    //renderer.render(scene, camera);
	    renderer.autoClear = false;
	    composer.render();
}

animate(new Date().getTime());



window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize() {

  effectFXAA.uniforms['resolution'].value.set(1 / (window.innerWidth * dpr), 1 / (window.innerHeight * dpr));
  composer.setSize(window.innerWidth * dpr, window.innerHeight * dpr);

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}













