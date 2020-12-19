import css from '../css/canvas.css';
import html from '../../canvas.html';
window.addEventListener("load", function(){
  url=sessionStorage.getItem('image')
  if (url === null) {
    window.location.replace(`https://${window.location.hostname}/index.html`)
  }
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const image = new Image();
  image.src = url;
  image.onload = function () {
    canvas.width = this.naturalWidth;
    canvas.height = this.naturalHeight;
    ctx.drawImage(this, 0, 0);
    window.addEventListener("scroll", dropBlackishPixels);
    window.addEventListener("keydown", dripBlackishPixels);
  };

  function dropBlackishPixels() {
    let id = ctx.getImageData(0, 0, canvas.width, canvas.height);
    function draw() {
      for(let i=0; i<id.width; i++) {
        for(let j=id.height; j>=0; j--) {
          if(isGreyish(getPixelXY(id.data,i,j,id.width),200,20)) {
            // Set the pixel below to this value
            if(j !== (id.height -1)) {
              setPixelXY(id.data,i,j+1,getPixelXY(id.data,i,j,id.width), id.width);
            }
            // Now set the current pix
            setPixelXY(id.data,i,j,{
              r: 255,
              g: 255,
              b: 255,
              a: 255
            }, id.width);
          }
        }
      }
      ctx.putImageData( id, 0, 0 );
      window.requestAnimationFrame(draw);
    }
    window.requestAnimationFrame(draw);
  }

  function dripBlackishPixels() {
    let id = ctx.getImageData(0, 0, canvas.width, canvas.height);
    function draw() {
      for(let i=0; i<id.width; i++) {
        for(let j=id.height; j>=0; j--) {
          if(isGreyish(getPixelXY(id.data,i,j,id.width),200,20)) {
            // Set the pixel below to this value
            if(j !== (id.height -1)) {
              setPixelXY(id.data,i,j+1,getPixelXY(id.data,i,j,id.width), id.width);
            }
          }
        }
      }
      ctx.putImageData(id, 0, 0 );
      window.requestAnimationFrame(draw);
    }
    window.requestAnimationFrame(draw);
  }

  function isBlackish(rgba) {
    let threshold = 150;
    if (rgba.r < threshold && rgba.g < threshold && rgba.b < threshold) {
      return true;
    } else {
      return false;
    }
  }

  function isGreyish(rgba,thresholdTotal,varianceThreshold) {
    let average = (rgba.r + rgba.g + rgba.b)/3
    let S = Math.sqrt((Math.pow(rgba.r-average,2) + Math.pow(rgba.g-average,2) + Math.pow(rgba.b-average,2))/2.0)
    if (average < thresholdTotal) {
      if (S < varianceThreshold) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  function setPixelXY(data,x,y,rgba,width) {
    data[4*(x+y*width)] = rgba.r;
    data[4*(x+y*width)+1] = rgba.g;
    data[4*(x+y*width)+2] = rgba.b;
    data[4*(x+y*width)+3] = rgba.a; 
  }

  function getPixelXY(data,x,y,width) {
    return {
      r: data[4*(x+y*width)],
      g: data[4*(x+y*width)+1],
      b: data[4*(x+y*width)+2],
      a: data[4*(x+y*width)+3]
    }
  }
});