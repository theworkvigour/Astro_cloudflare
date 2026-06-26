import { products, type ProductRecord } from '~/data/products';
import { productTexts } from '~/data/product-texts';

export function localizeProduct(product: ProductRecord, locale: string): ProductRecord {
  const texts = productTexts[locale]?.[product.id];
  if (!texts) return product;
  return {
    ...product,
    name: texts.name ?? product.name,
    desc: texts.desc ?? product.desc,
    definition: texts.definition ?? product.definition,
    problem: texts.problem ?? product.problem,
    howItWorks: texts.howItWorks ?? product.howItWorks,
    audience: texts.audience ?? product.audience,
    ai_use_cases: texts.ai_use_cases ?? product.ai_use_cases,
    ai_comparison: texts.ai_comparison ?? product.ai_comparison,
    ai_faq: texts.ai_faq ?? product.ai_faq,
  };
}

export function getLocalizedProducts(locale: string): ProductRecord[] {
  return products.map(p => localizeProduct(p, locale));
}
