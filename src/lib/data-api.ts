import { finalsCatalog, validationSnapshot } from '@/lib/finals-data';
import { FinalsCatalog, PricingContext, ValidationSnapshot } from '@/lib/types';

export async function getFinalsCatalog(): Promise<FinalsCatalog> {
  return finalsCatalog;
}

export async function getPricingContexts(): Promise<PricingContext[]> {
  return finalsCatalog.pricingContexts;
}

export async function getValidationSnapshot(): Promise<ValidationSnapshot> {
  return validationSnapshot;
}
