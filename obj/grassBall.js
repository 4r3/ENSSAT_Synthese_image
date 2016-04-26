class grassBall extends sphere {
	constructor(parent,R) {
		super(parent,R,false);
	}

	calcTextureCoords(longi,lat){
		return [[10*longi / tetaMax, 10*(90 + lat) / (90 + phiMax)]]
	}

}