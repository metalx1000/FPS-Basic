var camera, scene, render, player;
var walls = [];

init();
animate();

function init(){

  scene = new THREE.Scene();

  createPlayer();

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement);

  grid(90,3);

  // load a texture, set wrap mode to repeat
  var texture = new THREE.TextureLoader().load( "res/stone.jpg" );
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  for(var i=0;i<50;i+=5){
    var wall = new THREE.Mesh(new THREE.CubeGeometry(5,10,5), new THREE.MeshBasicMaterial({map: texture}));
    scene.add(wall);
    wall.position.set(i,5,10);
    walls.push(wall);
  }

  window.addEventListener( "keydown", keyDown, false );
  window.addEventListener( "keyup", keyUp, false );
  render();
}

function animate(){
  playerUpdate();
  requestAnimationFrame( animate );
  render();
}

function render() {
  renderer.render( scene, camera );
}

function playerUpdate(){
  if(player.forward){
    console.log(player.oldpos.z + ":" + player.translateZ().position.z);
    if(collid(player)){
      player.translateZ().position.z = player.oldpos.z;
      player.translateZ().position.x = player.oldpos.x;
      console.log(player.oldpos.z + "::" + player.translateZ().position.z);
    }else{
      player.oldpos = player.translateZ().position.clone();;
      player.translateZ(-player.speed);
      console.log(player.oldpos.z + "::" + player.translateZ().position.z);
    };
  }

  if(player.back){
    if(collid(player)){
      player.position = player.oldpos.clone();
    }else{
      player.translateZ(player.speed);
    }
  }


  if(player.left){
    player.rotateY(.1);
  }

  if(player.right){
    player.rotateY(-.1);
  }

}

function createPlayer(){
  //player = camera;
  player = new THREE.Mesh(new THREE.CubeGeometry(5,8,5), new THREE.MeshNormalMaterial());
  scene.add(player);
  player.position.y = 4;
  player.speed = 1;
  player.oldpos = player.position;

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.set(0,4,0);
  player.add(camera); //parent camera to player
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

function grid(size,step){

  var geometry = new THREE.Geometry();
  var material = new THREE.LineBasicMaterial({color: 'green'});   

  for ( var i = - size; i <= size; i += step){
    geometry.vertices.push(new THREE.Vector3( - size, - 0.04, i ));
    geometry.vertices.push(new THREE.Vector3( size, - 0.04, i ));

    geometry.vertices.push(new THREE.Vector3( i, - 0.04, - size ));
    geometry.vertices.push(new THREE.Vector3( i, - 0.04, size ));

  }

  var line = new THREE.Line( geometry, material, THREE.LineSegments);
  scene.add(line);

}

//checks the distance between two object
function check_distance(obj, obj1){
    var DIS = new Object();
    if(obj.position.x > obj1.position.x){
        DIS['x'] = obj.position.x - obj1.position.x;
    }else{
        DIS['x'] = obj1.position.x - obj.position.x;
    }

    if(obj.position.y > obj1.position.y){
        DIS['y'] = obj.position.y - obj1.position.y;
    }else{
        DIS['y'] = obj1.position.y - obj.position.y;
    }

    if(obj.position.z > obj1.position.z){
        DIS['z'] = obj.position.z - obj1.position.z;
    }else{
        DIS['z'] = obj1.position.z - obj.position.z;
    }

    x = Math.max(DIS['x'],DIS['y'],DIS['z']);
    return x;
}

function collid(obj){
  var pos = obj.position.clone();
  for (var vertexIndex = 0; vertexIndex < obj.geometry.vertices.length; vertexIndex++){   
    var localVertex = obj.geometry.vertices[vertexIndex].clone();
    var globalVertex = localVertex.applyMatrix4( obj.matrix );
    var directionVector = globalVertex.sub( obj.position );
    
    var ray = new THREE.Raycaster( pos, directionVector.clone().normalize() );
    var collisionResults = ray.intersectObjects( walls );
    if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ){
      return true;
    }  
  } 
}
