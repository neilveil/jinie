import React from 'react'
import Cropper from 'cropperjs'
import CompressionLoop from 'compression-loop'
import type { CompressionLoopArgs } from 'compression-loop'
import 'cropperjs/dist/cropper.min.css'
import './jinie.scss'

const _URL = window.URL || window.webkitURL

interface editor {
  img: Blob
  onReady: (img: Blob) => void
  onCancel?: (status: string) => void
  aspectRatio?: number
  icon?: boolean
  fill?: string
  minWidth?: number
  minHeight?: number
  minSize?: number
  maxSize?: number
}

interface props {
  theme?: 'light' | 'dark'
}

export default class Main extends React.Component<props> {
  static _this: InstanceType<typeof Main>

  static defaultProps = {
    theme: 'light'
  }

  componentDidMount = () => (Main._this = this)

  static init = async ({
    img,
    onReady,
    onCancel,
    aspectRatio,
    icon,
    fill,
    minWidth = 32,
    minHeight = 32,
    minSize,
    maxSize
  }: editor) => {
    if (!img) return

    const { width, height, size } = await getImgDetails(img)

    if (width < minWidth) {
      if (onCancel) onCancel('min-width-fail')
      return
    }

    if (height < minHeight) {
      if (onCancel) onCancel('min-height-fail')
      return
    }

    if (minSize && size < minSize) {
      if (onCancel) onCancel('min-size-fail')
      return
    }

    Main._this.setState(
      {
        img: _URL.createObjectURL(img),
        rotation: 0,
        progress: 0
      },
      () => {
        const config: any = {}

        if (aspectRatio) config.aspectRatio = aspectRatio

        if (minWidth) config.minCropBoxWidth = minWidth
        if (minHeight) config.minCropBoxHeight = minHeight

        Main._this.cropper = new Cropper(Main._this.imgRef, {
          dragMode: 'move',
          autoCrop: true,
          autoCropArea: 1,
          background: false,
          highlight: true,
          ...config
        })

        if (icon) Main.icon = icon
        if (fill) Main.fill = fill
        if (maxSize) Main.maxSize = maxSize
        if (onReady) Main.onReady = onReady
        if (onCancel) Main.onCancel = onCancel
      }
    )

    document.body.style.overflow = 'hidden'
  }

  static icon: any = null
  static fill: any = null
  static maxSize: any = null
  static onReady: any = null
  static onCancel: any = null
  static processing = false

  static CompressionLoop = (config: CompressionLoopArgs) => CompressionLoop(config)

  cropper: any = null
  img: string = ''
  imgRef: any = React.createRef()
  state = {
    img: '',
    rotation: 0,
    progress: 0
  }
  onRotate = (e: any) => {
    if (Main.processing) return
    this.setState({ rotation: e.target.value }, () => this.cropper.rotateTo(this.state.rotation))
  }
  onReset = () => {
    if (Main.processing) return
    this.setState({ rotation: 0 }, () => this.cropper.reset())
  }
  close = () => {
    if (Main.processing) return

    this.setState({ img: '' })
    this.cropper.destroy()
    this.cropper = null

    Main.icon = null
    Main.fill = null
    Main.maxSize = null
    Main.onReady = null
    Main.onCancel = null
    Main.processing = false

    document.body.style.overflow = 'unset'
  }
  onCancel = () => {
    if (Main.onCancel) Main.onCancel('canceled')
    this.close()
  }
  onDone = async () => {
    if (Main.processing) return

    Main.processing = true
    this.cropper.disable()

    let mimeType = 'image/png'

    const config: any = {}

    if (Main.fill) config.fillColor = Main.fill

    if (!Main.icon) {
      mimeType = 'image/jpeg'
      if (!Main.fill) config.fillColor = '#ffffff'
    }

    let img = this.cropper.getCroppedCanvas(config).toDataURL(mimeType)

    img = await dataURLToBlob(img)

    if (Main.maxSize && !Main.icon) {
      const { status, compressedImg } = await CompressionLoop({
        img,
        maxSize: Main.maxSize,
        onProgress: ({ progress }) => this.setState({ progress })
      })

      if (status === 'success') img = compressedImg
    }

    if (Main.onReady) Main.onReady(img)

    Main.processing = false
    this.close()
  }
  render = () => {
    return this.state.img ? (
      <div className={'jinie jinie-' + this.props.theme}>
        <div className='jinie-editor'>
          <div className='jinie-rotation'>
            {this.state.progress ? (
              <div className='jinie-progress'>
                <div className='jinie-progress-filled' style={{ width: this.state.progress + '%' }}></div>
              </div>
            ) : (
              <input
                value={this.state.rotation}
                min={-180}
                max={180}
                step={0.1}
                onChange={this.onRotate}
                type='range'
              />
            )}
          </div>

          <div className='jinie-buttons'>
            <div onClick={this.onReset} className='jinie-icon jinie-icon-reset'>
              {icons.reset}
            </div>
            <div onClick={this.onCancel} className='jinie-icon jinie-icon-cancel'>
              {icons.cancel}
            </div>
            <div onClick={this.onDone} className='jinie-icon jinie-icon-done'>
              {icons.done}
            </div>
          </div>
        </div>

        <div className='jinie-image-box'>
          <div>
            <img width='100%' ref={ref => (this.imgRef = ref)} src={this.state.img} />
          </div>
        </div>
      </div>
    ) : null
  }
}

const icons = {
  reset: (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      enableBackground='new 0 0 24 24'
      height='24px'
      viewBox='0 0 24 24'
      width='24px'
      className='jinie-buttons-reset'
    >
      <g>
        <path d='M0,0h24v24H0V0z' fill='none' />
      </g>
      <g>
        <g>
          <path d='M6,13c0-1.65,0.67-3.15,1.76-4.24L6.34,7.34C4.9,8.79,4,10.79,4,13c0,4.08,3.05,7.44,7,7.93v-2.02 C8.17,18.43,6,15.97,6,13z M20,13c0-4.42-3.58-8-8-8c-0.06,0-0.12,0.01-0.18,0.01l1.09-1.09L11.5,2.5L8,6l3.5,3.5l1.41-1.41 l-1.08-1.08C11.89,7.01,11.95,7,12,7c3.31,0,6,2.69,6,6c0,2.97-2.17,5.43-5,5.91v2.02C16.95,20.44,20,17.08,20,13z' />
        </g>
      </g>
    </svg>
  ),
  cancel: (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      height='24px'
      viewBox='0 0 24 24'
      width='24px'
      className='jinie-buttons-cancel'
    >
      <path d='M0 0h24v24H0V0z' fill='none' />
      <path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z' />
    </svg>
  ),
  done: (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      height='24px'
      viewBox='0 0 24 24'
      width='24px'
      className='jinie-buttons-done'
    >
      <path d='M0 0h24v24H0V0z' fill='none' />
      <path d='M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z' />
    </svg>
  ),
  flipX: (
    <svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 0 24 24' width='24px'>
      <path d='M0 0h24v24H0V0z' fill='none' />
      <path d='M15 21h2v-2h-2v2zm4-12h2V7h-2v2zM3 5v14c0 1.1.9 2 2 2h4v-2H5V5h4V3H5c-1.1 0-2 .9-2 2zm16-2v2h2c0-1.1-.9-2-2-2zm-8 20h2V1h-2v22zm8-6h2v-2h-2v2zM15 5h2V3h-2v2zm4 8h2v-2h-2v2zm0 8c1.1 0 2-.9 2-2h-2v2z' />
    </svg>
  ),
  flipY: (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      height='24px'
      viewBox='0 0 24 24'
      width='24px'
      style={{ transform: 'rotate(90deg)' }}
    >
      <path d='M0 0h24v24H0V0z' fill='none' />
      <path d='M15 21h2v-2h-2v2zm4-12h2V7h-2v2zM3 5v14c0 1.1.9 2 2 2h4v-2H5V5h4V3H5c-1.1 0-2 .9-2 2zm16-2v2h2c0-1.1-.9-2-2-2zm-8 20h2V1h-2v22zm8-6h2v-2h-2v2zM15 5h2V3h-2v2zm4 8h2v-2h-2v2zm0 8c1.1 0 2-.9 2-2h-2v2z' />
    </svg>
  ),
  zoomIn: (
    <svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 0 24 24' width='24px'>
      <path d='M0 0h24v24H0V0z' fill='none' />
      <path d='M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zm.5-7H9v2H7v1h2v2h1v-2h2V9h-2z' />
    </svg>
  ),
  zoomOut: (
    <svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 0 24 24' width='24px'>
      <path d='M0 0h24v24H0V0z' fill='none' />
      <path d='M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zM7 9h5v1H7z' />
    </svg>
  )
}

const dataURLToBlob = (uri: string) =>
  new Promise<Blob>(async (resolve, reject) => {
    try {
      const res = await fetch(uri)
      const blob = await res.blob()
      resolve(blob)
    } catch (error) {
      reject(error)
    }
  })

const getImgDetails = (file: Blob) =>
  new Promise<{ width: number; height: number; size: number }>((resolve, reject) => {
    const img = new Image()
    const objectUrl = _URL.createObjectURL(file)
    img.onload = () => {
      resolve({ width: img.width, height: img.height, size: file.size })
      _URL.revokeObjectURL(objectUrl)
    }
    img.onerror = error => reject(error)
    img.src = objectUrl
  })
