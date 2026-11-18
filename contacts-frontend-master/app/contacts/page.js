"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";

export default function ContactsPage() {
    const router = useRouter();
    const [contacts, setContacts] = useState([]);
    const [form, setForm] = useState({ name: "", email: "", phone: "" });
    const [error, setError] = useState("");

    async function load() {
        try {
            setContacts(await api("/contacts"));
        } catch (err) {
            if (!localStorage.getItem("token")) return router.push("/login");
            setError(err.message);
        }
    }

    useEffect(() => {
        if (!localStorage.getItem("token")) router.push("/login");
        else load();
    }, []);

    async function addContact(e) {
        e.preventDefault();
        setError("");
        try {
            await api("/contacts", { method: "POST", body: form });
            setForm({ name: "", email: "", phone: "" });
            load();
        } catch (err) {
            setError(err.message);
        }
    }

    async function deleteContact(id) {
        await api(`/contacts/${id}`, { method: "DELETE" });
        load();
    }

    function logout() {
        localStorage.removeItem("token");
        router.push("/login");
    }

    return (
        <div className="max-w-xl mx-auto mt-10 p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">My Contacts</h1>
                <button onClick={logout} className="text-sm underline">Log out</button>
            </div>

            <form onSubmit={addContact} className="flex flex-col gap-2 mb-6">
                {["name", "email", "phone"].map((field) => (
                    <input key={field} className="border p-2 rounded" placeholder={field}
                        value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
                ))}
                {error && <p className="text-red-600">{error}</p>}
                <button className="bg-blue-600 text-white p-2 rounded">Add contact</button>
            </form>

            <ul className="flex flex-col gap-2">
                {contacts.map((c) => (
                    <li key={c._id} className="border p-3 rounded flex justify-between">
                        <span>{c.name} · {c.email} · {c.phone}</span>
                        <button onClick={() => deleteContact(c._id)} className="text-red-600">Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
