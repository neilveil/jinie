import Jinie from '../lib'
import { useState } from 'react'
import s from './styles.module.scss'

function App() {
  const [imgURL, setImgURL] = useState('')
  const [maxSize, setMaxSize] = useState(1000)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  return (
    <div>
      <Jinie theme={theme} />

      {imgURL ? (
        <div className={s.uploadedImg} onClick={() => setImgURL('')}>
          <img src={imgURL} />
        </div>
      ) : (
        <div>
          <div className={s.title}>Examples</div>

          <div className={s.label}>Simple image editor</div>
          <input
            type='file'
            accept='image/jpeg'
            onChange={async (e: any) => {
              if (imgURL) window.URL.revokeObjectURL(imgURL)
              const img = e.target.files[0]
              Jinie.init({ img, onReady: img => setImgURL(window.URL.createObjectURL(img)) })
            }}
          />

          <div className={s.break} />

          <div className={s.label}>Upload with compression</div>

          <input
            type='file'
            accept='image/jpeg'
            onChange={async (e: any) => {
              if (imgURL) window.URL.revokeObjectURL(imgURL)

              const img = e.target.files[0]

              Jinie.init({
                img,
                onReady: img => setImgURL(window.URL.createObjectURL(img)),
                maxSize
              })
            }}
          />

          <div className={s.maxSizeRange}>
            <input
              type='range'
              min={100}
              max={2000}
              step={100}
              value={maxSize}
              onChange={(e: any) => setMaxSize(e.target.value)}
            />
            <label>{maxSize ? `Compress to: ${maxSize} KB` : 'No compression!'} </label>
          </div>

          <div className={s.break} />

          <div className={s.label}>Upload square png image with transparent background</div>

          <input
            type='file'
            accept='image/png'
            onChange={async (e: any) => {
              if (imgURL) window.URL.revokeObjectURL(imgURL)

              const img = e.target.files[0]

              Jinie.init({
                img,
                onReady: img => setImgURL(window.URL.createObjectURL(img)),
                aspectRatio: 1,
                icon: true
              })
            }}
          />

          <div className={s.break} />

          <div className={s.label}>Upload png image with red background</div>

          <input
            type='file'
            accept='image/png'
            onChange={async (e: any) => {
              if (imgURL) window.URL.revokeObjectURL(imgURL)

              const img = e.target.files[0]

              Jinie.init({
                img,
                onReady: img => setImgURL(window.URL.createObjectURL(img)),
                aspectRatio: 1,
                icon: true,
                fill: '#ff0000'
              })
            }}
          />

          <div className={s.break} />

          <div className={s.label}>Min width & height to be 512px</div>

          <input
            type='file'
            accept='image/png'
            onChange={async (e: any) => {
              if (imgURL) window.URL.revokeObjectURL(imgURL)

              const img = e.target.files[0]

              Jinie.init({
                img,
                onReady: img => setImgURL(window.URL.createObjectURL(img)),
                onCancel: status => console.log(status),
                minWidth: 512,
                minHeight: 512
              })
            }}
          />

          <div className={s.break} />

          <div className={s.label}>Light/Dark Theme</div>

          <div className={s.theme}>
            <div className={theme === 'light' ? s.active : ''} onClick={() => setTheme('light')}>
              Light
            </div>
            <div className={theme === 'dark' ? s.active : ''} onClick={() => setTheme('dark')}>
              Dark
            </div>
          </div>

          <br />

          <input
            type='file'
            accept='image/jpeg'
            onChange={async (e: any) => {
              if (imgURL) window.URL.revokeObjectURL(imgURL)
              const img = e.target.files[0]
              Jinie.init({ img, onReady: img => setImgURL(window.URL.createObjectURL(img)) })
            }}
          />
        </div>
      )}
    </div>
  )
}

export default App
