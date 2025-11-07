// TODO: Add Go To PlayHQ Button

import { P } from "@/components/type/type";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Button_GoToPlayHQ({
  LinktoPlayHQ,
}: {
  LinktoPlayHQ: string;
}) {
  return (
    <Button variant="primary">
      <Link target="_blank" rel="noopener noreferrer" href={LinktoPlayHQ}>
        <P>Go To PlayHQ</P>
      </Link>
    </Button>
  );
}
