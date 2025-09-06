import { Gig } from "./types/Gig";
import { Category } from "./types/Category";


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const categoryService = {
  async fetchCategoryInfoByName(name: string): Promise<Category | null> {
    const res = await fetch(`${BASE_URL}/api/category/name/${encodeURIComponent(name)}`,
      { cache: "no-store" }
    );
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Error al obtener categoría");
    return res.json();
  },

  async fetchGigsByCategoryId(categoryId: number): Promise<Gig[]> {
    const res = await fetch(`${BASE_URL}/api/gig/category/${categoryId}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Error al obtener gigs de la categoría");
    return res.json();
  },
};


export default categoryService;
