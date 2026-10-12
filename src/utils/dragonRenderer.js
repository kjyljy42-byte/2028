// Prefer GPU transparency so decoding footage does not require CPU pixel readbacks.
export function createDragonRenderer(surface) {
  const gl = surface.getContext("webgl", { alpha:true, premultipliedAlpha:false, antialias:false, depth:false, stencil:false });
  if (gl) {
    function shader(type, source) {
      const value = gl.createShader(type);
      gl.shaderSource(value, source); gl.compileShader(value);
      return value;
    }
    const vertex = shader(gl.VERTEX_SHADER, "attribute vec2 p; varying vec2 uv; void main(){uv=(p+1.0)*0.5;gl_Position=vec4(p,0.0,1.0);}");
    const fragment = shader(gl.FRAGMENT_SHADER, "precision mediump float; varying vec2 uv; uniform sampler2D film; uniform float edge; void main(){vec3 c=texture2D(film,uv).rgb;float v=max(max(c.r,c.g),c.b);float a=smoothstep(0.11,0.275,v);a*=1.0-smoothstep(edge-0.04,edge+0.04,uv.x);gl_FragColor=vec4(c,a);}");
    const program = gl.createProgram(); gl.attachShader(program,vertex); gl.attachShader(program,fragment); gl.linkProgram(program); gl.useProgram(program);
    const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program,"p"); gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
    const texture = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D,texture);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
    const edge = gl.getUniformLocation(program,"edge");
    return {
      resolution:1280,
      draw(source,width,height) {
        if (gl.isContextLost()) return;
        if (surface.width!==width || surface.height!==height) {surface.width=width;surface.height=height;gl.viewport(0,0,width,height);}
        const fade=source.dataset?.tailFade === "true" && Number.isFinite(source.duration) ? Math.max(0,Math.min(1,(source.duration-source.currentTime)/.9)) : 1.1;
        gl.uniform1f(edge,fade);
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,source);
        gl.drawArrays(gl.TRIANGLES,0,6);
      },
      dispose() {gl.deleteTexture(texture);gl.deleteBuffer(buffer);gl.deleteProgram(program);gl.deleteShader(vertex);gl.deleteShader(fragment);},
    };
  }
  const context = surface.getContext("2d",{willReadFrequently:true});
  let previous = -Infinity;
  return {
    resolution:480,
    draw(source,width,height) {
      if (!context) return;
      // Older browsers get a limited-rate fallback, with one static poster while paused.
      const now=performance.now(); if (source.videoWidth && !source.paused && now-previous<80) return; previous=now;
      if(surface.width!==width||surface.height!==height){surface.width=width;surface.height=height;}
      context.drawImage(source,0,0,width,height);
      const pixels=context.getImageData(0,0,width,height),data=pixels.data;
      for(let i=0;i<data.length;i+=4){const v=Math.max(data[i],data[i+1],data[i+2]);data[i+3]=v<28?0:v<70?Math.round((v-28)*255/42):255;
        if(source.dataset?.tailFade === "true" && Number.isFinite(source.duration)){const edge=Math.max(0,Math.min(1,(source.duration-source.currentTime)/.9));const x=(i/4%width)/width;data[i+3]*=Math.max(0,Math.min(1,(edge-x)/.08));}}
      context.putImageData(pixels,0,0);
    },
    dispose(){},
  };
}
