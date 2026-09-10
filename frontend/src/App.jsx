import AppRoutes from "./routes/AppRoutes";
import Toast from "./components/Toast";
import Background3DEffect from "./components/Common/Background3DEffect";
import PWAInstallPrompt from "./components/Common/PWAInstallPrompt";

function App() {
  return (
    <>
      <Background3DEffect />
      <Toast />
      <AppRoutes />
      <PWAInstallPrompt />
    </>
  );
}

export default App;