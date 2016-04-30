class camera extends worldObject {
	constructor(parent) {
		super(parent);
		this.skybox = null;
		this.isDrawing = false;
		this.translate([0,-10,0]);
		this.rotate(Math.PI/2,[1,0,0]);

	}

	draw() {
		if(!this.isDrawing) {
			this.isDrawing = true;
			if (this.skybox != null) {
				mvPushMatrix();
				mat4.multiply(mvMatrix, this.rotation);
				//this.skybox.draw();  //TODO uncomment when publish
				mvPopMatrix();
			}

			mat4.multiply(mvMatrix, this.trans);

			mat4.multiply(mvMatrix, this.orbitmat);


			setMatrixUniforms();

			this.oldestParent.draw();
			this.isDrawing = false;
		}

	}

	setParent(parent){
		super.setParent(parent);
		if(parent!=null) {
			this.oldestParent = this.parent;
			while (this.oldestParent.parent != null) {
				this.oldestParent = this.oldestParent.parent;
			}
		}

	}

	getTransMatrix(parent){
		var mat;
		if(parent==null) {
			mat = mat4.create();
			mat4.identity(mat);
		}
		else {
			mat = this.getTransMatrix(parent.parent);
			mat4.multiply(mat, parent.orbitmat);
			mat4.multiply(mat, parent.trans);

		}
		return mat;
	}

	animate(){
		var mat = this.getTransMatrix(this.parent);
		this.orbitmat = mat4.inverse(mat);
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