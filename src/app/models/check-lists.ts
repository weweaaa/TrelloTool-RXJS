import { CheckItem } from "./check-item";

export interface Checklist {
  checkItem: CheckItem[]
  id: string;
  idBoard: string;
  idCard: string;
  name: string;
}
