// @ts-nocheck
/* eslint-disable */
"use client";
// WebGL image dithering mount (vendored shader runtime). Kept close to the
// shipped runtime so the portrait renders pixel-identical; do not reformat.
import * as React from "react";
import { jsx } from "react/jsx-runtime";

const a = React;
const t = { jsx };
    let i = `#version 300 es
precision mediump float;

layout(location = 0) in vec4 a_position;

uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform float u_imageAspectRatio;
uniform float u_originX;
uniform float u_originY;
uniform float u_worldWidth;
uniform float u_worldHeight;
uniform float u_fit;
uniform float u_scale;
uniform float u_rotation;
uniform float u_offsetX;
uniform float u_offsetY;

out vec2 v_objectUV;
out vec2 v_objectBoxSize;
out vec2 v_responsiveUV;
out vec2 v_responsiveBoxGivenSize;
out vec2 v_patternUV;
out vec2 v_patternBoxSize;
out vec2 v_imageUV;

vec3 getBoxSize(float boxRatio, vec2 givenBoxSize) {
  vec2 box = vec2(0.);
  // fit = none
  box.x = boxRatio * min(givenBoxSize.x / boxRatio, givenBoxSize.y);
  float noFitBoxWidth = box.x;
  if (u_fit == 1.) { // fit = contain
    box.x = boxRatio * min(u_resolution.x / boxRatio, u_resolution.y);
  } else if (u_fit == 2.) { // fit = cover
    box.x = boxRatio * max(u_resolution.x / boxRatio, u_resolution.y);
  }
  box.y = box.x / boxRatio;
  return vec3(box, noFitBoxWidth);
}

void main() {
  gl_Position = a_position;

  vec2 uv = gl_Position.xy * .5;
  vec2 boxOrigin = vec2(.5 - u_originX, u_originY - .5);
  vec2 givenBoxSize = vec2(u_worldWidth, u_worldHeight);
  givenBoxSize = max(givenBoxSize, vec2(1.)) * u_pixelRatio;
  float r = u_rotation * 3.14159265358979323846 / 180.;
  mat2 graphicRotation = mat2(cos(r), sin(r), -sin(r), cos(r));
  vec2 graphicOffset = vec2(-u_offsetX, u_offsetY);


  // ===================================================

  float fixedRatio = 1.;
  vec2 fixedRatioBoxGivenSize = vec2(
  (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
  (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
  );

  v_objectBoxSize = getBoxSize(fixedRatio, fixedRatioBoxGivenSize).xy;
  vec2 objectWorldScale = u_resolution.xy / v_objectBoxSize;

  v_objectUV = uv;
  v_objectUV *= objectWorldScale;
  v_objectUV += boxOrigin * (objectWorldScale - 1.);
  v_objectUV += graphicOffset;
  v_objectUV /= u_scale;
  v_objectUV = graphicRotation * v_objectUV;

  // ===================================================

  v_responsiveBoxGivenSize = vec2(
  (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
  (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
  );
  float responsiveRatio = v_responsiveBoxGivenSize.x / v_responsiveBoxGivenSize.y;
  vec2 responsiveBoxSize = getBoxSize(responsiveRatio, v_responsiveBoxGivenSize).xy;
  vec2 responsiveBoxScale = u_resolution.xy / responsiveBoxSize;

  #ifdef ADD_HELPERS
  v_responsiveHelperBox = uv;
  v_responsiveHelperBox *= responsiveBoxScale;
  v_responsiveHelperBox += boxOrigin * (responsiveBoxScale - 1.);
  #endif

  v_responsiveUV = uv;
  v_responsiveUV *= responsiveBoxScale;
  v_responsiveUV += boxOrigin * (responsiveBoxScale - 1.);
  v_responsiveUV += graphicOffset;
  v_responsiveUV /= u_scale;
  v_responsiveUV.x *= responsiveRatio;
  v_responsiveUV = graphicRotation * v_responsiveUV;
  v_responsiveUV.x /= responsiveRatio;

  // ===================================================

  float patternBoxRatio = givenBoxSize.x / givenBoxSize.y;
  vec2 patternBoxGivenSize = vec2(
  (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
  (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
  );
  patternBoxRatio = patternBoxGivenSize.x / patternBoxGivenSize.y;

  vec3 boxSizeData = getBoxSize(patternBoxRatio, patternBoxGivenSize);
  v_patternBoxSize = boxSizeData.xy;
  float patternBoxNoFitBoxWidth = boxSizeData.z;
  vec2 patternBoxScale = u_resolution.xy / v_patternBoxSize;

  v_patternUV = uv;
  v_patternUV += graphicOffset / patternBoxScale;
  v_patternUV += boxOrigin;
  v_patternUV -= boxOrigin / patternBoxScale;
  v_patternUV *= u_resolution.xy;
  v_patternUV /= u_pixelRatio;
  if (u_fit > 0.) {
    v_patternUV *= (patternBoxNoFitBoxWidth / v_patternBoxSize.x);
  }
  v_patternUV /= u_scale;
  v_patternUV = graphicRotation * v_patternUV;
  v_patternUV += boxOrigin / patternBoxScale;
  v_patternUV -= boxOrigin;
  // x100 is a default multiplier between vertex and fragmant shaders
  // we use it to avoid UV presision issues
  v_patternUV *= .01;

  // ===================================================

  vec2 imageBoxSize;
  if (u_fit == 1.) { // contain
    imageBoxSize.x = min(u_resolution.x / u_imageAspectRatio, u_resolution.y) * u_imageAspectRatio;
  } else if (u_fit == 2.) { // cover
    imageBoxSize.x = max(u_resolution.x / u_imageAspectRatio, u_resolution.y) * u_imageAspectRatio;
  } else {
    imageBoxSize.x = min(10.0, 10.0 / u_imageAspectRatio * u_imageAspectRatio);
  }
  imageBoxSize.y = imageBoxSize.x / u_imageAspectRatio;
  vec2 imageBoxScale = u_resolution.xy / imageBoxSize;

  v_imageUV = uv;
  v_imageUV *= imageBoxScale;
  v_imageUV += boxOrigin * (imageBoxScale - 1.);
  v_imageUV += graphicOffset;
  v_imageUV /= u_scale;
  v_imageUV.x *= u_imageAspectRatio;
  v_imageUV = graphicRotation * v_imageUV;
  v_imageUV.x /= u_imageAspectRatio;

  v_imageUV += .5;
  v_imageUV.y = 1. - v_imageUV.y;
}`;
    let n = 8294400;
    class s {
      parentElement;
      canvasElement;
      gl;
      program = null;
      uniformLocations = {};
      fragmentShader;
      rafId = null;
      lastRenderTime = 0;
      currentFrame = 0;
      speed = 0;
      currentSpeed = 0;
      providedUniforms;
      mipmaps = [];
      hasBeenDisposed = !1;
      resolutionChanged = !0;
      textures = new Map();
      minPixelRatio;
      maxPixelCount;
      isSafari = (function () {
        let e = navigator.userAgent.toLowerCase();
        return (
          e.includes("safari") &&
          !e.includes("chrome") &&
          !e.includes("android")
        );
      })();
      uniformCache = {};
      textureUnitMap = new Map();
      ownerDocument;
      constructor(e, t, a, r, i = 0, l = 0, s = 2, o = n, c = []) {
        if (e?.nodeType === 1) this.parentElement = e;
        else
          throw Error("Paper Shaders: parent element must be an HTMLElement");
        if (
          ((this.ownerDocument = e.ownerDocument),
          !this.ownerDocument.querySelector("style[data-paper-shader]"))
        ) {
          const e = this.ownerDocument.createElement("style");
          ((e.innerHTML = d),
            e.setAttribute("data-paper-shader", ""),
            this.ownerDocument.head.prepend(e));
        }
        const C = this.ownerDocument.createElement("canvas");
        ((this.canvasElement = C),
          this.parentElement.prepend(C),
          (this.fragmentShader = t),
          (this.providedUniforms = a),
          (this.mipmaps = c),
          (this.currentFrame = l),
          (this.minPixelRatio = s),
          (this.maxPixelCount = o));
        const u = C.getContext("webgl2", r);
        if (!u)
          throw Error("Paper Shaders: WebGL is not supported in this browser");
        ((this.gl = u),
          this.initProgram(),
          this.setupPositionAttribute(),
          this.setupUniforms(),
          this.setUniformValues(this.providedUniforms),
          this.setupResizeObserver(),
          visualViewport?.addEventListener(
            "resize",
            this.handleVisualViewportChange,
          ),
          this.setupIntersectionObserver(),
          this.setSpeed(i),
          this.parentElement.setAttribute("data-paper-shader", ""),
          (this.parentElement.paperShaderMount = this),
          this.ownerDocument.addEventListener(
            "visibilitychange",
            this.handleDocumentVisibilityChange,
          ));
      }
      initProgram = () => {
        let e = (function (e, t, a) {
          let r = e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.MEDIUM_FLOAT),
            i = r ? r.precision : null;
          i &&
            i < 23 &&
            ((t = t.replace(
              /precision\s+(lowp|mediump)\s+float;/g,
              "precision highp float;",
            )),
            (a = a
              .replace(
                /precision\s+(lowp|mediump)\s+float/g,
                "precision highp float",
              )
              .replace(
                /\b(uniform|varying|attribute)\s+(lowp|mediump)\s+(\w+)/g,
                "$1 highp $3",
              )));
          let l = o(e, e.VERTEX_SHADER, t),
            n = o(e, e.FRAGMENT_SHADER, a);
          if (!l || !n) return null;
          let s = e.createProgram();
          return s
            ? (e.attachShader(s, l),
              e.attachShader(s, n),
              e.linkProgram(s),
              e.getProgramParameter(s, e.LINK_STATUS))
              ? (e.detachShader(s, l),
                e.detachShader(s, n),
                e.deleteShader(l),
                e.deleteShader(n),
                s)
              : (console.error(
                  "Unable to initialize the shader program: " +
                    e.getProgramInfoLog(s),
                ),
                e.deleteProgram(s),
                e.deleteShader(l),
                e.deleteShader(n),
                null)
            : null;
        })(this.gl, i, this.fragmentShader);
        e && (this.program = e);
      };
      setupPositionAttribute = () => {
        let e = this.gl.getAttribLocation(this.program, "a_position"),
          t = this.gl.createBuffer();
        (this.gl.bindBuffer(this.gl.ARRAY_BUFFER, t),
          this.gl.bufferData(
            this.gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
            this.gl.STATIC_DRAW,
          ),
          this.gl.enableVertexAttribArray(e),
          this.gl.vertexAttribPointer(e, 2, this.gl.FLOAT, !1, 0, 0));
      };
      setupUniforms = () => {
        let e = {
          u_time: this.gl.getUniformLocation(this.program, "u_time"),
          u_pixelRatio: this.gl.getUniformLocation(
            this.program,
            "u_pixelRatio",
          ),
          u_resolution: this.gl.getUniformLocation(
            this.program,
            "u_resolution",
          ),
        };
        (Object.entries(this.providedUniforms).forEach(([t, a]) => {
          if (
            ((e[t] = this.gl.getUniformLocation(this.program, t)),
            a instanceof HTMLImageElement)
          ) {
            let a = `${t}AspectRatio`;
            e[a] = this.gl.getUniformLocation(this.program, a);
          }
        }),
          (this.uniformLocations = e));
      };
      renderScale = 1;
      parentWidth = 0;
      parentHeight = 0;
      parentDevicePixelWidth = 0;
      parentDevicePixelHeight = 0;
      devicePixelsSupported = !1;
      intersectionObserver = null;
      isInViewport = !0;
      resizeObserver = null;
      setupResizeObserver = () => {
        ((this.resizeObserver = new ResizeObserver(([e]) => {
          if (e?.borderBoxSize[0]) {
            let t = e.devicePixelContentBoxSize?.[0];
            (void 0 !== t &&
              ((this.devicePixelsSupported = !0),
              (this.parentDevicePixelWidth = t.inlineSize),
              (this.parentDevicePixelHeight = t.blockSize)),
              (this.parentWidth = e.borderBoxSize[0].inlineSize),
              (this.parentHeight = e.borderBoxSize[0].blockSize));
          }
          this.handleResize();
        })),
          this.resizeObserver.observe(this.parentElement));
      };
      setupIntersectionObserver = () => {
        let e = this.ownerDocument.defaultView;
        e?.IntersectionObserver &&
          ((this.intersectionObserver = new e.IntersectionObserver(([e]) => {
            ((this.isInViewport = e?.isIntersecting ?? !0),
              this.updateCurrentSpeed());
          })),
          this.intersectionObserver.observe(this.parentElement));
      };
      handleVisualViewportChange = () => {
        (this.resizeObserver?.disconnect(), this.setupResizeObserver());
      };
      handleResize = () => {
        let e = 0,
          t = 0,
          a = Math.max(1, window.devicePixelRatio),
          r = visualViewport?.scale ?? 1;
        if (this.devicePixelsSupported) {
          let i = Math.max(1, this.minPixelRatio / a);
          ((e = this.parentDevicePixelWidth * i * r),
            (t = this.parentDevicePixelHeight * i * r));
        } else {
          var i;
          let l,
            n,
            s = Math.max(a, this.minPixelRatio) * r;
          (this.isSafari &&
            (s *= Math.max(
              1,
              ((i = this.ownerDocument),
              (n = Math.round(
                100 *
                  (l =
                    outerWidth /
                    ((visualViewport?.scale ?? 1) *
                      (visualViewport?.width ?? window.innerWidth) +
                      (window.innerWidth - i.documentElement.clientWidth))),
              )) %
                5 ==
              0
                ? n / 100
                : 33 === n
                  ? 1 / 3
                  : 67 === n
                    ? 2 / 3
                    : 133 === n
                      ? 4 / 3
                      : l),
            )),
            (e = Math.round(this.parentWidth) * s),
            (t = Math.round(this.parentHeight) * s));
        }
        let l = Math.min(1, Math.sqrt(this.maxPixelCount) / Math.sqrt(e * t)),
          n = Math.round(e * l),
          s = Math.round(t * l),
          o = n / Math.round(this.parentWidth);
        (this.canvasElement.width !== n ||
          this.canvasElement.height !== s ||
          this.renderScale !== o) &&
          ((this.renderScale = o),
          (this.canvasElement.width = n),
          (this.canvasElement.height = s),
          (this.resolutionChanged = !0),
          this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height),
          this.render(performance.now()));
      };
      render = (e) => {
        if (this.hasBeenDisposed) return;
        if (null === this.program)
          return void console.warn(
            "Tried to render before program or gl was initialized",
          );
        let t = e - this.lastRenderTime;
        ((this.lastRenderTime = e),
          0 !== this.currentSpeed &&
            (this.currentFrame += t * this.currentSpeed),
          this.gl.clear(this.gl.COLOR_BUFFER_BIT),
          this.gl.useProgram(this.program),
          this.gl.uniform1f(
            this.uniformLocations.u_time,
            0.001 * this.currentFrame,
          ),
          this.resolutionChanged &&
            (this.gl.uniform2f(
              this.uniformLocations.u_resolution,
              this.gl.canvas.width,
              this.gl.canvas.height,
            ),
            this.gl.uniform1f(
              this.uniformLocations.u_pixelRatio,
              this.renderScale,
            ),
            (this.resolutionChanged = !1)),
          this.gl.drawArrays(this.gl.TRIANGLES, 0, 6),
          0 !== this.currentSpeed ? this.requestRender() : (this.rafId = null));
      };
      requestRender = () => {
        (null !== this.rafId && cancelAnimationFrame(this.rafId),
          (this.rafId = requestAnimationFrame(this.render)));
      };
      setTextureUniform = (e, t) => {
        if (!t.complete || 0 === t.naturalWidth)
          throw Error(
            `Paper Shaders: image for uniform ${e} must be fully loaded`,
          );
        let a = this.textures.get(e);
        (a && this.gl.deleteTexture(a),
          this.textureUnitMap.has(e) ||
            this.textureUnitMap.set(e, this.textureUnitMap.size));
        let r = this.textureUnitMap.get(e);
        this.gl.activeTexture(this.gl.TEXTURE0 + r);
        let i = this.gl.createTexture();
        (this.gl.bindTexture(this.gl.TEXTURE_2D, i),
          this.gl.texParameteri(
            this.gl.TEXTURE_2D,
            this.gl.TEXTURE_WRAP_S,
            this.gl.CLAMP_TO_EDGE,
          ),
          this.gl.texParameteri(
            this.gl.TEXTURE_2D,
            this.gl.TEXTURE_WRAP_T,
            this.gl.CLAMP_TO_EDGE,
          ),
          this.gl.texParameteri(
            this.gl.TEXTURE_2D,
            this.gl.TEXTURE_MIN_FILTER,
            this.gl.LINEAR,
          ),
          this.gl.texParameteri(
            this.gl.TEXTURE_2D,
            this.gl.TEXTURE_MAG_FILTER,
            this.gl.LINEAR,
          ),
          this.gl.texImage2D(
            this.gl.TEXTURE_2D,
            0,
            this.gl.RGBA,
            this.gl.RGBA,
            this.gl.UNSIGNED_BYTE,
            t,
          ),
          this.mipmaps.includes(e) &&
            (this.gl.generateMipmap(this.gl.TEXTURE_2D),
            this.gl.texParameteri(
              this.gl.TEXTURE_2D,
              this.gl.TEXTURE_MIN_FILTER,
              this.gl.LINEAR_MIPMAP_LINEAR,
            )));
        let l = this.gl.getError();
        if (l !== this.gl.NO_ERROR || null === i)
          return void console.error(
            "Paper Shaders: WebGL error when uploading texture:",
            l,
          );
        this.textures.set(e, i);
        let n = this.uniformLocations[e];
        if (n) {
          this.gl.uniform1i(n, r);
          let a = `${e}AspectRatio`,
            i = this.uniformLocations[a];
          if (i) {
            let e = t.naturalWidth / t.naturalHeight;
            this.gl.uniform1f(i, e);
          }
        }
      };
      areUniformValuesEqual = (e, t) =>
        e === t ||
        (!!(Array.isArray(e) && Array.isArray(t)) &&
          e.length === t.length &&
          e.every((e, a) => this.areUniformValuesEqual(e, t[a])));
      setUniformValues = (e) => {
        (this.gl.useProgram(this.program),
          Object.entries(e).forEach(([e, t]) => {
            let a = t;
            if (
              (t instanceof HTMLImageElement &&
                (a = `${t.src.slice(0, 200)}|${t.naturalWidth}x${t.naturalHeight}`),
              this.areUniformValuesEqual(this.uniformCache[e], a))
            )
              return;
            this.uniformCache[e] = a;
            let r = this.uniformLocations[e];
            if (!r)
              return void console.warn(`Uniform location for ${e} not found`);
            if (t instanceof HTMLImageElement) this.setTextureUniform(e, t);
            else if (Array.isArray(t)) {
              let a = null,
                i = null;
              if (void 0 !== t[0] && Array.isArray(t[0])) {
                let r = t[0].length;
                if (!t.every((e) => e.length === r))
                  return void console.warn(
                    `All child arrays must be the same length for ${e}`,
                  );
                ((a = t.flat()), (i = r));
              } else i = (a = t).length;
              switch (i) {
                case 2:
                  this.gl.uniform2fv(r, a);
                  break;
                case 3:
                  this.gl.uniform3fv(r, a);
                  break;
                case 4:
                  this.gl.uniform4fv(r, a);
                  break;
                case 9:
                  this.gl.uniformMatrix3fv(r, !1, a);
                  break;
                case 16:
                  this.gl.uniformMatrix4fv(r, !1, a);
                  break;
                default:
                  console.warn(`Unsupported uniform array length: ${i}`);
              }
            } else
              "number" == typeof t
                ? this.gl.uniform1f(r, t)
                : "boolean" == typeof t
                  ? this.gl.uniform1i(r, +!!t)
                  : console.warn(
                      `Unsupported uniform type for ${e}: ${typeof t}`,
                    );
          }));
      };
      getCurrentFrame = () => this.currentFrame;
      setFrame = (e) => {
        ((this.currentFrame = e),
          (this.lastRenderTime = performance.now()),
          this.render(performance.now()));
      };
      setSpeed = (e = 1) => {
        ((this.speed = e), this.updateCurrentSpeed());
      };
      updateCurrentSpeed = () => {
        this.setCurrentSpeed(
          this.ownerDocument.hidden || !this.isInViewport ? 0 : this.speed,
        );
      };
      setCurrentSpeed = (e) => {
        ((this.currentSpeed = e),
          null === this.rafId &&
            0 !== e &&
            ((this.lastRenderTime = performance.now()),
            (this.rafId = requestAnimationFrame(this.render))),
          null !== this.rafId &&
            0 === e &&
            (cancelAnimationFrame(this.rafId), (this.rafId = null)));
      };
      setMaxPixelCount = (e = n) => {
        ((this.maxPixelCount = e), this.handleResize());
      };
      setMinPixelRatio = (e = 2) => {
        ((this.minPixelRatio = e), this.handleResize());
      };
      setUniforms = (e) => {
        (this.setUniformValues(e),
          (this.providedUniforms = { ...this.providedUniforms, ...e }),
          this.render(performance.now()));
      };
      handleDocumentVisibilityChange = () => {
        this.updateCurrentSpeed();
      };
      dispose = () => {
        ((this.hasBeenDisposed = !0),
          null !== this.rafId &&
            (cancelAnimationFrame(this.rafId), (this.rafId = null)),
          this.gl &&
            this.program &&
            (this.textures.forEach((e) => {
              this.gl.deleteTexture(e);
            }),
            this.textures.clear(),
            this.gl.deleteProgram(this.program),
            (this.program = null),
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null),
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null),
            this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null),
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null),
            this.gl.getError()),
          this.resizeObserver &&
            (this.resizeObserver.disconnect(), (this.resizeObserver = null)),
          this.intersectionObserver &&
            (this.intersectionObserver.disconnect(),
            (this.intersectionObserver = null)),
          visualViewport?.removeEventListener(
            "resize",
            this.handleVisualViewportChange,
          ),
          this.ownerDocument.removeEventListener(
            "visibilitychange",
            this.handleDocumentVisibilityChange,
          ),
          (this.uniformLocations = {}),
          this.canvasElement.remove(),
          delete this.parentElement.paperShaderMount);
      };
    }
    function o(e, t, a) {
      let r = e.createShader(t);
      return r
        ? (e.shaderSource(r, a),
          e.compileShader(r),
          e.getShaderParameter(r, e.COMPILE_STATUS))
          ? r
          : (console.error(
              "An error occurred compiling the shaders: " +
                e.getShaderInfoLog(r),
            ),
            e.deleteShader(r),
            null)
        : null;
    }
    let d = `@layer paper-shaders {
  :where([data-paper-shader]) {
    isolation: isolate;
    position: relative;

    & canvas {
      contain: strict;
      display: block;
      position: absolute;
      inset: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      border-radius: inherit;
      corner-shape: inherit;
    }
  }
}`;
    function h(e) {
      if (e.naturalWidth < 1024 && e.naturalHeight < 1024) {
        if (e.naturalWidth < 1 || e.naturalHeight < 1) return;
        let t = e.naturalWidth / e.naturalHeight;
        ((e.width = Math.round(t > 1 ? 1024 * t : 1024)),
          (e.height = Math.round(t > 1 ? 1024 : 1024 / t)));
      }
    }
    async function m(e) {
      let t = {},
        a = [];
      return (
        Object.entries(e).forEach(([e, r]) => {
          if ("string" == typeof r) {
            let i =
              r ||
              "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
            if (
              !((e) => {
                try {
                  if (e.startsWith("/")) return !0;
                  return (new URL(e), !0);
                } catch {
                  return !1;
                }
              })(i)
            )
              return void console.warn(
                `Uniform "${e}" has invalid URL "${i}". Skipping image loading.`,
              );
            let l = new Promise((a, r) => {
              let l = new Image();
              (((e) => {
                try {
                  if (e.startsWith("/")) return !1;
                  return (
                    new URL(e, window.location.origin).origin !==
                    window.location.origin
                  );
                } catch {
                  return !1;
                }
              })(i) && (l.crossOrigin = "anonymous"),
                (l.onload = () => {
                  (h(l), (t[e] = l), a());
                }),
                (l.onerror = () => {
                  (console.error(
                    `Could not set uniforms. Failed to load image at ${i}`,
                  ),
                    r());
                }),
                (l.src = i));
            });
            a.push(l);
          } else if (r instanceof HTMLImageElement) {
            let i = r.decode().then(() => {
              (h(r), (t[e] = r));
            });
            a.push(i);
          } else t[e] = r;
        }),
        await Promise.all(a),
        t
      );
    }
    let f = (0, a.forwardRef)(function (
      {
        fragmentShader: e,
        uniforms: r,
        webGlContextAttributes: i,
        speed: l = 0,
        frame: n = 0,
        width: o,
        height: d,
        minPixelRatio: c,
        maxPixelCount: C,
        mipmaps: u,
        style: h,
        ...p
      },
      f,
    ) {
      var x;
      let g,
        v,
        [M, y] = (0, a.useState)(!1),
        w = (0, a.useRef)(null),
        E = (0, a.useRef)(null),
        b = (0, a.useRef)(i);
      ((0, a.useEffect)(
        () => (
          (async () => {
            let t = await m(r);
            w.current &&
              !E.current &&
              ((E.current = new s(w.current, e, t, b.current, l, n, c, C, u)),
              y(!0));
          })(),
          () => {
            (E.current?.dispose(), (E.current = null));
          }
        ),
        [e],
      ),
        (0, a.useEffect)(() => {
          let e = !1;
          return (
            (async () => {
              let t = await m(r);
              e || E.current?.setUniforms(t);
            })(),
            () => {
              e = !0;
            }
          );
        }, [r, M]),
        (0, a.useEffect)(() => {
          E.current?.setSpeed(l);
        }, [l, M]),
        (0, a.useEffect)(() => {
          E.current?.setMaxPixelCount(C);
        }, [C, M]),
        (0, a.useEffect)(() => {
          E.current?.setMinPixelRatio(c);
        }, [c, M]),
        (0, a.useEffect)(() => {
          E.current?.setFrame(n);
        }, [n, M]));
      let H =
        ((x = [w, f]),
        (g = a.useRef(void 0)),
        (v = a.useCallback((e) => {
          let t = x.map((t) => {
            if (null != t) {
              if ("function" == typeof t) {
                let a = t(e);
                return "function" == typeof a
                  ? a
                  : () => {
                      t(null);
                    };
              }
              return (
                (t.current = e),
                () => {
                  t.current = null;
                }
              );
            }
          });
          return () => {
            t.forEach((e) => e?.());
          };
        }, x)),
        a.useMemo(
          () =>
            x.every((e) => null == e)
              ? null
              : (e) => {
                  (g.current && (g.current(), (g.current = void 0)),
                    null != e && (g.current = v(e)));
                },
          x,
        ));
      return (0, t.jsx)("div", {
        ref: H,
        style:
          void 0 !== o || void 0 !== d
            ? {
                width: "string" == typeof o && !1 === isNaN(+o) ? +o : o,
                height: "string" == typeof d && !1 === isNaN(+d) ? +d : d,
                ...h,
              }
            : h,
        ...p,
      });
    });
    f.displayName = "ShaderMount";
    let v = `
#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846
`,
      M = `
  float hash21(vec2 p) {
    p = fract(p * vec2(0.3183099, 0.3678794)) + 0.1;
    p += dot(p, p + 19.19);
    return fract(p.x * p.y);
  }
`;
    let w = `#version 300 es
precision mediump float;

uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform float u_originX;
uniform float u_originY;
uniform float u_worldWidth;
uniform float u_worldHeight;
uniform float u_fit;

uniform float u_scale;
uniform float u_rotation;
uniform float u_offsetX;
uniform float u_offsetY;

uniform vec4 u_colorFront;
uniform vec4 u_colorBack;
uniform vec4 u_colorHighlight;

uniform sampler2D u_image;
uniform float u_imageAspectRatio;

uniform float u_type;
uniform float u_pxSize;
uniform bool u_originalColors;
uniform bool u_inverted;
uniform float u_colorSteps;

out vec4 fragColor;


${M}
${v}

float getUvFrame(vec2 uv, vec2 pad) {
  float aa = 0.0001;

  float left   = smoothstep(-pad.x, -pad.x + aa, uv.x);
  float right  = smoothstep(1.0 + pad.x, 1.0 + pad.x - aa, uv.x);
  float bottom = smoothstep(-pad.y, -pad.y + aa, uv.y);
  float top    = smoothstep(1.0 + pad.y, 1.0 + pad.y - aa, uv.y);

  return left * right * bottom * top;
}

vec2 getImageUV(vec2 uv) {
  vec2 boxOrigin = vec2(.5 - u_originX, u_originY - .5);
  float r = u_rotation * PI / 180.;
  mat2 graphicRotation = mat2(cos(r), sin(r), -sin(r), cos(r));
  vec2 graphicOffset = vec2(-u_offsetX, u_offsetY);

  vec2 imageBoxSize;
  if (u_fit == 1.) { // contain
    imageBoxSize.x = min(u_resolution.x / u_imageAspectRatio, u_resolution.y) * u_imageAspectRatio;
  } else if (u_fit == 2.) { // cover
    imageBoxSize.x = max(u_resolution.x / u_imageAspectRatio, u_resolution.y) * u_imageAspectRatio;
  } else {
    imageBoxSize.x = min(10.0, 10.0 / u_imageAspectRatio * u_imageAspectRatio);
  }
  imageBoxSize.y = imageBoxSize.x / u_imageAspectRatio;
  vec2 imageBoxScale = u_resolution.xy / imageBoxSize;

  vec2 imageUV = uv;
  imageUV *= imageBoxScale;
  imageUV += boxOrigin * (imageBoxScale - 1.);
  imageUV += graphicOffset;
  imageUV /= u_scale;
  imageUV.x *= u_imageAspectRatio;
  imageUV = graphicRotation * imageUV;
  imageUV.x /= u_imageAspectRatio;

  imageUV += .5;
  imageUV.y = 1. - imageUV.y;

  return imageUV;
}

const int bayer2x2[4] = int[4](0, 2, 3, 1);
const int bayer4x4[16] = int[16](
0, 8, 2, 10,
12, 4, 14, 6,
3, 11, 1, 9,
15, 7, 13, 5
);

const int bayer8x8[64] = int[64](
0, 32, 8, 40, 2, 34, 10, 42,
48, 16, 56, 24, 50, 18, 58, 26,
12, 44, 4, 36, 14, 46, 6, 38,
60, 28, 52, 20, 62, 30, 54, 22,
3, 35, 11, 43, 1, 33, 9, 41,
51, 19, 59, 27, 49, 17, 57, 25,
15, 47, 7, 39, 13, 45, 5, 37,
63, 31, 55, 23, 61, 29, 53, 21
);

float getBayerValue(vec2 uv, int size) {
  ivec2 pos = ivec2(fract(uv / float(size)) * float(size));
  int index = pos.y * size + pos.x;

  if (size == 2) {
    return float(bayer2x2[index]) / 4.0;
  } else if (size == 4) {
    return float(bayer4x4[index]) / 16.0;
  } else if (size == 8) {
    return float(bayer8x8[index]) / 64.0;
  }
  return 0.0;
}


void main() {

  float pxSize = u_pxSize * u_pixelRatio;
  vec2 pxSizeUV = gl_FragCoord.xy - .5 * u_resolution;
  pxSizeUV /= pxSize;
  vec2 canvasPixelizedUV = (floor(pxSizeUV) + .5) * pxSize;
  vec2 normalizedUV = canvasPixelizedUV / u_resolution;

  vec2 imageUV = getImageUV(normalizedUV);
  vec2 ditheringNoiseUV = canvasPixelizedUV;
  vec4 image = texture(u_image, imageUV);
  float frame = getUvFrame(imageUV, pxSize / u_resolution);

  int type = int(floor(u_type));
  float dithering = 0.0;

  float lum = dot(vec3(.2126, .7152, .0722), image.rgb);
  lum = u_inverted ? (1. - lum) : lum;

  switch (type) {
    case 1: {
      dithering = step(hash21(ditheringNoiseUV), lum);
    } break;
    case 2:
    dithering = getBayerValue(pxSizeUV, 2);
    break;
    case 3:
    dithering = getBayerValue(pxSizeUV, 4);
    break;
    default :
    dithering = getBayerValue(pxSizeUV, 8);
    break;
  }

  float colorSteps = max(floor(u_colorSteps), 1.);
  vec3 color = vec3(0.0);
  float opacity = 1.;

  dithering -= .5;
  float brightness = clamp(lum + dithering / colorSteps, 0.0, 1.0);
  brightness = mix(0.0, brightness, frame);
  brightness = mix(0.0, brightness, image.a);
  float quantLum = floor(brightness * colorSteps + 0.5) / colorSteps;
  quantLum = mix(0.0, quantLum, frame);

  if (u_originalColors == true) {
    vec3 normColor = image.rgb / max(lum, 0.001);
    color = normColor * quantLum;

    float quantAlpha = floor(image.a * colorSteps + 0.5) / colorSteps;
    opacity = mix(quantLum, 1., quantAlpha);
  } else {
    vec3 fgColor = u_colorFront.rgb * u_colorFront.a;
    float fgOpacity = u_colorFront.a;
    vec3 bgColor = u_colorBack.rgb * u_colorBack.a;
    float bgOpacity = u_colorBack.a;
    vec3 hlColor = u_colorHighlight.rgb * u_colorHighlight.a;
    float hlOpacity = u_colorHighlight.a;

    fgColor = mix(fgColor, hlColor, step(1.02 - .02 * u_colorSteps, brightness));
    fgOpacity = mix(fgOpacity, hlOpacity, step(1.02 - .02 * u_colorSteps, brightness));

    color = fgColor * quantLum;
    opacity = fgOpacity * quantLum;
    color += bgColor * (1.0 - opacity);
    opacity += bgOpacity * (1.0 - opacity);
  }

  fragColor = vec4(color, opacity);
}
`;
    function b(e) {
      if (Array.isArray(e))
        return 4 === e.length ? e : 3 === e.length ? [...e, 1] : A;
      if ("string" != typeof e) return A;
      let t,
        a,
        r,
        i = 1;
      if (e.startsWith("#")) {
        var l;
        ((3 === (l = (l = e).replace(/^#/, "")).length || 4 === l.length) &&
          (l = l
            .split("")
            .map((e) => e + e)
            .join("")),
          6 === l.length && (l += "ff"),
          ([t, a, r, i] = /^[0-9a-f]{8}$/i.test(l)
            ? [
                parseInt(l.slice(0, 2), 16) / 255,
                parseInt(l.slice(2, 4), 16) / 255,
                parseInt(l.slice(4, 6), 16) / 255,
                parseInt(l.slice(6, 8), 16) / 255,
              ]
            : (console.warn("Invalid hex color"), A)));
      } else if (e.startsWith("rgb")) {
        let l,
          n = (l = e.match(
            /^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([0-9.]+))?\s*\)$/i,
          ))
            ? [
                parseInt(l[1] ?? "0") / 255,
                parseInt(l[2] ?? "0") / 255,
                parseInt(l[3] ?? "0") / 255,
                void 0 === l[4] ? 1 : parseFloat(l[4]),
              ]
            : null;
        if (null === n) return A;
        [t, a, r, i] = n;
      } else {
        let l;
        if (!e.startsWith("hsl"))
          return (console.error("Unsupported color format", e), A);
        let n = (l = e.match(
          /^hsla?\s*\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(?:,\s*([0-9.]+))?\s*\)$/i,
        ))
          ? [
              parseInt(l[1] ?? "0"),
              parseInt(l[2] ?? "0"),
              parseInt(l[3] ?? "0"),
              void 0 === l[4] ? 1 : parseFloat(l[4]),
            ]
          : null;
        if (null === n) return A;
        [t, a, r, i] = (function (e) {
          let t,
            a,
            r,
            [i, l, n, s] = e,
            o = i / 360,
            d = l / 100,
            c = n / 100;
          if (0 === l) t = a = r = c;
          else {
            let e = (e, t, a) =>
                (a < 0 && (a += 1), a > 1 && (a -= 1), a < 1 / 6)
                  ? e + (t - e) * 6 * a
                  : a < 0.5
                    ? t
                    : a < 2 / 3
                      ? e + (t - e) * (2 / 3 - a) * 6
                      : e,
              i = c < 0.5 ? c * (1 + d) : c + d - c * d,
              l = 2 * c - i;
            ((t = e(l, i, o + 1 / 3)),
              (a = e(l, i, o)),
              (r = e(l, i, o - 1 / 3)));
          }
          return [t, a, r, s];
        })(n);
      }
      return [H(t, 0, 1), H(a, 0, 1), H(r, 0, 1), H(i, 0, 1)];
    }
    let H = (e, t, a) => Math.min(Math.max(e, t), a),
      A = [0.5, 0.5, 0.5, 1];
    let j = {
        fit: "contain",
        scale: 1,
        rotation: 0,
        offsetX: 0,
        offsetY: 0,
        originX: 0.5,
        originY: 0.5,
        worldWidth: 0,
        worldHeight: 0,
      },
      L = { none: 0, contain: 1, cover: 2 };
    let _ = { random: 1, "2x2": 2, "4x4": 3, "8x8": 4 };
    let N = {
        name: "Default",
        params: {
          ...j,
          fit: "cover",
          speed: 0,
          frame: 0,
          colorFront: "#94ffaf",
          colorBack: "#000c38",
          colorHighlight: "#eaff94",
          type: "8x8",
          size: 2,
          colorSteps: 2,
          originalColors: !1,
          inverted: !1,
        },
      },
      z = (0, a.memo)(
        function ({
          speed: e = N.params.speed,
          frame: a = N.params.frame,
          colorFront: r = N.params.colorFront,
          colorBack: i = N.params.colorBack,
          colorHighlight: l = N.params.colorHighlight,
          image: n = "",
          type: s = N.params.type,
          colorSteps: o = N.params.colorSteps,
          originalColors: d = N.params.originalColors,
          inverted: c = N.params.inverted,
          pxSize: C,
          size: u = void 0 === C ? N.params.size : C,
          fit: h = N.params.fit,
          scale: p = N.params.scale,
          rotation: m = N.params.rotation,
          originX: x = N.params.originX,
          originY: g = N.params.originY,
          offsetX: v = N.params.offsetX,
          offsetY: M = N.params.offsetY,
          worldWidth: y = N.params.worldWidth,
          worldHeight: E = N.params.worldHeight,
          ...H
        }) {
          let A = {
            u_image: n,
            u_colorFront: b(r),
            u_colorBack: b(i),
            u_colorHighlight: b(l),
            u_type: _[s],
            u_pxSize: u,
            u_colorSteps: o,
            u_originalColors: d,
            u_inverted: c,
            u_fit: L[h],
            u_rotation: m,
            u_scale: p,
            u_offsetX: v,
            u_offsetY: M,
            u_originX: x,
            u_originY: g,
            u_worldWidth: y,
            u_worldHeight: E,
          };
          return (0, t.jsx)(f, {
            ...H,
            speed: e,
            frame: a,
            fragmentShader: w,
            uniforms: A,
          });
        },
        function (e, t) {
          if (Object.keys(e).length !== Object.keys(t).length) return !1;
          for (let a in e) {
            if ("colors" === a) {
              let a = Array.isArray(e.colors),
                r = Array.isArray(t.colors);
              if (!a || !r) {
                if (!1 === Object.is(e.colors, t.colors)) return !1;
                continue;
              }
              if (
                e.colors?.length !== t.colors?.length ||
                !e.colors?.every((e, a) => e === t.colors?.[a])
              )
                return !1;
              continue;
            }
            if (!1 === Object.is(e[a], t[a])) return !1;
          }
          return !0;
        },
      );

export const ImageDithering = z as unknown as React.ComponentType<Record<string, unknown>>;
