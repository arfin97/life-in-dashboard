"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { name: "Overview", href: "/" },
  { name: "Health", href: "/health" },
  { name: "Habits", href: "/habits" },
  { name: "Milestones", href: "/milestones" },
];

export default function NavigationTabs() {
  const pathname = usePathname();
  return (
    <nav className="flex items-center justify-between py-4 px-8 bg-white shadow-sm border-b">
      <div className="text-xl font-bold text-purple-700">Habit Master Dashboard</div>
      <div className="flex gap-6">
        {tabs.map((tab) => (
          <Link
            key={tab.name}
            href={tab.href}
            className={`pb-2 border-b-2 transition-colors duration-200 ${
              pathname === tab.href
                ? "border-purple-500 text-purple-700 font-semibold"
                : "border-transparent text-gray-600 hover:text-purple-700 hover:border-purple-300"
            }`}
          >
            {tab.name}
          </Link>
        ))}
      </div>
    </nav>
  );
} 