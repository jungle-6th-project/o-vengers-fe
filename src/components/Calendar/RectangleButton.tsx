import React from 'react';

interface RectangleProps {
  text: string;
  day: string;
  time: string;
}

const RectangleButton = ({ text, day, time }: RectangleProps) => {
  return (
    <div className="border border-dashed h-[76px]">
      <button
        type="button"
        className=" bg-reservation w-[11.875rem] h-[4.75rem] rounded-[0.9375rem] opacity-0 hover:opacity-100"
        onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
          console.log(e.currentTarget.dataset)
        }
        data-day={day}
        data-time={time}
      >
        <span className="text-black">{text}</span>
      </button>
    </div>
  );
};

export default RectangleButton;
