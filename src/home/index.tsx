import './styles.scss'

function App({ children }: { children?: any }) {
  return (
    <div className='main'>
      <div>
        <div className='header'>
          <div className='container'>
            <div className='logo-name'>
              <div className='logo'>
                <img src='/jinie/logo.png' />
              </div>

              <div className='name'>Jinie</div>
            </div>

            <div className='tagline'>Simple Image Editing & Compression Tool</div>

            <div className='install'>npm i jinie</div>

            <ul className='highlights'>
              <li>Simple implementation</li>
              <li>Responsive with light/dark theme</li>
              <li>In-built image compression</li>
            </ul>

            <a href='https://github.com/neilveil/jinie' target='_blank'>
              <div className='github'>
                <img src='/jinie/github.svg' />
                <span>Docs&nbsp;&nbsp;➞</span>
              </div>
            </a>
          </div>
        </div>

        <div className='body container'>{children}</div>
      </div>

      <div className='footer'>
        Developed by
        <a target='_blank' href='https://github.com/neilveil'>
          neilveil
        </a>
      </div>
    </div>
  )
}

export default App
