import { type ReactNode, useState, useEffect, useRef } from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  content: ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
}

export function Tabs({ tabs, defaultTab, onChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0]?.id);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (onChange) onChange(activeTab);
  }, [activeTab, onChange]);

  useEffect(() => {
    const container = containerRef.current;
    const indicator = indicatorRef.current;
    if (!container || !indicator) return;
    const activeBtn = container.querySelector(`[data-tab="${activeTab}"]`) as HTMLElement;
    if (activeBtn) {
      indicator.style.left = `${activeBtn.offsetLeft}px`;
      indicator.style.width = `${activeBtn.offsetWidth}px`;
    }
  }, [activeTab, tabs]);

  const activeContent = tabs.find((t) => t.id === activeTab)?.content;

  return (
    <div>
      <div className="relative border-b border-base-700" ref={containerRef}>
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              data-tab={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-button whitespace-nowrap ${
                activeTab === tab.id ? 'tab-active' : 'tab-inactive'
              }`}
            >
              <span className="flex items-center gap-2">
                {tab.icon}
                {tab.label}
              </span>
            </button>
          ))}
        </div>
        <div
          ref={indicatorRef}
          className="absolute bottom-0 h-0.5 bg-accent-500 transition-all duration-200 ease-out"
          style={{ left: 0, width: 0 }}
        />
      </div>
      <div className="pt-5 animate-fade-in">{activeContent}</div>
    </div>
  );
}
