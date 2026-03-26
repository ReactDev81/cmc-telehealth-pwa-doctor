"use client";

import { useAuth } from "@/context/userContext";

const Home = () => {

    const { user } = useAuth();
    console.log('user', user)

    return (
        <div className="flex flex-col flex-1 h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <h2>Hi {user?.first_name}</h2>
            <h2>Welcome to CMC Telehealth PWA</h2>
        </div>
    );
}

export default Home