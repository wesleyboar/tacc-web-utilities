/* SEE: https://github.com/TACC/tacc-web-utilities/blob/main/scripts/open-ext-link-in-new-tab.js */

// Define local paths that redirect to external URLs 
// NOTE: This is ONLY necessary for old CMS sites 
// EXAMPLE: If a redirect to [https://3dem.org/atlas/] appears as [/atlas/],
//          then add '/atlas/' to this list
// SEE: https://www.w3schools.com/js/js_arrays.asp
// window.redirectPaths = ['/atlas/', 'another-path'];

// Automatically find external links and set `target="_blank"`
(function setTargetForExternalLinks(document) {
    const redirectPaths = window.redirectPaths || [];

    /**
     * Does redirect path match link path (ignoring "/" link path)
     * @param {array.<string>} redirectPaths - A list of relative URLs that shoul be treated like external URLs
     */
    const doPathsMatch = (testPath, linkPath) => {
        if (linkPath === '/') {
          return false;
        }

        return testPath === linkPath
            || testPath === linkPath.slice(1)
            || testPath === linkPath.slice(0, -1)
            || testPath === linkPath.slice(1).slice(0, -1);
    }

    /**
     * Set external links to open in new tab
     * @param {array.<string>} redirectPaths - A list of relative URLs that shoul be treated like external URLs
     * @param {HTMLElement} [scope=document] - The element within which to search for links
     */
    function findLinksAndSetTargets(redirectPaths, scope = document) {
        const links = document.getElementsByTagName('a');
        [ ...links ].forEach( function setTarget(link) {
            if ( ! link.href) {
              return false;
            }
            if (link.href.indexOf('javascript') === 0) {
              return false;
            }

            const hasExternalRedirect = redirectPaths.some(path => {
                return doPathsMatch(path, link.pathname);
            });
            const isExternal = (link.origin !== document.location.origin);
            const isIndex = ( (link.host === document.location.host)
                            && link.pathname === '/');
            const shouldOpenInNewWindow = (
                ! isIndex && (isExternal || hasExternalRedirect)
            );

            if ( shouldOpenInNewWindow ) {
                if (link.target !== '_blank') {
                    link.target = '_blank';
                    console.debug(`Link ${link.href} now opens in new tab`);
                }
            }
        });
    }

    findLinksAndSetTargets(redirectPaths);
}(document));