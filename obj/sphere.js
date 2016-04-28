class sphere extends worldObject{

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
		var nbNormals = [];
		for (var lat = -90; lat <= phiMax; lat += pasLat) {
			for (var longi = 0; longi <= tetaMax; longi += pasLong) {
				vertices = vertices.concat(pol2Cart(longi, lat, R)); //A
				normals = normals.concat([0,0,0]);
				textureCoords = textureCoords.concat(this.calcTextureCoords(longi,lat));
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

		normals = this.calcNormals(normals,vertices,sphereVertexIndices,Ke);


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

	calcTextureCoords(longi,lat){
		return [longi / tetaMax, (90 + lat) / (90 + phiMax)];
	}

	getTriangleNormal(a, b, c) {
		var normal,edge1,edge2;
		edge1 = vec3.subtract(b,a);
		edge2 = vec3.subtract(c,a);
		normal = vec3.cross(edge1,edge2);
		return normal;
	}

	getVertice(vertices,i){
		return [vertices[i*3],vertices[i*3+1],vertices[i*3+2]];
	}

	calcNormals(normals,vertices,VertexIndices,Ke){
		for(var i=0;i<VertexIndices.length*3;i+=3){
			var a = this.getVertice(vertices,VertexIndices[i]);
			var b = this.getVertice(vertices,VertexIndices[i+1]);
			var c = this.getVertice(vertices,VertexIndices[i+2]);
			var norm = this.getTriangleNormal(b,c,a);

			for(var j=0;j<3;j++){

				for(var k=0;k<3;k++){
					normals[VertexIndices[i+j]*3+k]+=norm[k];
				}
			}
		}

		for(var i=0;i<vertices.length/3;i++){
			var norm = this.getVertice(normals,i);
			norm = vec3.normalize(norm);
			normals[i*3]=norm[0]*Ke;
			normals[i*3+1]=norm[1]*Ke;
			normals[i*3+2]=norm[2]*Ke;
		}
		return normals;
	}
}













