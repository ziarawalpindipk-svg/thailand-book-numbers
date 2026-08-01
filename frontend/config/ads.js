// ============================================================================
// PASTE YOUR ADSTERRA AD CODES HERE
// ============================================================================
// Log in to your Adsterra dashboard -> "Manage Websites" -> add this domain
// once it's live -> create an ad unit (Banner / Native / Social Bar) ->
// Adsterra gives you a small block of HTML/JS code to paste onto your site.
//
// Copy that exact code and paste it as a string below, between the
// backticks. Leave a slot as an empty string "" if you don't want an ad
// there yet - the site will simply not show anything in that spot.
//
// Example of what Adsterra's snippet usually looks like (yours will have a
// different key/url - always use the exact one from YOUR dashboard):
//
// export const HOME_BANNER_AD = `
//   <script type="text/javascript">
//     atOptions = { 'key' : 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'format' : 'iframe', 'height' : 250, 'width' : 300, 'params' : {} };
//   </script>
//   <script type="text/javascript" src="//www.example-adnetwork.com/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/invoke.js"></script>
// `;
// ============================================================================

// Shown on the Home page, below the hero section.
export const HOME_BANNER_AD = `
<script>
  atOptions = {
    'key' : 'c689acfde3cf0093c40e73e9c55b65f4',
    'format' : 'iframe',
    'height' : 250,
    'width' : 300,
    'params' : {}
  };
</script>
<script src="https://www.highperformanceformat.com/c689acfde3cf0093c40e73e9c55b65f4/invoke.js"></script>
`;

// Shown on each Book Details page, below the description.
export const BOOK_DETAILS_BANNER_AD = `
<script>
  atOptions = {
    'key' : '2516ad40757c6aca0123b275576a442b',
    'format' : 'iframe',
    'height' : 50,
    'width' : 320,
    'params' : {}
  };
</script>
<script src="https://www.highperformanceformat.com/2516ad40757c6aca0123b275576a442b/invoke.js"></script>
`;

// Adsterra "Social Bar" (the floating/sticky ad that follows the page).
// This one is meant to load once, site-wide - it's wired into
// pages/_app.js automatically, you only need to paste the code here.
export const SOCIAL_BAR_AD = `
<script src="https://pl30638845.effectivecpmnetwork.com/8e/6d/ce/8e6dce01311b39df35958332ba87c337.js"></script>
`;
