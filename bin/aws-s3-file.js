'use strict'

/* Goals of this file
1. get a file from the command line
2. verify our work along the way with console.logs
3. call upload script
*/

const s3File = require('../lib/aws-s3-file')

const astroFile = {
  path: process.argv[2],
  name: process.argv[3]
}

// invoke s3Upload() promise, handling success and error with .then and .catch
s3File(astroFile)
  .then((data) => console.log(data))
  .catch((error) => console.error(error))