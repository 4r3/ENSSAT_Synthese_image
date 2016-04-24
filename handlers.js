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
    switch(event.keyCode)
    {
        case 37: //left
            camX++;
            break;
        case 39: //right
            camX--;
            break;
        case 38: //down
            camZ++;
            break;
        case 40: //forward
            camZ--;
            break;
        case 33: //pageUp
            camY++;
            break;
        case 34: //pageDown
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
        case 'square':
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
    //console.log(sliderValue);
}