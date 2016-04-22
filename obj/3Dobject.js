
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
	this.toggled = true;
	// il faudra sans doute ajouter des choses ici pour gérer les nomales
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
		mat4.multiply(mvMatrix, this.orbitmat);
		mat4.multiply(mvMatrix, this.trans);


		mvPushMatrix();
		mat4.multiply(mvMatrix, this.rotation);


		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTextureCoordBuffer);
		gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.vertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

		// il faudra sans doute ajouter des choses ici pour gérer les nomales
		
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
	//TODO adapt for planet rotation
	//animate children

	for(var i =0; i< this.children.length; i++)
	{

		this.children[i].animate(elapsedTime);
	}
	this.orbit(Kt*this.orbitParam*0.001*elapsedTime,[0,1,0]);
	this.rotate(Kt*this.revol*0.001*elapsedTime,[0,1,0]);
}