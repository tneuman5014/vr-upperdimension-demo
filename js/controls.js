var move_vector = new THREE.Vector3(0, 0, 0);

function press(key, vrEffect) {
	switch (key) {
		case 'h':
			vrEffect.setFullScreen(true);
			vrEffect.setSize(window.innerWidth, window.innerHeight);
			break;
	}
}

function down(key, vector) {
	switch (key) {
		case 'w':
			vector.z = -0.2;
			break;
		case 'a':
			vector.x = -0.2;
			break;
		case 's':
			vector.z = 0.2;
			break;
		case 'd':
			vector.x = 0.2;
			break;
	}
}

function up(key, vector) {
	switch (key) {
		case 'w':
			vector.z = 0;
			break;
		case 'a':
			vector.x = 0;
			break;
		case 's':
			vector.z = 0;
			break;
		case 'd':
			vector.x = 0;
			break;
	}
}

function move(camera, vector) {
	camera.position.x += vector.x;
	camera.position.y += vector.y;
	camera.position.z += vector.z;
}