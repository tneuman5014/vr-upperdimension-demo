
function ShaderSource() {
	
	this.vertexShader = function vertexShader( dimensions ) {
			var source = [
			'varying vec3 vNormal;',			
			'attribute vec3 positionChunk1;',
			'attribute vec3 positionChunk2;',

			'void main() {',
				
			//	vec3 projected = positionChunk1;
			//	for (int i = 3; i < 6; i++) {
					
			//	}
				
				'vNormal = positionChunk1;',
				'gl_Position =  projectionMatrix *',
		    				   'modelViewMatrix  *',
		     				   'vec4(positionChunk1.x, positionChunk1.y, positionChunk1.z, 1.0);',
			'}'
			].join('\n');
			return source;
	}
	
		this.fragmentShader = function fragmentShader() {
			var source = [
			'uniform float time;',
			'varying vec3 vNormal;',
			'void main() {',

				'gl_FragColor = vec4(0.5, 0.5, 0.5, 1.0);',
			'}'
			].join('\n');
			return source;
	}
	
}