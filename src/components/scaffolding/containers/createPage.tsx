const CreatePage = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex flex-col gap-2 border-b border-slate-200 pb-3 mb-2">
        {children}
      </div>
    </div>
  );
};

export default CreatePage;
