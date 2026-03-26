"use client";

import { useEffect, useState } from "react";
import { Pill, FileUser } from "lucide-react";

const ROOM_URL = "https://cmc-telehealth-ldh.whereby.com/browser-sdk-testing79e91d3f-844e-4538-849a-1617862dcca5?roomKey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZWV0aW5nSWQiOiIxMjU4NDg4NTUiLCJyb29tUmVmZXJlbmNlIjp7InJvb21OYW1lIjoiL2Jyb3dzZXItc2RrLXRlc3Rpbmc3OWU5MWQzZi04NDRlLTQ1MzgtODQ5YS0xNjE3ODYyZGNjYTUiLCJvcmdhbml6YXRpb25JZCI6IjMzNTg5MCJ9LCJpc3MiOiJodHRwczovL2FjY291bnRzLnNydi53aGVyZWJ5LmNvbSIsImlhdCI6MTc3NDQyMjE0Nywicm9vbUtleVR5cGUiOiJtZWV0aW5nSG9zdCJ9.vFNbX0q4kd8ZDi8D6HRJHIK3ymOLj0YM1EemD0Zi_F0";

const VideoCall = () => {

    const [joined, setJoined] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            // Whereby sends postMessage events from the iframe
            if (event.data?.type === "join") {
                setJoined(true);
            }
            if (event.data?.type === "leave") {
                setJoined(false);
                setChatOpen(false);
            }
            // Fires when chat or people panel opens/closes
            if (event.data?.type === "chat_toggle" || event.data?.type === "people_toggle") {
                setChatOpen(event.data?.open ?? false);
                // console.log('toogle', event.data?.open)
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, []);

    console.log('chatOpen', chatOpen)

    return (
        <div className="relative w-full h-screen">

            {/* Whereby iframe — full default Whereby UI */}
            <iframe
                src={ROOM_URL}
                allow="camera; microphone; fullscreen; speaker; display-capture"
                className="w-full h-full border-none"
            />

            {/* Custom buttons — shown only after joining */}
            {joined && (
                <div className={`absolute bottom-1 left-1/2  flex gap-3 z-50 transition-all duration-300 ${chatOpen ? "-translate-x-[200%]" : "-translate-x-[260%]"}`}>

                    <button className="flex flex-col items-center gap-1.5">
                        <div className="w-12 h-12 bg-[#0000008f] rounded-xl flex items-center justify-center">
                            <FileUser color="#fff" />
                        </div>
                        <span className="font-inter font-bold text-xs text-white">Patient</span>
                    </button>

                    <button className="flex flex-col items-center gap-1.5">
                        <div className="w-12 h-12 bg-[#0000008f] rounded-xl flex items-center justify-center">
                            <Pill color="#fff" />
                        </div>
                        <span className="font-inter font-bold text-xs text-white">Prescribe</span>
                    </button>

                </div>
            )}

        </div>
    );
}

export default VideoCall