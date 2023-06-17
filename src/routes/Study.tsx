import '@livekit/components-styles';
import { PreJoin, LocalUserChoices } from '@livekit/components-react';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@/store/userStore';
import ActiveRoom from '@/Video/ActiveRoom';
import RightBar from '@/components/RightBar';

function App() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const user = useUser();

  const [preJoinChoices, setPreJoinChoices] = useState<
    LocalUserChoices | undefined
  >(undefined);

  return (
    <div data-lk-theme="default">
      <RightBar />
      {roomId && !Array.isArray(roomId) && preJoinChoices ? (
        <ActiveRoom
          roomName={roomId}
          userChoices={preJoinChoices}
          onLeave={() => navigate('/')}
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
          debug
        />
      )}
    </div>
  );
}

export default App;
