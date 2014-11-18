var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000 );

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

var soundFileName = "js/solar_system/sound/morse_code.mp3";
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












// var light= new THREE.DirectionalLight(0xffffff);
var spotLight= new THREE.SpotLight(0xffffff,2,100,myDegToRad(90),1);



spotLight.position.set(20,5,20);
// spotLight.lookAt(new THREE.Vector3( 0, 0, 0 ));

spotLight.castShadow = true;
spotLight.onlyShadow = true;
spotLight.shadowBias = -0.0001

spotLight.shadowMapWidth = 1024;
spotLight.shadowMapHeight = 1024;

// light.shadowMapDebug = true;

spotLight.shadowCameraNear = 1;
spotLight.shadowCameraFar = 500;
spotLight.shadowCameraFov =60;
// light.shadowCameraVisible = true;
scene.add(spotLight);

var sunLight = new THREE.PointLight(0xffffff,1.5);
sunLight.position.set(20,5,20);

scene.add(sunLight);











var myPlanet = new planet(scene,2);

myPlanet.moon.castShadow = true;
myPlanet.moon.receiveShadow = true;

myPlanet.planetMesh.castShadow = true;
myPlanet.planetMesh.receiveShadow = true;

console.log(myPlanet.moon);


var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.shadowMapEnabled = true;
renderer.shadowMapType = THREE.PCFSoftShadowMap;


camera.position.z = 5;
var render = function(){

		var dt = sceneClock.getDelta();
		var mult = 1;
		var p = new THREE.Vector3();

		p.setFromMatrixPosition(myPlanet.moon.matrixWorld);
		var px = p.x, py = p.y, pz = p.z;

		// /////

		myPlanet.update();

		// /////


		var volumeVal = (1-Math.sqrt(Math.clamp(camera.position.distanceTo(myPlanet.moon.position)/9,0,1)))*1.0;
		mainVolume.gain.value = volumeVal;
		// console.log(volumeVal);



		 myPlanet.moon.updateMatrixWorld();
		 // console.log(myPlanet.moon.position.x);
		var p = new THREE.Vector3();
		p.setFromMatrixPosition(myPlanet.moon.matrixWorld);

		// And copy the position over to the sound of the object.
		sound.panner.setPosition(p.x * mult, p.y * mult, p.z * mult);

		camera.updateMatrixWorld();
		var p = new THREE.Vector3();
		p.setFromMatrixPosition(camera.matrixWorld);

		// And copy the position over to the listener.
		ctx.listener.setPosition(p.x * mult, p.y * mult, p.z * mult);





		myPlanet.moon.updateMatrixWorld();

		var q = new THREE.Vector3();
		q.setFromMatrixPosition(myPlanet.moon.matrixWorld);
		var dx = q.x-px, dy = q.y-py, dz = q.z-pz;

		sound.panner.setPosition(q.x * mult, q.y* mult, q.z* mult);
		sound.panner.setVelocity(dx/dt, dy/dt, dz/dt);		
		
		requestAnimationFrame(render);
		renderer.setClearColor( 0x000000 );
		renderer.render(scene,camera);
}

render();

















