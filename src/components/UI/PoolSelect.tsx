import clsx from 'clsx';
import React, { useState } from 'react';

interface Option {
  id?: string;
  name: string;
}

const Pill = (
  { option, setOption, }:
    { option: Option; setOption: (id: number) => void; }
) => {
  const [selectedPill, setSelectedPill] = useState(false);

  const handlePillClick = () => {
    setSelectedPill(!selectedPill);
    if (option.id) setOption(Number.parseInt(option.id));
  };

  const pillCls = clsx({
    "w-fit px-2 py-1 outline outline-amber-50 rounded-full cursor-pointer": true,
    "bg-amber-900": !selectedPill,
    "bg-amber-700": selectedPill,
  });

  return (
    <div className={pillCls} onClick={handlePillClick}>
      {option.name}
    </div>
  );
};

interface PoolSelectProps {
  options: Option[];
  onChange: (selectedIds: number[]) => void;
}

export default function PoolSelect({ options, onChange }: PoolSelectProps) {
  const [optionList, setOption] = useState<number[]>([]);

  const concatOption = (
    originalList: number[],
    setter: React.Dispatch<React.SetStateAction<number[]>>
  ) => {
    return (id: number) => {
      const index = originalList.indexOf(id);

      if (index === -1) {
        setter([...originalList, id]);
      } else {
        setter([
          ...originalList.slice(0, index),
          ...originalList.slice(index + 1),
        ]);
      }
    };
  };

  React.useEffect(() => {
    onChange(optionList);
  }, [optionList, onChange]);

  const pillOptions = options.length
    ? options.map((op, i) => (
      <Pill option={op} setOption={concatOption(optionList, setOption)} key={i} />
    ))
    : null;

  return <div className="flex justify-evenly w-[80%] mx-auto">{pillOptions}</div>;
}
