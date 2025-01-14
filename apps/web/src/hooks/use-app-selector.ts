import { RootStateT } from "@/types";
import { TypedUseSelectorHook, useSelector } from "react-redux";

export const useAppSelector: TypedUseSelectorHook<RootStateT> = useSelector;
