// make your mongoose connection 
mongoose.connect('mongodb://localhost/astroDoc-S3-file-express-development')

// create some documents
File.create({
    title:'test', 
    tags:'test', 
    owner: '5b6b001e044f4848a7e84481', 
    type:'image'})
    .then(data => console.log(data))
    .catch(err => console.error(err))

// see all files
File.find({})
    .then(data => console.log(data))
    .catch(err => console.error(err))