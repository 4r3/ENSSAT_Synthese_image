/**
 * Created by 4r3 on 23/04/16.
 */

function degToRad(degrees)
{
    return degrees * Math.PI / 180;
}


function pol2Cart(longi, lat,R)
{
    return [
        R*Math.cos(degToRad(lat))*Math.sin(degToRad(longi)),
        R*Math.sin(degToRad(lat)),
        R*Math.cos(degToRad(lat))*Math.cos(degToRad(longi))
    ];
}

function AU2km(Au) {
    return Au * 149597870.7;
}

function km2AU(km) {
    return km / 149597870.7;
}

function normalizeSize(km) {
    return Math.pow(km,Ks)/Ks2;
}