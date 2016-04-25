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

    mat4.multiply(newRotationMatrix, userRotationMatrix, userRotationMatrix);

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
    //console.log(event.keyCode);
    event.preventDefault();
    var transmat = mat4.create();
    mat4.identity(transmat);
    //mat4.multiply(transmat,userRotationMatrix);
    switch(event.keyCode)
    {
        case 37: //left
            mat4.translate(transmat,[1,0,0]);
            camera.translate(transmat);
            camX++;
            break;
        case 39: //right
            camX--;
            mat4.translate(transmat,[-1,0,0]);
            camera.translate(transmat);
            break;
        case 38: //down
            camZ++;
            mat4.translate(transmat,[0,0,1]);
            camera.translate(transmat);
            break;
        case 40: //forward
            camZ--;
            mat4.translate(transmat,[0,0,-1]);
            camera.translate(transmat);
            break;
        case 33: //pageUp
            mat4.translate(transmat,[0,1,0]);
            camera.translate(transmat);
            camY++;
            break;
        case 34: //pageDown
            mat4.translate(transmat,[0,-1,0]);
            camera.translate(transmat);
            camY--;
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

function handleClick(checkMesh)
{
    switch(checkMesh.value)
    {
        case 'triangle':
            toggleTriangle = checkMesh.checked;
            break;
        case 'cube':
            toggleSquare = checkMesh.checked;
            break;
        case 'sphere':
            toggleSphere = checkMesh.checked;
            break;
        default:
    }
}

function handleSlider1(sliderValue)
{
    Kt = sliderValue;
}