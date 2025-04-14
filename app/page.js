'use client';
import Link from "next/link";
import AddForm from "./components/AddForm";
import { useState, useEffect, useRef } from "react";
import { useGlobalContext } from "./hooks/useGlobalContext";
import SyncLoader from "react-spinners/SyncLoader";
import { account } from "./lib/appwrite";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, setUser, authLoading } = useGlobalContext()
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const fetchedRef = useRef(false);

  const handleLogout = async () => {
    console.log(({ user }))
    const logoutres = await account.deleteSession('current')

    console.log(({ logoutres }))

    if (logoutres) {
      setUser(null)
    } else {
      throw new Error('Failed to logout')
    }
  }

  const fetchAllPublicTodos = async () => {
    if (fetchedRef.current) return;
    const settings = {
      method: "GET",
      headers: {
          'Access-Control-Allow-Origin': '10.10.21.51'
          // 'Access-Control-Allow-Origin': '*'
      }
    }
    try {
      fetchedRef.current = true;
      const res = await fetch('http://10.10.21.90:8000/all_todos', settings)
      const data = await res.json()
      console.log({ data })
      setTodos(data)
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false)
    }
  }

  const dateFormatter = (date) => {
    const options = {
      weekday: 'long',    // Monday
      month: 'long',      // March
      day: 'numeric'      // 1
    };

    return new Date(date).toLocaleDateString('en-US', options);

  }

  useEffect(() => {
    fetchAllPublicTodos()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <SyncLoader size={24} color="#FFF" />
      </div>
    )
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen"><p>{error}</p></div>
  }

  console.log({ todos })

  return (
    <div className="">
      <main className="p-8">

        {user ? (
          <div className="flex flex-row items-center justify-center gap-8">
            <h1 className="text-4xl font-bold mb-8">hi, {user.name}</h1>
            <Link className="text-lg font-bold mb-8" href=" /account">Account</Link>
            <button className="bg-red-500 text-white px-4 py-2 rounded-md mb-4" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <>
            <h1 className="text-4xl font-bold mb-8">Todo list</h1>
            <Link className="text-lg font-bold mb-8" href=" /signup">Login</Link>
          </>
        )}


        <div className="flex flex-col items-center justify-center">
          {todos && todos.length == 0 ? <p>no todos to display</p> : todos.map((todo) => (
            <div key={todo.id} className="grid grid-cols-4 gap-4 w-full mb-2 shadow-md p-4 rounded-md">
              <h3 className="col-span-2">{todo.title}</h3>
              <p className="col-span-1">{todo.name}</p>
              <p className="col-span-1">{dateFormatter(todo.created_at)}</p>
            </div>
          ))}
        </div>
      </main>
    </div >
  );
}
