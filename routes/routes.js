const express = require("express");
const { redirect } = require("express/lib/response");
const DbHandler = require('../js/DbHandler');

const Router = express.Router();
const dbHandler = new DbHandler();

let user = null;

Router.get('/', (req, res, next) => {
    dbHandler.getAllPosts()
        .then(postList => {
            res.render('./index.ejs', {user, postList});
        })
});

Router.get('/sign-up', (req, res, next) => {
    res.render('signUp.ejs', {cssList:['input-styling.css']})
})

Router.post('/sign-up', (req, res, next) => {
    const name = req.body.name;
    const birthDate = req.body.birthdate;
    const bio = req.body.bio;
    dbHandler.createAuthor(name, birthDate, bio)
        .then(result => {
            res.status(202).redirect('/');
        });
});


Router.get('/sign-in', (req, res, next) => {
    res.render('./logIn.ejs', {cssList:['input-styling.css']});
});

Router.post('/sign-in', (req, res, next) => {
    const username = req.body.username;
    dbHandler.findAuthorByName(username)
        .then(result => {
            if(result !== null){
                user = result;
                res.redirect('/');
            }
        })
});

Router.get('/sign-out', (req, res, next) => {
    user = null;
    res.redirect('/');
});

Router.get('/create-post', (req, res, next) => {
    res.render('./createPost.ejs', {cssList:['input-styling.css']});
});

Router.post('/create-post', (req, res, next) => {
    if(user){
        dbHandler.createBlogPost(user, req.body.title, req.body.post)
            .then(result => {
                res.redirect('/');
            })
    } else {
        res.redirect('/');
    }

});

Router.get('/edit-post/:postId', (req, res, next) => {
    const postId = req.params.postId;
    dbHandler.getPost(postId, user.name)
        .then(post => {
            res.render('./editPost.ejs', {user, pageTitle: 'Edit Post!', cssList:['input-styling.css'], post});
        })

});

Router.post('/edit-post', (req, res, next) => {
    const title = req.body.title;
    const content = req.body.post;
    const id = req.body.id;

    dbHandler.updatePost(id, title, content, user.name)
        .then( result => {
            res.redirect('/');
        })
});

Router.get('/delete-post/:postId', (req, res, next) => {
    const postId = req.params.postId;
    dbHandler.getPost(postId, user.name)
        .then( post => {
            res.render('./deletePost.ejs', {user, pageTitle: 'Delete post!', cssList:['input-styling.css'], post});
        }) 
});

Router.post('/delete-post', (req, res, next) => {
    const postId = req.body.id;
    console.log('Trying to delete:', postId);
    dbHandler.removePost(postId, user.name)
        .then(_ => {
            res.redirect('/');
        })
});

Router.get('/show-posts', (req, res, next) => {
    res.redirect('/')
});

Router.post('/confirm-post', (req, res, next) => {
    res.status(202).redirect('create-post', {}); // create a page where any blog renders as will be seen and then confirmed, updated, or deleted.
});



module.exports = Router; 