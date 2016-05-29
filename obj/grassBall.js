class grassBall extends sphere {
	constructor(parent,R) {
		super(parent,R,false);
	}

	/**
	 * function that calculate the texture position for each vertice
	 * @param longi
	 * @param lat
	 * @returns {*[]}
     */
	calcTextureCoords(longi,lat){
		return [[10*longi / tetaMax, 10*(90 + lat) / (90 + phiMax)]]
	}

}