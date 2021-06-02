window.jinie.setDropArea(
  '.drop-area',
  ({ file, url }, config) => {
    document.querySelector('img').src = url

    console.log(file, url, config)
  },
  {
    // Set fields below to false to ignore
    maxSize: 500000, // In bytes, e.g. 10000000
    aspectRatio: 0, // e.g. 1
    icon: true, // Outputs .png file
    rounded: false, // To show rounded viewbox
    // Other fields that you want to receive in file upload callback
    id: '1',
    name: 'profile_image',
    // ..
  }
)
