import FeatureLabLayout from "./_components/Navigation";

export default function FeaturesLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FeatureLabLayout>{children}</FeatureLabLayout>;
}
