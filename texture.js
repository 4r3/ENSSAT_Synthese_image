/**
 * Created by 4r3 on 23/04/16.
 */

function initTextures()
{

    initTexture(0,"./img/sun.jpg");
    initTexture(1,"./img/earth.jpg");
    initTexture(2,"./img/moon.gif");
    initTexture(3,"./img/venus.jpg");
    initTexture(4,"./img/skybox.jpg");

}

function initTexture(index,src) {
    textures[index] = gl.createTexture();
    textures[index].image = new Image();
    textures[index].image.onload = function()
    {
        handleLoadedTexture(textures[index])
    }
    textures[index].image.src = src;
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