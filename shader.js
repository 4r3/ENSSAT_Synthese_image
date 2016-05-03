/**
 * Created by 4r3 on 23/04/16.
 */


var _positionShadow;
var _LmatrixShadow;
var _PmatrixShadow;
var _MVmatrixShadow;
var SHADER_PROGRAM_SHADOW;


var get_shader=function(source, type, typeString) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("ERROR IN "+typeString+ " SHADER : " + gl.getShaderInfoLog(shader));
        return false;
    }
    return shader;
};

function initShaders()
{
    //Create shadow shaders
    var shader_vertex_shadowMap=get_shader(shader_vertex_source_shadowMap,
        gl.VERTEX_SHADER, "VERTEX SHADOW");
    var shader_fragment_shadowMap=get_shader(shader_fragment_source_shadowMap,
        gl.FRAGMENT_SHADER, "FRAGMENT SHADOW");

    SHADER_PROGRAM_SHADOW = gl.createProgram();
    gl.attachShader(SHADER_PROGRAM_SHADOW, shader_vertex_shadowMap);
    gl.attachShader(SHADER_PROGRAM_SHADOW, shader_fragment_shadowMap);

    gl.linkProgram(SHADER_PROGRAM_SHADOW);

    if (!gl.getProgramParameter(SHADER_PROGRAM_SHADOW, gl.LINK_STATUS))
    {
        alert("Could not initialise shadow shaders");
    }

    _PmatrixShadow = gl.getUniformLocation(SHADER_PROGRAM_SHADOW, "Pmatrix");
    _LmatrixShadow = gl.getUniformLocation(SHADER_PROGRAM_SHADOW, "Lmatrix");
    _MVmatrixShadow = gl.getUniformLocation(SHADER_PROGRAM_SHADOW, "MVMatrix");

    _positionShadow = gl.getAttribLocation(SHADER_PROGRAM_SHADOW, "position");

    //Creater nomals shaders
    var vertexShader=get_shader(shader_vertex_source, gl.VERTEX_SHADER, "VERTEX");
    var fragmentShader=get_shader(shader_fragment_source, gl.FRAGMENT_SHADER, "FRAGMENT");

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
    {
        alert("Could not initialise shaders");
    }

    //gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");

    shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");

    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
    shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");

    //lighting
    shaderProgram.useLightingUniform = gl.getUniformLocation(shaderProgram, "uUseLighting");
    shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor");
    shaderProgram.pointLightingLocationUniform = gl.getUniformLocation(shaderProgram, "uPointLightingLocation");
    shaderProgram.pointLightingColorUniform = gl.getUniformLocation(shaderProgram, "uPointLightingColor");

    //transparency
    shaderProgram.alphaUniform = gl.getUniformLocation(shaderProgram, "uAlpha");
    shaderProgram.useBlending = gl.getUniformLocation(shaderProgram, "uUseBlending");
}

function toggleNormalShader(state) {
    if(state){
        gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
        gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    }else{
        gl.disableVertexAttribArray(shaderProgram.vertexNormalAttribute);
        gl.disableVertexAttribArray(shaderProgram.textureCoordAttribute);
        gl.disableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    }


}

function toggleShadowShader(state) {
    if(state){
        gl.enableVertexAttribArray(_positionShadow);
    }else{
        gl.disableVertexAttribArray(_positionShadow);
    }
}

function mvPushMatrix()
{
    var copy = mat4.create();
    mat4.set(mvMatrix, copy);
    mvMatrixStack.push(copy);
}

function mvPopMatrix()
{
    if (mvMatrixStack.length == 0)
    {
        throw "Invalid popMatrix!";
    }
    mvMatrix = mvMatrixStack.pop();
}

function setMatrixUniforms()
{
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

    var normalMatrix = mat3.create();
    mat4.toInverseMat3(mvMatrix, normalMatrix);
    mat3.transpose(normalMatrix);
    gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);

}