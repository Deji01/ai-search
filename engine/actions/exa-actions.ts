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

    // Sort the results by score in descending order and select the top 5
    const topResults = result.results
      .filter((result) => result.score !== undefined) // Filter out items where score is undefined
      .sort((a, b) => (b.score! - a.score!)) // Use non-null assertion '!' after filtering
      .slice(0, 5); // Select the top 5

    console.log("Search results:", JSON.stringify(topResults, null, 2));
    return topResults;
  } catch (error) {
    console.error("Error performing search:", error);
    throw new Error("Failed to perform search");
  }
}
