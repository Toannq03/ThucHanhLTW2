import { Session } from "next-auth";
import { DefaultSessionWithId, Inputs } from "./typescript";
import { unstable_noStore as noStore } from "next/cache";


export const fetchAllPrompts = async ({
  searchValue,
  pageValue,
}: {
  searchValue: string | null;
  pageValue: number;
}) => {
  noStore();
  let response;
  if (searchValue === null) {
    response = await fetch(`/api/prompt?page=${pageValue.toString()}`, {
      cache: "no-store",
    });
  } else {
    response = await fetch(
      `/api/prompt?page=${pageValue.toString()}&search=${searchValue}`,
      {
        cache: "no-store",
      },
    );
  }
  const data = await response.json();
  return data;
};


export const fetchCurrentUserPosts = async (session: Session | null) => {
  noStore();
  const response = await fetch(
    `/api/users/${(session as DefaultSessionWithId)?.user?.id}/posts`,
  );
  const data = await response.json();

  return data;
};


export const createNewPost = async ({
  formData,
  session,
}: {
  formData: Inputs;
  session: Session | null | undefined;
}) => {
  noStore();
  const res = await fetch("/api/prompt/new", {
    method: "POST",
    body: JSON.stringify({
      prompt: formData.prompt,
      userId: (session as DefaultSessionWithId)?.user?.id,
      tag: formData.tag,
      dateAdded: new Date(Date.now()).toISOString(),
    }),
  });

  return res;
};

///////////////////////////

export const updateCurrentPost = async ({
  promptId,
  formData,
}: {
  promptId: string | null;
  formData: Inputs;
}) => {
  noStore();
  const res = await fetch(`/api/prompt/${promptId}`, {
    method: "PATCH",
    body: JSON.stringify({
      prompt: formData.prompt,
      tag: formData.tag,
      dateAdded: new Date(Date.now()).toISOString(),
    }),
  });
};

//////////////////////////////

export const fetchCurrentPost = async (promptId: string | null) => {
  noStore();
  const res = await fetch(`/api/prompt/${promptId}`);
  const data = await res.json();

  return data;
};

///////////////////////////////////

export const fecthOtherUserPosts = async (params: { id: string }) => {
  noStore();
  const response = await fetch(`/api/users/${params?.id}/posts`);
  const data = await response.json();

  return data;
};
