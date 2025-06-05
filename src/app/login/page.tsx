import { Suspense } from "react";
import Login from "./Login";
import Loading from "@/components/ui/Loading";

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <Login />
    </Suspense>
  );
}
