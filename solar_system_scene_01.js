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
var spotLight= new THREE.SpotLight(0xffffff,2,100,myDegToRad(90),1);



spotLight.position.set(0,0,0);


spotLight.castShadow = true;
spotLight.onlyShadow = true;
spotLight.shadowBias = -0.0001

spotLight.shadowMapWidth = 2048;
spotLight.shadowMapHeight = 2048;
spotLight.shadowDarkness = 0.9;

// light.shadowMapDebug = true;

spotLight.shadowCameraNear = 1;
spotLight.shadowCameraFar = 500;
spotLight.shadowCameraFov =120;
// spotLight.shadowCameraVisible = true;


scene.add(spotLight);


var spotLight2= new THREE.SpotLight(0xffffff,2,100,myDegToRad(90),1);

spotLight2.castShadow = true;
spotLight2.onlyShadow = true;
spotLight2.shadowBias = -0.0001

spotLight2.shadowMapWidth = 2048;
spotLight2.shadowMapHeight = 2048;
spotLight2.shadowDarkness = 0.9;

// light.shadowMapDebug = true;

spotLight2.shadowCameraNear = 1;
spotLight2.shadowCameraFar = 500;
spotLight2.shadowCameraFov =120;
spotLight2.shadowCameraVisible = true;


scene.add(spotLight2);

spotLight2.position.set(0,0,0);
spotLight2.target.position = new THREE.Vector3(-50,0,0);



var sunLight = new THREE.PointLight(0xffffff,1.8);
sunLight.position.set(0,0,0);

scene.add(sunLight);











var myPlanet = new planet(scene,2);

// myPlanet.moon.castShadow = true;
// myPlanet.moon.receiveShadow = true;

// myPlanet.planetMesh.castShadow = true;
// myPlanet.planetMesh.receiveShadow = true;

console.log(myPlanet.moon);


var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.shadowMapEnabled = true;
renderer.shadowMapType = THREE.PCFSoftShadowMap;

// renderer.shadowMapCullFace = THREE.CullFaceFront;
// spotLight.shadowCascadeCount = 3;
// renderer.shadowMapCascade = true;


camera.position.z = 5;


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
var render = function(){



		
		spotLight.castShadow = true;
		var dt = sceneClock.getDelta();

		controls.update(dt);
		camera.lookAt(new THREE.Vector3( 0, 0, 0 ));
		var mult = 1;

		var p = new THREE.Vector3();

		p.setFromMatrixPosition(myPlanet.moon.matrixWorld);
		var px = p.x, py = p.y, pz = p.z;

		// /////

		myPlanet.update();

		// /////

		spotLight.target.position = myPlanet.planet.position.copy;

		// if(once != 0){
		// 	spotLight.shadowCamera.lookAt(myPlanet.planet.position);
		// 	spotLight.shadowCamera.matrixAutoUpdate = true;
		// 	spotLight.shadowCamera.updateMatrix();
		// 	spotLight.shadowMatrix.lookAt(new THREE.Vector3(0,0,0),myPlanet.planet.position,new THREE.Vector3(0,1,0));

		// }

		// once++;



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

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}













