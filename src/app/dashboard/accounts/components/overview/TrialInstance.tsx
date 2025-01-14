// TODO: Add Trial Instance

import { TrialInstance } from "@/types";

export default function DisplayTrialInstance({
  trialInstance,
}: {
  trialInstance: TrialInstance;
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-2">Trial Instance</h2>
      {trialInstance ? (
        <p>
          <strong>Start Date:</strong> {trialInstance.attributes.startDate} -{" "}
          <strong>End Date:</strong> {trialInstance.attributes.endDate}
        </p>
      ) : (
        <p>No trial instance found.</p>
      )}
    </section>
  );
}
