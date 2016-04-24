camera.prototype= new worldObject;
function camera(parent)
{
	this.base = worldObject;
	this.base(parent);
	this.xyz = mat4.create();

	this.oldestParent = null;
}

camera.prototype.draw = function()
{
	//mat4.multiply(mvMatrix, this.trans);
	

	//setMatrixUniforms();

	if(parent==null){
		for(var i =0; i< this.children.length; i++)
		{
			this.children[i].draw();
		}
	}else{
		this.oldestParent.draw();
	}
}

camera.prototype.animate = function(elapsedTime)
{
	this.getTransMatrix();
	mat4.invert(this.trans);
}

camera.prototype.getTransMatrix = function(parent){
	if(parent.parent=null){
		this.oldestParent = parent;
		mat4.identity(this.trans)
	}else{
		this.getTransMatrix(parent.parent);
	}
	mat4.multiply(this.trans, parent.orbitmat);
	mat4.multiply(this.trans, parent.trans);
}


