import { Inter } from "@next/font/google";

// TODO what to do with this?
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return <h1 className="text-3xl font-bold underline">Hello world!</h1>;
}
