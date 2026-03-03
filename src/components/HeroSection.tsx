import heroImage from "@/assets/hero-jogging.jpg";

const HeroSection = () => {
  return (
    <section className="relative w-full min-h-[90vh] md:min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <img
        src={heroImage}
        alt="Woman jogging on a forest trail at sunrise"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 hero-gradient-overlay" />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 hero-bottom-fade" />

      {/* Floating circles */}
      <div className="hidden md:block absolute right-[12%] top-[30%] w-28 h-28 rounded-full bg-wellness-accent/30 shadow-lg animate-float" />
      <div className="hidden md:block absolute right-[8%] top-[55%] w-16 h-16 rounded-full bg-wellness-blue-light/50 shadow-md animate-float-slow" />

      {/* Content */}
      <div className="relative z-10 section-container w-full py-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-wellness-navy/80 shadow-md mb-8">
          <span className="text-sm">✨</span>
          <span className="text-sm font-medium text-primary-foreground tracking-wide">
            Physical Activity Test
          </span>
        </div>

        {/* Heading */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-5 max-w-2xl">
          <span className="text-primary-foreground">Move Your Body,</span>
          <br />
          <span className="text-wellness-accent">Transform Your Mind</span>
        </h1>

        {/* Subheading */}
        <p className="text-base sm:text-lg md:text-xl text-primary-foreground/75 max-w-lg leading-relaxed font-sans">
          Discover how exercise can upgrade your brain's operating system and
          build a lasting habit for better mental health.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
