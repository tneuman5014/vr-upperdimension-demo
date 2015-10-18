			uniform float time;
			varying vec3 vNormal;
			void main() {
				vec3 lightAngle = normalize(vec3(1.0, 0.8, 0.9));
			//	float dProd = max(0.0, dot(vNormal, lightAngle));
				float a, b, c;
				a = 1.0 * cos((0.000111 * gl_FragCoord.x * gl_FragCoord.x + 8.0 * vNormal.z)) * sin( 0.4 * time) * vNormal.x;
				b = cos((0.0002 * gl_FragCoord.y * gl_FragCoord.y + 16.0 * vNormal.y)) * cos( 3.333 * time + 3.0) * vNormal.y + 0.1 * cos(time) * cos(gl_FragCoord.x);
				c = sin((0.001 * gl_FragCoord.x * gl_FragCoord.y + 50.0 * vNormal.x)) * cos( 1.5 * sin( time )) * vNormal.z;
				
				gl_FragColor = vec4(a + cos(0.15 * time) * c , 1.0 * cos(0.241 * time) * b + 0.8 * sin(0.3 * time) * a, a + a * cos(0.1 * time) + c * a * b * 20.0 + 0.3 * cos(0.2 * time) * b, 1.0);
			//	gl_FragColor = vec4(a * dProd, b * dProd, c * dProd, 1.0);