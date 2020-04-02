import createDataContext from './createDataContext'
import jsonServer from '../api/jsonServer'

const blogReducer = (state, action) => {
    switch (action.type) {
        case 'get_blogposts':
            return action.payload

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

const getBlogPosts = dispatch => {
    return async () => {
        const response = await jsonServer.get('/blogposts')

        dispatch({ type: 'get_blogposts', payload: response.data })
    }
}

const addBlogPost = dispatch => {
    return async (title, content, callback) => {
        await jsonServer.post('/blogposts', { title, content })

        if (callback) {
            callback()
        }
    }
}

const deleteBlogPost = dispatch => {
    return async (id) => {
        await jsonServer.delete(`/blogposts/${id}`)

        dispatch({ type: 'delete_blogpost', payload: id })
    }
}

const editBlogPost = dispatch => {
    return async (id, title, content, callback) => {
        await jsonServer.put(`/blogposts/${id}`, { title, content })

        dispatch({ type: 'edit_blogpost', payload: { id, title, content } })

        if (callback) {
            callback()
        }
    }
}

export const { Context, Provider } = createDataContext(
    blogReducer,
    { addBlogPost, deleteBlogPost, editBlogPost, getBlogPosts },
    []
)
