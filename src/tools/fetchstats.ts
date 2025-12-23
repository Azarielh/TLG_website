import type PocketBase from "pocketbase";

// fetchUserCount: récupère le nombre total d'utilisateurs enregistrés
// Garde SSR: si pb est null côté serveur, retourne 0
export async function fetchUserCount(pb: PocketBase | null): Promise<number> {
  if (!pb) return 0;

  try {
    // Récupère juste la première page pour avoir le totalItems
    const res = await pb.collection("users").getList(1, 1);
    return res.totalItems;
  } catch (error) {
    console.error("Error loading user count:", error);
    return 0;
  }
}
