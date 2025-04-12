"use client";

import { useState } from "react";
import { account, ID } from "../lib/appwrite";
import React from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState(null);
    const router = useRouter();

    const login = async (email, password) => {
        const session = await account.createEmailPasswordSession(email, password);
        console.log({ session })
        const userAccount = await account.get();
        setLoggedInUser(userAccount);
        router.push('/');
    };

    const register = async () => {
        try {
            const appwriteUser = await account.create(ID.unique(), email, password, name);
            // console.log({ appwriteUser });

            const saveUserToDb = await fetch('http://10.10.21.90:8000/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, name, uuid: appwriteUser.$id }),
            })
            login(email, password);
        } catch (error) {
            setError(error.message);
            console.log({ error });
        }

    };

    const logout = async () => {
        await account.deleteSession("current");
        setLoggedInUser(null);
    };

    if (loggedInUser) {
        return (
            <div>
                <p>Logged in as {loggedInUser.name}</p>
                <button type="button" onClick={logout}>
                    Logout
                </button>
            </div>
        );
    }

    return (
        <div>
            {error && <p>{error}</p>}
            <form className="flex flex-col gap-2 w-1/2 mx-auto">
                <label>email</label>
                <input
                    className="border-2 border-gray-300 rounded-md p-2 text-black"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label>password</label>
                <input
                    className="border-2 border-gray-300 rounded-md p-2 text-black"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <label>name</label>
                <input
                    className="border-2 border-gray-300 rounded-md p-2 text-black"
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button type="button" onClick={() => login(email, password)}>
                    Login
                </button>
                <button type="button" onClick={register}>
                    Register
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
