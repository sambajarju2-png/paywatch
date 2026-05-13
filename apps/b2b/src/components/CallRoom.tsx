"use client";

import { useEffect, useState, useCallback } from "react";
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Phone, PhoneOff, Loader2, X } from "lucide-react";

interface CallRoomProps {
  roomName: string;
  token: string;
  livekitUrl: string;
  participantName?: string;
  onLeave: () => void;
}

export default function CallRoom({ roomName, token, livekitUrl, participantName, onLeave }: CallRoomProps) {
  const [connected, setConnected] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-[#0A2540] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-3">
          {connected ? (
            <span className="flex items-center gap-1.5 text-sm font-semibold text-pw-green">
              <span className="w-2 h-2 rounded-full bg-pw-green animate-pulse" />
              Verbonden
            </span>
          ) : (
            <span className="flex items-center gap-2 text-sm text-white/60">
              <Loader2 className="w-4 h-4 animate-spin" />
              Verbinden...
            </span>
          )}
          {participantName && (
            <span className="text-sm text-white/50 ml-2">met {participantName}</span>
          )}
        </div>
        <button
          onClick={onLeave}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium transition-colors"
        >
          <PhoneOff className="w-4 h-4" />
          Gesprek beëindigen
        </button>
      </div>

      {/* LiveKit room */}
      <div className="flex-1 overflow-hidden">
        <LiveKitRoom
          token={token}
          serverUrl={livekitUrl}
          connect={true}
          audio={true}
          video={true}
          onConnected={() => setConnected(true)}
          onDisconnected={onLeave}
          data-lk-theme="default"
          style={{ height: "100%" }}
        >
          <VideoConference />
          <RoomAudioRenderer />
        </LiveKitRoom>
      </div>

      {/* Privacy notice */}
      <div className="px-5 py-2 text-center text-[11px] text-white/20 flex-shrink-0">
        🔒 Gesprek is privé en versleuteld · Geen opname · Max. 2 deelnemers
      </div>
    </div>
  );
}
