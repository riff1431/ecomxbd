"use server";

import { getSetting, updateGroupSettings } from "@/lib/settings/config-service";
import { revalidatePath } from "next/cache";

export interface ExpenseItem {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
  createdAt: string;
}

export interface AccountItem {
  id: string;
  name: string;
  type: string;
  balance: number;
  accountNo: string;
  updatedAt: string;
}

export interface DueItem {
  id: string;
  entity: string;
  type: string;
  amount: number;
  paid: number;
  status: "due" | "partial" | "settled";
  dueDate: string;
  notes: string;
}

export interface InvestorItem {
  id: string;
  name: string;
  equity: string;
  capital: number;
  profitDistributed: number;
  contact: string;
  status: string;
}

const DEFAULT_EXPENSES: ExpenseItem[] = [
  {
    id: "exp-1",
    category: "Freight & Customs",
    amount: 45000,
    description: "Air cargo customs clearance from Incheon to Dhaka Airport (DAC)",
    date: "2026-08-28",
    createdAt: new Date("2026-08-28").toISOString(),
  },
  {
    id: "exp-2",
    category: "Packaging Materials",
    amount: 8500,
    description: "500x Custom branded holographic skincare mailer boxes & bubble wrap",
    date: "2026-08-25",
    createdAt: new Date("2026-08-25").toISOString(),
  },
  {
    id: "exp-3",
    category: "SMS Gateway",
    amount: 1500,
    description: "10,000 Masked transactional SMS credits (BulkSMSBD)",
    date: "2026-08-20",
    createdAt: new Date("2026-08-20").toISOString(),
  },
  {
    id: "exp-4",
    category: "Cloud Infrastructure",
    amount: 3200,
    description: "Supabase Pro tier + Cloudinary Media storage",
    date: "2026-08-01",
    createdAt: new Date("2026-08-01").toISOString(),
  },
];

const DEFAULT_ACCOUNTS: AccountItem[] = [
  {
    id: "acc-1",
    name: "BRAC Bank (Corporate Account)",
    type: "Asset (Bank)",
    balance: 485000,
    accountNo: "1501-XXXX-XXXX-001",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "acc-2",
    name: "The City Bank (Merchant Account)",
    type: "Asset (Bank)",
    balance: 210000,
    accountNo: "1102-XXXX-XXXX-002",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "acc-3",
    name: "bKash Merchant Wallet",
    type: "Asset (MFS)",
    balance: 65400,
    accountNo: "017XXXXXXXX",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "acc-4",
    name: "SteadFast Courier COD Receivable",
    type: "Asset (Receivable)",
    balance: 45200,
    accountNo: "SF-M-8823",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "acc-5",
    name: "Seoul Wholesale Supplier Payable",
    type: "Liability (Payable)",
    balance: -120000,
    accountNo: "SUP-KR-01",
    updatedAt: new Date().toISOString(),
  },
];

const DEFAULT_DUES: DueItem[] = [
  {
    id: "due-1",
    entity: "SteadFast Courier",
    type: "Receivable (COD)",
    amount: 45200,
    paid: 0,
    status: "due",
    dueDate: "2026-09-04",
    notes: "COD collection for 34 delivered orders in Dhaka & Chattogram",
  },
  {
    id: "due-2",
    entity: "Seoul Cosmetics Wholesale Ltd",
    type: "Payable (Supplier)",
    amount: 120000,
    paid: 40000,
    status: "partial",
    dueDate: "2026-09-15",
    notes: "Balance for August 500x COSRX Snail Essence shipment",
  },
];

const DEFAULT_INVESTORS: InvestorItem[] = [
  {
    id: "inv-1",
    name: "Rahim Chowdhury",
    equity: "35.0%",
    capital: 2500000,
    profitDistributed: 185000,
    contact: "+880 1819-112233",
    status: "Active Stakeholder",
  },
  {
    id: "inv-2",
    name: "Tanzim Hasan",
    equity: "15.0%",
    capital: 1000000,
    profitDistributed: 78000,
    contact: "+880 1711-445566",
    status: "Active Stakeholder",
  },
];

/* =========================================================================
   EXPENSES ACTIONS
   ========================================================================= */

export async function getExpenses(): Promise<ExpenseItem[]> {
  const expenses = await getSetting<ExpenseItem[]>("finance", "expenses", DEFAULT_EXPENSES);
  return expenses || DEFAULT_EXPENSES;
}

export async function addExpense(data: {
  category: string;
  amount: number;
  description: string;
  date: string;
}): Promise<ExpenseItem[]> {
  const current = await getExpenses();
  const newExpense: ExpenseItem = {
    id: `exp-${Date.now()}`,
    category: data.category.trim(),
    amount: Math.abs(Number(data.amount)),
    description: data.description.trim(),
    date: data.date || new Date().toISOString().split("T")[0],
    createdAt: new Date().toISOString(),
  };

  const updated = [newExpense, ...current];
  await updateGroupSettings("finance", { expenses: updated });
  revalidatePath("/admin/finance/costs");
  return updated;
}

export async function deleteExpense(id: string): Promise<ExpenseItem[]> {
  const current = await getExpenses();
  const updated = current.filter((e) => e.id !== id);
  await updateGroupSettings("finance", { expenses: updated });
  revalidatePath("/admin/finance/costs");
  return updated;
}

/* =========================================================================
   ACCOUNTING & BALANCES ACTIONS
   ========================================================================= */

export async function getAccounts(): Promise<AccountItem[]> {
  const accounts = await getSetting<AccountItem[]>("finance", "accounts", DEFAULT_ACCOUNTS);
  return accounts || DEFAULT_ACCOUNTS;
}

export async function saveAccount(data: {
  id?: string;
  name: string;
  type: string;
  balance: number;
  accountNo: string;
}): Promise<AccountItem[]> {
  const current = await getAccounts();
  let updated: AccountItem[];

  if (data.id) {
    updated = current.map((a) =>
      a.id === data.id
        ? {
            ...a,
            name: data.name.trim(),
            type: data.type.trim(),
            balance: Number(data.balance),
            accountNo: data.accountNo.trim(),
            updatedAt: new Date().toISOString(),
          }
        : a
    );
  } else {
    const newAcc: AccountItem = {
      id: `acc-${Date.now()}`,
      name: data.name.trim(),
      type: data.type.trim(),
      balance: Number(data.balance),
      accountNo: data.accountNo.trim(),
      updatedAt: new Date().toISOString(),
    };
    updated = [...current, newAcc];
  }

  await updateGroupSettings("finance", { accounts: updated });
  revalidatePath("/admin/finance/accounting");
  return updated;
}

export async function deleteAccount(id: string): Promise<AccountItem[]> {
  const current = await getAccounts();
  const updated = current.filter((a) => a.id !== id);
  await updateGroupSettings("finance", { accounts: updated });
  revalidatePath("/admin/finance/accounting");
  return updated;
}

/* =========================================================================
   DUES & SETTLEMENTS ACTIONS
   ========================================================================= */

export async function getDues(): Promise<DueItem[]> {
  const dues = await getSetting<DueItem[]>("finance", "dues", DEFAULT_DUES);
  return dues || DEFAULT_DUES;
}

export async function addDue(data: {
  entity: string;
  type: string;
  amount: number;
  dueDate: string;
  notes?: string;
}): Promise<DueItem[]> {
  const current = await getDues();
  const newDue: DueItem = {
    id: `due-${Date.now()}`,
    entity: data.entity.trim(),
    type: data.type.trim(),
    amount: Math.abs(Number(data.amount)),
    paid: 0,
    status: "due",
    dueDate: data.dueDate,
    notes: data.notes?.trim() || "",
  };

  const updated = [newDue, ...current];
  await updateGroupSettings("finance", { dues: updated });
  revalidatePath("/admin/finance/dues");
  return updated;
}

export async function settleDue(
  id: string,
  paymentAmount: number,
  notes?: string
): Promise<DueItem[]> {
  const current = await getDues();
  const updated = current.map((d) => {
    if (d.id !== id) return d;
    const newPaid = d.paid + Number(paymentAmount);
    const newStatus: "due" | "partial" | "settled" =
      newPaid >= d.amount ? "settled" : newPaid > 0 ? "partial" : "due";
    return {
      ...d,
      paid: newPaid,
      status: newStatus,
      notes: notes ? `${d.notes} [Settlement Note: ${notes}]` : d.notes,
    };
  });

  await updateGroupSettings("finance", { dues: updated });
  revalidatePath("/admin/finance/dues");
  return updated;
}

export async function deleteDue(id: string): Promise<DueItem[]> {
  const current = await getDues();
  const updated = current.filter((d) => d.id !== id);
  await updateGroupSettings("finance", { dues: updated });
  revalidatePath("/admin/finance/dues");
  return updated;
}

/* =========================================================================
   INVESTORS & EQUITY ACTIONS
   ========================================================================= */

export async function getInvestors(): Promise<InvestorItem[]> {
  const investors = await getSetting<InvestorItem[]>("finance", "investors", DEFAULT_INVESTORS);
  return investors || DEFAULT_INVESTORS;
}

export async function addInvestor(data: {
  name: string;
  equity: string;
  capital: number;
  contact: string;
  status: string;
}): Promise<InvestorItem[]> {
  const current = await getInvestors();
  const newInv: InvestorItem = {
    id: `inv-${Date.now()}`,
    name: data.name.trim(),
    equity: data.equity.includes("%") ? data.equity : `${data.equity}%`,
    capital: Math.abs(Number(data.capital)),
    profitDistributed: 0,
    contact: data.contact.trim(),
    status: data.status.trim() || "Active Stakeholder",
  };

  const updated = [...current, newInv];
  await updateGroupSettings("finance", { investors: updated });
  revalidatePath("/admin/finance/investors");
  return updated;
}

export async function distributeProfit(id: string, amount: number): Promise<InvestorItem[]> {
  const current = await getInvestors();
  const updated = current.map((inv) => {
    if (inv.id !== id) return inv;
    return {
      ...inv,
      profitDistributed: inv.profitDistributed + Math.abs(Number(amount)),
    };
  });

  await updateGroupSettings("finance", { investors: updated });
  revalidatePath("/admin/finance/investors");
  return updated;
}

export async function deleteInvestor(id: string): Promise<InvestorItem[]> {
  const current = await getInvestors();
  const updated = current.filter((inv) => inv.id !== id);
  await updateGroupSettings("finance", { investors: updated });
  revalidatePath("/admin/finance/investors");
  return updated;
}
