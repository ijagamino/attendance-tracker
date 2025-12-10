import AppRouter from "./routes";
import AppProvider from "./provider";

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}
