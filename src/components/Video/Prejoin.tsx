import {
  useEffect,
  useRef,
  useState,
  useCallback,
  FormEvent,
  HTMLAttributes,
} from 'react';
import type { LocalAudioTrack, LocalVideoTrack } from 'livekit-client';
import {
  createLocalAudioTrack,
  createLocalVideoTrack,
  Track,
  VideoPresets,
} from 'livekit-client';
import {
  MediaDeviceMenu,
  useMediaDevices,
  TrackToggle,
} from '@livekit/components-react';
import { log } from '@livekit/components-core';
import ParticipantPlaceholder from './ParticipantPlaceholder';

type LocalUserChoices = {
  username: string;
  videoEnabled: boolean;
  audioEnabled: boolean;
  videoDeviceId: string;
  audioDeviceId: string;
};

const DEFAULT_USER_CHOICES = {
  username: '',
  videoEnabled: true,
  audioEnabled: false,
  videoDeviceId: '',
  audioDeviceId: '',
};

/** @public */
export type PreJoinProps = Omit<HTMLAttributes<HTMLDivElement>, 'onSubmit'> & {
  /** This function is called with the `LocalUserChoices` if validation is passed. */
  onSubmit?: (values: LocalUserChoices) => void;
  onError?: (error: Error) => void;
  /** Prefill the input form with initial values. */
  defaults?: Partial<LocalUserChoices>;
};

export function usePreviewDevice<T extends LocalVideoTrack | LocalAudioTrack>(
  enabled: boolean,
  deviceId: string,
  kind: 'videoinput' | 'audioinput'
) {
  const [deviceError, setDeviceError] = useState<Error | null>(null);

  const devices = useMediaDevices({ kind });
  const [selectedDevice, setSelectedDevice] = useState<
    MediaDeviceInfo | undefined
  >(undefined);

  const [localTrack, setLocalTrack] = useState<T>();
  const [localDeviceId, setLocalDeviceId] = useState<string>(deviceId);

  useEffect(() => {
    setLocalDeviceId(deviceId);
  }, [deviceId]);

  const prevDeviceId = useRef(localDeviceId);

  const switchDevice = async (
    track: LocalVideoTrack | LocalAudioTrack,
    id: string
  ) => {
    await track.restartTrack({
      deviceId: id,
    });
    prevDeviceId.current = id;
  };

  useEffect(() => {
    const createTrack = async (
      trackDeviceId: string,
      trackKind: 'videoinput' | 'audioinput'
    ) => {
      try {
        const track =
          trackKind === 'videoinput'
            ? await createLocalVideoTrack({
                deviceId: trackDeviceId,
                resolution: VideoPresets.h720.resolution,
              })
            : await createLocalAudioTrack({ deviceId: trackDeviceId });

        const newDeviceId = await track.getDeviceId();
        if (newDeviceId && trackDeviceId !== newDeviceId) {
          prevDeviceId.current = newDeviceId;
          setLocalDeviceId(newDeviceId);
        }
        setLocalTrack(track as T);
      } catch (e) {
        if (e instanceof Error) {
          setDeviceError(e);
        }
      }
    };

    if (enabled && !localTrack && !deviceError) {
      log.debug('creating track', kind);
      createTrack(localDeviceId, kind);
    }
  }, [enabled, localTrack, deviceError, kind, localDeviceId]);

  // switch camera device
  useEffect(() => {
    if (!enabled) {
      if (localTrack) {
        log.debug(`muting ${kind} track`);
        localTrack.mute().then(() => log.debug(localTrack.mediaStreamTrack));
      }
      return () => {};
    }
    if (
      localTrack &&
      selectedDevice?.deviceId &&
      prevDeviceId.current !== selectedDevice?.deviceId
    ) {
      log.debug(
        `switching ${kind} device from`,
        prevDeviceId.current,
        selectedDevice.deviceId
      );
      switchDevice(localTrack, selectedDevice.deviceId);
    } else {
      log.debug(`unmuting local ${kind} track`);
      localTrack?.unmute();
    }

    return () => {
      if (localTrack) {
        log.debug(`stopping local ${kind} track`);
        localTrack.stop();
        localTrack.mute();
      }
    };
  }, [localTrack, selectedDevice, enabled, kind]);

  useEffect(() => {
    setSelectedDevice(devices.find(dev => dev.deviceId === localDeviceId));
  }, [localDeviceId, devices]);

  return {
    selectedDevice,
    localTrack,
    deviceError,
  };
}

export const PreJoin = ({
  defaults = {},
  onSubmit,
  onError,
}: // ...htmlProps
PreJoinProps) => {
  const [userChoices, setUserChoices] = useState(DEFAULT_USER_CHOICES);
  const [username, setUsername] = useState(
    defaults.username ?? DEFAULT_USER_CHOICES.username
  );
  const [videoEnabled, setVideoEnabled] = useState(
    DEFAULT_USER_CHOICES.videoEnabled
  );
  const [videoDeviceId, setVideoDeviceId] = useState(
    DEFAULT_USER_CHOICES.videoDeviceId
  );
  const [audioEnabled, setAudioEnabled] = useState(
    defaults.audioEnabled ?? DEFAULT_USER_CHOICES.audioEnabled
  );
  const [audioDeviceId, setAudioDeviceId] = useState(
    DEFAULT_USER_CHOICES.audioDeviceId
  );

  const video = usePreviewDevice(videoEnabled, videoDeviceId, 'videoinput');

  const videoEl = useRef(null);

  useEffect(() => {
    if (videoEl.current) video.localTrack?.attach(videoEl.current);

    return () => {
      video.localTrack?.detach();
    };
  }, [video.localTrack, videoEl]);

  const audio = usePreviewDevice(audioEnabled, audioDeviceId, 'audioinput');

  const [isValid, setIsValid] = useState<boolean>();

  const handleValidation = useCallback((values: LocalUserChoices) => {
    return values.username !== '';
  }, []);

  useEffect(() => {
    if (audio.deviceError) {
      onError?.(audio.deviceError);
    }
  }, [audio.deviceError, onError]);
  useEffect(() => {
    if (video.deviceError) {
      onError?.(video.deviceError);
    }
  }, [video.deviceError, onError]);

  useEffect(() => {
    const newUserChoices = {
      username,
      videoEnabled,
      videoDeviceId: video.selectedDevice?.deviceId ?? '',
      audioEnabled,
      audioDeviceId: audio.selectedDevice?.deviceId ?? '',
    };
    setUserChoices(newUserChoices);
    setIsValid(handleValidation(newUserChoices));
  }, [
    username,
    videoEnabled,
    video.selectedDevice,
    handleValidation,
    audioEnabled,
    audio.selectedDevice,
  ]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (handleValidation(userChoices)) {
      if (typeof onSubmit === 'function') {
        onSubmit(userChoices);
      }
    } else {
      log.warn('Validation failed with: ', userChoices);
    }
  }

  return (
    <div className="lk-prejoin w-screen h-screen m-0">
      <div className="lk-video-container">
        {video.localTrack && <video ref={videoEl} width="1280" height="720" />}
        {(!video.localTrack || !videoEnabled) && (
          <div className="lk-camera-off-note">
            <ParticipantPlaceholder />
          </div>
        )}
      </div>
      <div className="lk-button-group-container">
        <div className="lk-button-group audio">
          <TrackToggle
            initialState={audioEnabled}
            source={Track.Source.Microphone}
            onChange={enabled => setAudioEnabled(enabled)}
          />
          <div className="lk-button-group-menu">
            <MediaDeviceMenu
              initialSelection={audio.selectedDevice?.deviceId}
              kind="audioinput"
              onActiveDeviceChange={(_, deviceId) => {
                log.warn('active device chanaged', deviceId);
                setAudioDeviceId(deviceId);
              }}
              disabled={!audio.selectedDevice}
            />
          </div>
        </div>
        <div className="lk-button-group video">
          <TrackToggle
            initialState={videoEnabled}
            source={Track.Source.Camera}
            onChange={enabled => setVideoEnabled(enabled)}
          />
          <div className="lk-button-group-menu">
            <MediaDeviceMenu
              initialSelection={video.selectedDevice?.deviceId}
              kind="videoinput"
              onActiveDeviceChange={(_, deviceId) => {
                log.warn('active device chanaged', deviceId);
                setVideoDeviceId(deviceId);
              }}
              disabled={!video.selectedDevice}
            />
          </div>
        </div>
        <form className="join flex-grow">
          <input
            className="input border-success border-[2.5px] border-r-0 join-item w-full bg-white bg-opacity-50 text-success"
            id="username"
            name="username"
            type="text"
            defaultValue={username}
            placeholder="닉네임을 입력하세요"
            onChange={inputEl => setUsername(inputEl.target.value)}
            autoComplete="off"
          />
          <button
            className="btn btn-success join-item"
            type="submit"
            onClick={handleSubmit}
            disabled={!isValid}
          >
            입장하기
          </button>
        </form>
      </div>
    </div>
  );
};

PreJoin.defaultProps = {
  onSubmit: () => {},
  onError: () => {},
  defaults: DEFAULT_USER_CHOICES,
};
