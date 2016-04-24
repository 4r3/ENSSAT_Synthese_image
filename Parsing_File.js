/**
 * Created by Paul LDP on 24/04/2016.
 */

//Var to read Json File
var req = new XMLHttpRequest();
req.open("GET", "Objects_Solar_System.json", true);
req.onreadystatechange = ReadJsonFile;
req.send(null);

function ReadJsonFile(){
    if (req.readyState == 4)
    {
        var doc = eval('(' + req.responseText + ')');
        console.log(doc.Sun.Radius);
        console.log(doc.Sun.O_Distance);
        console.log(doc.Sun.O_Speed);
        console.log(doc.Sun.Axial_tilt);
        console.log(doc.Sun.Rot_Speed);
        console.log(doc.Sun.Root);
        console.log(doc.Sun.Light_src);
    }
}
