
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
		varying float isLigthed;

		void main(void)
		{
			vec4 mvPosition = uMVMatrix * vec4(aVertexPosition, 1.0);
			gl_Position = uPMatrix * mvPosition;
			vTextureCoord = aTextureCoord;
			if (!uUseLighting) {
			    isLigthed = 1.0;
				vLightWeighting = vec3(1.0, 1.0, 1.0);
			} else {
				vec3 lightDirection = normalize(uPointLightingLocation - mvPosition.xyz);

				vec3 transformedNormal = uNMatrix * aVertexNormal;
				isLigthed = dot(transformedNormal, lightDirection);
				float directionalLightWeighting = max(isLigthed, 0.0);
				
				vLightWeighting = uAmbientColor + uPointLightingColor * directionalLightWeighting;;
			}
		}
`;

var shader_fragment_source = `
		precision mediump float;

		varying vec2 vTextureCoord;
		varying vec3 vLightWeighting;
		varying float isLigthed;

		uniform float uAlpha;
		uniform bool uUseBlending;
		uniform bool uDualTex;

		uniform sampler2D uSampler;
		uniform sampler2D uSampler2;

		void main(void)
		{
		    mediump vec4 textureColor;
		    float Ligthed = isLigthed;
		    if(isLigthed<0.0 && uDualTex){
		        Ligthed = -Ligthed;
		    	textureColor = texture2D(uSampler2, vec2(vTextureCoord.s, vTextureCoord.t));
		    }else{
		        textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
		    }
			if(!uUseBlending){
				gl_FragColor = vec4(textureColor.rgb * Ligthed, textureColor.a);
			} else {
				gl_FragColor = vec4(textureColor.rgb * vLightWeighting, textureColor.a * uAlpha);
			}
		}
`;