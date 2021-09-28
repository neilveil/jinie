import cropper from './scripts/cropper'
import compressor from './scripts/compressor'
import downscale from './scripts/downscale'
import html from './templates/main.html'

import './styles/index.scss'

const name = 'jinie'

class main {
  constructor({ dropArea, cb, config }) {
    // After finish callback
    if (cb) this.cb = cb

    // File input area
    this.dropAreaEl = typeof dropArea === 'string' ? document.querySelector(dropArea) : dropArea

    if (!this.dropAreaEl) return console.error('Drop area element not found')

    // Set config
    this.config = Object.assign(this.config, config)

    // No need to bind listeners again if already processed, very helpful in reactJS
    if (this.dropAreaEl.dataset[name] === 'true') return

    this.dropAreaEl.dataset[name] = 'true'

    // Bind listeners to file upload area
    this.bindDropAreaListeners()

    // Hidden input field to upload file
    this.fileEL = document.createElement('input')
    this.fileEL.type = 'file'
    this.fileEL.accept = 'image/jpeg,image/png,image/svg+xml,image/webp'
    this.fileEL.onchange = e => this.getImage(e.target.files[0])
  }
  cb = ({ file, url }, config) => {
    console.log(name, file, url, config)
  }
  dropAreaEl = document.body
  config = {
    maxSize: 0, // In bytes, e.g. 10000000
    aspectRatio: 0, // e.g. 1.2
    icon: false, // Outputs .png file
    rounded: false,
    quality: 0.4
  }
  bindDropAreaListeners = () => {
    const className = 'active'

    this.dropAreaEl.ondrag = e => {
      e.preventDefault()
      e.stopPropagation()
    }
    this.dropAreaEl.ondragstart = e => {
      e.preventDefault()
      e.stopPropagation()
    }
    this.dropAreaEl.ondragend = e => {
      e.preventDefault()
      e.stopPropagation()
      this.dropAreaEl.classList.remove(className)
    }
    this.dropAreaEl.ondragover = e => {
      e.preventDefault()
      e.stopPropagation()
      this.dropAreaEl.classList.add(className)
    }
    this.dropAreaEl.ondragenter = e => {
      e.preventDefault()
      e.stopPropagation()
      this.dropAreaEl.classList.add(className)
    }
    this.dropAreaEl.ondragleave = e => {
      e.preventDefault()
      e.stopPropagation()
      this.dropAreaEl.classList.remove(className)
    }
    this.dropAreaEl.ondrop = e => {
      e.preventDefault()
      e.stopPropagation()
      this.dropAreaEl.classList.remove(className)
      this.getImage(e.dataTransfer.files[0])
    }
    this.dropAreaEl.onclick = () => this.fileEL.click()
  }
  done = async download => {
    this.getEl.done().parentElement.remove()

    var canvas = this.cropper.getCroppedCanvas({
      fillColor: this.config.icon ? '#0000' : '#fff'
    })

    var file = await this.canvasToImage(canvas)

    // Default compression
    if (!this.config.icon) file = await compressor(file, 0.9)

    if (this.config.maxSize) {
      const scale = this.config.maxSize / file.size

      if (scale > 0 && scale < 1) {
        canvas = downscale(canvas, scale)

        while (file.size > this.config.maxSize) {
          canvas = downscale(canvas, 0.8)
          file = await this.canvasToImage(canvas)
        }

        file = await this.canvasToImage(canvas)
      }
    }

    const url = window.URL.createObjectURL(file)

    // Compress jpeg image
    if (!this.config.icon) file = await compressor(file, this.config.quality)

    this.cb({ file, url }, this.config)
    this.close()
  }
  canvasToImage = async canvas =>
    new Promise(resolve => {
      const type = `image/${this.config.icon ? 'png' : 'jpeg'}`
      canvas.toBlob(async blob => {
        const image = new File([blob], `image.${this.config.icon ? 'png' : 'jpg'}`, {
          type
        })

        resolve(image)
      }, type)
    })
  openEditor = () => {
    if (!document.querySelector('#' + name)) {
      document.body.appendChild(new DOMParser().parseFromString(html, 'text/html').body.firstChild)
    }

    this.getEl.done().onclick = this.done
    this.getEl.close().onclick = this.close

    if (this.config.rounded) {
      document.querySelector(`#${name}-styles`).innerHTML = `.cropper-view-box,.cropper-face{border-radius: 50%;}`
    }
  }
  getEl = {
    main: () => document.querySelector(`#${name}`),
    img: () => document.querySelector(`#${name}-img`),
    close: () => document.querySelector(`#${name}-close`),
    done: () => document.querySelector(`#${name}-done`)
  }
  getImage = (img, _callback) => {
    if (!img) return (this.getEl.img().src = '')

    this.openEditor()

    const reader = new FileReader()
    reader.onload = () => {
      this.getEl.main().style.display = 'flex'
      this.getEl.img().src = reader.result

      this.cropper = new cropper(this.getEl.img(), {
        responsive: true,
        checkCrossOrigin: true,
        dragMode: 'move',
        fillColor: '#ffffff',
        autoCrop: true,
        autoCropArea: 1,
        background: false
      })

      if (this.config.aspectRatio) this.cropper.setAspectRatio(this.config.aspectRatio)
    }

    reader.readAsDataURL(img)
  }
  close = () => {
    this.cropper.destroy()
    this.fileEL.value = null
    this.getEl.main().remove()
  }
}

window[name] = main
