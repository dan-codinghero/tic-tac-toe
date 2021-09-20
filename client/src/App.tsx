import { Switch, Route, useLocation } from 'react-router-dom';
import GameMode from './pages/GameMode/GameMode';
import { ROUTES } from './constants/routes';
import { useEffect } from 'react';
import OnlineGame from './pages/OnlineGame/OnlineGame';
import OfflineGame from './pages/OfflineGame/OfflineGame';

function App() {
    const location = useLocation();
    const pathname = location.pathname;

    useEffect(() => {
        if (!/\/tic-tac-toe\/([a-zA-Z0-9]+$)/.test(pathname)) {
            window.sessionStorage.removeItem('pageViews');
            window.sessionStorage.removeItem('room');
        }
    }, [pathname]);

    useEffect(() => {
        if (!/\/tic-tac-toe\/([a-zA-Z0-9]+$)/.test(pathname)) return;

        const handlePageRefresh = (e: BeforeUnloadEvent) => {
            window.sessionStorage.setItem('pageViews', '1');
            window.sessionStorage.setItem('room', pathname);
        };
        window.addEventListener('beforeunload', handlePageRefresh);
        return () => {
            window.removeEventListener('beforeunload', handlePageRefresh);
        };
    }, [pathname]);

    const pageViewed = window.sessionStorage.getItem('pageViews') !== null && window.sessionStorage.getItem('room') === pathname;

    return (
        <div className="bg-black flex flex-col justify-center items-center min-h-screen font-press-start text-white">
            <Switch>
                <Route exact path={ROUTES.HOME}>
                    <GameMode />
                </Route>
                <Route exact path={ROUTES.GAME}>
                    <OfflineGame />
                </Route>
                <Route exact path={`${ROUTES.GAME}/:roomId`}>
                    <OnlineGame pageViewed={pageViewed} />
                </Route>
            </Switch>
        </div>
    );
}

export default App;
