import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { forwardRef, useCallback, useMemo, useRef } from "react";
import { StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

interface PaymentSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onPaymentSuccess: (data: any) => void;
  onPaymentError: (error: string) => void;
}

export interface PaymentSheetRef {
  present: () => void;
  dismiss: () => void;
}

const PaymentSheet = forwardRef<PaymentSheetRef, PaymentSheetProps>(
  ({ isVisible, onClose, onPaymentSuccess, onPaymentError }, ref) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const webViewRef = useRef<WebView>(null);

    const snapPoints = useMemo(() => ["70%"], []);

    const handleSheetChanges = useCallback(
      (index: number) => {
        if (index === -1) {
          onClose();
        }
      },
      [onClose]
    );

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
        />
      ),
      []
    );

    React.useImperativeHandle(ref, () => ({
      present: () => bottomSheetRef.current?.expand(),
      dismiss: () => bottomSheetRef.current?.close(),
    }));

    React.useEffect(() => {
      if (isVisible) {
        bottomSheetRef.current?.expand();
      } else {
        bottomSheetRef.current?.close();
      }
    }, [isVisible]);

    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={isVisible ? 0 : -1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
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
  }
);

PaymentSheet.displayName = "PaymentSheet";

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: "white",
    minHeight: 500,
  },
  webView: {
    flex: 1,
    backgroundColor: "white",
    height: 400,
    minHeight: 400,
    width: "100%",
  },
});

export default PaymentSheet;
