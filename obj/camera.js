class camera extends worldObject {
	/**
	 * constructor of the camera
	 * @param parent
     */
	constructor(parent) {
		super(parent);
		this.skybox = null;
		this.isDrawing = false;
		this.translate([0,-15,0]);
		this.rotate(Math.PI/2,[1,0,0]);
		this.compRot = mat4.create();

	}

	/**
	 * function that lanch the drawing from the camera position
	 */
	draw() {
		if(!this.isDrawing) {
			this.isDrawing = true;

			mat4.perspective(60, gl.viewportWidth / gl.viewportHeight, 0.1, 1000.0, pMatrix);
			mat4.identity(mvMatrix);


			if (this.skybox != null) {
				mat4.multiply(mvMatrix, this.rotation);
				this.skybox.draw();
			}

			mat4.multiply(mvMatrix, this.trans);

			mat4.multiply(mvMatrix, this.compRot);

			mat4.multiply(mvMatrix, this.orbitmat);


			setMatrixUniforms();

			this.oldestParent.draw();
			this.isDrawing = false;
		}

	}

	/**
	 * replace the camera above the selected object
	 * @param parent
     */
	setParent(parent){
		super.setParent(parent);
		if(parent!=null) {
			this.oldestParent = this.parent;
			while (this.oldestParent.parent != null) {
				this.oldestParent = this.oldestParent.parent;
			}
		}
		mat4.identity(this.trans);
		mat4.identity(this)
		this.translate([0,-15,0]);
		this.rotate(Math.PI/2,[1,0,0]);

	}

	getTransMatrix(parent){
		if(parent==null) {
			mat4.identity(this.orbitmat);
			mat4.identity(this.compRot);
		}
		else {
			this.getTransMatrix(parent.parent);
			mat4.multiply(this.orbitmat, parent.orbitmat);
			mat4.multiply(this.orbitmat, parent.trans);
			mat4.multiply(this.compRot,parent.orbitmat);

		}
	}

	/**
	 * method that update the position of the camera relatively to the rootobject
 	 */
	animate(){
		this.getTransMatrix(this.parent);
		this.orbitmat = mat4.inverse(this.orbitmat);
	}

	translate(translation) {
		this.trans[12] += translation[0];
		this.trans[13] += translation[1];
		this.trans[14] += translation[2];

	}
	
	rotate(rotation, axis) {
		var newMatrix = mat4.create();
		mat4.identity(newMatrix);
		mat4.rotate(newMatrix, rotation, axis);
		mat4.multiply(newMatrix, this.trans);
		mat4.set(newMatrix, this.trans);
	}
}