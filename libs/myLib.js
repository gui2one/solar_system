function myDegToRad(val){

	return val* Math.PI / 180;
}
(function(){Math.clamp=function(a,b,c){return Math.max(b,Math.min(c,a));}})();


function generateRegularPointCloud( color, _numPoints, width, length, height, pointSize ) {

	var geometry = new THREE.Geometry();
	var numPoints = _numPoints;
	var colors = [];

	for( var i = 0; i < numPoints; i++ ) {



		var u = i / width;
		var v = i / length;
		var x = (Math.random()*width) - (width/2);
		var y = (Math.random()*height) ;
		var z = (Math.random()*length) - (length/2);
		var v = new THREE.Vector3( x,y,z );

		var intensity = ( y + 0.1 ) * 7;
		colors[ 3 * i ] = color.r * intensity;
		colors[ 3 * i + 1 ] = color.g * intensity;
		colors[ 3 * i + 2 ] = color.b * intensity;

		geometry.vertices.push( v );
		colors[ i ] = ( color.clone().multiplyScalar( intensity ) );
	}

	geometry.colors = colors;
	geometry.computeBoundingBox();

	var material = new THREE.PointCloudMaterial( { size: pointSize, vertexColors: THREE.VertexColors } );
	var pointcloud = new THREE.PointCloud( geometry, material );

	return pointcloud;
}

function traceRay(origin, direction){

	var ray = new THREE.Raycaster();
	ray.set(origin, direction);	
	return ray;
}



//// PSEUDO RANDOM NUMBER GENERATION
function nextRandomNumber(){
  var hi = this.seed / this.Q;
  var lo = this.seed % this.Q;
  var test = this.A * lo - this.R * hi;
  if(test > 0){
    this.seed = test;
  } else {
    this.seed = test + this.M;
  }
  return (this.seed * this.oneOverM);
}

function RandomNumberGenerator(seed){
  var d = new Date();
  this.seed = seed;//2345678901 + (d.getSeconds() * 0xFFFFFF) + (d.getMinutes() * 0xFFFF);
  this.A = 48271;
  this.M = 2147483647;
  this.Q = this.M / this.A;
  this.R = this.M % this.A;
  this.oneOverM = this.M;
  this.next = nextRandomNumber;
  return this;
}

function createRandomNumber(seed){
  var rand = new RandomNumberGenerator(seed);
  return rand.next();
}