// Ray tracer
// Made by Jose Ignacio Gonzalez Cardenas
// 15.06.2016

var canvas;
var gl;

var sceneHandler;

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
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
        
        
        
    sceneHandler = new SceneHandler();
    sceneHandler.init();
    
    // Add objects to scene via external file
    sceneHandler.objects = addObjects();
    sceneHandler.lights = addSourceLights();
    
    sceneHandler.buildObjects();
    sceneHandler.buildLights();    



    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    configureButtons();   
    
    render();
}


function render() {
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        //rebuild and draw the scene
        sceneHandler.buildObjects();
        sceneHandler.draw();
        
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
		this.lightMaterialsTexture = gl.createTexture();     // For colors
    }
    
    //TODO
    this.buildObjects = function() {
       
    }
    
    //TODO
    this.buildLights = function() {
        
    }
    
    // TODO
    this.draw = function() {
        
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