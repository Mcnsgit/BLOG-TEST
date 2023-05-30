const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(port, () => {
console.log(`Server is running at http://localhost:${port}`);
});
const mongoose = require('mongoose');

mongoose.connect('mongodb-atlas://localhost/blog-test-rjtlh', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB...', err));
app.set('view engine', 'ejs');

const blogPostSchema = new mongoose.Schema({
    title: String,
    content: String,
    date: { type: Date, default: Date.now }
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

app.get('/new', (req, res) => {
    res.render('new');
});

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/new', (req, res) => {
    const blogPost = new BlogPost({
    title: req.body.title,
    content: req.body.content
    });
    blogPost.save()


    blogPost.save()
    .then(() => res.redirect('/'))
    .catch(err => console.error(err));
});


app.get('/posts', async (req, res) => {
    const blogPosts = await BlogPost.find().sort({ date: -1 });
    res.render('posts', { blogPosts: blogPosts });
});

app.get('/post/:id', async (req, res) => {
    const blogPost = await BlogPost.findById(req.params.id);
    res.render('post', { blogPost: blogPost });
});

app.get('/posts/:id', async (req, res) => {
    const blogPost = await BlogPost.findById(req.params.id);
    res.render('post', { blogPost: blogPost });
});

app.delete('/post/:id', async (req, res) => {
    await BlogPost.findByIdAndDelete(req.params.id);
    res.redirect('/posts');
});

app.get('/posts/:id/edit', async (req, res) => {
    const blogPost = await BlogPost.findById(req.params.id);
    res.render('edit', { blogPost: blogPost });
});

app.post('/posts/:id/edit', async (req, res) => {
    await BlogPost.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/posts/' + req.params.id);
});
app.post('/posts/:id/delete', async (req, res) => {
    await BlogPost.findByIdAndRemove(req.params.id);
    res.redirect('/posts');
});
app.use(express.static('public'));



app.get('/', async (req, res) => {
    const blogPosts = await BlogPost.find().sort({ date: -1 });
    res.render('index', { blogPosts: blogPosts });
});
