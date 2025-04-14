import { getHearts, updateHearts } from "@/api/firestore";
import { Timestamp } from "@react-native-firebase/firestore";
import { create } from "zustand";
import { MAX_HEARTS } from "../constants";

interface HeartState {
  hearts: {
    current: number;
    lastHeartLost: Timestamp | null;
  };
  isLoading: boolean;
  lastFreeHeartDate: number | null;
  loseHeart: (userId: string) => void;
  addHeart: (userId: string) => void;
  refillHearts: (userId: string) => void;
  setLastFreeHeartDate: (value: number | undefined) => void;
}



export const useHeartStore = create<HeartState>((set, get) => ({
  hearts: {
    current: 0,
    lastHeartLost: null,
  },
  isLoading: true,
  lastFreeHeartDate: null,
  loseHeart: async (userId: string) => {
    const currentHearts = get().hearts.current;
    if (currentHearts > 0) {
      const now = Timestamp.fromDate(new Date());
      const newState = {
        hearts: {
          current: currentHearts - 1,
          lastHeartLost: now,
        },
      };

      set(newState);
      await updateHearts(userId, currentHearts - 1, now);
    }
  },
  addHeart: async (userId: string) => {
    const currentHearts = get().hearts.current;
    if (currentHearts < MAX_HEARTS) {
      const now = Timestamp.fromDate(new Date());
      const newState = {
        hearts: {
          current: currentHearts + 1,
          lastHeartLost: now,
        },
      };

      set(newState);
      await updateHearts(userId, currentHearts + 1, now);
    }
  },
  refillHearts: async (userId: string) => {
    const currentHearts = get().hearts.current;

    const now = Timestamp.fromDate(new Date());
    const newState = {
      hearts: {
        current: MAX_HEARTS,
        lastHeartLost: now,
      },
    };

    set(newState);
    await updateHearts(userId, currentHearts + 1, now);

  },
  setLastFreeHeartDate: (value: number | undefined) =>
    set(() => ({ lastFreeHeartDate: value })),
}));

export const initHeart = async (UID: string) => {
  try {
    const hearts = await getHearts(UID);

    if (!hearts) {
      const initialHearts = {
        current: MAX_HEARTS,
        lastHeartLost: null,
      };
      await updateHearts(UID, MAX_HEARTS, null);
      useHeartStore.setState({ hearts: initialHearts, isLoading: false });
      return;
    }

    if (hearts.current < MAX_HEARTS && hearts.lastHeartLost) {
      const timeBetweenHearts =
        Date.now() - hearts.lastHeartLost.toDate().getTime();
      const oneHour = 60 * 60 * 1000;
      const heartsToRecover = Math.min(
        Math.floor(timeBetweenHearts / oneHour),
        MAX_HEARTS - hearts.current
      );

      if (heartsToRecover > 0) {
        const newHeartCount = hearts.current + heartsToRecover;
        await updateHearts(UID, newHeartCount, hearts.lastHeartLost);
        useHeartStore.setState({
          hearts: {
            current: newHeartCount,
            lastHeartLost: hearts.lastHeartLost,
          },
          isLoading: false,
        });
        return;
      }
    }

    useHeartStore.setState({ hearts, isLoading: false });
  } catch (error) {
    console.error("Error initializing hearts:", error);
    useHeartStore.setState({ isLoading: false });
  }
};
