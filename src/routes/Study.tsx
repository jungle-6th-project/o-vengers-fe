import { QueryClient } from '@tanstack/react-query';
import '@livekit/components-styles';
import '@/components/Video/activeRoom.css';
import { LocalUserChoices } from '@livekit/components-react';
import { useState } from 'react';
import { useParams, useNavigate, redirect } from 'react-router-dom';
import { useUser } from '@/store/userStore';
import ActiveRoom from '@/components/Video/ActiveRoom';
import { getUserNearestReservation, leaveVideoRoom } from '@/utils/api';
import { PreJoin } from '@/components/Video/Prejoin';

interface NearestReservationData {
  endTime: string;
  groupId: number;
  profiles: string[];
  roomId: number;
  startTime: string;
}

const nearestReservationQuery = () => ({
  queryKey: ['userNearestReservation'],
  queryFn: () => getUserNearestReservation(),
});

export const loader =
  (queryClient: QueryClient) =>
  async ({ request }: { request: Request }) => {
    const url = new URL(request.url);
    const urlRoomId = url.pathname.split('/')[2];
    if (!queryClient.getQueryData(nearestReservationQuery().queryKey)) {
      await queryClient.fetchQuery(nearestReservationQuery());
    }

    const nearestReservationData: NearestReservationData | undefined =
      queryClient.getQueryData(nearestReservationQuery().queryKey);

    if (Number(urlRoomId) !== nearestReservationData?.roomId) {
      return redirect('/');
    }

    return null;
  };

function App() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const user = useUser();
  const numberRoomId = Number(roomId);

  const handleOnLeave = async () => {
    navigate('/');
    await leaveVideoRoom(numberRoomId);
  };

  const [preJoinChoices, setPreJoinChoices] = useState<
    LocalUserChoices | undefined
  >(undefined);
  return (
    <div className="w-screen h-screen bg-center bg-no-repeat bg-cover bg-background">
      {roomId && !Array.isArray(roomId) && preJoinChoices ? (
        <ActiveRoom
          roomName={roomId}
          userChoices={preJoinChoices}
          onLeave={handleOnLeave}
        />
      ) : (
        <PreJoin
          onError={err => console.log('error while setting up prejoin', err)}
          defaults={{
            username: user.name,
            videoEnabled: true,
            audioEnabled: false,
          }}
          onSubmit={values => {
            setPreJoinChoices(values);
          }}
        />
      )}
    </div>
  );
}

export default App;
