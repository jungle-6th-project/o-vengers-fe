const TaskProgress = () => {
  // progress bar 색상 변경안되서 퍼센티지 텍스트에 컬러 적용해둠
  return (
    <div className="absolute rounded-[13.48px] pl-[21px] bg-gray-200 card w-[208.94px] h-[288.06px] left-[237.33px] top-[60.93px]">
      <p className="pt-[25px] font-semibold  text-black text-[23px]">TODO</p>
      <p className=" text-bbodog_blue font-medium text-[12px] ">투두리스트</p>
      <div className="pt-[155px] font-medium">
        <p className="text-bbodog_blue text-[12px] left-[27.65px] mb-0">
          50% TASK COMPLETED
        </p>
        <progress className="w-[152px] progress mt-0" value={50} max="100" />
      </div>
    </div>
  );
};

export default TaskProgress;
