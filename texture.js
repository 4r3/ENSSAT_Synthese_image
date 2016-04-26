/**
 * Created by 4r3 on 23/04/16.
 */

function initTextures()
{

    textures[0]=initTexture("./img/stars.jpg");
    initVideo();
    initSpecialTextures(1);


}

function initVideo() {
    video = document.getElementById("video");
    video.addEventListener("canplaythrough", startVideo, true);
    video.addEventListener("ended", videoDone, true);
    video.src = "vids/goat.mp4";

    video.isReady = false;
    video.preload = "auto";

    //video.autoplay = true;
    //video.loop = true;
}

function startVideo() {
    //video.play();
    video.isReady = true;
}

function videoDone() {
    myCamera.skybox.texture = textures[4];
    video.isReady = false;
}

function initSpecialTextures(id){
    textures[id] = gl.createTexture();
    handleSpecialTexture(textures[id]);
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

function updateTexture(id) {
    gl.bindTexture(gl.TEXTURE_2D, textures[id]);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    if (video.isReady) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video);//todo find how to stop errors
    }
}