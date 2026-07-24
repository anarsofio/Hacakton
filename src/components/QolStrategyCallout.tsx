import { Card } from "@/components/PageShell";

export default function QolStrategyCallout() {
  return (
    <Card className="sticky top-24 border-l-4 border-l-accent p-5 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
      <h3 className="font-serif-display text-base font-semibold text-navy">
        Plaintiff&apos;s Quality of Life Response Strategy
      </h3>
      <ol className="mt-4 space-y-4 text-sm text-navy/80">
        <li>
          <p className="font-semibold text-navy">1. Never Use Absolutes (The &quot;Never/Always&quot; Trap)</p>
          <p className="mt-1 text-navy/70">
            <span className="font-medium">Avoid:</span> &quot;I can never lift my left arm.&quot;
            (Defense surveillance catching you reaching up to scratch your head will destroy
            credibility).
          </p>
          <p className="mt-1 text-navy/70">
            <span className="font-medium">Use Instead:</span> &quot;I can move my arm to a
            certain point, but it causes a sharp pain, and I instantly lose all holding
            strength.&quot;
          </p>
        </li>
        <li>
          <p className="font-semibold text-navy">2. Focus on the Loss of Autonomy</p>
          <p className="mt-1 text-navy/70">
            As a professional truck driver, your identity is built on physical strength and
            self-reliance. Focus answers on the frustration of losing independence in simple
            daily activities or helping family around the house.
          </p>
        </li>
        <li>
          <p className="font-semibold text-navy">3. Do Not Hide Your Efforts</p>
          <p className="mt-1 text-navy/70">
            If you tried to attend an event and struggled, state it clearly: &quot;I forced myself
            to go to my nephew&apos;s birthday because I love my family, but I had to sit in the
            corner and leave early because my shoulder was throbbing from sitting without
            support.&quot;
          </p>
        </li>
      </ol>
    </Card>
  );
}
