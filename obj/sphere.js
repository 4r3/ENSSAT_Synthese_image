class sphere extends worldObject {

	constructor(parent, R, ligthEmitter = false) {
		super(parent);
		this.isLigthSource = ligthEmitter;
		this.initBuffers(R, ligthEmitter);
	}

	initBuffers(R, ligthEmitter) {
		var Ke = 1;
		if (ligthEmitter) {
			Ke = -1;
		}
		var normals = [];
		var vertices = [];
		var textureCoords = [];
		var nbVertice = 0;
		var sphereVertexIndices = [];
		var nbTriangles = 0;
		var resLat = 0;
		var resLongi = tetaMax / pasLong + 1;
		for (var lat = -90; lat <= phiMax; lat += pasLat) {
			for (var longi = 0; longi <= tetaMax; longi += pasLong) {
				vertices = vertices.concat(pol2Cart(longi, lat, R)); //A
				normals = normals.concat([0, 0, 0]);
				textureCoords = textureCoords.concat(this.calcTextureCoords(longi, lat));
				if (longi != tetaMax) {
					if (lat < phiMax) {
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
			resLat++;
		}

		normals = this.calcNormals(normals, vertices, sphereVertexIndices, Ke);


		this.vertexPositionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		this.vertexPositionBuffer.itemSize = 3;
		this.vertexPositionBuffer.numItems = nbVertice;

		this.vertexIndexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(sphereVertexIndices), gl.STATIC_DRAW);
		this.vertexIndexBuffer.itemSize = 1;
		this.vertexIndexBuffer.numItems = nbTriangles * 3;

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

	calcTextureCoords(longi, lat) {
		return [longi / tetaMax, (90 + lat) / (90 + phiMax)];
	}
}














