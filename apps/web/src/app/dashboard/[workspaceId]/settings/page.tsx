"use client";

import { enableFirstView, getFirstView } from "@/actions/user";
import { Label, Switch } from "@/components/ui";
import { MutationKeysE } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Settings() {
  const [firstView, setFirstView] = useState<boolean>();

  const { mutate, isPending } = useMutation<boolean | undefined, string, boolean>({
    mutationKey: [MutationKeysE.ENABLE_FIRSTVIEW],
    mutationFn: async (enabled) => {
      const { view, message } = await enableFirstView(enabled);
      toast("Preference updated!", {
        description: message,
      });
      return view?.firstView;
    },
    onSuccess: (data) => setFirstView(data),
  });

  useEffect(() => {
    (async () => {
      const data = await getFirstView();
      if (data.status) setFirstView(data.view);
    })();
  }, []);

  const handleViewSwitch = async (checked: boolean) => mutate(checked);

  return (
    <div>
      <h2 className="text-2xl font-bold mt-4">Video Sharing</h2>
      <p className="text-muted-foreground">
        Enabling this feature will send you notifications when someone watched your video for the first time. This
        feature can help during client outreach.
      </p>

      <Label className="flex items-center gap-x-3 mt-4 text-sm">
        Enable First View
        <Switch
          onCheckedChange={handleViewSwitch}
          disabled={isPending || firstView === undefined}
          checked={firstView}
        />
      </Label>
    </div>
  );
}
