'use client';

import React, { useEffect, useRef, useState } from 'react'
import { useGlobalContext } from '../hooks/useGlobalContext';
import SyncLoader from 'react-spinners/SyncLoader';
import { account } from '../lib/appwrite';
import { useRouter } from 'next/navigation';
import AddForm from '../components/AddForm';
import Link from 'next/link';

const Page = () => {
    const router = useRouter();
    const { user, setUser, authLoading } = useGlobalContext();
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState(null);
    const [todoLoading, setTodoLoading] = useState(true);
    const fetchedRef = useRef(false);

    const handleLogout = async () => {
        await account.deleteSession('current');
        setUser(null);
        router.push('/signup');
    }

    const handleComplete = async (id) => {
        const { completed } = todos.find(t => t.id === id)

        try {
            const res = await fetch(`http://10.10.21.90:8000/todo/${id}?completed=${!completed ? 1 : 0}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '10.10.21.51'
                },
                body: JSON.stringify({ completed: !completed ? 1 : 0 })
            })
            const data = await res.json()

            if (data) {
                setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
            } else {
                throw new Error('Failed to update todo')
            }

        } catch (error) {
            console.error(error)
        }
    }

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`http://10.10.21.90:8000/todo/${id}`, {
                method: 'DELETE',
            })
            const data = await res.json()

            if (data) {
                setTodos(todos.filter(t => t.id !== id));
            } else {
                throw new Error('Failed to delete todo')
            }
        } catch (error) {
            console.error(error)
        }
    }

    const fetchTodos = async (user_id) => {
        if (fetchedRef.current) return;

        try {
            fetchedRef.current = true;
            const res = await fetch(`http://10.10.21.90:8000/todos?user_id=${user_id}`)
            const data = await res.json()

            if (data.detail) {
                const message = data.detail[0].msg
                setError(message)
                setTodoLoading(false);
                return;
            }

            setTodos(data);
            setTodoLoading(false);
        } catch (error) {
            console.error({ error })
            setError(error)
            setTodoLoading(false);
        }
    }

    useEffect(() => {
        if (user && user.$id) {
            fetchTodos(user.$id)
        }
    }, [user])


    if (authLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <SyncLoader size={24} color="#FFF" />
            </div>
        )
    }

    if (!user) {
        return <div>Please login</div>
    }

    if (todoLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <SyncLoader size={24} color="#FFF" />
            </div>
        )
    }

    console.log({ todos })

    return (
        <div className="p-8">
            <section className="flex flex-col items-center justify-center mb-12"  >
                <h1 className="text-4xl font-bold mb-8">Account</h1>
                <p>{user.email}</p>
                <p>{user.name}</p>
                <p>{user.$id}</p>
                <button onClick={handleLogout}>Logout</button>
                <Link href="/">Home</Link>
            </section>

            <AddForm setTodos={setTodos} todos={todos} user={user} />

            <div className="flex flex-col items-center justify-center">
                {todos && todos.length == 0 ? <p>add some todos</p> : todos.map((todo) => (
                    <div key={todo.id} className="grid grid-cols-5 gap-4 w-full mb-2 shadow-md p-4 rounded-md">
                        <h3 className="col-span-3">{todo.title}</h3>
                        <input className="col-span-1" type="checkbox" checked={todo.completed} onChange={() => handleComplete(todo.id)} />
                        <button className="col-span-1" onClick={() => handleDelete(todo.id)}>Delete</button>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default Page;
