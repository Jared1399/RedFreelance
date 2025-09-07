import * as components from './components';

export default function HomePage() {
  return (
    <div>
      <components.Banner />
      <components.CategoryList />
      <components.WeeklyPopular />
      <components.PopularCategories />
      <components.GetPremium />
      <components.BlogEntry />
    </div>
  );
}
