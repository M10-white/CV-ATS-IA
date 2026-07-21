import { useEffect, useState } from "react";

const PHRASES = [
  "Tu vas y arriver !",
  "C'est toi la plus forte !",
  "Melyha mode: ON",
  "Ce job est fait pour toi",
  "Les recruteurs vont t'adorer",
  "Confiance absolue",
  "Queen des entretiens",
  "Ton CV va tout déchirer",
  "Inarrêtable",
  "Le monde du travail n'est pas prêt",
  "Skibidi power activated",
  "Boss level: Melyha",
  "67 représente",
  "Future employée du mois",
  "Main character energy",
];

export function MotivationalBackground() {
  const [phrase, setPhrase] = useState("");
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const showPhrase = () => {
      const next = PHRASES[Math.floor(Math.random() * PHRASES.length)];
      setPhrase(next);
      setPosition({
        x: 15 + Math.random() * 70,
        y: 20 + Math.random() * 60,
      });
      setVisible(true);
      setTimeout(() => setVisible(false), 2200);
    };

    showPhrase();
    const interval = setInterval(showPhrase, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <span
        style={{
          position: "absolute",
          left: `${position.x}%`,
          top: `${position.y}%`,
          transform: "translate(-50%, -50%)",
          opacity: visible ? 0.08 : 0,
          transition: "opacity 1s ease-in-out",
          fontSize: "clamp(1.5rem, 4vw, 3rem)",
          fontWeight: 800,
          color: "var(--color-accent)",
          whiteSpace: "nowrap",
          userSelect: "none",
        }}
      >
        {phrase}
      </span>
    </div>
  );
}
