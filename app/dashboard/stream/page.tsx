'use client'
import React, { useState } from 'react';
import { Settings, Users, MessageSquare, Activity, Share2, Mic, Video, LayoutGrid, MonitorOff } from 'lucide-react';

const StreamDashboard: React.FC = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const streamStats = {
    viewers: 1234,
    uptime: '02:45:30',
    bitrate: '6000 kbps',
    fps: '60',
  };

  const recentMessages = [
    { id: 1, user: 'ViewerOne', message: 'Great stream!', time: '2m ago' },
    { id: 2, user: 'ViewerTwo', message: 'How did you do that?', time: '1m ago' },
    { id: 3, user: 'ViewerThree', message: 'Amazing play!', time: '30s ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex h-screen">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Stream Preview */}
          <div className="relative bg-black h-[60vh] rounded-lg m-4">
            <video className="w-full h-full object-cover rounded-lg">
              {/* Stream preview will go here */}
            </video>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-center space-x-4 bg-black/50 p-4 rounded-lg backdrop-blur-sm">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-3 rounded-full ${isMuted ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                  <Mic size={20} />
                </button>
                <button
                  onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                  className={`p-3 rounded-full ${!isVideoEnabled ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                  <Video size={20} />
                </button>
                <button
                  onClick={() => setIsScreenSharing(!isScreenSharing)}
                  className={`p-3 rounded-full ${isScreenSharing ? 'bg-purple-500' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                  <LayoutGrid size={20} />
                </button>
                <button className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-full ml-4">
                  End Stream
                </button>
              </div>
            </div>
          </div>

          {/* Stream Info */}
          <div className="grid grid-cols-4 gap-4 p-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Viewers</span>
                <Users size={18} className="text-purple-400" />
              </div>
              <div className="text-2xl font-bold mt-2">{streamStats.viewers}</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Uptime</span>
                <Activity size={18} className="text-purple-400" />
              </div>
              <div className="text-2xl font-bold mt-2">{streamStats.uptime}</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Bitrate</span>
                <Activity size={18} className="text-purple-400" />
              </div>
              <div className="text-2xl font-bold mt-2">{streamStats.bitrate}</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">FPS</span>
                <Activity size={18} className="text-purple-400" />
              </div>
              <div className="text-2xl font-bold mt-2">{streamStats.fps}</div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-96 border-l border-gray-800">
          {/* Chat Section */}
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-800">
              <h2 className="text-lg font-bold flex items-center">
                <MessageSquare size={20} className="mr-2" /> Live Chat
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {recentMessages.map((msg) => (
                <div key={msg.id} className="bg-gray-800 rounded-lg p-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-purple-400">{msg.user}</span>
                    <span className="text-xs text-gray-500">{msg.time}</span>
                  </div>
                  <p className="text-sm mt-1">{msg.message}</p>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-800">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamDashboard;
