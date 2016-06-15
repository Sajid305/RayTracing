// Ray tracer
// Made by Jose Ignacio Gonzalez Cardenas
// 15.06.2016

var canvas;
var gl;


window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.5, 0.5, .60, 1.0 );
    gl.enable(gl.DEPTH_TEST);
    
    
     
    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    
    // Vertices
    //var vBuffer = gl.createBuffer();
    //gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    ///gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
    
    //var vPosition = gl.getAttribLocation( program, "vPosition" );
    //gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    //gl.enableVertexAttribArray( vPosition );

    // Configure buttons to change viewing parameters
    document.getElementById("Button1").onclick = function(){};
    document.getElementById("Button2").onclick = function(){};
    document.getElementById("Button3").onclick = function(){};
    document.getElementById("Button4").onclick = function(){};
    document.getElementById("Button5").onclick = function(){};
    document.getElementById("Button6").onclick = function(){};    
    
    render();
}


var render = function() {
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
          
        gl.drawArrays( gl.TRIANGLES, 0, 0);
        requestAnimFrame(render);
}