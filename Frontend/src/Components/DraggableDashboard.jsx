import React, { useState } from "react";
import DashboardWidget from "./DashboardWidget";
import WidgetSelector from "./WidgetSelector";
import { useTask } from "../Store/UseTaskStore";
import { Loader2, ArrowLeft, ArrowRight } from "lucide-react";

const DraggableDashboard = () => {
  const { dashboardLayout, saveDashboardLayout, savingDashboardLayout } = useTask();
  const [selectorOpenSlot, setSelectorOpenSlot] = useState(null);

  const handleOpenSelector = (slotIndex) => {
    setSelectorOpenSlot(slotIndex);
  };

  const handleCloseSelector = () => {
    setSelectorOpenSlot(null);
  };

  const handleWidgetSelect = (widgetType) => {
    if (selectorOpenSlot === null) {
      return;
    }
    const newLayout = Array.from(dashboardLayout);
    newLayout[selectorOpenSlot] = widgetType;
    saveDashboardLayout(newLayout);
    handleCloseSelector();
  };

  const handleRemoveWidget = (slotIndex) => {
    const newLayout = Array.from(dashboardLayout);
    newLayout[slotIndex] = "EMPTY";
    saveDashboardLayout(newLayout);
  };

  const handleMoveWidget = (slotIndex, direction) => {
    const targetIndex = direction === "left" ? slotIndex - 1 : slotIndex + 1;
    if (targetIndex < 0 || targetIndex >= dashboardLayout.length) {
      return;
    }
    const newLayout = Array.from(dashboardLayout);
    [newLayout[slotIndex], newLayout[targetIndex]] = [
      newLayout[targetIndex],
      newLayout[slotIndex],
    ];
    saveDashboardLayout(newLayout);
  };

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#333333] uppercase tracking-[0.2em]">
                Widget Menu
              </p>
              <h2 className="text-2xl font-bold text-[#333333]">
                Click an empty slot to choose a chart
              </h2>
            </div>
            <div className="text-sm text-[#706C61]">
              History remains fixed below.
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {dashboardLayout.map((widgetType, index) => (
            <div
              key={`slot-${index}`}
              className="relative rounded-3xl border border-[#E1F4F3] bg-white p-4 min-h-[300px] flex flex-col justify-between transition shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[#706C61]">Slot {index + 1}</p>
                  <p className="text-sm font-semibold text-[#333333]">
                    {widgetType === "EMPTY" ? "Click to add widget" : "Chart widget"}
                  </p>
                </div>
                {widgetType !== "EMPTY" && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleMoveWidget(index, "left")}
                      disabled={index === 0}
                      type="button"
                      className="text-xs px-3 py-1 rounded-full bg-[#E1F4F3] text-[#333333] border border-[#E1F4F3] hover:bg-[#D6EEF0] transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 inline-block mr-1" />
                      Left
                    </button>
                    <button
                      onClick={() => handleMoveWidget(index, "right")}
                      disabled={index === dashboardLayout.length - 1}
                      type="button"
                      className="text-xs px-3 py-1 rounded-full bg-[#E1F4F3] text-[#333333] border border-[#E1F4F3] hover:bg-[#D6EEF0] transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Right
                      <ArrowRight className="w-3.5 h-3.5 inline-block ml-1" />
                    </button>
                    <button
                      onClick={() => handleOpenSelector(index)}
                      className="text-xs px-3 py-1 rounded-full bg-[#E1F4F3] text-[#333333] border border-[#E1F4F3] hover:bg-[#D6EEF0] transition"
                      type="button"
                    >
                      Change
                    </button>
                    <button
                      onClick={() => handleRemoveWidget(index)}
                      className="text-xs px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition"
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {widgetType !== "EMPTY" ? (
                <div className="flex-1">
                  <DashboardWidget type={widgetType} />
                </div>
              ) : (
                <button
                  onClick={() => handleOpenSelector(index)}
                  className="flex flex-1 flex-col items-center justify-center text-center text-[#706C61] gap-3 rounded-3xl border-2 border-dashed border-[#A6A399] bg-[#F7FCFB] p-6 transition hover:border-[#706C61] hover:bg-[#EEF8F7]"
                  type="button"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#E1F4F3]/40 flex items-center justify-center">
                    <span className="text-3xl">➕</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Add widget</p>
                    <p className="text-xs max-w-45 mx-auto">Click to open the widget menu.</p>
                  </div>
                </button>
              )}

              {savingDashboardLayout && (
                <div className="absolute inset-0 bg-white/60 rounded-3xl flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-[#706C61] animate-spin" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectorOpenSlot !== null && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
          <div className="w-full max-w-lg">
            <WidgetSelector onSelect={handleWidgetSelect} onClose={handleCloseSelector} />
          </div>
        </div>
      )}
    </>
  );
};

export default DraggableDashboard;
