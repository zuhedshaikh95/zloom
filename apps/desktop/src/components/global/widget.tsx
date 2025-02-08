import { Loader, MediaConfiguration } from "@/components/global";
import { useMediaSources } from "@/hooks";
import { axiosInstance } from "@/libs/utils";
import { QueryKeysE, RouteReponseT, UserProfileT } from "@/types";
import { ClerkLoading, SignedIn, useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";

type Props = {};

const Widget: React.FC<Props> = ({}) => {
  const { user } = useUser();

  const { data: profile, refetch } = useQuery({
    queryKey: [QueryKeysE.USER_PROFILE],
    enabled: false,
    queryFn: async () => {
      const response = await axiosInstance.get<RouteReponseT<UserProfileT>>(`/api/auth/${user?.id}`);

      return response.data.data;
    },
  });

  const { state, fetchMediaSources } = useMediaSources();

  useEffect(() => {
    if (user) refetch(), fetchMediaSources();
  }, [user]);

  return (
    <div className="p-5">
      <ClerkLoading>
        <div className="h-full flex justify-center items-center">
          <Loader />
        </div>
      </ClerkLoading>

      <SignedIn>
        {profile ? (
          <MediaConfiguration state={state} user={profile} />
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <Loader />
          </div>
        )}
      </SignedIn>
    </div>
  );
};

export default Widget;
