"use client";

import { useRouter } from "next/router";

export default function MainPage() {
  const router = useRouter();

  const handleStartStream = () => {
    router.push("/streamer");
  };

  const handleViewStream = () => {
    const streamId = prompt("Enter Stream ID:");
    if (streamId) {
      router.push(`/viewer?streamId=${streamId}`);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Streaming Test with WebRTC</h1>
      <button onClick={handleStartStream} style={{ padding: "10px 20px", marginTop: "10px" }}>
        Start Stream
      </button>
      <br />
      <button onClick={handleViewStream} style={{ padding: "10px 20px", marginTop: "10px" }}>
        View Stream
      </button>
    </div>
  );
}
