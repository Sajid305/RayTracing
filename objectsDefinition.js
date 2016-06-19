// Objects definition
// Here the user can modify and add objects and source lights to the scene.

function addObjects() {
    var objects = [];
    
    /// USER CODE GOES HERE
    
    var sphere;
    
    for(var i = 0; i < 4; i++) {
        for(var j = 0; j < 4; j++ ){
            for(var k = 0; k < 4; k++ ){
                sphere = new Sphere();
                sphere.position = [i, j, k, .3];
                sphere.color = [i / 4, j / 4, k / 4, 1.0];
                sphere.material = [0.5, 0.75, 0.0, 0.0];
                objects.push(sphere);
            
            }
        }
    }
    
    
    return objects;
}


// Here the user can modify and add source lights to the scene.
function addSourceLights(){
    var lights = [];
    
    /// USER CODE GOES HERE

     var light = new Light();
    light.position = [2.0, 2.0, -5.0, 0.0];
    light.color = [1.0, 1.0, 1.0, 1.0];
    lights.push(light); 
    
    
    ///
    
    return lights;
}