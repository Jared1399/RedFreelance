import React from "react";

interface ListElement {
  title: string;
  description: string;
  href?: string;
}

export default function ScrollList({ list }: { list: ListElement[] }) {
  const itemList = list.map((el, index) => (
    <div key={index} className="p-2 border-b">
      <a href={el.href ?? "#"} className="font-semibold">
        {el.title}
      </a>
      <p className="text-sm text-gray-600">{el.description}</p>
    </div>
  ));

  return (
    <div className="max-h-64 overflow-y-auto">
      {itemList}
    </div>
  );
}
