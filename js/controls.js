var move_vector = new THREE.Vector3(0, 0, 0);

function handle(key, vrEffect) {
	switch (key) {
		case 'h':
			vrEffect.setFullScreen(true);
			vrEffect.setSize(window.innerWidth, window.innerHeight);
			break;
	}
}

function move(camera, vector) {
	camera.position.x += vector.x;
	camera.position.y += vector.y;
	camera.position.z += vector.z;
}