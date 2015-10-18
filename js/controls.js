var KEY = {W:0, A:1, S:2, D:3};

function handle(key, camera, vrEffect) {
	/*switch (key) {
		case 'w':
			move(camera, {x:0, y:0.12, z:0});
		case 'a':
			move(camera, {x:0, y:0, z:0.12});
		case 's':
			move(camera, {x:0, y:0, z:0.12});
		case 'd':
			move(camera, {x:0.12, y:0, z:0});
	}*/
	vrEffect.setFullScreen(true);
	console.log("Enter full screen");
	vrEffect.setSize(window.innerWidth, window.innerHeight);
}

function move(camera, vector) {
	camera.position.x += vector.x;
	camera.position.y += vector.y;
	camera.position.z += vector.z;
}