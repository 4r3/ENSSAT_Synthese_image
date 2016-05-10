/**
 * Created by Paul LDP on 24/04/2016.
 */
var req;
//Var to read Json File
function initWorld() {
    req = new XMLHttpRequest();
    req.open("GET", "Objects_Solar_System.json", true);
    req.onreadystatechange = CreateUniverse;
    req.send(null);
}

function CreateUniverse(){

    if (req.readyState == 4)
    {
        var doc = JSON.parse(req.responseText);

        var myskybox = new skybox(null);
        myskybox.texture = initTexture("./img/stars.jpg");
        myCamera.skybox = myskybox;

        rootObject = parsing(doc,null);

        //TODO add in the json
        var myAsteroid = new asteroid(rootObject,normalizeSize(2439.7));
        myAsteroid.translate([normalizeSize(AU2km(0.387/2)),0,0]);
        myAsteroid.texture = initTexture("./img/asteroid.jpg");
        myAsteroid.revol = 2*Math.PI/29;

        var myring = new ring(rootObject,normalizeSize(696342),2*normalizeSize(696342));
        myring.texture = initTexture("./img/ring2.jpg");
        myring.translate([0,0,0]);

        myCamera.setParent(rootObject);
    }
}


function parsing(doc,parent) {
    console.log(doc);
    var newObject = new sphere(parent,normalizeSize(doc["Radius"]),doc.light_src);
    newObject.texture = initTexture(doc.Texture);

    if(doc.Texture2 != null){
        newObject.texture2 = initTexture(doc.Texture2);
    }

    newObject.angle=[0,0,doc.Tilt];

    if(doc.O_Speed != null && doc.O_Speed != 0){
        newObject.orbitParam = Math.PI*2/doc.O_Speed;
    }

    if(doc.Rot_Speed != null && doc.Rot_Speed != 0){
        newObject.revol = Math.PI*2/doc.Rot_Speed;
    }

    if(doc.O_Distance != null){
        newObject.translate([normalizeSize(AU2km(doc.O_Distance)),0,0]);
    }

    if(parent!=null){
        var OrbitObject = new orbitLine(parent,normalizeSize(AU2km(doc.O_Distance)));
        OrbitObject.texture = newObject.texture;
    }

    for(var i=0; i<doc.Children.length;i++){
        parsing(doc.Children[i],newObject);
    }

    return newObject;
}