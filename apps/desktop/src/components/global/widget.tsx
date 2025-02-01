import { Loader } from "@/components/global";
import { useMediaSources } from "@/hooks";
import { axiosInstance } from "@/libs/utils";
import { QueryKeysE } from "@/types";
import { ClerkLoading, useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";

type Props = {};

const Widget: React.FC<Props> = ({}) => {
  const { user } = useUser();
  console.log({ user });

  const { data: profile } = useQuery({
    queryKey: [QueryKeysE.USER_PROFILE],
    queryFn: async () => {
      const response = await axiosInstance.get(`/auth/${user?.id}`);

      return response.data;
    },
  });

  const { fetchMediaSources, state } = useMediaSources();

  useEffect(() => {
    if (user && user.id) {
    }
  }, [user]);

  return (
    <div className="p-5">
      <ClerkLoading>
        <div className="h-full flex justify-center items-center">
          <Loader />
        </div>
      </ClerkLoading>

      {/* <SignedIn>
        {profile ? <MediaConfiguration /> : <div className="w-full h-full flex justify-center items-center">
          <Loader className="text-white" />
          </div>}
      </SignedIn> */}
    </div>
  );
};

export default Widget;
