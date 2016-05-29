
class worldObject {
	/**
	 * worldObject constructor, will initialise all the field of the object
	 * @param parent
     */
	constructor(parent) {
		this.parent = null;
		this.trans = mat4.create();
		this.rotation = mat4.create();
		this.orbitmat = mat4.create();

		this.children = [];
		this.vertexPositionBuffer = null;
		this.vertexTextureCoordBuffer = null;
		this.vertexIndexBuffer = null;
		this.vertexNormalsBuffer = null;
		this.toggled = true;
		this.texture = null;
		this.texture2 = null;

		this.isLigthSource = true;
		this.lightinEnabled = 1;
		this.blending = 0;
		this.alpha = 1;
		
		this.orbitParam = 0;
		this.revol = 0;
		this.angle=[0,0,0];

		mat4.identity(this.trans);
		mat4.identity(this.rotation);
		mat4.identity(this.orbitmat);

		this.setParent(parent);

	}

	/**
	 * method that add a a child to the world object
	 * @param child
     */
	addChild(child) {
		this.children.push(child);
	}

	/**
	 * method that remove a child to the object
	 * @param child
     */
	remChild(child){
		var index = this.children.indexOf(child);
		if(index > -1){
			this.children.splice(index, 1);
		}
	}

	/**
	 * method that set the parent of a function
	 * @param parent
     */
	setParent(parent){
		if(this.parent!=null){
			this.parent.remChild(this);
		}
		this.parent = parent;
		if(parent!=null){
			parent.addChild(this);
		}
	}

	translate(translation) {
		mat4.translate(this.trans, translation);
	}

	/**
	 * method that manage the revolution of the object on around his parent
	 * @param rotation
	 * @param axis
     */
	orbit(rotation, axis) {
		mat4.rotate(this.orbitmat, rotation, axis);
	}

	/**
	 * method that manage the boct rotation on it's axis
	 * @param rotation
	 * @param axis
     */
	rotate(rotation, axis) {
		mat4.rotate(this.rotation, rotation, axis);
	}

	scale(scale) {
		mat4.scale(this.trans, scale);
	}

	/**
	 * function that draw the object
	 */
	draw() {
		if (this.toggled) {
			//if a texture is set, then we will use it
			// else the program will use the last used texture
			if (this.texture != null) {
				gl.activeTexture(gl.TEXTURE0);
				gl.bindTexture(gl.TEXTURE_2D, this.texture);
				gl.uniform1i(shaderProgram.samplerUniform, 0);
			}

			//if a second texture is set then dual texturing will be used
			//else the second texture will be the same that the first
			if (this.texture2 == null){
				gl.uniform1i(shaderProgram.dualTex,0);
				gl.uniform1i(shaderProgram.sampler2Uniform, 0);
			}else {
				gl.uniform1i(shaderProgram.dualTex,1);
				gl.activeTexture(gl.TEXTURE1);
				gl.bindTexture(gl.TEXTURE_2D, this.texture2);
				gl.uniform1i(shaderProgram.sampler2Uniform, 1);
			}
			mvPushMatrix();
			mat4.multiply(mvMatrix, this.orbitmat); //rotate on the rootObject position for orbit simulation
			mat4.multiply(mvMatrix, this.trans);	//place the object at the right distance


			var invOrb = mat4.create();
			mat4.set(this.orbitmat,invOrb);
			invOrb = mat4.inverse(invOrb);
			mat4.multiply(mvMatrix,invOrb);

			//rotation axis of the planet
			mat4.rotateX(mvMatrix,this.angle[0]*Math.PI/180);
			mat4.rotateY(mvMatrix,this.angle[1]*Math.PI/180);
			mat4.rotateZ(mvMatrix,this.angle[2]*Math.PI/180);

			mvPushMatrix();
			mat4.multiply(mvMatrix, this.rotation); // used for the revolution of the object, cancelled after draw

			gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
			gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTextureCoordBuffer);
			gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.vertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

			//transparency management
			gl.uniform1f(shaderProgram.useBlending, this.blending);
			if (this.blending) {
				gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
				gl.enable(gl.BLEND);
				gl.disable(gl.DEPTH_TEST);
				gl.uniform1f(shaderProgram.alphaUniform, this.alpha);
			} else {
				gl.disable(gl.BLEND);
				gl.enable(gl.DEPTH_TEST);
				gl.enable(gl.DEPTH_TEST);
			}


			//lighting management
			gl.uniform1i(shaderProgram.useLightingUniform, this.lightinEnabled);
			if (this.lightinEnabled) {
				gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalsBuffer);
				gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.vertexNormalsBuffer.itemSize, gl.FLOAT, false, 0, 0);
			}

			// if the object is a light source then the wrogram will
			// declare a light source in its position
			if (this.isLigthSource) {

				//uniform ligth intensity
				gl.uniform3f(
					shaderProgram.ambientColorUniform,
					0.5,
					0.5,
					0.5
				);

				//light position
				gl.uniform3f(
					shaderProgram.pointLightingLocationUniform,
					mvMatrix[12],
					mvMatrix[13],
					mvMatrix[14]
				);

				//light intensity
				gl.uniform3f(
					shaderProgram.pointLightingColorUniform,
					1,
					1,
					1
				);
			}

			setMatrixUniforms();

			if (this.vertexIndexBuffer == null) {
				gl.drawArrays(drawStyle, 0, this.vertexPositionBuffer.numItems);
			}
			else {
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
				gl.drawElements(drawStyle, this.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
			}
			mvPopMatrix();

			//draws children
			for (var i = 0; i < this.children.length; i++) {
				this.children[i].draw();
			}
			mvPopMatrix();
		}
	}

	/**
	 * method tha calculade the normal between 3 points in the 3d space
	 * @param a
	 * @param b
	 * @param c
     * @returns {vec3|*}
     */
	getTriangleNormal(a, b, c) {
		var normal,edge1,edge2;
		edge1 = vec3.subtract(b,a);
		edge2 = vec3.subtract(c,a);
		normal = vec3.cross(edge1,edge2);
		return normal;
	}

	/**
	 * method that return the point in the 3d space at the i position in the vertice array
	 * @param vertices
	 * @param i
	 * @returns {*[]}
     */
	getVertice(vertices,i){
		return [vertices[i*3],vertices[i*3+1],vertices[i*3+2]];
	}

	/**
	 * method that calculate the normals for all the points of the vertice buffer
	 * @param normals
	 * @param vertices
	 * @param VertexIndices
	 * @param Ke
     * @returns {*}
     */
	calcNormals(normals,vertices,VertexIndices,Ke){
		for(var i=0;i<VertexIndices.length*3;i+=3){
			var a = this.getVertice(vertices,VertexIndices[i]);
			var b = this.getVertice(vertices,VertexIndices[i+1]);
			var c = this.getVertice(vertices,VertexIndices[i+2]);
			var norm = this.getTriangleNormal(b,c,a);

			for(var j=0;j<3;j++){

				for(var k=0;k<3;k++){
					normals[VertexIndices[i+j]*3+k]+=norm[k];
				}
			}
		}

		for(var i=0;i<vertices.length/3;i++){
			var norm = this.getVertice(normals,i);
			norm = vec3.normalize(norm);
			normals[i*3]=norm[0]*Ke;
			normals[i*3+1]=norm[1]*Ke;
			normals[i*3+2]=norm[2]*Ke;
		}
		return normals;
	}

	/**
	 * method that calculate the next position of the planet from the last time
	 * @param elapsedTime
     */
	animate(elapsedTime) {
		//animate children

		for (var i = 0; i < this.children.length; i++) {

			this.children[i].animate(elapsedTime);
		}
		this.orbit(Kt * this.orbitParam * 0.001 * elapsedTime, [0, 1, 0]);
		this.rotate(Kt * this.revol * 0.001 * elapsedTime, [0, 1, 0]);
	}
}