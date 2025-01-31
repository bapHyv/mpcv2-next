'use client'

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations } from "next-intl";

export interface Tab {
  name: string;
  href: string;
  current: boolean;
}

const AccountHeader = ({ locale }: { locale: string }) => {
  const t = useTranslations("tabs");

  const router = useRouter();
  const pathname = usePathname(); // Get the current path
  const [tabs, setTabs] = useState<Tab[]>([
    { name: t("profile"), href: '/mon_compte/profile', current: false },
    { name: t("addresses"), href: '/mon_compte/adresses', current: false },
    { name: t("orders"), href: '/mon_compte/commandes', current: false },
    { name: t("loyalty"), href: '/mon_compte/fidelite', current: false },
  ]);

  useEffect(() => {
    // When the component loads, set the current tab based on the pathname
    const updatedTabs = tabs.map((tab) => ({
      ...tab,
      current: pathname === `/${locale}${tab.href}`, // Mark tab as current if the pathname matches
    }));
    setTabs(updatedTabs);
  }, [pathname, locale]); // Rerun the effect when pathname or locale changes

  const handleTabClick = (clickedTab: Tab) => {
    setTabs(tabs.map(tab => ({
      ...tab,
      current: tab.name === clickedTab.name,
    })));
    router.push(`/${locale}${clickedTab.href}`);
  };

  function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ');
  }

  return (
    <div className='dark:bg-black'>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          value={tabs.find((tab: Tab) => tab.current)?.name}
          onChange={(e) => {
            const selectedTab = tabs.find(tab => tab.name === e.target.value);
            if (selectedTab) handleTabClick(selectedTab);
          }}
          className="block w-full rounded-md border-gray-300 focus:border-green focus:ring-green"
        >
          {tabs.map((tab: Tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <nav aria-label="Tabs" className="isolate flex divide-x divide-gray-200 rounded-lg shadow">
          {tabs.map((tab: Tab, tabIdx: number) => (
            <button
              key={tab.name}
              onClick={() => handleTabClick(tab)}
              aria-current={tab.current ? 'page' : undefined}
              className={classNames(
                tab.current ? 'text-gray-900 bg-gray-100' : 'text-gray-500 hover:text-gray-700',
                tabIdx === 0 ? 'rounded-l-lg' : '',
                tabIdx === tabs.length - 1 ? 'rounded-r-lg' : '',
                'group relative min-w-0 flex-1 overflow-hidden bg-white px-4 py-4 text-center text-sm font-medium hover:bg-gray-50 focus:z-10',
              )}
            >
              <span>{tab.name}</span>
              <span
                aria-hidden="true"
                className={classNames(
                  tab.current ? 'bg-green' : 'bg-transparent',
                  'absolute inset-x-0 bottom-0 h-0.5',
                )}
              />
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default AccountHeader;
