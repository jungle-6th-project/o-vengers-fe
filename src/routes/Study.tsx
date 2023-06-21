import '@livekit/components-styles';
import '@/Video/activeRoom.css';
import { PreJoin, LocalUserChoices } from '@livekit/components-react';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@/store/userStore';
import ActiveRoom from '@/Video/ActiveRoom';
import { leaveVideoRoom } from '@/utils/api';

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
    <div>
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
            audioEnabled: true,
          }}
          onSubmit={values => {
            console.log('Joining with: ', values);
            setPreJoinChoices(values);
          }}
          joinLabel="입장하기"
          camLabel=""
          micLabel=""
          userLabel="닉네임"
        />
      )}
    </div>
  );
}

export default App;
