"use client";

import { useRouter } from "next/navigation";
import FormComponent from "../../components/Form";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Inputs } from "../../utils/typescript";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { fetchCurrentPost, updateCurrentPost } from "../../utils/apiPrompts";
import { toast } from "sonner";

const EditForm = () => {
  const searchParams = useSearchParams();
  const promptId = searchParams.get("id");

  const [redirectTimeoutId, setRedirectTimeoutId] = useState<any>(null);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<Inputs>();

  const { data: session, status: sessionStatus } = useSession();

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["current-post"],
    queryFn: async () => {
      return await fetchCurrentPost(promptId);
    },
    staleTime: 0,
    refetchInterval: 10000,
  });

  const mutation = useMutation({
    mutationFn: async ({
      promptId,
      formData,
    }: {
      promptId: string | null;
      formData: Inputs;
    }) => {
      return await updateCurrentPost({ promptId, formData });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-post"] });

      toast.success("Post updated successfully!");

      const redirectTimeout = setTimeout(() => {
        router.push("/");
      }, 1500);

      setRedirectTimeoutId(redirectTimeout);
    },
  });

  useEffect(() => {
    return () => {
      if (redirectTimeoutId) {
        clearTimeout(redirectTimeoutId);
      }
    };
  }, [redirectTimeoutId]);

  useEffect(() => {
    if (sessionStatus === "loading") {
      return;
    }

    if (!session) {
      router.push("/");
    }
  }, [router, session, sessionStatus]);

  const onSubmit: SubmitHandler<Inputs> = (formData: Inputs) => {
    mutation.mutate({ promptId, formData });
  };

  return (
    <FormComponent
      isLoading={mutation.isPending}
      type="Edit"
      register={register}
      handleSubmit={handleSubmit}
      onSubmitForm={onSubmit}
      watch={watch}
      errors={errors}
      control={control}
      data={data}
      isFetchingCurrentPost={isLoading}
    />
  );
};

export default EditForm;
