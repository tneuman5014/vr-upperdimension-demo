// A collection of vertices, lines, and 
// faces that can make up any Nth dimensional 
// form.

function Figure () {
	
	this.center = new Vector();
	this.dimensions;
	this.vertices = [];
	this.lines = [];
	this.faces = [];
	// The number of perpendicular planes in the space the figure lives in
	// (used for performing 2D rotations) is the triangular number if 
	// n = number of dimensions 
	this.rotation = [];
	this.scale = [];
	this.vertexSource = 'no shader source';
	this.fragmentSource = 'no shader source';
	
	this.createMesh = function createMesh() {
		
		this.geometry = new THREE.BufferGeometry();
		
		/*
		this.scaleAxis = function scaleAxis ( axis, scaleFactor ) {
			this.scale[axis] *= scaleFactor;
		}
		
		this.scaleAll = function scaleAll ( scaleFactor ) {
			for (var axis = 0; axis < this.scale.length; axis++ ) {
				this.scale[axis] *= scaleFactor;
			}
		}
		*/
		
		// N-dimensional Vectors must be split up into sets of components
		// so that they can fit into the "vec3" data structure of the webgl shaders
		var vertAxisChunks = [ [], [], [], [], [] ];
		var faceIndices = [];
		
		for (var vertIndex = 0; vertIndex < this.vertices.length; vertIndex++) {
			for (var axis = 0; axis < this.dimensions; axis++) {
				vertAxisChunks[ Math.floor( axis / 3 ) % 3 ][ vertIndex * 3 + axis % 3 ] = this.vertices[ vertIndex ].getAxis( axis );
			}
		}
		
		for (var faceIndex = 0; faceIndex < this.faces.length; faceIndex++) {
			for (var triangle = 0; triangle < this.faces[ faceIndex ].pieces.length; triangle++) {
				faceIndices.push( this.faces[ faceIndex ].pieces[ triangle ].a );
				faceIndices.push( this.faces[ faceIndex ].pieces[ triangle ].b );
				faceIndices.push( this.faces[ faceIndex ].pieces[ triangle ].c );
			}
		}
		/*
		alert( new Float32Array( vertAxisChunks[ 0 ] ).toString() );
		alert( new Float32Array( vertAxisChunks[ 1 ] ).toString() );
		alert( new Float32Array( vertAxisChunks[ 2 ] ).toString() );
		alert( new Float32Array( vertAxisChunks[ 3 ] ).toString() );
		alert( new Float32Array( vertAxisChunks[ 4 ] ).toString() );
		alert( "indices" + new Uint16Array( faceIndices ) );
		*/
		
		
		
	//	this.geometry.addAttribute( 'color', new THREE.BufferAttribute( vertices, 3 ) );
		this.geometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( vertAxisChunks[ 0 ] ), 3 ) );
		this.geometry.addAttribute( 'index', new THREE.BufferAttribute( new Uint16Array( faceIndices ), 3 ) );
	//	this.geometry.addAttribute( 'normal', new THREE.BufferAttribute( new Float32Array( vertAxisChunks[ 0 ] ), 3) );
		this.geometry.addAttribute( 'positionChunk1', new THREE.BufferAttribute( new Float32Array( vertAxisChunks[ 0 ] ), 3 ) );
		this.geometry.addAttribute( 'positionChunk2', new THREE.BufferAttribute( new Float32Array( vertAxisChunks[ 1 ] ), 3 ) );
	//	this.geometry.addAttribute( 'positionChunk3', new THREE.BufferAttribute( new Float32Array( vertAxisChunks[ 2 ] ), 3 ) );
	//	this.geometry.addAttribute( 'positionChunk4', new THREE.BufferAttribute( new Float32Array( vertAxisChunks[ 3 ] ), 3 ) );
	//	this.geometry.addAttribute( 'positionChunk5', new THREE.BufferAttribute( new Float32Array( vertAxisChunks[ 4 ] ), 3 ) );
	//	this.geometry.computeVertexNormals();
	//	this.geometry.normalizeNormals();
		this.geometry.computeBoundingSphere();
		
		this.uniforms = {
				time: { type: "f", value: 1.0 },
				nPlaneDistance: { type: "f", value: 3.0 }
		};
		
		this.attribs = {
				positionChunk1: { type: "f", value: null },
				positionChunk2: { type: "f", value: null },
				positionChunk3: { type: "f", value: null },
				positionChunk4: { type: "f", value: null }
		};
		
		this.shaderMaterial = new THREE.ShaderMaterial( {
			uniforms: this.uniforms,
		//	attributes: this.attribs,
			vertexShader:   this.vertexSource,
			fragmentShader: this.fragmentSource,
			side: THREE.DoubleSide,
			transparent: false,
			opacity: 0.1
		});
		
		return new THREE.Mesh( this.geometry, this.shaderMaterial );
	}
}