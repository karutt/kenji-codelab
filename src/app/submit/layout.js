export default function Layout({ children, modal }) {
    console.log(modal.props);
    return (
        <div>
            {children}
            <div>{modal}</div>
        </div>
    );
}
