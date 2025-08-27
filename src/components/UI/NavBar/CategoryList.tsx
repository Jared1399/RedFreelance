import { ListItem } from ".";

const CategoryList = () => {

  const categoryList = [
    {
      "id": 4,
      "name": "edicion",
      "description": "Trabajos relacionados a edicion de fotos y videos",
    },
    {
      "id": 5,
      "name": "arte",
      "description": "Trabajos relacionados creacion de arte personalizado",
    },
    {
      "id": 6,
      "name": "medicina online",
      "description": "Trabajos relacionados a consultas de salud online",
    },
    {
      "id": 7,
      "name": "marketing",
      "description": "Promociona lo que quieras con anuncios online",
    }
  ];

  const categoryComponents = categoryList.map((component) => (
    <ListItem
      key={component.id}
      title={component.name}
      href={`/categories/name/${component.name}`}
    >
      {component.description}
    </ListItem>
  ));


  return (
    <>{categoryComponents}</>
  );
};

export default CategoryList;