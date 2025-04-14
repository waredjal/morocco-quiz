import React, { useState } from "react";
import {
    hasActiveSubscription,
    initializeInAppPurchases,
} from "./utils/InAppPurchaseController";
import Purchases, { PurchasesOfferings } from "react-native-purchases";
import { AppState } from "react-native";
import useAppState from "./utils/state/useStore";

// import { mixpanel } from "./utils/analytics";


type IAPContextType = {
    isPremiumUser: boolean;
    offerings: PurchasesOfferings | undefined;
    setIsPremiumUser: (value: boolean) => void;
};

const IAPContext = React.createContext<IAPContextType>({
    isPremiumUser: false,
    offerings: undefined,
    setIsPremiumUser: () => null,
});

// This hook can be used to access the iap customer info.
export function useIAP() {
    return React.useContext(IAPContext);
}

const IAPProvider = (props) => {
    const appState = React.useRef(AppState.currentState);

    const { is_premium_user: isPremiumUser, setIsPremiumUser } = useAppState();

    const [offerings, setOfferings] = useState<PurchasesOfferings | undefined>();

    const getCustomerInfo = React.useCallback(async () => {
        try {
            // access latest customerInfo
            const customerInfo = await Purchases.getCustomerInfo();
            const isActive = hasActiveSubscription(customerInfo);
            setIsPremiumUser(isActive);
            // mixpanel.getPeople().set("isPremium", isActive);
        } catch (e) {
            // Error fetching customer info
            console.error("IAPContext getCustomerInfo", e);
        }
    }, []);

    React.useEffect(() => {
        const initializePurchases = async (): Promise<void> => { };
        initializePurchases();
    }, []);

    React.useEffect(() => {
        const initializePurchases = async (): Promise<void> => {
            await initializeInAppPurchases();
            await getCustomerInfo();
            const offeringsData = await Purchases.getOfferings();
            setOfferings(offeringsData);
        };
        initializePurchases();
    }, []);

    React.useEffect(() => {
        const subscription = AppState.addEventListener("change", (nextAppState) => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === "active"
            ) {
                getCustomerInfo();
            }
            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, []);

    React.useEffect(() => {
        const listener = () =>
            Purchases.addCustomerInfoUpdateListener(async (info) => {
                const isActive = hasActiveSubscription(info);
                setIsPremiumUser(isActive);;
                // mixpanel.getPeople().set("isPremium", isActive);
            });
        return () => {
            Purchases.removeCustomerInfoUpdateListener(listener);
        };
    }, []);

    return (
        <IAPContext.Provider value={{ isPremiumUser, setIsPremiumUser, offerings }}>
            {props.children}
        </IAPContext.Provider>
    );
};

export default IAPProvider;
