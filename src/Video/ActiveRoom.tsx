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
import Timer from '@/components/Timer';
import RightBar from '@/components/RightBar';

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
          <div className="grid gap-3 grid-rows-video_container grid-cols-video_container">
            <div className="col-start-1 col-end-2 row-start-2 row-end-3">
              <VideoConference chatMessageFormatter={formatChatMessageLinks} />
            </div>
            <div className="col-start-2">
              <Timer />
            </div>
            <div className="col-start-2 col-end-3 row-start-2 row-end-3">
              <RightBar />
            </div>
          </div>
        </LiveKitRoom>
      )}
    </div>
  );
};

export default ActiveRoom;
