import { AppDispatchT } from "@/types";
import { UseDispatch, useDispatch } from "react-redux";

export const useAppDispatch: UseDispatch<AppDispatchT> = useDispatch;
