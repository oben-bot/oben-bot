'use client';

import { useState, useEffect } from 'react';
import { Catalog } from '@/types/catalog';

export const useCatalogs = () => {
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);

  useEffect(() => {
    const savedCatalogs = localStorage.getItem('catalogs');
    if (savedCatalogs) {
      const parsedCatalogs = JSON.parse(savedCatalogs);
      
      // Migrar catálogos antiguos al nuevo formato
      const migratedCatalogs = parsedCatalogs.map((catalog: any) => {
        const migrated = { ...catalog };
        
        if (!catalog.planType) {
          migrated.planType = 'standard';
          migrated.premiumFeatures = {};
        }
        
        if (!catalog.businessHours) {
          migrated.businessHours = {
            monday: { open: "09:00", close: "18:00", closed: false },
            tuesday: { open: "09:00", close: "18:00", closed: false },
            wednesday: { open: "09:00", close: "18:00", closed: false },
            thursday: { open: "09:00", close: "18:00", closed: false },
            friday: { open: "09:00", close: "18:00", closed: false },
            saturday: { open: "09:00", close: "18:00", closed: false },
            sunday: { open: "09:00", close: "18:00", closed: true },
          };
        }
        
        if (!catalog.whatsappNumber) {
          // Migrar desde las funciones premium si existe
          migrated.whatsappNumber = catalog.premiumFeatures?.whatsapp?.number || "";
        }
        
        if (!catalog.generalDiscount) {
          migrated.generalDiscount = undefined;
        }
        
        return migrated;
      });
      
      setCatalogs(migratedCatalogs);
      
      // Guardar la versión migrada
      localStorage.setItem('catalogs', JSON.stringify(migratedCatalogs));
    }
  }, []);

  const saveCatalog = (catalog: Catalog) => {
    try {
      const updatedCatalogs = [...catalogs, catalog];
      setCatalogs(updatedCatalogs);
      localStorage.setItem('catalogs', JSON.stringify(updatedCatalogs));
      console.log('✅ Catálogo guardado en localStorage:', catalog.name);
    } catch (error) {
      console.error('❌ Error al guardar catálogo:', error);
      throw new Error('No se pudo guardar el catálogo');
    }
  };

  const deleteCatalog = (id: string) => {
    const updatedCatalogs = catalogs.filter(catalog => catalog.id !== id);
    setCatalogs(updatedCatalogs);
    localStorage.setItem('catalogs', JSON.stringify(updatedCatalogs));
  };

  return {
    catalogs,
    saveCatalog,
    deleteCatalog
  };
};