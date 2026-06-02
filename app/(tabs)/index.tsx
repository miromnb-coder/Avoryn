import { AvorynAuthGate } from "../../components/auth/AvorynAuthGate";
import { AvorynHomeScreen } from "../../screens/AvorynHomeScreen";

export default function AskScreen() {
  return (
    <AvorynAuthGate>
      <AvorynHomeScreen />
    </AvorynAuthGate>
  );
}
