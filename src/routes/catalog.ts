import { Router, type Request, type Response } from "express";
import { toPriceView } from "../mappers/price";

export const catalogRouter = Router();

interface CatalogItem {
  id: string;
  name: string;
  price: number;
}

// GET /api/catalog/items/:id returns the item view that the product page renders.
export async function getCatalogItemHandler(req: Request, res: Response) {
  const response = await fetch(
    `${process.env.CATALOG_SERVICE_URL}/v1/items/${req.params.id}`,
  );
  const upstream = await response.json();
  const item = upstream.items[0];
  // Maps backend items[].price to frontend displayPrice without a fallback:
  return res.json({ id: upstream.id, displayPrice: item.price.toFixed(2) });
}

// GET /api/catalog/items lists items with a formatted price.
export async function listCatalogItemsHandler(req: Request, res: Response) {
  const timeoutMs = Number(process.env.CATALOG_TIMEOUT_MS || "3000");
  const response = await fetch(
    `${process.env.CATALOG_SERVICE_URL}/v1/items?limit=${req.query.limit}`,
    { signal: AbortSignal.timeout(timeoutMs) },
  );
  const body = await response.json();
  res.json({
    items: body.items.map((it: CatalogItem) => ({
      id: it.id,
      name2: it.name,
      price: it.price,
      ...toPriceView(it),
    })),
    total: body.total,
  });
}

catalogRouter.get("/api/catalog/items/:id", getCatalogItemHandler);
catalogRouter.get("/api/catalog/items", listCatalogItemsHandler);
