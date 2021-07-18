import cropperjs from 'cropperjs'
import downscale from './scripts/downscale'
import html from './templates/main.html'

import './styles/index.scss'

const name = 'jinie'

const main = {
  setDropArea: (selector, _callback = () => {}, _config = {}) => {
    var cropper, callback

    var defaultConfig = {
        maxSize: 0, // In bytes, e.g. 10000000
        aspectRatio: 0, // e.g. 1.2
        icon: false, // Outputs .png file
        rounded: false,
      },
      config = {},
      processing = false

    const mainEl =
      typeof selector === 'string' ? document.querySelector(selector) : selector
    if (!mainEl) return

    _config = Object.assign(defaultConfig, _config)

    const className = 'active'

    mainEl.ondrag = (e) => {
      e.preventDefault()
      e.stopPropagation()
    }
    mainEl.ondragstart = (e) => {
      e.preventDefault()
      e.stopPropagation()
    }
    mainEl.ondragend = (e) => {
      e.preventDefault()
      e.stopPropagation()
      mainEl.classList.remove(className)
    }
    mainEl.ondragover = (e) => {
      e.preventDefault()
      e.stopPropagation()
      mainEl.classList.add(className)
    }
    mainEl.ondragenter = (e) => {
      e.preventDefault()
      e.stopPropagation()
      mainEl.classList.add(className)
    }
    mainEl.ondragleave = (e) => {
      e.preventDefault()
      e.stopPropagation()
      mainEl.classList.remove(className)
    }
    mainEl.ondrop = (e) => {
      e.preventDefault()
      e.stopPropagation()
      mainEl.classList.remove(className)

      setVars({ _config, _callback })

      getImage(e.dataTransfer.files[0])
    }
    mainEl.onclick = () => {
      setVars({ _config, _callback })

      inputEL.click()
    }

    const setVars = ({ _config, _callback }) => {
      config = _config
      callback = _callback
    }

    const init = () => {
      if (!document.querySelector('#' + name)) {
        document.body.appendChild(
          new DOMParser().parseFromString(html, 'text/html').body.firstChild
        )
        addListeners()
      }

      if (config.aspectRatio) {
        el.square().remove()
        el.aspectRatio().parentElement.remove()
      }

      if (config.rounded) {
        document.querySelector(
          `#${name}-styles`
        ).innerHTML = `.cropper-view-box,.cropper-face{border-radius: 50%;}`
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
          const image = new File(
            [blob],
            `image.${config.icon ? 'png' : 'jpg'}`,
            {
              type,
            }
          )

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
  },
}

window[name] = main

export default main
