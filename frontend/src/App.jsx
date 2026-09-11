import AppRoutes from "./routes/AppRoutes";
import Toast from "./components/Toast";
import Background3DEffect from "./components/Common/Background3DEffect";
import PWAInstallPrompt from "./components/Common/PWAInstallPrompt";
import ClerkAuthSync from "./components/Common/ClerkAuthSync";

function App() {
  return (
    <>
      <ClerkAuthSync />
      <Background3DEffect />
      <Toast />
      <AppRoutes />
      <PWAInstallPrompt />
    </>
  );
}

export default App;