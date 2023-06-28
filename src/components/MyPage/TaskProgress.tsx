const TaskProgress = () => {
  // progress bar 색상 변경안되서 퍼센티지 텍스트에 컬러 적용해둠
  return (
    <div className="rounded-md min-h-[250px] h-[20.5vw] p-[1.5vw] bg-reservation w-[16vw] min-w-leftbar max-w-leftbar flex flex-col">
      <p className="font-semibold  text-black text-[1.9vw]">TODO</p>
      <p className=" text-bbodog_blue font-medium text-[0.9vw] ml-1 leading-none">
        투두리스트
      </p>
      <div className="font-medium mt-auto">
        <p className="text-bbodog_blue text-[0.9vw] leading-none">
          0% TASK COMPLETED
        </p>
        <progress className="w-[13vw] progress" value={0} max="100" />
      </div>
    </div>
  );
};

export default TaskProgress;
