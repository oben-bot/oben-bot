'use client';

import { useCatalogs } from '@/hooks/useCatalogs';
import CatalogList from '@/components/CatalogList';

export default function Home() {
  const { catalogs, deleteCatalog } = useCatalogs();

  return (
    <div className="min-h-screen bg-purple-600">
      <CatalogList catalogs={catalogs} onDelete={deleteCatalog} />
    </div>
  );
}