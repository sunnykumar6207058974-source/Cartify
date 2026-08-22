import AppRoutes from "./routes/AppRoutes";
import Toast from "./components/Toast";
import Background3DEffect from "./components/Common/Background3DEffect";
import FloatingAdminButton from "./components/Common/FloatingAdminButton";

function App() {
  return (
    <>
      <Background3DEffect />
      <Toast />
      <FloatingAdminButton />
      <AppRoutes />
    </>
  );
}

export default App;