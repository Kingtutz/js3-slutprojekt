"use client";
type AppErrorProps = {
    error: Error;
};

function AppError({ error }: AppErrorProps) {
    return <div>Något gick fel: {error.message}</div>;
}
export default AppError;
