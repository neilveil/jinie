export const s0 = `
import Jinie from 'jinie'
import 'jinie/dist/styles.css'

function App() {
  return (<div>
    {/* Initialize Jinie */}
    <Jinie />

    ..

    <BrowserRouter>
      <Routes>
        <Route .. />
        ..
      </Routes>
    </BrowserRouter>
  </div>)
}

createRoot(document.getElementById('root') as HTMLElement).render(<App />)
`

export const s1 = `
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
`

export const s2 = `
 <button
  onClick={() =>
    Jinie.init({
      accept: 'image/jpeg',
      onReady: img => setImgURL(window.URL.createObjectURL(img)),
      maxSize: 1000
    })
  }
>
  Upload Image
</button>
`

export const s3 = `
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
`

export const s4 = `
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
`

export const s5 = `
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
`

export const s6 = `
// Light theme
<Jinie theme='light' />

// Dark theme
<Jinie theme='dark' />
`
