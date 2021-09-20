import { Link } from 'react-router-dom';
import FreezeWrapper from '../../components/FreezeWrapper/FreezeWrapper';
import GameRoom from '../../components/GameRoom/GameRoom';
import { ROUTES } from '../../constants/routes';

const OnlineGame = ({ pageViewed }: { pageViewed: boolean }) => {
    return (
        <FreezeWrapper>
            {pageViewed ? (
                <div className="my-3 cursor-pointer">
                    Opps!!! The page you looking for is no longer available{' '}
                    <Link to={ROUTES.HOME} className="underline" onClick={() => {}}>
                        Home
                    </Link>
                </div>
            ) : (
                <GameRoom />
            )}
        </FreezeWrapper>
    );
};

export default OnlineGame;
