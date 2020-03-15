import React, { createContext } from 'react'

/* BlogContext pipes the data from the overarching Blog Post Provider to children components */
const BlogContext = createContext()

/* BlogProvider is the component where the data will be stored */
export const BlogProvider = ({ children }) => {
    return (
        <BlogContext.Provider value={"Funneling data from overarching Provider to child screen component!"}>
            {children}
        </BlogContext.Provider>
    )
}

export default BlogContext