 var rng = new RNG('Example');

for(var i =0 ; i< 10; i++){
	console.log( rng.random(1, 1000));
}






var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100 );

var controls = new THREE.FirstPersonControls(camera);

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












// var light= new THREE.DirectionalLight(0xffffff);
var spotLight= new THREE.SpotLight(0xffffff,2,100,myDegToRad(30),1);



spotLight.position.set(0,0,0);
spotLight.target.position.set(10,0,10);


spotLight.castShadow = true;
spotLight.onlyShadow = true;
spotLight.shadowBias = -0.0001

spotLight.shadowMapWidth = 2048;
spotLight.shadowMapHeight = 2048;
spotLight.shadowDarkness = 0.9;

// light.shadowMapDebug = true;

spotLight.shadowCameraNear = 1;
spotLight.shadowCameraFar = 500;
spotLight.shadowCameraFov =60;
// spotLight.shadowCameraVisible = true;


scene.add(spotLight);
scene.add(spotLight.target);









var sunLight = new THREE.PointLight(0xffffff,1.8);
sunLight.position.set(0,0,0);

scene.add(sunLight);











var myPlanet = new planet(scene,2);
myPlanet.doMoon(1);

// myPlanet.moon.castShadow = true;
// myPlanet.moon.receiveShadow = true;

// myPlanet.planetMesh.castShadow = true;
// myPlanet.planetMesh.receiveShadow = true;




var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.shadowMapEnabled = true;
renderer.shadowMapType = THREE.PCFSoftShadowMap;

// renderer.shadowMapCullFace = THREE.CullFaceFront;
// spotLight.shadowCascadeCount = 3;
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

// myPlanet.planetMesh.material = 	new THREE.ShaderMaterial( {

// 					uniforms: uniforms,
// 					transparent : true,
// 					blending : THREE.NormalBlending,
// 					vertexShader: document.getElementById( 'vertexShader' ).textContent,
// 					fragmentShader: document.getElementById( 'fragmentShader' ).textContent

// 				} );
// console.log(myPlanet.planetMesh.material.uniforms);

//  myPlanet.planetMesh.material.uniforms.sunPosition.needsUpdate = true;
////////////////////
/////////// end NIGHT SHADER TEST
//////////////////




var once = 0;
function animate(t){



		
		spotLight.target.position.set(myPlanet.planet.position.x , myPlanet.planet.position.y , myPlanet.planet.position.z);
		var dt = sceneClock.getDelta();

		controls.update(dt);
		camera.lookAt(new THREE.Vector3( 0, 0, 0 ));
		var mult = 1;

		var p = new THREE.Vector3();

		p.setFromMatrixPosition(myPlanet.moons[0].matrixWorld);
		var px = p.x, py = p.y, pz = p.z;

		// /////

		myPlanet.update();

		// /////


		 






		var volumeVal = (1-Math.sqrt(Math.clamp(camera.position.distanceTo(myPlanet.moons[0].position)/9,0,1)))*0.2;
		mainVolume.gain.value = volumeVal;
		// console.log(volumeVal);



		 myPlanet.moons[0].updateMatrixWorld();
		 // console.log(myPlanet.moon.position.x);
		var p = new THREE.Vector3();
		p.setFromMatrixPosition(myPlanet.moons[0].matrixWorld);

		// And copy the position over to the sound of the object.
		sound.panner.setPosition(p.x * mult, p.y * mult, p.z * mult);

		camera.updateMatrixWorld();
		var p = new THREE.Vector3();
		p.setFromMatrixPosition(camera.matrixWorld);

		// And copy the position over to the listener.
		ctx.listener.setPosition(p.x * mult, p.y * mult, p.z * mult);





		myPlanet.moons[0].updateMatrixWorld();

		var q = new THREE.Vector3();
		q.setFromMatrixPosition(myPlanet.moons[0].matrixWorld);
		var dx = q.x-px, dy = q.y-py, dz = q.z-pz;

		sound.panner.setPosition(q.x * mult, q.y* mult, q.z* mult);
		sound.panner.setVelocity(dx/dt, dy/dt, dz/dt);		
		

		//renderer.setClearColor( 0x000000 );

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













