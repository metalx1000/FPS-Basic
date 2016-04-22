var camera, scene, render, player;

init();
animate();

function init(){

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.set(0,5,0);
  //camera.lookAt(scene.position); 
  createPlayer();

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement);

  var size = 30, step = 3;

  var geometry = new THREE.Geometry();
  var material = new THREE.LineBasicMaterial({color: 'green'});   

  for ( var i = - size; i <= size; i += step){
    geometry.vertices.push(new THREE.Vector3( - size, - 0.04, i ));
    geometry.vertices.push(new THREE.Vector3( size, - 0.04, i ));

    geometry.vertices.push(new THREE.Vector3( i, - 0.04, - size ));
    geometry.vertices.push(new THREE.Vector3( i, - 0.04, size ));

  }

  var line = new THREE.Line( geometry, material, THREE.LinePieces);
  scene.add(line);
  window.addEventListener( "keydown", keyDown, false );
  window.addEventListener( "keyup", keyUp, false );
  render();
}

function animate(){
  requestAnimationFrame( animate );
  playerUpdate();
  render();
}

function render() {

  renderer.render( scene, camera );
}

function playerUpdate(){
  if(player.forward){
    player.translateZ(-1)
  }

  if(player.back){
    player.translateZ(1)
  }

  if(player.left){
    player.rotateY(.1);
  }

  if(player.right){
    player.rotateY(-.1);
  }
}

function createPlayer(){
  player = camera;
  player.speed = 1;
}

function keyDown(e){
  //console.log(e.keyCode);
  switch ( e.keyCode ) {
    case 38: // forward
    case 87: // forward
      player.forward = true;
      break;    
    case 40: // back
    case 83: // back
      player.back = true;
      break;    
    case 37: // left
    case 65: // left
      player.left = true;
      break;
    case 39: // right
    case 68: // right
      player.right = true;
      break;
    case 32: // Spacebar to jump
      //jump
      break;
    case 90:
      var x=new THREE.Vector3(50,0,0);
      player.setAngularVelocity(x);
  }
}

function keyUp(e){
  switch ( e.keyCode ) {
    case 38: // forward Up
    case 87: // forward W
      player.forward = false;
      break;    
    case 40: // back
    case 83: // back
      player.back = false;
      break;    
    case 37: // left
    case 65: // left
      player.left = false;
      break; 
    case 39: // right
    case 68: // right
      player.right = false;
      break; 
    case 32: // Spacebar
      //jump
      break;
  }
 
}

