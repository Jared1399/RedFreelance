import React from "react";

interface ListElement {
  title: string;
  description: string;
  href?: string;
}

export default function ScrollList({ list }: { list: ListElement[] }) {
  const itemList = list.map((el, index) => (
    <div key={index} className="p-3 sm:p-4 border-b last:border-b-0">
      <a href={el.href ?? "#"} className="font-semibold block mb-1 sm:mb-2 text-xl">
        {el.title}
      </a>
      <p className="text-sm text-gray-400 leading-relaxed">
        {el.description}
      </p>
    </div>
  ));

  return (
    <div className="max-h-64 sm:max-h-72 md:max-h-80 overflow-y-auto rounded-lg">
      {itemList}
    </div>
  );
}