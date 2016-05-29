/**
 * Created by 4r3 on 20/04/16.
 */
//GLOBALS
var gl;
var shaderProgram;

var mvMatrix = mat4.create();
var mvMatrixStack = [];
var pMatrix = mat4.create();

//textures
var videoTexture;

//interaction
var drawStyle;

var myCamera = new camera(null);

var lastTime = 0;
var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;
var currentZoom = 1;

//world
var rootObject;
var tempSkybox;
var planets = [];

//geometry
var pasLat = 3;
var pasLong = 6;
var tetaMax = 360;
var phiMax = 90;




//scale factor
Kt=1;
Ks = 1/2;
Ks2 = 1000;


/**
 * function that initialise a webGl context
 * @param canvas
 */
function initGL(canvas)
{
    try
    {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {}
    if (!gl)
    {
        alert("Could not initialise WebGL, sorry :-(");
    }
}




//INITGL

/**
 * fonction that initialise the draw of the scene from the camera point of view
 */
function drawScene()
{
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    myCamera.draw();
}

/**
 * funtion that compute the quantity of animation to do and which start the animation
 * computation for the scene objects
 */
function animate()
{
    var timeNow = new Date().getTime();
    var elapsed = 0;
    if (lastTime != 0)
    {
        elapsed = timeNow - lastTime;
    }
    rootObject.animate(elapsed);
    lastTime = timeNow;
}

/**
 * animation loop, this function call itself to animate and draw the scene
 */
function tick() {
    requestAnimFrame(tick);
    drawScene();
    animate();

    updateTexture();
}

/**
 * function that is called to initialize the script, it will init the web gl context,
 * the shaders, the textures and the objects of the scene and the user action handlers
 */
function webGLStart() {

    var canvas = document.getElementById("lesson03-canvas");

    //webGL
    initGL(canvas);
    initShaders();
    initTextures();

    rootObject = null;
    initWorld();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    //interactions
    canvas.onmousedown = handleMouseDown;
    document.onmouseup = handleMouseUp;
    document.onmousemove = handleMouseMove;
    canvas.onmousewheel = handleWheel;
    window.addEventListener("keydown", handleKeyDown, false);
    drawStyle = gl.TRIANGLES;
    tick();
}