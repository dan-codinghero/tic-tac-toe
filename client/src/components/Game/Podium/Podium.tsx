const Podium = ({ winner }: { winner: string | undefined }) => {
    return (
        <div className="py-6 flex flex-col text-center items-center justify-center">
            <span className={`${winner ? 'text-6xl' : 'text-6xl'} inline-block`}>{winner ? `${winner}` : 'Game'}</span>
            <span className="inline-block mt-2">{winner ? 'Winner' : 'Draw'}</span>
        </div>
    );
};

export default Podium;
