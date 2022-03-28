class BlogPost {
    #author;
    #title;
    #content;
    #creationDate;

    constructor(author, title, content){
        this.author = author;
        this.title = title;
        this.content = content;
        this.setCreationDate();
    }

    setCreationDate(){
        this.creationDate = new Date();
    }

    getAuthor(){
        return this.#author;
    }
    getTitle(){
        return this.#title;
    }

    getContent(){
        return this.#content;
    }
    getCreationDate(){
        return this.#creationDate;
    }

    getPojo(){
        return{
            author: this.#author,
            title: this.#title,
            content: this.#content,
            creationDate: {
                day: this.#creationDate.getDate(),
                month: this.#creationDate.getMonth(),
                year: this.#creationDate.getYear()
            }
        }
    }

    equals(blogpost){
        //not comparing content. if author title and creation date is the same, its the same post!
        return blogpost.author === this.#author && blogpost.title === this.#title && blogpost.creationDate === this.#creationDate;
    }

    static getSchema(){
        return {
            author: String,
            title: String,
            content: String,
            creationDate: Date
        }
    }
}

module.exports = BlogPost;