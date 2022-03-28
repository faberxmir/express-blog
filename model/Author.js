class Author {
    #name;
    #birthDate;
    #bio;
    #posts;
    #joinDate;

    constructor(name, birthDate, bio){
        this.#name = name;
        this.#birthDate = birthDate;
        this.#bio = bio;
        this.#posts = [];
        this.#joinDate = new Date();
    }

    getPosts(){
        return this.#posts();
    }

    getPojo() {
        return {
            name: this.#name,
            birthDate: this.#birthDate,
            bio: this.#bio,
            joinDate: this.#joinDate,
            posts: this.#posts,
        }
    }

    /**
     * 
     * @param {Mongoose Schema} postSubSchema 
     * @returns Mongoose Schema
     */
    static getSchema(postSubSchema){
        return {
            name: {type: String, unique: true, required: true},
            birthDate: Date,
            bio: String,
            joinDate: Date,
            posts: [postSubSchema]
        }
    }
}

module.exports = Author;