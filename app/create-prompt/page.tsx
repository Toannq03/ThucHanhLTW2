"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";

import FormComponent from "../../components/Form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Inputs } from "../../utils/typescript";
import { createNewPost } from "../../utils/apiPrompts";
import { Session } from "next-auth";

const CreatePrompt = () => {
  const [redirectTimeoutId, setRedirectTimeoutId] = useState<any>(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<Inputs>();

  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      formData,
      session,
    }: {
      formData: Inputs;
      session: Session | null | undefined;
    }) => {
      return createNewPost({ formData, session });
    },

    onSuccess: () => {
      toast.success("Post created successfully!");

      const redirectTimeout = setTimeout(() => {
        router.push("/");
      }, 1500);

      queryClient.invalidateQueries({ queryKey: ["prompts"] });

      setRedirectTimeoutId(redirectTimeout);
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (formData: Inputs) => {
    if (!session) {
      toast.error("Please login to create new post!");
      return;
    }

    mutation.mutate({ formData, session });
  };

  useEffect(() => {
    return () => {
      if (redirectTimeoutId) {
        clearTimeout(redirectTimeoutId);
      }
    };
  }, [redirectTimeoutId]);

  return (
    <FormComponent
      isLoading={mutation.isPending}
      type="Create"
      register={register}
      handleSubmit={handleSubmit}
      onSubmitForm={onSubmit}
      watch={watch}
      errors={errors}
      control={control}
    />
  );
};

export default CreatePrompt;
