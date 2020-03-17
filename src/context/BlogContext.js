import React, { createContext, useState } from 'react'

/* BlogContext pipes the data from the overarching Blog Post Provider to children components */
const BlogContext = createContext()

/* BlogProvider is the component where the data will be stored */
export const BlogProvider = ({ children }) => {
    const [blogPosts, setBlogPosts] = useState([])

    const addBlogPost = () => {
        setBlogPosts([...blogPosts, {title: `Blog Post #${blogPosts.length + 1}`}])
    }

    return (
        <BlogContext.Provider value={{ data: blogPosts, addBlogPost}}>
            {children}
        </BlogContext.Provider>
    )
}

export default BlogContext