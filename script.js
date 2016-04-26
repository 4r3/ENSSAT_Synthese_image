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
var textures =[];

//interaction
var drawStyle;

var userRotationMatrix = mat4.create();
mat4.identity(userRotationMatrix);

var userCameraMatrix = mat4.create();


var myCamera = new camera(null);

var lastTime = 0;
var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;
var currentZoom = 1;

var toggleTriangle = true;
var toggleSquare= true;
var toggleSphere= true;

var camX = 0;
var camY = 0;
var camZ = 0;

//world
var rootObject;
var tempSkybox;

//geometry
var pasLat = 3;
var pasLong = 6;
var tetaMax = 360;
var phiMax = 90;


//radius in km
R_skybox = 1;
R_sun = 696342;
R_earth = 6378;
R_moon = 1737;
R_venus = 6051;
R_mercury = 2439.7;


//distance in AU
D_earth = 1;
D_moon = 0.00257;
D_venus = 0.723332;
D_mercury = 0.387;

//orbit speed in rad/day

O_earth = 2*Math.PI/365;
O_venus = 2*Math.PI/224.7;
O_moon = 2*Math.PI/27.32;
O_mercury = 2*Math.PI/ 87.96934;

//revol speed in rad/day
Re_sun = 2*Math.PI/29;
Re_earth = 2*Math.PI;
Re_venus = 2*Math.PI/-243;
Re_moon = O_moon;
Re_mercury = 58.6462;

//textures sources
tex_sun="./img/sun.jpg";
tex_earth="./img/earth.jpg";
tex_moon="./img/moon.gif";
tex_venus="./img/venus.jpg";
tex_mercury="./img/mercury.jpg";


//scale factor
Kt=1;
Ks = 1/2;
Ks2 = 1000;



//SHADERS
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


function drawScene()
{
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(60, gl.viewportWidth / gl.viewportHeight, 0.1, 1000.0, pMatrix);
    mat4.identity(mvMatrix);

    myCamera.draw();

    setMatrixUniforms();

    rootObject.draw();
}

function initWorldObjects()
{

    var myskybox = new skybox(null);
    myskybox.texture = textures[0];

    myCamera.skybox = myskybox;

    rootObject = new sphere(null,250*km2AU(R_sun),true);
    rootObject.texture = initTexture(tex_sun);
    rootObject.revol = Re_sun;

    var earth = initObject(rootObject,R_earth,D_earth,tex_earth,O_earth,Re_earth);
    initObject(earth,R_moon,D_moon,tex_moon,O_moon,Re_moon);
    initObject(rootObject,R_venus,D_venus,tex_venus,O_venus,Re_venus);
    initObject(rootObject,R_mercury,D_mercury,tex_mercury,O_mercury,Re_mercury);

    return rootObject;
}

function initObject(parent,radius,distance,texture_src,orbitParam,revol){
    var newObject = new sphere(parent,normalizeSize(radius));
    newObject.texture = initTexture(texture_src);
    newObject.translate([normalizeSize(AU2km(distance)),0,0]);
    newObject.orbitParam = orbitParam;
    newObject.revol = revol;

    var OrbitObject = new orbitLine(parent,normalizeSize(AU2km(distance)));
    OrbitObject.texture = newObject.texture;

    return newObject;
}

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

function tick() {
    requestAnimFrame(tick);
    drawScene();
    animate();

    //updateTexture(6);

}

function webGLStart() {

    var canvas = document.getElementById("lesson03-canvas");

    //webGL
    initGL(canvas);
    initShaders();
    initTextures();
    rootObject = initWorldObjects();

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