export interface Invoice {
  id: number;
  title: string;
  amount: number;
  status: "paid" | "unpaid";
}
