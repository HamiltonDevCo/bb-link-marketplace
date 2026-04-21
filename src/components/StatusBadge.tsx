import type { OrderRecord } from "@/types";

type Status = OrderRecord["status"];

const config: Record<Status, { label: string; classes: string }> = {
  PAID: {
    label: "Paid",
    classes: "bg-blue-500/15 text-blue-300 ring-1 ring-blue-400/30",
  },
  IN_PROGRESS: {
    label: "In Progress",
    classes: "bg-yellow-500/15 text-yellow-300 ring-1 ring-yellow-400/30",
  },
  REVIEW: {
    label: "In Review",
    classes: "bg-orange-500/15 text-orange-300 ring-1 ring-orange-400/30",
  },
  PUBLISHED: {
    label: "Published",
    classes: "bg-green-500/15 text-green-300 ring-1 ring-green-400/30",
  },
  CANCELLED: {
    label: "Cancelled",
    classes: "bg-red-500/15 text-red-300 ring-1 ring-red-400/30",
  },
};

export default function StatusBadge({ status }: { status: Status }) {
  const { label, classes } = config[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${classes}`}
    >
      {label}
    </span>
  );
}
