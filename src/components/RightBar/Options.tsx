import React from 'react';

interface ChatOptionsProps {
  selectedOption: string;
  handleOptionChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Options: React.FC<ChatOptionsProps> = ({
  selectedOption,
  handleOptionChange,
}) => {
  return (
    <div className="join">
      <input
        className="join-item btn"
        type="radio"
        name="options"
        value="TODO"
        aria-label="TODO"
        checked={selectedOption === 'TODO'}
        onChange={handleOptionChange}
      />
      <input
        className="join-item btn "
        type="radio"
        name="options"
        value="CHAT"
        aria-label="CHAT"
        checked={selectedOption === 'CHAT'}
        onChange={handleOptionChange}
      />
    </div>
  );
};

export default Options;
