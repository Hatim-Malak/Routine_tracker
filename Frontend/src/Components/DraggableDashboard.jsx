import React, { useState, useEffect, lazy, Suspense } from "react";
const DashboardWidget = lazy(() => import("./DashboardWidget"));
import WidgetSelector from "./WidgetSelector";
import { useTask } from "../Store/UseTaskStore";
import { Loader2, ArrowLeft, ArrowRight, RefreshCw } from "lucide-react";

const WidgetSlotFallback = () => (
  <div className="w-full h-full min-w-0 min-h-0 rounded-3xl border border-[#E1F4F3] bg-[#FAFAFA] p-6 animate-pulse" />
);

const DraggableDashboard = () => {
  const { 
    dashboardLayout, 
    saveDashboardLayout, 
    savingDashboardLayout,
    getStatsForGraph,        // Consolidated API trigger
    getHistoryForGraph,      // Consolidated API trigger for your heatmap
    gettingStatsForGraph,
    gettingHistory
  } = useTask();
  
  const [selectorOpenSlot, setSelectorOpenSlot] = useState(null);

  // ── ONE API CALL TO RULE THEM ALL ──
  // This hook runs once when the dashboard loads and fetches everything in one go
  useEffect(() => {
    const fetchDashboardData = async () => {
      await Promise.all([
        getStatsForGraph(),
        getHistoryForGraph()
      ]);
    };
    fetchDashboardData();
  }, [getStatsForGraph, getHistoryForGraph]);

  const handleOpenSelector = (slotIndex) => {
    setSelectorOpenSlot(slotIndex);
  };

  const handleCloseSelector = () => {
    setSelectorOpenSlot(null);
  };

  const handleWidgetSelect = (widgetType) => {
    if (selectorOpenSlot === null) return;
    
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
    if (targetIndex < 0 || targetIndex >= dashboardLayout.length) return;
    
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
              <p className="text-sm font-semibold text-[#323643] uppercase tracking-[0.2em]">
                Widget Menu
              </p>
              <h2 className="text-2xl font-bold text-[#323643]">
                Click an empty slot to choose a chart
              </h2>
            </div>
            <div className="flex items-center gap-3 text-sm text-[#706C61]">
              {gettingStatsForGraph && (
                <span className="flex items-center gap-1.5 text-xs font-medium text-[#323643] bg-[#E1F4F3] px-2.5 py-1 rounded-full">
                  <RefreshCw className="w-3 h-3 animate-spin" /> Updating metrics...
                </span>
              )}
              History remains fixed below.
            </div>
          </div>
        </div>

        {/* The 4-Slot Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {dashboardLayout.map((widgetType, index) => (
            <div
              key={`slot-${index}`}
              className="relative rounded-3xl border border-[#E1F4F3] bg-white p-5 min-h-[350px] min-w-0 flex flex-col justify-between transition shadow-sm hover:shadow-md duration-200"
            >
              <div className="mb-4 flex items-center justify-between gap-3 border-b border-[#E1F4F3]/40 pb-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#706C61]">Slot {index + 1}</p>
                  <p className="text-xs font-semibold text-[#323643] mt-0.5">
                    {widgetType === "EMPTY" ? "Available Slot" : widgetType.replace("_", " ")}
                  </p>
                </div>
                
                {widgetType !== "EMPTY" && (
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => handleMoveWidget(index, "left")}
                      disabled={index === 0}
                      type="button"
                      className="flex items-center justify-center w-7 h-7 rounded-full bg-[#E1F4F3]/60 text-[#323643] hover:bg-[#D6EEF0] transition disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move Left"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveWidget(index, "right")}
                      disabled={index === dashboardLayout.length - 1}
                      type="button"
                      className="flex items-center justify-center w-7 h-7 rounded-full bg-[#E1F4F3]/60 text-[#323643] hover:bg-[#D6EEF0] transition disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move Right"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleOpenSelector(index)}
                      className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#E1F4F3] text-[#323643] hover:bg-[#cbeeed] transition-colors border-none cursor-pointer"
                      type="button"
                    >
                      Change
                    </button>
                    <button
                      onClick={() => handleRemoveWidget(index)}
                      className="text-[11px] font-bold px-3 py-1 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors border-none cursor-pointer"
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Render Section */}
              {widgetType !== "EMPTY" ? (
                <div className="flex-1 min-w-0 min-h-0 relative">
                  <Suspense fallback={<WidgetSlotFallback />}>
                    <DashboardWidget type={widgetType} />
                  </Suspense>
                </div>
              ) : (
                <button
                  onClick={() => handleOpenSelector(index)}
                  className="flex flex-1 flex-col items-center justify-center text-center text-[#706C61] gap-3 rounded-3xl border-2 border-dashed border-[#A6A399]/60 bg-[#F7FCFB] p-6 transition hover:border-[#323643]/40 hover:bg-[#EEF8F7] min-h-0 min-w-0 cursor-pointer group"
                  type="button"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#E1F4F3]/60 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                    <span className="text-2xl">➕</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#323643]">Add module</p>
                    <p className="text-xs max-w-40 mx-auto mt-1 font-medium">Configure this window workspace slot.</p>
                  </div>
                </button>
              )}

              {/* Layout Mutation Spinner Mask */}
              {savingDashboardLayout && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] rounded-3xl flex items-center justify-center z-30 transition-all">
                  <Loader2 className="w-8 h-8 text-[#323643] animate-spin" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Widget Grid Option Selector Drawer/Modal */}
      {selectorOpenSlot !== null && (
        <div className="fixed inset-0 z-50 bg-[#323643]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg">
            <WidgetSelector onSelect={handleWidgetSelect} onClose={handleCloseSelector} />
          </div>
        </div>
      )}
    </>
  );
};

export default DraggableDashboard;