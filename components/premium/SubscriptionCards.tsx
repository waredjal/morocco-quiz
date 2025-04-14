import { PaywallProduct } from "@/utils/InAppPurchaseController";
import React, { Dispatch, SetStateAction } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
} from "react-native";

type SubscriptionCardProps = {
  title: string;
  price: string;
  description: string;
  highlight?: boolean;
  onPress: () => void;
};
type SubscriptionCardsProps = {
  products: PaywallProduct[]
  selectedProduct: PaywallProduct;
  setSelectedProduct: Dispatch<SetStateAction<PaywallProduct>>;
  style?: StyleProp<ViewStyle>;
};

const SubscriptionCard = ({
  title,
  price,
  description,
  highlight = false,
  onPress,
}: SubscriptionCardProps) => {
  return (
    <TouchableOpacity
      style={[styles.card, highlight && styles.highlightCard]}
      onPress={onPress}
    >
      <Text style={[styles.title]}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.price}>{price}</Text>
      <Text style={styles.subscriptionPlan}>
        Per {title === "Yearly" ? "Year" : "Month"}
      </Text>
    </TouchableOpacity>
  );
};

const SubscriptionCards = ({
  selectedProduct,
  setSelectedProduct,
  style,
  products
}: SubscriptionCardsProps) => {
  return (
    <View style={[styles.cardsContainer, style]}>
      {products.map((p) =>
        <SubscriptionCard
          key={p.title}
          title={p.title}
          price={p.priceString}
          highlight={p.id == selectedProduct.id}
          description="Without Trial"
          onPress={() => setSelectedProduct(p)}
        />)}

    </View>
  );
};

const styles = StyleSheet.create({
  cardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  card: {
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 25,
    padding: 16,
    alignItems: "center",
    width: "45%",
    backgroundColor: "#f4f7fb",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  highlightCard: {
    borderColor: "green",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  price: {
    fontSize: 22,
    marginBottom: 8,
    fontWeight: "bold",
    color: "#66bb6a",
  },
  description: {
    fontSize: 12,
    marginBottom: 16,
    fontWeight: "bold",
    color: "#666",
    textAlign: "center",
  },
  subscriptionPlan: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#666",
  },
});

export default SubscriptionCards;
