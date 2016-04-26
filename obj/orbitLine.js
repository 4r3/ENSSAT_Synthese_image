orbitLine.prototype= new worldObject;
	function orbitLine(parent, R)
	{
		this.base = worldObject;
		this.base (parent);
		var buffers = this.initBuffers(R);
		this.vertexPositionBuffer = buffers[0];
		this.vertexTextureCoordBuffer = buffers[1];

		this.isOrbitLine = true;

		this.lightinEnabled = false;
	}

	orbitLine.prototype.initBuffers = function(R)
	{
		vertexPositionBuffer = gl.createBuffer();
		vertexTextureCoordBuffer = gl.createBuffer();

		vertices = [];
        textureCoords = [];
		var nbVertice = 0;
		var pasLong = 1;
		for (var longi = 0; longi <= tetaMax; longi += pasLong) {

			vertices = vertices.concat(pol2Cart(longi, 0, R));
			textureCoords = textureCoords.concat([0.5, 0.5]);

			nbVertice++;

		}


		vertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        vertexPositionBuffer.itemSize = 3;
        vertexPositionBuffer.numItems = nbVertice;

		vertexTextureCoordBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexTextureCoordBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
		vertexTextureCoordBuffer.itemSize = 2;
		vertexTextureCoordBuffer.numItems = nbVertice;
		return [vertexPositionBuffer, vertexTextureCoordBuffer];
	}