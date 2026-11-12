export interface Menu {
  readonly slug: string;
  readonly title: string;
  readonly categories: readonly Category[];
}

export interface Category {
  readonly name: string;
  readonly dishes: readonly Dish[];
}

export interface Dish {
  readonly name: string;
}
