import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

import PaymentSheet from "@/components/PaymentSheet";
import {
  PaymentSheetProvider,
  usePaymentSheet,
} from "@/contexts/PaymentSheetContext";
import { useColorScheme } from "@/hooks/useColorScheme";

function AppContent() {
  const { isVisible, hidePaymentSheet, onPaymentSuccess, onPaymentError } =
    usePaymentSheet();

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
      <PaymentSheet
        isVisible={isVisible}
        onClose={hidePaymentSheet}
        onPaymentSuccess={onPaymentSuccess}
        onPaymentError={onPaymentError}
      />
    </>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <PaymentSheetProvider>
          <AppContent />
        </PaymentSheetProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
