# Jinie

## Usage

```js
import jinie from 'jinie'

new jinie({
  dropArea: '.drop-area', // {String | Element} Element from where you want to upload file by click or drag-and-drop
  // File upload callback
  cb: ({ file, url }, config) => {
    document.querySelector('img').src = url

    console.log(file, url, config)
  },
  config: {
    // Set fields below to false to ignore
    maxSize: 200000, // {Integer} Maximum image size in bytes
    aspectRatio: 1, // {Integer} Aspect ratio
    icon: true, // {Boolean} If true, outputs .png file
    rounded: true, // {Boolean} To show rounded viewbox
    // Other fields that you want to receive in file upload callback
    id: '1',
    name: 'profile_image'
    // ..
  }
})
```

or

```html
<script src="https://unpkg.com/jinie"></script>
<script>
  window.addEventListener('load', () => {
    new window.Jinie({
      ..
    })
  })
</script>
```

> Jinie automatically add/remove `.active` class in drop area on file hover.
