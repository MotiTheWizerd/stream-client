"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import StreamService, { Stream } from '@/services/streamService';
import WebRTCService from '@/services/webrtc';

export default function LiveChannels() {
  const router = useRouter();
  const [liveChannels, setLiveChannels] = useState<Stream[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const webrtcService = useRef<WebRTCService | null>(null);

  useEffect(() => {
    console.log('[DEBUG] LiveChannels component mounted');
    webrtcService.current = new WebRTCService();
    
    const fetchLiveChannels = async () => {
      try {

        const streamService = StreamService.getInstance();
       
        const streams = await streamService.getActiveStreams();
        console.log('[DEBUG] Active streams received:', streams);
        setLiveChannels(streams.map(stream => ({
          id: stream.id,
          title: stream.title || 'Untitled Stream',
          streamer: stream.streamer || 'Anonymous',
          viewers: stream.viewers || 0,
          thumbnail: stream.thumbnail || '',
          category: stream.category || 'Uncategorized',
          isLive: true
        })));
        setError(null);
      } catch (error) {
        console.error('[DEBUG] Error fetching live channels:', error);
        setError('Failed to load live channels. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLiveChannels();
    const interval = setInterval(fetchLiveChannels, 30000); // Poll every 30 seconds

    return () => {
      console.log('[DEBUG] LiveChannels component unmounting');
      clearInterval(interval);
      // Cleanup WebRTC connections
      if (webrtcService.current) {
        webrtcService.current.stopBroadcast();
      }
    };
  }, []);

  useEffect(() => {
    // Handle stream updates
    if (webrtcService.current) {
      webrtcService.current.onStreamUpdate((streams) => {
        setLiveChannels(streams.map(stream => ({
          id: stream.id,
          title: stream.title || 'Untitled Stream',
          streamer: stream.streamer || 'Anonymous',
          viewers: stream.viewers || 0,
          thumbnail: stream.thumbnail || '',
          category: stream.category || 'Uncategorized',
          isLive: true
        })));
      });

      webrtcService.current.onStreamEnd((streamId) => {
        setLiveChannels(prev => prev.filter(stream => stream.id !== streamId));
      });
    }
  }, []);

  const handleJoinStream = async (streamId: string) => {
    try {
      if (!webrtcService.current) {
        console.error('[DEBUG] WebRTC service not initialized');
        return;
      }

      console.log('[DEBUG] Joining stream with ID:', streamId);
      
      // Generate a unique viewer ID
      const viewerId = `viewer-${Math.random().toString(36).substring(2, 8)}`;
      console.log('[DEBUG] Generated viewer ID:', viewerId);

      // Set up remote stream handler first
      webrtcService.current.onRemoteStream((stream) => {
        console.log('[DEBUG] Received remote stream for:', streamId, 'with tracks:', stream.getTracks().length);
        // Update UI with the stream
        const videoElement = videoRefs.current[streamId];
        if (videoElement) {
          console.log('[DEBUG] Setting srcObject for video element');
          videoElement.srcObject = stream;
          videoElement.play().catch(e => console.error('[DEBUG] Error playing video:', e));
        } else {
          console.error('[DEBUG] Video element not found for stream:', streamId);
        }
      });

      // Join the stream
      await webrtcService.current.joinStream(streamId, viewerId);
      console.log('[DEBUG] Join stream request sent');
      
      // Wait a moment before redirecting to ensure connection is established
      setTimeout(() => {
        router.push(`/stream/${streamId}`);
      }, 1000);
    } catch (error) {
      console.error('[DEBUG] Error joining stream:', error);
      setError('Failed to join stream. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Loading live channels...</p>
        <p className="text-sm text-gray-500 mt-2">Please ensure the server is running on port 5000</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400">{error}</p>
        <p className="text-sm text-gray-500 mt-2">Please check your server connection</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-400">
          {liveChannels.length === 0 
            ? "No live channels at the moment" 
            : `Found ${liveChannels.length} live channel${liveChannels.length === 1 ? '' : 's'}`}
        </p>
        <button 
          onClick={() => {
            const streamId = `test-stream-${Math.random().toString(36).substring(2, 8)}`;
            const userId = `broadcaster-${Math.random().toString(36).substring(2, 8)}`;
            router.push(`/stream/${streamId}?broadcast=true`);
          }}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white"
        >
          Start Test Stream
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {liveChannels.map((channel) => (
        <div
          key={channel.id}
            className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-700 transition-colors"
            onClick={() => handleJoinStream(channel.id)}
          >
            <div className="relative aspect-video">
              <video
                ref={el => { videoRefs.current[channel.id] = el }}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted
              />
              <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-sm">
                LIVE
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">{channel.title}</h3>
              <p className="text-gray-400 text-sm">{channel.streamer}</p>
              <div className="flex items-center mt-2 text-sm text-gray-400">
                <span>{channel.viewers} viewers</span>
                <span className="mx-2">•</span>
                <span>{channel.category}</span>
              </div>
            </div>
          </div>
        ))}
        <div
          key="bird-image"
            className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-700 transition-colors"
          >
            <div className="relative aspect-video">
              <img
                src="https://unsplash.com/s/photos/bird"
                className="w-full h-full object-cover"
                alt="Bird"
              />
              <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-sm">
                Suggested
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">Bird Image</h3>
              <p className="text-gray-400 text-sm">Unsplash</p>
              <div className="flex items-center mt-2 text-sm text-gray-400">
                <span>New</span>
                <span className="mx-2">•</span>
                <span>Nature</span>
              </div>
            </div>
          </div>
          </div>
        </div>
  );
}
