import cropperjs from 'cropperjs'
import html from './templates/main.html'

import './styles/index.scss'

const name = 'jinie'

var cropper, callback

var defaultConfig = {
    maxSize: 0, // In bytes, e.g. 10000000
    aspectRatio: 0, // e.g. 1.2
    icon: false, // Outputs .png file
  },
  config = {},
  processing = false

const main = {
  setDropArea: (selector, _callback = () => {}, _config = {}) => {
    const el =
      typeof selector === 'string' ? document.querySelector(selector) : selector
    if (!el) return

    _config = Object.assign(defaultConfig, _config)

    const className = 'active'

    el.ondrag = (e) => {
      e.preventDefault()
      e.stopPropagation()
    }
    el.ondragstart = (e) => {
      e.preventDefault()
      e.stopPropagation()
    }
    el.ondragend = (e) => {
      e.preventDefault()
      e.stopPropagation()
      el.classList.remove(className)
    }
    el.ondragover = (e) => {
      e.preventDefault()
      e.stopPropagation()
      el.classList.add(className)
    }
    el.ondragenter = (e) => {
      e.preventDefault()
      e.stopPropagation()
      el.classList.add(className)
    }
    el.ondragleave = (e) => {
      e.preventDefault()
      e.stopPropagation()
      el.classList.remove(className)
    }
    el.ondrop = (e) => {
      e.preventDefault()
      e.stopPropagation()
      el.classList.remove(className)

      setVars({ _config, _callback })

      getImage(e.dataTransfer.files[0])
    }
    el.onclick = () => {
      setVars({ _config, _callback })

      inputEL.click()
    }
  },
}

const setVars = ({ _config, _callback }) => {
  config = _config
  callback = _callback
}

const init = () => {
  if (!document.querySelector('#' + name)) {
    document.body.appendChild(
      new DOMParser().parseFromString(html, 'text/html').body.childNodes[0]
    )
    addListeners()
  }

  if (config.aspectRatio) {
    el.square().remove()
    el.aspectRatio().parentElement.remove()
  }

  if (config.maxSize) el.maxSize().parentElement.remove()
}

// To close editor
const close = () => {
  cropper.destroy()
  inputEL.value = null
  el.main().remove()
}

const el = {
  main: () => document.querySelector(`#${name}`),
  img: () => document.querySelector(`#${name}-img`),
  square: () => document.querySelector(`#${name}-icon-square`),
  rotatei: () => document.querySelector(`#${name}-icon-rotate`),
  download: () => document.querySelector(`#${name}-icon-download`),
  close: () => document.querySelector(`#${name}-icon-close`),
  reset: () => document.querySelector(`#${name}-button-reset`),
  done: () => document.querySelector(`#${name}-button-done`),
  x: () => document.querySelector(`#${name}-x`),
  y: () => document.querySelector(`#${name}-y`),
  width: () => document.querySelector(`#${name}-width`),
  height: () => document.querySelector(`#${name}-height`),
  rotate: () => document.querySelector(`#${name}-rotate`),
  aspectRatio: () => document.querySelector(`#${name}-aspect-ratio`),
  maxSize: () => document.querySelector(`#${name}-max-size`),
}

// Hidden input file element
const inputEL = document.createElement('input')
inputEL.type = 'file'
inputEL.accept = 'image/jpeg,image/png,image/svg+xml,image/webp'
inputEL.onchange = (e) => getImage(e.target.files[0])

// To update cropper instance
const updateCropper = (key, value) => {
  value = parseInt(value)
  const data = cropper.getData()
  if (!Number.isInteger(value)) return
  data[key] = value
  cropper.setData(data)
}

const addListeners = () => {
  // Icon actions
  el.square().onclick = () => {
    const data = cropper.getData()
    if (data.width < data.height) data.height = data.width
    else data.width = data.height
    cropper.setData(data)
  }
  el.rotatei().onclick = () => {
    const data = cropper.getData()
    data.rotate += 45
    cropper.setData(data)
  }
  el.download().onclick = () => done(true)
  el.close().onclick = close

  // Input fields
  el.x().onchange = (e) => updateCropper('x', e.target.value)
  el.y().onchange = (e) => updateCropper('y', e.target.value)
  el.width().onchange = (e) => updateCropper('width', e.target.value)
  el.height().onchange = (e) => updateCropper('height', e.target.value)
  el.rotate().onchange = (e) => updateCropper('rotate', e.target.value)
  el.aspectRatio().onkeyup = (e) => {
    try {
      const value = parseFloat(eval(e.target.value))
      if (value > 0) cropper.setAspectRatio(value)
      else throw new Error()
    } catch (error) {
      cropper.setAspectRatio(0)
    }
  }
  el.maxSize().onchange = (e) => {
    const value = parseInt(e.target.value)
    if (!Number.isInteger(value)) config.maxSize = 0
    // Image size shouldn't be less than 1000 bytes otherwise height of the image might become 0 which will throw an error
    else config.maxSize = value > 1000 ? value : 1000
  }

  // Buttons
  el.reset().onclick = () => cropper.reset()
  el.done().onclick = (e) => {
    if (processing) return
    processing = true
    e.target.innerText = 'Processing..'
    e.target.style.color = '#484848'
    e.target.style.backgroundColor = '#ffffff'
    done()
  }
}

var downloadImageCount = 0
const instanceId = Math.random().toString().slice(2, 5)
const done = async (download) => {
  var canvas = cropper.getCroppedCanvas({
    fillColor: config.icon ? '#0000' : '#fff',
  })

  var file = await canvasToImage(canvas)

  if (config.maxSize) {
    const scale = config.maxSize / file.size

    if (scale > 0 && scale < 1) {
      canvas = downscale(canvas, scale)

      while (file.size > config.maxSize) {
        canvas = downscale(canvas, 0.8)
        file = await canvasToImage(canvas)
      }

      file = await canvasToImage(canvas)
    }
  }

  const url = window.URL.createObjectURL(file)

  if (download) {
    var link = document.createElement('a')
    link.download = `${name}_img_${instanceId}_v${++downloadImageCount}.${
      config.icon ? 'png' : 'jpg'
    }`
    link.href = url
    link.click()
  } else {
    callback({ file, url }, config)
    close()
  }

  processing = false
}

const canvasToImage = async (canvas) =>
  new Promise((resolve) => {
    const type = `image/${config.icon ? 'png' : 'jpeg'}`
    canvas.toBlob(async (blob) => {
      const image = new File([blob], `image.${config.icon ? 'png' : 'jpg'}`, {
        type,
      })

      resolve(image)
    }, type)
  })

const getImage = (img, _callback) => {
  if (!img) return (el.img().src = '')

  init()

  const reader = new FileReader()
  reader.onload = () => {
    el.main().style.display = 'flex'
    el.img().src = reader.result

    cropper = new cropperjs(el.img(), {
      responsive: true,
      checkCrossOrigin: true,
      dragMode: 'move',
      fillColor: '#ffffff',
      autoCrop: true,
      autoCropArea: 1,
      background: false,
    })

    if (config.aspectRatio) cropper.setAspectRatio(config.aspectRatio)

    el.img().addEventListener('crop', ({ detail }) => {
      el.x().value = parseInt(detail.x)
      el.y().value = parseInt(detail.y)
      el.width().value = parseInt(detail.width)
      el.height().value = parseInt(detail.height)
    })
  }

  reader.readAsDataURL(img)
}

/**
 * Hermite resize - fast image resize/resample using Hermite filter. 1 cpu version!
 */
const downscale = (canvas, scale) => {
  var width_source = canvas.width
  var height_source = canvas.height

  if (!(scale < 1) || !(scale > 0))
    throw new Error('scale must be a positive number less than 1')

  scale = Math.pow(scale, 1 / 2)

  var width = Math.round(width_source * scale)
  var height = Math.round(height_source * scale)

  var ratio_w = width_source / width
  var ratio_h = height_source / height
  var ratio_w_half = Math.ceil(ratio_w / 2)
  var ratio_h_half = Math.ceil(ratio_h / 2)

  var ctx = canvas.getContext('2d')
  var img = ctx.getImageData(0, 0, width_source, height_source)
  var img2 = ctx.createImageData(width, height)
  var data = img.data
  var data2 = img2.data

  for (var j = 0; j < height; j++) {
    for (var i = 0; i < width; i++) {
      var x2 = (i + j * width) * 4
      var weight = 0
      var weights = 0
      var weights_alpha = 0
      var gx_r = 0
      var gx_g = 0
      var gx_b = 0
      var gx_a = 0
      var center_y = (j + 0.5) * ratio_h
      var yy_start = Math.floor(j * ratio_h)
      var yy_stop = Math.ceil((j + 1) * ratio_h)
      for (var yy = yy_start; yy < yy_stop; yy++) {
        var dy = Math.abs(center_y - (yy + 0.5)) / ratio_h_half
        var center_x = (i + 0.5) * ratio_w
        var w0 = dy * dy //pre-calc part of w
        var xx_start = Math.floor(i * ratio_w)
        var xx_stop = Math.ceil((i + 1) * ratio_w)
        for (var xx = xx_start; xx < xx_stop; xx++) {
          var dx = Math.abs(center_x - (xx + 0.5)) / ratio_w_half
          var w = Math.sqrt(w0 + dx * dx)
          if (w >= 1) {
            //pixel too far
            continue
          }
          //hermite filter
          weight = 2 * w * w * w - 3 * w * w + 1
          var pos_x = 4 * (xx + yy * width_source)
          //alpha
          gx_a += weight * data[pos_x + 3]
          weights_alpha += weight
          //colors
          if (data[pos_x + 3] < 255) weight = (weight * data[pos_x + 3]) / 250
          gx_r += weight * data[pos_x]
          gx_g += weight * data[pos_x + 1]
          gx_b += weight * data[pos_x + 2]
          weights += weight
        }
      }
      data2[x2] = gx_r / weights
      data2[x2 + 1] = gx_g / weights
      data2[x2 + 2] = gx_b / weights
      data2[x2 + 3] = gx_a / weights_alpha
    }
  }

  canvas.width = width
  canvas.height = height

  // ctx.clearRect(0, 0, width_source, height_source)

  ctx.putImageData(img2, 0, 0)

  return canvas
}

// Old downscaling algorithm
// const downscale = (cv, scale) => {
//   if (!(scale < 1) || !(scale > 0))
//     throw new Error('scale must be a positive number < 1 ')
//   var sqScale = scale * scale // square scale = area of source pixel within target
//   var sw = cv.width // source image width
//   var sh = cv.height // source image height
//   var tw = Math.floor(sw * scale) // target image width
//   var th = Math.floor(sh * scale) // target image height
//   var sx = 0,
//     sy = 0,
//     sIndex = 0 // source x,y, index within source array
//   var tx = 0,
//     ty = 0,
//     yIndex = 0,
//     tIndex = 0 // target x,y, x,y index within target array
//   var tX = 0,
//     tY = 0 // rounded tx, ty
//   var w = 0,
//     nw = 0,
//     wx = 0,
//     nwx = 0,
//     wy = 0,
//     nwy = 0 // weight / next weight x / y
//   // weight is weight of current source point within target.
//   // next weight is weight of current source point within next target's point.
//   var crossX = false // does scaled px cross its current px right border ?
//   var crossY = false // does scaled px cross its current px bottom border ?
//   var sBuffer = cv.getContext('2d').getImageData(0, 0, sw, sh).data // source buffer 8 bit rgba
//   var tBuffer = new Float32Array(3 * tw * th) // target buffer Float32 rgb
//   var sR = 0,
//     sG = 0,
//     sB = 0 // source's current point r,g,b
//   /* untested !
//   var sA = 0;  //source alpha  */
//   var sA = 0

//   for (sy = 0; sy < sh; sy++) {
//     ty = sy * scale // y src position within target
//     tY = 0 | ty // rounded : target pixel's y
//     yIndex = 3 * tY * tw // line index within target array
//     crossY = tY !== (0 | (ty + scale))
//     if (crossY) {
//       // if pixel is crossing botton target pixel
//       wy = tY + 1 - ty // weight of point within target pixel
//       nwy = ty + scale - tY - 1 // ... within y+1 target pixel
//     }
//     for (sx = 0; sx < sw; sx++, sIndex += 4) {
//       tx = sx * scale // x src position within target
//       tX = 0 | tx // rounded : target pixel's x
//       tIndex = yIndex + tX * 3 // target pixel index within target array
//       crossX = tX !== (0 | (tx + scale))
//       if (crossX) {
//         // if pixel is crossing target pixel's right
//         wx = tX + 1 - tx // weight of point within target pixel
//         nwx = tx + scale - tX - 1 // ... within x+1 target pixel
//       }
//       sR = sBuffer[sIndex] // retrieving r,g,b for curr src px.
//       sG = sBuffer[sIndex + 1]
//       sB = sBuffer[sIndex + 2]
//       sA = sBuffer[sIndex + 3]

//       if (!sA) continue
//       if (sA !== 0xff) {
//         sR = (sR * sA) >> 8 // or use /256 instead ??
//         sG = (sG * sA) >> 8
//         sB = (sB * sA) >> 8
//       }

//       if (!crossX && !crossY) {
//         // pixel does not cross
//         // just add components weighted by squared scale.
//         tBuffer[tIndex] += sR * sqScale
//         tBuffer[tIndex + 1] += sG * sqScale
//         tBuffer[tIndex + 2] += sB * sqScale
//       } else if (crossX && !crossY) {
//         // cross on X only
//         w = wx * scale
//         // add weighted component for current px
//         tBuffer[tIndex] += sR * w
//         tBuffer[tIndex + 1] += sG * w
//         tBuffer[tIndex + 2] += sB * w
//         // add weighted component for next (tX+1) px
//         nw = nwx * scale
//         tBuffer[tIndex + 3] += sR * nw
//         tBuffer[tIndex + 4] += sG * nw
//         tBuffer[tIndex + 5] += sB * nw
//       } else if (crossY && !crossX) {
//         // cross on Y only
//         w = wy * scale
//         // add weighted component for current px
//         tBuffer[tIndex] += sR * w
//         tBuffer[tIndex + 1] += sG * w
//         tBuffer[tIndex + 2] += sB * w
//         // add weighted component for next (tY+1) px
//         nw = nwy * scale
//         tBuffer[tIndex + 3 * tw] += sR * nw
//         tBuffer[tIndex + 3 * tw + 1] += sG * nw
//         tBuffer[tIndex + 3 * tw + 2] += sB * nw
//       } else {
//         // crosses both x and y : four target points involved
//         // add weighted component for current px
//         w = wx * wy
//         tBuffer[tIndex] += sR * w
//         tBuffer[tIndex + 1] += sG * w
//         tBuffer[tIndex + 2] += sB * w
//         // for tX + 1; tY px
//         nw = nwx * wy
//         tBuffer[tIndex + 3] += sR * nw
//         tBuffer[tIndex + 4] += sG * nw
//         tBuffer[tIndex + 5] += sB * nw
//         // for tX ; tY + 1 px
//         nw = wx * nwy
//         tBuffer[tIndex + 3 * tw] += sR * nw
//         tBuffer[tIndex + 3 * tw + 1] += sG * nw
//         tBuffer[tIndex + 3 * tw + 2] += sB * nw
//         // for tX + 1 ; tY +1 px
//         nw = nwx * nwy
//         tBuffer[tIndex + 3 * tw + 3] += sR * nw
//         tBuffer[tIndex + 3 * tw + 4] += sG * nw
//         tBuffer[tIndex + 3 * tw + 5] += sB * nw
//       }
//     } // end for sx
//   } // end for sy

//   // create result canvas
//   var resCV = document.createElement('canvas')
//   resCV.width = tw
//   resCV.height = th
//   var resCtx = resCV.getContext('2d')
//   var imgRes = resCtx.getImageData(0, 0, tw, th)
//   var tByteBuffer = imgRes.data
//   // convert float32 array into a UInt8Clamped Array
//   var pxIndex = 0 //
//   for (
//     sIndex = 0, tIndex = 0;
//     pxIndex < tw * th;
//     sIndex += 3, tIndex += 4, pxIndex++
//   ) {
//     tByteBuffer[tIndex] = Math.ceil(tBuffer[sIndex])
//     tByteBuffer[tIndex + 1] = Math.ceil(tBuffer[sIndex + 1])
//     tByteBuffer[tIndex + 2] = Math.ceil(tBuffer[sIndex + 2])
//     tByteBuffer[tIndex + 3] = 255
//   }
//   // writing result to canvas.
//   resCtx.putImageData(imgRes, 0, 0)
//   return resCV
// }

window[name] = main

export default main
