const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://markus_db_user:${password}@cluster0.25l9h47.mongodb.net/blogilistaTesti?appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

const Blog = mongoose.model('Blog', blogSchema)

const uusiTitle = process.argv[3]
const uusiAuthor = process.argv[4]
const uusiUrl = process.argv[5]
const uusiLikes = process.argv[6]

const blog = new Blog({
  title: uusiTitle,
  author: uusiAuthor,
  url: uusiUrl,
  likes: uusiLikes
})

if (process.argv.length > 3) {
  blog.save().then(() => {
    console.log('Added', uusiTitle, 'to bloglist')
    mongoose.connection.close()
  })
}

if (process.argv.length < 4) {
  Blog.find({}).then(result => {
    console.log('bloglist:')
    result.forEach(blog => {
      console.log(blog.title)
    })
    mongoose.connection.close()
  })
}
