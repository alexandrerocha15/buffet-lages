export interface CatalogCategory {
  readonly name: string;
  readonly dishes: readonly CatalogDish[];
}

export interface CatalogDish {
  readonly key: string;
  readonly name: string;
  readonly menus: readonly string[];
}
