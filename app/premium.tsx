import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Modal, ScrollView } from "react-native";

import * as Burnt from "burnt";
import { Ionicons } from "@expo/vector-icons";
import { globalStyle } from "@/styles/globalStyles";
import { CustomButton } from "@/components/CustomButton";
import SubscriptionCards from "@/components/premium/SubscriptionCards";
import ViewContainer from "@/components/layout/ViewContainer";
import { router } from "expo-router";
import { useIAP } from "@/IAPContext";
import { getPackageType, hasActiveSubscription, PaywallProduct, purchasePackage, restorePurchases } from "@/utils/InAppPurchaseController";
import { activateUser } from "@/utils/helper";
import { t } from "i18next";
import TTS from "@/components/premium/TTS";
import { colors } from "@/styles/globalColors";
import BackButton from "@/components/buttons/BackButton";
import useAppState from "@/utils/state/useStore";

type Props = {
  isModal: boolean
  isVisible: boolean
  onClose?: () => void
}

const Premium = ({ isModal = false, isVisible = false, onClose }: Props) => {

  const { offerings } = useIAP();
  const { setShowLoader } = useAppState();
  const { email, is_premium_user: isPremiumUser, setIsPremiumUser } = useAppState()


  const [products, setProducts] = useState<PaywallProduct[]>([]);
  const [metadata, setMetadata] = useState<{ [key: string]: any }>({});
  const [selectedProduct, setSelectedProduct] = useState<PaywallProduct | null>(
    null
  );
  const features = [
    "Unlimited hearts",
    "Access to exclusive quizzes",
    "Removal of ads",
    //"Offline mode",
    'Free "Moving to Morocco" ebook',
  ];

  React.useEffect(() => {
    fetchOffering();
  }, [offerings]);


  const fetchOffering = React.useCallback(async () => {
    try {
      const currOffering = offerings?.all?.['default'];
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
        setProducts(paywallProducts);
        setMetadata(currOffering.metadata);
        setSelectedProduct(paywallProducts[0]);
      }
    } catch (error) {
      console.error(error);
    }
  }, [offerings]);

  const buyPremiumPlan = useCallback(
    async (selectedProduct: PaywallProduct | null) => {
      if (selectedProduct) {
        setShowLoader(true);
        purchasePackage(
          selectedProduct.revenueCatPackage,
          async (customerInfo) => {
            if (!customerInfo) {
              setShowLoader(false);
              return;
            } else { // TODO: handle buy success
              setShowLoader(true, t("paywall.activating"));
              // await trackPurchase(
              //   selectedProduct,
              //   params?.from || "",
              //   params?.triggeredBy || ""
              // );
              // affiliateRef.current?.code &&
              //   (await trackAffiliateSale(
              //     affiliateRef.current.code,
              //     affiliateRef.current.id,
              //     selectedProduct.revenueCatPackage.product.price,
              //     selectedProduct.revenueCatPackage.product.currencyCode
              //   ));
              await activateUser(selectedProduct.revenueCatPackage.packageType);
              console.log("========BEFORE SETTING USER TO PREMIUM=======")
              setIsPremiumUser(true);
              // if (params?.from === "onboarding") {
              //   setIsFirstLaunch(false);
              // }
              await Burnt.toast({
                title: t("paywall.success"),
                preset: "done",
                duration: 2,
              });
              setShowLoader(false);
              if (!email) {
                router.replace({
                  pathname: "/(tabs)/settings/createAccount",
                  params: { fromPaywall: "true" },
                });
              } else {
                router.back();
              }
            }
          }
        ).catch(() => setShowLoader(false));
      }
    },
    [email,
      //  params?.from, params?.triggeredBy
    ]
  );

  const restore = useCallback(async () => {
    setShowLoader(true);
    restorePurchases()
      .then(async (customerInfo) => {
        console.log("customerInfo===", customerInfo)
        const isActive = hasActiveSubscription(customerInfo);
        if (isActive) {
          setIsPremiumUser(true);
          await activateUser(getPackageType(customerInfo.activeSubscriptions));
          // logEvent(RESTORE_SUBSCRIPTION);
          Burnt.toast({
            title: t("paywall.restore_success"),
            preset: "done",
            duration: 2,
          });
          // if (params?.from === "onboarding") {
          //   setIsFirstLaunch(false);
          // }
          if (!email) {
            router.replace({ // TODO: adapt 
              pathname: "/(tabs)/settings/createAccount",
              params: { fromPaywall: "true" },
            });
          } else {
            router.back();
          }
        } else {
          Burnt.toast({
            title: t("paywall.no_subscriptions"),
            preset: "error",
            duration: 2,
          });
        }
      })
      .finally(() => setShowLoader(false));
  }, [
    // params?.from
  ]);

  const handleCloseModal = () => {

    onClose && onClose()
  }

  const renderCloseButton = () => {

    const position = isModal ? 'flex-end' : 'flex-start'
    return (
      <View style={[styles.closeContainer, { alignItems: position }]}>
        {isModal ?
          < TouchableOpacity style={styles.closeButton} onPress={handleCloseModal} >
            <Text style={styles.closeText}>X</Text>
          </ TouchableOpacity >
          :
          <BackButton />
        }
      </View >
    )

  }

  const content = (
    <ViewContainer style={styles.container}>
      <ScrollView>


        <View style={{ flex: 1 }}>
          {renderCloseButton()}
          <View style={{ paddingVertical: 15 }}>

            <Text style={styles.header}>Unlock Premium Features!</Text>
            <Text style={styles.subHeader}>Instant heart recharge.</Text>
          </View>
          <View
            style={{
              borderBottomColor: "black",
              borderBottomWidth: StyleSheet.hairlineWidth,
              marginVertical: 64,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CustomButton
              title="One Time Offer"
              variant="primary"
              style={{ position: "absolute" }}
            />
          </View>
          <View style={styles.bottomContainer}>

            {products && <SubscriptionCards
              products={products}
              setSelectedProduct={setSelectedProduct}
              selectedProduct={selectedProduct}
            />}

            <View style={styles.features}>
              {features.map((feature, index) => (
                <View style={styles.featureContainer} key={index}>
                  <Ionicons name="checkmark-circle" size={25} color="#66bb6a" />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

      </ScrollView>

      <View style={styles.actionsContainer}>
        <View>
          <TouchableOpacity onPress={() => buyPremiumPlan(selectedProduct)} style={styles.continueButton}>
            <Text style={styles.continueText}>CONTINUE</Text>
          </TouchableOpacity>
        </View>
        <TTS
          // key={i}
          restore={restore}
          privacy={metadata?.tts?.pp}
          tts={metadata?.tts?.ts}
        />
      </View>


    </ViewContainer>
  );

  if (isModal) {
    return (
      <Modal animationType="slide" transparent visible={isVisible}>
        {content}
      </Modal>
    )
  } else {
    return content
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 16,
  },
  bottomContainer: {
    paddingHorizontal: 15,
    paddingBottom: 80, // To prevent overlap with the fixed actions container
  },
  features: {
    gap: 15,
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  featureContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  featureText: {
    fontSize: 18,
    color: "#333",
    marginVertical: 4,
    marginHorizontal: 12,
  },
  continueButton: {
    backgroundColor: "#3B4753",
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
  },
  closeContainer: {
    paddingHorizontal: 8,
  },
  closeButton: {
    backgroundColor: colors.border,
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: "center",
    borderRadius: 100,
    marginBottom: 15,
    ...globalStyle.shadowBox
  },
  closeText: {
    color: "#999",
    fontWeight: 'bold',
    fontSize: 16,
  },
  continueText: {
    color: "#fff",
    fontSize: 16,
  },
  actionsContainer: {
    gap: 15,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowOffset: { width: 0, height: -2 }, // Stronger downward shadow
    shadowOpacity: 0.1,  // Increased opacity
    shadowRadius: 1,    // Much bigger radius for a wider spread
    elevation: 5,       // High elevation for Android
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
});


export default Premium;
