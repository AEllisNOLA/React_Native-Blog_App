# STEPS TO RUNNING PROJECT

1. Run with `npm start`


# STEPS TO GENERATING PROJECT

1. Created using *expo-cli* rather than *react-native-cli*.

a) Run `npx expo-cli init blog`
b) Choose *blank* as template.

2. Fix bug for Windows if version of *Node* is 12.11 or higher.

a) In project, move to *node_modules/metro-config/src/defaults/blacklist.js*.
b) Change 

`var sharedBlacklist = [
  /node_modules[/\\]react[/\\]dist[/\\].*/,
  /website\/node_modules\/.*/,
  /heapCapture\/bundle\.js/,
  /.*\/__tests__\/.*/
];`

to 

`var sharedBlacklist = [
  /node_modules[\/\\]react[\/\\]dist[\/\\].*/,
  /website\/node_modules\/.*/,
  /heapCapture\/bundle\.js/,
  /.*\/__tests__\/.*/
];`

3. Move into project and install dependencies:

a) install react-navigation with `npm install react-navigation`
b) install other dependencies with `expo install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context @react-native-community/masked-view`
c) Install React Navigation Stack with `npm install react-navigation-stack @react-native-community/masked-view`
d) Start app and clear cache with `npm start -c`

# 01. Basic Navigation Setup

# 02. Adding Context

- This project uses *Global State Management*. Data will be centralized within a Blog Post Provider file, allowing all child components to access the data rather than drilling down props. This is possible thanks to React Hooks' new *Context* system. Similar functionality can be implemented with Redux, as well.

1) Wrap *React Navigation Stack Navigator* with *Blog Post Provider*. Rather than simply exporting `export default createAppContainer(navigator)`, assign it to a variable. 

2) Export default a custom component that returns the variable from step 1.

`
const App = createAppContainer(navigator)

export default () => {
  return (
    <App />
  )
}
`

3) Create a new *Context* directory and add *BlogContext.js* In that file, create a pipe for the information, as well as the *Provider* that will house the information. Export the *Provider* as a named export. The *Context* will later be exported as a default.

`
import React, { createContext } from 'react'

/* BlogContext pipes the data from the overarching BlogPostProvider to children components */
const BlogContext = createContext()

/* BlogProvider is the component where the data will be stored */
export const BlogProvider = ({ children }) => {
    return (
        <BlogContext.Provider>
            {children}
        </BlogContext.Provider>
    )
}
`

4) Import *BlogProvider* as a named import in *App.js* and wrap the default export <App /> in the <BlogProvider>

- At this point, the overarching BlogPostProvider is wrapping the React Stack Navigator, which includes the App and all of its components, screens, etc. 

5) In *BlogContext.js*, export default BlogContext.

- <BlogContext.Provider> accepts info through a *value* prop. That value is then accessible by children if it is imported.

6) In a child, import *useContext* from React, as well as the *Context* exported in step 5. Inside of the component, use *useContext()* and pass in the Context you just imported. Such as: 

`const value = useContext(BlogContext)`

Now the information included in the *value* prop in the Provider is funneling down to the child component and that information can be used.

# 03. Integrating State to Provider
- Nothing groundbreaking here. Pretty self-explanatory. Added state within the provider and created a helper function to add a post. Passed the data and the helper function down to the child using a FlatList.

# 04. Implementing useReducer

1) Add a *useReducer* segment within the *Provider*, passing in the *reducer* to use and the *inital state*. Deconstuct the *state* and *dispatch*.
`const [blogPosts, dispatch] = useReducer(blogReducer, [])`

2) Create the *reducer* from step 1 and implement a switch statement.
`
const blogReducer = (state, action) => {
    switch(action.type) {
        case 'add_blogpost':
            return [...state, {title: `Blog Post #${state.length + 1}`}]
        default:
            return state
    }
}
`

3) Temporarily create an addBlogPost helper function. Within the function, dispatch the type you want to use.
`
 const addBlogPost = () => {
        dispatch({ type: 'add_blogpost'})
    }
`

4) Include the helper function in the *Provider*'s value prop.
`
return (
        <BlogContext.Provider value={{ data: blogPosts, addBlogPost}}>
            {children}
        </BlogContext.Provider>
    )
`

# 05. Automating Context Creation
- In situations where you have more than one type of data flowing through the app, it is a good idea to automate new *Context*s to abide by the DRY principle. Many of the steps from *04. Implementing useReducer* would need to be repeated for each *Context* being created.

1) Create a new file, createDataContext.js. Import React, {createContext, useReducer}.

2) Export a function with the arguments of *reducer*, *actions*, and *initialState*

`
import React, {createContext, useReducer} from 'react'

export default (reducer, actions, initialState) => {}
`

3) Within the function created in step 2, create a *Context* object and the *Provider* function. Feed the *Provider* function a destructured *children* argument.
`
const Context = createContext()

const Provider = ({children}) => {}
`

4) Within the body of the *Provider* function set up in step 3, add the useReducer line and pass in the reducer function to use and the initial state. Return the proper JSX with a value prop with state.
`
const Provider = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initalState)

  return (
    <Context.Provider value={{ state }}>
      {children}
    </Context.Provider>
  )
}
`

5) End the overall function by returning the Context object and Provider component

- The process of creating a new Context is now in a reusable function.

6) Refactor BlogContext.js by importing the file created in steps 1-5. Delete the line that creates the BlogContext object and the entire BlogProvider function. Delete the BlogContext export. Instead, export the deconstructed Context object and Provider component from the createDataContext file created in steps 1-5, addung the reducer, action object and initial state needed.

`
export const {Context, Provider} = createDataContext(blogReducer {addBlogPost}, [])
`

7) Dispatch currently lives in the *Provider* component within the generic createDataContext file. To grant access to it in the *Context*, call any helper functions with the *dispatch* argument. Inside the helper function, return a new function that called the dispatch.

`
const addBlogPost = (dispatch) = {
  return () => {
    dispatch({type: 'add_blogpost})
  }
}
`

8) Inside createDataContext.js, the actions object argument has all of the functions that will change the state (i.e. call dispatch). After useReducer is set up, loop through the actions object. For every key, call the dispatch argument with the key. Have that call return a function that will be able to be passed in the value prop of the *Provider* Component. Rather than passing individual functions, the entire boundActions object is being spread in.

`
const boundActions = {}

for (let key in actions) {
    boundActions[key] = actions[key](dispatch)
}


return (
    <Context.Provider value={{ state, ...boundActions }}>
      {children}
    </Context.Provider>
  )
`

9) Most of the work is now done. Since BlogContext.js is exporting Context and Provider, imports and references need to be fixed. 

  a) IndexScreen should import {Context} rather than {BlogContext} and all references to "BlogContext" should be changed to "Context". "data" should be changed to "state" in the useContext initialization, and "state" should be passed into the FlatList as the data source.

  b) In App.js, import {Provider} instead of {BlogProvider}. Change the JSX at the bottom to <Provider> rather than <BlogProvider>

  - All of that work essentially rebuilt *Redux* using React's *Context* system. 

  # 06. Adding Delete Functionality
- Any time you want to add new functionality to the *Context*, you have to: 
  
  1) create a helper function that will call the dispatch function, 
  
  2) add the case to the reducer
  
  3) add the new function to the createDataContext() call in the export area
  
  4) destructure the new helper function in the file you need to use it and apply it.