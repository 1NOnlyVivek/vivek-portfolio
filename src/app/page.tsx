import { client } from "@/sanity/lib/client";
import HomeClient from "./HomeClient";
import type { Metadata } from "next";

export const revalidate = 0; 

// 1. ADD THIS METADATA BLOCK HERE
export const metadata: Metadata = {
  title: "Vivek Bhimajiyani | Professional Video Editor",
  description: "Freelance video editor specializing in high-retention reels, cinematic ads, and commercial projects.",
};

const query = `*[_type == "project"] | order(year desc) {
  _id,
  title,
  category,
  year,
  videoUrl,
  "imageUrl": thumbnail.asset->url
}`;

export default async function Home() {
  const projects = await client.fetch(query);

  return (
    <HomeClient projects={projects} />
  );
}