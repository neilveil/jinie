# Jinie

**✨ Simple Image Editing & Compression Tool ✨**

Easily enhance and optimize images before upload with Jinie. Crop, pan, scale, and rotate with a built-in compression feature to compress images to the target size. 🚀

## Installation 🚀

To install the **Jinie** package, you can use npm:

```bash
npm install jinie
```

## Usage 🛠️

Jinie need to be initialized only once at the top.

ReactJS example

```jsx
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
```

Here's a basic example of how to use Jinie to edit images:

```jsx
import Jinie from 'jinie'

..

// Upload and crop image on init
<button
  onClick={() =>
    Jinie.init({
      accept: 'image/jpeg',
      onReady: result => {
        console.log(result) // Cropped image blob
      }
    })
  }
>
  Upload Image
</button>

// Or provide an image to crop in init
<input
  type='file'
  accept='image/jpeg'
  onChange={async (e) => {
    const img = e.target.files[0]
    Jinie.init({
      img,
      onReady: result => {
        console.log(result) // Cropped image blob
      }
    })
  }}
/>
```

| Argument    | Type      | Usage                                                            |
| ----------- | --------- | ---------------------------------------------------------------- |
| onReady     | Function  | On ready callback                                                |
| onCancel    | ?Function | On cancel callback, with cancel reason as argument               |
| accept      | ?String   | Allowed mime types (Default: `image/jpeg,image/png`)             |
| \*img       | ?Blob     | Source image                                                     |
| aspectRatio | ?Number   | Crop box aspect ratio                                            |
| icon        | ?Number   | Output png file (Default: `false`)                               |
| fill        | ?Number   | Background color (Default: transparent for icon & white for jpg) |
| minWidth    | ?Number   | Min image width required else cancel                             |
| minHeight   | ?Number   | Min image height required else cancel                            |
| minSize     | ?Number   | Min image size required else cancel                              |
| maxSize     | ?Number   | Max output size                                                  |

`Jinie.CompressionLoop` exports the [Compression Loop](https://github.com/neilveil/compression-loop) package which is used to compress the image to the target size. It can be used alone to compress images without opening the **Jinie** editor.

## Dark theme setup

While initializing `Jinie`

```jsx
<Jinie theme='dark' />
```

or automatic theme detection with `body[data-theme]="dark"`

```html
<html>
  <head>
    ..
  </head>

  <body data-theme="dark">
    ..
  </body>
</html>
```

## License 📜

This package is open-source and available under the MIT License.

## Contributing 🙌

Contributions to the **Jinie** package are welcome! If you have any ideas, improvements, or bug fixes, please submit a pull request or open an issue.

## Authors 🖋️

Developed & maintained by [neilveil](https://github.com/neilveil)
