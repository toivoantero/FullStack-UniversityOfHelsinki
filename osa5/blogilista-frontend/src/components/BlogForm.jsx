const BlogForm = ({ addBlog, newTitle, newAuthor, newUrl, handleInputChange }) => {

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={addBlog}>
                <div>
                    title:
                    <input
                        value={newTitle}
                        name="newTitle"
                        onChange={handleInputChange}
                    />
                    <br />
                    author:
                    <input
                        value={newAuthor}
                        name="newAuthor"
                        onChange={handleInputChange}
                    />
                    <br />
                    url:
                    <input
                        value={newUrl}
                        name="newUrl"
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <button type="submit">create</button>
                </div>
            </form>
        </div>
    )
}

export default BlogForm