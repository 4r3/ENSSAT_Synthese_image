/**
 * Created by 4r3 on 23/04/16.
 */

function initTextures()
{
    initVideo();
    initSpecialTextures();
}

function initVideo() {
    video = document.getElementById("video");
    video.addEventListener("canplaythrough", startVideo, true);
    video.addEventListener("ended", videoDone, true);
    video.src = "vids/goat.mp4";

    video.isReady = false;
    video.preload = "auto";
}

function startVideo() {
    //video.play();
    video.isReady = true;
}

function videoDone() {
    myCamera.skybox.texture = tempSkybox;
    video.isReady = false;
}

function initSpecialTextures(){
    videoTexture = gl.createTexture();
    handleSpecialTexture(videoTexture);
}

function initTexture(src) {
    var texture = gl.createTexture();
    texture.image = new Image();
    texture.image.onload = function()
    {
        handleLoadedTexture(texture)
    }
    texture.image.src = src;
    return texture;
}

function handleLoadedTexture(texture)
{
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
}

function handleSpecialTexture(texture){
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
}

function updateTexture() {
    gl.bindTexture(gl.TEXTURE_2D, videoTexture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    if (video.isReady) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video);//todo find how to stop errors
    }
}