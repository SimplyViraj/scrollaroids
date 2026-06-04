import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { IntroAnimation } from "@/components/intro/IntroAnimation";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FLIXR — Watch anywhere" },
      { name: "description", content: "Stream unlimited movies and shows on FLIXR." },
      { property: "og:title", content: "FLIXR" },
      { property: "og:description", content: "Stream unlimited movies and shows." },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) navigate({ to: "/profiles" });
  }, [done, navigate]);

  return <IntroAnimation onDone={() => setDone(true)} />;
}
