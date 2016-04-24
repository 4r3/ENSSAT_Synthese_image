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

var rTri = 0;
var rSquare = 0;
var rSphere = 0;

var lastTime = 0;
var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;
var currentZoom = 1;

var toggleTriangle = true;
var toggleSquare= true;
var toggleSphere= true;

var camX = 0;
var camZ = 0;
var camHeight = 0;

//world
var objects = [];
var rootObject;
var skybox;

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


//distance in AU
D_earth = 1;
D_moon = 0.00257;
D_venus = 0.723332;

//orbit speed in rad/day

O_earth = 2*Math.PI/365;
O_venus = 2*Math.PI/224.7;
O_moon = 2*Math.PI/27.32;

//revol speed in rad/day
Re_sun = 2*Math.PI/29;
Re_earth = 2*Math.PI;
Re_venus = 2*Math.PI/-243;
Re_moon = O_moon;


//scale factor
Kt=1;
Ks = 1/3;
Ks2 = 100;



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




//TEXTURES



//INITGL


function drawScene()
{
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 1000.0, pMatrix);
    mat4.identity(mvMatrix);

    skybox.draw();

    mat4.rotate(mvMatrix, -camHeight, [1, 0, 0]);

    mat4.translate(mvMatrix, [camX, 0.0, camZ]);
    mat4.translate(mvMatrix, [0, 0.0, -40.0]);

    rootObject.draw();
}

function initWorldObjects()
{
    skybox = new sphere(null,1);
    skybox.texture = textures[4];
    skybox.isSkybox = true;
    skybox.lightinEnabled = 0;


    rootObject = new sphere(null,250*km2AU(R_sun));
    objects.push(rootObject,2);
    rootObject.texture = textures[0];
    rootObject.revol = Re_sun;
    rootObject.alpha = 0.8;
    rootObject.blending = 0;
    rootObject.lightEmitter = 1;

    var earth = initObject(rootObject,R_earth,D_earth,1,O_earth,Re_earth);
    initObject(earth,R_moon,D_moon,2,O_moon,Re_moon);
    initObject(rootObject,R_venus,D_venus,3,O_venus,Re_venus);

    return rootObject;
}

function initObject(parent,radius,distance,textureid,orbitParam,revol){
    var newObject = new sphere(parent,normalizeSize(radius));
    newObject.texture = textures[textureid];
    objects.push(newObject);
    newObject.translate([normalizeSize(AU2km(distance)),0,1]);
    newObject.orbitParam = orbitParam;
    newObject.revol = revol;

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