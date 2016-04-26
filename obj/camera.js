camera.prototype= new worldObject;
function camera(parent)
{
	this.base = worldObject;
	this.base(parent);
	this.skybox = null;
	this.translate([0,-15,0]);
	this.rotate(Math.PI/2,[1,0,0]);
	

	//this.oldestParent = null;
}

camera.prototype.draw = function()
{

	if(this.skybox!=null){
		mvPushMatrix();
		mat4.multiply(mvMatrix,this.rotation);
		this.skybox.draw();
		mvPopMatrix();
	}

	mat4.multiply(mvMatrix,this.trans);
	

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

camera.prototype.translate = function(translation)
{
	this.trans[12]+=translation[0];
	this.trans[13]+=translation[1];
	this.trans[14]+=translation[2];

}

camera.prototype.rotate = function(rotation, axis)
{
	var newMatrix = mat4.create();
	mat4.identity(newMatrix);
	mat4.rotate(newMatrix, rotation, axis);
	mat4.multiply(newMatrix,this.trans);

	mat4.set(newMatrix,this.trans);
}