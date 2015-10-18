var SHORT_SIDE_LENGTH = 2;
var LONG_SIDE_LENGTH  = 4;

var MATERIAL = new THREE.MeshBasicMaterial({color:0xff0000});

function generateBox(x, y, z, height) {
	var geometry = new THREE.BoxGeometry(SHORT_SIDE_LENGTH, LONG_SIDE_LENGTH, height);
	var result = new THREE.Mesh(geometry, MATERIAL);
	result.position.x = x;
	result.position.y = y;
	result.position.z = z;
	return result;
}

function generateLine(startvector, endvector) {
	var geometry = new THREE.Geometry();
	geometry.vertices.push(startvector, endvector);
	var mat = new THREE.LineBasicMaterial({color:0x000ff});
	return new THREE.Line(geometry, mat);
}