import { pb } from "$lib/pocketbase.ts";

export async function load({ parent }) {
  await parent();
  const apunts = await pb.collection("apunts").getFullList();
  return {
    apunts: apunts,
  };
}