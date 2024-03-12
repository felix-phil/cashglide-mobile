import { useState } from "react";

const useOpenClose = (initialState: boolean = false) => {
  const [open, setOpen] = useState<boolean>(initialState);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const toggle = () => setOpen((prev) => !prev);
  return { open, handleOpen, handleClose, toggle };
};
export default useOpenClose;
