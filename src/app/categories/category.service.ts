import { Gig } from "./types/Gig";
import { Category } from "./types/Category";

const API = "http://localhost:3000";


const categoryService = {
  async fetchCategoryInfoByName(name: string): Promise<Category | null> {
    const res = await fetch(`${API}/api/category/name/${encodeURIComponent(name)}`,
      { cache: "no-store" }
    );
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Error al obtener categoría");
    return res.json();
  },

  async fetchGigsByCategoryId(categoryId: number): Promise<Gig[]> {
    const res = await fetch(`${API}/api/gig/category/${categoryId}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Error al obtener gigs de la categoría");
    return res.json();
  },
};


export default categoryService;
