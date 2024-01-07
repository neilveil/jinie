import Jinie from '../lib'
import { useEffect, useState } from 'react'
import s from './styles.module.scss'
import * as snippets from './snippets'

declare global {
  interface Window {
    Prism: any
  }
}

function App() {
  const [imgURL, setImgURL] = useState('')
  const [maxSize, setMaxSize] = useState(1000)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    window.Prism.highlightAll()
  }, [imgURL])

  return (
    <div>
      <Jinie theme={theme} />

      {imgURL ? (
        <div className={s.uploadedImg} onClick={() => setImgURL('')}>
          <img src={imgURL} />
        </div>
      ) : (
        <div>
          <div className={s.title}>Try</div>

          <button
            onClick={() =>
              Jinie.init({
                accept: 'image/jpeg',
                onReady: img => setImgURL(window.URL.createObjectURL(img))
              })
            }
          >
            Upload Image
          </button>

          <div className={s.title}>Initialize</div>

          <pre className={s.code}>
            <code className='language-jsx'>{snippets.s0.trim()}</code>
          </pre>

          <div className={s.title}>Examples</div>

          <div className={s.label}>Simple image editor</div>

          <button
            onClick={() =>
              Jinie.init({
                accept: 'image/jpeg',
                onReady: img => setImgURL(window.URL.createObjectURL(img))
              })
            }
          >
            Upload Image
          </button>

          <pre className={s.code}>
            <code className='language-jsx'>{snippets.s1.trim()}</code>
          </pre>

          <div className={s.break} />

          <div className={s.label}>Upload with compression</div>

          <button
            onClick={() =>
              Jinie.init({
                accept: 'image/jpeg',
                onReady: img => setImgURL(window.URL.createObjectURL(img)),
                maxSize
              })
            }
          >
            Upload Image
          </button>

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

          <pre className={s.code}>
            <code className='language-jsx'>{snippets.s2.trim()}</code>
          </pre>

          <div className={s.break} />

          <div className={s.label}>Upload square png image with transparent background</div>

          <button
            onClick={() =>
              Jinie.init({
                accept: 'image/jpeg',
                onReady: img => setImgURL(window.URL.createObjectURL(img)),
                aspectRatio: 1,
                icon: true
              })
            }
          >
            Upload Image
          </button>

          <pre className={s.code}>
            <code className='language-jsx'>{snippets.s3.trim()}</code>
          </pre>

          <div className={s.break} />

          <div className={s.label}>Upload png image with red background</div>

          <button
            onClick={() =>
              Jinie.init({
                accept: 'image/jpeg',
                onReady: img => setImgURL(window.URL.createObjectURL(img)),
                aspectRatio: 1,
                icon: true,
                fill: '#ff0000'
              })
            }
          >
            Upload Image
          </button>

          <pre className={s.code}>
            <code className='language-jsx'>{snippets.s4.trim()}</code>
          </pre>

          <div className={s.break} />

          <div className={s.label}>Min width & height to be 512px</div>

          <button
            onClick={() =>
              Jinie.init({
                accept: 'image/jpeg',
                onReady: img => setImgURL(window.URL.createObjectURL(img)),
                onCancel: status => console.log(status),
                minWidth: 512,
                minHeight: 512
              })
            }
          >
            Upload Image
          </button>

          <pre className={s.code}>
            <code className='language-jsx'>{snippets.s5.trim()}</code>
          </pre>

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

          <button
            onClick={() =>
              Jinie.init({
                accept: 'image/jpeg',
                onReady: img => setImgURL(window.URL.createObjectURL(img))
              })
            }
          >
            Upload Image
          </button>

          <pre className={s.code}>
            <code className='language-jsx'>{snippets.s6.trim()}</code>
          </pre>
        </div>
      )}
    </div>
  )
}

export default App
