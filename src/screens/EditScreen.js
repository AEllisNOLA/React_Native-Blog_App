import React, { useState, useContext } from 'react'
import { View, StyleSheet, Text, TextInput } from 'react-native'
import { Context } from '../context/BlogContext'

const EditScreen = ({ navigation }) => {
    const { state } = useContext(Context)

    const blogPost = state.find(blogPost => blogPost.id === navigation.getParam('id'))

    const [title, setTitle] = useState(blogPost.title)
    const [content, setContent] = useState(blogPost.content)


    return (
        <View>
            <Text style={styles.label}>Edit Title:</Text>
            <TextInput
                value={title}
                onChangeText={newTitle => setTitle(newTitle)}
                style={styles.input}
            />
            <Text style={styles.label}>Edit Content:</Text>
            <TextInput
                value={content}
                onChangeText={newContent => setContent(newContent)}
                style={styles.input}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        fontSize: 18,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        marginBottom: 15,
        margin: 5,
        padding: 5

    },
    label: {
        fontSize: 20,
        marginBottom: 5,
        marginLeft: 5
    }
})

export default EditScreen