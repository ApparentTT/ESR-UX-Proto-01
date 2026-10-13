/**
 * /search copy. The results head ("{n} results for “{q}”", "Filtered by …", "Clear search and filters"),
 * the no-results panel and "Most recent articles" are the News search wireframe's (1301:86500, 1064:46008);
 * its "No articles match that search" reads "results" here, as the page searches the whole site.
 * Not drawn: the page title, the type filter labels, the start state and "Load more results".
 */
export const SITE_SEARCH_COPY = {
  title: "Search results",
  fieldLabel: "Search ESR.com",
  typeFilterLabel: "Filter results by type",
  allLabel: "All results",
  headingWithQuery: "{n} results for “{q}”",
  headingWithQuerySingular: "{n} result for “{q}”",
  noResultsHeading: "No results for “{q}”",
  filteredBy: "Filtered by {filters}.",
  clearLabel: "Clear search and filters",
  noResultsTitle: "No results match that search",
  noResultsBody: "Try a different term, or remove a filter to widen the results.",
  noResultsClear: "Clear search",
  recentHeading: "Most recent articles",
  recentCount: 3,
  loadMoreLabel: "Load more results",
  pageSize: 10,
  startTitle: "Search ESR.com",
  startBody: "Enter a term above to search pages, news, case studies, leaders, documents and funds across the site.",
};
