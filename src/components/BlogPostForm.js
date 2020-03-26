import React, { useState } from 'react'
import { Text, TextInput, StyleSheet, View, Button } from 'react-native'

const BlogPostForm = ({ onSubmit, initialValues }) => {
    // Add local state to make fields controlled components
    const [title, setTitle] = useState(initialValues.title)
    const [content, setContent] = useState(initialValues.content)

    return (
        <View>
            <Text style={styles.label}>Enter Title:</Text>
            <TextInput
                value={title}
                onChangeText={text => setTitle(text)}
                style={styles.input}
            />
            <Text style={styles.label}>Enter Content:</Text>
            <TextInput
                value={content}
                onChangeText={text => setContent(text)}
                style={styles.input}
            />
            <Button
                title='Save Blog Post'
                onPress={() => onSubmit(title, content)}
            />
        </View>
    )
}

BlogPostForm.defaultProps = {
    initialValues: {
        title: "",
        content: ""
    }
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



export default BlogPostForm