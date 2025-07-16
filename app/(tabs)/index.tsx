import { Image } from "expo-image";
import React from "react";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { usePaymentSheet } from "@/contexts/PaymentSheetContext";

export default function HomeScreen() {
  const { paymentMessages, showPaymentSheet, clearMessages } =
    usePaymentSheet();

  const handlePayNowPress = () => {
    showPaymentSheet();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString();
  };

  const getMessageStyle = (type: "success" | "error" | "info") => {
    switch (type) {
      case "success":
        return styles.messageSuccess;
      case "error":
        return styles.messageError;
      case "info":
        return styles.messageInfo;
      default:
        return styles.messageInfo;
    }
  };

  const getMessageTypeStyle = (type: "success" | "error" | "info") => {
    switch (type) {
      case "success":
        return styles.messageTypeSuccess;
      case "error":
        return styles.messageTypeError;
      case "info":
        return styles.messageTypeInfo;
      default:
        return styles.messageTypeInfo;
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#008BCD", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/payabli-fav.png")}
          style={styles.logo}
        />
      }
    >
      <ThemedView style={styles.buttonContainer}>
        <TouchableOpacity style={styles.payButton} onPress={handlePayNowPress}>
          <ThemedText style={styles.buttonText}>Pay Now</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.logContainer}>
        <ThemedView style={styles.logHeader}>
          <ThemedText style={styles.logTitle}>Payment Messages</ThemedText>
          {paymentMessages.length > 0 && (
            <TouchableOpacity
              onPress={clearMessages}
              style={styles.clearButton}
            >
              <ThemedText style={styles.clearButtonText}>Clear</ThemedText>
            </TouchableOpacity>
          )}
        </ThemedView>

        {paymentMessages.length === 0 ? (
          <ThemedView style={styles.emptyState}>
            <ThemedText style={styles.emptyStateText}>
              No payment messages yet. Tap &quot;Pay Now&quot; to start.
            </ThemedText>
          </ThemedView>
        ) : (
          <FlatList
            data={paymentMessages}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            renderItem={({ item: msg }) => (
              <ThemedView
                style={[styles.messageItem, getMessageStyle(msg.type)]}
              >
                <ThemedView style={styles.messageHeader}>
                  <ThemedText
                    style={[styles.messageType, getMessageTypeStyle(msg.type)]}
                  >
                    {msg.type.toUpperCase()}
                  </ThemedText>
                  <ThemedText style={styles.messageTime}>
                    {formatTime(msg.timestamp)}
                  </ThemedText>
                </ThemedView>
                <ThemedText style={styles.messageText}>
                  {msg.message}
                </ThemedText>
                {msg.data && (
                  <ThemedText style={styles.messageData}>
                    {JSON.stringify(msg.data, null, 2)}
                  </ThemedText>
                )}
              </ThemedView>
            )}
          />
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  logo: {
    height: 48,
    width: 48,
    bottom: "50%",
    left: "50%",
    transform: [{ translateX: -24 }, { translateY: 24 }],
    position: "absolute",
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  payButton: {
    backgroundColor: "#008BCD",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  logContainer: {
    marginTop: 20,
    paddingVertical: 20,
    borderRadius: 8,
  },
  logHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  logTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  clearButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#008BCD",
    borderRadius: 5,
  },
  clearButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  emptyStateText: {
    color: "#888",
    fontSize: 16,
  },
  messageItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  messageType: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#008BCD",
  },
  messageTime: {
    fontSize: 12,
    color: "#666",
  },
  messageText: {
    fontSize: 16,
    color: "#333",
  },
  messageData: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  messageSuccess: {
    borderBottomColor: "#4CAF50",
  },
  messageError: {
    borderBottomColor: "#F44336",
  },
  messageInfo: {
    borderBottomColor: "#008BCD",
  },
  messageTypeSuccess: {
    color: "#4CAF50",
  },
  messageTypeError: {
    color: "#F44336",
  },
  messageTypeInfo: {
    color: "#008BCD",
  },
});
