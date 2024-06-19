export const copyAddress = (address) => {
  navigator.clipboard.writeText(address);
  alert("Address Copied");
};
