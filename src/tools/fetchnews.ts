import type PocketBase from "pocketbase";
import type { NewsItemData } from "../components/NewsItem";

export type FetchLatestNewsOptions = {
  page?: number;
  perPage?: number;
  sort?: string;
  filter?: string;
  expand?: string;
};

// fetchLatestNews: charge les dernières actualités depuis PocketBase
// Garde SSR: si pb est null côté serveur, retourne un tableau vide
export async function fetchLatestNews(
  pb: PocketBase | null,
  opts: FetchLatestNewsOptions = {}
): Promise<NewsItemData[]> {
  if (!pb) return [];

  const {
    page = 1,
    perPage = 3,
    sort = "-created",
    filter = 'content != ""',
    expand = "tags",
  } = opts;

  try {
    const res = await pb.collection("News").getList(page, perPage, {
      sort,
      filter,
      expand,
    });

    // Normalise les enregistrements vers NewsItemData et harmonise video_url
    const items = res.items.map((rec: any) => {
      const item: NewsItemData = {
        id: rec.id,
        title: rec.title,
        headlines: rec.headlines,
        content: rec.content,
        tags: Array.isArray(rec.tags) ? rec.tags : [],
        created: rec.created,
        updated: rec.updated,
        author: rec.author,
        image: rec.image,
        video_url: rec.video_url ?? rec.video_Url ?? undefined,
        collectionId: rec.collectionId,
        collectionName: rec.collectionName,
      };
      return item;
    });

    return items;
  } catch (error) {
    console.error("Error loading latest news:", error);
    return [];
  }
}
