// Objects definition
// Here the user can modify and add objects and source lights to the scene.

function addObjects() {
    var objects = [];
    
    /// USER CODE GOES HERE
    
    var sphere = new Sphere();
    sphere.position = [0.0, 1.0, 0.0, 1.0];
    sphere.color = [0.0, 0.5, 0.75, 1.0];
    objects.push(sphere);
    
    
    sphere = new Sphere();
    sphere.position = [1.0, 0.0, 1.0, 1.0];
    sphere.color = [0.75, 0.3, 0.1, 1.0];
    objects.push(sphere);
    
    /*
    sphere = new Sphere();
    sphere.position = [1.0, 3.0, 0.0, 1.0];
    sphere.color = [1.0, 1.0, 0.0, 0.75];
    objects.push(sphere);
    
    sphere = new Sphere();
    sphere.position = [1.0, 1.0, 0.0, 1.0];
    sphere.color = [0.0, 1.0, 0.0, 0.75];
    objects.push(sphere);
    
    sphere = new Sphere();
    sphere.position = [1.0, 1.0, 0.0, 1.0];
    sphere.color = [0.0, 0.0, 0.0, 1.0];
    objects.push(sphere);
    */
    ///
    
    return objects;
}


// Here the user can modify and add source lights to the scene.
function addSourceLights(){
    var lights = [];
    
    /// USER CODE GOES HERE
    var light = new Light();
    light.position = [2.0, 1.0, 0.0, 0.0];
    light.color = [1.0, 1.0, 1.0, 1.0];
    lights.push(light); 
    
    
    
    
    
    ///
    
    return lights;
}