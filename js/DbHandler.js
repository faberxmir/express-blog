const Mongoose = require('mongoose');
const {Schema} = Mongoose;

const Author = require('../model/Author');
const BlogPost = require('../model/BlogPost');


class DbHandler {
    #AuthorHandler;

    constructor(){
        Mongoose.connect('mongodb://localhost:27017/blogsiteDB')
        .then(result => {
            console.log('Connected to MONGO!');
            this.#AuthorHandler = DbHandler.createAuthorModel();
        })
        .catch(err => {
            console.log('ERROR', err);
        })
    };

    async createAuthor(name, birthDate, bio){
        let resultMessage = 'unknown error';
        const author = new Author(name, birthDate, bio);
        const authorModel = new this.#AuthorHandler(author.getPojo());

        try {
            await authorModel.save();  
            resultMessage = 'Your profile has been created! Welcome!'
        } catch(err) {
            switch (err.code) {
                case 11000:
                    resultMessage = "Username or email already in use"
                    break;
            
                default:
                    resultMessage = "could not create user! Sorry, but please try again!"
                    break;
            }
        }
            
        return resultMessage;
    }
    
    async findAuthorByName(username){
        let user = 'unknown';

        await this.#AuthorHandler.findOne({name: username})
            .then(result => {
                console.log(result);
                user = result
            })
            .catch(err => {
                console.log('error', err);
            })
        return user;
    }

    async createBlogPost(user, title, content){
        console.log('creating blog for user:', user, title, content);
        const post = new BlogPost(user.name, title, content);
        const author = await this.findAuthorByName(user.name)
        author.posts.push(post);
        await author.save();
        console.log('posts', author.posts[0]);
        
    }

    getAuthor(){
        
    }

    async getPost(_id, authorname){
        let post = null
        if(authorname){
            const author = await this.findAuthorByName(authorname);
            post = await author.posts.id(_id);
        }

        return post
    }

    async getAllPosts(){
        const postList = [];
        const authors = await this.#AuthorHandler.find();
        authors.forEach( author => {
            postList.push(...author.posts);
        });
        return postList
    }

    async updatePost(id, title, content, authorname) {
        let resultPost = null;
        const author = await this.findAuthorByName(authorname);

        for(let post of author.posts){
            if(post._id.toString() === id){
                post.title = title;
                post.content = content;
                resultPost = post;
                break;
            }
        }

        await author.save();
        return resultPost; 
    }

    async removePost(id, authorname) {
        const author = await this.findAuthorByName(authorname);
        await author.posts.remove(id);
        await author.save();
    }

    static createAuthorModel(){
        const blogPostSchema = new Schema(BlogPost.getSchema());
        const authorSchema = new Schema(Author.getSchema(blogPostSchema));

        return Mongoose.model('Author', authorSchema); 
    }
}

module.exports = DbHandler;