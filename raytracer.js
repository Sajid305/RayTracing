// Ray tracer
// Made by Jose Ignacio Gonzalez Cardenas
// 15.06.2016

var canvas;
var gl;
var program;

var sceneHandler;
var shadersLocations;

window.onload = function init() {
    // Initialize WebGl 
    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    // Initialize canvas    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.5, 0.5, .5, 1.0 );
    //gl.enable(gl.DEPTH_TEST);
    
    
    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    shadersLocations = new ShadersLocations();
    shadersLocations.getLocations();
            
    sceneHandler = new SceneHandler();
    sceneHandler.init();
        
        
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray(vPosition );
    
    
    // Add objects to scene via external file
    sceneHandler.objects = addObjects();
    sceneHandler.lights = addSourceLights();
    
    sceneHandler.buildObjects();
    sceneHandler.buildLights();    


    configureButtons();   
    
    render();
}


function render() {
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        //rebuild and drawScene the scene
        //sceneHandler.buildObjects();
        //sceneHandler.drawScene();
        
        requestAnimFrame(render);
        gl.drawArrays( gl.TRIANGLE_STRIP, 0, sceneHandler.vertexBuffer.numItems );
}

// Create scene handler
// Scene holder will contain the objects and lights, 
// and is going to send them to the shaders on request
function SceneHandler(){
    this.objects = [];
    this.lights = [];
    
    // Why textures? Because that's the way the objects and lights are going to be sent to the GPU
    this.init = function() {
        this.initVertexBuffer();
        this.initObjectTextures();
        this.initLightTextures();
        
        // Build canvas
        vertices = [];
        vertices.push( vec2(-1.0, 1.0) ); 
        vertices.push( vec2(-1.0, -1.0) ); 
        vertices.push( vec2(1.0, 1 )); 
        vertices.push( vec2(1.0, -1.0) ); 
			
		gl.bindBuffer(gl.ARRAY_BUFFER,this.vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER,flatten(vertices),gl.STATIC_DRAW);
    }
    
    // Init vertex buffer
    this.initVertexBuffer = function() {
        this.vertexBuffer = gl.createBuffer();
        this.vertexBuffer.itemSize = 2;
        this.vertexBuffer.numItems = 4;
    }
    
    // Init textures where the properties of objects reside
    this.initObjectTextures = function() {
        this.objectsTexture = gl.createTexture();                // For indices and types
        this.objectPositionsTexture = gl.createTexture();      // For positions
		this.objectColorsTexture = gl.createTexture();        // For colors
		this.objectMaterialsTexture = gl.createTexture(); // For coefficients
    }
    
    // Init textures where lights and their properties reside
    this.initLightTextures = function() {
        this.lightsTexture = gl.createTexture();             // For positions
		this.lightColorsTexture = gl.createTexture();     // For colors
    }
    
    
    // Re-structure the objects in the scene, and construct the textures that are going to be send to fragment shader
    this.buildObjects = function() {
       	
        // Separate objects in different attributes and properties   
		var objectList = [];
		var objectPositions = [];
		var objectColors = [];
		var objectMaterials = [];
		
		// Go through each object and populate lists of the type, the position and size, the color, and material properties
		for(i = 0 ; i < this.objects.length ; i++)
		{
			objectList = objectList.concat([i,this.objects[i].type,0,0]);
			objectPositions = objectPositions.concat(this.objects[i].position);
			objectColors = objectColors.concat(this.objects[i].color);
			objectMaterials = objectMaterials.concat(this.objects[i].material);
		}

		// Determine the minimum power of two texture size that we need to store this information in the texture
        // WebGL doesn't like non-power-of-two textures :'(
		sizeList = Math.pow(2.0, Math.ceil(Math.log(this.objects.length)/(2.0*Math.log(2.0))));
			
		// Fill the rest with zeros, so WebGL is happy about it.
        // SizeList^2 because the texture is a 2D square
		for(i = 0 ; i < sizeList*sizeList - this.objects.length ; i++)
		{
			objectList = objectList.concat([0,0,0,0]);
			objectPositions = objectPositions.concat([0.0,0.0,0.0,0.0]);
			objectColors = objectColors.concat([0.0,0.0,0.0,0.0]);
			objectMaterials = objectMaterials.concat([0.0,0.0,0.0,0.0]);
		}

    	// Create and bind the textures
        // Preparte data to be send to GPU
    	gl.bindTexture(gl.TEXTURE_2D, this.objectsTexture);
    	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, sizeList, sizeList, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(objectList));
    	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    	
    	gl.bindTexture(gl.TEXTURE_2D, this.objectPositionsTexture);
    	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, sizeList, sizeList, 0, gl.RGBA, gl.FLOAT, new Float32Array(objectPositions));
    	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    	
    	gl.bindTexture(gl.TEXTURE_2D, this.objectColorsTexture);
    	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, sizeList, sizeList, 0, gl.RGBA, gl.FLOAT, new Float32Array(objectColors));
    	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    	
    	gl.bindTexture(gl.TEXTURE_2D, this.objectMaterialsTexture);
    	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, sizeList, sizeList, 0, gl.RGBA, gl.FLOAT, new Float32Array(objectMaterials));
    	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    	
    	gl.bindTexture(gl.TEXTURE_2D,null);
    }
    
    // Same as objects but with lights
    this.buildLights = function() {
        
        // My lists of position and colors
		var lightPositions = [];
		var lightColors = [];

        // Populate lists
		for(i = 0 ; i < this.lights.length ; i++)
		{
			lightPositions = lightPositions.concat(this.lights[i].position);
			lightColors = lightColors.concat(this.lights[i].color);
		}
		
        // Fill textures with zeros, until sqrt(size) is a power of 2
		sizeList = Math.pow(2.0,Math.ceil(Math.log(this.lights.length)/(2.0*Math.log(2.0))));
		
		for(i = 0 ; i < sizeList*sizeList - this.lights.length ; i++)
		{
			lightPositions = lightPositions.concat([0,0,0,0]);
			lightColors = lightColors.concat([0.0,0.0,0.0,0.0]);
		}
		
        // Bind textures and prepare data to be send to GPU		
    	gl.bindTexture(gl.TEXTURE_2D, this.lightsTexture);
    	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, sizeList, sizeList, 0, gl.RGBA, gl.FLOAT, new Float32Array(lightPositions));
    	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    	
    	gl.bindTexture(gl.TEXTURE_2D, this.lightColorsTexture);
    	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, sizeList, sizeList, 0, gl.RGBA, gl.FLOAT, new Float32Array(lightColors));
    	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    	
    	gl.bindTexture(gl.TEXTURE_2D,null);
    }
    
    // Bind the appropiate textures and send them to the shaders! Bye textures!
    this.drawScene = function() {
        gl.bindBuffer(gl.ARRAY_BUFFER,this.vertexBuffer);
		//gl.vertexAttribPointer(shadersLocations.vertexPositionAttribute,this.vertexBuffer.itemSize,gl.FLOAT,false,0,0);
		
		gl.activeTexture(gl.TEXTURE0);
    	gl.bindTexture(gl.TEXTURE_2D, this.objectsTexture);
    	gl.uniform1i(shadersLocations.objects, 0);
    	
    	gl.activeTexture(gl.TEXTURE1);
    	gl.bindTexture(gl.TEXTURE_2D, this.objectPositionsTexture);
    	gl.uniform1i(shadersLocations.objectPositions, 1);
    	
    	gl.activeTexture(gl.TEXTURE2);
    	gl.bindTexture(gl.TEXTURE_2D, this.objectColorsTexture);
    	gl.uniform1i(shadersLocations.objectColors, 2);
    	
    	gl.activeTexture(gl.TEXTURE3);
    	gl.bindTexture(gl.TEXTURE_2D, this.objectMaterialsTexture);
    	gl.uniform1i(shadersLocations.objectMaterials, 3);
    	
    	gl.activeTexture(gl.TEXTURE4);
    	gl.bindTexture(gl.TEXTURE_2D, this.lightsTexture);
    	gl.uniform1i(shadersLocations.lightPositions, 4);
    	
    	gl.activeTexture(gl.TEXTURE5);
    	gl.bindTexture(gl.TEXTURE_2D, this.lightColorsTexture);
    	gl.uniform1i(shadersLocations.lightColors, 5);
    	
    	gl.uniform1i(shadersLocations.numObjects,this.objects.length);
    	gl.uniform1i(shadersLocations.numLights,this.lights.length);
    	gl.uniform1f(shadersLocations.objectTextureSize,Math.pow(2.0,Math.ceil(Math.log(this.objects.length)/(2.0*Math.log(2.0)))));
    	gl.uniform1f(shadersLocations.lightTextureSize,Math.pow(2.0,Math.ceil(Math.log(this.lights.length)/(2.0*Math.log(2.0)))));
    }
    
    return this;   
}

// Obtain the location of the variables in the shaders

function ShadersLocations(){
    this.getLocations = function (params) {

        this.resolution = gl.getUniformLocation(program,"resolution");
        gl.uniform2f(this.resolution,gl.viewportWidth,gl.viewportHeight);
        
        this.objects = gl.getUniformLocation(program,"objects");
        this.objectPositions = gl.getUniformLocation(program,"objectPositions");
        this.objectColors = gl.getUniformLocation(program,"objectColors");
        this.objectMaterials = gl.getUniformLocation(program,"objectMaterials");
        
        this.lightPositions = gl.getUniformLocation(program,"lightPositions");
        this.lightColors = gl.getUniformLocation(program,"lightColors");
        
        this.numObjects = gl.getUniformLocation(program,"numObjects");
        this.numLights = gl.getUniformLocation(program,"numLights");
        this.objectTextureSize = gl.getUniformLocation(program,"objectTextureSize");
        this.lightTextureSize = gl.getUniformLocation(program,"lightTextureSize");
        
    }
    return this;
}

// Configure buttons to change viewing parameters
function configureButtons(){
    document.getElementById("Button1").onclick = function(){};
    document.getElementById("Button2").onclick = function(){};
    document.getElementById("Button3").onclick = function(){};
    document.getElementById("Button4").onclick = function(){};
    document.getElementById("Button5").onclick = function(){};
    document.getElementById("Button6").onclick = function(){}; 
}