"use client";

import qs from "query-string";
import { skeletonItems } from "@/utils/helpers";

import { ChangeEvent, useEffect, useState } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useDebounce } from "@/hooks/use-debound";
import { useRouter, useSearchParams } from "next/navigation";

import { fetchAllPrompts } from "../utils/apiPrompts";
import { ConvexAiChat } from "@/app/(chatbox)";

import { Bot } from "lucide-react";
import { toast } from "sonner";
import { PromptCardList } from "./PromptCardList";
import { Button } from "./ui/button";
import SkeletonLoading from "./loading/SkeletonLoading";

const Feed = () => {
  const queryClient = useQueryClient();

  // Intersection observer hook
  const { ref, inView, entry } = useInView({
    threshold: 0,
  });

  const router = useRouter();
  const [searchText, setSearchText] = useState<string>("");
  let debounceValue = useDebounce(searchText);

  debounceValue.startsWith("#")
    ? (debounceValue = debounceValue.slice(1))
    : debounceValue;

  const searchParams = useSearchParams();
  const searchValue = searchParams.get("search");

  const {
    data,
    status,
    error,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["prompts", searchValue],
    queryFn: async (props) => {
      return fetchAllPrompts({ pageValue: props.pageParam, searchValue });
    },
    initialPageParam: 1,
    getNextPageParam: (page, allPages) => {
      const nextPage = page.prompts.length ? allPages.length + 1 : undefined;

      return nextPage;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ["prompts", null] });
    }, 1000 * 30);

    return () => {
      clearInterval(interval);
    };
  }, [queryClient, searchValue]);

  ////////////////////////////////////

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    const url = qs.stringifyUrl(
      { url: "/", query: { search: debounceValue } },
      {
        skipEmptyString: true,
        skipNull: true,
      },
    );

    router.push(url);

    const timeout = setTimeout(() => {
      if (searchValue)
        queryClient.removeQueries({ queryKey: ["prompts", searchValue] });
    }, 30000);

    return () => clearTimeout(timeout);
  }, [router, debounceValue, queryClient, searchValue]);

  const handleTagClick = (tagName: string) => {
    if (tagName.startsWith("#")) setSearchText(tagName.trim());
    else {
      tagName = "#" + tagName;
      setSearchText(tagName.trim());
    }
  };

  return (
    <section className="feed">
      {/* AI chatbox */}
      <ConvexAiChat
        convexUrl={process.env.NEXT_PUBLIC_CONVEX_URL!}
        name="PromptWolrd AI Bot"
        infoMessage="AI can make mistakes. Verify your answers before using!"
        welcomeMessage="Hey there, what can I help you with?"
        renderTrigger={(onClick) => (
          <Button
            onClick={onClick}
            className="fixed bottom-5 right-3 z-[50] p-5 "
          >
            <Bot className="h-6 w-6 sm:mr-2" />
            <span className="hidden font-semibold sm:block">AI assistant</span>
          </Button>
        )}
      />

      <form className="flex-center relative flex w-full">
        <input
          type="text"
          className="search_input dark:text-black"
          placeholder="Search for a tag or some keywords..."
          value={searchText}
          onChange={handleSearchChange}
          required
        />
      </form>

      {status === "pending" && (
        <div className="prompt_layout mt-16">
          {skeletonItems.map((index) => (
            <div key={index}>
              <SkeletonLoading />
            </div>
          ))}
        </div>
      )}

      <PromptCardList
        data={data}
        handleTagClick={handleTagClick}
        isFetchingNextPage={isFetchingNextPage}
        innerRef={ref}
      />

      {isFetchingNextPage && (
        <div className="prompt_layout ">
          {skeletonItems.map((index) => (
            <div key={index}>
              <SkeletonLoading />
            </div>
          ))}
        </div>
      )}

      {}

      {error && toast.error(error.message)}
    </section>
  );
};

export default Feed;
