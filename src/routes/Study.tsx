import '@livekit/components-styles';
import '@/components/Video/activeRoom.css';
import { LocalUserChoices } from '@livekit/components-react';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@/store/userStore';
import ActiveRoom from '@/components/Video/ActiveRoom';
import { leaveVideoRoom } from '@/utils/api';
import { PreJoin } from '@/components/Video/Prejoin';

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
    <div className="w-full h-full bg-background bg-center bg-cover bg-no-repeat">
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
            console.log('Joining with: ', values);
            setPreJoinChoices(values);
          }}
        />
      )}
    </div>
  );
}

export default App;
