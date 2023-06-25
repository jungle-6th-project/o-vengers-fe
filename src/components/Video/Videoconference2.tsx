import {
  isEqualTrackRef,
  isTrackReference,
  log,
} from '@livekit/components-core';
import {
  ControlBar,
  FocusLayout,
  FocusLayoutContainer,
  GridLayout,
  RoomAudioRenderer,
  usePinnedTracks,
  useTracks,
  ConnectionStateToast,
  CarouselView,
  ParticipantTile,
  useCreateLayoutContext,
  LayoutContextProvider,
  Chat,
  VideoConferenceProps,
} from '@livekit/components-react';
import type { WidgetState } from '@livekit/components-core';
import { RoomEvent, Track } from 'livekit-client';
import { useEffect, useState } from 'react';

function VideoConference({ chatMessageFormatter }: VideoConferenceProps) {
  const [widgetState, setWidgetState] = useState<WidgetState>({
    showChat: false,
  });
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { updateOnlyOn: [RoomEvent.ActiveSpeakersChanged] }
  );

  const widgetUpdate = (state: WidgetState) => {
    log.debug('updating widget state', state);
    setWidgetState(state);
  };

  const layoutContext = useCreateLayoutContext();

  const screenShareTracks = tracks
    .filter(isTrackReference)
    .filter(track => track.publication.source === Track.Source.ScreenShare);

  const focusTrack = usePinnedTracks(layoutContext)?.[0];
  const carouselTracks = tracks.filter(
    track => !isEqualTrackRef(track, focusTrack)
  );
  const screenShareTracksJson = JSON.stringify(
    screenShareTracks.map(ref => ref.publication.trackSid)
  );

  useEffect(() => {
    // if screen share tracks are published, and no pin is set explicitly, auto set the screen share
    if (screenShareTracks.length > 0 && focusTrack === undefined) {
      layoutContext.pin.dispatch?.({
        msg: 'set_pin',
        trackReference: screenShareTracks[0],
      });
    } else if (
      (screenShareTracks.length === 0 &&
        focusTrack?.source === Track.Source.ScreenShare) ||
      tracks.length <= 1
    ) {
      layoutContext.pin.dispatch?.({ msg: 'clear_pin' });
    }
  }, [
    screenShareTracksJson,
    tracks.length,
    focusTrack?.publication?.trackSid,
    focusTrack,
    layoutContext.pin,
    screenShareTracks,
  ]);

  return (
    <div className="lk-video-conference">
      <LayoutContextProvider
        value={layoutContext}
        onWidgetChange={widgetUpdate}
      >
        <div className="lk-video-conference-inner">
          {!focusTrack ? (
            <div className="lk-grid-layout-wrapper">
              <GridLayout tracks={tracks}>
                <ParticipantTile />
              </GridLayout>
            </div>
          ) : (
            <div className="lk-focus-layout-wrapper">
              <FocusLayoutContainer>
                <CarouselView tracks={carouselTracks}>
                  <ParticipantTile />
                </CarouselView>
                {focusTrack && <FocusLayout track={focusTrack} />}
              </FocusLayoutContainer>
            </div>
          )}
          <ControlBar variation="minimal" />
        </div>
        <Chat
          style={{ display: widgetState.showChat ? 'flex' : 'none' }}
          messageFormatter={chatMessageFormatter}
        />
      </LayoutContextProvider>
      <RoomAudioRenderer />
      <ConnectionStateToast />
    </div>
  );
}
export default VideoConference;
