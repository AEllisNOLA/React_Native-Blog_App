import createDataContext from './createDataContext'

const blogReducer = (state, action) => {
    switch (action.type) {
        case 'add_blogpost':
            // return all of the state, then add into it the new post
            return [
                ...state,
                {
                    id: Math.floor(Math.random() * 99999),
                    title: action.payload.title,
                    content: action.payload.content
                }]
        case 'delete_blogpost':
            // iterate through state array. If true is returned, that item is returned in a new array.
            // Every post that doesn't have the id we specify will continue to exist in that new array that is being returned
            return state.filter(blogPost => blogPost.id !== action.payload)
        // map through blogposts. 
        // If correct id, return blogpost inside the action.payload property (the edited one)
        // instead of the being iterated over (the original one)
        // else return original post
        case 'edit_blogpost':
            return state.map(blogPost => {
                return blogPost.id === action.payload.id ? action.payload : blogPost
            })
        default:
            return state
    }
}

const addBlogPost = dispatch => {
    return (title, content, callback) => {
        dispatch({ type: 'add_blogpost', payload: { title, content } })
        if (callback) {
            callback()
        }
    }
}

const deleteBlogPost = dispatch => {
    return (id) => {
        dispatch({ type: 'delete_blogpost', payload: id })
    }
}

const editBlogPost = dispatch => {
    return (id, title, content, callback) => {
        dispatch({ type: 'edit_blogpost', payload: { id, title, content } })
        if (callback) {
            callback()
        }
    }
}

export const { Context, Provider } = createDataContext(
    blogReducer,
    { addBlogPost, deleteBlogPost, editBlogPost },
    [{ title: 'Test Post #1', content: 'Test Content #1', id: 37 }]
)
