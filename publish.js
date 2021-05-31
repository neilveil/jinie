const fs = require('fs')

const pkgJSON = require('./package.json')

fs.writeFileSync(
  'build/index.js',
  fs.readFileSync('build/index.js').toString().split('\n')[1]
)

fs.writeFileSync(
  'build/package.json',
  `{"name":"${pkgJSON.name}","version":"${pkgJSON.version}","private":false,"main":"index.js"}`
)
