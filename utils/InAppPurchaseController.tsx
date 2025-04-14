import { Platform } from "react-native";
import Purchases, {
    CustomerInfo,
    PACKAGE_TYPE,
    PurchasesOffering,
    PurchasesPackage,
} from "react-native-purchases";


export const PREMIUM = "premium";
export const ANNUAL_SUB_NAME = "com.aredjal.moroccoquiz.annual"
export const MONTHLY_SUB_NAME = "com.aredjal.moroccoquiz.monthly"

export interface PaywallProduct {
    id: string;
    title: string;
    priceString: string;
    description: string;
    revenueCatPackage: PurchasesPackage;
}

let connected = false;
/**
 * Creates a connection with Revenue Cat providing an initial configuration.
 * You should only configure Purchases once, usually early in your application lifecycle. After configuration,
 * the same instance is shared throughout your app by accessing the .shared instance in the SDK.
 */
export async function initializeInAppPurchases() {
    if (connected) {
        return;
    }
    const apiKey =
        Platform.OS === "ios"
            ? process.env.EXPO_PUBLIC_RC_IOS_API_KEY
            : process.env.EXPO_PUBLIC_RC_ANDROID_API_KEY;
    try {
        Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
        Purchases.configure({ apiKey: apiKey });
    } catch (error) {
        console.log("initializeInAppPurchases", error);
    }
    connected = true;
}

/**
 * Gets the list of products from Revenue Cat
 * The function mixes some props from each product in order to return an object
 * that contains all the needed information for the paywall.
 * @returns a list of type PaywallProduct.
 */
export async function fetchSubscriptions(): Promise<{
    paywallProducts: PaywallProduct[];
    offering: PurchasesOffering;
}> {
    try {
        const offerings = await Purchases.getOfferings();
        if (
            offerings.current !== null &&
            offerings.current.availablePackages.length !== 0
        ) {
            // return only subscriptions
            const packages = offerings.current.availablePackages.filter((pack) =>
                pack.identifier.includes("rc")
            );
            const paywallProducts: PaywallProduct[] = packages.map((pack) => {
                const revenueCatProduct = pack.product;
                return {
                    id: revenueCatProduct.identifier,
                    title: revenueCatProduct.title,
                    priceString: revenueCatProduct.priceString,
                    description: revenueCatProduct.description,
                    revenueCatPackage: pack,
                };
            });

            return { paywallProducts, offering: offerings.current };
        }
    } catch (error) {
        console.log("fetchSubscriptions", Platform.OS, JSON.stringify(error));
    }
}

export async function fetchProducts(): Promise<{
    offering: PurchasesOffering;
}> {
    try {
        const offerings = await Purchases.getOfferings();
        if (
            offerings.current !== null &&
            offerings.current.availablePackages.length !== 0
        ) {
            // remove subscriptions
            const offering: PurchasesOffering = {
                ...offerings.current,
                availablePackages: offerings.current.availablePackages.filter(
                    (pack) => !pack.identifier.includes("rc")
                ),
            };

            return { offering: offering };
        }
    } catch (error) {
        console.log("fetchProducts", Platform.OS, JSON.stringify(error));
    }
}

/**
 * Calls Purchases.purchasePackage from Revenue Cat internally in order to purchase a
 * package. Revenue Cat identifies the platform OS of the package.
 * @param pack The package that will be purchased
 * @returns if the purchase was successful or not
 */
export async function purchasePackage(
    pack: PurchasesPackage,
    callback: (customerInfo: CustomerInfo | null) => void
) {
    try {
        console.log("====1")
        const { customerInfo, productIdentifier } = await Purchases.purchasePackage(
            pack
        );
        console.log("====2")
        // Check if the purchase was successful
        if (typeof customerInfo.entitlements.active[PREMIUM] !== undefined) {
            console.log("====2")
            console.log(`Successfully purchased ${productIdentifier}`);
            callback(customerInfo);
        } else {
            console.log("====4")
            callback(null);
        }
        console.log("====5")
    } catch (error) {
        console.log("error in  purchasePackage", error);
        callback(null);
    }
}

export async function restorePurchases(): Promise<CustomerInfo> {
    try {
        const restore = await Purchases.restorePurchases();
        // ... check restored purchaserInfo to see if entitlement is now active
        return restore;
    } catch (e) { }
}

export function hasActiveSubscription(customerInfo: CustomerInfo): boolean {
    return customerInfo?.activeSubscriptions?.length > 0;
}

export async function fetchDiscountedProducts(): Promise<PaywallProduct[]> {
    try {
        const offerings = await Purchases.getOfferings();
        const currOffering = offerings?.all["promo_10"];
        if (currOffering) {
            const paywallProducts: PaywallProduct[] =
                currOffering.availablePackages.map((pack) => {
                    const revenueCatProduct = pack.product;
                    return {
                        id: revenueCatProduct.identifier,
                        title: revenueCatProduct.title,
                        priceString: revenueCatProduct.priceString,
                        description: revenueCatProduct.description,
                        revenueCatPackage: pack,
                    };
                });
            return paywallProducts;
        } else {
            return [];
        }
    } catch (error) {
        return [];
    }
}


export const getPackageType = (activeSubscriptions: string[]): PACKAGE_TYPE => {
    if (activeSubscriptions.map(s => s.toLocaleLowerCase()).includes(ANNUAL_SUB_NAME)) {
        return PACKAGE_TYPE.ANNUAL
    } else {
        return PACKAGE_TYPE.MONTHLY
    }
}