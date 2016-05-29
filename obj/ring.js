class ring extends worldObject{
	/**
	 * constructor of the ring object, create a transparent ring on the parent
	 *
	 * @param parent
	 * @param Rmn
	 * @param Rmx
     */
	constructor(parent,Rmn,Rmx)
	{
		super(parent);
		this.initBuffers(Rmn,Rmx);
		this.isLigthSource = false;
		this.blending = 1;
		this.alpha = 50;
	}

	/**
	 * method that create the ring vertices,normals, and index
	 * @param Rmn
	 * @param Rmx
     */
	initBuffers(Rmn,Rmx)
	{
		this.vertexPositionBuffer = gl.createBuffer();
		this.vertexTextureCoordBuffer = gl.createBuffer();
		this.vertexIndexBuffer = gl.createBuffer();

		var vertices = [];
        var textureCoords = [];
		var normals = [];
		var nbVertice = 0;
		var sphereVertexIndices = [];
		var nbTriangles = 0;
		var pasLong = 3;
		var resLongi = tetaMax/pasLong+1;
		var pasR=(Rmx-Rmn)/2;

		for(var R = Rmn; R<=Rmx; R+=pasR) {
			for (var longi = 0; longi <= tetaMax; longi += pasLong) {
				vertices = vertices.concat(pol2Cart(longi, 0, R)); //A
				normals = normals.concat([0, 0, 0]);

				textureCoords = textureCoords.concat(this.calcTextureCoords(longi,R,Rmn,Rmx));
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

		normals = this.calcNormals(normals,vertices, sphereVertexIndices, 1);


		this.vertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		this.vertexPositionBuffer.itemSize = 3;
		this.vertexPositionBuffer.numItems = nbVertice;

		this.vertexIndexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(sphereVertexIndices), gl.STATIC_DRAW);
		this.vertexIndexBuffer.itemSize = 1;
		this.vertexIndexBuffer.numItems = nbTriangles*3;

		this.vertexTextureCoordBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTextureCoordBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
		this.vertexTextureCoordBuffer.itemSize = 2;
		this.vertexTextureCoordBuffer.numItems = nbVertice;

		this.vertexNormalsBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalsBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
		this.vertexNormalsBuffer.itemSize = 3;
		this.vertexNormalsBuffer.numItem = nbVertice;
	}

	/**
	 * function that calculate the texture coordinates for the passed position
	 * @param longi
	 * @param R
	 * @param Rmn
	 * @param Rmx
     * @returns {*[]}
     */
	calcTextureCoords(longi,R,Rmn,Rmx){
		return [1-((Rmx-R) / (Rmx - Rmn)),30*longi / tetaMax];
	}
	
}