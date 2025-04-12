'use client';

import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
const AddForm = ({ setTodos, todos, user }) => {
    const [title, setTitle] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            router.push('/signup')
            return;
        }

        console.log({
            title,  // assuming 'todo' is your input value
            completed: false,
            user_id: user.$id ?? null
        })

        try {
            const addtodores = await fetch('http://10.10.21.90:8000/todo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,  // assuming 'todo' is your input value
                    completed: false,
                    user_id: user.$id ?? null
                })
            });

            setTodos([...todos, { id: todos.length + 1, title, completed: false }]);
            setTitle('');
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <input className="border-2 border-gray-300 rounded-md p-2 text-blue-500" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            <button className="bg-blue-500 text-white p-2 rounded-md" onClick={handleSubmit}>Add</button>
        </div>
    )
}

export default AddForm;