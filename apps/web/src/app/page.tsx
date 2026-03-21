import { redirect } from "next/navigation";

export const metadata = {
  title: "PayWatch",
  description: "Redirecting to app.paywatch.app",
};

export default function Page() {
  redirect("https://app.paywatch.app");
}
