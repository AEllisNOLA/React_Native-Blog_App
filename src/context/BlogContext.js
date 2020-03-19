import createDataContext from './createDataContext'

const blogReducer = (state, action) => {
    switch (action.type) {
        case 'add_blogpost':
            // return all of the state, then add into it the new post
            return [...state, { id: Math.floor(Math.random() * 99999), title: `Blog Post #${state.length + 1}` }]
        case 'delete_blogpost':
            // iterate through state array. If true is returned, that item is returned in a new array.
            // Every post that doesn't have the id we specify will continue to exist in that new array that is being returned
            return state.filter(blogPost => blogPost.id !== action.payload)
        default:
            return state
    }
}

const addBlogPost = dispatch => {
    return () => {
        dispatch({ type: 'add_blogpost' })
    }
}

const deleteBlogPost = dispatch => {
    return (id) => {
        dispatch({ type: 'delete_blogpost', payload: id })
    }
}

export const { Context, Provider } = createDataContext(
    blogReducer,
    { addBlogPost, deleteBlogPost },
    []
)