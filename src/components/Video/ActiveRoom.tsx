import {
  ControlBar,
  LiveKitRoom,
  LocalUserChoices,
  useToken,
} from '@livekit/components-react';
import { useMemo } from 'react';
import { RoomOptions, VideoPresets } from 'livekit-client';
import useServerUrl from '@/utils/livekit-utils';
import RoomTimer from '@/components/RoomTimer/RoomTimer';
import RightBar from '@/components/RightBar';
import VideoConference from './Videoconference';

type ActiveRoomProps = {
  userChoices: LocalUserChoices;
  roomName: string;
  onLeave: () => void;
};

const ActiveRoom = ({ roomName, userChoices, onLeave }: ActiveRoomProps) => {
  // token 생성
  const token = useToken(
    import.meta.env.MODE === 'development'
      ? import.meta.env.VITE_PUBLIC_LK_TOKEN_ENDPOINT
      : `https://www.sangyeop.shop/${
          import.meta.env.VITE_PUBLIC_LK_TOKEN_ENDPOINT
        }`,
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
    liveKitUrl && (
      <LiveKitRoom
        token={token}
        serverUrl={liveKitUrl}
        options={roomOptions}
        video={userChoices.videoEnabled}
        audio={userChoices.audioEnabled}
        onDisconnected={onLeave}
      >
        <div className="grid w-screen h-screen gap-3 px-10 pb-10 grid-rows-video_container grid-cols-video_container h-max-screen w-max-screen">
          <div className="self-end col-start-1 row-start-1">
            <ControlBar controls={{ chat: false }} variation="minimal" />
          </div>
          <div className="max-w-full col-start-1 col-end-2 row-start-2 row-end-3 h-rightbar max-h-rightbar">
            <VideoConference />
          </div>
          <div className="self-end col-start-2">
            <RoomTimer />
          </div>
          <div className="w-full col-start-2 col-end-3 row-start-2 row-end-3 h-rightbar max-h-rightbar">
            <RightBar />
          </div>
        </div>
      </LiveKitRoom>
    )
  );
};

export default ActiveRoom;
