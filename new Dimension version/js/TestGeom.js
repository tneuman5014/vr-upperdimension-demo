
function TestGeom ( ) {
	
	
	this.geometry = new THREE.BufferGeometry();
	
	
//	var vertices = new Float32Array( verts );
	
	var nCubey = new Ncube( 3, 1.0, new Vector( [ 0.0, 0.0, 0.0 ]));
	var temp = [];
	for (var vertIndex = 0; vertIndex < nCubey.vertices.length; vertIndex++) {
		for (var axis = 0; axis < 3; axis++) {
			temp.push( nCubey.vertices[ vertIndex ].getAxis( axis ) );
		}
	//	temp = temp.concat( nCubey.vertices[ vertIndex ].position );
	}
	vertices = new Float32Array( temp );
	
	temp = [];
	for (var faceIndex = 0; faceIndex < nCubey.faces.length; faceIndex++) {
		for (var triangle = 0; triangle < nCubey.faces[ faceIndex ].pieces.length; triangle++) {
			temp.push( nCubey.faces[ faceIndex ].pieces[ triangle ].a );
			temp.push( nCubey.faces[ faceIndex ].pieces[ triangle ].b );
			temp.push( nCubey.faces[ faceIndex ].pieces[ triangle ].c );
		}
	}
	indices = new Uint16Array( temp );
	
	temp = [];
	for (var vert = 0; vert < nCubey.vertices.length; vert++) {
		for (var axis = 0; axis < nCubey.dimensions; axis++) {
			temp.push( nCubey.vertices[ vert ].getAxis( axis ) );
		}
	}
	var realVerts = new Float32Array( temp );
	
//	this.geometry.addAttribute( 'color', new THREE.BufferAttribute( vertices, 3 ) );
	this.geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
	this.geometry.addAttribute( 'index', new THREE.BufferAttribute( indices, 3 ) );
	this.geometry.addAttribute( 'normal', new THREE.BufferAttribute( vertices, 3) );
	this.geometry.addAttribute( 'nPosition', new THREE.BufferAttribute( realVerts, nCubey.dimensions ));
//	this.geometry.computeVertexNormals();
//	this.geometry.normalizeNormals();
	this.geometry.computeBoundingSphere();
	
	this.uniforms = {
			time: {type: "f", value: 1.0}
	};
	
	this.attribs = {
			nPosition: {type: "f", value: null}
	};
	
	this.shaderMat = new THREE.ShaderMaterial( {
		uniforms: this.uniforms,
		attributes: this.attribs,
		vertexShader:   document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
		side: THREE.DoubleSide,
		transparent: true,
		opacity: 0.2
	});
	
	this.material = new THREE.MeshBasicMaterial( 
			{ transparent: true, opacity: 0.9, depthWrite: true, depthTest: true,
			  vertexColors: THREE.VertexColors, side: THREE.DoubleSide } );
	this.testMesh = new THREE.Mesh( this.geometry, this.shaderMat );
	
	
	/*
	this.segments = 1000;

	this.geometry = new THREE.BufferGeometry();
	this.material = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors });

	this.positions = new Float32Array( this.segments * 3 );
	this.colors = new Float32Array( this.segments * 3 );

	var r = 2;

	for ( var i = 0; i < this.segments; i ++ ) {

		var x = Math.random() * r - r / 2;
		var y = Math.random() * r - r / 2;
		var z = Math.random() * r - r / 2;

		// positions

		this.positions[ i * 3 ] = x;
		this.positions[ i * 3 + 1 ] = y;
		this.positions[ i * 3 + 2 ] = z;

		// colors

		this.colors[ i * 3 ] = ( x / r ) + 0.5;
		this.colors[ i * 3 + 1 ] = ( y / r ) + 0.5;
		this.colors[ i * 3 + 2 ] = ( z / r ) + 0.5;

	}

	this.geometry.addAttribute( 'position', new THREE.BufferAttribute( this.positions, 3 ) );
	this.geometry.addAttribute( 'color', new THREE.BufferAttribute( this.colors, 3 ) );

	this.geometry.computeBoundingSphere();

	this.testMesh = new THREE.Line( this.geometry, this.material );
	*/
	
}