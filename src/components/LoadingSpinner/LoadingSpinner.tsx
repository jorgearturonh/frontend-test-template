export const LoadingSpinner = () => {
  return (
    <div
      data-testid="loading-spinner"
      className="flex min-h-[calc(100vh-64px-192px)] items-center justify-center"
    >
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-neutral-200 border-t-[#585660]"></div>
    </div>
  );
};
