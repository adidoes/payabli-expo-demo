import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useRef } from "react";
import { StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

interface PaymentSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onPaymentSuccess: (data: any) => void;
  onPaymentError: (error: string) => void;
}

const PaymentSheet: React.FC<PaymentSheetProps> = ({
  isVisible,
  onClose,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const webViewRef = useRef<WebView>(null);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose();
      }
    },
    [onClose]
  );

  const handleBackdropPress = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleWebViewMessage = useCallback(
    (event: any) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);

        if (data.status === "success") {
          onPaymentSuccess(data);
          bottomSheetRef.current?.close();
        } else if (data.status === "error") {
          onPaymentError(data.message || "Payment failed");
        }
      } catch (error) {
        console.error("Error parsing WebView message:", error);
        onPaymentError("Invalid response from payment form");
      }
    },
    [onPaymentSuccess, onPaymentError]
  );

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
        onPress={handleBackdropPress}
      />
    ),
    [handleBackdropPress]
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={isVisible ? 0 : -1}
      onChange={handleSheetChanges}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      enableDynamicSizing={true}
      detached={true}
      bottomInset={0}
      style={styles.bottomSheet}
    >
      <BottomSheetView style={styles.contentContainer}>
        <WebView
          ref={webViewRef}
          source={{
            uri: "https://illustrious-sfogliatella-a4945e.netlify.app/",
          }}
          style={styles.webView}
          onMessage={handleWebViewMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
          onError={(error) => {
            console.error("WebView error:", error);
            onPaymentError("Failed to load payment form");
          }}
          onHttpError={(error) => {
            console.error("WebView HTTP error:", error);
            onPaymentError("Payment form unavailable");
          }}
        />
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    zIndex: 1000,
    elevation: 1000,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "white",
    minHeight: 450,
  },
  webView: {
    flex: 1,
  },
});

export default PaymentSheet;
