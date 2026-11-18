"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";

export default function LoginPage() {
    const router = useRouter();
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        try {
            const data = await api("/users/login", { method: "POST", body: { userName, password } });
            localStorage.setItem("token", data.accessToken);
            router.push("/contacts");
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-20 flex flex-col gap-3">
            <h1 className="text-2xl font-bold">Login</h1>
            <input className="border p-2 rounded" placeholder="User name" value={userName} onChange={(e) => setUserName(e.target.value)} />
            <input className="border p-2 rounded" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {error && <p className="text-red-600">{error}</p>}
            <button className="bg-blue-600 text-white p-2 rounded">Log in</button>
        </form>
    );
}
