window.jinie.setDropArea(
  '.drop-area',
  ({ file, url }, config) => {
    document.querySelector('img').src = url

    console.log(file, url, config)
  },
  {
    name: 'image-1',
    // Set fields below to 0 to ignore
    maxSize: 500000, // In bytes, e.g. 10000000
    aspectRatio: 0, // e.g. 1
    icon: true, // Outputs .png file
  }
)
