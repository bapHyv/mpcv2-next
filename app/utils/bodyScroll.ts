export const disableBodyScroll = () => {
  document.body.style.overflow = "hidden";
  document.body.style.paddingRight = "calc(16px - (100vw - 100%)"; // Prevent layout shift when scrollbar disappears
};

export const enableBodyScroll = () => {
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";
};
