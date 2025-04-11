import WebRTCService from './webrtc';

export interface Stream {
  id: string;
  title: string;
  streamer: string;
  viewers: number;
  thumbnail: string;
  category: string;
  isLive: boolean;
}

class StreamService {
  private static instance: StreamService;
  private webrtcService: WebRTCService;
  private activeStreams: Map<string, Stream>;

  private constructor() {
    this.webrtcService = new WebRTCService();
    this.activeStreams = new Map();
    this.setupWebRTCListeners();
  }

  public static getInstance(): StreamService {
    if (!StreamService.instance) {
      StreamService.instance = new StreamService();
    }
    return StreamService.instance;
  }

  private setupWebRTCListeners() {
    this.webrtcService.onStreamUpdate((streams) => {
      streams.forEach(stream => {
        this.activeStreams.set(stream.id, {
          id: stream.id,
          title: stream.title || 'Untitled Stream',
          streamer: stream.streamer || 'Anonymous',
          viewers: stream.viewers || 0,
          thumbnail: stream.thumbnail || '/default-thumbnail.jpg',
          category: stream.category || 'Uncategorized',
          isLive: true
        });
      });
    });

    this.webrtcService.onStreamEnd((streamId) => {
      this.activeStreams.delete(streamId);
    });
  }

  public async getActiveStreams(): Promise<Stream[]> {
    const streams = await this.webrtcService.getActiveStreams();
    streams.forEach(stream => {
      this.activeStreams.set(stream.id, {
        id: stream.id,
        title: stream.title || 'Untitled Stream',
        streamer: stream.streamer || 'Anonymous',
        viewers: stream.viewers || 0,
        thumbnail: stream.thumbnail || '/default-thumbnail.jpg',
        category: stream.category || 'Uncategorized',
        isLive: true
      });
    });
    return Array.from(this.activeStreams.values());
  }

  public async startStream(streamId: string, userId: string, streamData: Omit<Stream, 'id' | 'isLive'>): Promise<void> {
    await this.webrtcService.startBroadcast(streamId, userId);
    this.activeStreams.set(streamId, {
      ...streamData,
      id: streamId,
      isLive: true
    });
  }

  public async endStream(streamId: string): Promise<void> {
    await this.webrtcService.stopBroadcast();
    this.activeStreams.delete(streamId);
  }

  public async getStream(streamId: string): Promise<Stream | undefined> {
    return this.activeStreams.get(streamId);
  }
}

export default StreamService; 