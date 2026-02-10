import { Suspense } from "react";
import SearchResultsClient from "./SearchResultsClient";

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24">Loading...</div>}>
      <SearchResultsClient />
    </Suspense>
  );
}
