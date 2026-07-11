import { withContentCollections } from "@content-collections/next";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

// withContentCollections must remain the outermost plugin (ADR-0003).
export default withContentCollections(nextConfig);
