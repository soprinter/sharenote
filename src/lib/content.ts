import { getCollection } from "astro:content";
import type { DocsEntry, MenuItem, MenuItemWithDraft } from "@/lib/types";
import { capitalizeFirstLetter } from "@/lib/utils";
import { side_nav_menu_order } from "@/config";

// Fetch the collection server-side only
const docs: DocsEntry[] = await getCollection("docs");

function sortItems(
  items: MenuItemWithDraft[],
  orderMap: Map<string, number>,
): MenuItemWithDraft[] {
  return items.slice().sort((a, b) => {
    const aIndex = orderMap.get(a.slug) ?? Infinity;
    const bIndex = orderMap.get(b.slug) ?? Infinity;
    return aIndex - bIndex;
  });
}

function buildMenu(items: DocsEntry[]): MenuItem[] {
  const menu: MenuItemWithDraft[] = [];
  const orderMap = new Map(
    side_nav_menu_order.map((item, index) => [item, index]),
  );

  function sortTopLevel(items: MenuItemWithDraft[]): MenuItemWithDraft[] {
    const topLevelItems = items.filter((item) => !item.slug.includes("/"));
    const nestedItems = items.filter((item) => item.slug.includes("/"));

    const sortedTopLevelItems = sortItems(topLevelItems, orderMap);

    const nestedMenu: MenuItemWithDraft[] = [];
    nestedItems.forEach((item) => {
      const parts = item.slug.split("/");
      let currentLevel = nestedMenu;
      parts.forEach((part: string, index: number) => {
        let existingItem = currentLevel.find(
          (i) => i.slug === parts.slice(0, index + 1).join("/"),
        );
        if (!existingItem) {
          existingItem = {
            title: capitalizeFirstLetter(part),
            slug: parts.slice(0, index + 1).join("/"),
            draft: item.draft,
            hasPage: false,
            children: [],
          };
          currentLevel.push(existingItem);
        }
        currentLevel = existingItem.children;
      });
    });

    sortedTopLevelItems.forEach((item) => {
      if (item.children) {
        item.children = sortItems(item.children, orderMap);
      }
    });

    return sortedTopLevelItems;
  }

  items.forEach((item) => {
    const parts = item.slug.split("/");
    let currentLevel = menu;
    parts.forEach((part: string, index: number) => {
      let existingItem = currentLevel.find(
        (i) => i.slug === parts.slice(0, index + 1).join("/"),
      );
      if (!existingItem) {
        existingItem = {
          title:
            index === parts.length - 1
              ? capitalizeFirstLetter(item.data.title || "")
              : capitalizeFirstLetter(part),
          slug: parts.slice(0, index + 1).join("/"),
          draft: item.data.draft,
          hasPage: index === parts.length - 1,
          children: [],
        };
        currentLevel.push(existingItem);
      } else {
        if (index === parts.length - 1) {
          existingItem.title = capitalizeFirstLetter(item.data.title || "");
          // mark existing folder as a real page too
          (existingItem as any).hasPage = true;
        }
      }
      currentLevel = existingItem.children;
    });
  });

  const topLevelMenu = sortTopLevel(menu);
  return topLevelMenu;
}

export const menu = buildMenu(docs);
