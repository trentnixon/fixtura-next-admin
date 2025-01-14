// TODO: Add Subscription Tier

import { SubscriptionTier } from "@/types";

export default function DisplaySubscriptionTier({
  subscriptionTier,
}: {
  subscriptionTier: SubscriptionTier;
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-2">Subscription Tier</h2>
      {subscriptionTier ? (
        <p>{subscriptionTier.attributes.Name}</p>
      ) : (
        <p>No subscription tier assigned.</p>
      )}
    </section>
  );
}
