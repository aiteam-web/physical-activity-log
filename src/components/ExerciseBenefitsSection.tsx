const chemicalCards = [
  {
    emoji: "🧘",
    title: "Endorphins",
    description: "Helps reduce pain and boosts mood.",
  },
  {
    emoji: "🌿",
    title: "Serotonin",
    description: "Improves emotional balance and promotes calm.",
  },
  {
    emoji: "⚡",
    title: "Dopamine",
    description: "Enhances motivation, focus, and reward.",
  },
];

const deeperCards = [
  {
    emoji: "🧠",
    title: "Memory & Learning",
    description:
      "Exercise increases blood flow to the brain, helping improve memory and cognitive function.",
  },
  {
    emoji: "😴",
    title: "Stress Response",
    description:
      "Physical activity lowers stress hormones and helps your nervous system reset.",
  },
];

const ExerciseBenefitsSection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="section-container">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground text-center mb-3">
          🧠 What Happens When You Exercise?
        </h2>
        <p className="text-muted-foreground text-center text-lg max-w-2xl mx-auto mb-6">
          When you get your heart pumping, your brain makes some amazing changes.
          Think of it like upgrading your brain's operating system.
        </p>
        <p className="text-foreground text-center font-medium text-lg mb-10">
          Right away, your body releases natural mood boosters:
        </p>

        {/* Chemical cards */}
        <div className="grid sm:grid-cols-3 gap-5 max-w-3xl mx-auto mb-10">
          {chemicalCards.map((card) => (
            <div key={card.title} className="wellness-card-blue text-center space-y-2">
              <div className="text-3xl">{card.emoji}</div>
              <h3 className="font-serif text-lg font-semibold text-foreground">
                {card.title}
              </h3>
              <p className="text-sm text-muted-foreground">{card.description}</p>
            </div>
          ))}
        </div>

        {/* Callout */}
        <div className="wellness-callout max-w-3xl mx-auto mb-10">
          <p className="text-base md:text-lg font-medium text-accent-foreground">
            💡 Just 15 minutes of running can cut your risk of depression by 26%.
          </p>
        </div>

        <p className="text-foreground text-center font-medium text-lg mb-8 max-w-2xl mx-auto">
          That's not all — there's even more happening behind the scenes:
        </p>

        {/* Deeper cards */}
        <div className="grid sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {deeperCards.map((card) => (
            <div key={card.title} className="wellness-card space-y-2">
              <div className="text-2xl">{card.emoji}</div>
              <h3 className="font-serif text-lg font-semibold text-foreground">
                {card.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExerciseBenefitsSection;
