import { getAds } from "@/api/firestore";
import { create } from "zustand";

interface AdState {
  ads: [{ go_to_url: string; img_url: string }];
}

export const useAdStore = create<AdState>((set) => ({
  ads: [{ go_to_url: "", img_url: "" }],
  setAds: (ads: [{ go_to_url: string; img_url: string }]) => set({ ads }),
}));

export const initAds = async () => {
  const ads = await getAds();
  useAdStore.setState({ ads });
};
