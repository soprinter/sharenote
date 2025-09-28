import Fuse, { type FuseResult, type IFuseOptions } from "fuse.js";
import { useState, useMemo, useEffect } from "react";
import { getCollection } from "astro:content";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Search as SearchIcon } from "lucide-react";

import type { DocsEntry } from "@/lib/types";
import { capitalizeFirstLetter } from "@/lib/utils";

function extractHeaders(body: string): string[] {
  const headers = [];
  const lines = body.split("\n");
  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.*)/);
    if (match) {
      headers.push(match[2]);
    }
  }
  return headers;
}


const docs: DocsEntry[] = await getCollection("docs");

const options: IFuseOptions<DocsEntry> = {
  includeScore: true,
  threshold: 0.5,
  location: 0,
  distance: 100,
  includeMatches: true,
  minMatchCharLength: 2,
  useExtendedSearch: true,
  findAllMatches: true,
  keys: [
    { name: "id", weight: 2.5 },
    { name: "slug", weight: 2.5 },
    { name: "body", weight: 1 },
    {
      name: "title",
      weight: 2,
      getFn: (docs: DocsEntry) => docs.data.title,
    },
    {
      name: "description",
      weight: 1.75,
      getFn: (docs: DocsEntry) => docs.data.description || "",
    },
    {
      name: "tags",
      weight: 1.5,
      getFn: (docs: DocsEntry) => docs.data.tags.join(" ") || "",
    },
    {
      name: "headers",
      weight: 2,
      getFn: (docs: DocsEntry) => extractHeaders(docs.body).join(" "),
    },
  ],
};

export function Search() {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const fuse: Fuse<DocsEntry> = useMemo(() => new Fuse(docs, options), [docs]);
  const results: FuseResult<DocsEntry>[] = useMemo(
    () => fuse.search(searchValue),
    [fuse, searchValue],
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div className="">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="btn-icon" aria-label="Search">
            <SearchIcon className="w-[1.2rem] h-[1.2rem]" />
          </button>
        </DialogTrigger>
        <DialogContent className="md:h-1/2 md:mx-0 w-full h-full">
          <DialogHeader>
            <DialogTitle hidden={true}>Search</DialogTitle>
            <DialogDescription asChild className="relative">
              <div className="mt-6 flex flex-col">
                <Input
                  placeholder="Search ..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                {results.length > 0 && (
                  <ScrollArea className="relative md:max-h-dynamic_search mt-4">
                    <ul className="mt-6 mb-6 ml-0 p-0 space-y-1">
                      {results.map(({ item, refIndex }) => (
                        <li className="m-0" key={refIndex}>
                          <a
                            href={`/${item.slug}`}
                            className="block w-full rounded-lg px-3 py-2 text-sm text-foreground no-underline hover:no-underline transition-colors hover:bg-[var(--hover-bg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color-mix(in_oklab,var(--ink)_30%,transparent)]"
                          >
                            {item.data.title
                              ? capitalizeFirstLetter(item.data.title)
                              : capitalizeFirstLetter(item.slug.split("/").pop() || "")}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
