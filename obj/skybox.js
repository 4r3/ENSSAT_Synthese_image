class skybox extends cube {
	constructor(parent) {
		super(parent,1);
	}

	draw() {
		if (this.toggled) {
			if (this.texture != null) {
				//gl.activeTexture(this.texture.getbind()); //TODO find how to use
				gl.activeTexture(gl.TEXTURE0);
				gl.bindTexture(gl.TEXTURE_2D, this.texture);
				gl.uniform1i(shaderProgram.samplerUniform, 0);// this.texture.bindNumber);
			}
			
			gl.disable(gl.DEPTH_TEST);

			gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
			gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTextureCoordBuffer);
			gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.vertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalsBuffer);
			gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.vertexNormalsBuffer.itemSize, gl.FLOAT, false, 0, 0);

			gl.uniform1f(shaderProgram.useBlending, false);

			gl.uniform1i(shaderProgram.useLightingUniform, false);

			setMatrixUniforms();

			if (this.vertexIndexBuffer == null) {
				gl.drawArrays(drawStyle, 0, this.vertexPositionBuffer.numItems);
			}
			else {
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
				gl.drawElements(drawStyle, this.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
			}
			gl.enable(gl.DEPTH_TEST);
		}
	}
}