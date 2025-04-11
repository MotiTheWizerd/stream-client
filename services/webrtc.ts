import { io, Socket } from "socket.io-client";

interface WebRTCConfig {
  iceServers: RTCIceServer[];
}

interface StreamInfo {
  id: string;
  title?: string;
  streamer?: string;
  viewers?: number;
  thumbnail?: string;
  category?: string;
}

class WebRTCService {
  private socket: Socket;
  private peerConnections: Map<string, RTCPeerConnection>;
  private localStream: MediaStream | null;
  private config: WebRTCConfig;
  private onRemoteStreamCallback: ((stream: MediaStream) => void) | null;
  private onStreamUpdateCallback: ((streams: StreamInfo[]) => void) | null;
  private onStreamEndCallback: ((streamId: string) => void) | null;
  private isConnected: boolean = false;
  private connectionPromise: {
    resolve: () => void;
    reject: (error: Error) => void;
  } | null = null;

  constructor() {
    const serverUrl =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.NEXT_PUBLIC_SERVER_URL ||
      "http://localhost:5000";

    this.socket = io(serverUrl, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
      transports: ["websocket", "polling"],
      autoConnect: true,
      forceNew: true,
    });

    this.peerConnections = new Map();
    this.localStream = null;
    this.onRemoteStreamCallback = null;
    this.onStreamUpdateCallback = null;
    this.onStreamEndCallback = null;
    this.config = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    };
    this.setupSocketHandlers();
  }

  private setupSocketHandlers() {
    this.socket.on("connect", () => {
      console.log("Socket.IO connected successfully");
      this.isConnected = true;
      if (this.connectionPromise) {
        this.connectionPromise.resolve();
        this.connectionPromise = null;
      }
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error);
      this.isConnected = false;
      if (this.connectionPromise) {
        this.connectionPromise.reject(error);
        this.connectionPromise = null;
      }
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Socket.IO disconnected:", reason);
      this.isConnected = false;
    });

    this.socket.on("reconnect", (attemptNumber) => {
      console.log("Socket.IO reconnected after", attemptNumber, "attempts");
      this.isConnected = true;
    });

    this.socket.on("reconnect_error", (error) => {
      console.error("Socket.IO reconnection error:", error);
    });

    this.socket.on("reconnect_failed", () => {
      console.error("Socket.IO reconnection failed");
      this.isConnected = false;
    });

    this.socket.on("offer", async ({ offer, userId }) => {
      await this.handleOffer(offer, userId);
    });

    this.socket.on("answer", async ({ answer, userId }) => {
      await this.handleAnswer(answer, userId);
    });

    this.socket.on("ice-candidate", async ({ candidate, userId }) => {
      await this.handleIceCandidate(candidate, userId);
    });

    this.socket.on("stream-ended", (streamId: string) => {
      this.stopBroadcast();
      if (this.onStreamEndCallback) {
        this.onStreamEndCallback(streamId);
      }
    });

    this.socket.on("stream-update", (streams: StreamInfo[]) => {
      if (this.onStreamUpdateCallback) {
        this.onStreamUpdateCallback(streams);
      }
    });

    this.socket.on("stream-started", async ({ streamId, userId }) => {
      console.log("Stream started:", { streamId, userId });
      await this.createPeerConnection(streamId, userId);
    });
  }

  private async createPeerConnection(streamId: string, userId: string) {
    console.log(
      "[DEBUG] Creating peer connection for stream:",
      streamId,
      "and user:",
      userId
    );
    const peerConnection = new RTCPeerConnection(this.config);
    this.peerConnections.set(userId, peerConnection);

    // Set up event handlers for the peer connection
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("[DEBUG] Sending ICE candidate to:", userId);
        this.socket.emit("ice-candidate", {
          streamId,
          candidate: event.candidate,
          userId,
        });
      }
    };

    peerConnection.onconnectionstatechange = () => {
      console.log(
        "[DEBUG] Connection state changed:",
        peerConnection.connectionState
      );
    };

    peerConnection.oniceconnectionstatechange = () => {
      console.log(
        "[DEBUG] ICE connection state changed:",
        peerConnection.iceConnectionState
      );
    };

    peerConnection.ontrack = (event) => {
      console.log(
        "[DEBUG] Received remote track:",
        event.streams.length,
        "streams"
      );
      if (this.onRemoteStreamCallback && event.streams && event.streams[0]) {
        console.log(
          "[DEBUG] Calling remote stream callback with stream:",
          event.streams[0].id
        );
        this.onRemoteStreamCallback(event.streams[0]);
      }
    };

    // If we're the broadcaster, add our tracks to the connection
    if (this.localStream) {
      console.log("[DEBUG] Adding local tracks to new peer connection");
      this.localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, this.localStream!);
      });
    }

    // Create and send offer
    console.log("[DEBUG] Creating offer for peer connection");
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    console.log("[DEBUG] Sending offer to user:", userId);
    this.socket.emit("offer", {
      streamId,
      offer,
      userId,
    });
  }

  private async handleOffer(offer: RTCSessionDescriptionInit, userId: string) {
    console.log("Received offer:", { userId });
    const peerConnection = new RTCPeerConnection(this.config);
    this.peerConnections.set(userId, peerConnection);

    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, this.localStream!);
      });
    }

    peerConnection.ontrack = (event) => {
      console.log("Received remote track:", event);
      if (this.onRemoteStreamCallback) {
        this.onRemoteStreamCallback(event.streams[0]);
      }
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit("ice-candidate", {
          streamId: this.socket.id,
          candidate: event.candidate,
          userId,
        });
      }
    };

    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    this.socket.emit("answer", {
      streamId: this.socket.id,
      answer,
      userId,
    });
  }

  private async handleAnswer(
    answer: RTCSessionDescriptionInit,
    userId: string
  ) {
    console.log("Received answer:", { userId });
    const peerConnection = this.peerConnections.get(userId);
    if (peerConnection) {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    }
  }

  private async handleIceCandidate(candidate: RTCIceCandidate, userId: string) {
    console.log("Received ICE candidate:", { userId });
    const peerConnection = this.peerConnections.get(userId);
    if (peerConnection) {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    }
  }

  public async startBroadcast(streamId: string, userId: string): Promise<void> {
    try {
      console.log("[DEBUG] Starting broadcast:", { streamId, userId });
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      console.log(
        "[DEBUG] Local media obtained:",
        this.localStream.getTracks().map((t) => t.kind)
      );

      // Add tracks to all existing peer connections
      this.peerConnections.forEach((pc, id) => {
        console.log("[DEBUG] Adding tracks to existing peer connection:", id);
        if (this.localStream) {
          this.localStream.getTracks().forEach((track) => {
            pc.addTrack(track, this.localStream!);
          });
        }
      });

      this.socket.emit("create-stream", {
        streamId,
        userId,
        title: "Live Stream",
        category: "General",
      });

      console.log("[DEBUG] Create-stream event emitted");
    } catch (error) {
      console.error("[DEBUG] Error starting broadcast:", error);
      throw error;
    }
  }

  public async joinStream(streamId: string, userId: string): Promise<void> {
    try {
      console.log("Joining stream:", { streamId, userId });
      this.socket.emit("join-stream", { streamId, userId });
    } catch (error) {
      console.error("Error joining stream:", error);
      throw error;
    }
  }

  public stopBroadcast(): void {
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }
    this.peerConnections.forEach((connection) => connection.close());
    this.peerConnections.clear();
  }

  private async ensureConnection(): Promise<void> {
    if (this.isConnected) {
      return;
    }

    if (!this.connectionPromise) {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Connection timeout"));
          this.connectionPromise = null;
        }, 10000);

        this.connectionPromise = { resolve, reject };

        this.socket.once("connect", () => {
          clearTimeout(timeout);
          resolve();
        });

        this.socket.once("connect_error", (error) => {
          clearTimeout(timeout);
          reject(error);
        });

        // Force a reconnection attempt
        this.socket.connect();
      });
    }

    return new Promise((resolve, reject) => {
      this.connectionPromise = { resolve, reject };
    });
  }

  public onRemoteStream(callback: (stream: MediaStream) => void) {
    this.onRemoteStreamCallback = callback;
  }

  public onStreamUpdate(callback: (streams: StreamInfo[]) => void) {
    this.onStreamUpdateCallback = callback;
  }

  public onStreamEnd(callback: (streamId: string) => void) {
    this.onStreamEndCallback = callback;
  }

  public async getActiveStreams(): Promise<StreamInfo[]> {
    try {
      await this.ensureConnection();
      console.log("Socket.IO connected, requesting active streams...");

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Timeout waiting for active streams"));
        }, 5000);

        this.socket.emit("get-active-streams", (streams: StreamInfo[]) => {
          clearTimeout(timeout);
          if (!streams) {
            reject(new Error("Invalid response from server"));
            return;
          }
          console.log("Received active streams:", streams);
          resolve(streams);
        });
      });
    } catch (error) {
      console.error("Error in getActiveStreams:", error);
      throw error;
    }
  }

  public getLocalStream(): MediaStream | null {
    return this.localStream;
  }
}

export default WebRTCService;
