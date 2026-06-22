import React, { useState } from "react";
import { News, Activity } from "../types";
import { Calendar, Tag, ChevronRight, User, MapPin } from "lucide-react";

interface BoardTabProps {
  newsList: News[];
  activityList: Activity[];
}

type FilterType = "all" | "news" | "activities";

export default function BoardTab({ newsList, activityList }: BoardTabProps) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedPost, setSelectedPost] = useState<{ type: "news" | "activity"; id: string } | null>(null);

  // Combine items to sort chronologically (most recent first)
  const combinedItems = [
    ...newsList.map(n => ({ ...n, itemType: "news" as const })),
    ...activityList.map(a => ({ ...a, itemType: "activity" as const, category: "Activity", author: "Staff" }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Filter items
  const filteredItems = combinedItems.filter(item => {
    if (filter === "news") return item.itemType === "news";
    if (filter === "activities") return item.itemType === "activity";
    return true;
  });

  // Find the currently opened item details
  const activeDetailItem = selectedPost
    ? combinedItems.find(item => item.itemType === selectedPost.type && item.id === selectedPost.id)
    : null;

  return (
    <div className="space-y-4 text-left animate-fade-in" id="board_tab_container">
      {activeDetailItem ? (
        // Detaljert visning av artikkel / aktivitet
        <div className="rounded-xl border border-gray-100 bg-white p-4 space-y-3 shadow-xs animate-fade-in" id="board_post_detailed_view">
          <button 
            onClick={() => setSelectedPost(null)}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 mb-2"
            id="back_to_board_btn"
          >
            ← Back to Announcement Board
          </button>

          <div className="flex items-center gap-2">
            <span className={`inline-block rounded-xs px-2 py-0.5 text-[9px] font-bold text-white uppercase ${
              activeDetailItem.itemType === "news" ? "bg-emerald-600" : "bg-blue-600"
            }`}>
              {activeDetailItem.itemType === "news" ? (activeDetailItem as any).category : "Activity"}
            </span>
            <span className="text-[10px] text-gray-400 flex items-center gap-1">
              <Calendar size={10} />
              {new Date(activeDetailItem.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
              })}
            </span>
          </div>

          <h2 className="text-sm font-extrabold text-gray-900 leading-snug">{activeDetailItem.title}</h2>

          <div className="flex items-center gap-1 text-[10px] text-gray-500 pb-2 border-b border-gray-100">
            <User size={10} />
            <span>Published by: {activeDetailItem.author}</span>
            {(activeDetailItem as any).location && (
              <span className="ml-auto flex items-center gap-0.5">
                <MapPin size={10} />
                {(activeDetailItem as any).location}
              </span>
            )}
          </div>

          {activeDetailItem.imageUrl && (
            <img 
              src={activeDetailItem.imageUrl} 
              alt={activeDetailItem.title}
              className="w-full h-40 object-cover rounded-lg"
              referrerPolicy="no-referrer"
            />
          )}

          <p className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">
            {(activeDetailItem as any).content || (activeDetailItem as any).description}
          </p>
        </div>
      ) : (
        // Board liste visning
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-gray-800 tracking-wide uppercase">MISS Bulletins & Board</h2>
            <div className="flex bg-gray-100 rounded-sm p-0.5" id="board_filter_options">
              <button
                onClick={() => setFilter("all")}
                className={`px-2 py-0.5 text-[10px] font-semibold rounded-xs transition-all ${
                  filter === "all" ? "bg-white text-emerald-800 shadow-xs" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("news")}
                className={`px-2 py-0.5 text-[10px] font-semibold rounded-xs transition-all ${
                  filter === "news" ? "bg-white text-emerald-800 shadow-xs" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                News
              </button>
              <button
                onClick={() => setFilter("activities")}
                className={`px-2 py-0.5 text-[10px] font-semibold rounded-xs transition-all ${
                  filter === "activities" ? "bg-white text-emerald-800 shadow-xs" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Activities
              </button>
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {filteredItems.map((item) => {
              const isNews = item.itemType === "news";
              return (
                <div
                  key={`${item.itemType}-${item.id}`}
                  onClick={() => setSelectedPost({ type: item.itemType, id: item.id })}
                  className="rounded-lg border border-gray-100 bg-white p-3 hover:border-emerald-200 transition-all cursor-pointer shadow-2xs hover:shadow-xs flex flex-col space-y-1.5"
                  id={`board_card_${item.itemType}_${item.id}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`inline-block rounded-xs px-1.5 py-0.5 text-[8px] font-bold text-white uppercase tracking-wider ${
                      isNews ? "bg-emerald-600" : "bg-blue-600"
                    }`}>
                      {isNews ? (item as any).category : "Active Event"}
                    </span>
                    <span className="text-[9px] text-gray-400 font-mono">
                      {new Date(item.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric"
                      })}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-gray-900 leading-snug line-clamp-1">{item.title}</h3>
                  
                  <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed">
                    {(item as any).content || (item as any).description}
                  </p>

                  <div className="flex items-center text-[9px] font-bold text-emerald-700 pt-1.5 border-t border-gray-100/50">
                    <span>Read Details</span>
                    <ChevronRight size={10} className="mt-0.5 ml-0.5" />
                  </div>
                </div>
              );
            })}

            {filteredItems.length === 0 && (
              <div className="text-center py-10 rounded-lg border border-dashed border-gray-200 text-gray-400 text-xs">
                No articles published under this filter yet.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
