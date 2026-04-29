const _ = require('lodash');
const blog = require('../models/blog');

const dummy = (blogs) => {
    return Array.isArray(blogs) ? 1 : null
}

const totalLikes = (blogs) => {
    const likes = blogs.map(b => b.likes)
    return likes.reduce((total, number) => total + number, 0)
}

const favoriteBlog = (blogs) => {
    return blogs.reduce((prev, current) =>
        (prev.likes > current.likes)
            ? prev
            : current
    )
}

const mostBlogs = (blogs) => {
    const counts = _.countBy(blogs, blog => blog.author)
    const mostBlogsAuthor = _.maxBy(_.keys(counts), key => counts[key])
    const authorAndCount = {
        author: mostBlogsAuthor,
        blogs: counts[mostBlogsAuthor]
    }
    return authorAndCount
}

const mostLikes = (blogs) => {
    // ilman Lodashia:
    /*
        const authorsTotalLikes = blogs.reduce((acc, { author, likes }) => {
            acc[author] = acc[author] || 0 ;
            acc[author] += likes;
            return acc;
        }, {});
    
        const authorMostLikes = Object.entries(authorsTotalLikes).reduce((prev, curr) =>
            (curr[1] > prev[1]) ? curr : prev
        )
    
        return authorMostLikes
    */

    const authorsTotalLikes = _(blogs)
        .groupBy('author')
        .map((group, author) => ({
            author,
            likes: _.sumBy(group, 'likes')
        }))
        .value();
    const authorMostLikes = _.maxBy(authorsTotalLikes, 'likes')

    return authorMostLikes
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}