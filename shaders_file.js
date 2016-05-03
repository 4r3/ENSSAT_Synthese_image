
var shader_vertex_source = `
    attribute vec3 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec2 aTextureCoord;
    
    uniform mat4 uMVMatrix;
    uniform mat4 uPMatrix;
    uniform mat3 uNMatrix;
    
    uniform vec3 uAmbientColor;
    
    uniform vec3 uPointLightingLocation;
    uniform vec3 uPointLightingColor;
    
    uniform bool uUseLighting;
    
    varying vec2 vTextureCoord;
    varying vec3 vLightWeighting;
    
    void main(void)
    {
        vec4 mvPosition = uMVMatrix * vec4(aVertexPosition, 1.0);
        gl_Position = uPMatrix * mvPosition;
        vTextureCoord = aTextureCoord;
        if (!uUseLighting) {
            vLightWeighting = vec3(1.0, 1.0, 1.0);
        } else {
            vec3 lightDirection = normalize(uPointLightingLocation - mvPosition.xyz);
    
            vec3 transformedNormal = uNMatrix * aVertexNormal;
            float directionalLightWeighting = max(dot(transformedNormal, lightDirection), 0.0);
            vLightWeighting = uAmbientColor + uPointLightingColor * directionalLightWeighting;;
        }
    }
`;

var shader_fragment_source = `
    precision mediump float;
    
    varying vec2 vTextureCoord;
    varying vec3 vLightWeighting;
    
    uniform float uAlpha;
    uniform bool uUseBlending;
    
    uniform sampler2D uSampler;
    
    void main(void)
    {
        mediump vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
        if(!uUseBlending){
            gl_FragColor = vec4(textureColor.rgb * vLightWeighting, textureColor.a);
        } else {
            gl_FragColor = vec4(textureColor.rgb * vLightWeighting, textureColor.a * uAlpha);
        }
    }
`;

var shader_vertex_source_shadowMap= `
    attribute vec3 position;
    uniform mat4 Pmatrix, Lmatrix;
    varying float vDepth;
    
    void main(void) {
        vec4 position = Pmatrix * Lmatrix * vec4( position , 1.0);
        float zBuf=position.z/position.w; //Z-buffer between -1 and 1
        vDepth=0.5+zBuf*0.5; //between 0 and 1
        gl_Position=position;
    }
`;

var shader_fragment_source_shadowMap= `
    precision mediump float;
    varying float vDepth;
    
    void main(void) {
        gl_FragColor=vec4(vDepth, 0.,0.,1.);
    }
`;