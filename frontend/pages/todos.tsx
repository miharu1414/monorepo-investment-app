'use client'

import { Box, Container, VStack, Heading, Input, Button, Text, Checkbox, useToast, HStack } from '@chakra-ui/react'
import { Layout } from '../src/layouts/MainLayout'
import { useState } from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'

const GET_TODOS = gql`
  query GetTodos {
    todos {
      id
      title
      completed
    }
  }
`

const CREATE_TODO = gql`
  mutation CreateTodo($title: String!) {
    createTodo(title: $title) {
      id
      title
      completed
    }
  }
`

const UPDATE_TODO = gql`
  mutation UpdateTodo($id: Int!, $completed: Boolean) {
    updateTodo(id: $id, completed: $completed) {
      id
      title
      completed
    }
  }
`

const DELETE_TODO = gql`
  mutation DeleteTodo($id: Int!) {
    deleteTodo(id: $id) {
      success
    }
  }
`

export default function TodoListPage() {
  const [newTodo, setNewTodo] = useState('')
  const toast = useToast()

  const { data, loading, error } = useQuery(GET_TODOS)

  const [createTodo] = useMutation(CREATE_TODO, {
    update(cache, { data: { createTodo } }) {
      const existingData = cache.readQuery<{ todos: any[] }>({ query: GET_TODOS })
      const existingTodos = existingData?.todos ?? []
      cache.writeQuery({
        query: GET_TODOS,
        data: { todos: [...existingTodos, createTodo] }
      })
    }
  })

  const [updateTodo] = useMutation(UPDATE_TODO)
  const [deleteTodo] = useMutation(DELETE_TODO, {
    update(cache, { data: { deleteTodo } }) {
      const existingData = cache.readQuery<{ todos: any[] }>({ query: GET_TODOS })
      const existingTodos = existingData?.todos ?? []
      cache.writeQuery({
        query: GET_TODOS,
        data: { todos: existingTodos.filter(todo => todo.id !== deleteTodo.id) }
      })
    }
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    try {
      await createTodo({
        variables: { title: newTodo }
      })
      setNewTodo('')
      toast({
        title: "TODOを作成しました",
        status: "success",
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: "エラーが発生しました",
        description: error.message,
        status: "error",
        duration: 3000,
      })
    }
  }

  const handleToggle = async (id: number, completed: boolean) => {
    try {
      await updateTodo({
        variables: { id, completed }
      })
    } catch (error) {
      toast({
        title: "エラーが発生しました",
        description: error.message,
        status: "error",
        duration: 3000,
      })
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteTodo({
        variables: { id }
      })
      toast({
        title: "TODOを削除しました",
        status: "success",
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: "エラーが発生しました",
        description: error.message,
        status: "error",
        duration: 3000,
      })
    }
  }

  if (loading) return <Text>Loading...</Text>
  if (error) return <Text>Error: {error.message}</Text>

  return (
    <Layout>
      <Container maxW="container.sm" py={10}>
        <VStack spacing={8}>
          <Heading>TODOリスト</Heading>
          <Box as="form" w="100%" onSubmit={handleSubmit}>
            <HStack>
              <Input
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="新しいTODOを入力"
              />
              <Button type="submit" colorScheme="blue">
                追加
              </Button>
            </HStack>
          </Box>
          <VStack w="100%" spacing={4} align="stretch">
            {data.todos.map(todo => (
              <HStack key={todo.id} p={4} bg="gray.50" borderRadius="md">
                <Checkbox
                  isChecked={todo.completed}
                  onChange={(e) => handleToggle(todo.id, e.target.checked)}
                />
                <Text flex={1} textDecoration={todo.completed ? "line-through" : "none"}>
                  {todo.title}
                </Text>
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleDelete(todo.id)}
                >
                  削除
                </Button>
              </HStack>
            ))}
          </VStack>
        </VStack>
      </Container>
    </Layout>
  )
}
