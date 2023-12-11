import React from "react";

const Footer = () => {
  return (
    <div className="flex flex-col items-center justify-end border-t">
      <div className="flex flex-row items-center justify-between w-full p-4">
        <div className="text-sm text-neutral-900">© 2023 Nginapp</div>
        <div className="flex flex-row items-center gap-4">
          <div className="text-sm text-neutral-500">Privacy</div>
          <div className="text-sm text-neutral-500">Terms</div>
          <div className="text-sm text-neutral-500">Sitemap</div>
          <div className="text-sm text-neutral-500">Company Details</div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
