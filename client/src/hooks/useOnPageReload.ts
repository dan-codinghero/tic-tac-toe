import { useEffect, useState } from 'react';

function useOnPageReload() {
    const [pageReload, setPageReload] = useState(false);
    // const location = useLocation();

    // const pathname = location.pathname;
    // const equalPath = pathname.includes(path);
    useEffect(() => {
        const refreshed =
            (window.performance.navigation && window.performance.navigation.type === 1) ||
            (window.performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]).map((nav) => nav.type).includes('reload');

        setPageReload(refreshed);
    }, []);

    return pageReload;
}

export default useOnPageReload;
