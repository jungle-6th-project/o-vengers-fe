const TaskProgress = () => {
  // progress bar 색상 변경안되서 퍼센티지 텍스트에 컬러 적용해둠
  return (
    <div className="rounded-2xl pl-[2vw] bg-reservation card h-[50vh] w-[16vw] min-w-leftbar max-w-leftbar">
      <p className="pt-[4vh] font-semibold  text-black text-[1.8vw]">TODO</p>
      <p className=" text-bbodog_blue font-medium text-[0.9vw] ">투두리스트</p>
      <div className="pt-[28.5vh] font-medium">
        <p className="text-bbodog_blue text-[0.9vw] mb-0">0% TASK COMPLETED</p>
        <progress className="w-[12vw] progress mb-1" value={0} max="100" />
      </div>
    </div>
  );
};

export default TaskProgress;
