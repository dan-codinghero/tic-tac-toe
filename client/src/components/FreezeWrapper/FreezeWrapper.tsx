import React, { ReactElement } from 'react';

const FreezeWrapper = ({ children }: { children: ReactElement }) => {
    return <div className="min-h-screen flex items-center">{children}</div>;
};

export default FreezeWrapper;
