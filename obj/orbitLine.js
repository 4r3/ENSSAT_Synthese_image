class orbitLine extends worldObject {
	/**
	 * constructor of the line object
	 * @param parent
	 * @param R
     */
	constructor(parent, R) {
		super(parent)
		this.initBuffers(R);
	}

	/**
	 * method that create the orbitline vertices
	 * @param R
     */
	initBuffers(R) {
		this.vertexPositionBuffer = gl.createBuffer();
		this.vertexTextureCoordBuffer = gl.createBuffer();

		var vertices = [];
		var textureCoords = [];
		var nbVertice = 0;
		var pasLong = 1;
		for (var longi = 0; longi <= tetaMax; longi += pasLong) {

			vertices = vertices.concat(pol2Cart(longi, 0, R));
			textureCoords = textureCoords.concat([0.5, 0.5]);

			nbVertice++;

		}


		this.vertexPositionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		this.vertexPositionBuffer.itemSize = 3;
		this.vertexPositionBuffer.numItems = nbVertice;

		this.vertexTextureCoordBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTextureCoordBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
		this.vertexTextureCoordBuffer.itemSize = 2;
		this.vertexTextureCoordBuffer.numItems = nbVertice;
	}

	/** function that  draw the orbit line
	 *
	 */
	draw() {
		if (this.toggled) {
			if (this.texture != null) {
				gl.activeTexture(gl.TEXTURE0);
				gl.bindTexture(gl.TEXTURE_2D, this.texture);
				gl.uniform1i(shaderProgram.samplerUniform, 0);
			}

			gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
			gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTextureCoordBuffer);
			gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.vertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

			gl.uniform1f(shaderProgram.useBlending, false);

			gl.uniform1i(shaderProgram.useLightingUniform, false);

			setMatrixUniforms();

			gl.drawArrays(gl.LINE_LOOP, 0, this.vertexPositionBuffer.numItems);

		}
	}
}