"use server";

import Exa from "exa-js";

const exa = new Exa(process.env.EXA_API_KEY);

// Rename function to `fetchExaResults`
export async function fetchExaResults(query: string) {
  try {
    console.log(`Searching for: ${query}`);
    const result = await exa.searchAndContents(query, {
      type: "neural",
      useAutoprompt: true,
      numResults: 10,
      text: true,
    });
    console.log("Search results:", JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error("Error performing search:", error);
    throw new Error("Failed to perform search");
  }
}
