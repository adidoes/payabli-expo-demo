import React, { createContext, useContext, useState } from "react";
import { Alert } from "react-native";

interface PaymentMessage {
  id: string;
  timestamp: Date;
  type: "success" | "error" | "info";
  message: string;
  data?: any;
}

interface PaymentSheetContextType {
  isVisible: boolean;
  paymentMessages: PaymentMessage[];
  showPaymentSheet: () => void;
  hidePaymentSheet: () => void;
  addPaymentMessage: (
    type: "success" | "error" | "info",
    message: string,
    data?: any
  ) => void;
  clearMessages: () => void;
  onPaymentSuccess: (data: any) => void;
  onPaymentError: (error: string) => void;
}

const PaymentSheetContext = createContext<PaymentSheetContextType | undefined>(
  undefined
);

export function PaymentSheetProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [paymentMessages, setPaymentMessages] = useState<PaymentMessage[]>([]);

  const addPaymentMessage = (
    type: "success" | "error" | "info",
    message: string,
    data?: any
  ) => {
    const newMessage: PaymentMessage = {
      id: Date.now().toString(),
      timestamp: new Date(),
      type,
      message,
      data,
    };
    setPaymentMessages((prev) => [newMessage, ...prev]);
  };

  const showPaymentSheet = () => {
    addPaymentMessage("info", "Opening payment sheet...");
    setIsVisible(true);
  };

  const hidePaymentSheet = () => {
    addPaymentMessage("info", "Payment sheet closed");
    setIsVisible(false);
  };

  const onPaymentSuccess = (data: any) => {
    addPaymentMessage("success", data.message || "Payment successful!", data);
    Alert.alert("Result", "Payment successful!", [{ text: "OK" }]);
    setIsVisible(false);
  };

  const onPaymentError = (error: string) => {
    addPaymentMessage("error", error);
    Alert.alert("Payment Failed", error, [{ text: "OK" }]);
    setIsVisible(false);
  };

  const clearMessages = () => {
    setPaymentMessages([]);
  };

  return (
    <PaymentSheetContext.Provider
      value={{
        isVisible,
        paymentMessages,
        showPaymentSheet,
        hidePaymentSheet,
        addPaymentMessage,
        clearMessages,
        onPaymentSuccess,
        onPaymentError,
      }}
    >
      {children}
    </PaymentSheetContext.Provider>
  );
}

export function usePaymentSheet() {
  const context = useContext(PaymentSheetContext);
  if (context === undefined) {
    throw new Error(
      "usePaymentSheet must be used within a PaymentSheetProvider"
    );
  }
  return context;
}
