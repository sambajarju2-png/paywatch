"use client";

import { useState } from "react";
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { PhoneOff, Loader2 } from "lucide-react";

interface CallRoomProps {
  roomName: string;
  token: string;
  livekitUrl: string;
  participantName?: string;
  onLeave: () => void;
}

export default function CallRoom({ roomName, token, livekitUrl, participantName, onLeave }: CallRoomProps) {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!livekitUrl) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0A2540] flex items-center justify-center">
        <div className="text-center p-6">
          <p className="text-red-400 text-sm font-medium mb-2">LiveKit URL ontbreekt</p>
          <p className="text-white/40 text-xs mb-4">Stel NEXT_PUBLIC_LIVEKIT_URL of LIVEKIT_URL in op Vercel.</p>
          <button onClick={onLeave} className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm">Terug</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#0A2540] flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-3">
          {connected ? (
            <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Verbonden
            </span>
          ) : (
            <span className="flex items-center gap-2 text-sm text-white/60">
              <Loader2 className="w-4 h-4 animate-spin" />
              Verbinden met {livekitUrl.replace("wss://", "")}...
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
          Ophangen
        </button>
      </div>

      {error && (
        <div className="px-5 py-3 bg-red-500/10 border-b border-red-500/20">
          <p className="text-red-400 text-xs font-mono">{error}</p>
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        <LiveKitRoom
          token={token}
          serverUrl={livekitUrl}
          connect={true}
          audio={true}
          video={true}
          onConnected={() => { setConnected(true); setError(null); }}
          onDisconnected={onLeave}
          onError={(err) => {
            console.error("[LiveKit]", err);
            setError(err?.message || String(err));
          }}
          data-lk-theme="default"
          style={{ height: "100%" }}
        >
          <VideoConference />
          <RoomAudioRenderer />
        </LiveKitRoom>
      </div>

      <div className="px-5 py-2 text-center text-[11px] text-white/20 flex-shrink-0">
        🔒 Privé gesprek · Geen opname · Max. 2 deelnemers
      </div>
    </div>
  );
}
