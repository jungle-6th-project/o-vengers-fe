/* eslint-disable react-hooks/exhaustive-deps */
import { isEqualTrackRef, isTrackReference } from '@livekit/components-core';
import {
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
} from '@livekit/components-react';
import { RoomEvent, Track } from 'livekit-client';
import { useEffect } from 'react';

function VideoConference2() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    {
      updateOnlyOn: [
        RoomEvent.ActiveSpeakersChanged,
        RoomEvent.ParticipantDisconnected,
      ],
    }
  );

  const layoutContext = useCreateLayoutContext();

  const screenShareTracks = tracks
    .filter(isTrackReference)
    .filter(track => track.publication.source === Track.Source.ScreenShare);

  const focusTrack = usePinnedTracks(layoutContext)?.[0];
  const carouselTracks = tracks.filter(
    track => !isEqualTrackRef(track, focusTrack)
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
    JSON.stringify(screenShareTracks.map(ref => ref.publication.trackSid)),
    tracks.length,
    focusTrack?.publication?.trackSid,
  ]);

  return (
    <div className="lk-video-conference">
      <LayoutContextProvider value={layoutContext}>
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
        </div>
      </LayoutContextProvider>
      <RoomAudioRenderer />
      <ConnectionStateToast />
    </div>
  );
}

export default VideoConference2;
