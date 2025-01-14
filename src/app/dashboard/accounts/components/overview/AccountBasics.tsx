// TODO: Add Association Basics

import { Account } from "@/types";

export default function AccountBasics({ account }: { account: Account }) {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-2">Basic Info</h2>
      <p>
        <strong>ID:</strong> Link to Account in Strapi {account?.id}
      </p>
      <p>
        <strong>Account Holder:</strong> {account?.attributes.FirstName}
      </p>
      <p>
        <strong>Delivery Address:</strong> {account?.attributes.DeliveryAddress}
      </p>
      <p>
        <strong>Account Type:</strong>{" "}
        {account?.attributes.account_type?.data?.attributes?.Name || "N/A"}
      </p>
    </section>
  );
}
