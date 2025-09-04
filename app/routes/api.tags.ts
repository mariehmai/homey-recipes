import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

import { getAllTags } from "~/services/tag.server";

export const loader: LoaderFunction = async () => {
  try {
    const tags = await getAllTags();
    return json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return json([], { status: 500 });
  }
};
