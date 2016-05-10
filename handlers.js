function handleMouseDown(event) {
    mouseDown = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
}

function handleMouseUp(event) {
    mouseDown = false;
}

function handleMouseMove(event)
{
    if (!mouseDown) {
        return;
    }
    var newX = event.clientX;
    var newY = event.clientY;


    var newRotationMatrix = mat4.create();
    mat4.identity(newRotationMatrix);

    var deltaX = newX - lastMouseX;
    mat4.rotate(newRotationMatrix, degToRad(deltaX / 7), [0, 1, 0]);

    var deltaY = newY - lastMouseY;
    mat4.rotate(newRotationMatrix, degToRad(deltaY / 7), [1, 0, 0]);

    myCamera.rotate(degToRad(deltaY / 7), [1, 0, 0]);
    myCamera.rotate(degToRad(deltaX / 7), [0, 1, 0]);

    mat4.multiply(newRotationMatrix, myCamera.rotation, myCamera.rotation);

    lastMouseX = newX;
    lastMouseY = newY;

}

function handleWheel(event)
{
    event.preventDefault();
    currentZoom*=1+(event.wheelDelta/Math.abs(event.wheelDelta))/10;
}

function handleKeyDown(event)
{
    event.preventDefault();
    var transmat = mat4.create();
    mat4.identity(transmat);
    switch(event.keyCode)
    {
        case 37: //left
            myCamera.translate([0.1,0,0]);
            break;
        case 39: //right
            myCamera.translate([-0.1,0,0]);
            break;
        case 38: //down
            myCamera.translate([0,0,0.1]);
            break;
        case 40: //forward
            myCamera.translate([0,0,-0.1]);
            break;
        case 33: //pageUp
            myCamera.translate([0,-0.1,0]);
            break;
        case 34: //pageDown
            myCamera.translate([0,0.1,0]);
            break;
        case 116:
            window.location.reload();
            break;

        default:

    }

}


function drawCombo(list)
{
    drawStyle = list.selectedIndex;
}

function handleSlider1(sliderValue)
{
    Kt = sliderValue;
}

function surprise() {
    tempSkybox = myCamera.skybox.texture;
    myCamera.skybox.texture = videoTexture;
    video.play();
}

function setCamera(pos){
    var sel = pos.options[pos.selectedIndex].text;
    myCamera.setParent(planets[sel]);
}