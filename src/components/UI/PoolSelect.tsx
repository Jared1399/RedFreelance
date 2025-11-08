import clsx from 'clsx';
import React, { useCallback } from 'react';

interface Option {
  id?: string;
  name: string;
}

const Pill = (
  { option, onToggle, isSelected }:
    { option: Option; onToggle: (id: number) => void; isSelected?: boolean }
) => {
  const handlePillClick = () => {
    if (option.id) onToggle(Number.parseInt(option.id));
  };

  const pillCls = clsx({
    "w-fit px-3 py-2 sm:px-4 sm:py-2 outline outline-amber-50 ": true,
    "rounded-full cursor-pointer text-sm sm:text-base": true,
    "bg-amber-900": !isSelected,
    "bg-amber-700": !!isSelected,
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
  selectedIds?: number[];
}

export default function PoolSelect({ options, onChange, selectedIds = [] }: PoolSelectProps) {
  const toggleOption = useCallback((id: number) => {
    const exists = selectedIds.includes(id);
    const next = exists ? selectedIds.filter((x) => x !== id) : [...selectedIds, id];
    onChange(next);
  }, [onChange, selectedIds]);

  const seen = new Set();
  const uniqueOptions = options.filter(op => {
    const identifier = op.id ? `id-${op.id}` : `name-${op.name.toLowerCase()}`;
    if (seen.has(identifier)) {
      return false;
    }
    seen.add(identifier);
    return true;
  });

  const pillOptions = uniqueOptions.length
    ? uniqueOptions.map((op, i) => (
      <Pill
        option={op}
        onToggle={toggleOption}
        key={`${op.id ?? op.name}-${i}`}
        isSelected={op.id ? selectedIds.includes(Number.parseInt(op.id)) : false}
      />
    ))
    : null;

  return (
    <div className="flex flex-wrap justify-start gap-2 sm:gap-3 w-full mt-3 select-none">
      {pillOptions}
    </div>
  );
}