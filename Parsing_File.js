/**
 * Created by Paul LDP on 24/04/2016.
 */
var req;
//Var to read Json File

/**
 * function that launch the loading of the json file where all system data is defined
 */
function initWorld() {
    req = new XMLHttpRequest();
    req.open("GET", "Objects_Solar_System.json", false);
    req.onreadystatechange = CreateUniverse;
    req.send(null);
}
/**
 * function call on load of the json file, parse it's datas and create the associated objects
 * position the camera on the root object a the end of the procedure
 *
 * @constructor
 */
function CreateUniverse(){

    if (req.readyState == 4)
    {
        var doc = JSON.parse(req.responseText);

        var myskybox = new skybox(null);
        myskybox.texture = initTexture("./img/stars.jpg");
        myCamera.skybox = myskybox;

        rootObject = parsing(doc,null);


        var myAsteroid = new asteroid(rootObject,normalizeSize(2439.7));
        myAsteroid.translate([normalizeSize(AU2km(0.387/2)),0,0]);
        myAsteroid.texture = initTexture("./img/asteroid.jpg");
        myAsteroid.revol = 2*Math.PI/29;

        planets['X-4242']=myAsteroid;


        var x = document.getElementById("camAnchor");
        var option = document.createElement("option");
        option.text = 'X-4242';
        x.add(option, x[1]);


        var myring = new ring(planets['Saturn'],normalizeSize(66900),normalizeSize(483000));
        myring.texture = initTexture("./img/ring2.jpg");
        myring.translate([0,0,0]);

        myCamera.setParent(rootObject);
    }
}

/**
 * function that create all the planet and suns, this function will parse the data at
 * the doc level and create an object with the specified parent
 *
 * @param doc
 * @param parent
 * @returns {sphere}
 */
function parsing(doc,parent) {
    var newObject = new sphere(parent,normalizeSize(doc.Radius),doc.light_src);
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

    planets[doc.Name]=newObject;

    for(var i=0; i<doc.Children.length;i++){
        parsing(doc.Children[i],newObject);
    }



    var x = document.getElementById("camAnchor");
    var option = document.createElement("option");
    option.text = doc.Name;
    x.add(option, x[0]);
    x.selectedIndex = "0";

    return newObject;
}