// Objects definition
// Here the user can modify and add objects and source lights to the scene.

function addObjects() {
    var objects = [];
    
    /// USER CODE GOES HERE
    
    var sphere = new Sphere();
    sphere.position = [0.0, 1.0, 0.0, 1.0];
    sphere.color = [0.5, 0.5, 0.75, 0.75];
    objects.push(sphere);
    
    
    
    
    
    ///
    
    return objects;
}


// Here the user can modify and add source lights to the scene.
function addSourceLights(){
    var lights = [];
    
    /// USER CODE GOES HERE
    var light = new Light();
    light.position = [1.0, 2.0, 0.0, 0.0];
    lights.push(lights); 
    
    
    
    
    
    ///
    
    return lights;
}