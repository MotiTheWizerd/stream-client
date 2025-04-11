"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Users, MessageSquare, Settings, Maximize2, Heart, Share2, Flag, DollarSign, Send } from 'lucide-react';
import WebRTCService from '@/services/webrtc';
import { useSearchParams, useParams } from 'next/navigation';

const Page = () => {
  const searchParams = useSearchParams();
  const params = useParams();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [quality, setQuality] = useState('1080p');
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const webrtcService = useRef<WebRTCService | null>(null);
  const userId = useRef<string>(Math.random().toString(36).substring(7));

  const streamInfo = {
    title: "Amazing Gameplay Stream",
    streamer: "ProGamer123",
    viewers: viewerCount,
    category: "Gaming",
    isLive: isStreaming
  };

  const recentMessages = [
    { id: 1, user: 'ViewerOne', message: 'Great stream!', time: '2m ago' },
    { id: 2, user: 'ViewerTwo', message: 'How did you do that?', time: '1m ago' },
    { id: 3, user: 'ViewerThree', message: 'Amazing play!', time: '30s ago' },
  ];

  useEffect(() => {
    // Initialize WebRTC service
    console.log('[DEBUG] Stream page mounted, initializing WebRTC');
    webrtcService.current = new WebRTCService();

    // Check if user is the broadcaster
    const isBroadcaster = searchParams.get('broadcast') === 'true';
    console.log('[DEBUG] Is broadcaster:', isBroadcaster);
    
    if (isBroadcaster) {
      startBroadcast();
    } else {
      joinStream();
    }

    return () => {
      console.log('[DEBUG] Stream page unmounting, cleaning up');
      if (webrtcService.current) {
        webrtcService.current.stopBroadcast();
      }
    };
  }, [searchParams]);

  const startBroadcast = async () => {
    try {
      const streamId = params.streamId as string;
      console.log('[DEBUG] Starting broadcast with ID:', streamId);
      
      await webrtcService.current?.startBroadcast(streamId, userId.current);
      setIsStreaming(true);
      
      const localStream = webrtcService.current?.getLocalStream();
      if (localStream && videoRef.current) {
        console.log('[DEBUG] Setting local stream to video element');
        videoRef.current.srcObject = localStream;
        videoRef.current.muted = true; // Mute local video to prevent feedback
      } else {
        console.error('[DEBUG] Failed to get local stream or video element not ready');
      }
    } catch (error) {
      console.error('[DEBUG] Error starting broadcast:', error);
    }
  };

  const joinStream = async () => {
    try {
      const streamId = params.streamId as string;
      console.log('[DEBUG] Joining stream with ID:', streamId);
      
      // Set up remote stream handler first
      webrtcService.current?.onRemoteStream((stream) => {
        console.log('[DEBUG] Received remote stream with', stream.getTracks().length, 'tracks');
        if (videoRef.current) {
          console.log('[DEBUG] Setting remote stream to video element');
          videoRef.current.srcObject = stream;
          setIsStreaming(true);
        } else {
          console.error('[DEBUG] Video element not ready');
        }
      });
      
      // Then join the stream
      await webrtcService.current?.joinStream(streamId, userId.current);
      console.log('[DEBUG] Join stream request sent');
    } catch (error) {
      console.error('[DEBUG] Error joining stream:', error);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (!document.fullscreenElement) {
        videoRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const handleEndStream = () => {
    if (webrtcService.current) {
      webrtcService.current.stopBroadcast();
      setIsStreaming(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex h-screen">
        {/* Main Stream Content */}
        <div className={`flex-1 flex flex-col ${!isChatVisible ? 'w-full' : ''}`}>
          {/* Stream Video */}
          <div className="relative bg-black h-[calc(100vh-120px)]">
            <video 
              ref={videoRef}
              className="w-full h-full object-contain"
              autoPlay
              playsInline
            />
            
            {/* Stream Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
              <div className="flex items-center justify-between">
                {/* Streamer Info */}
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-purple-500"></div>
                  <div>
                    <h3 className="font-bold">{streamInfo.title}</h3>
                    <p className="text-sm text-gray-300">{streamInfo.streamer}</p>
                  </div>
                </div>

                {/* Stream Actions */}
                <div className="flex items-center space-x-4">
                  <button onClick={() => setIsLiked(!isLiked)} 
                    className={`p-2 rounded-full ${isLiked ? 'bg-red-500' : 'bg-gray-800/60 hover:bg-gray-700/60'}`}>
                    <Heart size={20} fill={isLiked ? "white" : "none"} />
                  </button>
                  <button className="p-2 rounded-full bg-gray-800/60 hover:bg-gray-700/60">
                    <Share2 size={20} />
                  </button>
                  <button className="p-2 rounded-full bg-gray-800/60 hover:bg-gray-700/60">
                    <Flag size={20} />
                  </button>
                  <button onClick={handleFullscreen} 
                    className="p-2 rounded-full bg-gray-800/60 hover:bg-gray-700/60">
                    <Maximize2 size={20} />
                  </button>
                  <button onClick={() => setIsDonationModalOpen(true)} 
                    className="p-2 rounded-full bg-gray-800/60 hover:bg-gray-700/60">
                    <DollarSign size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stream Info Bar */}
          <div className="bg-gray-800 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="bg-red-500 px-2 py-1 rounded text-sm">LIVE</span>
              <span className="flex items-center">
                <Users size={16} className="mr-2" />
                {streamInfo.viewers.toLocaleString()}
              </span>
              <span>{streamInfo.category}</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <select 
                className="bg-gray-700 rounded px-3 py-1"
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
              >
                <option value="1080p">1080p</option>
                <option value="720p">720p</option>
                <option value="480p">480p</option>
                <option value="360p">360p</option>
              </select>
              <button 
                onClick={() => setIsChatVisible(!isChatVisible)}
                className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded flex items-center"
              >
                <MessageSquare size={16} className="mr-2" />
                {isChatVisible ? 'Hide Chat' : 'Show Chat'}
              </button>
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        {isChatVisible && (
          <div className="w-96 border-l border-gray-800 flex flex-col">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center">
                <MessageSquare size={20} className="mr-2" /> Live Chat
              </h2>
              <button className="p-2 hover:bg-gray-800 rounded-full">
                <Settings size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {recentMessages.map((msg) => (
                <div key={msg.id} className="bg-gray-800/50 rounded-lg p-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-purple-400">{msg.user}</span>
                    <span className="text-xs text-gray-500">{msg.time}</span>
                  </div>
                  <p className="text-sm mt-1">{msg.message}</p>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-800">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Send a message..."
                  className="flex-1 bg-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg">
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Donation Modal */}
      {isDonationModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Donate to {streamInfo.streamer}</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Amount</label>
                <input
                  type="number"
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter amount"
                />
              </div>
              <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 rounded-lg px-4 py-2">
                Donate
              </button>
            </form>
            <button
              onClick={() => setIsDonationModalOpen(false)}
              className="mt-4 w-full bg-gray-700 hover:bg-gray-600 rounded-lg px-4 py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;