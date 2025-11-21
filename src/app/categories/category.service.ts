import { Gig } from "./types/Gig";
import { Category } from "./types/Category";
import { authFetch } from "@/lib/authFetch";


const categoryService = {
  async fetchCategoryInfoByName(name: string): Promise<Category | null> {
    const res = await authFetch(`/api/category/name/${encodeURIComponent(name)}`,
      { cache: "no-store" }
    );

    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Error al obtener categoría");
    return res.json();
  },

  async fetchGigsByCategoryId(categoryId: number): Promise<Gig[]> {
    const res = await authFetch(`/api/gig/category/${categoryId}`, { cache: "no-store" });

    if (!res.ok) throw new Error("Error al obtener gigs de la categoría");
    return res.json();
  },
};


export default categoryService;
