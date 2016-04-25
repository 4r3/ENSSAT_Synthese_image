camera.prototype= new worldObject;
function camera(parent)
{
	this.base = worldObject;
	this.base(parent);
	this.skybox = null;
	

	this.oldestParent = null;
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
	mat4.multiply(userCameraMatrix,camera.trans);
	mat4.multiply(mvMatrix,userCameraMatrix);

	//mat4.multiply(mvMatrix, this.trans);
	

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

camera.prototype.translate = function(translation) {
	var derot = mat4.create();
	mat4.identity(derot);

	//mat4.multiply(derot,userRotationMatrix);

	mat4.multiply(derot,translation);
	//console.log(userRotationMatrix);
	//mat4.inverse(derot);



	//console.log(derot);

	mat4.translate(this.trans,[derot[12],derot[13],derot[14]]);


}


