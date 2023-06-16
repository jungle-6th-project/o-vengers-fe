import {
  LiveKitRoom,
  LocalUserChoices,
  useToken,
  VideoConference,
  formatChatMessageLinks,
} from '@livekit/components-react';
import { useMemo } from 'react';
import { RoomOptions, VideoPresets } from 'livekit-client';
import useServerUrl from '@/utils/livekit-utils';

type ActiveRoomProps = {
  userChoices: LocalUserChoices;
  roomName: string;
  onLeave: () => void;
};

const ActiveRoom = ({ roomName, userChoices, onLeave }: ActiveRoomProps) => {
  // token 생성
  const token = useToken(
    import.meta.env.VITE_PUBLIC_LK_TOKEN_ENDPOINT,
    roomName,
    {
      userInfo: {
        identity: userChoices.username,
        name: userChoices.username,
      },
    }
  );
  const liveKitUrl = useServerUrl(undefined);

  const roomOptions = useMemo((): RoomOptions => {
    return {
      videoCaptureDefaults: {
        deviceId: userChoices.videoDeviceId ?? undefined,
        resolution: VideoPresets.h720,
      },
      publishDefaults: {
        videoSimulcastLayers: [VideoPresets.h540, VideoPresets.h216],
      },
      audioCaptureDefaults: {
        deviceId: userChoices.audioDeviceId ?? undefined,
      },
      adaptiveStream: { pixelDensity: 'screen' },
      dynacast: true,
    };
  }, [userChoices]);

  return (
    <div>
      {liveKitUrl && (
        <LiveKitRoom
          token={token}
          serverUrl={liveKitUrl}
          options={roomOptions}
          video={userChoices.videoEnabled}
          audio={userChoices.audioEnabled}
          onDisconnected={onLeave}
        >
          <VideoConference chatMessageFormatter={formatChatMessageLinks} />
        </LiveKitRoom>
      )}
    </div>
  );
};

export default ActiveRoom;
