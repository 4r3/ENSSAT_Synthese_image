/**
 * Created by 4r3 on 23/04/16.
 */


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

    var shader_vertex_shadowMap=get_shader(shader_vertex_source_shadowMap,
        GL.VERTEX_SHADER, "VERTEX SHADOW");
    var shader_fragment_shadowMap=get_shader(shader_fragment_source_shadowMap,
        GL.FRAGMENT_SHADER, "FRAGMENT SHADOW");

    var SHADER_PROGRAM_SHADOW=GL.createProgram();
    GL.attachShader(SHADER_PROGRAM_SHADOW, shader_vertex_shadowMap);
    GL.attachShader(SHADER_PROGRAM_SHADOW, shader_fragment_shadowMap);

    GL.linkProgram(SHADER_PROGRAM_SHADOW);

    var _PmatrixShadow = GL.getUniformLocation(SHADER_PROGRAM_SHADOW, "Pmatrix");
    var _LmatrixShadow = GL.getUniformLocation(SHADER_PROGRAM_SHADOW, "Lmatrix");

    var _positionShadow = GL.getAttribLocation(SHADER_PROGRAM_SHADOW, "position");
    
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

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);


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