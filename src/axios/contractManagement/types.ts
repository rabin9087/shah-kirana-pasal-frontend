// models/JobPayment.ts

export interface IJobPayment {
  jobId: string;
  contractRate: number;
  advance: number;
  paymentMethod: "Cash" | "Card" | "Bank Transfer" | "Other";
  paymentDate: Date;
  remainingAmount: number;
}
