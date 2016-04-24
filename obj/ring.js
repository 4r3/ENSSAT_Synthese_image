ring.prototype= new worldObject;
	function ring(parent,Rmn,Rmx)
	{
		this.base = worldObject;
		this.base (parent);
		var buffers = this.initBuffers(Rmn,Rmx);
		//this.vertexPositionBuffer = this.initVertexPositionBuffer();
		//this.vertexTextureCoordBuffer = this.initTextureCoordPositionBuffer();
		this.vertexPositionBuffer = buffers[0];
		this.vertexTextureCoordBuffer = buffers[1];
		this.vertexIndexBuffer = buffers[2];
	}

	ring.prototype.initBuffers = function(Rmn,Rmx)
	{
		vertexPositionBuffer = gl.createBuffer();
		vertexTextureCoordBuffer = gl.createBuffer();
		vertexIndexBuffer = gl.createBuffer();

		vertices = [];
        textureCoords = [];
		var nbVertice = 0;
		var sphereVertexIndices = [];
		var nbTriangles = 0;
		var resLongi = tetaMax/pasLong+1;
		var pasR=(Rmx-Rmn)/1;

		for(var R = Rmn; R<=Rmx; R+=pasR) {
			for (var longi = 0; longi <= tetaMax; longi += pasLong) {
				vertices = vertices.concat(pol2Cart(longi, 0, Rmn)); //A

				textureCoords = textureCoords.concat([longi / tetaMax, (R - Rmn) / (Rmx - Rmn)]);
				if (longi != tetaMax) {
					if (R < Rmx) {
						sphereVertexIndices = sphereVertexIndices.concat([
							nbVertice,
							nbVertice + 1,
							nbVertice + 1 + resLongi,

							nbVertice,
							nbVertice + 1 + resLongi,
							nbVertice + resLongi,
						]);

						nbTriangles += 2;
					}
				}
				nbVertice += 1;
			}
		}


		vertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        vertexPositionBuffer.itemSize = 3;
        vertexPositionBuffer.numItems = nbVertice;

		vertexIndexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(sphereVertexIndices), gl.STATIC_DRAW);
		vertexIndexBuffer.itemSize = 1;
		vertexIndexBuffer.numItems = nbTriangles*3;

		vertexTextureCoordBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexTextureCoordBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
		vertexTextureCoordBuffer.itemSize = 2;
		vertexTextureCoordBuffer.numItems = nbVertice;
		return [vertexPositionBuffer, vertexTextureCoordBuffer, vertexIndexBuffer];
	}