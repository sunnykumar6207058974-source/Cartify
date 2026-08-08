import AppRoutes from "./routes/AppRoutes";
import Toast from "./components/Toast";
import Background3DEffect from "./components/Common/Background3DEffect";

function App() {
  return (
    <>
      <Background3DEffect />
      <Toast />
      <AppRoutes />
    </>
  );
}

export default App;