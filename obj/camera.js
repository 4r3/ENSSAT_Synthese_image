camera.prototype= new worldObject;
function camera(parent)
{
	this.base = worldObject;
	this.base(parent);
	this.skybox = null;
	this.translate([0,0,-15]);
	

	//this.oldestParent = null;
}

camera.prototype.draw = function()
{

	if(this.skybox!=null){
		mvPushMatrix();
		mat4.multiply(mvMatrix,userRotationMatrix);
		this.skybox.draw();
		mvPopMatrix();
	}

	mat4.identity(userCameraMatrix);
	mat4.multiply(userCameraMatrix,userRotationMatrix);
	mat4.multiply(userCameraMatrix,this.trans);
	mat4.multiply(mvMatrix,userCameraMatrix);
	

	//setMatrixUniforms();
/*
	if(parent==null){
		for(var i =0; i< this.children.length; i++)
		{
			this.children[i].draw();
		}
	}else{
		this.oldestParent.draw();
	}*/
}

camera.prototype.animate = function(elapsedTime)
{
	//this.getTransMatrix();
	//mat4.invert(this.trans);
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

worldObject.prototype.translate = function(translation)
{
	var newMatrix = mat4.create();
	mat4.identity(newMatrix);
	mat4.multiply(newMatrix,userRotationMatrix);
	mat4.translate(newMatrix, translation);


	//mat4.
	//console.log(newMatrix);

	//mat4.translate(this.trans,[newMatrix[12],newMatrix[13],newMatrix[14]]);

	mat4.translate(this.trans,translation);

}
/*
worldObject.prototype.rotate = function(rotation, axis)
{
	var newMatrix = mat4.create();
	mat4.identity(newMatrix);
	mat4.rotate(newMatrix, rotation, axis);
	mat4.multiply(newMatrix,this.trans);

	mat4.set(newMatrix,this.trans);
}*/