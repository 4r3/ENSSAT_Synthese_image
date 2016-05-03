/**
 * Created by 4r3 on 02/05/16.
 */

var PROJMATRIX_SHADOW=get_projection_ortho(20, 1, 5, 28);
var LIGHTDIR=[-0.5,-0.5,-0.5];
var LIGHTMATRIX=lookAtDir(LIGHTDIR, [0,1,0], [0,0,0]);
var fb;

function initShadowing() {
    fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);

    var rb=gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, rb);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16 , 512, 512);

    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT,
        gl.RENDERBUFFER, rb);

    var texture_rtt=gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture_rtt);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 512, 512,
        0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D, texture_rtt, 0);

    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

function renderShadow() {
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.useProgram(SHADER_PROGRAM_SHADOW);
    toggleShadowShader(true);

    gl.viewport(0.0, 0.0, 512,512);
    gl.clearColor(1.0, 0.0, 0.0, 1.0); //red -> Z=Zfar on the shadow map
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniformMatrix4fv(_PmatrixShadow, false, PROJMATRIX_SHADOW);
    gl.uniformMatrix4fv(_LmatrixShadow, false, LIGHTMATRIX);
    mat4.identity(mvMatrix);
    
    
    rootObject.drawShadow();

    toggleShadowShader(false);
}

function get_projection_ortho(width, a, zMin, zMax) {
    var right=width/2,   //right bound of the projection volume
        left=-width/2,   //left bound of the proj. vol.
        top=(width/a)/2, //top bound
        bottom=-(width/a)/2; //bottom bound

    return [
        2/(right-left),  0 ,             0,          0,
        0,              2/(top-bottom),  0,          0,
        0,               0,           2/(zMax-zMin),  0,
        0,               0,              0,          1
    ];
}

function lookAtDir(direction,up, C) {
    var z=[-direction[0], -direction[1], -direction[2]];

    var x=crossVector(up,z);
    normalizeVector(x);

    //orthogonal vector to (C,z) in the plane(y,u)
    var y=crossVector(z,x); //zx

    return [x[0], y[0], z[0], 0,
        x[1], y[1], z[1], 0,
        x[2], y[2], z[2], 0,
        -(x[0]*C[0]+x[1]*C[1]+x[2]*C[2]),
        -(y[0]*C[0]+y[1]*C[1]+y[2]*C[2]),
        -(z[0]*C[0]+z[1]*C[1]+z[2]*C[2]),
        1];
}

function crossVector(u,v) {
    return [u[1]*v[2]-v[1]*u[2],
        u[2]*v[0]-u[0]*v[2],
        u[0]*v[1]-u[1]*v[0]];
}

function normalizeVector(v) {
    var n=sizeVector(v);
    v[0]/=n; v[1]/=n; v[2]/=n;
}

function sizeVector(v) {
    return Math.sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2]);
}