
//INITWORLD
function worldObject(parent)
{
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

	this.orbitParam = 0;
	this.revol = 0;

	mat4.identity(this.trans);
	mat4.identity(this.rotation);
	mat4.identity(this.orbitmat);
	if(parent != null) parent.addChild(this);
}

worldObject.prototype.addChild = function(child)
{
	this.children.push(child);
}

worldObject.prototype.translate = function(translation)
{
	mat4.translate(this.trans, translation);
}

worldObject.prototype.orbit = function(rotation, axis)
{
	mat4.rotate(this.orbitmat, rotation, axis);
}

worldObject.prototype.rotate = function(rotation, axis)
{
	mat4.rotate(this.rotation, rotation, axis);
}

worldObject.prototype.scale = function(scale)
{
	mat4.scale(this.trans, scale);
}

worldObject.prototype.draw = function()
{
	if(this.toggled)
	{
		if(this.texture != null)
		{
			//gl.activeTexture(this.texture.getbind()); //TODO find how to use
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, this.texture);
			gl.uniform1i(shaderProgram.samplerUniform, this.texture.bindNumber);
		}

		mvPushMatrix();
		mat4.multiply(mvMatrix, this.orbitmat); //rotate on the rootObject position for orbit simulation
		mat4.multiply(mvMatrix, this.trans);	//place the object at the right distance


		mvPushMatrix();
		mat4.multiply(mvMatrix, this.rotation); // used for the revolution of the object, cancelled after draw


		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTextureCoordBuffer);
		gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.vertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalsBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.vertexNormalsBuffer.itemSize, gl.FLOAT, false, 0, 0);

		var lighting = 1;
		gl.uniform1i(shaderProgram.useLightingUniform, lighting);

		if (lighting) {
			gl.uniform3f(
				shaderProgram.ambientColorUniform,
				parseFloat(0.5),
				parseFloat(0.5),
				parseFloat(0.5)
			);//TODO create vars for ambient light

			var lightingDirection = [
				parseFloat(0),
				parseFloat(1),
				parseFloat(0)
			];//TODO create var for directional light direction

			var adjustedLD = vec3.create();
			vec3.normalize(lightingDirection, adjustedLD);
			vec3.scale(adjustedLD, -1);
			gl.uniform3fv(shaderProgram.lightingDirectionUniform, adjustedLD);

			gl.uniform3f(
				shaderProgram.directionalColorUniform,
				parseFloat(50),
				parseFloat(50),
				parseFloat(50)
			);//TODO create vars for directional light
		}

		setMatrixUniforms();

		if(this.vertexIndexBuffer == null)
		{
			gl.drawArrays(drawStyle, 0, this.vertexPositionBuffer.numItems);
		}
		else
		{
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
			gl.drawElements(drawStyle, this.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
		}
		mvPopMatrix();

		//draws children
		for(var i =0; i< this.children.length; i++)
		{
			this.children[i].draw();
		}
		mvPopMatrix();
	}
}

worldObject.prototype.animate = function(elapsedTime)
{
	//animate children

	for(var i =0; i< this.children.length; i++)
	{

		this.children[i].animate(elapsedTime);
	}
	this.orbit(Kt*this.orbitParam*0.001*elapsedTime,[0,1,0]);
	this.rotate(Kt*this.revol*0.001*elapsedTime,[0,1,0]);
}