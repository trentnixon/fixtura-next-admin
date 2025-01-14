// TODO: Add Sponsors

import { Sponsor } from "@/types";

interface DisplaySponsorsProps {
  sponsors: Sponsor[] | undefined;
}

export default function DisplaySponsors({ sponsors }: DisplaySponsorsProps) {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-2">Sponsors</h2>
      {Array.isArray(sponsors) && sponsors.length ? (
        <ul className="list-disc pl-6">
          {sponsors.map(sponsor => (
            <li key={sponsor.id}>
              <strong>{sponsor.attributes.Name}</strong> (ID: {sponsor.id})
            </li>
          ))}
        </ul>
      ) : (
        <p>No sponsors assigned.</p>
      )}
    </section>
  );
}
