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

1) Create an inital Component Screen to display.

`
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const IndexScreen = () => {
  return (
    <View>
      <Text>Hello, World!</Text>
    </View>
  )
}

const styles = StyleSheet.create({})

export default IndexScreen
`

2) In App.js, import createStackNavigator from 'react-navigation' and createAppContainer from 'react-navigation-stack'. Also import the initial screen created in step 1.

3) Create naviator variable using createStackNavigator. In the first object argument, pass the screen created in step 1 as a key/value. In the second object argument, add any configuration options you wish to include, such as the inital route and navigation options.

`
const navigator = createStackNavigator({
  Index: IndexScreen
}, {
  initialRouteName: 'Index',
  defaultNavigationOptions: {
    title: 'Blogs'
  }
})
`

4) Lasly, `export default createAppContainer(navigator)`


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

# 07. Navigating and Showing Individual Posts
  1) Create a new screen (the destination screen) for individual posts. Import that component into App.js and include it in the first argument object of createStackNavigator().

  2) In screens that are going to use navigation (the origin screen), you must import the navigation function from the included prop object. Destructure {navigation} as an argument.

  3) The navigation() function can be used with an onPress attribute in the origin screen. Include a string of where to navigate to (added to App.js in step 1) as the first argument. An optional second argument object allows for passing information to the destination screen, such as an id or title.

  4) In the destination screen, pass {navigation} as a prop as well. To retrieve the information passed from the origin screen in step 3, use navigation.getParam('id') or whatever key you are looking for.

  - Those steps hand off information from the origin screen to the destination screen. To access the state, the destination screen has to tap into the context. Done this before, but a quick recap:

  5) Import *useContext* and the context you wish to tap into. Desctructure out the state (coming from the value property in the Context file) from useContext(ContextName)

  6) From here, use the find method on state and return the proper post by making sure the item's id and the id passed from the origin screen are the same.

  `
  const blogPost = state.find(blogPost => blogPost.id === navigation.getParam('id'))
  `

# 08. Header Navigation
- Navigation within the header is fairly similar to ordinary navigation with a few wrinkles.

  1) Create the new destination screen, import and export as necessary and add it to the stackNavigator object in App.js.

  2) Within the origin screen (with the header you wish to add navigation to), outside of the functional component you can add a function that will be called automatically whenever the origin screen is about to be displayed. This object can return customization details for the header. Return a <TouchableOpacity> with an icon inside. 
  
  3) The new function also has access to the same navigattion prop as the regular component does. Use it to give the <TouchableOpacity> an onPress={} with navigation instructions.

  `
  IndexScreen.navigationOptions = ({navigation}) => {
    return {
      headerRight: () => <TouchableOpacity onPress={() => navigation.navigate('Go here')}>ICON HERE</TouchableOpacity>
    }
  }
  `

  
# 09. Saving a New Post
  1) Add requisite <Text />, <TextInput /> and <Button /> fields to screen. Add local state for each input in order to make them controlled inputs. Give each <TextInput /> a value to match the state. Add an onChangeText to update state.

  `
  const [title, setTitle] = useState('')

  return (
    <View>
      <Text>Enter Title:</Text>
      <TextInput value={title} onChangeText={text => setTitle(text)}></TextInput>
      <Button title="Add Blog Post" />
    </View>
  
  )
  `
  
  2) Style all the things!

  3) In BlogContext.js, alter the addBlogPost helper function. Give the return function requisite arguments, such as 'title'. Add those arguments to the payload property within the dispatch function's argument object.

  `
  const addBlogPost = dispatch => {
    return (title) => {
      dispatch({ type: 'add_blogpost', payload: title })
    }
  }
  `

  4) Alter the reducer case to use the arguments from step 3.

  `
  case 'add_blogpost':
    return [...state, {title: action.payload.title}]
  `

  5) In the screen with the form, import the { Context } and call useContext for it, bringing in anything you may be using. In this case, only addBlogPost is being used.

  `
  const {addBlogPost} = useContext(Context)
  `

  6) Add the function to the button with the items it is posting as arguments.

  `
  <Button title="Add Blog Post" onPress={() => addBlogPost(title)}/>
  `

  - At this point, new posts are appearing. A good user feature is to automatically navigate back on save. An easy way to do that would just be to call navigation.navigate() within the onPress handler, but this will not work when APIs are implemented because those are not instanteous. The following is the better way to do it and will work with APIs, databases, etc.

  7) Pass a callback as part of the addBlogPost function in the onPress handler.

    `
  <Button 
    title="Add Blog Post" 
    onPress={() => {
      addBlogPost(title, () => navigation.navigate('Index'))
    }}/>
  `
  
  8) Alter the addBlogPost() helper function in the BlogContext.js file.

    `
  const addBlogPost = dispatch => {
    return (title, callback) => {
      dispatch({ type: 'add_blogpost', payload: title })
      callback()
    }
  }
  `

  That is all that is needed now, but to tie it in with an API, it would look more like:

  `
    const addBlogPost = dispatch => {
    return async (title, callback) => {
      try {
        await axios.post(...)
        dispatch({ type: 'add_blogpost', payload: title })
        callback()
      }
      catch (error) {
        console.log(`Error: ${error}`)
      }
      
    }
  }
  
  `
  
# 10. Editing a Post (Part 1)

   1) Add an edit icon to the top of ShowScreen using navigationOptions. Pass *navigation* as a destructured argument and feed the <TouchableOpacity> an *onPress* with the proper destination screen that has yet to be created using navigation.navigate(). Create the new destination, EditScreen. Import EditScreen into App.js and add it into the createStackNavigator. Confirm that tapping the edit icon on in ShowScreen brings you to the EditScreen. This shouldn't be anything new.

   2) The IndexScreen is already passing the ShowScreen the post id via navigation.navigate() and ShowScreen is already using that id via navigation.getParam(). Because of that, you can extend the navigation.navigate() call in the Edit Icon's <TouchableOpacity> to include the id, as well, such as:

  `
  <TouchableOpacity onPress={() => navigation.navigate('Edit', { id: navigation.getParam('id') })}>
    <Feather name="edit-2" style={styles.editIcon} />
  </TouchableOpacity>
  `

  3) Now the EditScreen can receiving that id using navigation.getParam(). The EditScreen now knows which blog post it should be editing.

  4) Upon render, EditScreen needs to retrieve the blog post being edited from Context and populate the state. Import useState() and useContext() from React and the Context from its context file. Find the proper post from the array of posts being retrieved from the context. Initialize state with the blog post.

  `
  const {state} = useContext(Context)
  const blogPost = state.find(blogPost => blogPost.id === navigation.getParam('id'))

  const [title, setTitle] = useState(blogPost.title)
  `

  5) Create a form and make it a controlled component.

  `
  <Text>Edit Title:</Text>
  <TextInput value={title} onChangeText={newTitle => setTitle(newTitle)}>
  `
   
  
# 11. Editing a Post (Part 2)

## Since CreateScreen and EditScreen are showing the same form, it would be smart to extract that form into a reusable component. There will be a slight wrinkle in that the form must behave differently when displayed in each screen.

1) Add all boilerplate. Return the form. Import any needed elements such as TextInput or Button, or styles referenced.

2) Identify the items that will need to behave differently. For this example, the onSubmit would be different and the inital form values would be different.

3) Add state to the form, since all components should be controlled. Remember to import useState.

4) The screen can now be imported and placed on different screens as a JSX element once imported.

## Customizing form for onSubmit via props for the CreateScreen

1) Give the CreateScreen component a destructured navigation argument for use later.

2) As a prop to <BlogPostForm /> in CreateScreen, add an onSubmit function. Give that function the arguments of title and content, since CreateScreen does not know what the title/content are.

3) Inside of that function, call addBlogPost. Pass in the arguments of title, content, and a callback function that will navigate upon submission.

`
const CreateScreen = ({navigation}) => {
  return <BlogPostForm onSubmit={(title, content) => {
        addBlogPost(title, content, () => navigation.navigate('Index'))
    }} />
}
 
`

4) Destructure {onSubmit} as a prop in the BlogPostForm component. Next, in the button, add an onPress prop that runs the onSubmit prop with the title and content passed in.

## Customizing form for onSubmit via props for the EditScreen

1) Make sure the EditScreen has a destructured navigation prop. Add an onSubmit prop to the form, feeding it the title and content as arguments. Basically mirroring steps 1 & 2 for customizing the CreateScreen.

2) Also include an initialValues prop to the form so that the fields will be prepopulated with the current state.

`
return <BlogPostForm 
          intialValues={{title: blogPost.title, content: blogPost.content}} 
          onSubmit={(title, content) => {

          }} 
        />
`

3) In BlogPostForm, add a destructured initialValues as a prop. Add those initialValues to the relevant state.

4) Step 3 will cause an error because in CreateScreen will have intialValues is undefined. Use default props to make sure initialValues is never undefined.

`
BlogPostForm.defaultProps = {
  initialValues: {
    title: "",
    content: ""
  }
}
`

## Completing the Edit Action
1) In BlogContext, create an editBlogPost action. Pass the inner function title, content and id arguments.

`
const editBlogPost = dispatch => {
  return (id, title, content) => {
    dispatch({type: 'edit_blogpost', payload: {id, title, content}})
  }
}
`

2) Include editBlogPost in the createDataContext object being exported for use.

3) In the EditScreen, you can now pull off editBlogPost from state and use it in the onSubmit callback. Also add navigation.pop() to pop back to the prior screen upon submission. NOTE: for readability sake, id has been assigned to a variable rather than constantly using navigation.getParam()

`
const EditScreen = ({ navigation }) => {
    const id = navigation.getParam('id')
    const { state, editBlogPost } = useContext(Context)

    const blogPost = state.find(blogPost => blogPost.id === id)

    return <BlogPostForm
        initialValues={{ title: blogPost.title, content: blogPost.content }}
        onSubmit={(title, content) => {
            editBlogPost(id, title, content)
        }} />
}
`

4) Create the 'edit_blogpost' case statement in the reducer. 

`
// map through blogposts. 
// If correct id, return blogpost inside the action.payload property (the edited one)
// instead of the being iterated over (the original one)
// else return original post

case 'edit_blogpost':
  return state.map(blogPost => {
    return blogPost.id === action.payload.id ? action.payload : blogPost
  })
`

5) To navigate back after editing, you can add a fourth argument into the editBlogPost call in the onSubmit of: () => navigation.pop()

`
return <BlogPostForm
          initialValues={{ title: blogPost.title, content: blogPost.content }}
          onSubmit={(title, content) => {
            editBlogPost(id, title, content, () => navigation.pop())
            }} 
          />
`

Then, in the editBlogPost function, add a callback agrument and call it. 

Note: the if (callback) statement has been added to all instances that use that callback mechanism for safety's sake. For example, if that function were to be called without a callback, the app would crash.

`
const editBlogPost = dispatch => {
    return (id, title, content, callback) => {
        dispatch({ type: 'edit_blogpost', payload: { id, title, content } })
        if (callback) {
            callback()
        }
    }
}
`

# 12. Saving to Outside API

## Instalation
*JSON Server* is only good for development purposes, but it gets the general idea across. However, when used with React Native it is a bit more complicated and it is a good idea to pair it with *ngrok* to avoid having to configure your computer. 

1) Create a *jsonserver* folder outside of the project. Move into that folder and *npm init* to generate a new package.json file.

2) *npm install json-server ngrok*

3) In *jsonserver* folder, create the *db.json* file. Create an endpoint for the blogposts data with an empty array.

`
{
  "blogposts": []
}
`

4) In the *package.json* file of *jsonserver*, add a few new scripts. By default, json-server runs on port 3000. I customized it to run on 3002.

`
  "db": "json-server -w db.json -p 3002",
  "tunnel": "ngrok http 3002"
`

5) Pull up two different cmd screens (for Windows). *npm run db* in the first. If no errors, this gets the local server up and running at the port in the script. 

6) *npm run tunnel* in the second. This is going to take the local json-server and make it available outside of its locale, (i.e. your phone). it gives a random 8-hour http address that is a duplicate of your local host. The phone can use that address.

# 13. REST

## Setting up the Endpoint

1) First off, *npm install axios*

The non-REST flow is:
  a) IndexScreen gets displayed by React Navigation
  b) IndexScreen looks to Context Object to get data
  c) IndexScreen renders blog posts

But now, it will be
  a) IndexScreen gets displayed by ReactNavigation
  b) IndexScreen makes request to JSON-Server to get data
  c) Index receives data (but it is probably empty)
  d) Time passes for request to complete.
  e) Data from JSON-server is stored through the useReducer hook
  f) State changed, rerender. Now the actual list of posts shows.

2) Create an *api* folder in *src* and create *jsonServer.js*. Import axios and export a created endpoint.

`
import axios from 'axios'

export default axios.create({
    baseURL: 'http://7d109c4c.ngrok.io/'
})
`

3) import *jsonSever.js* into *BlogContext.js*. Now everything is ready to make requests within *BlogContext.js*


## Reaching Out to Show All Posts

1) Create a new action function to make request, *GET* response and dispatch an action.

`
const getBlogPosts = dispatch => {
    return async () => {
        const response = await jsonServer.get('/blogposts')

        dispatch({ type: 'get_blogposts', payload: response.data })
    }
}
`

2) Add the case to the reducer. A response from the API is the total source of truth of data, so there is no reason to add the *[]* to dictate it is an array or *...state* to add it to existing state. What comes back from the API should be all that is needed or else you're doing it wrong.

`
 case 'get_blogposts':
            return action.payload
`

3) Add the *getBlogPosts* action function to the export object

4) Destructure *getBlogPosts* for use within the index screen. Call it from within a useEffect hook to keep from producing an infinite loop, with an array as the second argument to mandate it runs only once.

`const { state, deleteBlogPost, getBlogPosts } = useContext(Context)

    useEffect(() => {
        // Get blog posts on load
        getBlogPosts()
    }, [])
`

## Creating Posts

1) Refactor *addBlogPost* in *BlogContext.js* to make a *POST* request. Posts will appear in the API and the app will navigate back, but the newly created blog post will not appear.

`
const addBlogPost = dispatch => {
    return async (title, content, callback) => {
        await jsonServer.post('/blogposts', {title, content})

        if (callback) {
            callback()
        }
    }
}
`

 Note: The dispatch statement that was formerly in the code is no longer needed, so it can be removed. As can the case for 'add_blogpost'. In the new version, any time a blog post is added, the endpoint is called, navigation back to the IndexScreen occurs, and the IndexScreen refreshes the list of posts.

3) The reason the newly created post is not showing is due to the *useEffect* hook in *IndexScreen*. When navigating between screens in React Navigation, screens don't just stop existing. Just because the *IndexScreen* is out of sight does not mean it is gone. When it reappears due to the navigating back after post creation, it does not re-render and get state because it never left.

The fix is to use the *didFocus*  listener that is included with React Navigation. Now whenever the screen is brought back to front-and-center, *getBlogPosts()* will run again.

Then, clean up your mess by returning a function within the useEffect() hook to remove the listener.

`
useEffect(() => {
        // Get blog posts on load
        getBlogPosts()

        // Get blog posts any time the Index Screen is front-and-center
        const listener = navigation.addListener('didFocus', () => {
            getBlogPosts()
        })

        // Clean up listener to prevent memory leak
        return () => {
            listener.remove()
        }
    }, [])
`

## Deleting a Post

1) Refactor *deleteBlogPost* in *BlogContext.js* to make a *DELETE* request. 

`
const deleteBlogPost = dispatch => {
    return async (id) => {
        await jsonServer.delete(`/blogposts/${id}`)

        dispatch({ type: 'delete_blogpost', payload: id })
    }
}
`

## Editing a Post
1) Refactor *editBlogPost* in *BlogContext.js* to make a *PUT* request. As arguments, feed it the blog post with the id as wekk as the new title and content.

`
const editBlogPost = dispatch => {
    return async (id, title, content, callback) => {
        await jsonServer.put(`/blogposts/${id}`, { title, content })

        dispatch({ type: 'edit_blogpost', payload: { id, title, content } })

        if (callback) {
            callback()
        }
    }
}
`