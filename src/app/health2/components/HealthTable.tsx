import { TableRow, EditValues } from '../types';

interface HealthTableProps {
  tableData: TableRow[];
  columns: string[];
  habitColumns: string[];
  editingRow: string | null;
  editValues: EditValues;
  mounted: boolean;
  todayStr: string;
  onEditClick: (date: string) => void;
  onEditSave: (date: string) => void;
  onEditCancel: () => void;
  onEditHabitChange: (habit: string, value: string) => void;
}

export default function HealthTable({
  tableData,
  columns,
  habitColumns,
  editingRow,
  editValues,
  mounted,
  todayStr,
  onEditClick,
  onEditSave,
  onEditCancel,
  onEditHabitChange,
}: HealthTableProps) {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow p-6">
      <div className="max-h-[500px] overflow-y-auto">
        <table className="min-w-full border-separate border-spacing-y-2">
          <thead>
            <tr className="bg-white">
              {columns.map((col) => (
                <th
                  key={col}
                  className="text-xs font-semibold text-gray-700 px-2 py-2 text-left whitespace-nowrap border border-gray-200 sticky top-0 z-10 bg-white"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row) => {
              const isToday = mounted && row.date === todayStr;
              const isPast = mounted && row.raw < new Date();
              let rowClass = "";
              let textClass = "";
              if (isToday) {
                rowClass = "bg-purple-100";
                textClass = "text-gray-900";
              } else if (isPast) {
                rowClass = "bg-gray-100";
                textClass = "text-gray-400";
              } else {
                rowClass = "bg-white";
                textClass = "text-gray-900";
              }
              return (
                <tr
                  key={row.date}
                  data-date={row.date}
                  className={`${rowClass} ${textClass} rounded-lg transition hover:bg-purple-50 hover:shadow`}
                >
                  <td className="px-2 py-2 font-medium whitespace-nowrap border border-gray-200">
                    {row.date}
                    {editingRow === row.date ? (
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => onEditSave(row.date)}
                          className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={onEditCancel}
                          className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => onEditClick(row.date)}
                        className="ml-2 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                  {row.values.map((val, idx) => {
                    const colName = columns[idx + 1];
                    if (editingRow === row.date) {
                      if (habitColumns.includes(colName)) {
                        return (
                          <td key={idx} className="px-2 py-2 text-center border border-gray-200">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => onEditHabitChange(colName, "yes")}
                                className={`px-2 py-1 text-xs rounded ${
                                  editValues.habits[colName] === "yes"
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => onEditHabitChange(colName, "no")}
                                className={`px-2 py-1 text-xs rounded ${
                                  editValues.habits[colName] === "no"
                                    ? "bg-red-500 text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                              >
                                No
                              </button>
                            </div>
                          </td>
                        );
                      }
                    }
                    return (
                      <td key={idx} className="px-2 py-2 text-center border border-gray-200">
                        {val}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
} 